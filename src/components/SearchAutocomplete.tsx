'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { College } from '@/types';

export default function SearchAutocomplete({ className }: { className?: string }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<College[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) { setResults([]); setOpen(false); return; }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const api = await import('@/lib/api');
        const d = await api.apiJson(`/api/colleges?search=${encodeURIComponent(query)}&page=1&sort=rating`);
        setResults((d.colleges || []).slice(0, 6));
        setOpen(true);
      } catch { setResults([]); }
      setLoading(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (college: College) => {
    setOpen(false);
    setQuery('');
    router.push(`/colleges/${college.id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIdx >= 0 && results[selectedIdx]) handleSelect(results[selectedIdx]);
      else if (query.trim()) { setOpen(false); router.push(`/colleges?search=${encodeURIComponent(query.trim())}`); }
    }
    else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className || ''}`}>
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input ref={inputRef} type="text" value={query} onChange={e => { setQuery(e.target.value); setSelectedIdx(-1); }}
          onKeyDown={handleKeyDown} onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Search colleges, cities, or states..."
          className="w-full h-[56px] pl-12 pr-12 text-base bg-white rounded-xl shadow-modal border-0 focus:outline-none focus:ring-2 focus:ring-[#60A5FA] text-[#1E293B] placeholder:text-[#94A3B8]" />
        {loading && <div className="absolute right-4 top-1/2 -translate-y-1/2"><div className="w-5 h-5 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" /></div>}
        {!loading && query.length > 0 && (
          <button onClick={() => { setQuery(''); setResults([]); setOpen(false); inputRef.current?.focus(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-modal border border-[#E2E8F0] overflow-hidden z-50 animate-scale-in">
          {results.map((c, i) => (
            <button key={c.id} onClick={() => handleSelect(c)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#F8FAFC] transition-colors ${
                i === selectedIdx ? 'bg-[#EFF6FF]' : ''
              } ${i > 0 ? 'border-t border-[#F1F5F9]' : ''}`}>
              <div className="w-10 h-10 rounded-lg bg-[#1E3A8A] text-white flex items-center justify-center text-sm font-bold shrink-0">
                {c.shortName.slice(0, 2).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-[#1E293B] truncate">{c.name}</div>
                <div className="text-xs text-[#64748B]">{c.city}, {c.state} • ★ {c.rating}</div>
              </div>
              <div className="text-right shrink-0">
                {c.type === 'GOVERNMENT' ? <span className="badge-green text-[9px]">Govt</span> : <span className="badge-red text-[9px]">Pvt</span>}
              </div>
            </button>
          ))}
          <button onClick={() => { setOpen(false); router.push(`/colleges?search=${encodeURIComponent(query)}`); }}
            className="w-full px-4 py-2.5 text-center text-xs text-[#2563EB] font-medium bg-[#F8FAFC] hover:bg-[#EFF6FF] border-t border-[#E2E8F0]">
            View all results for &ldquo;{query}&rdquo; →
          </button>
        </div>
      )}

      {open && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-modal border border-[#E2E8F0] p-6 text-center z-50">
          <div className="text-2xl mb-2">🔍</div>
          <div className="text-sm text-[#64748B]">No colleges found for &ldquo;{query}&rdquo;</div>
        </div>
      )}
    </div>
  );
}
