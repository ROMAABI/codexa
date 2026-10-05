import { Router, Response } from 'express';
import { AnalyticsEventModel } from '../../database/models/AnalyticsEvent';
import { authenticateToken, requireRole, AuthRequest } from '../auth/auth.middleware';
import mongoose from 'mongoose';

export const analyticsRouter = Router();

analyticsRouter.use(authenticateToken);

analyticsRouter.post('/track', async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const { eventType, metadata } = req.body;
    if (!eventType) {
      res.status(400).json({ error: 'eventType is required' });
      return;
    }

    const event = await AnalyticsEventModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      eventType,
      metadata: metadata || {},
    });

    res.status(201).json(event);
  } catch (err: any) {
    // Non-blocking analytics: analytics failure must never block learning
    console.warn('[Analytics] Event tracking error:', err);
    res.status(200).json({ status: 'ignored' });
  }
});

analyticsRouter.get('/admin/summary', requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const totalEvents = await AnalyticsEventModel.countDocuments();
    const eventCounts = await AnalyticsEventModel.aggregate([
      { $group: { _id: '$eventType', count: { $sum: 1 } } },
    ]);

    res.json({
      totalEvents,
      eventsByType: eventCounts,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
