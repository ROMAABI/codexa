import React from 'react';

interface CodexaLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  className?: string;
  iconOnly?: boolean;
}

export const CodexaLogo: React.FC<CodexaLogoProps> = ({
  size = 'sm',
  showWordmark = true,
  className = '',
  iconOnly = false,
}) => {
  const sizeMap = {
    sm: { box: 'h-8 w-8', icon: 32, text: 'text-sm font-bold tracking-widest' },
    md: { box: 'h-9 w-9', icon: 36, text: 'text-base font-bold tracking-widest' },
    lg: { box: 'h-11 w-11', icon: 44, text: 'text-xl font-extrabold tracking-widest' },
    xl: { box: 'h-14 w-14', icon: 56, text: 'text-2xl font-black tracking-widest' },
  };

  const currentSize = sizeMap[size] || sizeMap.sm;

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric Codexa Icon Mark */}
      <div className={`relative ${currentSize.box} shrink-0 flex items-center justify-center rounded-lg bg-surface-elevated border border-subtle transition-all duration-200 group-hover:border-sky-500/50 group-hover:shadow-[0_0_16px_rgba(56,189,248,0.2)]`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1.5"
        >
          <defs>
            <linearGradient id="codexa_glyph_grad" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>
          </defs>

          {/* Precision C Spine & Outer Compiler Bracket */}
          <path
            d="M26 10H14.5C11.4624 10 9 12.4624 9 15.5V20.5C9 23.5376 11.4624 26 14.5 26H26"
            stroke="url(#codexa_glyph_grad)"
            strokeWidth="2.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Terminal / Code Prompt Chevron */}
          <path
            d="M15 14.5L19 18L15 21.5"
            className="stroke-slate-900 dark:stroke-white"
            strokeWidth="2.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Execution Nexus Dot */}
          <circle cx="23.5" cy="18" r="1.5" className="fill-sky-500 dark:fill-sky-400" />
        </svg>
      </div>

      {/* Wordmark */}
      {!iconOnly && showWordmark && (
        <span className={`font-mono text-primary uppercase ${currentSize.text}`}>
          CODEXA
        </span>
      )}
    </div>
  );
};

export default CodexaLogo;
