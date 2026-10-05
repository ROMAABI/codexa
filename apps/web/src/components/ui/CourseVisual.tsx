import React, { useState } from 'react';
import { CourseDTO } from '@codexa/shared';

interface CourseVisualProps {
  course: CourseDTO | any;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

interface TechVisualConfig {
  name: string;
  tag: string;
  accentColor: string;
  iconSrc: string;
}

export const getTechVisualConfig = (course: CourseDTO | any): TechVisualConfig => {
  const slug = (course?.slug || '').toLowerCase();
  const title = (course?.title || '').toLowerCase();
  const domain = (course?.domain || '').toLowerCase();

  // 1. React
  if (slug === 'react-js' || slug.includes('react')) {
    return {
      name: 'React',
      tag: 'REACT 19',
      accentColor: '#61DAFB',
      iconSrc: '/course-icons/react.svg',
    };
  }

  // 2. Next.js
  if (slug === 'next-js' || slug.includes('next')) {
    return {
      name: 'Next.js',
      tag: 'NEXT.JS 15',
      accentColor: '#38BDF8',
      iconSrc: '/course-icons/nextjs.svg',
    };
  }

  // 3. MERN Stack
  if (slug === 'mern-stack-development' || slug.includes('mern')) {
    return {
      name: 'MERN Stack',
      tag: 'MERN STACK',
      accentColor: '#10B981',
      iconSrc: '/course-icons/react.svg',
    };
  }

  // 4. Frontend Development
  if (slug === 'frontend-development' || (domain.includes('web') && slug.includes('front'))) {
    return {
      name: 'Frontend Web',
      tag: 'HTML5 & CSS3',
      accentColor: '#E44D26',
      iconSrc: '/course-icons/html5.svg',
    };
  }

  // 5. Node.js & Backend
  if (slug === 'backend-development-nodejs' || slug.includes('node') || slug.includes('backend')) {
    return {
      name: 'Node.js',
      tag: 'NODE.JS',
      accentColor: '#539E43',
      iconSrc: '/course-icons/nodejs.svg',
    };
  }

  // 6. JavaScript
  if (slug === 'javascript-fundamentals' || slug.includes('javascript') || slug === 'js') {
    return {
      name: 'JavaScript',
      tag: 'JAVASCRIPT',
      accentColor: '#F7DF1E',
      iconSrc: '/course-icons/javascript.svg',
    };
  }

  // 7. TypeScript
  if (slug.includes('typescript') || slug === 'ts') {
    return {
      name: 'TypeScript',
      tag: 'TYPESCRIPT',
      accentColor: '#3178C6',
      iconSrc: '/course-icons/typescript.svg',
    };
  }

  // 8. Python
  if (slug === 'python-programming' || slug.includes('python')) {
    return {
      name: 'Python',
      tag: 'PYTHON 3.12',
      accentColor: '#3776AB',
      iconSrc: '/course-icons/python.svg',
    };
  }

  // 9. Java
  if (slug === 'java-programming' || slug.includes('java-') || title.includes('java ')) {
    return {
      name: 'Java',
      tag: 'JAVA 21',
      accentColor: '#E76F00',
      iconSrc: '/course-icons/java.svg',
    };
  }

  // 10. C++
  if (slug === 'cpp-programming' || slug.includes('cpp') || slug.includes('c++') || title.includes('c++')) {
    return {
      name: 'C++',
      tag: 'ISO C++20',
      accentColor: '#00599C',
      iconSrc: '/course-icons/cpp.svg',
    };
  }

  // 11. Go / Golang
  if (slug === 'go-programming' || slug.includes('go-') || title.includes('go ') || slug === 'golang') {
    return {
      name: 'Go',
      tag: 'GOLANG',
      accentColor: '#00ADD8',
      iconSrc: '/course-icons/go.svg',
    };
  }

  // 12. SQL & Relational Databases
  if (slug === 'sql-databases' || slug.includes('sql') || slug.includes('postgres')) {
    return {
      name: 'SQL Databases',
      tag: 'SQL & RELATIONAL',
      accentColor: '#336791',
      iconSrc: '/course-icons/sql.svg',
    };
  }

  // 13. MySQL
  if (slug.includes('mysql')) {
    return {
      name: 'MySQL',
      tag: 'MYSQL',
      accentColor: '#00758F',
      iconSrc: '/course-icons/mysql.svg',
    };
  }

  // 14. MongoDB
  if (slug === 'mongodb-development' || slug.includes('mongo')) {
    return {
      name: 'MongoDB',
      tag: 'MONGODB',
      accentColor: '#47A248',
      iconSrc: '/course-icons/mongodb.svg',
    };
  }

  // 15. Docker
  if (slug === 'docker-containers' || slug.includes('docker') || slug.includes('container')) {
    return {
      name: 'Docker',
      tag: 'DOCKER',
      accentColor: '#2496ED',
      iconSrc: '/course-icons/docker.svg',
    };
  }

  // 16. Kubernetes
  if (slug === 'kubernetes-orchestration' || slug.includes('kubernetes') || slug.includes('k8s')) {
    return {
      name: 'Kubernetes',
      tag: 'KUBERNETES',
      accentColor: '#326CE5',
      iconSrc: '/course-icons/kubernetes.svg',
    };
  }

  // 17. AWS Cloud
  if (slug === 'aws-cloud-fundamentals' || slug.includes('aws') || slug.includes('cloud')) {
    return {
      name: 'AWS Cloud',
      tag: 'AWS CLOUD',
      accentColor: '#FF9900',
      iconSrc: '/course-icons/aws.svg',
    };
  }

  // 18. Linux Fundamentals
  if (slug === 'linux-fundamentals' || slug.includes('linux')) {
    return {
      name: 'Linux',
      tag: 'LINUX OS',
      accentColor: '#FFA500',
      iconSrc: '/course-icons/linux.svg',
    };
  }

  // 19. Git & GitHub
  if (slug === 'git-and-github' || slug.includes('git')) {
    return {
      name: 'Git & GitHub',
      tag: 'GIT & GITHUB',
      accentColor: '#F05032',
      iconSrc: '/course-icons/git.svg',
    };
  }

  // 20. Machine Learning
  if (slug === 'machine-learning' || (domain.includes('ai') && !slug.includes('deep') && !slug.includes('llm'))) {
    return {
      name: 'Machine Learning',
      tag: 'TENSORFLOW',
      accentColor: '#FF6F00',
      iconSrc: '/course-icons/tensorflow.svg',
    };
  }

  // 21. Deep Learning
  if (slug === 'deep-learning' || slug.includes('deep-learning')) {
    return {
      name: 'Deep Learning',
      tag: 'PYTORCH',
      accentColor: '#EE4C2C',
      iconSrc: '/course-icons/pytorch.svg',
    };
  }

  // 22. LLM & Generative AI
  if (slug === 'llm-development' || slug.includes('llm') || title.includes('language model') || title.includes('generative')) {
    return {
      name: 'Generative AI',
      tag: 'OPENAI & LLM',
      accentColor: '#10A37F',
      iconSrc: '/course-icons/ai.svg',
    };
  }

  // Default / Fallback
  return {
    name: course?.title || 'Engineering',
    tag: (course?.domain || 'CODEXA').toUpperCase(),
    accentColor: '#38BDF8',
    iconSrc: '/course-icons/react.svg',
  };
};

export const CourseVisual: React.FC<CourseVisualProps> = ({
  course,
  className = '',
}) => {
  const config = getTechVisualConfig(course);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className={`relative w-full aspect-[16/9] overflow-hidden bg-[#f4f7fb] dark:bg-[#090d16] flex items-center justify-center border-b border-subtle dark:border-white/[0.08] select-none ${className}`}
    >
      {/* Background Engineering Blueprint Grid */}
      <div className="absolute inset-0 opacity-[0.35] dark:opacity-[0.12] bg-[radial-gradient(#38bdf8_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.4)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

      {/* Light Mode Subtle Radial Aura */}
      <div
        className="absolute inset-0 dark:hidden opacity-30 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${config.accentColor}25 0%, transparent 72%)`,
        }}
      />

      {/* Dark Mode Ambient Radial Halo */}
      <div
        className="absolute inset-0 hidden dark:block opacity-65 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${config.accentColor}30 0%, ${config.accentColor}08 50%, transparent 75%)`,
        }}
      />

      {/* Ambient Pulsing Glow Core */}
      <div
        className="absolute w-24 h-24 rounded-full blur-2xl opacity-20 dark:opacity-40 group-hover:opacity-60 transition-all duration-300 pointer-events-none"
        style={{ backgroundColor: config.accentColor }}
      />

      {/* Real SVG Technology Icon */}
      <div
        className="relative z-10 flex items-center justify-center transform group-hover:scale-110 group-hover:-translate-y-0.5 transition-all duration-300 ease-out"
        style={{
          filter: `drop-shadow(0 6px 14px ${config.accentColor}40)`,
        }}
      >
        {!imgError ? (
          <img
            src={config.iconSrc}
            alt={config.name}
            onError={() => setImgError(true)}
            className="w-14 h-14 sm:w-16 sm:h-16 object-contain pointer-events-none transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl flex items-center justify-center font-mono font-bold text-lg text-white shadow-md"
            style={{ backgroundColor: config.accentColor }}
          >
            {config.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </div>

      {/* Bottom Technical Moniker Tag Badge */}
      <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none">
        <span className="font-mono text-[9px] tracking-widest font-bold px-2 py-0.5 rounded-md bg-white/95 dark:bg-[#050810]/95 text-slate-800 dark:text-slate-200 border border-slate-200/90 dark:border-white/15 shadow-xs backdrop-blur-md">
          {config.tag}
        </span>
      </div>
    </div>
  );
};

// Export CourseThumbnail as alias for full backward-compatibility
export const CourseThumbnail = CourseVisual;
export default CourseVisual;
