import { Router, Request, Response } from 'express';
import { ProjectModel } from '../../database/models/Project';
import { ProjectService } from './project.service';
import { authenticateToken, AuthRequest } from '../auth/auth.middleware';
import { executionRateLimiter } from '../../middleware/rate-limiter';

export const projectsRouter = Router();

/**
 * Helper to get user ID or guest demo ID
 */
function getUserId(req: AuthRequest): string {
  if (req.user?.userId) {
    return req.user.userId;
  }
  return '000000000000000000000001'; // Default guest / demo ObjectId
}

/**
 * Optional auth middleware for endpoints that can be viewed publicly or by authenticated users
 */
function optionalAuth(req: AuthRequest, _res: Response, next: () => void) {
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authenticateToken(req, _res, next);
  }
  next();
}

/**
 * GET /api/projects
 * List all available projects (public metadata)
 */
projectsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await ProjectModel.find().select('-milestones.testCases.expectedOutput -milestones.verificationScript');
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/projects/:slug
 * Get project details with public milestones (hidden test logic stripped)
 */
projectsRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const project = await ProjectModel.findOne({ slug }).select(
      '-milestones.testCases.expectedOutput -milestones.verificationScript'
    );
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/projects/:slug/workspace
 * Load student's saved workspace or initialize from starter template
 */
projectsRouter.get('/:slug/workspace', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const userId = getUserId(req);
    const workspace = await ProjectService.getOrCreateWorkspace(userId, slug);
    res.json(workspace);
  } catch (err: any) {
    res.status(err.message?.includes('not found') ? 404 : 500).json({ error: err.message });
  }
});

/**
 * PUT /api/projects/:slug/workspace
 * Save student's files, active tab, and workspace state
 */
projectsRouter.put('/:slug/workspace', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const userId = getUserId(req);
    const { files, activeMilestone, activeFilePath, openFiles, checkpointMessage } = req.body;

    const workspace = await ProjectService.saveWorkspace(userId, slug, {
      files,
      activeMilestone,
      activeFilePath,
      openFiles,
      checkpointMessage,
    });
    res.json(workspace);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/projects/:slug/run
 * Execute multi-file project inside bubblewrap sandbox
 */
projectsRouter.post('/:slug/run', executionRateLimiter, optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const userId = getUserId(req);
    const { files, entryFile, command, language } = req.body;

    if (!files || !Array.isArray(files)) {
      res.status(400).json({ error: 'Files array is required' });
      return;
    }

    const runResult = await ProjectService.runProject(userId, slug, {
      files,
      entryFile,
      command,
      language,
    });
    res.json(runResult);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/projects/:slug/submit
 * Evaluate milestone submission against server-side hidden test suite
 */
projectsRouter.post('/:slug/submit', executionRateLimiter, optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const userId = getUserId(req);
    const { milestoneOrder, files } = req.body;

    if (milestoneOrder === undefined || !files || !Array.isArray(files)) {
      res.status(400).json({ error: 'milestoneOrder and files array are required' });
      return;
    }

    const submissionResult = await ProjectService.submitMilestone(userId, slug, {
      milestoneOrder: Number(milestoneOrder),
      files,
    });
    res.json(submissionResult);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/projects/:slug/terminal
 * Interactive terminal execution in project sandbox
 */
projectsRouter.post('/:slug/terminal', executionRateLimiter, optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const userId = getUserId(req);
    const { command, files, language } = req.body;

    if (!command || typeof command !== 'string') {
      res.status(400).json({ error: 'command is required' });
      return;
    }

    const terminalResult = await ProjectService.execTerminal(userId, slug, {
      command,
      files: files || [],
      language,
    });
    res.json(terminalResult);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/projects/:slug/reset
 * Reset workspace to starter template
 */
projectsRouter.post('/:slug/reset', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const userId = getUserId(req);
    const workspace = await ProjectService.resetWorkspace(userId, slug);
    res.json(workspace);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
