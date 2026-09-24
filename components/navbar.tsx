'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, Menu } from 'lucide-react';

const navLinks = [
  { label: 'Explore', href: '#' },
  { label: 'Video', href: '#', pill: { text: 'New', color: 'volt' } },
  { label: '3D Models', href: '/3d-models' },
  { label: 'Live Studio', href: '#', pill: { text: 'No-OBS', color: 'gray' } },
];

export default function Navbar() {
  const [ribbonVisible, setRibbonVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {ribbonVisible && (
        <div className="relative z-50 flex items-center justify-center gap-3 bg-volt px-4 py-2.5 text-center text-sm font-medium text-black">
          <span className="hidden sm:inline">
            Get 20 free tokens on sign-up to test AI video and 3D generation
          </span>
          <span className="sm:hidden text-xs">
            20 free tokens on sign-up
          </span>
          <button className="inline-flex items-center gap-1 rounded-full bg-black px-3.5 py-1 text-xs font-semibold text-volt transition-transform hover:scale-105">
            Claim Now
            <ChevronRight className="h-3 w-3" />
          </button>
          <button
            onClick={() => setRibbonVisible(false)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-black/10"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? 'bg-[#080808]/80 backdrop-blur-xl border-b border-neutral-800/50'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#" className="flex items-center gap-0.5 text-xl font-black tracking-tighter">
            <span className="text-white">SAME</span>
            <span className="text-volt">GO</span>
          </a>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
                {link.pill && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase leading-none ${
                      link.pill.color === 'volt'
                        ? 'bg-volt/15 text-volt'
                        : 'bg-neutral-700/60 text-neutral-400'
                    }`}
                  >
                    {link.pill.text}
                  </span>
                )}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="#"
              className="px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:text-white"
            >
              Login
            </a>
            <a
              href="#"
              className="rounded-full bg-volt px-5 py-2.5 text-sm font-bold text-black transition-all hover:brightness-110 hover:shadow-[0_0_20px_rgba(212,255,0,0.25)]"
            >
              Sign up
            </a>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-neutral-400 transition-colors hover:text-white md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-neutral-800/50 bg-[#0a0a0a]/95 backdrop-blur-xl px-6 pb-6 pt-4 md:hidden">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  {link.label}
                  {link.pill && (
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase leading-none ${
                        link.pill.color === 'volt'
                          ? 'bg-volt/15 text-volt'
                          : 'bg-neutral-700/60 text-neutral-400'
                      }`}
                    >
                      {link.pill.text}
                    </span>
                  )}
                </a>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href="#"
                className="rounded-xl px-4 py-3 text-center text-sm font-medium text-neutral-300 transition-colors hover:bg-white/5 hover:text-white"
              >
                Login
              </a>
              <a
                href="#"
                className="rounded-full bg-volt px-5 py-3 text-center text-sm font-bold text-black"
              >
                Sign up
              </a>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
