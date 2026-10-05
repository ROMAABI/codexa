import React, { useState, useRef, useEffect } from 'react';
import { useTheme, ThemePreference } from '../context/ThemeContext';
import { Sun, Moon, Laptop, Check } from 'lucide-react';

interface ThemeSelectorProps {
  variant?: 'compact' | 'segmented' | 'cards';
  className?: string;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const options: {
    value: ThemePreference;
    label: string;
    icon: React.FC<{ className?: string }>;
    iconStyle: string;
    description: string;
  }[] = [
    {
      value: 'light',
      label: 'Light',
      icon: Sun,
      iconStyle: 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/25',
      description: 'Crisp optical high-contrast light canvas',
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: Moon,
      iconStyle: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
      description: 'Deep carbon architectural dark canvas',
    },
    {
      value: 'system',
      label: 'System',
      icon: Laptop,
      iconStyle: 'text-sky-600 dark:text-sky-400 bg-sky-500/10 border-sky-500/25',
      description: `Sync with OS preferences (Currently ${resolvedTheme})`,
    },
  ];

  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-xl bg-surface border border-subtle shadow-sm ${className}`}
        role="radiogroup"
        aria-label="Theme selector"
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setTheme(opt.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition cursor-pointer ${
                isSelected
                  ? 'bg-sky-500 text-white font-bold shadow-xs'
                  : 'text-muted hover:text-primary'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{opt.label.toUpperCase()}</span>
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'cards') {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3.5 ${className}`}>
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => setTheme(opt.value)}
              className={`relative flex flex-col items-start p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                isSelected
                  ? 'border-sky-500 dark:border-sky-400 bg-sky-500/[0.04] dark:bg-sky-400/[0.06] ring-2 ring-sky-500/20 dark:ring-sky-400/20 shadow-sm'
                  : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c121e] hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50/50 dark:hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-3.5">
                <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${opt.iconStyle}`}>
                  <Icon className="h-4 w-4" />
                </div>
                {isSelected && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-sky-600 dark:text-sky-400 bg-sky-500/10 dark:bg-sky-400/10 border border-sky-500/30 dark:border-sky-400/30 px-2.5 py-0.5 rounded-full shadow-2xs">
                    <Check className="h-3 w-3 stroke-[2.5]" />
                    ACTIVE
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 block">
                  {opt.label}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed block font-sans">
                  {opt.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  // Default: Compact popover / dropdown
  const ActiveIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Laptop;

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme dropdown"
        title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
        className="flex items-center justify-center h-8 w-8 rounded-lg bg-surface border border-subtle text-secondary hover:text-primary hover:border-border transition cursor-pointer"
      >
        <ActiveIcon className="h-3.5 w-3.5 text-secondary" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-38 rounded-xl craft-card shadow-2xl p-1.5 space-y-1 z-50 text-xs backdrop-blur-2xl">
          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setTheme(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition cursor-pointer font-mono text-xs ${
                  isSelected
                    ? 'bg-accent/15 text-accent font-bold border border-accent/30'
                    : 'text-muted hover:bg-surface-elevated hover:text-primary'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5" />
                  <span>{opt.label}</span>
                </div>
                {isSelected && <Check className="h-3 w-3" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
