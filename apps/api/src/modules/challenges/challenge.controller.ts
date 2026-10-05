import { Router, Response } from 'express';
import { ChallengeModel } from '../../database/models/Challenge';
import { ExecutionService } from '../execution/execution.service';
import { SandboxRunner } from '../execution/sandbox.runner';
import { authenticateToken, AuthRequest } from '../auth/auth.middleware';
import { executionRateLimiter } from '../../middleware/rate-limiter';
import { SYSTEM_DEFAULTS } from '@codexa/shared';

export const challengesRouter = Router();

challengesRouter.use(authenticateToken);

/**
 * POST /api/challenges/run-snippet
 * Direct ephemeral sandbox execution for Try It Yourself buttons and interactive code drills.
 */
challengesRouter.post('/run-snippet', executionRateLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const { code, language = 'javascript', testCases = [] } = req.body;
    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Code is required' });
      return;
    }

    const outcome = await SandboxRunner.execute({
      code,
      language,
      testCases,
      timeoutMs: SYSTEM_DEFAULTS.EXECUTION_TIMEOUT_MS,
    });
    res.json(outcome);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

challengesRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const challenge = await ChallengeModel.findById(id);
    if (!challenge) {
      res.status(404).json({ error: 'Challenge not found' });
      return;
    }

    // Never expose solution code to students; filter hidden test cases
    const publicTestCases = challenge.testCases
      .filter((tc: any) => !tc.hidden)
      .map((tc: any) => ({
        id: tc._id.toString(),
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        description: tc.description,
      }));

    res.json({
      id: challenge._id.toString(),
      _id: challenge._id.toString(),
      activityId: challenge.activityId?.toString(),
      title: challenge.title,
      description: challenge.description,
      difficulty: challenge.difficulty,
      language: challenge.language,
      starterCode: challenge.starterCode,
      hints: challenge.hints,
      testCases: publicTestCases,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

challengesRouter.post('/:id/submit', executionRateLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Code is required' });
      return;
    }

    const submission = await ExecutionService.submitCode(userId, id, code);
    const sanitized = await ExecutionService.getSubmission(userId, submission._id.toString());
    res.status(202).json(sanitized || submission);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

challengesRouter.post('/:id/run', executionRateLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      res.status(400).json({ error: 'Code is required' });
      return;
    }

    // Run ephemeral execution against public test cases only: no database persistence, no XP, no skill evidence
    const outcome = await ExecutionService.runCode(userId, id, code);
    res.json(outcome);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

challengesRouter.get('/:id/submissions', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const submissions = await ExecutionService.getChallengeSubmissions(userId, id);
    res.json(submissions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

challengesRouter.get('/submissions/:submissionId', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const submissionId = req.params.submissionId as string;
    const submission = await ExecutionService.getSubmission(userId, submissionId);
    if (!submission) {
      res.status(404).json({ error: 'Submission not found or unauthorized' });
      return;
    }
    res.json(submission);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
