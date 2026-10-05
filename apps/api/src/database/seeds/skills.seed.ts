import { SkillModel } from '../models/Skill';

export async function seedSkills() {
  const skillsData = [
    // Web & Frontend
    {
      slug: 'javascript-fundamentals',
      name: 'JavaScript Fundamentals',
      category: 'LANGUAGE',
      description: 'Variables, functions, scope, closures, array methods, and ES6+ syntax.',
      prerequisites: [],
    },
    {
      slug: 'async-javascript',
      name: 'Asynchronous JavaScript',
      category: 'LANGUAGE',
      description: 'Promises, async/await, event loop, and callback handling.',
      prerequisites: ['javascript-fundamentals'],
    },
    {
      slug: 'html-css-semantics',
      name: 'HTML5 & Modern CSS',
      category: 'TOOLING',
      description: 'Semantic markup, accessibility, Flexbox, Grid, and responsive design systems.',
      prerequisites: [],
    },
    {
      slug: 'dom-browser-apis',
      name: 'DOM & Browser APIs',
      category: 'LANGUAGE',
      description: 'DOM manipulation, Event Listeners, Fetch API, LocalStorage, and Web Storage.',
      prerequisites: ['javascript-fundamentals', 'html-css-semantics'],
    },
    {
      slug: 'react-state',
      name: 'React Components & State',
      category: 'FRAMEWORK',
      description: 'Component lifecycles, JSX, unidirectional data flow, useState, and props.',
      prerequisites: ['javascript-fundamentals'],
    },
    {
      slug: 'react-hooks',
      name: 'Advanced React Hooks',
      category: 'FRAMEWORK',
      description: 'useEffect, useMemo, useCallback, useRef, custom hooks, and state management.',
      prerequisites: ['react-state'],
    },
    {
      slug: 'nextjs-app-router',
      name: 'Next.js & Server Components',
      category: 'FRAMEWORK',
      description: 'App Router, Server Components, Client Components, SSR, and API Route handlers.',
      prerequisites: ['react-state', 'react-hooks'],
    },

    // Backend & Languages
    {
      slug: 'nodejs-core',
      name: 'Node.js Core & Runtime',
      category: 'FRAMEWORK',
      description: 'Buffer, Streams, Event Emitter, and non-blocking I/O.',
      prerequisites: ['javascript-fundamentals'],
    },
    {
      slug: 'express-apis',
      name: 'Express API Design',
      category: 'FRAMEWORK',
      description: 'Routing, middleware chains, error handling, and RESTful principles.',
      prerequisites: ['nodejs-core'],
    },
    {
      slug: 'rest-architecture',
      name: 'Full Stack Architecture & Auth',
      category: 'ARCHITECTURE',
      description: 'JWT authentication, CORS, security best practices, and integration.',
      prerequisites: ['express-apis', 'react-state'],
    },
    {
      slug: 'python-programming',
      name: 'Python Foundations',
      category: 'LANGUAGE',
      description: 'Core syntax, data types, loops, functions, lists, dicts, and comprehensions.',
      prerequisites: [],
    },
    {
      slug: 'python-oop-modules',
      name: 'Python OOP & File I/O',
      category: 'LANGUAGE',
      description: 'Classes, inheritance, exceptions, file operations, modules, and virtual environments.',
      prerequisites: ['python-programming'],
    },
    {
      slug: 'java-programming',
      name: 'Java Fundamentals',
      category: 'LANGUAGE',
      description: 'Types, control flow, methods, arrays, classes, and encapsulation.',
      prerequisites: [],
    },
    {
      slug: 'java-oop-generics',
      name: 'Java OOP & Collections',
      category: 'LANGUAGE',
      description: 'Inheritance, interfaces, Polymorphism, Generics, Collections, and Streams.',
      prerequisites: ['java-programming'],
    },
    {
      slug: 'cpp-programming',
      name: 'C++ Foundations',
      category: 'LANGUAGE',
      description: 'Syntax, functions, control flow, arrays, and standard I/O streams.',
      prerequisites: [],
    },
    {
      slug: 'cpp-memory-pointers',
      name: 'C++ Pointers & Memory',
      category: 'LANGUAGE',
      description: 'Pointers, references, dynamic memory, classes, destructors, and STL containers.',
      prerequisites: ['cpp-programming'],
    },
    {
      slug: 'go-programming',
      name: 'Go Fundamentals',
      category: 'LANGUAGE',
      description: 'Variables, structs, interfaces, packages, slices, and error handling.',
      prerequisites: [],
    },
    {
      slug: 'go-concurrency',
      name: 'Go Concurrency & Channels',
      category: 'LANGUAGE',
      description: 'Goroutines, channels, select, sync package, and concurrent worker patterns.',
      prerequisites: ['go-programming'],
    },

    // Databases
    {
      slug: 'sql-queries',
      name: 'SQL Query Fundamentals',
      category: 'DATABASE',
      description: 'SELECT, WHERE, ORDER BY, GROUP BY, aggregates, and filtering.',
      prerequisites: [],
    },
    {
      slug: 'sql-joins-indexing',
      name: 'SQL Joins & Indexing',
      category: 'DATABASE',
      description: 'INNER/LEFT/RIGHT JOINs, subqueries, constraints, indexes, and transactions.',
      prerequisites: ['sql-queries'],
    },
    {
      slug: 'mongodb-queries',
      name: 'MongoDB CRUD & Querying',
      category: 'DATABASE',
      description: 'Document databases, BSON, find filters, update operators, and projection.',
      prerequisites: [],
    },
    {
      slug: 'mongodb-aggregation',
      name: 'MongoDB Aggregation Pipeline',
      category: 'DATABASE',
      description: '$match, $group, $project, $lookup, pipeline optimization, and indexing.',
      prerequisites: ['mongodb-queries'],
    },
    {
      slug: 'database-schema-design',
      name: 'Database Schema Design',
      category: 'DATABASE',
      description: 'Relational normalization vs Document denormalization and indexing strategy.',
      prerequisites: ['sql-queries', 'mongodb-queries'],
    },

    // AI & Machine Learning
    {
      slug: 'ml-foundations',
      name: 'Machine Learning Foundations',
      category: 'ARCHITECTURE',
      description: 'Supervised learning, regression, classification, loss functions, and evaluation metrics.',
      prerequisites: ['python-programming'],
    },
    {
      slug: 'feature-engineering',
      name: 'Feature Engineering & Preprocessing',
      category: 'ARCHITECTURE',
      description: 'Data cleaning, one-hot encoding, feature scaling, train/test split, and validation.',
      prerequisites: ['ml-foundations'],
    },
    {
      slug: 'deep-learning-neural-nets',
      name: 'Neural Networks & Deep Learning',
      category: 'ARCHITECTURE',
      description: 'Perceptrons, backpropagation, activation functions, CNNs, and embeddings.',
      prerequisites: ['ml-foundations'],
    },
    {
      slug: 'llm-prompt-engineering',
      name: 'LLM Prompt Engineering',
      category: 'TOOLING',
      description: 'Tokens, context windows, few-shot prompting, system instructions, and structured output.',
      prerequisites: ['python-programming'],
    },
    {
      slug: 'rag-architecture',
      name: 'RAG & Vector Embeddings',
      category: 'ARCHITECTURE',
      description: 'Vector databases, similarity search, chunking strategies, and retrieval-augmented generation.',
      prerequisites: ['llm-prompt-engineering'],
    },
    {
      slug: 'ai-agents',
      name: 'Autonomous AI Agents',
      category: 'ARCHITECTURE',
      description: 'Tool calling, function execution, memory systems, and multi-agent coordination.',
      prerequisites: ['rag-architecture'],
    },

    // DevOps & Systems
    {
      slug: 'linux-administration',
      name: 'Linux Systems & Shell',
      category: 'TOOLING',
      description: 'Filesystem hierarchy, permissions, process management, standard streams, and SSH.',
      prerequisites: [],
    },
    {
      slug: 'bash-scripting',
      name: 'Bash Scripting & Automation',
      category: 'LANGUAGE',
      description: 'Shell variables, loops, conditionals, exit codes, pipelines, and cron jobs.',
      prerequisites: ['linux-administration'],
    },
    {
      slug: 'git-version-control',
      name: 'Git & GitHub Collaboration',
      category: 'TOOLING',
      description: 'Commits, branching strategies, merge conflicts, rebase, and pull requests.',
      prerequisites: [],
    },
    {
      slug: 'docker-containerization',
      name: 'Docker & Containerization',
      category: 'TOOLING',
      description: 'Images, containers, Dockerfile instructions, volumes, networks, and Docker Compose.',
      prerequisites: ['linux-administration'],
    },
    {
      slug: 'kubernetes-orchestration',
      name: 'Kubernetes Cluster Architecture',
      category: 'TOOLING',
      description: 'Pods, Deployments, Services, Ingress, ConfigMaps, and rolling updates.',
      prerequisites: ['docker-containerization'],
    },
    {
      slug: 'aws-cloud-infrastructure',
      name: 'AWS Cloud Fundamentals',
      category: 'TOOLING',
      description: 'EC2, S3, IAM policies, VPC networking, RDS, and serverless compute.',
      prerequisites: ['linux-administration'],
    },
  ];

  return await SkillModel.create(skillsData);
}
