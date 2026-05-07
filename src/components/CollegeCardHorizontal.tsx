'use client';
import Link from 'next/link';
import { College } from '@/types';
import { formatINR, formatLPA } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useCompare } from '@/context/CompareContext';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Props {
  college: College;
  savedIds?: string[];
  onToggleSave?: (id: string, saved: boolean) => void;
  showChance?: string;
}

export default function CollegeCardHorizontal({ college, savedIds = [], onToggleSave, showChance }: Props) {
  const { data: session } = useSession();
  const { addToCompare, isInCompare } = useCompare();
  const [isSaved, setIsSaved] = useState(savedIds.includes(college.id));

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) {
      toast.error('Please login to save colleges', { icon: '🔒' });
      return;
    }
    const wasSaved = isSaved;
    setIsSaved(!wasSaved);
    try {
      if (wasSaved) {
        await (await import('@/lib/api')).apiFetch(`/api/saved/${college.id}`, { method: 'DELETE' });
        toast.success('Removed from saved');
      } else {
        await (await import('@/lib/api')).apiFetch('/api/saved', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ collegeId: college.id }) });
        toast.success('Saved to your list', { icon: '✓' });
      }
      onToggleSave?.(college.id, !wasSaved);
    } catch {
      setIsSaved(wasSaved);
      toast.error('Something went wrong');
    }
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(college);
  };

  return (
    <div className="card-enterprise flex flex-col md:flex-row gap-4 p-5">
      {/* Left: Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <Link href={`/colleges/${college.id}`} className="no-underline">
            <h3 className="text-lg font-bold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-1">
              {college.name}
            </h3>
          </Link>
          {showChance && (
            <span className={`shrink-0 ${
              showChance === 'HIGH' ? 'badge-green' :
              showChance === 'MODERATE' ? 'badge-yellow' :
              'badge-red'
            }`}>
              {showChance}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-slate-500 mb-2.5 flex-wrap">
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {college.city}, {college.state}
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span className="font-bold text-amber-600">{college.rating}</span>
            <span className="text-xs text-slate-400">({college.reviewCount})</span>
          </span>
          {college.type === 'GOVERNMENT'
            ? <span className="badge-green">Govt</span>
            : <span className="badge-gray">Private</span>
          }
          <span className="badge-blue">{college.naacGrade} NAAC</span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-2">
          {college.courses.slice(0, 4).map(c => (
            <span key={c} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-medium">{c}</span>
          ))}
          {college.courses.length > 4 && <span className="text-xs text-slate-400 self-center">+{college.courses.length - 4}</span>}
        </div>
      </div>

      {/* Right: Metrics + Actions */}
      <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-4 shrink-0">
        {/* Key metrics */}
        <div className="grid grid-cols-3 md:grid-cols-1 gap-2 text-center md:text-right md:min-w-[120px]">
          <div>
            <div className="text-lg font-bold text-indigo-700">{formatINR(college.annualFees)}</div>
            <div className="text-[10px] text-slate-400 font-medium">per year</div>
          </div>
          <div>
            <div className="text-lg font-bold text-success-600">{college.placementPct}%</div>
            <div className="text-[10px] text-slate-400 font-medium">placed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-info-600">{formatLPA(college.avgPackage)}</div>
            <div className="text-[10px] text-slate-400 font-medium">avg pkg</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex md:flex-col gap-2 md:justify-center md:min-w-[100px]">
          <Link href={`/colleges/${college.id}`} className="btn-primary text-sm flex-1 md:flex-none text-center no-underline">Details</Link>
          <button onClick={handleCompare}
            className={`flex-1 md:flex-none text-sm rounded-lg h-[40px] font-semibold transition-all duration-200 px-3 ${
              isInCompare(college.id) ? 'bg-indigo-600 text-white shadow-button' : 'border-2 border-indigo-400 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-500'
            }`}>
            {isInCompare(college.id) ? '✓ Added' : 'Compare'}
          </button>
          <button onClick={handleSave}
            className="w-[40px] h-[40px] shrink-0 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 transition-all">
            {isSaved ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#4F46E5" stroke="#4F46E5" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
