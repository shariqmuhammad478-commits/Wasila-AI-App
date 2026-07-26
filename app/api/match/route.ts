import { NextRequest, NextResponse } from 'next/server';
import { callGroq, MATCH_SYSTEM_PROMPT } from '@/lib/ai';
import opportunities from '@/data/opportunities.json';
import type { StudentProfile, Opportunity } from '@/lib/types';

export const runtime = 'nodejs';

function preFilter(profile: StudentProfile): Opportunity[] {
  const list = opportunities as Opportunity[];
  // Loose pre-filter on degree level to keep the payload small & relevant.
  // We keep a generous margin (CGPA -0.5) since the model does the nuanced scoring.
  return list.filter((o) => {
    const degreeOk =
      o.degreeLevel.includes(profile.degreeLevel) ||
      o.degreeLevel.includes('Any');
    return degreeOk;
  });
}

export async function POST(req: NextRequest) {
  try {
    const profile: StudentProfile = await req.json();

    if (!profile.cgpa || !profile.degreeLevel || !profile.field) {
      return NextResponse.json(
        { error: 'Missing required profile fields.' },
        { status: 400 }
      );
    }

    const candidates = preFilter(profile);
    const pool = candidates.length > 0 ? candidates : (opportunities as Opportunity[]);

    const raw = await callGroq(
      MATCH_SYSTEM_PROMPT,
      JSON.stringify({ studentProfile: profile, opportunities: pool })
    );

    const cleaned = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return NextResponse.json(parsed);
  } catch (err: any) {
    console.error('Match API error:', err);
    return NextResponse.json(
      { error: err.message || 'Something went wrong while matching.' },
      { status: 500 }
    );
  }
}
