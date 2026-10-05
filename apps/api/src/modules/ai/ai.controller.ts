import { Router, Response } from 'express';
import { AIService } from './ai.service';
import { authenticateToken, AuthRequest } from '../auth/auth.middleware';
import { aiRateLimiter } from '../../middleware/rate-limiter';

export const aiRouter = Router();

aiRouter.use(authenticateToken);

aiRouter.post('/ask', aiRateLimiter, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { mode, query, context } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Query is required' });
      return;
    }

    const response = await AIService.askMentor(userId, {
      mode: mode || 'explain',
      query,
      context: context || {},
    });

    res.json(response);
  } catch (err: any) {
    res.status(500).json({
      error: 'AI Mentor temporarily unavailable',
      fallbackGuidance: 'Please refer to the lesson notes and exercise instructions.',
    });
  }
});
