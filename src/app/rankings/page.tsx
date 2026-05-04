'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import CollegeCardSkeleton from '@/components/CollegeCardSkeleton';
import { College } from '@/types';
import { formatINR, formatLPA } from '@/lib/utils';

type RankCategory = 'overall' | 'engineering' | 'medical' | 'management' | 'law' | 'government' | 'private';

const CATEGORIES: { value: RankCategory; label: string; icon: string }[] = [
  { value: 'overall', label: 'Overall', icon: '🏆' },
  { value: 'engineering', label: 'Engineering', icon: '⚙️' },
  { value: 'medical', label: 'Medical', icon: '🩺' },
  { value: 'management', label: 'Management', icon: '📊' },
  { value: 'law', label: 'Law', icon: '⚖️' },
  { value: 'government', label: 'Government', icon: '🏛️' },
  { value: 'private', label: 'Private', icon: '🏢' },
];

function filterByCategory(colleges: College[], category: RankCategory): College[] {
  let filtered = [...colleges];
  switch (category) {
    case 'engineering': filtered = colleges.filter(c => c.courses.some(co => ['B.Tech', 'M.Tech', 'B.E', 'M.E'].includes(co))); break;
    case 'medical': filtered = colleges.filter(c => c.courses.some(co => ['MBBS', 'MD', 'MS'].includes(co))); break;
    case 'management': filtered = colleges.filter(c => c.courses.some(co => ['MBA', 'BBA'].includes(co))); break;
    case 'law': filtered = colleges.filter(c => c.courses.some(co => ['LLB', 'LLM'].includes(co))); break;
    case 'government': filtered = colleges.filter(c => c.type === 'GOVERNMENT'); break;
    case 'private': filtered = colleges.filter(c => c.type === 'PRIVATE'); break;
  }
  return filtered.sort((a, b) => b.rating - a.rating || b.placementPct - a.placementPct);
}

export default function RankingsPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<RankCategory>('overall');

  useEffect(() => {
    (async () => {
      try {
        const api = await import('@/lib/api');
        const d = await api.apiJson('/api/colleges?sort=rating&page=1');
        // Fetch all pages to get complete ranking
        const allColleges = d.colleges || [];
        if (d.totalPages > 1) {
          const pages = Array.from({ length: Math.min(d.totalPages, 5) - 1 }, (_, i) => i + 2);
          const rest = await Promise.all(pages.map(p => api.apiJson(`/api/colleges?sort=rating&page=${p}`)));
          rest.forEach(r => allColleges.push(...(r.colleges || [])));
        }
        setColleges(allColleges);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const ranked = filterByCategory(colleges, category);

  return (
    <div className="container-main py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Rankings' }]} />
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">College Rankings</h1>
        <p className="text-base text-[#64748B] max-w-lg mx-auto">India&apos;s top colleges ranked by rating, placements, and academic excellence</p>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {CATEGORIES.map(cat => (
          <button key={cat.value} onClick={() => setCategory(cat.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              category === cat.value ? 'bg-[#1E3A8A] text-white shadow-lg' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
            }`}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{Array(10).fill(0).map((_, i) => <CollegeCardSkeleton key={i} />)}</div>
      ) : ranked.length === 0 ? (
        <p className="text-center text-[#64748B] py-12">No colleges found in this category</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1E3A8A] text-white">
                <th className="p-3 text-center text-xs font-bold w-[60px]">Rank</th>
                <th className="p-3 text-left text-xs font-bold">College</th>
                <th className="p-3 text-center text-xs font-bold">Rating</th>
                <th className="p-3 text-center text-xs font-bold hidden md:table-cell">Type</th>
                <th className="p-3 text-center text-xs font-bold hidden md:table-cell">NAAC</th>
                <th className="p-3 text-center text-xs font-bold">Fees</th>
                <th className="p-3 text-center text-xs font-bold hidden lg:table-cell">Placement</th>
                <th className="p-3 text-center text-xs font-bold hidden lg:table-cell">Avg Pkg</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((c, i) => (
                <tr key={c.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'} hover:bg-[#EFF6FF] transition-colors`}>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      i === 0 ? 'bg-[#FEF9C3] text-[#92400E]' : i === 1 ? 'bg-[#F1F5F9] text-[#475569]' : i === 2 ? 'bg-[#FFF7ED] text-[#9A3412]' : 'text-[#64748B]'
                    }`}>
                      {i < 3 ? ['🥇', '🥈', '🥉'][i] : i + 1}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link href={`/colleges/${c.id}`} className="font-bold text-[#1E293B] hover:text-[#2563EB] no-underline">{c.name}</Link>
                    <div className="text-xs text-[#64748B] mt-0.5">{c.city}, {c.state}</div>
                  </td>
                  <td className="p-3 text-center"><span className="text-[#F97316] font-bold">★ {c.rating}</span></td>
                  <td className="p-3 text-center hidden md:table-cell">{c.type === 'GOVERNMENT' ? <span className="badge-green text-[10px]">Govt</span> : <span className="badge-red text-[10px]">Pvt</span>}</td>
                  <td className="p-3 text-center hidden md:table-cell"><span className="badge-blue text-[10px]">{c.naacGrade}</span></td>
                  <td className="p-3 text-center text-[#1E3A8A] font-medium">{formatINR(c.annualFees)}</td>
                  <td className="p-3 text-center hidden lg:table-cell text-[#16A34A] font-medium">{c.placementPct}%</td>
                  <td className="p-3 text-center hidden lg:table-cell text-[#2563EB] font-medium">{formatLPA(c.avgPackage)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6 text-center text-xs text-[#94A3B8]">Rankings based on CollegeFind rating algorithm — combines placements, faculty, infrastructure, and student feedback</div>
    </div>
  );
}
