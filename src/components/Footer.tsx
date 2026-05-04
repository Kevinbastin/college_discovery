import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white mt-12">
      <div className="container-main py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Logo & Tagline */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl no-underline mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/>
              </svg>
              CollegeFind
            </Link>
            <p className="text-sm text-gray-400 mb-3">India&apos;s cleanest college discovery platform. Zero ads, zero clutter — just decisions.</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              100+ colleges • 20+ states
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-gray-300">Explore</h3>
            <div className="flex flex-col gap-2">
              {[['/colleges', 'Colleges'], ['/courses', 'Courses'], ['/exams', 'Exams'], ['/rankings', 'Rankings'], ['/articles', 'News & Articles']].map(([href, label]) => (
                <Link key={href} href={href} className="text-sm text-gray-400 hover:text-white transition-colors no-underline">{label}</Link>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-gray-300">Tools</h3>
            <div className="flex flex-col gap-2">
              {[['/compare', 'Compare Colleges'], ['/predictor', 'College Predictor'], ['/saved', 'Saved Colleges']].map(([href, label]) => (
                <Link key={href} href={href} className="text-sm text-gray-400 hover:text-white transition-colors no-underline">{label}</Link>
              ))}
            </div>
          </div>

          {/* Top Streams */}
          <div>
            <h3 className="font-bold text-sm mb-3 text-gray-300">Top Streams</h3>
            <div className="flex flex-col gap-2">
              {[['/courses/btech', 'Engineering (B.Tech)'], ['/courses/mbbs', 'Medical (MBBS)'], ['/courses/mba', 'Management (MBA)'], ['/courses/llb', 'Law (LLB)'], ['/courses/bsc', 'Science (B.Sc)']].map(([href, label]) => (
                <Link key={href} href={href} className="text-sm text-gray-400 hover:text-white transition-colors no-underline">{label}</Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <span className="text-xs text-gray-500">© 2025 CollegeFind. All rights reserved.</span>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Built with Next.js + Prisma + Neon</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
