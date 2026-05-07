'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CollegeCard from '@/components/CollegeCard';
import CollegeCardSkeleton from '@/components/CollegeCardSkeleton';
import StatsCounter from '@/components/StatsCounter';
import TestimonialCard from '@/components/TestimonialCard';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import { College, Testimonial, CategoryCard, TrendingExam } from '@/types';

const quickFilters = [
  { label: 'Engineering', icon: '⚙️', color: 'from-indigo-500 to-blue-600', bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  { label: 'Medical', icon: '🩺', color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  { label: 'Management', icon: '📊', color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  { label: 'Law', icon: '⚖️', color: 'from-purple-500 to-violet-600', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  { label: 'Government', icon: '🏛️', color: 'from-sky-500 to-cyan-600', bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  { label: 'Science', icon: '🔬', color: 'from-lime-500 to-green-600', bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200' },
  { label: 'Private', icon: '🏢', color: 'from-rose-500 to-pink-600', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  { label: 'Top Rated', icon: '⭐', color: 'from-yellow-500 to-amber-600', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
];

const statsData = [
  { number: 208, suffix: '+', label: 'Verified Colleges', icon: '🏛️' },
  { number: 32, suffix: '', label: 'States & UTs', icon: '📍' },
  { number: 9, suffix: '', label: 'Course Streams', icon: '📚' },
  { number: 5, suffix: '', label: 'Entrance Exams', icon: '🎓' },
];

const categories: CategoryCard[] = [
  { name: 'Engineering', icon: '⚙️', count: 128, href: '/colleges?courses=B.Tech', color: '#EEF2FF' },
  { name: 'Medical', icon: '🩺', count: 22, href: '/colleges?courses=MBBS', color: '#ECFDF5' },
  { name: 'Management', icon: '📊', count: 84, href: '/colleges?courses=MBA', color: '#FFFBEB' },
  { name: 'Law', icon: '⚖️', count: 18, href: '/colleges?courses=LLB', color: '#F5F3FF' },
  { name: 'Science', icon: '🔬', count: 45, href: '/colleges?courses=B.Sc', color: '#F0FDF4' },
  { name: 'Commerce', icon: '💼', count: 30, href: '/colleges?courses=B.Com', color: '#FFF7ED' },
  { name: 'Arts', icon: '🎨', count: 30, href: '/colleges?courses=B.A', color: '#FFF1F2' },
  { name: 'Research', icon: '🧬', count: 52, href: '/colleges?courses=PhD', color: '#F0F9FF' },
];

const trendingExams: TrendingExam[] = [
  { name: 'JEE Main 2026', date: 'Jan & Apr 2026', status: 'completed', registrationOpen: false },
  { name: 'JEE Advanced 2026', date: 'Jun 2026', status: 'upcoming', registrationOpen: true },
  { name: 'NEET UG 2026', date: 'May 2026', status: 'completed', registrationOpen: false },
  { name: 'CAT 2026', date: 'Nov 2026', status: 'upcoming', registrationOpen: false },
  { name: 'GATE 2027', date: 'Feb 2027', status: 'upcoming', registrationOpen: false },
];

const testimonials: Testimonial[] = [
  {
    quote: 'CollegeFind helped me compare IITs side by side. The predictor tool was spot-on — I got into my dream college!',
    name: 'Priya Sharma',
    college: 'IIT Delhi, B.Tech CSE',
    rating: 5,
  },
  {
    quote: 'Finally a platform without annoying ads and popups. Clean, fast, and the compare feature saved me hours of research.',
    name: 'Arjun Patel',
    college: 'NIT Trichy, B.Tech ECE',
    rating: 5,
  },
  {
    quote: 'The saved colleges feature let me shortlist my top picks. Much better than the cluttered alternatives out there.',
    name: 'Sneha Reddy',
    college: 'IIM Bangalore, MBA',
    rating: 4,
  },
];

const steps = [
  { icon: '🔍', title: 'Search & Filter', desc: 'Browse 208+ verified colleges with 10+ advanced filters — fees, NAAC grade, location, courses, exams, and more.', color: 'from-indigo-50 to-blue-50', accent: '#4F46E5', iconBg: 'from-indigo-500 to-blue-600' },
  { icon: '⚖️', title: 'Compare & Analyze', desc: 'Compare up to 3 colleges side-by-side. See fees, placements, packages, and rankings at a glance.', color: 'from-emerald-50 to-teal-50', accent: '#059669', iconBg: 'from-emerald-500 to-teal-600' },
  { icon: '🎯', title: 'Predict & Decide', desc: 'Enter your exam rank to see matching colleges with High, Moderate, or Low chance indicators instantly.', color: 'from-amber-50 to-orange-50', accent: '#D97706', iconBg: 'from-amber-500 to-orange-600' },
];

const whyFeatures = [
  { icon: '✨', title: 'Ad-Free Experience', desc: 'Zero popups, zero banners, zero sponsored results. Pure information.' },
  { icon: '⚡', title: 'Blazing Fast', desc: 'Sub-50ms API responses. Instant search, filter, and sort across 208 colleges.' },
  { icon: '📱', title: 'Mobile First', desc: 'Designed for phones first with bottom-sheet filters and swipe-friendly cards.' },
  { icon: '🔒', title: 'Verified Data', desc: 'Every college detail cross-verified. NAAC grades, fees, placements — all accurate.' },
];

/* Scroll reveal hook */
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add('revealed'); observer.unobserve(el); } },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return ref;
}

function RevealSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useScrollReveal();
  return <div ref={ref} className={`reveal ${className}`}>{children}</div>;
}

export default function HomePage() {
  const [featured, setFeatured] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const api = await import('@/lib/api');
        const d = await api.apiJson('/api/colleges/featured');
        setFeatured(d.colleges || []);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const handleQuickFilter = (filter: string) => {
    if (filter === 'Government') router.push('/colleges?type=GOVERNMENT');
    else if (filter === 'Private') router.push('/colleges?type=PRIVATE');
    else if (filter === 'Top Rated') router.push('/colleges?minRating=4.5');
    else if (filter === 'Engineering') router.push('/colleges?courses=B.Tech');
    else if (filter === 'Medical') router.push('/colleges?courses=MBBS');
    else if (filter === 'Management') router.push('/colleges?courses=MBA');
    else if (filter === 'Law') router.push('/colleges?courses=LLB');
    else if (filter === 'Science') router.push('/colleges?courses=B.Sc');
    else router.push(`/colleges?courses=${encodeURIComponent(filter)}`);
  };

  return (
    <div className="overflow-hidden">
      {/* ===== HERO ===== */}
      <section className="hero-ultra relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />
        <div className="hero-grid-pattern absolute inset-0 pointer-events-none" />

        <div className="container-main text-center relative z-10 py-20 md:py-28 lg:py-32">
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2.5 bg-white/80 backdrop-blur-md border border-indigo-200/60 rounded-full px-5 py-2 mb-8 shadow-lg shadow-indigo-500/5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold text-indigo-700 tracking-wide uppercase">Trusted by 10,000+ students</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 mb-6 leading-[0.95] tracking-tight">
            Find Your<br />
            <span className="hero-text-gradient">Perfect College</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            Search <span className="text-indigo-600 font-bold">208+ verified colleges</span> across 32 states. Compare fees, placements, and rankings — zero ads, zero clutter.
          </p>

          <SearchAutocomplete className="max-w-2xl mx-auto mb-12" />

          {/* Quick Filters — colorful pills */}
          <div className="flex flex-wrap justify-center gap-2.5 max-w-3xl mx-auto">
            {quickFilters.map(f => (
              <button key={f.label} onClick={() => handleQuickFilter(f.label)}
                className={`group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
                  ${f.bg} ${f.text} border ${f.border}
                  hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5
                  active:scale-95 transition-all duration-200 cursor-pointer`}>
                <span className="text-base">{f.icon}</span>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ANIMATED STATS ===== */}
      <RevealSection>
        <StatsCounter stats={statsData} />
      </RevealSection>

      {/* ===== TOP CATEGORIES ===== */}
      <RevealSection>
        <section className="py-16 md:py-20">
          <div className="container-main">
            <div className="text-center mb-12">
              <span className="text-label text-indigo-600 mb-2 block">Explore</span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Browse by Category</h2>
              <p className="text-base text-slate-500 max-w-lg mx-auto">Discover colleges across India&apos;s most popular academic streams</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
              {categories.map(cat => (
                <Link key={cat.name} href={cat.href}
                  className="category-card-v2 group no-underline" style={{ backgroundColor: cat.color }}>
                  <div className="text-4xl mb-3 group-hover:scale-125 transition-transform duration-300 ease-out">{cat.icon}</div>
                  <div className="text-sm font-bold text-slate-800 mb-0.5">{cat.name}</div>
                  <div className="text-[11px] text-slate-500 font-semibold">{cat.count}+ colleges</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ===== TRENDING EXAMS ===== */}
      <RevealSection>
        <section className="py-16 md:py-20 bg-white">
          <div className="container-main">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-label text-indigo-600 mb-2 block">Exams</span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Trending Entrance Exams</h2>
              </div>
              <Link href="/exams" className="text-sm text-indigo-600 font-bold hover:underline no-underline hidden md:block">View All Exams →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {trendingExams.map(exam => (
                <div key={exam.name} className="exam-card group">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`exam-status ${
                      exam.status === 'upcoming' ? 'exam-status-upcoming' :
                      exam.status === 'ongoing' ? 'exam-status-ongoing' :
                      'exam-status-completed'
                    }`}>
                      {exam.status === 'upcoming' ? 'Upcoming' : exam.status === 'ongoing' ? 'Live' : 'Completed'}
                    </span>
                    {exam.registrationOpen && (
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-slate-800 mb-1.5 group-hover:text-indigo-600 transition-colors">{exam.name}</h3>
                  <p className="text-sm text-slate-500 font-medium">{exam.date}</p>
                  {exam.registrationOpen && (
                    <div className="mt-3 inline-flex items-center gap-1.5 text-xs text-emerald-600 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Registration Open
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ===== FEATURED COLLEGES ===== */}
      <RevealSection>
        <section className="py-16 md:py-20 bg-gradient-to-b from-slate-50/50 to-white">
          <div className="container-main">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-label text-indigo-600 mb-2 block">Featured</span>
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Top Rated Colleges</h2>
                <p className="text-sm text-slate-500 mt-2">Highest-rated institutions across placements, faculty, and infrastructure</p>
              </div>
              <Link href="/colleges" className="text-sm font-bold text-indigo-600 hover:underline no-underline hidden md:block">View All →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? Array(6).fill(0).map((_, i) => <CollegeCardSkeleton key={i} />) :
                featured.map(c => <CollegeCard key={c.id} college={c} />)}
            </div>
            <div className="text-center mt-12">
              <Link href="/colleges" className="btn-primary-lg inline-flex items-center gap-2 no-underline group">
                Browse All 208+ Colleges
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="group-hover:translate-x-1 transition-transform"><path d="m9 18 6-6-6-6"/></svg>
              </Link>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ===== HOW IT WORKS ===== */}
      <RevealSection>
        <section className="py-16 md:py-20 bg-white">
          <div className="container-main">
            <div className="text-center mb-14">
              <span className="text-label text-indigo-600 mb-2 block">How It Works</span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Three Steps to Your Dream College</h2>
              <p className="text-base text-slate-500 max-w-lg mx-auto">Our data-driven approach simplifies the most important decision of your career</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((s, i) => (
                <div key={i} className="relative group">
                  <div className={`step-card-v2 h-full bg-gradient-to-br ${s.color}`}>
                    {/* Number badge */}
                    <div className={`absolute -top-4 -left-4 w-10 h-10 rounded-2xl bg-gradient-to-br ${s.iconBg} text-white text-sm font-black flex items-center justify-center shadow-lg z-10`}>
                      {i + 1}
                    </div>
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 text-3xl bg-gradient-to-br ${s.iconBg} bg-opacity-10 group-hover:scale-110 transition-transform duration-300`}
                      style={{ background: `${s.accent}12` }}>
                      {s.icon}
                    </div>
                    <h3 className="text-xl font-black text-slate-800 mb-3">{s.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                  </div>
                  {/* Connector arrow */}
                  {i < 2 && (
                    <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md items-center justify-center border border-slate-100">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6366F1" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ===== WHY COLLEGEFIND ===== */}
      <RevealSection>
        <section className="py-16 md:py-20 bg-slate-900 relative overflow-hidden">
          {/* Dark section decorative elements */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="container-main relative z-10">
            <div className="text-center mb-14">
              <span className="text-label text-indigo-400 mb-2 block">Why Choose Us</span>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">Built Different from Day One</h2>
              <p className="text-base text-slate-400 max-w-lg mx-auto">Not just another college listing — a decision engine designed for India&apos;s students</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {whyFeatures.map((f, i) => (
                <div key={i} className="why-card group">
                  <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ===== TESTIMONIALS ===== */}
      <RevealSection>
        <section className="py-16 md:py-20 bg-white">
          <div className="container-main">
            <div className="text-center mb-14">
              <span className="text-label text-indigo-600 mb-2 block">Testimonials</span>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">What Students Say</h2>
              <p className="text-base text-slate-500 max-w-lg mx-auto">Join thousands who found their dream college with CollegeFind</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <TestimonialCard key={i} testimonial={t} index={i} />
              ))}
            </div>
          </div>
        </section>
      </RevealSection>

      {/* ===== CTA ===== */}
      <section className="cta-ultra relative overflow-hidden py-20 md:py-24">
        <div className="cta-blob cta-blob-1" />
        <div className="cta-blob cta-blob-2" />
        <div className="container-main text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-5 tracking-tight">Ready to find your<br /><span className="cta-text-accent">perfect college?</span></h2>
          <p className="text-base text-indigo-200 mb-10 max-w-lg mx-auto leading-relaxed">
            Join 10,000+ students already using CollegeFind to make smarter decisions
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/colleges" className="cta-btn-primary no-underline">
              Browse All Colleges
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m9 18 6-6-6-6"/></svg>
            </Link>
            <Link href="/predictor" className="cta-btn-secondary no-underline">Try College Predictor</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
