'use client';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { CourseInfo } from '@/types';

const courses: CourseInfo[] = [
  { name: 'B.Tech', slug: 'btech', duration: '4 years', level: 'UG', icon: '⚙️', description: 'Bachelor of Technology — India\'s most sought-after engineering degree covering Computer Science, Electronics, Mechanical, Civil, and more.', eligibility: 'Class 12 with PCM, JEE Main / JEE Advanced / State CETs', avgFeesRange: '₹50K – ₹4L/yr', avgSalary: '₹4 – ₹20 LPA', careerOptions: ['Software Engineer', 'Data Scientist', 'Product Manager', 'Systems Architect', 'Research Engineer'], topExams: ['JEE Main', 'JEE Advanced', 'BITSAT', 'State CETs'], collegeCounts: 30 },
  { name: 'MBBS', slug: 'mbbs', duration: '5.5 years', level: 'UG', icon: '🩺', description: 'Bachelor of Medicine, Bachelor of Surgery — the primary medical degree for aspiring doctors in India.', eligibility: 'Class 12 with PCB, 50% aggregate, NEET UG qualified', avgFeesRange: '₹8K – ₹9L/yr', avgSalary: '₹5 – ₹15 LPA', careerOptions: ['Doctor', 'Surgeon', 'Medical Researcher', 'Public Health Specialist', 'Hospital Administrator'], topExams: ['NEET UG'], collegeCounts: 6 },
  { name: 'MBA', slug: 'mba', duration: '2 years', level: 'PG', icon: '📊', description: 'Master of Business Administration — prepares future business leaders with management, finance, and strategy skills.', eligibility: 'Bachelor\'s degree with 50%, CAT / XAT / GMAT / MAT scores', avgFeesRange: '₹2L – ₹25L/yr', avgSalary: '₹8 – ₹28 LPA', careerOptions: ['Management Consultant', 'Investment Banker', 'Brand Manager', 'Operations Head', 'Entrepreneur'], topExams: ['CAT', 'XAT', 'GMAT', 'MAT'], collegeCounts: 15 },
  { name: 'BBA', slug: 'bba', duration: '3 years', level: 'UG', icon: '💼', description: 'Bachelor of Business Administration — foundational business degree covering management, marketing, HR, and finance.', eligibility: 'Class 12 with 50% aggregate from any stream', avgFeesRange: '₹50K – ₹3L/yr', avgSalary: '₹3 – ₹8 LPA', careerOptions: ['Business Analyst', 'Marketing Executive', 'HR Manager', 'Sales Manager', 'Financial Analyst'], topExams: ['IPMAT', 'SET', 'NPAT'], collegeCounts: 8 },
  { name: 'B.Sc', slug: 'bsc', duration: '3 years', level: 'UG', icon: '🔬', description: 'Bachelor of Science — a versatile degree in physics, chemistry, biology, mathematics, or computer science.', eligibility: 'Class 12 with Science stream, 50% aggregate', avgFeesRange: '₹15K – ₹1L/yr', avgSalary: '₹3 – ₹8 LPA', careerOptions: ['Research Scientist', 'Lab Technician', 'Data Analyst', 'Teacher', 'Environmental Scientist'], topExams: ['CUET', 'University entrance exams'], collegeCounts: 10 },
  { name: 'LLB', slug: 'llb', duration: '3-5 years', level: 'UG', icon: '⚖️', description: 'Bachelor of Laws — India\'s premier law degree for aspiring lawyers, judges, and legal professionals.', eligibility: 'Class 12 (5-year) or Bachelor\'s degree (3-year) with 50%', avgFeesRange: '₹50K – ₹3.5L/yr', avgSalary: '₹5 – ₹15 LPA', careerOptions: ['Lawyer', 'Corporate Counsel', 'Judge', 'Legal Advisor', 'Patent Attorney'], topExams: ['CLAT', 'LSAT', 'AILET'], collegeCounts: 4 },
  { name: 'M.Tech', slug: 'mtech', duration: '2 years', level: 'PG', icon: '🛠️', description: 'Master of Technology — advanced engineering degree for specialization in AI, VLSI, Structural, and more.', eligibility: 'B.Tech/B.E with valid GATE score', avgFeesRange: '₹50K – ₹2L/yr', avgSalary: '₹6 – ₹18 LPA', careerOptions: ['Research Engineer', 'AI/ML Engineer', 'System Design Engineer', 'Professor', 'Tech Lead'], topExams: ['GATE'], collegeCounts: 15 },
  { name: 'B.Com', slug: 'bcom', duration: '3 years', level: 'UG', icon: '📒', description: 'Bachelor of Commerce — foundational degree for accounting, finance, taxation, and business.', eligibility: 'Class 12 with Commerce stream, 50% aggregate', avgFeesRange: '₹10K – ₹1L/yr', avgSalary: '₹3 – ₹7 LPA', careerOptions: ['Chartered Accountant', 'Financial Analyst', 'Tax Consultant', 'Auditor', 'Banking Professional'], topExams: ['CUET', 'University entrance exams'], collegeCounts: 6 },
  { name: 'PhD', slug: 'phd', duration: '3-5 years', level: 'Doctoral', icon: '🎓', description: 'Doctor of Philosophy — the highest academic degree for research and teaching in any discipline.', eligibility: 'Master\'s degree with valid GATE/NET/UGC score', avgFeesRange: '₹20K – ₹1L/yr', avgSalary: '₹8 – ₹25 LPA', careerOptions: ['Professor', 'Research Scientist', 'Policy Advisor', 'Industry Researcher', 'Author'], topExams: ['GATE', 'UGC NET', 'CSIR NET'], collegeCounts: 12 },
];

export default function CoursesPage() {
  return (
    <div className="container-main py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Courses' }]} />
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">Explore Courses</h1>
        <p className="text-base text-[#64748B] max-w-lg mx-auto">Find the right course for your career — eligibility, fees, top colleges, and placement outcomes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map(course => (
          <Link key={course.slug} href={`/courses/${course.slug}`} className="card-premium p-5 group no-underline block">
            <div className="flex items-center gap-3 mb-3">
              <div className="text-3xl">{course.icon}</div>
              <div>
                <h2 className="text-lg font-bold text-[#1E293B] group-hover:text-[#2563EB] transition-colors">{course.name}</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B]">{course.level} • {course.duration}</span>
              </div>
            </div>
            <p className="text-sm text-[#64748B] mb-3 line-clamp-2">{course.description}</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-[#94A3B8]">Avg Fees</span><span className="text-[#1E3A8A] font-medium">{course.avgFeesRange}</span></div>
              <div className="flex justify-between"><span className="text-[#94A3B8]">Avg Salary</span><span className="text-[#16A34A] font-medium">{course.avgSalary}</span></div>
              <div className="flex justify-between"><span className="text-[#94A3B8]">Colleges</span><span className="text-[#475569] font-medium">{course.collegeCounts}+ colleges</span></div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-xs text-[#2563EB] font-medium group-hover:underline">View Details →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
