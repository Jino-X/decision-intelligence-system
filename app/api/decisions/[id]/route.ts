import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getDecision, deleteDecision } from '@/lib/firestore-admin';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const decision = await getDecision(id);

    if (!decision) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (decision.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ decision }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch decision' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const decision = await getDecision(id);

    if (!decision) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    if (decision.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await deleteDecision(id);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to delete decision' }, { status: 500 });
  }
}
