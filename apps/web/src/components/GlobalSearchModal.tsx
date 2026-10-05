import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { getTechVisualConfig } from './ui/CourseVisual';
import {
  Search,
  BookOpen,
  ExternalLink,
  CornerDownLeft,
  X,
  Sparkles,
  Compass,
  LayoutDashboard,
  User,
  FolderSearch,
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAIMentor?: () => void;
}

type SearchCategory = 'ALL' | 'COURSES' | 'RESOURCES' | 'ACTIONS';

const QUICK_SUGGESTIONS = [
  { label: 'React', query: 'React', icon: '/course-icons/react.svg' },
  { label: 'Python', query: 'Python', icon: '/course-icons/python.svg' },
  { label: 'Docker', query: 'Docker', icon: '/course-icons/docker.svg' },
  { label: 'Kubernetes', query: 'Kubernetes', icon: '/course-icons/kubernetes.svg' },
  { label: 'Next.js', query: 'Next', icon: '/course-icons/nextjs.svg' },
  { label: 'SQL', query: 'SQL', icon: '/course-icons/sql.svg' },
  { label: 'Node.js', query: 'Node', icon: '/course-icons/nodejs.svg' },
  { label: 'AI & ML', query: 'LLM', icon: '/course-icons/ai.svg' },
];

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onOpenAIMentor,
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('ALL');
  const [courses, setCourses] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      apiFetch<any[]>('/courses')
        .then((data) => setCourses(data || []))
        .catch(() => {});
      apiFetch<any[]>('/resources')
        .then((data) => setResources(data || []))
        .catch(() => {});
    } else {
      setQuery('');
      setActiveCategory('ALL');
    }
  }, [isOpen]);

  // Reset selected index when query or category changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  const cleanQ = query.toLowerCase().trim();

  // 1. Quick Navigation Actions
  const quickActions = useMemo(() => {
    const actions = [
      {
        type: 'ACTION',
        id: 'action-catalog',
        title: 'Explore All Curricula',
        subtitle: 'Browse 20 technical learning tracks across 5 domains',
        url: '/catalog',
        isExternal: false,
        icon: Compass,
        badge: 'Curricula',
      },
      {
        type: 'ACTION',
        id: 'action-dashboard',
        title: 'Developer Dashboard',
        subtitle: 'Track your daily streak, active tracks, and next milestone',
        url: '/dashboard',
        isExternal: false,
        icon: LayoutDashboard,
        badge: 'Workspace',
      },
      {
        type: 'ACTION',
        id: 'action-profile',
        title: 'Skills & Competency Evidence',
        subtitle: 'View verified skills radar, badges, and certificates',
        url: '/profile',
        isExternal: false,
        icon: User,
        badge: 'Profile',
      },
    ];

    if (onOpenAIMentor) {
      actions.unshift({
        type: 'ACTION',
        id: 'action-ai-mentor',
        title: 'Ask AI Engineering Mentor',
        subtitle: 'Get architectural guidance, code reviews, and explanations',
        url: '#ai-mentor',
        isExternal: false,
        icon: Sparkles,
        badge: 'AI Mentor',
      });
    }

    if (!cleanQ) return actions;
    return actions.filter(
      (a) =>
        a.title.toLowerCase().includes(cleanQ) ||
        a.subtitle.toLowerCase().includes(cleanQ)
    );
  }, [cleanQ, onOpenAIMentor]);

  // 2. Matching Courses with authentic tech SVG metadata
  const matchingCourses = useMemo(() => {
    if (activeCategory === 'RESOURCES' || activeCategory === 'ACTIONS') return [];

    const filtered = courses.filter(
      (c) =>
        !cleanQ ||
        c.title.toLowerCase().includes(cleanQ) ||
        c.description.toLowerCase().includes(cleanQ) ||
        c.domain?.toLowerCase().includes(cleanQ) ||
        c.level?.toLowerCase().includes(cleanQ) ||
        c.skillsCovered?.some((s: string) => s.toLowerCase().includes(cleanQ))
    );

    return filtered.map((c) => {
      const tech = getTechVisualConfig(c);
      return {
        type: 'COURSE',
        id: c._id || c.slug,
        title: c.title,
        subtitle: `${c.domain || 'Engineering'} · ${c.level || 'All Levels'} · ~${c.estimatedHours || 40}h · ${c.modules?.length || 4} modules`,
        url: `/courses/${c.slug}`,
        isExternal: false,
        iconSrc: tech.iconSrc,
        techTag: tech.tag,
        badge: c.domain || 'Course',
        rawCourse: c,
      };
    });
  }, [courses, cleanQ, activeCategory]);

  // 3. Matching Resources
  const matchingResources = useMemo(() => {
    if (activeCategory === 'COURSES' || activeCategory === 'ACTIONS') return [];

    const filtered = resources.filter(
      (r) =>
        !cleanQ ||
        r.title.toLowerCase().includes(cleanQ) ||
        r.provider?.toLowerCase().includes(cleanQ) ||
        r.description?.toLowerCase().includes(cleanQ)
    );

    return filtered.map((r) => ({
      type: 'RESOURCE',
      id: r._id,
      title: r.title,
      subtitle: `${r.provider || 'Official Docs'} · ${r.license || 'Verified'} · ${r.mediaType || 'DOC'}`,
      url: r.canonicalUrl,
      isExternal: true,
      icon: ExternalLink,
      badge: r.provider || 'Docs',
    }));
  }, [resources, cleanQ, activeCategory]);

  // Combined Results based on query & active tab
  const allResults = useMemo(() => {
    const list: any[] = [];
    if (!cleanQ) {
      if (activeCategory === 'ALL' || activeCategory === 'ACTIONS') {
        list.push(...quickActions);
      }
      if (activeCategory === 'ALL' || activeCategory === 'COURSES') {
        list.push(...matchingCourses.slice(0, 6));
      }
      if (activeCategory === 'ALL' || activeCategory === 'RESOURCES') {
        list.push(...matchingResources.slice(0, 4));
      }
      return list;
    }

    if (activeCategory === 'ALL') {
      list.push(...matchingCourses.slice(0, 6));
      list.push(...matchingResources.slice(0, 4));
      list.push(...quickActions.slice(0, 2));
    } else if (activeCategory === 'COURSES') {
      list.push(...matchingCourses);
    } else if (activeCategory === 'RESOURCES') {
      list.push(...matchingResources);
    } else if (activeCategory === 'ACTIONS') {
      list.push(...quickActions);
    }
    return list;
  }, [cleanQ, activeCategory, quickActions, matchingCourses, matchingResources]);

  const handleSelect = (item: any) => {
    if (!item) return;
    onClose();
    if (item.url === '#ai-mentor' && onOpenAIMentor) {
      onOpenAIMentor();
    } else if (item.isExternal) {
      window.open(item.url, '_blank', 'noopener,noreferrer');
    } else {
      navigate(item.url);
    }
  };

  // Keyboard navigation listener (ArrowUp, ArrowDown, Enter, Tab, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (allResults.length > 0 ? (prev + 1) % allResults.length : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (allResults.length > 0 ? (prev - 1 + allResults.length) % allResults.length : 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allResults[selectedIndex]) {
          handleSelect(allResults[selectedIndex]);
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const categories: SearchCategory[] = ['ALL', 'COURSES', 'RESOURCES', 'ACTIONS'];
        const currentIdx = categories.indexOf(activeCategory);
        const nextIdx = e.shiftKey
          ? (currentIdx - 1 + categories.length) % categories.length
          : (currentIdx + 1) % categories.length;
        setActiveCategory(categories[nextIdx]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, allResults, selectedIndex, activeCategory, onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-[10vh] sm:pt-[14vh] p-3 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-xl bg-surface border border-subtle shadow-2xl overflow-hidden flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-subtle bg-surface">
          <Search className="h-4 w-4 text-muted shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search curricula, docs, shortcuts..."
            className="w-full bg-transparent text-sm text-primary placeholder:text-muted outline-none font-sans font-normal"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-muted hover:text-primary transition mr-2 cursor-pointer"
              aria-label="Clear query"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <kbd className="font-mono text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-surface-elevated text-muted border border-subtle select-none">
            ESC
          </kbd>
        </div>

        {/* Category Scope Tabs */}
        <div className="flex items-center gap-1 px-4 py-1.5 border-b border-subtle bg-surface-elevated/40 overflow-x-auto no-scrollbar">
          {(
            [
              { id: 'ALL', label: 'All' },
              { id: 'COURSES', label: 'Curricula' },
              { id: 'RESOURCES', label: 'Docs' },
              { id: 'ACTIONS', label: 'Shortcuts' },
            ] as const
          ).map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors select-none shrink-0 ${
                  isSelected
                    ? 'bg-surface text-primary font-medium border border-subtle shadow-2xs'
                    : 'text-muted hover:text-primary hover:bg-surface-elevated/80'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Quick Suggestion Chips (Visible on empty query or when starting search) */}
        {!cleanQ && activeCategory === 'ALL' && (
          <div className="px-4 py-2.5 border-b border-subtle bg-surface">
            <div className="text-[10px] font-mono text-muted uppercase tracking-wider mb-2">
              Popular Technologies
            </div>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SUGGESTIONS.map((sug) => (
                <button
                  key={sug.label}
                  onClick={() => setQuery(sug.query)}
                  className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-surface-elevated border border-subtle text-xs font-mono text-secondary hover:text-primary hover:border-border transition-colors cursor-pointer"
                >
                  <img
                    src={sug.icon}
                    alt=""
                    className="w-3.5 h-3.5 object-contain"
                  />
                  <span>{sug.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Container */}
        <div
          ref={resultsContainerRef}
          className="max-h-[340px] sm:max-h-[380px] overflow-y-auto p-1.5 space-y-0.5"
        >
          {allResults.length > 0 ? (
            allResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const IconComp = item.icon;

              return (
                <div
                  key={`${item.type}-${item.id}`}
                  data-active={isSelected}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-2 rounded-lg transition-colors cursor-pointer flex items-center justify-between group border ${
                    isSelected
                      ? 'bg-surface-elevated border-subtle text-primary'
                      : 'border-transparent hover:bg-surface-elevated/60 text-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden flex-1 mr-2">
                    {/* Item Avatar / Tech Logo / Action Icon */}
                    <div
                      className={`h-7 w-7 rounded-md flex items-center justify-center shrink-0 border ${
                        isSelected
                          ? 'bg-surface border-subtle'
                          : 'bg-surface-elevated border-subtle'
                      }`}
                    >
                      {item.iconSrc ? (
                        <img
                          src={item.iconSrc}
                          alt={item.title}
                          className="w-4 h-4 object-contain"
                        />
                      ) : IconComp ? (
                        <IconComp className="h-3.5 w-3.5 text-muted group-hover:text-primary transition-colors" />
                      ) : (
                        <BookOpen className="h-3.5 w-3.5 text-muted" />
                      )}
                    </div>

                    {/* Title & Metadata */}
                    <div className="space-y-0.5 overflow-hidden flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-medium truncate ${
                            isSelected ? 'text-primary font-semibold' : 'text-primary'
                          }`}
                        >
                          {item.title}
                        </span>
                        {item.techTag && (
                          <span className="hidden sm:inline-block font-mono text-[9px] px-1 py-0.2 rounded bg-surface border border-subtle text-muted">
                            {item.techTag}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-muted font-mono truncate">
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Right Action & Badge */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-surface text-muted border border-subtle">
                      {item.badge}
                    </span>
                    <CornerDownLeft
                      className={`h-3 w-3 transition-opacity ${
                        isSelected ? 'opacity-100 text-muted' : 'opacity-0 group-hover:opacity-60 text-muted'
                      }`}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-10 px-4 text-center space-y-1">
              <div className="h-8 w-8 rounded-full bg-surface-elevated border border-subtle flex items-center justify-center mx-auto text-muted mb-2">
                <FolderSearch className="h-4 w-4" />
              </div>
              <p className="text-xs font-mono text-primary font-medium">
                No matches found for "{query}"
              </p>
              <p className="text-[11px] text-muted font-mono">
                Try searching for <button onClick={() => setQuery('react')} className="text-primary underline cursor-pointer">react</button>, <button onClick={() => setQuery('python')} className="text-primary underline cursor-pointer">python</button>, or <button onClick={() => setQuery('docker')} className="text-primary underline cursor-pointer">docker</button>.
              </p>
            </div>
          )}
        </div>

        {/* Minimal Command Palette Footer */}
        <div className="px-4 py-2 bg-surface-elevated/40 border-t border-subtle flex items-center justify-between text-[11px] text-muted font-mono">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded bg-surface border border-subtle text-muted text-[10px]">
                ↑↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded bg-surface border border-subtle text-muted text-[10px]">
                ↵
              </kbd>
              select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded bg-surface border border-subtle text-muted text-[10px]">
                Tab
              </kbd>
              filter
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <kbd className="px-1 py-0.2 rounded bg-surface border border-subtle text-muted text-[10px]">
                Esc
              </kbd>
              close
            </span>
          </div>
          <span className="text-[10px] text-muted">
            {allResults.length} {allResults.length === 1 ? 'result' : 'results'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;

