import mongoose, { Document, Schema } from 'mongoose';

export interface IMilestone {
  title: string;
  description: string;
  order: number;
  requiredFiles: string[];
}

export interface IProject extends Document {
  courseId: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  starterFiles: { path: string; content: string }[];
  milestones: IMilestone[];
  skillsDemonstrated: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSubSchema = new Schema<IMilestone>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },
    requiredFiles: [{ type: String }],
  },
  { _id: true }
);

const ProjectSchema = new Schema<IProject>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    starterFiles: [
      {
        path: { type: String, required: true },
        content: { type: String, default: '' },
      },
    ],
    milestones: [MilestoneSubSchema],
    skillsDemonstrated: [{ type: String }],
  },
  { timestamps: true }
);

export const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);
