import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { CourseDTO } from '@codexa/shared';
import { ContentRail } from '../components/ui/ContentRail';
import { CourseCard } from '../components/ui/CourseCard';
import { SkillCard } from '../components/ui/SkillCard';
import { ProjectCard } from '../components/ui/ProjectCard';
import {
  Sparkles,
  Compass,
  Play,
  Zap,
  BookOpen,
  Code2,
  Terminal,
  Cpu,
  Database,
  Cloud,
  BrainCircuit,
  Search,
  CheckCircle,
  X,
  FolderSearch,
} from 'lucide-react';

const POPULAR_TOPICS = [
  { label: 'React', query: 'react', icon: '/course-icons/react.svg' },
  { label: 'Python', query: 'python', icon: '/course-icons/python.svg' },
  { label: 'Docker', query: 'docker', icon: '/course-icons/docker.svg' },
  { label: 'Kubernetes', query: 'kubernetes', icon: '/course-icons/kubernetes.svg' },
  { label: 'Next.js', query: 'next', icon: '/course-icons/nextjs.svg' },
  { label: 'SQL', query: 'sql', icon: '/course-icons/sql.svg' },
  { label: 'AI & ML', query: 'learning', icon: '/course-icons/tensorflow.svg' },
  { label: 'Node.js', query: 'node', icon: '/course-icons/nodejs.svg' },
];

import { useDocumentTitle } from '../hooks/useDocumentTitle';

