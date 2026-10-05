import { Router, Request, Response } from 'express';
import { ProjectModel } from '../../database/models/Project';
import { authenticateToken, AuthRequest } from '../auth/auth.middleware';

export const projectsRouter = Router();

projectsRouter.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await ProjectModel.find();
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

projectsRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const project = await ProjectModel.findOne({ slug });
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
