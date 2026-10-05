import { Router, Response } from 'express';
import { AuthService } from './auth.service';
import { authenticateToken, AuthRequest } from './auth.middleware';
import { UserModel } from '../../database/models/User';
import { authRateLimiter } from '../../middleware/rate-limiter';

export const authRouter = Router();

authRouter.post('/register', authRateLimiter, async (req, res: Response) => {
  try {
    const { email, password, name, role, learningGoal, experienceLevel } = req.body;
    if (!email || !password || !name) {
      res.status(400).json({ error: 'Email, password, and name are required' });
      return;
    }
    const result = await AuthService.register({
      email,
      password,
      name,
      role,
      learningGoal,
      experienceLevel,
    });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

authRouter.post('/login', authRateLimiter, async (req, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required' });
      return;
    }
    const result = await AuthService.login({ email, password });
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

authRouter.post('/google', authRateLimiter, async (req, res: Response) => {
  try {
    const { credential, email, name, googleId, picture } = req.body;
    if (!credential && !email) {
      res.status(400).json({ error: 'Google credential token or email is required' });
      return;
    }
    const result = await AuthService.googleLogin({
      credential,
      email,
      name,
      googleId,
      picture,
    });
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

authRouter.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await UserModel.findById(req.user?.userId).select('-passwordHash');
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

authRouter.put('/preferences', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { learningGoal, experienceLevel, weeklyTargetHours } = req.body;
    const user = await UserModel.findById(req.user?.userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    if (learningGoal) user.preferences.learningGoal = learningGoal;
    if (experienceLevel) user.preferences.experienceLevel = experienceLevel;
    if (weeklyTargetHours) user.preferences.weeklyTargetHours = weeklyTargetHours;
    await user.save();
    res.json(user);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
