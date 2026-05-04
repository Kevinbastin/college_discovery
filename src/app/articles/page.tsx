'use client';
import { useState } from 'react';
import Breadcrumb from '@/components/Breadcrumb';
import { Article } from '@/types';

const articles: Article[] = [
  { id: '1', title: 'JEE Main 2025 Session 2 Registration Opens — Key Dates and Process', excerpt: 'NTA has opened the registration window for JEE Main 2025 Session 2. Students can apply through the official website. The exam is scheduled for April 2025.', category: 'exam_news', date: '2025-03-15', readTime: '3 min', icon: '📋' },
  { id: '2', title: 'NEET UG 2025 — NTA Releases Official Syllabus and Exam Pattern', excerpt: 'The National Testing Agency has released the complete syllabus for NEET UG 2025. The exam will follow the same pattern as previous years with 200 questions.', category: 'exam_news', date: '2025-03-12', readTime: '4 min', icon: '📋' },
  { id: '3', title: 'IIT Bombay Placement Report 2025 — Average Package Crosses ₹20 LPA', excerpt: 'IIT Bombay has released its placement report for 2024-25. The average package has reached ₹20.5 LPA with the highest domestic offer at ₹80 LPA.', category: 'college_news', date: '2025-03-10', readTime: '5 min', icon: '🏛️' },
  { id: '4', title: 'CAT 2025 — IIM Lucknow to Conduct the Exam This Year', excerpt: 'IIM Lucknow has been designated as the organizing institute for CAT 2025. Registration is expected to open in August with the exam in November.', category: 'exam_news', date: '2025-03-08', readTime: '3 min', icon: '📋' },
  { id: '5', title: 'Top 10 Engineering Colleges Under ₹2 Lakh in India 2025', excerpt: 'Looking for affordable engineering education? Here are the top 10 colleges offering B.Tech programs under ₹2 lakh annual fees with excellent placements.', category: 'admission', date: '2025-03-05', readTime: '6 min', icon: '🎓' },
  { id: '6', title: 'GATE 2025 Results Declared — Cutoff Marks for Top IITs Released', excerpt: 'GATE 2025 results are out. Candidates can check their scores on the official website. Cutoff marks for M.Tech admissions at IITs have been released.', category: 'exam_news', date: '2025-03-03', readTime: '3 min', icon: '📋' },
  { id: '7', title: 'NIT Trichy vs NIT Warangal — Which Is Better for B.Tech CSE?', excerpt: 'A detailed comparison of India\'s top NITs for Computer Science Engineering. We compare placements, fees, faculty, campus life, and career outcomes.', category: 'college_news', date: '2025-03-01', readTime: '7 min', icon: '🏛️' },
  { id: '8', title: '5 Steps to Choose the Right College for B.Tech', excerpt: 'Confused about which engineering college to choose? Follow these 5 evidence-based steps to make an informed decision that aligns with your career goals.', category: 'career', date: '2025-02-28', readTime: '5 min', icon: '💡' },
  { id: '9', title: 'NIRF Rankings 2025 — Complete List of Top Universities', excerpt: 'The Ministry of Education has released NIRF Rankings 2025. IIT Madras retains the top spot overall, while IISc Bangalore leads in the research category.', category: 'college_news', date: '2025-02-25', readTime: '4 min', icon: '🏛️' },
  { id: '10', title: 'Scholarships for Engineering Students — Complete Guide 2025', excerpt: 'Comprehensive guide to scholarships available for engineering students in India. Covers government, private, and merit-based scholarships.', category: 'scholarship', date: '2025-02-22', readTime: '6 min', icon: '🎁' },
  { id: '11', title: 'MBA vs MCA — Which is Better After B.Tech?', excerpt: 'Should you pursue MBA or MCA after B.Tech? We analyze career prospects, salary potential, and growth opportunities for both paths.', category: 'career', date: '2025-02-20', readTime: '5 min', icon: '💡' },
  { id: '12', title: 'DU Admission 2025 — CUET Registration Process and Key Dates', excerpt: 'Delhi University admission for 2025-26 will be through CUET. Know the complete registration process, eligibility criteria, and important dates.', category: 'admission', date: '2025-02-18', readTime: '4 min', icon: '🎓' },
];

const CATEGORY_TABS = [
  { value: 'all', label: 'All', icon: '📰' },
  { value: 'exam_news', label: 'Exam News', icon: '📋' },
  { value: 'admission', label: 'Admissions', icon: '🎓' },
  { value: 'college_news', label: 'College News', icon: '🏛️' },
  { value: 'career', label: 'Career', icon: '💡' },
  { value: 'scholarship', label: 'Scholarships', icon: '🎁' },
];

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const filtered = activeCategory === 'all' ? articles : articles.filter(a => a.category === activeCategory);

  return (
    <div className="container-main py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Articles' }]} />
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">News & Articles</h1>
        <p className="text-base text-[#64748B] max-w-lg mx-auto">Latest updates on exams, admissions, college news, and career guidance</p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {CATEGORY_TABS.map(tab => (
          <button key={tab.value} onClick={() => setActiveCategory(tab.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeCategory === tab.value ? 'bg-[#1E3A8A] text-white shadow-lg' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(article => (
          <article key={article.id} className="card-premium p-5 group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB]">
                {CATEGORY_TABS.find(t => t.value === article.category)?.label || article.category}
              </span>
              <span className="text-[10px] text-[#94A3B8]">{article.readTime} read</span>
            </div>
            <h2 className="text-base font-bold text-[#1E293B] mb-2 group-hover:text-[#2563EB] transition-colors leading-snug">{article.title}</h2>
            <p className="text-sm text-[#64748B] mb-3 line-clamp-3">{article.excerpt}</p>
            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
              <span className="text-xs text-[#94A3B8]">{new Date(article.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span className="text-xs text-[#2563EB] font-medium group-hover:underline cursor-pointer">Read More →</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
