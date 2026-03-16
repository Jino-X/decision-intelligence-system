import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getUserDecisions } from '@/lib/firestore-admin';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decisions = await getUserDecisions(session.user.id);
    return NextResponse.json({ decisions }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch decisions:', error);
    return NextResponse.json({ error: 'Failed to fetch decisions' }, { status: 500 });
  }
}
