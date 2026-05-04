'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useCompare } from '@/context/CompareContext';
import SearchModal from '@/components/SearchModal';
import RadarChart from '@/components/RadarChart';
import { College } from '@/types';
import { formatINR, formatLPA } from '@/lib/utils';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import toast from 'react-hot-toast';

const METRICS = [
  { key: 'city', label: 'Location', format: (c: College) => `${c.city}, ${c.state}` },
  { key: 'type', label: 'Type', format: (c: College) => c.type },
  { key: 'naacGrade', label: 'NAAC Grade', format: (c: College) => c.naacGrade },
  { key: 'establishedYear', label: 'Established', format: (c: College) => String(c.establishedYear) },
  { key: 'totalStudents', label: 'Total Students', format: (c: College) => c.totalStudents.toLocaleString() },
  { key: 'annualFees', label: 'Annual Fees', format: (c: College) => formatINR(c.annualFees), best: 'min' },
  { key: 'placementPct', label: 'Placement %', format: (c: College) => `${c.placementPct}%`, best: 'max' },
  { key: 'avgPackage', label: 'Avg Package', format: (c: College) => formatLPA(c.avgPackage), best: 'max' },
  { key: 'highestPackage', label: 'Highest Package', format: (c: College) => formatLPA(c.highestPackage), best: 'max' },
  { key: 'rating', label: 'Overall Rating', format: (c: College) => `★ ${c.rating}`, best: 'max' },
  { key: 'courses', label: 'Courses Count', format: (c: College) => String(c.courses.length) },
  { key: 'topRecruiters', label: 'Top Recruiters', format: (c: College) => c.topRecruiters.slice(0, 3).join(', ') },
  { key: 'coursesList', label: 'Courses Offered', format: (c: College) => c.courses.slice(0, 4).join(', ') },
];

