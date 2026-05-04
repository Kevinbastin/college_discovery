import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const exam = searchParams.get('exam');
    const rankStr = searchParams.get('rank');
    const category = searchParams.get('category') || 'General';

    if (!exam || !['JEE_MAIN', 'JEE_ADVANCED', 'NEET', 'CAT', 'GATE'].includes(exam)) {
      return NextResponse.json({ error: 'Validation failed', details: { exam: 'Must be JEE_MAIN, JEE_ADVANCED, NEET, CAT, or GATE' } }, { status: 400 });
    }
    if (!rankStr || isNaN(parseInt(rankStr)) || parseInt(rankStr) <= 0) {
      return NextResponse.json({ error: 'Validation failed', details: { rank: 'Must be a positive integer' } }, { status: 400 });
    }

    const rank = parseInt(rankStr);
    const allColleges = await prisma.college.findMany();

    const results = allColleges
      .filter(c => {
        const cutoffs = c.cutoffRanks as Record<string, number>;
        return cutoffs && cutoffs[exam] !== undefined;
      })
      .map(c => {
        const cutoffs = c.cutoffRanks as Record<string, number>;
        const cutoff = cutoffs[exam];
        let chance: 'HIGH' | 'MODERATE' | 'LOW';

        if (exam === 'CAT') {
          // Higher percentile is better
          if (rank >= cutoff) chance = 'HIGH';
          else if (rank >= cutoff * 0.95) chance = 'MODERATE';
          else if (rank >= cutoff * 0.9) chance = 'LOW';
          else return null;
        } else if (exam === 'NEET') {
          // Lower rank is better for NEET
          if (rank <= cutoff) chance = 'HIGH';
          else if (rank <= cutoff * 1.2) chance = 'MODERATE';
          else if (rank <= cutoff * 1.5) chance = 'LOW';
          else return null;
        } else if (exam === 'JEE_ADVANCED') {
          if (rank <= cutoff) chance = 'HIGH';
          else if (rank <= cutoff * 1.1) chance = 'MODERATE';
          else if (rank <= cutoff * 1.3) chance = 'LOW';
          else return null;
        } else if (exam === 'GATE') {
          // Higher score is better
          if (rank >= cutoff) chance = 'HIGH';
          else if (rank >= cutoff * 0.9) chance = 'MODERATE';
          else if (rank >= cutoff * 0.8) chance = 'LOW';
          else return null;
        } else {
          // JEE_MAIN - lower rank is better
          if (rank <= cutoff) chance = 'HIGH';
          else if (rank <= cutoff * 1.2) chance = 'MODERATE';
          else if (rank <= cutoff * 1.5) chance = 'LOW';
          else return null;
        }

        return { ...c, chance, cutoffRank: cutoff };
      })
      .filter(Boolean)
      .sort((a, b) => {
        const order = { HIGH: 0, MODERATE: 1, LOW: 2 };
        return order[a!.chance] - order[b!.chance];
      });

    return NextResponse.json({ colleges: results });
  } catch (error) {
    console.error('Predict error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
