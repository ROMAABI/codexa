import { Router, Response } from 'express';
import { RecommendationService } from './recommendation.service';
import { authenticateToken, AuthRequest } from '../auth/auth.middleware';

export const recommendationsRouter = Router();

recommendationsRouter.use(authenticateToken);

recommendationsRouter.get('/next', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const recommendation = await RecommendationService.getNextRecommendation(userId);
    res.json(recommendation);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
