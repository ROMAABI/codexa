import mongoose from 'mongoose';
import { ProgressModel, IProgress } from '../../database/models/Progress';
import { CourseModel } from '../../database/models/Course';
import { ActivityModel } from '../../database/models/Activity';
import { UserModel } from '../../database/models/User';
import { SYSTEM_DEFAULTS } from '@codexa/shared';

export class ProgressService {
  static async getOrCreateProgress(userId: string, courseId: string): Promise<IProgress> {
    let progress = await ProgressModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      courseId: new mongoose.Types.ObjectId(courseId),
    });

    if (!progress) {
      progress = await ProgressModel.create({
        userId: new mongoose.Types.ObjectId(userId),
        courseId: new mongoose.Types.ObjectId(courseId),
        completedActivities: [],
        activityStates: new Map(),
        percentComplete: 0,
        lastAccessedAt: new Date(),
      });
    }

    return progress;
  }

  static async startActivity(userId: string, courseId: string, activityId: string): Promise<IProgress> {
    const progress = await this.getOrCreateProgress(userId, courseId);
    const activityObjectId = new mongoose.Types.ObjectId(activityId);

    progress.currentActivityId = activityObjectId;
    progress.lastAccessedAt = new Date();

    const currentState = progress.activityStates.get(activityId);
    if (!currentState || currentState === 'NOT_STARTED') {
      progress.activityStates.set(activityId, 'IN_PROGRESS');
    }

    await progress.save();
    return progress;
  }

  static async completeActivity(userId: string, courseId: string, activityId: string): Promise<IProgress> {
    const progress = await this.getOrCreateProgress(userId, courseId);
    const activityObjectId = new mongoose.Types.ObjectId(activityId);

    const isAlreadyCompleted = progress.completedActivities.some(
      (id) => id.toString() === activityId
    );

    if (!isAlreadyCompleted) {
      progress.completedActivities.push(activityObjectId);
      progress.activityStates.set(activityId, 'COMPLETED');

      // Award XP
      await UserModel.findByIdAndUpdate(userId, {
        $inc: { xp: SYSTEM_DEFAULTS.XP_PER_LESSON_COMPLETE },
      });

      // Calculate total activities in course to get percentComplete
      const course = await CourseModel.findById(courseId).populate({
        path: 'modules',
        populate: {
          path: 'lessons',
          populate: { path: 'activities' },
        },
      });

      let totalActivities = 0;
      if (course && course.modules) {
        for (const mod of course.modules as any) {
          if (mod.lessons) {
            for (const les of mod.lessons) {
              if (les.activities) {
                totalActivities += les.activities.length;
              }
            }
          }
        }
      }

      if (totalActivities > 0) {
        progress.percentComplete = Math.min(
          100,
          Math.round((progress.completedActivities.length / totalActivities) * 100)
        );
      }
    }

    progress.lastAccessedAt = new Date();
    await progress.save();
    return progress;
  }

  static async getUserEnrollments(userId: string) {
    const progressList = await ProgressModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .populate('courseId')
      .populate('currentActivityId');

    return progressList;
  }
}
