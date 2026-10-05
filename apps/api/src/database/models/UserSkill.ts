import mongoose, { Document, Schema } from 'mongoose';
import { SkillLevel } from '@codexa/shared';

export interface IUserSkill extends Document {
  userId: mongoose.Types.ObjectId;
  skillId: mongoose.Types.ObjectId;
  skillSlug: string;
  level: SkillLevel;
  masteryScore: number; // 0 to 100
  evidenceCount: number;
  lastAssessedAt: Date;
  weakAreas: string[];
  history: {
    sourceType: 'QUIZ' | 'CHALLENGE' | 'PROJECT';
    sourceId: string;
    score: number;
    passed: boolean;
    timestamp: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSkillSchema = new Schema<IUserSkill>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    skillId: { type: Schema.Types.ObjectId, ref: 'Skill', required: true },
    skillSlug: { type: String, required: true },
    level: {
      type: String,
      enum: ['NOVICE', 'COMPETENT', 'PROFICIENT', 'MASTER'],
      default: 'NOVICE',
    },
    masteryScore: { type: Number, default: 0, min: 0, max: 100 },
    evidenceCount: { type: Number, default: 0 },
    lastAssessedAt: { type: Date, default: Date.now },
    weakAreas: [{ type: String }],
    history: [
      {
        sourceType: { type: String, enum: ['QUIZ', 'CHALLENGE', 'PROJECT'], required: true },
        sourceId: { type: String, required: true },
        score: { type: Number, required: true },
        passed: { type: Boolean, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

UserSkillSchema.index({ userId: 1, skillSlug: 1 }, { unique: true });

export const UserSkillModel = mongoose.model<IUserSkill>('UserSkill', UserSkillSchema);
