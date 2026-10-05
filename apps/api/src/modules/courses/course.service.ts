import mongoose from 'mongoose';
import { CourseModel, ICourse } from '../../database/models/Course';
import { ModuleModel } from '../../database/models/Module';
import { LessonModel } from '../../database/models/Lesson';
import { ActivityModel } from '../../database/models/Activity';
import { ResourceModel } from '../../database/models/Resource';
import { AssessmentModel } from '../../database/models/Assessment';
import { ChallengeModel } from '../../database/models/Challenge';
import { ProjectModel } from '../../database/models/Project';
import { parseYouTubeId, getYouTubeEmbedUrl } from '@codexa/shared';

export class CourseService {
  static async listCourses(filter: { domain?: string; level?: string; includeDrafts?: boolean } = {}): Promise<ICourse[]> {
    const query: any = {};
    if (!filter.includeDrafts) {
      query.status = 'PUBLISHED';
    }
    if (filter.domain) query.domain = filter.domain;
    if (filter.level) query.level = filter.level;
    return CourseModel.find(query).sort({ createdAt: -1 });
  }

  static async getCourseBySlug(slug: string) {
    const course = await CourseModel.findOne({ slug })
      .populate({
        path: 'modules',
        options: { sort: { order: 1 } },
        populate: {
          path: 'lessons',
          options: { sort: { order: 1 } },
          populate: {
            path: 'activities',
            options: { sort: { order: 1 } },
            populate: [
              { path: 'assessmentRef', select: '-questions.correctOption -questions.explanation' },
              { path: 'challengeRef', select: '-testCases.hidden -solutionCode' },
              { path: 'resourceRef', select: '-verificationEvidence' },
              { path: 'resourceRefs', select: '-verificationEvidence' },
            ],
          },
        },
      });

    if (!course) return null;
    const project = await ProjectModel.findOne({ courseId: course._id });
    const courseObj: any = course.toObject ? course.toObject() : course;
    if (project) {
      courseObj.finalProject = project;
    }
    return courseObj;
  }

  static async getLessonDetails(lessonId: string, isStudent = true) {
    const assessmentSelect = isStudent ? '-questions.correctOption -questions.explanation' : '';
    const challengeSelect = isStudent ? '-solutionCode' : '';
    const resourceSelect = isStudent ? '-verificationEvidence' : '';

    const lesson = await LessonModel.findById(lessonId)
      .populate({
        path: 'activities',
        options: { sort: { order: 1 } },
        populate: [
          { path: 'assessmentRef', select: assessmentSelect },
          { path: 'challengeRef', select: challengeSelect },
          { path: 'resourceRef', select: resourceSelect },
          { path: 'resourceRefs', select: resourceSelect },
        ],
      });

    return lesson;
  }

  // --- ADMIN CONTENT MANAGEMENT ---

  static async createModule(courseId: string, data: { title: string; description?: string; order?: number }) {
    const course = await CourseModel.findById(courseId);
    if (!course) throw new Error('Course not found');

    const order = data.order ?? (course.modules?.length ? course.modules.length + 1 : 1);
    const moduleDoc = await ModuleModel.create({
      courseId: course._id,
      title: data.title,
      description: data.description || '',
      order,
      lessons: [],
    });

    course.modules.push(moduleDoc._id as any);
    await course.save();

    return moduleDoc;
  }

  static async createLesson(moduleId: string, data: { title: string; description?: string; order?: number }) {
    const moduleDoc = await ModuleModel.findById(moduleId);
    if (!moduleDoc) throw new Error('Module not found');

    const order = data.order ?? (moduleDoc.lessons?.length ? moduleDoc.lessons.length + 1 : 1);
    const lessonDoc = await LessonModel.create({
      moduleId: moduleDoc._id,
      courseId: moduleDoc.courseId,
      title: data.title,
      description: data.description || '',
      order,
      activities: [],
    });

    moduleDoc.lessons.push(lessonDoc._id as any);
    await moduleDoc.save();

    return lessonDoc;
  }

  static async updateLesson(lessonId: string, data: { title?: string; description?: string; order?: number }) {
    const lesson = await LessonModel.findByIdAndUpdate(lessonId, data, { new: true });
    if (!lesson) throw new Error('Lesson not found');
    return lesson;
  }

  static async deleteLesson(lessonId: string) {
    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    // Remove child activities
    await ActivityModel.deleteMany({ lessonId: lesson._id });

    // Remove reference from parent module
    await ModuleModel.findByIdAndUpdate(lesson.moduleId, {
      $pull: { lessons: lesson._id },
    });

    await LessonModel.findByIdAndDelete(lessonId);
    return { message: 'Lesson deleted successfully', id: lessonId };
  }

