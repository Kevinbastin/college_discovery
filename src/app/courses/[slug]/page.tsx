'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import CollegeCard from '@/components/CollegeCard';
import CollegeCardSkeleton from '@/components/CollegeCardSkeleton';
import { College } from '@/types';

const COURSE_DATA: Record<string, any> = {
  btech: { name: 'B.Tech', fullName: 'Bachelor of Technology', icon: '⚙️', duration: '4 years', level: 'Undergraduate', description: 'B.Tech is India\'s most popular engineering degree. It covers disciplines like Computer Science, Electronics, Mechanical, Civil, Electrical, and Chemical Engineering. The program emphasizes both theoretical knowledge and practical skills through projects, internships, and industry exposure.', eligibility: 'Class 12 with Physics, Chemistry, Mathematics (PCM) with minimum 75% aggregate (65% for SC/ST). Must qualify JEE Main, JEE Advanced, or State CETs.', avgFeesRange: '₹50,000 – ₹4,00,000/yr', avgSalary: '₹4 – ₹20 LPA', careerOptions: ['Software Engineer — ₹6-25 LPA', 'Data Scientist — ₹8-30 LPA', 'Product Manager — ₹12-35 LPA', 'DevOps Engineer — ₹8-22 LPA', 'Systems Architect — ₹15-40 LPA'], topExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'VITEEE', 'State CETs'], courseFilter: 'B.Tech' },
  mbbs: { name: 'MBBS', fullName: 'Bachelor of Medicine, Bachelor of Surgery', icon: '🩺', duration: '5.5 years (incl. internship)', level: 'Undergraduate', description: 'MBBS is the primary medical qualification for aspiring doctors in India. The program includes pre-clinical, para-clinical, and clinical phases, followed by a 1-year compulsory rotating internship. Graduates can practice medicine or pursue MD/MS specializations.', eligibility: 'Class 12 with Physics, Chemistry, Biology with 50% aggregate (40% for SC/ST/OBC). Must qualify NEET UG.', avgFeesRange: '₹8,000 – ₹9,00,000/yr', avgSalary: '₹5 – ₹15 LPA', careerOptions: ['General Physician — ₹6-15 LPA', 'Surgeon — ₹10-40 LPA', 'Medical Researcher — ₹8-20 LPA', 'Radiologist — ₹12-35 LPA', 'Psychiatrist — ₹8-25 LPA'], topExams: ['NEET UG'], courseFilter: 'MBBS' },
  mba: { name: 'MBA', fullName: 'Master of Business Administration', icon: '📊', duration: '2 years', level: 'Postgraduate', description: 'MBA is the gold standard for business education, covering strategy, finance, marketing, operations, and HR. Top programs include summer internships, live projects, and international exchange programs.', eligibility: 'Bachelor\'s degree with 50% aggregate (45% for SC/ST). Must have valid CAT/XAT/GMAT/MAT score.', avgFeesRange: '₹2,00,000 – ₹25,00,000/yr', avgSalary: '₹8 – ₹28 LPA', careerOptions: ['Management Consultant — ₹15-40 LPA', 'Investment Banker — ₹12-50 LPA', 'Brand Manager — ₹10-25 LPA', 'Operations Head — ₹12-30 LPA', 'Entrepreneur'], topExams: ['CAT', 'XAT', 'GMAT', 'MAT', 'SNAP'], courseFilter: 'MBA' },
  bba: { name: 'BBA', fullName: 'Bachelor of Business Administration', icon: '💼', duration: '3 years', level: 'Undergraduate', description: 'BBA provides foundational knowledge in business management, marketing, finance, and HR. It prepares students for entry-level management roles or further studies like MBA.', eligibility: 'Class 12 from any stream with 50% aggregate.', avgFeesRange: '₹50,000 – ₹3,00,000/yr', avgSalary: '₹3 – ₹8 LPA', careerOptions: ['Business Analyst — ₹4-10 LPA', 'Marketing Executive — ₹3-8 LPA', 'HR Manager — ₹4-12 LPA', 'Sales Manager — ₹4-10 LPA', 'Financial Analyst — ₹5-12 LPA'], topExams: ['IPMAT', 'SET', 'NPAT', 'CUET'], courseFilter: 'BBA' },
  bsc: { name: 'B.Sc', fullName: 'Bachelor of Science', icon: '🔬', duration: '3 years', level: 'Undergraduate', description: 'B.Sc is a versatile science degree covering physics, chemistry, mathematics, biology, or computer science. It provides a strong foundation for research careers or further studies.', eligibility: 'Class 12 with Science stream, 50% aggregate.', avgFeesRange: '₹15,000 – ₹1,00,000/yr', avgSalary: '₹3 – ₹8 LPA', careerOptions: ['Research Scientist — ₹5-15 LPA', 'Data Analyst — ₹4-12 LPA', 'Lab Technician — ₹3-8 LPA', 'Teacher — ₹3-10 LPA', 'Environmental Scientist — ₹4-12 LPA'], topExams: ['CUET', 'University entrance exams'], courseFilter: 'B.Sc' },
  llb: { name: 'LLB', fullName: 'Bachelor of Laws', icon: '⚖️', duration: '3-5 years', level: 'Undergraduate', description: 'LLB is India\'s premier law degree. The 5-year integrated program combines BA/BBA with LLB, while the 3-year program is for graduates. Top law schools are NLUs.', eligibility: 'Class 12 (5-year) or Bachelor\'s degree (3-year) with 50%.', avgFeesRange: '₹50,000 – ₹3,50,000/yr', avgSalary: '₹5 – ₹15 LPA', careerOptions: ['Corporate Lawyer — ₹8-25 LPA', 'Litigation Lawyer — ₹5-20 LPA', 'Judge — ₹10-30 LPA', 'Legal Advisor — ₹6-18 LPA', 'Patent Attorney — ₹8-22 LPA'], topExams: ['CLAT', 'LSAT', 'AILET'], courseFilter: 'LLB' },
  mtech: { name: 'M.Tech', fullName: 'Master of Technology', icon: '🛠️', duration: '2 years', level: 'Postgraduate', description: 'M.Tech is an advanced engineering degree for specialization in areas like AI/ML, VLSI Design, Structural Engineering, and more. GATE score is typically required for admission.', eligibility: 'B.Tech/B.E with valid GATE score. Some institutes accept without GATE.', avgFeesRange: '₹50,000 – ₹2,00,000/yr', avgSalary: '₹6 – ₹18 LPA', careerOptions: ['AI/ML Engineer — ₹10-30 LPA', 'Research Engineer — ₹8-20 LPA', 'System Design Engineer — ₹8-22 LPA', 'Professor — ₹8-25 LPA', 'Tech Lead — ₹15-40 LPA'], topExams: ['GATE'], courseFilter: 'M.Tech' },
  bcom: { name: 'B.Com', fullName: 'Bachelor of Commerce', icon: '📒', duration: '3 years', level: 'Undergraduate', description: 'B.Com covers accounting, finance, taxation, business law, and economics. It\'s the foundational degree for careers in finance and commerce.', eligibility: 'Class 12 with Commerce stream, 50% aggregate.', avgFeesRange: '₹10,000 – ₹1,00,000/yr', avgSalary: '₹3 – ₹7 LPA', careerOptions: ['Chartered Accountant — ₹8-25 LPA', 'Financial Analyst — ₹5-15 LPA', 'Tax Consultant — ₹4-12 LPA', 'Auditor — ₹4-10 LPA', 'Banking Professional — ₹4-12 LPA'], topExams: ['CUET', 'DU JAT', 'University exams'], courseFilter: 'B.Com' },
  phd: { name: 'PhD', fullName: 'Doctor of Philosophy', icon: '🎓', duration: '3-5 years', level: 'Doctoral', description: 'PhD is the highest academic degree awarded for original research in any field. It qualifies graduates for academic and high-level research positions.', eligibility: 'Master\'s degree with valid GATE/NET/UGC score. Some institutes have their own entrance tests.', avgFeesRange: '₹20,000 – ₹1,00,000/yr', avgSalary: '₹8 – ₹25 LPA', careerOptions: ['Professor — ₹10-30 LPA', 'Research Scientist — ₹12-35 LPA', 'Policy Advisor — ₹10-25 LPA', 'Industry Researcher — ₹15-40 LPA', 'Author/Consultant — Variable'], topExams: ['GATE', 'UGC NET', 'CSIR NET'], courseFilter: 'PhD' },
};

