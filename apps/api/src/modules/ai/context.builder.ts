import mongoose from 'mongoose';
import { UserModel } from '../../database/models/User';
import { CourseModel } from '../../database/models/Course';
import { ModuleModel } from '../../database/models/Module';
import { LessonModel } from '../../database/models/Lesson';
import { ActivityModel } from '../../database/models/Activity';
import { UserSkillModel } from '../../database/models/UserSkill';
import { AssessmentModel } from '../../database/models/Assessment';
import { ChallengeModel } from '../../database/models/Challenge';
import { ProgressModel } from '../../database/models/Progress';
import { AIMentorMode } from '@codexa/shared';

export interface BuiltAIContext {
  studentName: string;
  studentProfile: string;
  weakSkills: string[];
  courseTitle?: string;
  courseDomain?: string;
  moduleTitle?: string;
  moduleDescription?: string;
  lessonTitle?: string;
  lessonDescription?: string;
  lessonObjective?: string;
  lessonOrder?: number;
  currentStep?: string;
  notesSnippet?: string;
  challengeContext?: {
    title: string;
    description: string;
    language?: string;
    starterCode?: string;
    currentCode?: string;
    runtimeError?: string;
  };
  assessmentContext?: {
    title: string;
    description: string;
    isAssessmentActive: boolean;
  };
  progressSummary?: string;
  isAssessmentActive: boolean;
  mode: AIMentorMode;
}

export class AIContextBuilder {
  static async build(params: {
    userId: string;
    mode: AIMentorMode;
    courseId?: string;
    moduleId?: string;
    lessonId?: string;
    activityId?: string;
    activeAssessmentId?: string;
    challengeId?: string;
    currentCode?: string;
    runtimeError?: string;
    stepName?: 'VIDEO' | 'NOTES' | 'PRACTICE' | 'ASSESSMENT' | 'PROJECT';
  }): Promise<BuiltAIContext> {
    const {
      userId,
      mode,
      courseId,
      moduleId,
      lessonId,
      activityId,
      activeAssessmentId,
      challengeId,
      currentCode,
      runtimeError,
      stepName,
    } = params;

    // 1. Authenticated User Profile & Weak Skills (strictly privacy-safe, no passwords/emails)
    let studentName = 'Learner';
    let studentProfile = 'Codexa Student';

    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      const user = await UserModel.findById(userId);
      if (user) {
        studentName = user.name || 'Learner';
        studentProfile = `${user.name} • ${user.xp} XP • ${user.streak}-day streak • Level: ${user.preferences?.experienceLevel || 'Beginner'}`;
      }
    }

    const weakSkillsDocs = mongoose.Types.ObjectId.isValid(userId)
      ? await UserSkillModel.find({
          userId: new mongoose.Types.ObjectId(userId),
          masteryScore: { $lt: 65 },
        }).limit(3)
      : [];

    const weakSkills = weakSkillsDocs.map(
      (s) => `${s.skillSlug} (Mastery: ${s.masteryScore}%)`
    );

    // 2. Course & Module Metadata
    let resolvedCourseId = courseId;
    let resolvedModuleId = moduleId;
    let courseTitle: string | undefined;
    let courseDomain: string | undefined;
    let moduleTitle: string | undefined;
    let moduleDescription: string | undefined;

    // 3. Lesson Metadata
    let lessonTitle: string | undefined;
    let lessonDescription: string | undefined;
    let lessonObjective: string | undefined;
    let lessonOrder: number | undefined;

    if (lessonId && mongoose.Types.ObjectId.isValid(lessonId)) {
      const lesson = await LessonModel.findById(lessonId);
      if (lesson) {
        lessonTitle = lesson.title;
        lessonDescription = lesson.description;
        lessonObjective = `${lesson.title}: ${lesson.description}`;
        lessonOrder = lesson.order;
        resolvedModuleId = resolvedModuleId || lesson.moduleId?.toString();
        resolvedCourseId = resolvedCourseId || lesson.courseId?.toString();
      }
    }

    if (resolvedCourseId && mongoose.Types.ObjectId.isValid(resolvedCourseId)) {
      const course = await CourseModel.findById(resolvedCourseId);
      if (course) {
        courseTitle = course.title;
        courseDomain = course.domain;
      }
    }

