import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ContentRailProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: string;
  children: React.ReactNode;
  className?: string;
}

export const ContentRail: React.FC<ContentRailProps> = ({
  title,
  subtitle,
  icon,
  badge,
  children,
  className = '',
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollBoundaries = () => {
    const el = scrollContainerRef.current;
    if (el) {
      setCanScrollLeft(el.scrollLeft > 10);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollBoundaries();
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollBoundaries, { passive: true });
      window.addEventListener('resize', checkScrollBoundaries, { passive: true });
      return () => {
        el.removeEventListener('scroll', checkScrollBoundaries);
        window.removeEventListener('resize', checkScrollBoundaries);
      };
    }
  }, [children]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = scrollContainerRef.current.clientWidth * 0.75;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handleScroll('left');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleScroll('right');
    }
  };

  return (
    <section className={`space-y-3.5 ${className}`}>
      {/* Rail Header with Controls */}
      <div className="flex items-end justify-between px-1">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {icon && <span className="text-sky-500 dark:text-sky-400 shrink-0">{icon}</span>}
            <h2 className="text-lg sm:text-xl font-bold text-primary tracking-tight flex items-center gap-2">
              {title}
              {badge && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 font-semibold tracking-wide">
                  {badge}
                </span>
              )}
            </h2>
          </div>
          {subtitle && <p className="text-xs text-muted font-medium">{subtitle}</p>}
        </div>

        {/* Scroll Controls (Desktop) */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`p-2 rounded-xl bg-surface-elevated border border-subtle transition-all duration-200 btn-tactile shadow-sm ${
              canScrollLeft
                ? 'text-primary hover:border-slate-400 dark:hover:border-slate-700'
                : 'text-muted/40 cursor-not-allowed border-transparent'
            }`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`p-2 rounded-xl bg-surface-elevated border border-subtle transition-all duration-200 btn-tactile shadow-sm ${
              canScrollRight
                ? 'text-primary hover:border-slate-400 dark:hover:border-slate-700'
                : 'text-muted/40 cursor-not-allowed border-transparent'
            }`}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Rail Container with Edge Fade Mask */}
      <div className="relative group/rail">
        {/* Left Edge Fade */}
        <div
          className={`absolute left-0 top-0 bottom-3 w-8 bg-gradient-to-r from-main to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
            canScrollLeft ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Horizontal Scroll Area */}
        <div
          ref={scrollContainerRef}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-label={title}
          className="flex items-stretch gap-4 overflow-x-auto no-scrollbar pb-3 pt-1 px-1 content-rail-container focus:outline-none focus-visible:ring-1 focus-visible:ring-sky-500/50 rounded-2xl"
        >
          {children}
        </div>

        {/* Right Edge Fade */}
        <div
          className={`absolute right-0 top-0 bottom-3 w-8 bg-gradient-to-l from-main to-transparent pointer-events-none z-10 transition-opacity duration-300 ${
            canScrollRight ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </section>
  );
};

