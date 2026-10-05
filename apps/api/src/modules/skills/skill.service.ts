import mongoose from 'mongoose';
import { SkillModel, ISkill } from '../../database/models/Skill';
import { UserSkillModel, IUserSkill } from '../../database/models/UserSkill';
import { ProgressModel } from '../../database/models/Progress';
import { CourseModel } from '../../database/models/Course';
import { SkillLevel } from '@codexa/shared';

export class SkillService {
  static calculateLevel(score: number): SkillLevel {
    if (score >= 90) return 'MASTER';
    if (score >= 70) return 'PROFICIENT';
    if (score >= 40) return 'COMPETENT';
    return 'NOVICE';
  }

  static async recordEvidence(params: {
    userId: string;
    skillSlug: string;
    sourceType: 'QUIZ' | 'CHALLENGE' | 'PROJECT';
    sourceId: string;
    score: number; // 0 - 100
    passed: boolean;
    mistakeTopic?: string;
  }): Promise<IUserSkill> {
    const { userId, skillSlug, sourceType, sourceId, score, passed, mistakeTopic } = params;

    let skill = await SkillModel.findOne({ slug: skillSlug });
    if (!skill) {
      skill = await SkillModel.create({
        slug: skillSlug,
        name: skillSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        category: 'LANGUAGE',
        description: `Skills in ${skillSlug}`,
        prerequisites: [],
      });
    }

    const uId = new mongoose.Types.ObjectId(userId);
    let userSkill = await UserSkillModel.findOne({
      userId: uId,
      skillSlug,
    });

    if (!userSkill) {
      userSkill = new UserSkillModel({
        userId: uId,
        skillId: skill._id,
        skillSlug,
        level: this.calculateLevel(score),
        masteryScore: score,
        evidenceCount: 1,
        lastAssessedAt: new Date(),
        weakAreas: mistakeTopic ? [mistakeTopic] : [],
        history: [
          {
            sourceType,
            sourceId,
            score,
            passed,
            timestamp: new Date(),
          },
        ],
      });
    } else {
      userSkill.evidenceCount += 1;
      userSkill.lastAssessedAt = new Date();
      userSkill.skillId = skill._id;
      userSkill.history.push({
        sourceType,
        sourceId,
        score,
        passed,
        timestamp: new Date(),
      });

      // Exponential moving average for mastery score: recent performance has 35% weight
      const alpha = 0.35;
      userSkill.masteryScore = Math.round(userSkill.masteryScore * (1 - alpha) + score * alpha);

      if (mistakeTopic && !userSkill.weakAreas.includes(mistakeTopic)) {
        userSkill.weakAreas.push(mistakeTopic);
      } else if (passed && mistakeTopic) {
        userSkill.weakAreas = userSkill.weakAreas.filter((w) => w !== mistakeTopic);
      }
    }

    userSkill.level = this.calculateLevel(userSkill.masteryScore);
    await userSkill.save();
    return userSkill;
  }

  static async getUserSkills(userId: string) {
    const uId = new mongoose.Types.ObjectId(userId);
    const userSkills = await UserSkillModel.find({ userId: uId }).sort({ masteryScore: -1 });

    const allSkills = await SkillModel.find();
    const skillMap = new Map<string, ISkill>();
    allSkills.forEach((s) => {
      skillMap.set(s.slug, s);
    });

    // Check if user has enrolled courses with progress but missing skills
    if (userSkills.length === 0) {
      const progresses = await ProgressModel.find({ userId: uId, percentComplete: { $gt: 0 } }).populate('courseId');
      for (const prog of progresses) {
        const course = prog.courseId as any;
        if (course && Array.isArray(course.skillsCovered)) {
          for (const sSlug of course.skillsCovered) {
            const matchedSkill = skillMap.get(sSlug);
            if (matchedSkill) {
              const estimatedScore = Math.min(100, Math.round(prog.percentComplete * 0.9));
              await this.recordEvidence({
                userId,
                skillSlug: sSlug,
                sourceType: 'QUIZ',
                sourceId: course.slug || 'course-progress',
                score: estimatedScore,
                passed: estimatedScore >= 50,
              }).catch(() => {});
            }
          }
        }
      }
    }

    // Re-query after potential auto-sync
    const latestUserSkills = await UserSkillModel.find({ userId: uId }).sort({ masteryScore: -1 });

    return latestUserSkills.map((us) => {
      const matched = skillMap.get(us.skillSlug);
      return {
        _id: us._id.toString(),
        id: us._id.toString(),
        skillSlug: us.skillSlug,
        slug: us.skillSlug,
        skillName: matched?.name || us.skillSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        name: matched?.name || us.skillSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        category: matched?.category || 'LANGUAGE',
        description: matched?.description || '',
        level: us.level,
        masteryScore: us.masteryScore,
        evidenceCount: us.evidenceCount,
        lastAssessedAt: us.lastAssessedAt,
        weakAreas: us.weakAreas || [],
        isAssessed: true,
      };
    });
  }

  static async getWeakSkills(userId: string, threshold = 60) {
    const uId = new mongoose.Types.ObjectId(userId);
    const weakSkills = await UserSkillModel.find({
      userId: uId,
      masteryScore: { $lt: threshold },
    }).sort({ masteryScore: 1 });

    const allSkills = await SkillModel.find();
    const skillMap = new Map<string, ISkill>();
    allSkills.forEach((s) => skillMap.set(s.slug, s));

    return weakSkills.map((ws) => {
      const matched = skillMap.get(ws.skillSlug);
      return {
        _id: ws._id.toString(),
        id: ws._id.toString(),
        skillSlug: ws.skillSlug,
        slug: ws.skillSlug,
        skillName: matched?.name || ws.skillSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        name: matched?.name || ws.skillSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        category: matched?.category || 'LANGUAGE',
        description: matched?.description || '',
        level: ws.level,
        masteryScore: ws.masteryScore,
        evidenceCount: ws.evidenceCount,
        lastAssessedAt: ws.lastAssessedAt,
        weakAreas: ws.weakAreas || [],
        isAssessed: true,
      };
    });
  }
}
