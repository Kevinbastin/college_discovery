'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CollegeCard from '@/components/CollegeCard';
import CollegeCardHorizontal from '@/components/CollegeCardHorizontal';
import CollegeCardSkeleton from '@/components/CollegeCardSkeleton';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import CompareBar from '@/components/CompareBar';
import Breadcrumb from '@/components/Breadcrumb';
import EmptyState from '@/components/EmptyState';
import { College, ViewMode } from '@/types';
import { useSession } from 'next-auth/react';

function CollegesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();

  const [colleges, setColleges] = useState<College[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const filters = {
    search: searchParams.get('search') || '',
    state: searchParams.get('state') || '',
    type: searchParams.get('type') || '',
    minFees: searchParams.get('minFees') || '',
    maxFees: searchParams.get('maxFees') || '',
    naac: searchParams.get('naac') ? searchParams.get('naac')!.split(',') : [],
    minRating: searchParams.get('minRating') || '',
    courses: searchParams.get('courses') ? searchParams.get('courses')!.split(',') : [],
    exams: searchParams.get('exams') ? searchParams.get('exams')!.split(',') : [],
    established: searchParams.get('established') || '',
    page: parseInt(searchParams.get('page') || '1'),
    sort: searchParams.get('sort') || 'rating',
  };

  const [searchInput, setSearchInput] = useState(filters.search);

  const updateURL = useCallback((newFilters: Record<string, any>) => {
    const params = new URLSearchParams();
    Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) params.set(key, value.join(','));
      else if (value && value !== '1' && key !== 'page') params.set(key, String(value));
      else if (key === 'page' && Number(value) > 1) params.set(key, String(value));
    });
    router.push(`/colleges?${params.toString()}`, { scroll: false });
  }, [filters, router]);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.state) params.set('state', filters.state);
    if (filters.type) params.set('type', filters.type);
    if (filters.minFees) params.set('minFees', filters.minFees);
    if (filters.maxFees) params.set('maxFees', filters.maxFees);
    if (filters.naac.length) params.set('naac', filters.naac.join(','));
    if (filters.minRating) params.set('minRating', filters.minRating);
    if (filters.courses.length) params.set('courses', filters.courses.join(','));
    if (filters.exams.length) params.set('exams', filters.exams.join(','));
    if (filters.established) params.set('established', filters.established);
    params.set('page', String(filters.page));
    params.set('sort', filters.sort);

    try {
      const api = await import('@/lib/api');
      const data = await api.apiJson(`/api/colleges?${params.toString()}`);
      setColleges(data.colleges || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch { setColleges([]); }
    setLoading(false);
  }, [searchParams]);

  useEffect(() => { fetchColleges(); }, [fetchColleges]);

  useEffect(() => {
    (async () => {
      try {
        const api = await import('@/lib/api');
        const d = await api.apiJson('/api/colleges?page=1&sort=name');
        const uniqueStates = [...new Set((d.colleges || []).map((c: College) => c.state))].sort() as string[];
        setStates(uniqueStates);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (session) {
      (async () => {
        try {
          const api = await import('@/lib/api');
          const d = await api.apiJson('/api/saved');
          setSavedIds((d.saved || []).map((c: College) => c.id));
        } catch {}
      })();
    }
  }, [session]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) updateURL({ search: searchInput, page: 1 });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleFilterChange = (newValues: any) => {
    updateURL({ ...newValues, page: 1 });
  };

  const clearFilters = () => {
    router.push('/colleges');
    setSearchInput('');
  };

  return (
    <div className="container-main py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Colleges' }]} />

      {/* Search bar */}
      <div className="relative mb-4">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
          placeholder="Search colleges, cities, or states..."
          className="input-field !pl-11 !h-[48px]" />
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-[260px] shrink-0">
          <FilterSidebar
            values={{ state: filters.state, type: filters.type, minFees: filters.minFees, maxFees: filters.maxFees, naac: filters.naac, minRating: filters.minRating, courses: filters.courses, exams: filters.exams, established: filters.established }}
            onChange={handleFilterChange} onClear={clearFilters} states={states} />
        </div>

        {/* Mobile Filter Button */}
        <button onClick={() => setMobileFiltersOpen(true)}
          className="lg:hidden fixed bottom-4 left-4 z-30 btn-primary shadow-modal flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          Filters
        </button>

        {/* Mobile Filter Sheet */}
        {mobileFiltersOpen && (
          <>
            <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileFiltersOpen(false)} />
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl max-h-[70vh] overflow-y-auto p-4 lg:hidden animate-slide-up">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} className="p-1">✕</button>
              </div>
              <FilterSidebar
                values={{ state: filters.state, type: filters.type, minFees: filters.minFees, maxFees: filters.maxFees, naac: filters.naac, minRating: filters.minRating, courses: filters.courses, exams: filters.exams, established: filters.established }}
                onChange={(v) => { handleFilterChange(v); setMobileFiltersOpen(false); }} onClear={() => { clearFilters(); setMobileFiltersOpen(false); }} states={states} />
            </div>
          </>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4 gap-3">
            <span className="text-sm text-[#64748B]">{total} colleges found</span>
            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="hidden md:flex items-center border border-[#E2E8F0] rounded overflow-hidden">
                <button onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[#2563EB] text-white' : 'text-[#64748B] hover:bg-[#F1F5F9]'}`}
                  title="Grid view">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
                  </svg>
                </button>
                <button onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[#2563EB] text-white' : 'text-[#64748B] hover:bg-[#F1F5F9]'}`}
                  title="List view">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
                  </svg>
                </button>
              </div>

              <select value={filters.sort} onChange={e => updateURL({ sort: e.target.value, page: 1 })}
                className="input-field !w-auto !h-[36px] text-sm">
                <option value="rating">Rating</option>
                <option value="fees_asc">Fees Low→High</option>
                <option value="fees_desc">Fees High→Low</option>
                <option value="name">Name A-Z</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array(12).fill(0).map((_, i) => <CollegeCardSkeleton key={i} />)}
            </div>
          ) : colleges.length === 0 ? (
            <EmptyState icon="🔍" title="No colleges found" description="Try adjusting your filters or search query" actionLabel="Clear Filters" onAction={clearFilters} />
          ) : (
            <>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {colleges.map(c => <CollegeCard key={c.id} college={c} savedIds={savedIds} />)}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {colleges.map(c => <CollegeCardHorizontal key={c.id} college={c} savedIds={savedIds} />)}
                </div>
              )}
              <Pagination currentPage={filters.page} totalPages={totalPages} totalItems={total} itemsPerPage={12}
                onPageChange={(p) => { updateURL({ page: p }); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
            </>
          )}
        </div>
      </div>

      <CompareBar />
    </div>
  );
}

export default function CollegesPage() {
  return (
    <Suspense fallback={<div className="container-main py-6"><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">{Array(12).fill(0).map((_, i) => <CollegeCardSkeleton key={i} />)}</div></div>}>
      <CollegesContent />
    </Suspense>
  );
}