export default function ComparePage() {
  const { compareList, addToCompare, removeFromCompare, clearCompare } = useCompare();
  const [modalSlot, setModalSlot] = useState<number | null>(null);
  const { data: session } = useSession();
  const [saving, setSaving] = useState(false);

  const getBestIndex = (key: string, type: string) => {
    if (compareList.length < 2) return -1;
    const vals = compareList.map(c => {
      if (key === 'annualFees') return c.annualFees;
      if (key === 'placementPct') return c.placementPct;
      if (key === 'avgPackage') return c.avgPackage;
      if (key === 'highestPackage') return c.highestPackage;
      if (key === 'rating') return c.rating;
      return 0;
    });
    if (type === 'min') return vals.indexOf(Math.min(...vals));
    return vals.indexOf(Math.max(...vals));
  };

  // Generate verdict
  const generateVerdict = () => {
    if (compareList.length < 2) return [];
    const verdicts: string[] = [];
    const names = compareList.map(c => c.shortName);

    // Best value (lowest fees)
    const feesArr = compareList.map(c => c.annualFees);
    const cheapest = compareList[feesArr.indexOf(Math.min(...feesArr))];
    verdicts.push(`💰 **Best Value:** ${cheapest.shortName} has the lowest fees at ${formatINR(cheapest.annualFees)}/yr`);

    // Best placements
    const placementArr = compareList.map(c => c.placementPct);
    const bestPlacement = compareList[placementArr.indexOf(Math.max(...placementArr))];
    verdicts.push(`📈 **Best Placements:** ${bestPlacement.shortName} leads with ${bestPlacement.placementPct}% placement rate`);

    // Highest package
    const pkgArr = compareList.map(c => c.avgPackage);
    const bestPkg = compareList[pkgArr.indexOf(Math.max(...pkgArr))];
    verdicts.push(`💼 **Highest Avg Package:** ${bestPkg.shortName} at ${formatLPA(bestPkg.avgPackage)}`);

    // Best rated
    const ratingArr = compareList.map(c => c.rating);
    const bestRated = compareList[ratingArr.indexOf(Math.max(...ratingArr))];
    verdicts.push(`⭐ **Highest Rated:** ${bestRated.shortName} with ${bestRated.rating}/5 rating`);

    return verdicts;
  };

  const handleShareComparison = () => {
    const names = compareList.map(c => c.shortName).join(' vs ');
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: `Compare: ${names}`, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Comparison link copied!', { icon: '📋' });
    }
  };

  const slots = [0, 1, 2];

  const handleSaveComparison = async () => {
    if (!session) {
      toast.error('Please login to save comparisons', { icon: '🔒' });
      return;
    }
    if (compareList.length < 2) {
      toast.error('Add at least 2 colleges to save', { icon: '⚠️' });
      return;
    }

    setSaving(true);
    try {
      const api = await import('@/lib/api');
      const res = await api.apiFetch('/api/comparisons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collegeIds: compareList.map(c => c.id) }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to save comparison');
      } else {
        toast.success('Comparison saved');
      }
    } catch {
      toast.error('Failed to save comparison');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-main py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Compare' }]} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-[#1E293B]">Compare Colleges</h1>
          <p className="text-sm text-[#64748B] mt-1">Side-by-side comparison with best-value highlighting</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {compareList.length >= 2 && (
            <>
              <button onClick={handleShareComparison} className="btn-outlined text-sm !h-[36px] !px-3 flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                Share
              </button>
              <button onClick={handleSaveComparison} disabled={saving} className="btn-primary text-sm !h-[36px]">
                {saving ? 'Saving...' : '💾 Save'}
              </button>
            </>
          )}
          {compareList.length > 0 && <button onClick={clearCompare} className="btn-danger text-sm">Clear All</button>}
        </div>
      </div>

      {/* Slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {slots.map(i => {
          const college = compareList[i];
          return college ? (
            <div key={college.id} className="card-premium p-4 relative">
              <button onClick={() => removeFromCompare(college.id)} className="absolute top-2 right-2 text-[#94A3B8] hover:text-[#DC2626] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
              </button>
              <h3 className="font-bold text-lg text-[#1E293B] pr-6">{college.name}</h3>
              <p className="text-sm text-[#64748B]">{college.city}, {college.state}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-sm font-bold text-[#F97316]">★ {college.rating}</span>
                {college.type === 'GOVERNMENT' ? <span className="badge-green text-[10px]">Govt</span> : <span className="badge-red text-[10px]">Pvt</span>}
                <span className="badge-blue text-[10px]">{college.naacGrade}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#E2E8F0]">
                <div className="text-center">
                  <div className="text-xs text-[#64748B]">Fees</div>
                  <div className="text-xs font-bold text-[#1E3A8A]">{formatINR(college.annualFees)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-[#64748B]">Placed</div>
                  <div className="text-xs font-bold text-[#16A34A]">{college.placementPct}%</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-[#64748B]">Avg Pkg</div>
                  <div className="text-xs font-bold text-[#2563EB]">{formatLPA(college.avgPackage)}</div>
                </div>
              </div>
            </div>
          ) : (
            <button key={i} onClick={() => setModalSlot(i)}
              className="border-2 border-dashed border-[#CBD5E1] rounded-lg p-8 text-center hover:border-[#2563EB] hover:bg-[#F8FAFC] transition-all">
              <div className="text-3xl text-[#CBD5E1] mb-2">+</div>
              <div className="text-sm text-[#94A3B8] font-medium">{i === 2 ? 'Add a 3rd College' : 'Add College'}</div>
            </button>
          );
        })}
      </div>

      {/* Radar Chart */}
      {compareList.length >= 2 && (
        <div className="mb-8">
          <RadarChart colleges={compareList} />
        </div>
      )}

      {/* Verdict */}
      {compareList.length >= 2 && (
        <div className="card-premium p-6 mb-8">
          <h3 className="font-bold text-lg text-[#1E293B] mb-4 flex items-center gap-2">
            <span className="text-xl">🏆</span> Quick Verdict
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {generateVerdict().map((v, i) => (
              <div key={i} className="bg-[#F8FAFC] rounded-lg p-3 text-sm text-[#475569]">
                {v.replace(/\*\*(.*?)\*\*/g, '$1')}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comparison Table */}
      {compareList.length >= 2 && (
        <div className="overflow-x-auto rounded-lg border border-[#E2E8F0]">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1E3A8A]">
                <th className="text-left p-3 text-white font-bold text-xs min-w-[150px] sticky left-0 bg-[#1E3A8A] z-10">Metric</th>
                {compareList.map(c => (
                  <th key={c.id} className="text-center p-3 text-white font-bold text-xs min-w-[180px]">{c.shortName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {METRICS.map((m, rowIdx) => {
                const bestIdx = m.best ? getBestIndex(m.key, m.best) : -1;
                return (
                  <tr key={m.key} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}>
                    <td className="p-3 font-medium text-[#475569] sticky left-0 bg-inherit z-10 border-r border-[#E2E8F0]">{m.label}</td>
                    {compareList.map((c, colIdx) => (
                      <td key={c.id} className={`p-3 text-center font-medium ${colIdx === bestIdx ? 'bg-[#F0FDF4] text-[#16A34A] font-bold' : 'text-[#1E293B]'}`}>
                        {m.format(c)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#E2E8F0]">
                <td className="p-3 sticky left-0 bg-white z-10" />
                {compareList.map(c => (
                  <td key={c.id} className="p-3 text-center">
                    <Link href={`/colleges/${c.id}`} className="text-[#2563EB] text-sm font-medium hover:underline no-underline">View Details</Link>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {compareList.length < 2 && (
        <div className="text-center py-12 text-[#94A3B8]">
          <p className="text-lg">Add at least 2 colleges to compare</p>
          <p className="text-sm mt-1">Click the + cards above or use the Compare button on college cards</p>
        </div>
      )}

      <SearchModal isOpen={modalSlot !== null} onClose={() => setModalSlot(null)} onSelect={(c) => { addToCompare(c); setModalSlot(null); }} />
    </div>
  );
}
