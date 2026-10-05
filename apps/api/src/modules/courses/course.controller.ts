import { Router, Request, Response } from 'express';
import { CourseService } from './course.service';
import { authenticateToken, requireRole, AuthRequest } from '../auth/auth.middleware';
import { CourseModel } from '../../database/models/Course';

export const coursesRouter = Router();

// Public / Student: List all published courses
coursesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { domain, level, includeDrafts } = req.query;
    const courses = await CourseService.listCourses({
      domain: domain as string,
      level: level as string,
      includeDrafts: includeDrafts === 'true',
    });
    res.json(courses);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Public / Student: Get course tree by slug
coursesRouter.get('/:slug', async (req: Request, res: Response) => {
  try {
    const slug = req.params.slug as string;
    const course = await CourseService.getCourseBySlug(slug);
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    res.json(course);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Student & Admin: Get lesson details
coursesRouter.get('/lessons/:lessonId', async (req: Request, res: Response) => {
  try {
    const lessonId = req.params.lessonId as string;
    // By default, shield answers for safety unless explicitly authenticated as admin
    const lesson = await CourseService.getLessonDetails(lessonId, true);
    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found' });
      return;
    }
    res.json(lesson);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Create Course
coursesRouter.post('/', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const course = await CourseModel.create(req.body);
    res.status(201).json(course);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Update Course
coursesRouter.put('/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const course = await CourseModel.findByIdAndUpdate(req.params.id as string, req.body, { new: true });
    if (!course) {
      res.status(404).json({ error: 'Course not found' });
      return;
    }
    res.json(course);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Create Module
coursesRouter.post('/:courseId/modules', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const moduleDoc = await CourseService.createModule(req.params.courseId as string, req.body);
    res.status(201).json(moduleDoc);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Create Lesson under Module
coursesRouter.post('/modules/:moduleId/lessons', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const lessonDoc = await CourseService.createLesson(req.params.moduleId as string, req.body);
    res.status(201).json(lessonDoc);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Update Lesson
coursesRouter.put('/lessons/:lessonId', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const lesson = await CourseService.updateLesson(req.params.lessonId as string, req.body);
    res.json(lesson);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Delete Lesson
coursesRouter.delete('/lessons/:lessonId', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const result = await CourseService.deleteLesson(req.params.lessonId as string);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Create Activity under Lesson (Video, Notes, Resource, Quiz, Challenge)
coursesRouter.post('/lessons/:lessonId/activities', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const activity = await CourseService.createActivity(req.params.lessonId as string, req.body);
    res.status(201).json(activity);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Update Activity
coursesRouter.put('/activities/:activityId', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const activity = await CourseService.updateActivity(req.params.activityId as string, req.body);
    res.json(activity);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Delete Activity
coursesRouter.delete('/activities/:activityId', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const result = await CourseService.deleteActivity(req.params.activityId as string);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin: Reorder Activities in Lesson
coursesRouter.put('/lessons/:lessonId/reorder', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { activityIds } = req.body;
    if (!Array.isArray(activityIds)) {
      res.status(400).json({ error: 'activityIds array is required' });
      return;
    }
    const updatedLesson = await CourseService.reorderActivities(req.params.lessonId as string, activityIds);
    res.json(updatedLesson);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
