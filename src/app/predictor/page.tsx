'use client';
import { useState } from 'react';
import CollegeCard from '@/components/CollegeCard';
import CollegeCardSkeleton from '@/components/CollegeCardSkeleton';
import EmptyState from '@/components/EmptyState';
import Breadcrumb from '@/components/Breadcrumb';
import { CollegeWithChance, ExamType, CategoryType } from '@/types';

const EXAMS: { value: ExamType; label: string; description: string }[] = [
  { value: 'JEE_MAIN', label: 'JEE Main', description: 'For NITs, IIITs, and other engineering colleges' },
  { value: 'JEE_ADVANCED', label: 'JEE Advanced', description: 'For IITs — India\'s top engineering institutes' },
  { value: 'NEET', label: 'NEET', description: 'For MBBS, BDS, and medical colleges' },
  { value: 'CAT', label: 'CAT', description: 'For IIMs and top MBA programs' },
  { value: 'GATE', label: 'GATE', description: 'For M.Tech programs and PSU recruitment' },
];

const CATEGORIES: { value: CategoryType; label: string }[] = [
  { value: 'General', label: 'General' },
  { value: 'OBC', label: 'OBC (Non-Creamy)' },
  { value: 'SC', label: 'SC' },
  { value: 'ST', label: 'ST' },
  { value: 'EWS', label: 'EWS' },
];

export default function PredictorPage() {
  const [exam, setExam] = useState<ExamType | ''>('');
  const [rank, setRank] = useState('');
  const [category, setCategory] = useState<CategoryType>('General');
  const [results, setResults] = useState<CollegeWithChance[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [chanceFilter, setChanceFilter] = useState<string>('all');

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exam || !rank) return;
    setLoading(true);
    setSearched(true);
    setChanceFilter('all');
    try {
      const res = await fetch(`/api/predict?exam=${exam}&rank=${rank}&category=${category}`);
      const data = await res.json();
      setResults(data.colleges || []);
    } catch { setResults([]); }
    setLoading(false);
  };

  const highCount = results.filter(c => c.chance === 'HIGH').length;
  const moderateCount = results.filter(c => c.chance === 'MODERATE').length;
  const lowCount = results.filter(c => c.chance === 'LOW').length;

  const filteredResults = chanceFilter === 'all'
    ? results
    : results.filter(c => c.chance === chanceFilter);

  const handleShareResults = () => {
    const url = `${window.location.origin}/predictor?exam=${exam}&rank=${rank}&category=${category}`;
    navigator.clipboard.writeText(url);
    import('react-hot-toast').then(m => m.default.success('Results link copied!', { icon: '📋' }));
  };

  return (
    <div className="container-main py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Predictor' }]} />

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-[#EFF6FF] text-[#2563EB] rounded-full px-4 py-1.5 mb-4 text-xs font-medium">
          <span>🎯</span> AI-Powered College Prediction
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">College Predictor</h1>
        <p className="text-base text-[#64748B] max-w-lg mx-auto">Enter your exam and rank to see which colleges you can get into — with High, Moderate, or Low chance indicators</p>
      </div>

      {/* Form */}
      <form onSubmit={handlePredict} className="card-premium p-6 max-w-[600px] mx-auto mb-8">
        {/* Exam Selection */}
        <div className="mb-4">
          <label className="text-xs font-bold text-[#475569] mb-2 block">Select Exam</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {EXAMS.map(e => (
              <button key={e.value} type="button" onClick={() => setExam(e.value)}
                className={`text-left p-3 rounded-lg border-2 transition-all duration-200 ${
                  exam === e.value
                    ? 'border-[#2563EB] bg-[#EFF6FF]'
                    : 'border-[#E2E8F0] hover:border-[#CBD5E1]'
                }`}>
                <div className="text-sm font-bold text-[#1E293B]">{e.label}</div>
                <div className="text-[11px] text-[#64748B] mt-0.5">{e.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Rank + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-[#475569] mb-1 block">Your Rank / Percentile</label>
            <input type="number" value={rank} onChange={e => setRank(e.target.value)}
              placeholder="e.g., 15000" className="input-field" />
          </div>
          <div>
            <label className="text-xs font-bold text-[#475569] mb-1 block">Category</label>
            <select value={category} onChange={e => setCategory(e.target.value as CategoryType)}
              className="input-field">
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <button type="submit" disabled={!exam || !rank || loading}
          className="btn-primary w-full !h-[48px] relative overflow-hidden">
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="animate-spin">⟳</span> Analyzing...
            </div>
          ) : 'Predict My Colleges'}
        </button>
      </form>

      {/* Pre-search state */}
      {!searched && (
        <EmptyState icon="📊" title="Enter your details above" description="Select an exam and enter your rank to see which colleges match" />
      )}

      {/* Results */}
      {searched && !loading && results.length === 0 && (
        <EmptyState icon="😕" title="No colleges found" description="No colleges found for this rank. Try a different exam or higher rank." />
      )}

      {searched && !loading && results.length > 0 && (
        <>
          {/* Summary badges */}
          <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setChanceFilter('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  chanceFilter === 'all' ? 'bg-[#1E3A8A] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
                }`}>
                All ({results.length})
              </button>
              {highCount > 0 && (
                <button onClick={() => setChanceFilter('HIGH')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    chanceFilter === 'HIGH' ? 'bg-[#16A34A] text-white' : 'chance-high text-[#16A34A] hover:shadow-sm'
                  }`}>
                  🟢 High ({highCount})
                </button>
              )}
              {moderateCount > 0 && (
                <button onClick={() => setChanceFilter('MODERATE')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    chanceFilter === 'MODERATE' ? 'bg-[#EAB308] text-white' : 'chance-moderate text-[#92400E] hover:shadow-sm'
                  }`}>
                  🟡 Moderate ({moderateCount})
                </button>
              )}
              {lowCount > 0 && (
                <button onClick={() => setChanceFilter('LOW')}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    chanceFilter === 'LOW' ? 'bg-[#DC2626] text-white' : 'chance-low text-[#DC2626] hover:shadow-sm'
                  }`}>
                  🔴 Low ({lowCount})
                </button>
              )}
            </div>
            <button onClick={handleShareResults}
              className="text-sm text-[#2563EB] font-medium hover:underline flex items-center gap-1">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
              Share Results
            </button>
          </div>

          <p className="text-sm text-[#64748B] mb-4">Showing {filteredResults.length} of {results.length} colleges</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResults.map(c => <CollegeCard key={c.id} college={c} showChance={c.chance} />)}
          </div>
        </>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6).fill(0).map((_, i) => <CollegeCardSkeleton key={i} />)}
        </div>
      )}
    </div>
  );
}
