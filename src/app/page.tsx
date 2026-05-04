'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CollegeCard from '@/components/CollegeCard';
import CollegeCardSkeleton from '@/components/CollegeCardSkeleton';
import StatsCounter from '@/components/StatsCounter';
import TestimonialCard from '@/components/TestimonialCard';
import SearchAutocomplete from '@/components/SearchAutocomplete';
import { College, Testimonial, CategoryCard, TrendingExam } from '@/types';

const quickFilters = ['Engineering', 'Medical', 'Management', 'Law', 'Government', 'Delhi', 'Mumbai', 'Tamil Nadu', 'Karnataka', 'Rajasthan'];

const statsData = [
  { number: 210, suffix: '+', label: 'Colleges', icon: '🏛️' },
  { number: 28, suffix: '+', label: 'States Covered', icon: '📍' },
  { number: 9, suffix: '', label: 'Course Streams', icon: '📚' },
  { number: 5, suffix: '', label: 'Entrance Exams', icon: '🎓' },
];

const categories: CategoryCard[] = [
  { name: 'Engineering', icon: '⚙️', count: 40, href: '/courses/btech', color: '#EFF6FF' },
  { name: 'Medical', icon: '🩺', count: 12, href: '/courses/mbbs', color: '#F0FDF4' },
  { name: 'Management', icon: '📊', count: 20, href: '/courses/mba', color: '#FEF9C3' },
  { name: 'Law', icon: '⚖️', count: 6, href: '/courses/llb', color: '#F3E8FF' },
  { name: 'Science', icon: '🔬', count: 15, href: '/courses/bsc', color: '#ECFDF5' },
  { name: 'Commerce', icon: '💼', count: 10, href: '/courses/bcom', color: '#FFF7ED' },
];

const trendingExams: TrendingExam[] = [
  { name: 'JEE Main 2025', date: 'Jan & Apr 2025', status: 'upcoming', registrationOpen: true },
  { name: 'NEET UG 2025', date: 'May 2025', status: 'upcoming', registrationOpen: true },
  { name: 'CAT 2025', date: 'Nov 2025', status: 'upcoming', registrationOpen: false },
  { name: 'GATE 2025', date: 'Feb 2025', status: 'completed', registrationOpen: false },
  { name: 'JEE Advanced 2025', date: 'Jun 2025', status: 'upcoming', registrationOpen: false },
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
  { icon: '🔍', title: 'Search & Filter', desc: 'Browse 500+ colleges with advanced filters — fees, location, ranking, courses, and exams', color: '#EFF6FF', accent: '#2563EB' },
  { icon: '⚖️', title: 'Compare & Analyze', desc: 'Compare up to 3 colleges side by side with radar chart visualization and best-value highlights', color: '#F0FDF4', accent: '#16A34A' },
  { icon: '🎯', title: 'Predict & Decide', desc: 'Enter your exam rank to see matching colleges with High, Moderate, or Low chance indicators', color: '#FEF9C3', accent: '#EAB308' },
];

