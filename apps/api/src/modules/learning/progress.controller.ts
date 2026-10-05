import { Router, Response } from 'express';
import { ProgressService } from './progress.service';
import { authenticateToken, AuthRequest, enforceStudentIsolation } from '../auth/auth.middleware';

export const progressRouter = Router();

progressRouter.use(authenticateToken);

progressRouter.get('/course/:courseId', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const courseId = req.params.courseId as string;
    const progress = await ProgressService.getOrCreateProgress(userId, courseId);
    res.json(progress);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

progressRouter.post('/start', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { courseId, activityId } = req.body;
    if (!courseId || !activityId) {
      res.status(400).json({ error: 'courseId and activityId are required' });
      return;
    }
    const progress = await ProgressService.startActivity(userId, courseId, activityId);
    res.json(progress);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

progressRouter.post('/complete', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { courseId, activityId } = req.body;
    if (!courseId || !activityId) {
      res.status(400).json({ error: 'courseId and activityId are required' });
      return;
    }
    const progress = await ProgressService.completeActivity(userId, courseId, activityId);
    res.json(progress);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

progressRouter.get('/my-courses', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const enrollments = await ProgressService.getUserEnrollments(userId);
    res.json(enrollments);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
