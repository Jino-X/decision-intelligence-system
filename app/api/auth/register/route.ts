import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    const firebaseApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!firebaseApiKey) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    // Create user in Firebase Auth via REST API
    const signUpRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${firebaseApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );

    const signUpData = await signUpRes.json();

    if (!signUpRes.ok) {
      const errorCode = signUpData?.error?.message as string;
      if (errorCode === 'EMAIL_EXISTS') {
        return NextResponse.json({ error: 'Email already in use', message: 'An account with this email already exists.' }, { status: 409 });
      }
      return NextResponse.json({ error: 'Registration failed', message: 'Could not create account. Please try again.' }, { status: 400 });
    }

    const idToken: string = signUpData.idToken;

    // Update display name
    await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${firebaseApiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken, displayName: name }),
      }
    );

    return NextResponse.json({ success: true, message: 'Account created successfully.' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
