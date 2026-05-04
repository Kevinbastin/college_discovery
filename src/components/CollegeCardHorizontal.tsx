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
    <div className="card-premium flex flex-col md:flex-row gap-4 p-4">
      {/* Left: Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link href={`/colleges/${college.id}`} className="no-underline">
            <h3 className="text-lg font-bold text-[#1E293B] hover:text-[#2563EB] transition-colors line-clamp-1">
              {college.name}
            </h3>
          </Link>
          {showChance && (
            <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded ${
              showChance === 'HIGH' ? 'bg-[#16A34A] text-white' :
              showChance === 'MODERATE' ? 'bg-[#EAB308] text-white' :
              'bg-[#DC2626] text-white'
            }`}>
              {showChance}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 text-sm text-[#64748B] mb-2 flex-wrap">
          <span className="flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {college.city}, {college.state}
          </span>
          <span className="flex items-center gap-1">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="#F97316" stroke="#F97316" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span className="font-bold text-[#F97316]">{college.rating}</span>
            <span className="text-xs text-[#94A3B8]">({college.reviewCount})</span>
          </span>
          {college.type === 'GOVERNMENT'
            ? <span className="badge-green">Govt</span>
            : <span className="badge-red">Private</span>
          }
          <span className="badge-blue">{college.naacGrade} NAAC</span>
        </div>

        <div className="flex flex-wrap gap-1 mb-2">
          {college.courses.slice(0, 4).map(c => (
            <span key={c} className="text-xs bg-[#F1F5F9] text-[#475569] px-2 py-0.5 rounded">{c}</span>
          ))}
          {college.courses.length > 4 && <span className="text-xs text-[#94A3B8]">+{college.courses.length - 4}</span>}
        </div>
      </div>

      {/* Right: Metrics + Actions */}
      <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-4 shrink-0">
        {/* Key metrics */}
        <div className="grid grid-cols-3 md:grid-cols-1 gap-2 text-center md:text-right md:min-w-[120px]">
          <div>
            <div className="text-lg font-bold text-[#1E3A8A]">{formatINR(college.annualFees)}</div>
            <div className="text-[10px] text-[#94A3B8]">per year</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#16A34A]">{college.placementPct}%</div>
            <div className="text-[10px] text-[#94A3B8]">placed</div>
          </div>
          <div>
            <div className="text-lg font-bold text-[#2563EB]">{formatLPA(college.avgPackage)}</div>
            <div className="text-[10px] text-[#94A3B8]">avg pkg</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex md:flex-col gap-2 md:justify-center md:min-w-[100px]">
          <Link href={`/colleges/${college.id}`} className="btn-primary text-sm flex-1 md:flex-none text-center no-underline">Details</Link>
          <button onClick={handleCompare}
            className={`flex-1 md:flex-none text-sm rounded h-[40px] font-semibold transition-all duration-200 px-3 ${
              isInCompare(college.id) ? 'bg-[#2563EB] text-white' : 'border-2 border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white'
            }`}>
            {isInCompare(college.id) ? '✓ Added' : 'Compare'}
          </button>
          <button onClick={handleSave}
            className="w-[40px] h-[40px] shrink-0 flex items-center justify-center rounded border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
            {isSaved ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#1E3A8A" stroke="#1E3A8A" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
