import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const state = searchParams.get('state') || '';
    const type = searchParams.get('type') || '';
    const minFees = searchParams.get('minFees');
    const maxFees = searchParams.get('maxFees');
    const naac = searchParams.get('naac') || '';
    const minRating = searchParams.get('minRating');
    const courses = searchParams.get('courses') || '';
    const exams = searchParams.get('exams') || '';
    const established = searchParams.get('established') || '';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const sort = searchParams.get('sort') || 'rating';
    const limit = 12;

    // Special: return all distinct states for the filter sidebar
    if (searchParams.get('distinct') === 'states') {
      const states = await prisma.college.findMany({
        select: { state: true },
        distinct: ['state'],
        orderBy: { state: 'asc' },
      });
      return NextResponse.json({ states: states.map(s => s.state) });
    }

    const where: Prisma.CollegeWhereInput = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortName: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (state) where.state = state;
    if (type === 'GOVERNMENT' || type === 'PRIVATE') where.type = type;
    if (minFees) where.annualFees = { ...((where.annualFees as any) || {}), gte: parseInt(minFees) };
    if (maxFees) where.annualFees = { ...((where.annualFees as any) || {}), lte: parseInt(maxFees) };
    if (naac) where.naacGrade = { in: naac.split(',') };
    if (minRating) where.rating = { gte: parseFloat(minRating) };
    if (courses) where.courses = { hasSome: courses.split(',') };
    if (established) {
      if (established === 'before_1960') where.establishedYear = { lt: 1960 };
      else if (established === '1960_1990') where.establishedYear = { gte: 1960, lte: 1990 };
      else if (established === '1990_2010') where.establishedYear = { gte: 1990, lte: 2010 };
      else if (established === 'after_2010') where.establishedYear = { gt: 2010 };
    }

    // Exam filter: filter by cutoffRanks JSON keys
    // cutoffRanks is stored as JSON like {"JEE_MAIN": 5000, "NEET": 100}
    // We need colleges where the cutoffRanks object contains at least one of the specified exam keys
    if (exams) {
      const examList = exams.split(',');
      // Use Prisma's JSON path filter: check if the key exists and is not null
      where.AND = [
        ...(Array.isArray((where as any).AND) ? (where as any).AND : []),
        {
          OR: examList.map(exam => ({
            cutoffRanks: {
              path: [exam],
              not: Prisma.DbNull,
            },
          })),
        },
      ];
    }

    const orderBy: Prisma.CollegeOrderByWithRelationInput = 
      sort === 'fees_asc' ? { annualFees: 'asc' } :
      sort === 'fees_desc' ? { annualFees: 'desc' } :
      sort === 'name' ? { name: 'asc' } :
      sort === 'newest' ? { createdAt: 'desc' } :
      { rating: 'desc' };

    const [colleges, total] = await Promise.all([
      prisma.college.findMany({ where, orderBy, skip: (page - 1) * limit, take: limit }),
      prisma.college.count({ where }),
    ]);

    return NextResponse.json({
      colleges,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Colleges API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
