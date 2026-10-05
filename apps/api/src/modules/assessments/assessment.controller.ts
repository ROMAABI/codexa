import { Router, Response } from 'express';
import { AssessmentService } from './assessment.service';
import { authenticateToken, AuthRequest } from '../auth/auth.middleware';
import { assessmentRateLimiter } from '../../middleware/rate-limiter';

export const assessmentsRouter = Router();

assessmentsRouter.use(authenticateToken);

assessmentsRouter.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const assessment = await AssessmentService.getAssessmentForStudent(id);
    if (!assessment) {
      res.status(404).json({ error: 'Assessment not found' });
      return;
    }
    res.json(assessment);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

assessmentsRouter.post('/:id/attempt', assessmentRateLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const { answers, timeSpentSeconds } = req.body;
    if (!answers) {
      res.status(400).json({ error: 'Answers payload is required' });
      return;
    }
    const attempt = await AssessmentService.submitAttempt(
      userId,
      id,
      answers,
      timeSpentSeconds || 0
    );
    res.status(201).json(attempt);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

assessmentsRouter.get('/:id/history', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const attempts = await AssessmentService.getStudentAttempts(userId, id);
    res.json(attempts);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
