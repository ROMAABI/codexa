import mongoose, { Document, Schema } from 'mongoose';

export interface ISkill extends Document {
  slug: string;
  name: string;
  category: 'LANGUAGE' | 'FRAMEWORK' | 'DATABASE' | 'ARCHITECTURE' | 'TOOLING';
  description: string;
  prerequisites: string[]; // Skill slugs
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema = new Schema<ISkill>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['LANGUAGE', 'FRAMEWORK', 'DATABASE', 'ARCHITECTURE', 'TOOLING'],
      required: true,
    },
    description: { type: String, default: '' },
    prerequisites: [{ type: String }],
  },
  { timestamps: true }
);

export const SkillModel = mongoose.model<ISkill>('Skill', SkillSchema);
