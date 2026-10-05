import { ProjectModel } from '../models/Project';

export async function seedProjects(coursesMap: Map<string, any>) {
  const getCourseId = (slug: string) => coursesMap.get(slug)?._id;

  const projectsData = [
    {
      courseId: getCourseId('mern-stack-development'),
      slug: 'task-management-platform',
      title: 'Capstone: Full Stack Collaborative Task Platform',
      description:
        'Build a complete production-grade task tracking web application with JWT authentication, MongoDB schemas, REST endpoints, and a responsive React frontend with optimistic UI updates.',
      skillsDemonstrated: [
        'javascript-fundamentals',
        'async-javascript',
        'nodejs-core',
        'express-apis',
        'mongodb-queries',
        'react-state',
        'rest-architecture',
      ],
      starterFiles: [
        {
          path: 'server.js',
          content: `const express = require('express');
const app = express();
app.use(express.json());

// TODO: Implement task routes

app.listen(3000, () => console.log('Task server running'));
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Database Schema & REST Endpoints',
          description: 'Implement GET /api/tasks and POST /api/tasks with validation.',
          requiredFiles: ['server.js'],
        },
      ],
    },
    {
      courseId: getCourseId('react-js'),
      slug: 'react-analytics-dashboard',
      title: 'Capstone: Reactive Analytics Dashboard & Charts',
      description:
        'Build a real-time reactive analytics metrics dashboard in React with modular widget components, dark/light theme persistence, custom data filtering hooks, and chart visualizations.',
      skillsDemonstrated: ['react-state', 'react-hooks', 'javascript-fundamentals'],
      starterFiles: [
        {
          path: 'src/App.jsx',
          content: `import React, { useState } from 'react';

export default function App() {
  const [metrics, setMetrics] = useState([]);
  return (
    <div className="dashboard-container">
      <h1>Engineering Velocity Dashboard</h1>
      {/* TODO: Mount metric widgets */}
    </div>
  );
}
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Dynamic Metric Cards & State Synchronization',
          description: 'Create customizable widget cards and manage filter state.',
          requiredFiles: ['src/App.jsx'],
        },
      ],
    },
    {
      courseId: getCourseId('backend-development-nodejs'),
      slug: 'nodejs-rest-service',
      title: 'Capstone: Secure Production REST API Microservice',
      description:
        'Architect a hardened Node.js/Express REST API with centralized error handling, rate limiting middleware, Joi/Zod request validation, and JWT authentication.',
      skillsDemonstrated: ['nodejs-core', 'express-apis', 'rest-architecture'],
      starterFiles: [
        {
          path: 'app.js',
          content: `const express = require('express');
const app = express();
app.use(express.json());

// TODO: Mount routes and error middleware

module.exports = app;
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Authentication & Validation Layer',
          description: 'Enforce bearer token verification and request payload validation.',
          requiredFiles: ['app.js'],
        },
      ],
    },
    {
      courseId: getCourseId('python-programming'),
      slug: 'python-cli-automation',
      title: 'Capstone: Automated Data Extraction & CLI Utility',
      description:
        'Develop a Python command-line utility for parsing server logs, extracting anomaly metrics, and generating structured CSV / JSON audit reports.',
      skillsDemonstrated: ['python-programming', 'python-oop-modules'],
      starterFiles: [
        {
          path: 'log_parser.py',
          content: `import sys
import json

def parse_logs(file_path):
    """Parse log entries and extract status codes and latency."""
    pass

if __name__ == '__main__':
    print("Log Parser CLI Tool")
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: File Ingestion & Regex Log Parser',
          description: 'Extract IP addresses, HTTP verbs, response codes, and calculate error rates.',
          requiredFiles: ['log_parser.py'],
        },
      ],
    },
    {
      courseId: getCourseId('sql-databases'),
      slug: 'sql-analytics-system',
      title: 'Capstone: E-Commerce Relational Analytics Engine',
      description:
        'Design a 3NF normalized schema for an online marketplace and write complex analytical queries with multi-table joins, subqueries, and window functions.',
      skillsDemonstrated: ['sql-queries', 'sql-joins-indexing', 'database-schema-design'],
      starterFiles: [
        {
          path: 'schema.sql',
          content: `-- E-Commerce Relational Schema
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TODO: Create products, orders, and order_items tables
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Schema Normalization & Index Optimization',
          description: 'Create foreign keys, compound indexes, and write revenue aggregation queries.',
          requiredFiles: ['schema.sql'],
        },
      ],
    },
    {
      courseId: getCourseId('mongodb-development'),
      slug: 'mongodb-cms-backend',
      title: 'Capstone: High-Scale Content Management Database Backend',
      description:
        'Design a flexible MongoDB document database schema for a high-traffic publishing platform with nested comments, tags, and multi-stage aggregation analytics.',
      skillsDemonstrated: ['mongodb-queries', 'mongodb-aggregation', 'database-schema-design'],
      starterFiles: [
        {
          path: 'schema.js',
          content: `// Mongoose Article Schema Definition
const mongoose = require('mongoose');

const ArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  content: String,
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Article', ArticleSchema);
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Aggregation Pipelines & Tag Indexing',
          description: 'Build aggregation queries to rank trending articles by view velocity.',
          requiredFiles: ['schema.js'],
        },
      ],
    },
    {
      courseId: getCourseId('machine-learning'),
      slug: 'ml-churn-predictor',
      title: 'Capstone: Machine Learning Customer Churn Predictor',
      description:
        'Build a complete end-to-end classification pipeline in Python: clean tabular data, handle categorical encodings, train Random Forest / Gradient Boosting models, and evaluate ROC-AUC curves.',
      skillsDemonstrated: ['ml-foundations', 'feature-engineering', 'python-programming'],
      starterFiles: [
        {
          path: 'model.py',
          content: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

def train_churn_model(csv_path):
    # TODO: Load dataset, preprocess features, and fit model
    pass
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Feature Engineering & Baseline Model',
          description: 'Preprocess demographic data and achieve >= 80% test accuracy.',
          requiredFiles: ['model.py'],
        },
      ],
    },
    {
      courseId: getCourseId('llm-development'),
      slug: 'llm-rag-assistant',
      title: 'Capstone: Enterprise RAG Knowledge Assistant',
      description:
        'Construct a production RAG pipeline: document chunking, embedding generation with vector search, contextual prompt injection, citation generation, and tool calling.',
      skillsDemonstrated: ['llm-prompt-engineering', 'rag-architecture', 'ai-agents'],
      starterFiles: [
        {
          path: 'rag_engine.py',
          content: `import json

class RAGAssistant:
    def __init__(self, vector_store):
        self.vector_store = vector_store

    def query(self, user_question):
        # 1. Retrieve top-k chunks
        # 2. Inject into prompt template
        # 3. Call LLM and return citations
        pass
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Vector Search & Grounded Generation',
          description: 'Implement semantic chunking and synthesize answers with verified source links.',
          requiredFiles: ['rag_engine.py'],
        },
      ],
    },
    {
      courseId: getCourseId('linux-fundamentals'),
      slug: 'linux-system-monitor',
      title: 'Capstone: Automated System Health Monitoring Daemon',
      description:
        'Create a lightweight Bash monitoring daemon that tracks CPU utilization, RAM pressure, disk usage, and sends alert notifications on threshold breaches.',
      skillsDemonstrated: ['linux-administration', 'bash-scripting'],
      starterFiles: [
        {
          path: 'monitor.sh',
          content: `#!/usr/bin/env bash
# System Monitoring Daemon

CPU_THRESHOLD=85
MEM_THRESHOLD=90

check_health() {
    # TODO: Calculate CPU & RAM usage
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] Checking server health..."
}

check_health
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Health Diagnostics & Alert Logging',
          description: 'Poll system statistics and output structured logs.',
          requiredFiles: ['monitor.sh'],
        },
      ],
    },
    {
      courseId: getCourseId('docker-containers'),
      slug: 'docker-microservices-stack',
      title: 'Capstone: Multi-Service Microservices Container Stack',
      description:
        'Containerize a multi-tier web application (Node.js API + React Frontend + MongoDB + Redis) using optimized multi-stage Dockerfiles and Docker Compose orchestration.',
      skillsDemonstrated: ['docker-containerization', 'linux-administration'],
      starterFiles: [
        {
          path: 'docker-compose.yml',
          content: `version: '3.8'

services:
  api:
    build:
      context: ./api
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=mongodb://mongo:27017/app
    depends_on:
      - mongo

  mongo:
    image: mongo:7.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Multi-Container Networking & Volume Persistence',
          description: 'Configure bridge networking and health check dependencies.',
          requiredFiles: ['docker-compose.yml'],
        },
      ],
    },
    {
      courseId: getCourseId('frontend-development'),
      slug: 'frontend-agency-portal',
      title: 'Capstone: Modern Responsive Design Studio Portal',
      description:
        'Create a responsive web application featuring CSS Grid layouts, semantic HTML5 landmarks, responsive typography, and client-side interactions.',
      skillsDemonstrated: ['html-css-semantics', 'dom-browser-apis', 'javascript-fundamentals'],
      starterFiles: [
        {
          path: 'index.html',
          content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Design Studio Portal</title>
</head>
<body>
  <!-- TODO: Build responsive layout -->
</body>
</html>`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Semantic Structure & Responsive Layout',
          description: 'Implement header, responsive grid showcase, and accessible form.',
          requiredFiles: ['index.html'],
        },
      ],
    },
    {
      courseId: getCourseId('next-js'),
      slug: 'nextjs-saas-platform',
      title: 'Capstone: Full-Stack Next.js App Router Platform',
      description:
        'Develop a production Next.js application using Server Components, Server Actions for mutations, dynamic routing with suspense boundaries, and API route handlers.',
      skillsDemonstrated: ['nextjs-app-router', 'react-state', 'react-hooks'],
      starterFiles: [
        {
          path: 'app/page.tsx',
          content: `export default async function HomePage() {
  return (
    <main>
      <h1>Next.js SaaS Platform</h1>
    </main>
  );
}`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Server Components & Streaming',
          description: 'Implement server data fetching and streaming suspense UI.',
          requiredFiles: ['app/page.tsx'],
        },
      ],
    },
    {
      courseId: getCourseId('javascript-fundamentals'),
      slug: 'js-event-emitter',
      title: 'Capstone: Custom Reactive Event Bus & State Store',
      description:
        'Construct a lightweight reactive publish-subscribe event emitter and state management store from scratch in vanilla JavaScript using closures and ES6 classes.',
      skillsDemonstrated: ['javascript-fundamentals', 'async-javascript'],
      starterFiles: [
        {
          path: 'EventEmitter.js',
          content: `class EventEmitter {
  constructor() {
    this.events = new Map();
  }
  // TODO: Implement on, off, emit, and once
}

module.exports = EventEmitter;
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Subscribe, Emit & Cleanup Mechanics',
          description: 'Implement event registration, parameter forwarding, and listener removal.',
          requiredFiles: ['EventEmitter.js'],
        },
      ],
    },
    {
      courseId: getCourseId('java-programming'),
      slug: 'java-banking-engine',
      title: 'Capstone: Enterprise Banking & Transaction Manager',
      description:
        'Architect a robust Object-Oriented Java banking application with custom exception hierarchies, thread-safe balance transactions, and generic collection storage.',
      skillsDemonstrated: ['java-programming', 'java-oop-generics'],
      starterFiles: [
        {
          path: 'BankManager.java',
          content: `public class BankManager {
    public static void main(String[] args) {
        System.out.println("Enterprise Bank Manager Running...");
    }
}
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Account Hierarchy & Transaction Validation',
          description: 'Create Account base class, Savings/Checking subclasses, and transfer validation.',
          requiredFiles: ['BankManager.java'],
        },
      ],
    },
    {
      courseId: getCourseId('cpp-programming'),
      slug: 'cpp-custom-vector',
      title: 'Capstone: High-Performance Memory Pool & Custom Vector',
      description:
        'Implement a dynamic memory allocator and custom generic vector container in C++ with RAII memory management, copy/move semantics, and pointer arithmetic.',
      skillsDemonstrated: ['cpp-programming', 'cpp-memory-pointers'],
      starterFiles: [
        {
          path: 'Vector.hpp',
          content: `#pragma once
#include <cstddef>

template <typename T>
class Vector {
    T* data_;
    size_t size_;
    size_t capacity_;
public:
    Vector() : data_(nullptr), size_(0), capacity_(0) {}
    ~Vector() { delete[] data_; }
};
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Dynamic Allocation & Move Semantics',
          description: 'Implement push_back with exponential reallocation and rule-of-5 memory management.',
          requiredFiles: ['Vector.hpp'],
        },
      ],
    },
    {
      courseId: getCourseId('go-programming'),
      slug: 'go-concurrent-pipeline',
      title: 'Capstone: Concurrent Worker Pool & Rate Limiter Pipeline',
      description:
        'Build a high-throughput concurrent job processing pipeline in Go utilizing goroutines, buffered channels, select multiplexing, and sync.WaitGroup synchronization.',
      skillsDemonstrated: ['go-programming', 'go-concurrency'],
      starterFiles: [
        {
          path: 'main.go',
          content: `package main

import (
    "fmt"
    "sync"
)

func main() {
    fmt.Println("Concurrent Worker Pool Pipeline")
}
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Worker Pool Dispatch & Channel Coordination',
          description: 'Distribute tasks across N worker goroutines and safely collect results.',
          requiredFiles: ['main.go'],
        },
      ],
    },
    {
      courseId: getCourseId('deep-learning'),
      slug: 'deep-learning-classifier',
      title: 'Capstone: Convolutional Neural Network Image Classifier',
      description:
        'Design, train, and validate a Convolutional Neural Network (CNN) in PyTorch to classify image datasets with data augmentation and learning rate scheduling.',
      skillsDemonstrated: ['deep-learning-neural-nets', 'ml-foundations', 'python-programming'],
      starterFiles: [
        {
          path: 'train.py',
          content: `import torch
import torch.nn as nn

class ConvNet(nn.Module):
    def __init__(self):
        super().__init__()
        # TODO: Define Conv2d, MaxPool, and Linear layers
        pass

    def forward(self, x):
        return x
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Model Architecture & Training Loop',
          description: 'Construct CNN layers, define CrossEntropyLoss, and optimize with Adam.',
          requiredFiles: ['train.py'],
        },
      ],
    },
    {
      courseId: getCourseId('git-and-github'),
      slug: 'git-release-workflow',
      title: 'Capstone: Git Enterprise Workflow & Release Pipeline',
      description:
        'Configure a complete multi-branch Git development lifecycle: feature branching, semantic pull requests, release tagging, and automated CHANGELOG generation.',
      skillsDemonstrated: ['git-version-control'],
      starterFiles: [
        {
          path: 'workflow.md',
          content: `# Git Enterprise Branching Strategy

## Branch Hierarchy
- \`main\`: Production releases
- \`develop\`: Integration branch
- \`feature/*\`: Isolated feature development
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Branch Protection & Semantic Commits',
          description: 'Formulate branching rules, merge strategies, and conflict playbooks.',
          requiredFiles: ['workflow.md'],
        },
      ],
    },
    {
      courseId: getCourseId('kubernetes-orchestration'),
      slug: 'k8s-production-cluster',
      title: 'Capstone: Multi-Tier Kubernetes Deployment & Ingress',
      description:
        'Deploy a scalable, highly available multi-tier web application to Kubernetes with Deployments, ClusterIP Services, NGINX Ingress, and ConfigMap configuration.',
      skillsDemonstrated: ['kubernetes-orchestration', 'docker-containerization'],
      starterFiles: [
        {
          path: 'deployment.yaml',
          content: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app-deployment
spec:
  replicas: 3
  # TODO: Define pod template and probes
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: Declarative Manifests & Probes',
          description: 'Configure liveness/readiness probes, resource limits, and service routing.',
          requiredFiles: ['deployment.yaml'],
        },
      ],
    },
    {
      courseId: getCourseId('aws-cloud-fundamentals'),
      slug: 'aws-resilient-architecture',
      title: 'Capstone: Highly Available Multi-Tier AWS Cloud Architecture',
      description:
        'Architect a resilient 3-tier AWS cloud infrastructure with a custom VPC, public/private subnets across multiple AZs, Application Load Balancers, and EC2 Auto Scaling.',
      skillsDemonstrated: ['aws-cloud-infrastructure', 'linux-administration'],
      starterFiles: [
        {
          path: 'architecture.md',
          content: `# AWS 3-Tier Highly Available Cloud Architecture

## Network Topology
- **VPC CIDR**: 10.0.0.0/16
- **Public Subnets**: 10.0.1.0/24 (AZ-1), 10.0.2.0/24 (AZ-2)
- **Private App Subnets**: 10.0.10.0/24 (AZ-1), 10.0.20.0/24 (AZ-2)
- **Private DB Subnets**: 10.0.100.0/24 (AZ-1), 10.0.200.0/24 (AZ-2)
`,
        },
      ],
      milestones: [
        {
          order: 1,
          title: 'Milestone 1: VPC Subnetting & Security Group Rules',
          description: 'Define least-privilege security groups and routing table rules.',
          requiredFiles: ['architecture.md'],
        },
      ],
    },
  ];

  return await ProjectModel.create(projectsData);
}
