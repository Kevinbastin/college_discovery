export type CollegeType = 'GOVERNMENT' | 'PRIVATE';

export interface College {
  id: string;
  name: string;
  shortName: string;
  city: string;
  state: string;
  type: CollegeType;
  establishedYear: number;
  totalStudents: number;
  naacGrade: string;
  annualFees: number;
  placementPct: number;
  avgPackage: number;
  highestPackage: number;
  topRecruiters: string[];
  courses: string[];
  description: string;
  about: string;
  website: string;
  phone: string;
  email: string;
  rating: number;
  reviewCount: number;
  cutoffRanks: Record<string, number>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CollegeWithChance extends College {
  chance: 'HIGH' | 'MODERATE' | 'LOW';
  cutoffRank?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface SavedComparison {
  id: string;
  userId: string;
  signature: string;
  collegeIds: string[];
  createdAt: string;
  colleges?: College[];
}

export interface Question {
  id: string;
  text: string;
  userId: string;
  collegeId: string;
  createdAt: string;
  user: { name: string };
  _count?: { answers: number };
  answers?: Answer[];
}

export interface Answer {
  id: string;
  text: string;
  userId: string;
  questionId: string;
  createdAt: string;
  user: { name: string };
}

export interface CollegesResponse {
  colleges: College[];
  total: number;
  page: number;
  totalPages: number;
}

export interface FilterState {
  search: string;
  state: string;
  type: string;
  minFees: string;
  maxFees: string;
  naac: string[];
  minRating: string;
  courses: string[];
  page: number;
  sort: string;
}

export type ExamType = 'JEE_MAIN' | 'JEE_ADVANCED' | 'NEET' | 'CAT' | 'GATE';

// --- Advanced Types ---

export type ViewMode = 'grid' | 'list';

export type CategoryType = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';

export type ExamFilter = ExamType;

export interface CutoffData {
  [exam: string]: {
    [year: string]: {
      [category: string]: number;
    };
  } | number; // backward compat with flat structure
}

export interface Review {
  id: string;
  rating: number;
  title: string;
  text: string;
  authorName: string;
  collegeName?: string;
  date: string;
  infrastructure: number;
  faculty: number;
  placements: number;
  campusLife: number;
  helpful: number;
}

export interface Testimonial {
  quote: string;
  name: string;
  college: string;
  rating: number;
  avatar?: string;
}

export interface TrendingExam {
  name: string;
  date: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationOpen: boolean;
}

export interface CategoryCard {
  name: string;
  icon: string;
  count: number;
  href: string;
  color: string;
}

export interface ExamInfo {
  id: string;
  name: string;
  shortName: string;
  type: ExamType;
  conductingBody: string;
  examDate: string;
  registrationDeadline: string;
  resultDate: string;
  eligibility: string;
  totalSeats: number;
  examPattern: string;
  syllabus: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  registrationOpen: boolean;
  collegeCounts: number;
}

export interface CourseInfo {
  name: string;
  slug: string;
  duration: string;
  level: 'UG' | 'PG' | 'Doctoral';
  icon: string;
  description: string;
  eligibility: string;
  avgFeesRange: string;
  avgSalary: string;
  careerOptions: string[];
  topExams: string[];
  collegeCounts: number;
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: 'exam_news' | 'admission' | 'college_news' | 'career' | 'scholarship';
  date: string;
  readTime: string;
  icon: string;
}

export interface RankingEntry {
  rank: number;
  college: College;
  score?: number;
  category: string;
}