export const CatalogPage: React.FC = () => {
  useDocumentTitle('Curricula & Tracks');
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseDTO[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Quick keyboard shortcut '/' to focus catalog search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    async function loadCatalogData() {
      try {
        const [cData, userSkillsData, pData, progData, publicSkillsData] = await Promise.all([
          apiFetch<CourseDTO[]>('/courses'),
          user ? apiFetch<any[]>('/skills/my-skills').catch(() => []) : Promise.resolve([]),
          apiFetch<any[]>('/projects').catch(() => []),
          user ? apiFetch<any[]>('/progress/my-courses').catch(() => []) : Promise.resolve([]),
          apiFetch<any[]>('/skills').catch(() => []),
        ]);
        setCourses(cData || []);

        if (user && userSkillsData && userSkillsData.length > 0) {
          const userSkillMap = new Map(userSkillsData.map((s: any) => [s.skillSlug || s.slug, s]));
          const merged = (publicSkillsData || []).map((ps: any) => {
            const uSkill = userSkillMap.get(ps.slug || ps.skillSlug);
            return uSkill ? { ...ps, ...uSkill, isAssessed: true } : ps;
          });
          setSkills(merged);
        } else {
          setSkills(publicSkillsData || []);
        }

        setProjects(pData || []);
        setMyCourses(progData || []);
      } catch (err) {
        console.error('Failed to fetch catalog:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalogData();
  }, [user]);

  const featuredCourse = courses.find((c) => c.slug === 'javascript-fundamentals') || courses[0];

  const getProgressForCourse = (courseIdOrSlug: string) => {
    const found = myCourses.find(
      (p) => p.courseId?._id === courseIdOrSlug || p.courseId?.slug === courseIdOrSlug
    );
    return found ? found.percentComplete : 0;
  };

  const categories = [
    { id: 'ALL', label: 'All Tracks' },
    { id: 'Web Development', label: '1. Web Development' },
    { id: 'Programming Languages', label: '2. Programming Languages' },
    { id: 'Database & Data', label: '3. Database & Data' },
    { id: 'AI & Machine Learning', label: '4. AI & Machine Learning' },
    { id: 'DevOps / Cloud / Systems', label: '5. DevOps / Cloud / Systems' },
  ];

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const matchesCategory =
        activeCategory === 'ALL' ||
        c.domain?.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.skillsCovered?.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [courses, activeCategory, searchQuery]);

  const coursesByDomain = useMemo(() => {
    const map = new Map<string, CourseDTO[]>();
    courses.forEach((c) => {
      const d = c.domain || 'Other';
      if (!map.has(d)) map.set(d, []);
      map.get(d)!.push(c);
    });
    return map;
  }, [courses]);

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-muted font-mono text-xs">
        <Sparkles className="h-4 w-4 animate-spin text-accent mr-2" />
        Configuring technical universe...
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      {/* 1. HERO (Architectural Craft & Editorial Header inspired by jeffmilanes.com) */}
      <div className="border-b border-subtle py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
          <div className="space-y-3 max-w-3xl">
            <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-primary tracking-[-0.045em] leading-[1.0] sm:leading-[1.02]">
              Curricula built for practitioners.
            </h1>

            <p className="text-sm sm:text-base text-secondary leading-relaxed max-w-2xl font-normal">
              Master systems engineering with a structured four-stage execution pipeline: verified lessons, comprehensive interactive notes, sandboxed Monaco code drills, and calibrated skill assessments.
            </p>
          </div>

          {/* 4-Phase Blueprint Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            <div className="craft-card p-4 space-y-1">
              <span className="text-xs font-semibold text-accent block">Phase 01</span>
              <h3 className="text-sm font-semibold text-primary">Think</h3>
              <p className="text-xs text-muted leading-relaxed font-normal">
                Understand architecture and system mechanics with focused instruction.
              </p>
            </div>
            <div className="craft-card p-4 space-y-1">
              <span className="text-xs font-semibold text-accent block">Phase 02</span>
              <h3 className="text-sm font-semibold text-primary">Design</h3>
              <p className="text-xs text-muted leading-relaxed font-normal">
                Interactive notes, live syntax snippets, and runnable code blocks.
              </p>
            </div>
            <div className="craft-card p-4 space-y-1">
              <span className="text-xs font-semibold text-accent block">Phase 03</span>
              <h3 className="text-sm font-semibold text-primary">Build</h3>
              <p className="text-xs text-muted leading-relaxed font-normal">
                Monaco sandbox execution with live unit tests and instant feedback.
              </p>
            </div>
            <div className="craft-card p-4 space-y-1">
              <span className="text-xs font-semibold text-accent block">Phase 04</span>
              <h3 className="text-sm font-semibold text-primary">Ship</h3>
              <p className="text-xs text-muted leading-relaxed font-normal">
                Calibrated quizzes that verify skill competencies and build track record.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. COURSES & FILTER CONTROLS */}
      <div id="courses" className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        {/* Category Filter Pills & Minimal Search Bar */}
        <div className="space-y-3 pb-4 border-b border-subtle">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1 rounded-md text-xs font-mono transition-colors shrink-0 ${
                      isSelected
                        ? 'bg-primary text-main font-medium shadow-2xs'
                        : 'bg-surface border border-subtle text-secondary hover:text-primary hover:bg-surface-elevated'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Minimal Search Input */}
            <div className="w-full lg:w-72 shrink-0 relative">
              <Search
                className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Filter curricula & skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 rounded-lg bg-surface border border-subtle text-xs font-mono text-primary placeholder:text-muted outline-none focus:border-border transition-colors"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted hover:text-primary transition cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3" />
                </button>
              ) : (
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted select-none">
                  /
                </span>
              )}
            </div>
          </div>

          {/* Quick Topic Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-0.5">
            <span className="text-[10px] font-mono text-muted uppercase tracking-wider shrink-0 mr-1">
              TOPICS:
            </span>
            {POPULAR_TOPICS.map((topic) => {
              const isActive = searchQuery.toLowerCase() === topic.query.toLowerCase();
              return (
                <button
                  key={topic.label}
                  onClick={() => setSearchQuery(isActive ? '' : topic.query)}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-mono transition-colors shrink-0 cursor-pointer border ${
                    isActive
                      ? 'bg-surface-elevated text-primary border-border font-medium'
                      : 'bg-surface border-subtle text-muted hover:text-primary hover:border-border'
                  }`}
                >
                  <img src={topic.icon} alt="" className="w-3 h-3 object-contain" />
                  <span>{topic.label}</span>
                </button>
              );
            })}
            {(searchQuery || activeCategory !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('ALL');
                }}
                className="text-[11px] font-mono text-muted hover:text-primary underline shrink-0 ml-2"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Continue Learning Rail */}
        {myCourses.length > 0 && activeCategory === 'ALL' && !searchQuery && (
          <ContentRail
            title="Active Enrolled Tracks"
            subtitle="Pick up where you left off"
            icon={<Play className="h-4 w-4 text-primary fill-current" />}
            badge={`${myCourses.length} Enrolled`}
          >
            {myCourses.map((enr) => {
              const c = enr.courseId;
              if (!c) return null;
              return (
                <CourseCard
                  key={enr._id}
                  course={c}
                  progressPercent={enr.percentComplete}
                  className="w-[280px]"
                />
              );
            })}
          </ContentRail>
        )}

        {/* Filtered Grid or Domain Rails */}
        {activeCategory !== 'ALL' || searchQuery ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
                <span>{activeCategory === 'ALL' ? 'Search Results' : activeCategory}</span>
                <span className="text-xs text-muted">({filteredCourses.length} Curricula)</span>
              </h3>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="p-12 text-center rounded-2xl craft-card space-y-4 max-w-xl mx-auto">
                <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 flex items-center justify-center mx-auto text-slate-400">
                  <FolderSearch className="h-6 w-6" />
                </div>
                <div className="space-y-1 font-mono">
                  <p className="text-sm font-bold text-primary">No curricula found matching "{searchQuery}"</p>
                  <p className="text-xs text-muted">
                    Try another search term or click one of the popular topics below:
                  </p>
                </div>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {POPULAR_TOPICS.slice(0, 4).map((topic) => (
                    <button
                      key={topic.label}
                      onClick={() => setSearchQuery(topic.query)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-surface-elevated border border-subtle text-xs font-mono text-secondary hover:text-primary hover:border-accent transition"
                    >
                      <img src={topic.icon} alt={topic.label} className="w-3.5 h-3.5 object-contain" />
                      <span>{topic.label}</span>
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setActiveCategory('ALL');
                    setSearchQuery('');
                  }}
                  className="text-xs text-accent underline pt-2 font-semibold font-mono inline-block hover:opacity-80"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id || course.slug}
                    course={course}
                    progressPercent={getProgressForCourse(course.id || course.slug)}
                    className="w-full"
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-10">
            {/* 1. Web Development */}
            {coursesByDomain.has('Web Development') && (
              <ContentRail
                title="1. Web Development"
                subtitle="Frontend, Backend, React, Next.js, and Full-Stack MERN applications"
                icon={<Code2 className="h-4 w-4 text-primary" />}
                badge="5 Tracks"
              >
                {(coursesByDomain.get('Web Development') || []).map((course) => (
                  <CourseCard
                    key={course.id || course.slug}
                    course={course}
                    progressPercent={getProgressForCourse(course.id || course.slug)}
                  />
                ))}
              </ContentRail>
            )}

            {/* 2. Programming Languages */}
            {(coursesByDomain.has('Programming Languages') || coursesByDomain.has('Programming')) && (
              <ContentRail
                title="2. Programming Languages"
                subtitle="JavaScript, Python, Java, C++, and Go systems programming"
                icon={<Cpu className="h-4 w-4 text-primary" />}
                badge="5 Tracks"
              >
                {(coursesByDomain.get('Programming Languages') || coursesByDomain.get('Programming') || []).map((course) => (
                  <CourseCard
                    key={course.id || course.slug}
                    course={course}
                    progressPercent={getProgressForCourse(course.id || course.slug)}
                  />
                ))}
              </ContentRail>
            )}

            {/* 3. Database & Data */}
            {(coursesByDomain.has('Database & Data') || coursesByDomain.has('Databases')) && (
              <ContentRail
                title="3. Database & Data"
                subtitle="Relational SQL, indexing, and MongoDB document aggregation pipelines"
                icon={<Database className="h-4 w-4 text-primary" />}
                badge="2 Tracks"
              >
                {(coursesByDomain.get('Database & Data') || coursesByDomain.get('Databases') || []).map((course) => (
                  <CourseCard
                    key={course.id || course.slug}
                    course={course}
                    progressPercent={getProgressForCourse(course.id || course.slug)}
                  />
                ))}
              </ContentRail>
            )}

            {/* 4. AI & Machine Learning */}
            {(coursesByDomain.has('AI & Machine Learning') || coursesByDomain.has('Artificial Intelligence')) && (
              <ContentRail
                title="4. AI & Machine Learning"
                subtitle="Machine Learning foundations, Deep Learning neural networks, and LLM generative applications"
                icon={<BrainCircuit className="h-4 w-4 text-primary" />}
                badge="3 Tracks"
              >
                {(coursesByDomain.get('AI & Machine Learning') || coursesByDomain.get('Artificial Intelligence') || []).map((course) => (
                  <CourseCard
                    key={course.id || course.slug}
                    course={course}
                    progressPercent={getProgressForCourse(course.id || course.slug)}
                  />
                ))}
              </ContentRail>
            )}

            {/* 5. DevOps / Cloud / Systems */}
            {(coursesByDomain.has('DevOps / Cloud / Systems') || coursesByDomain.has('DevOps & Systems') || coursesByDomain.has('DevOps & Cloud')) && (
              <ContentRail
                title="5. DevOps / Cloud / Systems"
                subtitle="Linux administration, Git workflows, Docker containers, Kubernetes orchestration, and AWS cloud"
                icon={<Cloud className="h-4 w-4 text-primary" />}
                badge="5 Tracks"
              >
                {(coursesByDomain.get('DevOps / Cloud / Systems') || coursesByDomain.get('DevOps & Systems') || coursesByDomain.get('DevOps & Cloud') || []).map((course) => (
                  <CourseCard
                    key={course.id || course.slug}
                    course={course}
                    progressPercent={getProgressForCourse(course.id || course.slug)}
                  />
                ))}
              </ContentRail>
            )}
          </div>
        )}

        {/* SKILLS RAIL */}
        {skills.length > 0 && (
          <ContentRail
            title="Verifiable Technical Skills"
            subtitle="Calibrated continuously from quizzes and code drills"
            icon={<Zap className="h-4 w-4 text-sky-400" />}
            badge="Calibrated"
          >
            {skills.map((s, idx) => (
              <SkillCard key={s._id || s.slug || s.skillSlug || idx} skill={s} />
            ))}
          </ContentRail>
        )}

        {/* CAPSTONE PROJECTS RAIL */}
        {projects.length > 0 && (
          <ContentRail
            title="Capstone Projects"
            subtitle="Put theory into practice by assembling real multi-file software applications"
            icon={<Terminal className="h-4 w-4 text-primary" />}
            badge="Architect"
          >
            {projects.map((proj) => (
              <ProjectCard key={proj._id || proj.slug} project={proj} />
            ))}
          </ContentRail>
        )}
      </div>
    </div>
  );
};