    if (resolvedModuleId && mongoose.Types.ObjectId.isValid(resolvedModuleId)) {
      const moduleDoc = await ModuleModel.findById(resolvedModuleId);
      if (moduleDoc) {
        moduleTitle = moduleDoc.title;
        moduleDescription = moduleDoc.description;
      }
    }

    // 4. Current Step & In-Lesson Notes Snippet
    let currentStep: string = stepName ? `Step: ${stepName}` : 'In-Lesson Workspace';
    let notesSnippet: string | undefined;

    if (activityId && mongoose.Types.ObjectId.isValid(activityId)) {
      const activity = await ActivityModel.findById(activityId);
      if (activity) {
        switch (activity.type) {
          case 'VIDEO':
            currentStep = '① VIDEO (Visual Concept Scaffolding)';
            break;
          case 'NOTES':
            currentStep = '② NOTES (In-Platform Technical Lesson)';
            break;
          case 'PRACTICE':
          case 'CODING_CHALLENGE':
            currentStep = '③ CODE PRACTICE (Hands-on Drill)';
            break;
          case 'QUIZ':
          case 'ASSESSMENT':
            currentStep = '④ ASSESSMENT (Knowledge Check)';
            break;
          case 'PROJECT_TASK':
            currentStep = 'FINAL CAPSTONE PROJECT';
            break;
          default:
            currentStep = activity.title;
        }

        if (activity.content) {
          // Truncate snippet to 1000 characters to conserve context tokens
          notesSnippet = activity.content.slice(0, 1000);
        }
      }
    }

    // 5. Code Practice Context
    let challengeContext: BuiltAIContext['challengeContext'];
    const activeChallengeId = challengeId;

    if (activeChallengeId && mongoose.Types.ObjectId.isValid(activeChallengeId)) {
      const challenge = await ChallengeModel.findById(activeChallengeId);
      if (challenge) {
        challengeContext = {
          title: challenge.title,
          description: challenge.description,
          language: challenge.language,
          starterCode: challenge.starterCode,
          currentCode: currentCode || undefined,
          runtimeError: runtimeError || undefined,
        };
      }
    } else if (currentCode || runtimeError) {
      challengeContext = {
        title: 'Active Code Editor',
        description: 'Student is working in the interactive editor',
        currentCode: currentCode || undefined,
        runtimeError: runtimeError || undefined,
      };
    }

    // 6. Assessment Context & Anti-Cheat Detection
    let isAssessmentActive = Boolean(activeAssessmentId);
    let assessmentContext: BuiltAIContext['assessmentContext'];

    if (activeAssessmentId && mongoose.Types.ObjectId.isValid(activeAssessmentId)) {
      const assessment = await AssessmentModel.findById(activeAssessmentId);
      if (assessment) {
        isAssessmentActive = true;
        assessmentContext = {
          title: assessment.title,
          description: assessment.description,
          isAssessmentActive: true,
        };
      }
    } else if (activityId && mongoose.Types.ObjectId.isValid(activityId)) {
      const act = await ActivityModel.findById(activityId);
      if (act && (act.type === 'QUIZ' || act.assessmentRef)) {
        isAssessmentActive = true;
        assessmentContext = {
          title: act.title,
          description: 'Active Quiz / Assessment in progress',
          isAssessmentActive: true,
        };
      }
    }

    // 7. Student Learning Progress
    let progressSummary: string | undefined;
    if (resolvedCourseId && mongoose.Types.ObjectId.isValid(resolvedCourseId) && userId && mongoose.Types.ObjectId.isValid(userId)) {
      const progress = await ProgressModel.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        courseId: new mongoose.Types.ObjectId(resolvedCourseId),
      });

      if (progress) {
        progressSummary = `${progress.completedActivities?.length || 0} activities completed (${progress.percentComplete || 0}% course completion)`;
      }
    }

    return {
      studentName,
      studentProfile,
      weakSkills,
      courseTitle,
      courseDomain,
      moduleTitle,
      moduleDescription,
      lessonTitle,
      lessonDescription,
      lessonObjective,
      lessonOrder,
      currentStep,
      notesSnippet,
      challengeContext,
      assessmentContext,
      progressSummary,
      isAssessmentActive,
      mode,
    };
  }
}
