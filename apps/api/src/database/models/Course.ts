import mongoose, { Document, Schema } from 'mongoose';
import { CourseLevel, CourseStatus } from '@codexa/shared';

export interface ICourse extends Document {
  slug: string;
  title: string;
  description: string;
  domain: string;
  level: CourseLevel;
  status: CourseStatus;
  estimatedHours: number;
  skillsCovered: string[]; // Skill ObjectIds or slugs
  prerequisites: string[]; // Course or skill identifiers
  modules: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema = new Schema<ICourse>(
  {
    slug: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    domain: { type: String, required: true, index: true },
    level: { type: String, enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'], default: 'BEGINNER' },
    status: { type: String, enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'], default: 'PUBLISHED' },
    estimatedHours: { type: Number, default: 20 },
    skillsCovered: [{ type: String }],
    prerequisites: [{ type: String }],
    modules: [{ type: Schema.Types.ObjectId, ref: 'Module' }],
  },
  { timestamps: true }
);

export const CourseModel = mongoose.model<ICourse>('Course', CourseSchema);