const whyFeatures = [
  { icon: '✨', title: 'Zero Ads', desc: 'No popups, no banners — just clean information' },
  { icon: '⚡', title: 'Lightning Fast', desc: 'Optimized queries for instant filter & search results' },
  { icon: '📱', title: 'Mobile First', desc: 'Designed for phones first — works beautifully everywhere' },
  { icon: '🧠', title: 'Decision Focused', desc: 'Every feature helps you make a better college choice' },
];

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
    const stateFilters = ['Delhi', 'Mumbai', 'Tamil Nadu', 'Karnataka', 'Rajasthan'];
    if (stateFilters.includes(filter)) router.push(`/colleges?state=${encodeURIComponent(filter)}`);
    else if (filter === 'Government') router.push('/colleges?type=GOVERNMENT');
    else if (filter === 'Engineering') router.push('/colleges?courses=B.Tech');
    else if (filter === 'Medical') router.push('/colleges?courses=MBBS');
    else if (filter === 'Management') router.push('/colleges?courses=MBA');
    else if (filter === 'Law') router.push('/colleges?courses=LLB');
    else router.push(`/colleges?courses=${encodeURIComponent(filter)}`);
  };

  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="gradient-hero dot-pattern py-20 md:py-28">
        <div className="container-main text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse" />
            <span className="text-xs text-white/90 font-medium">Trusted by 10,000+ students across India</span>
          </div>

          <h1 className="text-4xl md:text-7xl font-bold text-white mb-4 leading-tight">
            Find Your <span className="text-[#60A5FA]">Perfect College</span><br className="hidden md:block" /> in India
          </h1>
          <p className="text-base md:text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
            Search from 500+ colleges. Compare fees, placements, and rankings. Make an informed decision — zero ads, zero clutter.
          </p>

          <SearchAutocomplete className="max-w-xl mx-auto mb-8" />

          <div className="flex flex-wrap justify-center gap-2">
            {quickFilters.map(f => (
              <button key={f} onClick={() => handleQuickFilter(f)}
                className="px-4 py-2 text-sm font-medium bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 hover:bg-white/20 hover:border-white/40 transition-all duration-200">
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ANIMATED STATS ===== */}
      <StatsCounter stats={statsData} />

      {/* ===== TOP CATEGORIES ===== */}
      <section className="py-12 bg-[#F8FAFC]">
        <div className="container-main">
          <div className="text-center mb-8">
            <h2 className="section-heading mb-2">Explore by Category</h2>
            <p className="text-body">Browse colleges across India&apos;s top academic streams</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(cat => (
              <Link key={cat.name} href={cat.href}
                className="card-premium p-5 text-center group no-underline" style={{ backgroundColor: cat.color }}>
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform duration-300">{cat.icon}</div>
                <div className="text-sm font-bold text-[#1E293B] mb-1">{cat.name}</div>
                <div className="text-xs text-[#64748B]">{cat.count}+ colleges</div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/courses" className="text-sm font-medium text-[#2563EB] hover:underline no-underline">View All Courses →</Link>
          </div>
        </div>
      </section>

      {/* ===== TRENDING EXAMS ===== */}
      <section className="py-12 bg-white">
        <div className="container-main">
          <div className="flex items-center justify-between mb-6">
            <h2 className="section-heading">Trending Exams</h2>
            <Link href="/exams" className="text-xs text-[#2563EB] font-medium hover:underline no-underline">View All Exams →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {trendingExams.map(exam => (
              <div key={exam.name} className="card-premium p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    exam.status === 'upcoming' ? 'bg-[#DBEAFE] text-[#2563EB]' :
                    exam.status === 'ongoing' ? 'bg-[#DCFCE7] text-[#16A34A]' :
                    'bg-[#F1F5F9] text-[#64748B]'
                  }`}>
                    {exam.status === 'upcoming' ? '🔵 Upcoming' : exam.status === 'ongoing' ? '🟢 Ongoing' : '✅ Completed'}
                  </span>
                  {exam.registrationOpen && (
                    <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
                  )}
                </div>
                <h3 className="text-sm font-bold text-[#1E293B] mb-1">{exam.name}</h3>
                <p className="text-xs text-[#64748B]">{exam.date}</p>
                {exam.registrationOpen && (
                  <p className="text-[10px] text-[#16A34A] font-medium mt-1">Registration Open</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURED COLLEGES ===== */}
      <section className="py-12">
        <div className="container-main">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="section-heading">Top Rated Colleges</h2>
              <p className="text-sm text-[#64748B] mt-1">Highest-rated institutions based on placements, faculty, and infrastructure</p>
            </div>
            <Link href="/colleges" className="text-sm font-medium text-[#2563EB] hover:underline no-underline hidden md:block">View All →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? Array(6).fill(0).map((_, i) => <CollegeCardSkeleton key={i} />) :
              featured.map(c => <CollegeCard key={c.id} college={c} />)}
          </div>
          <div className="text-center mt-8">
            <Link href="/colleges" className="btn-primary-lg no-underline">Browse All Colleges</Link>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-14 bg-white">
        <div className="container-main">
          <div className="text-center mb-10">
            <h2 className="section-heading mb-2">How It Works</h2>
            <p className="text-body">Three simple steps to find your perfect college</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative group">
                <div className="card-premium p-6 text-center h-full" style={{ backgroundColor: s.color }}>
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-4 text-3xl group-hover:animate-float" style={{ backgroundColor: `${s.accent}15` }}>
                    {s.icon}
                  </div>
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-[#1E3A8A] text-white text-sm font-bold flex items-center justify-center shadow-lg">{i + 1}</div>
                  <h3 className="text-lg font-bold text-[#1E293B] mb-2">{s.title}</h3>
                  <p className="text-sm text-[#64748B] leading-relaxed">{s.desc}</p>
                </div>
                {i < 2 && <div className="hidden md:block absolute right-[-20px] top-1/2 -translate-y-1/2 text-[#CBD5E1] text-2xl z-10">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY COLLEGEFIND ===== */}
      <section className="py-14 bg-[#F8FAFC]">
        <div className="container-main">
          <div className="text-center mb-10">
            <h2 className="section-heading mb-2">Why CollegeFind?</h2>
            <p className="text-body">Built different from every other college platform</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyFeatures.map((f, i) => (
              <div key={i} className="card-premium p-6 text-center group">
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
                <h3 className="text-base font-bold text-[#1E293B] mb-2">{f.title}</h3>
                <p className="text-sm text-[#64748B]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-14 bg-white">
        <div className="container-main">
          <div className="text-center mb-10">
            <h2 className="section-heading mb-2">What Students Say</h2>
            <p className="text-body">Join thousands of students who found their dream college with us</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} testimonial={t} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="gradient-hero dot-pattern py-16">
        <div className="container-main text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Ready to find your perfect college?</h2>
          <p className="text-sm text-blue-200 mb-6 max-w-lg mx-auto">
            Join 10,000+ students already using CollegeFind to make smarter college decisions
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/colleges" className="btn-orange !text-lg no-underline">Browse All Colleges</Link>
            <Link href="/predictor" className="px-6 h-[48px] inline-flex items-center justify-center border-2 border-white text-white font-bold rounded hover:bg-white/10 transition-all no-underline">Try College Predictor</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
