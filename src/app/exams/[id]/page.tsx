'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import CollegeCard from '@/components/CollegeCard';
import CollegeCardSkeleton from '@/components/CollegeCardSkeleton';
import { College } from '@/types';

const EXAM_DATA: Record<string, any> = {
  'jee-main': { name: 'JEE Main 2025', shortName: 'JEE Main', type: 'JEE_MAIN', conductingBody: 'National Testing Agency (NTA)', examDate: 'January & April 2025', registrationDeadline: 'November 2024', resultDate: 'February & May 2025', eligibility: 'Class 12 passed with 75% aggregate (65% for SC/ST) in Physics, Chemistry, Mathematics', totalSeats: 45000, examPattern: '90 Questions | 300 Marks | 3 Hours', sections: [{ name: 'Physics', questions: 30, marks: 100 }, { name: 'Chemistry', questions: 30, marks: 100 }, { name: 'Mathematics', questions: 30, marks: 100 }], syllabus: ['Physics — Mechanics, Thermodynamics, Optics, Waves, Electromagnetism, Modern Physics, Semiconductors', 'Chemistry — Organic Chemistry, Inorganic Chemistry, Physical Chemistry, Chemical Bonding', 'Mathematics — Algebra, Calculus, Coordinate Geometry, Trigonometry, Statistics, Probability'], status: 'upcoming', registrationOpen: true },
  'jee-advanced': { name: 'JEE Advanced 2025', shortName: 'JEE Advanced', type: 'JEE_ADVANCED', conductingBody: 'IIT Kanpur', examDate: 'June 2025', registrationDeadline: 'May 2025', resultDate: 'June 2025', eligibility: 'Top 2,50,000 JEE Main qualifiers', totalSeats: 17000, examPattern: '2 Papers | 3 Hours each', sections: [{ name: 'Paper 1', questions: 54, marks: 180 }, { name: 'Paper 2', questions: 54, marks: 180 }], syllabus: ['Advanced Physics — Rotational Dynamics, Electromagnetic Induction, Optics, Thermodynamics', 'Advanced Chemistry — Organic Synthesis, Chemical Equilibrium, Electrochemistry, Coordination Compounds', 'Advanced Mathematics — Differential Equations, Complex Numbers, Matrices, Integral Calculus'], status: 'upcoming', registrationOpen: false },
  'neet': { name: 'NEET UG 2025', shortName: 'NEET', type: 'NEET', conductingBody: 'National Testing Agency (NTA)', examDate: 'May 2025', registrationDeadline: 'March 2025', resultDate: 'June 2025', eligibility: 'Class 12 with 50% in Physics, Chemistry, Biology (40% for SC/ST)', totalSeats: 110000, examPattern: '200 Questions | 720 Marks | 3 Hours 20 min', sections: [{ name: 'Physics', questions: 50, marks: 180 }, { name: 'Chemistry', questions: 50, marks: 180 }, { name: 'Biology', questions: 100, marks: 360 }], syllabus: ['Physics — Mechanics, Electrostatics, Optics, Modern Physics, Thermodynamics', 'Chemistry — Organic Chemistry, Inorganic Chemistry, Physical Chemistry, Biomolecules', 'Biology — Zoology, Botany, Human Physiology, Genetics, Ecology, Cell Biology'], status: 'upcoming', registrationOpen: true },
  'cat': { name: 'CAT 2025', shortName: 'CAT', type: 'CAT', conductingBody: 'IIM Lucknow', examDate: 'November 2025', registrationDeadline: 'September 2025', resultDate: 'January 2026', eligibility: "Bachelor's degree with 50% (45% for SC/ST)", totalSeats: 5000, examPattern: '66 Questions | 198 Marks | 2 Hours', sections: [{ name: 'VARC', questions: 24, marks: 72 }, { name: 'DILR', questions: 20, marks: 60 }, { name: 'Quantitative Aptitude', questions: 22, marks: 66 }], syllabus: ['VARC — Reading Comprehension, Para Jumbles, Summary, Critical Reasoning, Odd One Out', 'DILR — Tables, Charts, Graphs, Puzzles, Arrangements, Binary Logic', 'QA — Arithmetic, Algebra, Geometry, Number Systems, Combinatorics'], status: 'upcoming', registrationOpen: false },
  'gate': { name: 'GATE 2025', shortName: 'GATE', type: 'GATE', conductingBody: 'IIT Roorkee', examDate: 'February 2025', registrationDeadline: 'October 2024', resultDate: 'March 2025', eligibility: "Bachelor's in Engineering/Technology or Master's in Science", totalSeats: 8000, examPattern: '65 Questions | 100 Marks | 3 Hours', sections: [{ name: 'General Aptitude', questions: 10, marks: 15 }, { name: 'Core Subject', questions: 55, marks: 85 }], syllabus: ['General Aptitude — Verbal Ability, Numerical Ability, Analytical Reasoning', 'Engineering Maths — Linear Algebra, Calculus, Probability, Complex Variables', 'Core Subject — Based on chosen paper (CS, ECE, ME, EE, CE, etc.)'], status: 'completed', registrationOpen: false },
};

