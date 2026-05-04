'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { getInitials } from '@/lib/utils';

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/colleges', label: 'Colleges' },
    { href: '/exams', label: 'Exams' },
    { href: '/courses', label: 'Courses' },
    { href: '/rankings', label: 'Rankings' },
    { href: '/compare', label: 'Compare' },
    { href: '/predictor', label: 'Predictor' },
    { href: '/articles', label: 'News' },
    ...(session ? [{ href: '/saved', label: 'Saved' }] : []),
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? 'shadow-nav-scroll' : 'shadow-nav'}`}>
        <div className="container-main flex items-center justify-between h-[64px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-[#1E3A8A] font-bold text-xl no-underline">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.1 2.7 3 6 3s6-1.9 6-3v-5"/>
            </svg>
            CollegeFind
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}
                className={`text-sm font-medium transition-colors duration-200 no-underline pb-1 ${
                  isActive(link.href) ? 'text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-[#64748B] hover:text-[#1E3A8A]'
                }`}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {status === 'loading' && <div className="skeleton w-[80px] h-[36px] rounded" />}
            {status === 'unauthenticated' && (
              <>
                <Link href="/login" className="btn-outlined text-sm !h-[36px] !px-4 no-underline">Login</Link>
                <Link href="/register" className="btn-primary text-sm !h-[36px] !px-4 no-underline">Register</Link>
              </>
            )}
            {status === 'authenticated' && session?.user && (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-[#1E293B] hover:text-[#2563EB] transition-colors">
                  <div className="w-8 h-8 rounded-full bg-[#1E3A8A] text-white flex items-center justify-center text-xs font-bold">
                    {getInitials(session.user.name || 'U')}
                  </div>
                  <span className="max-w-[100px] truncate">{session.user.name}</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                </button>
                {dropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-modal border border-[#E2E8F0] py-2 z-50 animate-scale-in">
                      <Link href="/saved" className="block px-4 py-2 text-sm text-[#1E293B] hover:bg-[#F8FAFC] no-underline" onClick={() => setDropdownOpen(false)}>
                        📑 Saved Colleges
                      </Link>
                      <button onClick={() => { signOut({ callbackUrl: '/' }); setDropdownOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-[#DC2626] hover:bg-red-50">
                        🚪 Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Hamburger */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 md:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed right-0 top-0 bottom-0 w-[280px] bg-white z-50 p-6 animate-slide-in-right md:hidden overflow-y-auto">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1E293B" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
            <div className="mt-8 flex flex-col gap-4">
              {navLinks.map(link => (
                <Link key={link.href} href={link.href}
                  className={`text-base font-medium py-2 no-underline ${isActive(link.href) ? 'text-[#2563EB]' : 'text-[#1E293B]'}`}>
                  {link.label}
                </Link>
              ))}
              <hr className="border-[#E2E8F0]" />
              {status === 'unauthenticated' && (
                <>
                  <Link href="/login" className="btn-outlined w-full text-center no-underline">Login</Link>
                  <Link href="/register" className="btn-primary w-full text-center no-underline">Register</Link>
                </>
              )}
              {status === 'authenticated' && (
                <button onClick={() => signOut({ callbackUrl: '/' })} className="btn-danger text-left py-2">Logout</button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Spacer for fixed nav */}
      <div className="h-[64px]" />

      <style jsx>{`
        @keyframes slide-in-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
        .animate-slide-in-right { animation: slide-in-right 0.3s ease; }
      `}</style>
    </>
  );
}
