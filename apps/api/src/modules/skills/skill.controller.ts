import { Router, Request, Response } from 'express';
import { SkillService } from './skill.service';
import { SkillModel } from '../../database/models/Skill';
import { authenticateToken, AuthRequest } from '../auth/auth.middleware';

export const skillsRouter = Router();

skillsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const skills = await SkillModel.find();
    res.json(skills);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

skillsRouter.get('/my-skills', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const skills = await SkillService.getUserSkills(userId);
    res.json(skills);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

skillsRouter.get('/weak-skills', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const weakSkills = await SkillService.getWeakSkills(userId);
    res.json(weakSkills);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
