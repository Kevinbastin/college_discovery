'use client';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';
import { ExamInfo } from '@/types';

const exams: ExamInfo[] = [
  {
    id: 'jee-main', name: 'JEE Main 2025', shortName: 'JEE Main', type: 'JEE_MAIN',
    conductingBody: 'National Testing Agency (NTA)', examDate: 'January & April 2025',
    registrationDeadline: 'November 2024', resultDate: 'February & May 2025',
    eligibility: 'Class 12 passed with 75% aggregate (65% for SC/ST) in Physics, Chemistry, Mathematics',
    totalSeats: 45000, examPattern: '90 Questions | 300 Marks | 3 Hours | Physics, Chemistry, Mathematics',
    syllabus: ['Physics — Mechanics, Thermodynamics, Optics, Electromagnetism, Modern Physics', 'Chemistry — Organic, Inorganic, Physical Chemistry', 'Mathematics — Algebra, Calculus, Coordinate Geometry, Trigonometry, Statistics'],
    status: 'upcoming', registrationOpen: true, collegeCounts: 25,
  },
  {
    id: 'jee-advanced', name: 'JEE Advanced 2025', shortName: 'JEE Advanced', type: 'JEE_ADVANCED',
    conductingBody: 'IIT Kanpur (Rotating IITs)', examDate: 'June 2025',
    registrationDeadline: 'May 2025', resultDate: 'June 2025',
    eligibility: 'Top 2,50,000 JEE Main qualifiers. Must be born on or after October 1, 2000',
    totalSeats: 17000, examPattern: '2 Papers | 3 Hours each | Physics, Chemistry, Mathematics',
    syllabus: ['Advanced Physics — Mechanics, Waves, Optics, Electrodynamics, Quantum Physics', 'Advanced Chemistry — Organic Synthesis, Thermochemistry, Electrochemistry', 'Advanced Mathematics — Differential Equations, Complex Numbers, Matrices, Vectors'],
    status: 'upcoming', registrationOpen: false, collegeCounts: 8,
  },
  {
    id: 'neet', name: 'NEET UG 2025', shortName: 'NEET', type: 'NEET',
    conductingBody: 'National Testing Agency (NTA)', examDate: 'May 2025',
    registrationDeadline: 'March 2025', resultDate: 'June 2025',
    eligibility: 'Class 12 passed with 50% aggregate (40% for SC/ST/OBC) in Physics, Chemistry, Biology',
    totalSeats: 110000, examPattern: '200 Questions | 720 Marks | 3 Hours 20 min | Physics, Chemistry, Biology',
    syllabus: ['Physics — Mechanics, Thermodynamics, Optics, Modern Physics, Electrostatics', 'Chemistry — Organic, Inorganic, Physical Chemistry, Biomolecules', 'Biology — Zoology, Botany, Human Physiology, Genetics, Ecology'],
    status: 'upcoming', registrationOpen: true, collegeCounts: 6,
  },
  {
    id: 'cat', name: 'CAT 2025', shortName: 'CAT', type: 'CAT',
    conductingBody: 'IIM Lucknow (Rotating IIMs)', examDate: 'November 2025',
    registrationDeadline: 'September 2025', resultDate: 'January 2026',
    eligibility: 'Bachelor\'s degree with 50% aggregate (45% for SC/ST). Final year students eligible',
    totalSeats: 5000, examPattern: '66 Questions | 198 Marks | 2 Hours | VARC, DILR, QA',
    syllabus: ['Verbal Ability & Reading Comprehension — Para Jumbles, Summary, Critical Reasoning', 'Data Interpretation & Logical Reasoning — Tables, Charts, Puzzles, Arrangements', 'Quantitative Aptitude — Arithmetic, Algebra, Geometry, Number Systems'],
    status: 'upcoming', registrationOpen: false, collegeCounts: 10,
  },
  {
    id: 'gate', name: 'GATE 2025', shortName: 'GATE', type: 'GATE',
    conductingBody: 'IIT Roorkee (Rotating IITs)', examDate: 'February 2025',
    registrationDeadline: 'October 2024', resultDate: 'March 2025',
    eligibility: 'Bachelor\'s degree in Engineering/Technology or Master\'s in Science. Final year students eligible',
    totalSeats: 8000, examPattern: '65 Questions | 100 Marks | 3 Hours | Subject + General Aptitude',
    syllabus: ['General Aptitude — Verbal, Numerical, Analytical', 'Engineering Mathematics — Linear Algebra, Calculus, Probability', 'Core Subject — Based on chosen paper (CS, ECE, ME, etc.)'],
    status: 'completed', registrationOpen: false, collegeCounts: 8,
  },
];

export default function ExamsPage() {
  return (
    <div className="container-main py-6">
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Exams' }]} />
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] mb-2">Entrance Exams</h1>
        <p className="text-base text-[#64748B] max-w-lg mx-auto">Complete information about India&apos;s top entrance exams — dates, syllabus, eligibility, and colleges</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map(exam => (
          <Link key={exam.id} href={`/exams/${exam.id}`} className="card-premium p-5 group no-underline block">
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                exam.status === 'upcoming' ? 'bg-[#DBEAFE] text-[#2563EB]' :
                exam.status === 'ongoing' ? 'bg-[#DCFCE7] text-[#16A34A]' :
                'bg-[#F1F5F9] text-[#64748B]'
              }`}>
                {exam.status === 'upcoming' ? '🔵 Upcoming' : exam.status === 'ongoing' ? '🟢 Ongoing' : '✅ Completed'}
              </span>
              {exam.registrationOpen && <span className="text-[10px] font-bold text-[#16A34A] bg-[#DCFCE7] px-2 py-0.5 rounded-full">Registration Open</span>}
            </div>
            <h2 className="text-lg font-bold text-[#1E293B] mb-1 group-hover:text-[#2563EB] transition-colors">{exam.name}</h2>
            <p className="text-xs text-[#64748B] mb-3">{exam.conductingBody}</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2"><span className="text-[#94A3B8]">📅</span><span className="text-[#475569]">{exam.examDate}</span></div>
              <div className="flex items-center gap-2"><span className="text-[#94A3B8]">🎯</span><span className="text-[#475569]">{exam.totalSeats.toLocaleString()} seats</span></div>
              <div className="flex items-center gap-2"><span className="text-[#94A3B8]">🏛️</span><span className="text-[#475569]">{exam.collegeCounts}+ colleges accepting</span></div>
            </div>
            <div className="mt-4 pt-3 border-t border-[#E2E8F0] text-xs text-[#2563EB] font-medium group-hover:underline">View Details →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