  static async createActivity(
    lessonId: string,
    data: {
      type: string;
      title: string;
      order?: number;
      content?: string;
      resourceRef?: string;
      resourceRefs?: string[];
      videoUrl?: string;
      assessmentData?: any;
      challengeData?: any;
      resourceData?: any;
    }
  ) {
    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    const order = data.order ?? (lesson.activities?.length ? lesson.activities.length + 1 : 1);
    let resolvedResourceRef = data.resourceRef;
    let resolvedAssessmentRef: any = undefined;
    let resolvedChallengeRef: any = undefined;

    // 1. If Video URL is supplied and type is VIDEO, create/normalize Resource automatically
    if (data.videoUrl || (data.type === 'VIDEO' && data.resourceData?.canonicalUrl)) {
      const url = data.videoUrl || data.resourceData?.canonicalUrl;
      const ytId = parseYouTubeId(url);
      if (ytId) {
        const videoResource = await ResourceModel.create({
          title: data.title || 'Lesson Video',
          type: 'VIDEO',
          provider: 'YOUTUBE',
          canonicalUrl: url,
          embedUrl: getYouTubeEmbedUrl(ytId),
          externalId: ytId,
          ownershipClass: 'EMBEDDED',
          license: 'YouTube Standard License (Embedded)',
          attribution: data.resourceData?.attribution || 'YouTube Creator',
          verificationStatus: 'VERIFIED',
          verificationEvidence: 'Auto-verified educational YouTube video embed',
        });
        resolvedResourceRef = videoResource._id.toString();
      }
    } else if (data.resourceData && !data.resourceRef) {
      // Create inline resource
      const resDoc = await ResourceModel.create({
        title: data.resourceData.title || data.title,
        type: data.resourceData.type || 'OFFICIAL_DOC',
        provider: data.resourceData.provider || 'Official Documentation',
        canonicalUrl: data.resourceData.canonicalUrl,
        ownershipClass: data.resourceData.ownershipClass || 'OPEN_LICENSE',
        license: data.resourceData.license || 'Open Documentation License',
        attribution: data.resourceData.attribution,
        verificationStatus: 'VERIFIED',
      });
      resolvedResourceRef = resDoc._id.toString();
    }

    // 2. If assessmentData is provided
    if (data.assessmentData) {
      const assessment = await AssessmentModel.create({
        title: data.assessmentData.title || `${data.title} Quiz`,
        description: data.assessmentData.description || 'Knowledge assessment',
        passingScore: data.assessmentData.passingScore || 70,
        skills: data.assessmentData.skills || [],
        questions: data.assessmentData.questions || [],
      });
      resolvedAssessmentRef = assessment._id;
    }

    // 3. If challengeData is provided
    if (data.challengeData) {
      const challenge = await ChallengeModel.create({
        title: data.challengeData.title || data.title,
        description: data.challengeData.description || '',
        difficulty: data.challengeData.difficulty || 'EASY',
        language: data.challengeData.language || 'javascript',
        starterCode: data.challengeData.starterCode || '',
        solutionCode: data.challengeData.solutionCode || '',
        hints: data.challengeData.hints || [],
        skills: data.challengeData.skills || [],
        testCases: data.challengeData.testCases || [],
      });
      resolvedChallengeRef = challenge._id;
    }

    const activity = await ActivityModel.create({
      lessonId: lesson._id,
      type: data.type,
      title: data.title,
      order,
      content: data.content || '',
      resourceRef: resolvedResourceRef,
      resourceRefs: data.resourceRefs || (resolvedResourceRef ? [resolvedResourceRef] : []),
      assessmentRef: resolvedAssessmentRef,
      challengeRef: resolvedChallengeRef,
    });

    if (resolvedAssessmentRef) {
      await AssessmentModel.findByIdAndUpdate(resolvedAssessmentRef, { activityId: activity._id });
    }
    if (resolvedChallengeRef) {
      await ChallengeModel.findByIdAndUpdate(resolvedChallengeRef, { activityId: activity._id });
    }

    lesson.activities.push(activity._id as any);
    await lesson.save();

    return activity;
  }

  static async updateActivity(activityId: string, data: any) {
    const activity = await ActivityModel.findByIdAndUpdate(activityId, data, { new: true });
    if (!activity) throw new Error('Activity not found');
    return activity;
  }

  static async deleteActivity(activityId: string) {
    const activity = await ActivityModel.findById(activityId);
    if (!activity) throw new Error('Activity not found');

    await LessonModel.findByIdAndUpdate(activity.lessonId, {
      $pull: { activities: activity._id },
    });

    if (activity.assessmentRef) {
      await AssessmentModel.findByIdAndDelete(activity.assessmentRef);
    }
    if (activity.challengeRef) {
      await ChallengeModel.findByIdAndDelete(activity.challengeRef);
    }

    await ActivityModel.findByIdAndDelete(activityId);
    return { message: 'Activity deleted successfully', id: activityId };
  }

  static async reorderActivities(lessonId: string, activityIds: string[]) {
    const lesson = await LessonModel.findById(lessonId);
    if (!lesson) throw new Error('Lesson not found');

    // Update orders in Activity documents
    for (let i = 0; i < activityIds.length; i++) {
      await ActivityModel.findByIdAndUpdate(activityIds[i], { order: i + 1 });
    }

    lesson.activities = activityIds.map((id) => new mongoose.Types.ObjectId(id)) as any;
    await lesson.save();

    return this.getLessonDetails(lessonId, false);
  }
}
