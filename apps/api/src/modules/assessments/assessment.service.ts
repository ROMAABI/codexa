import mongoose from 'mongoose';
import { AssessmentModel, IAssessment } from '../../database/models/Assessment';
import { AssessmentAttemptModel, IAssessmentAttempt } from '../../database/models/AssessmentAttempt';
import { SkillService } from '../skills/skill.service';
import { UserModel } from '../../database/models/User';
import { SYSTEM_DEFAULTS } from '@codexa/shared';

export class AssessmentService {
  static async getAssessmentForStudent(assessmentId: string) {
    if (!mongoose.Types.ObjectId.isValid(assessmentId)) return null;
    const assessment = await AssessmentModel.findById(assessmentId);
    if (!assessment) return null;

    // Never return correctOption to the student
    const sanitizedQuestions = assessment.questions.map((q: any) => ({
      id: q._id.toString(),
      question: q.question,
      type: q.type,
      options: q.options,
      points: q.points,
      codeSnippet: q.codeSnippet,
    }));

    return {
      id: assessment._id.toString(),
      activityId: assessment.activityId?.toString(),
      title: assessment.title,
      description: assessment.description,
      passingScore: assessment.passingScore,
      questions: sanitizedQuestions,
    };
  }

  static async submitAttempt(
    userId: string,
    assessmentId: string,
    answers: Record<string, any>,
    timeSpentSeconds: number
  ): Promise<IAssessmentAttempt> {
    if (!mongoose.Types.ObjectId.isValid(assessmentId)) {
      throw new Error('Invalid assessment ID');
    }
    if (!answers || typeof answers !== 'object' || Array.isArray(answers)) {
      throw new Error('Invalid answers payload. Expected a key-value object of questionId -> answer.');
    }

    const assessment = await AssessmentModel.findById(assessmentId);
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    let earnedPoints = 0;
    let totalPoints = 0;
    const mistakes: any[] = [];

    for (const q of assessment.questions as any[]) {
      const qId = q._id.toString();
      const studentAnswer = answers[qId];
      totalPoints += q.points;

      const isCorrect = Array.isArray(q.correctOption)
        ? Array.isArray(studentAnswer) &&
          studentAnswer.length === q.correctOption.length &&
          studentAnswer.every((v: any) => q.correctOption.includes(v))
        : studentAnswer === q.correctOption;

      if (isCorrect) {
        earnedPoints += q.points;
      } else {
        mistakes.push({
          questionId: qId,
          questionText: q.question,
          selected: studentAnswer !== undefined ? studentAnswer : null,
          correct: q.correctOption,
          explanation: q.explanation || 'Review the lesson notes for this concept.',
        });
      }
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= assessment.passingScore;

    const attempt = await AssessmentAttemptModel.create({
      userId: new mongoose.Types.ObjectId(userId),
      assessmentId: assessment._id,
      answers,
      score,
      passed,
      timeSpentSeconds: Math.max(0, timeSpentSeconds || 0),
      mistakes,
    });

    // Prevent XP farming: only award XP on first passing attempt
    if (passed) {
      const previousPass = await AssessmentAttemptModel.findOne({
        userId: new mongoose.Types.ObjectId(userId),
        assessmentId: assessment._id,
        passed: true,
        _id: { $ne: attempt._id },
      });

      if (!previousPass) {
        await UserModel.findByIdAndUpdate(userId, {
          $inc: { xp: SYSTEM_DEFAULTS.XP_PER_QUIZ_PASS },
        });
      }
    }

    // Record skill evidence for all skills associated with this assessment
    if (assessment.skills && assessment.skills.length > 0) {
      for (const skillItem of assessment.skills) {
        await SkillService.recordEvidence({
          userId,
          skillSlug: skillItem.skillId,
          sourceType: 'QUIZ',
          sourceId: assessment._id.toString(),
          score,
          passed,
          mistakeTopic: mistakes.length > 0 ? mistakes[0].questionText : undefined,
        });
      }
    }

    return attempt;
  }

  static async getStudentAttempts(userId: string, assessmentId: string) {
    if (!mongoose.Types.ObjectId.isValid(assessmentId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return [];
    }
    return AssessmentAttemptModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      assessmentId: new mongoose.Types.ObjectId(assessmentId),
    }).sort({ createdAt: -1 });
  }
}
