import { Router, Response } from 'express';
import { AIService } from './ai.service';
import { authenticateToken, AuthRequest } from '../auth/auth.middleware';
import { aiRateLimiter } from '../../middleware/rate-limiter';

export const aiRouter = Router();

aiRouter.use(authenticateToken);

aiRouter.post('/ask', aiRateLimiter, async (req: AuthRequest, res: Response) => {
  const userId = req.user?.userId || '000000000000000000000001';
  const { mode = 'explain', query, context } = req.body;

  if (query === undefined || query === null || typeof query !== 'string') {
    res.status(400).json({ error: 'Query is required and must be a string.' });
    return;
  }

  try {
    console.log(`[AI Controller] Received /ai/ask from user ${userId}: '${query.slice(0, 80)}' (mode: ${mode})`);

    const response = await AIService.askMentor(userId, {
      mode,
      query,
      context: context || {},
    });

    res.json(response);
  } catch (err: any) {
    console.error('[AI Controller] Uncaught error in /ai/ask:', err);

    // Fallback response rather than generic 500 failure
    res.status(200).json({
      message:
        "I'm here to help! Could you please clarify your question or specify what concept you'd like to explore?",
      mode,
      groundedInLesson: false,
    });
  }
});
