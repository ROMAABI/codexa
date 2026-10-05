import mongoose from 'mongoose';
import { SkillModel, ISkill } from '../../database/models/Skill';
import { UserSkillModel, IUserSkill } from '../../database/models/UserSkill';
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

    let userSkill = await UserSkillModel.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      skillSlug,
    });

    if (!userSkill) {
      userSkill = new UserSkillModel({
        userId: new mongoose.Types.ObjectId(userId),
        skillId: skill._id,
        skillSlug,
        level: 'NOVICE',
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
    return UserSkillModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ masteryScore: -1 });
  }

  static async getWeakSkills(userId: string, threshold = 60) {
    return UserSkillModel.find({
      userId: new mongoose.Types.ObjectId(userId),
      masteryScore: { $lt: threshold },
    }).sort({ masteryScore: 1 });
  }
}
