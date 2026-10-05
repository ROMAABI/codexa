import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { authRouter } from './modules/auth/auth.controller';
import { coursesRouter } from './modules/courses/course.controller';
import { progressRouter } from './modules/learning/progress.controller';
import { assessmentsRouter } from './modules/assessments/assessment.controller';
import { challengesRouter } from './modules/challenges/challenge.controller';
import { skillsRouter } from './modules/skills/skill.controller';
import { recommendationsRouter } from './modules/recommendations/recommendation.controller';
import { aiRouter } from './modules/ai/ai.controller';
import { projectsRouter } from './modules/projects/project.controller';
import { resourcesRouter } from './modules/resources/resource.controller';
import { analyticsRouter } from './modules/analytics/analytics.controller';

export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '2mb' }));

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'codexa-api', timestamp: new Date().toISOString() });
  });

  // Module Routers
  app.use('/api/auth', authRouter);
  app.use('/api/courses', coursesRouter);
  app.use('/api/progress', progressRouter);
  app.use('/api/assessments', assessmentsRouter);
  app.use('/api/challenges', challengesRouter);
  app.use('/api/skills', skillsRouter);
  app.use('/api/recommendations', recommendationsRouter);
  app.use('/api/ai', aiRouter);
  app.use('/api/projects', projectsRouter);
  app.use('/api/resources', resourcesRouter);
  app.use('/api/analytics', analyticsRouter);

  // Global Error Handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[API Error]:', err);
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error',
    });
  });

  return app;
}
