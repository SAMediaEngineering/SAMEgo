'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Upload, Smartphone } from 'lucide-react';

const cards = [
  { id: 'anime', type: 'anime-transform' as const },
  { id: 'motion', type: 'motion-designer' as const },
  { id: 'upload', type: 'mobile-upload' as const },
];

function AnimeTransformCard() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black">
      {/* Video background */}
      <video
        src="/gemini_generated_video_f7843ad9.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/70" />

      {/* Output badge — top-right */}
      <div className="absolute right-4 top-4 z-10 sm:right-8 sm:top-8">
        <span className="rounded-md bg-volt/15 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-volt backdrop-blur-sm">
          Output
        </span>
      </div>

      {/* Bottom bar: Input badge + title side by side */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 px-4 pb-4 sm:px-8 sm:pb-8">
        <span className="shrink-0 rounded-md bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
          Input
        </span>
        <div className="min-w-0 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-400">
            Best AI Popular Models
          </p>
          <h3 className="mt-0.5 text-base font-black uppercase leading-tight tracking-tight text-white sm:text-xl">
            Video Transformation
          </h3>
        </div>
      </div>
    </div>
  );
}

function MotionDesignerCard() {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl bg-black">
      {/* Video background */}
      <video
        src="/gemini_generated_video_72b2be09_kotas.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Bottom gradient only */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/90 to-transparent" />

      {/* Bottom bar: badges + title side by side */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 px-4 pb-4 sm:px-8 sm:pb-8">
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-neutral-200 backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-xs">
            ChatGPT
          </span>
          <span className="text-xs text-neutral-500">+</span>
          <span className="rounded-full border border-white/20 bg-black/50 px-2.5 py-1 text-[11px] font-semibold text-neutral-200 backdrop-blur-md sm:px-3 sm:py-1.5 sm:text-xs">
            After Effects
          </span>
        </div>
        <div className="min-w-0 text-right">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-volt/60">
            Powered by
          </p>
          <h3 className="mt-0.5 text-base font-black uppercase leading-tight tracking-tight text-white sm:text-xl">
            AI Motion <span className="text-volt">Designer</span>
          </h3>
        </div>
      </div>
    </div>
  );
}

function MobileUploadCard() {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a0a12] via-[#0d0d18] to-[#080810]">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_50%,rgba(100,120,255,0.06),transparent_60%)]" />

      {/* Left text */}
      <div className="absolute left-6 top-1/2 z-10 -translate-y-1/2 sm:left-10 lg:left-16">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-600">
          Quick Start
        </p>
        <h3 className="mt-2 text-xl font-black uppercase tracking-tight text-white sm:text-2xl">
          Upload
        </h3>
        <p className="mt-1 text-sm text-neutral-500">Drag or tap to begin</p>
        <div className="mt-4 flex items-center gap-2">
          <Upload className="h-3.5 w-3.5 text-volt" />
          <span className="text-xs font-semibold text-volt">Browse Files</span>
        </div>
      </div>

      {/* Phone wireframe */}
      <div className="absolute right-8 top-1/2 z-10 -translate-y-1/2 sm:right-16 lg:right-24">
        <div className="relative flex h-52 w-28 flex-col items-center rounded-[20px] border border-neutral-700/60 bg-neutral-900/80 p-2 shadow-2xl backdrop-blur-sm sm:h-64 sm:w-32">
          {/* Notch */}
          <div className="mb-2 h-1.5 w-12 rounded-full bg-neutral-700" />
          {/* Screen */}
          <div className="flex flex-1 w-full flex-col items-center justify-center rounded-xl bg-neutral-800/50 p-3">
            <Smartphone className="mb-2 h-6 w-6 text-neutral-600" />
            <div className="h-1.5 w-10 rounded-full bg-neutral-700" />
            <div className="mt-1.5 h-1.5 w-6 rounded-full bg-neutral-700/60" />
            <div className="mt-4 flex h-8 w-full items-center justify-center rounded-lg bg-volt/10">
              <Upload className="h-3.5 w-3.5 text-volt/70" />
            </div>
          </div>
          {/* Home indicator */}
          <div className="mt-2 h-1 w-8 rounded-full bg-neutral-700" />
        </div>
      </div>

      {/* Floating dots pattern */}
      <div className="absolute bottom-6 left-6 flex gap-1.5 sm:bottom-8 sm:left-10">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 rounded-full"
            style={{
              backgroundColor: i === 0 ? '#D4FF00' : '#333',
            }}
          />
        ))}
      </div>
    </div>
  );
}

const cardComponents = {
  'anime-transform': AnimeTransformCard,
  'motion-designer': MotionDesignerCard,
  'mobile-upload': MobileUploadCard,
};

export default function HeroCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const container = scrollRef.current;
    if (!container) return;
    const cardEl = container.querySelector('[data-card]') as HTMLElement | null;
    if (!cardEl) return;
    const gap = 16;
    const distance = cardEl.offsetWidth + gap;
    container.scrollBy({
      left: direction === 'left' ? -distance : distance,
      behavior: 'smooth',
    });
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const cardEl = container.querySelector('[data-card]') as HTMLElement | null;
      if (!cardEl) return;
      const gap = 16;
      const cardWidth = cardEl.offsetWidth + gap;
      const idx = Math.round(container.scrollLeft / cardWidth);
      setActiveIndex(Math.min(idx, cards.length - 1));
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative mt-6">
      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 sm:px-6 lg:px-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Hide scrollbar for Webkit */}
        <style>{`[data-carousel]::-webkit-scrollbar { display: none; }`}</style>
        {cards.map((card) => {
          const CardContent = cardComponents[card.type];
          return (
            <div
              key={card.id}
              data-card
              className="w-[85vw] min-w-[85vw] snap-start md:w-[60vw] md:min-w-[60vw] lg:max-w-4xl"
            >
              <div className="group h-[280px] overflow-hidden rounded-2xl border border-neutral-800 transition-all duration-500 hover:border-neutral-700 hover:scale-[1.02] sm:h-[360px] lg:h-[400px]">
                <CardContent />
              </div>
            </div>
          );
        })}
        {/* Spacer so the last card can scroll into view */}
        <div className="min-w-[1px] shrink-0" aria-hidden />
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => scroll('left')}
        className={`absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-all hover:bg-white/20 sm:left-4 ${
          activeIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="Previous card"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>
      <button
        onClick={() => scroll('right')}
        className={`absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-all hover:bg-white/20 sm:right-4 ${
          activeIndex === cards.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        aria-label="Next card"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>

      {/* Dot indicators */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => {
              const container = scrollRef.current;
              if (!container) return;
              const cardEl = container.querySelector('[data-card]') as HTMLElement | null;
              if (!cardEl) return;
              const gap = 16;
              container.scrollTo({
                left: i * (cardEl.offsetWidth + gap),
                behavior: 'smooth',
              });
            }}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? 'w-6 bg-volt' : 'w-1.5 bg-neutral-700 hover:bg-neutral-500'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
