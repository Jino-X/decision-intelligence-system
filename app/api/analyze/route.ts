import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { auth } from '@/auth';
import { analyzeDecision } from '@/lib/openai';
import { saveDecision } from '@/lib/firestore-admin';

const inputsSchema = z.object({
  decisionType: z.enum(['job-switch', 'relocation', 'custom']),
  title: z.string().min(5).max(120),
  context: z.string().min(10).max(1000),
  currentSalary: z.number().positive().optional(),
  proposedSalary: z.number().positive().optional(),
  currentLocation: z.string().max(80).optional(),
  targetLocation: z.string().max(80).optional(),
  lifestyle: z.array(z.string()).optional(),
  priorities: z.array(z.string()).optional(),
  timeframe: z.string().optional(),
});

const requestSchema = z.object({
  inputs: inputsSchema,
  saveToHistory: z.boolean().optional().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    const body = await req.json();
    const parsed = requestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', message: parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const { inputs, saveToHistory } = parsed.data;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'Configuration error', message: 'OpenAI API key is not configured.' },
        { status: 503 }
      );
    }

    const results = await analyzeDecision(inputs);

    let decisionId: string | undefined;

    if (saveToHistory && session?.user?.id) {
      try {
        decisionId = await saveDecision(session.user.id, inputs, results);
      } catch {
        // Non-fatal: analysis succeeded even if save failed
      }
    }

    return NextResponse.json({ results, decisionId }, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed';
    return NextResponse.json({ error: 'Analysis failed', message }, { status: 500 });
  }
}
