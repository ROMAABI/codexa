import mongoose from 'mongoose';
import { ProgressModel } from '../../database/models/Progress';
import { CourseModel } from '../../database/models/Course';
import { UserSkillModel } from '../../database/models/UserSkill';
import { AssessmentAttemptModel } from '../../database/models/AssessmentAttempt';
import { ActivityModel } from '../../database/models/Activity';
import { ChallengeModel } from '../../database/models/Challenge';
import { RecommendationDTO } from '@codexa/shared';

export class RecommendationService {
  static async getNextRecommendation(userId: string): Promise<RecommendationDTO> {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Rule 1: Check for recently failed assessment attempts (within last 7 days)
    const recentFailedAttempt = await AssessmentAttemptModel.findOne({
      userId: userObjectId,
      passed: false,
    })
      .sort({ createdAt: -1 })
      .populate('assessmentId');

    if (recentFailedAttempt && recentFailedAttempt.assessmentId) {
      const assessment: any = recentFailedAttempt.assessmentId;
      const activity = await ActivityModel.findOne({ assessmentRef: assessment._id });
      return {
        type: 'REVIEW_FAILED_ASSESSMENT',
        title: `Review Assessment: ${assessment.title}`,
        reason: `Your recent score was ${recentFailedAttempt.score}%. Strengthening these concepts now will prevent gaps later in the course.`,
        actionUrl: activity ? `/activity/${activity._id}` : `/courses`,
        courseId: activity?.lessonId?.toString() || '',
        activityId: activity?._id.toString(),
        priority: 10,
      };
    }

    // Rule 2: Check for identified weak skills (< 60% mastery)
    const weakSkill = await UserSkillModel.findOne({
      userId: userObjectId,
      masteryScore: { $lt: 60 },
    }).sort({ masteryScore: 1 });

    if (weakSkill) {
      // Find a challenge that tests this skill
      const challenge = await ChallengeModel.findOne({
        'skills.skillId': weakSkill.skillSlug,
      });

      if (challenge) {
        const activity = await ActivityModel.findOne({ challengeRef: challenge._id });
        return {
          type: 'TARGETED_PRACTICE',
          title: `Targeted Practice: ${weakSkill.skillSlug}`,
          reason: `Your current mastery is ${weakSkill.masteryScore}% with ${weakSkill.evidenceCount} evidence points. A targeted exercise will build proficiency.`,
          actionUrl: activity ? `/activity/${activity._id}` : `/courses`,
          courseId: '',
          activityId: activity?._id.toString(),
          skillRef: weakSkill.skillSlug,
          priority: 8,
        };
      }
    }

    // Rule 3: Check for active in-progress activities across enrolled courses
    const activeProgress = await ProgressModel.findOne({
      userId: userObjectId,
      percentComplete: { $lt: 100 },
    })
      .sort({ lastAccessedAt: -1 })
      .populate({
        path: 'courseId',
        populate: {
          path: 'modules',
          populate: {
            path: 'lessons',
            populate: { path: 'activities' },
          },
        },
      });

    if (activeProgress && activeProgress.courseId) {
      const course: any = activeProgress.courseId;
      const completedSet = new Set(
        activeProgress.completedActivities.map((id) => id.toString())
      );

      // Find first incomplete activity
      for (const mod of course.modules || []) {
        for (const les of mod.lessons || []) {
          for (const act of les.activities || []) {
            const actId = act._id.toString();
            if (!completedSet.has(actId)) {
              const state = activeProgress.activityStates.get(actId);
              return {
                type: state === 'IN_PROGRESS' ? 'RESUME_LESSON' : 'NEXT_CURRICULUM_STEP',
                title: `${state === 'IN_PROGRESS' ? 'Resume' : 'Next Up'}: ${act.title}`,
                reason: `Continue your structured progression through ${course.title} (Module: ${mod.title}).`,
                actionUrl: `/courses/${course.slug}/lesson/${les._id}?activity=${actId}`,
                courseId: course._id.toString(),
                lessonId: les._id.toString(),
                activityId: actId,
                priority: 6,
              };
            }
          }
        }
      }
    }

    // Rule 4: Track Progression & Prerequisite Recommendations for Completed Courses
    const completedCourses = await ProgressModel.find({
      userId: userObjectId,
      percentComplete: 100,
    }).populate('courseId');

    if (completedCourses.length > 0) {
      const completedSlugs = new Set(
        completedCourses
          .map((p: any) => p.courseId?.slug)
          .filter(Boolean)
      );

      // Track progression map: slug -> next course slug & explanation
      const trackProgression: Record<string, { nextSlug: string; reason: string }> = {
        'javascript-fundamentals': {
          nextSlug: 'react-js',
          reason: 'Recommended because you completed JavaScript fundamentals and have the prerequisites for modern React component architecture.',
        },
        'react-js': {
          nextSlug: 'next-js',
          reason: 'Recommended because you mastered React component lifecycles and are ready for Next.js full-stack App Router development.',
        },
        'backend-development-nodejs': {
          nextSlug: 'mern-stack-development',
          reason: 'Recommended because you understand Node.js backend engineering and can now assemble complete full-stack MERN systems.',
        },
        'python-programming': {
          nextSlug: 'machine-learning',
          reason: 'Recommended because you mastered Python syntax and data structures, opening the door to applied machine learning.',
        },
        'machine-learning': {
          nextSlug: 'deep-learning',
          reason: 'Recommended because you have foundational ML modeling skills and can now advance to deep neural networks.',
        },
        'deep-learning': {
          nextSlug: 'llm-development',
          reason: 'Recommended because you understand neural networks and are ready to engineer LLM and RAG multi-agent applications.',
        },
        'linux-fundamentals': {
          nextSlug: 'docker-containers',
          reason: 'Recommended because you mastered Linux administration and are ready to containerize software using Docker.',
        },
        'docker-containers': {
          nextSlug: 'kubernetes-orchestration',
          reason: 'Recommended because you know containerization and are ready to orchestrate multi-node clusters in Kubernetes.',
        },
        'sql-databases': {
          nextSlug: 'mongodb-development',
          reason: 'Recommended because you mastered relational SQL and can now expand into NoSQL document database modeling.',
        },
      };

      for (const [completedSlug, target] of Object.entries(trackProgression)) {
        if (completedSlugs.has(completedSlug) && !completedSlugs.has(target.nextSlug)) {
          const nextCourse = await CourseModel.findOne({ slug: target.nextSlug, status: 'PUBLISHED' });
          if (nextCourse) {
            return {
              type: 'NEXT_CURRICULUM_STEP',
              title: `Next in Learning Path: ${nextCourse.title}`,
              reason: target.reason,
              actionUrl: `/courses/${nextCourse.slug}`,
              courseId: nextCourse._id.toString(),
              priority: 5,
            };
          }
        }
      }
    }

    // Rule 5: If no active course, recommend starting the primary published course
    const firstCourse = await CourseModel.findOne({ status: 'PUBLISHED' }).sort({ createdAt: 1 });
    if (firstCourse) {
      return {
        type: 'NEXT_CURRICULUM_STEP',
        title: `Start Learning: ${firstCourse.title}`,
        reason: 'Begin your journey with the foundational technical curriculum designed to build real-world software engineering mastery.',
        actionUrl: `/courses/${firstCourse.slug}`,
        courseId: firstCourse._id.toString(),
        priority: 4,
      };
    }

    return {
      type: 'NEXT_CURRICULUM_STEP',
      title: 'Explore Technical Catalog',
      reason: 'Browse available courses and select your learning goal.',
      actionUrl: '/catalog',
      courseId: '',
      priority: 1,
    };
  }
}