export default function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const exam = EXAM_DATA[id];
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!exam) return;
    (async () => {
      try {
        const api = await import('@/lib/api');
        const d = await api.apiJson(`/api/colleges?sort=rating`);
        const filtered = (d.colleges || []).filter((c: College) => {
          const cutoffs = c.cutoffRanks || {};
          return cutoffs[exam.type] !== undefined;
        });
        setColleges(filtered);
      } catch {}
      setLoading(false);
    })();
  }, [exam]);

  if (!exam) return <div className="container-main py-12 text-center"><h1 className="text-2xl font-bold text-[#1E293B]">Exam not found</h1><Link href="/exams" className="text-[#2563EB] mt-4 inline-block">← Back to Exams</Link></div>;

  const tabs = ['overview', 'syllabus', 'colleges', 'cutoffs'];

  return (
    <div>
      <section className="gradient-hero dot-pattern py-10">
        <div className="container-main relative z-10">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Exams', href: '/exams' }, { label: exam.shortName }]} />
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{exam.name}</h1>
          <p className="text-blue-200 text-sm mb-4">Conducted by {exam.conductingBody}</p>
          <div className="flex gap-2 flex-wrap">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${exam.status === 'upcoming' ? 'bg-[#DBEAFE] text-[#2563EB]' : exam.status === 'ongoing' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
              {exam.status === 'upcoming' ? '🔵 Upcoming' : exam.status === 'ongoing' ? '🟢 Ongoing' : '✅ Completed'}
            </span>
            {exam.registrationOpen && <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#DCFCE7] text-[#16A34A]">Registration Open</span>}
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-[#E2E8F0] py-6">
        <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div><div className="text-xl font-bold text-[#1E3A8A]">{exam.examDate}</div><div className="text-xs text-[#64748B] mt-1">Exam Date</div></div>
          <div><div className="text-xl font-bold text-[#16A34A]">{exam.totalSeats.toLocaleString()}</div><div className="text-xs text-[#64748B] mt-1">Total Seats</div></div>
          <div><div className="text-xl font-bold text-[#7C3AED]">{exam.registrationDeadline}</div><div className="text-xs text-[#64748B] mt-1">Registration Deadline</div></div>
          <div><div className="text-xl font-bold text-[#F97316]">{exam.resultDate}</div><div className="text-xs text-[#64748B] mt-1">Result Date</div></div>
        </div>
      </section>

      <section className="container-main py-6">
        <div className="flex border-b border-[#E2E8F0] mb-6 overflow-x-auto scrollbar-hide">
          {tabs.map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-3 text-sm font-medium capitalize whitespace-nowrap transition-colors ${activeTab === t ? 'text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-[#64748B] hover:text-[#1E293B]'}`}>{t}</button>))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div><h2 className="text-xl font-bold text-[#1E293B] mb-3">Eligibility</h2><p className="text-body">{exam.eligibility}</p></div>
            <div><h2 className="text-xl font-bold text-[#1E293B] mb-3">Exam Pattern</h2><p className="text-body mb-4">{exam.examPattern}</p>
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-[#1E3A8A] text-white"><th className="p-3 text-left text-xs font-bold">Section</th><th className="p-3 text-center text-xs font-bold">Questions</th><th className="p-3 text-center text-xs font-bold">Marks</th></tr></thead>
                <tbody>{exam.sections.map((s: any, i: number) => (<tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}><td className="p-3 font-medium text-[#1E293B]">{s.name}</td><td className="p-3 text-center text-[#475569]">{s.questions}</td><td className="p-3 text-center font-bold text-[#1E3A8A]">{s.marks}</td></tr>))}</tbody></table></div></div>
            <div className="card-premium p-6 bg-[#EFF6FF]">
              <h3 className="font-bold text-base text-[#1E3A8A] mb-2">🎯 Use College Predictor</h3>
              <p className="text-sm text-[#475569] mb-3">Enter your {exam.shortName} rank to see which colleges you can get into</p>
              <Link href={`/predictor`} className="btn-primary text-sm no-underline">Open Predictor →</Link>
            </div>
          </div>
        )}

        {activeTab === 'syllabus' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#1E293B] mb-3">Detailed Syllabus</h2>
            {exam.syllabus.map((item: string, i: number) => {
              const [subject, ...topics] = item.split(' — ');
              return (
                <div key={i} className="card-premium p-4">
                  <h3 className="font-bold text-base text-[#1E3A8A] mb-2">{subject}</h3>
                  <p className="text-sm text-[#475569]">{topics.join(' — ')}</p>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'colleges' && (
          <div>
            <h2 className="text-xl font-bold text-[#1E293B] mb-4">Colleges Accepting {exam.shortName}</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{Array(6).fill(0).map((_, i) => <CollegeCardSkeleton key={i} />)}</div>
            ) : colleges.length === 0 ? (
              <p className="text-[#64748B] text-center py-8">No colleges found accepting {exam.shortName}</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{colleges.map(c => <CollegeCard key={c.id} college={c} />)}</div>
            )}
          </div>
        )}

        {activeTab === 'cutoffs' && (
          <div>
            <h2 className="text-xl font-bold text-[#1E293B] mb-4">Cutoff Ranks — {exam.shortName}</h2>
            {loading ? (
              <div className="space-y-3">{Array(5).fill(0).map((_, i) => <div key={i} className="skeleton h-16" />)}</div>
            ) : colleges.length === 0 ? (
              <p className="text-[#64748B] text-center py-8">No cutoff data available</p>
            ) : (
              <div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-[#1E3A8A] text-white"><th className="p-3 text-left text-xs font-bold">College</th><th className="p-3 text-left text-xs font-bold">Location</th><th className="p-3 text-center text-xs font-bold">Cutoff Rank</th><th className="p-3 text-center text-xs font-bold">Fees</th><th className="p-3 text-center text-xs font-bold">Rating</th></tr></thead>
                <tbody>{colleges.map((c, i) => { const cutoff = c.cutoffRanks?.[exam.type]; const rank = typeof cutoff === 'number' ? cutoff : typeof cutoff === 'object' ? 'Structured' : 'N/A'; return (
                  <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F8FAFC]'}><td className="p-3"><Link href={`/colleges/${c.id}`} className="font-medium text-[#1E293B] hover:text-[#2563EB] no-underline">{c.shortName}</Link></td><td className="p-3 text-[#64748B]">{c.city}, {c.state}</td><td className="p-3 text-center font-bold text-[#1E3A8A]">{typeof rank === 'number' ? rank.toLocaleString() : rank}</td><td className="p-3 text-center text-[#475569]">₹{(c.annualFees / 100000).toFixed(1)}L</td><td className="p-3 text-center"><span className="text-[#F97316] font-bold">★ {c.rating}</span></td></tr>); })}</tbody></table></div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