export default function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const course = COURSE_DATA[slug];
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!course) return;
    (async () => {
      try {
        const api = await import('@/lib/api');
        const d = await api.apiJson(`/api/colleges?courses=${course.courseFilter}&sort=rating`);
        setColleges(d.colleges || []);
      } catch {}
      setLoading(false);
    })();
  }, [course]);

  if (!course) return <div className="container-main py-12 text-center"><h1 className="text-2xl font-bold text-[#1E293B]">Course not found</h1><Link href="/courses" className="text-[#2563EB] mt-4 inline-block">← Back to Courses</Link></div>;

  return (
    <div>
      <section className="gradient-hero dot-pattern py-10">
        <div className="container-main relative z-10">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Courses', href: '/courses' }, { label: course.name }]} />
          <div className="flex items-center gap-4 mb-2"><span className="text-5xl">{course.icon}</span>
            <div><h1 className="text-3xl md:text-5xl font-bold text-white">{course.name}</h1><p className="text-blue-200 text-sm">{course.fullName}</p></div>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            <span className="glass-card px-3 py-1 text-white text-xs font-medium">{course.level}</span>
            <span className="glass-card px-3 py-1 text-white text-xs font-medium">{course.duration}</span>
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-[#E2E8F0] py-6">
        <div className="container-main grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div><div className="text-lg font-bold text-[#1E3A8A]">{course.avgFeesRange}</div><div className="text-xs text-[#64748B] mt-1">Avg Fees Range</div></div>
          <div><div className="text-lg font-bold text-[#16A34A]">{course.avgSalary}</div><div className="text-xs text-[#64748B] mt-1">Avg Salary</div></div>
          <div><div className="text-lg font-bold text-[#7C3AED]">{course.duration}</div><div className="text-xs text-[#64748B] mt-1">Duration</div></div>
          <div><div className="text-lg font-bold text-[#F97316]">{colleges.length}+</div><div className="text-xs text-[#64748B] mt-1">Colleges</div></div>
        </div>
      </section>

      <section className="container-main py-8 space-y-8">
        <div><h2 className="text-xl font-bold text-[#1E293B] mb-3">About {course.name}</h2><p className="text-body">{course.description}</p></div>

        <div><h2 className="text-xl font-bold text-[#1E293B] mb-3">Eligibility</h2><p className="text-body">{course.eligibility}</p></div>

        <div><h2 className="text-xl font-bold text-[#1E293B] mb-3">Top Entrance Exams</h2>
          <div className="flex flex-wrap gap-2">{course.topExams.map((e: string) => <span key={e} className="bg-[#EFF6FF] text-[#2563EB] px-3 py-1.5 rounded text-sm font-medium border border-[#DBEAFE]">{e}</span>)}</div>
        </div>

        <div><h2 className="text-xl font-bold text-[#1E293B] mb-3">Career Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{course.careerOptions.map((c: string, i: number) => <div key={i} className="card-premium p-3 flex items-center gap-2"><span className="text-lg">💼</span><span className="text-sm font-medium text-[#1E293B]">{c}</span></div>)}</div>
        </div>

        <div><h2 className="text-xl font-bold text-[#1E293B] mb-4">Top Colleges Offering {course.name}</h2>
          {loading ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{Array(6).fill(0).map((_, i) => <CollegeCardSkeleton key={i} />)}</div>
           : colleges.length === 0 ? <p className="text-[#64748B] text-center py-8">No colleges found offering {course.name}</p>
           : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{colleges.map(c => <CollegeCard key={c.id} college={c} />)}</div>}
        </div>
      </section>
    </div>
  );
}
