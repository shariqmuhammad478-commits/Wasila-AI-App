import { NextRequest, NextResponse } from 'next/server';
import { callGroq, LETTER_SYSTEM_PROMPT } from '@/lib/ai';
import opportunities from '@/data/opportunities.json';
import type { StudentProfile, Opportunity } from '@/lib/types';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { profile, opportunityId }: { profile: StudentProfile; opportunityId: string } =
      await req.json();

    const opp = (opportunities as Opportunity[]).find((o) => o.id === opportunityId);
    if (!opp) {
      return NextResponse.json({ error: 'Opportunity not found.' }, { status: 404 });
    }

    const raw = await callGroq(
      LETTER_SYSTEM_PROMPT,
      JSON.stringify({ studentProfile: profile, opportunity: opp })
    );

    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('Letter API error:', err);
    return NextResponse.json(
      { error: err.message || 'Something went wrong generating the letter.' },
      { status: 500 }
    );
  }
}
