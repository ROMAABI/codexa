import mongoose, { Document, Schema } from 'mongoose';

export interface IMilestoneTestCase {
  testName: string;
  expectedOutput?: string;
  hint?: string;
  hidden?: boolean;
}

export interface IMilestone {
  title: string;
  description: string;
  order: number;
  requiredFiles: string[];
  testCases?: IMilestoneTestCase[];
  verificationScript?: string;
}

export interface IProject extends Document {
  courseId: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  description: string;
  language: string;
  template?: string;
  entryFile?: string;
  runCommand?: string;
  testCommand?: string;
  previewType?: 'web' | 'terminal' | 'none';
  previewPort?: number;
  starterFiles: { path: string; content: string; isBinary?: boolean }[];
  milestones: IMilestone[];
  skillsDemonstrated: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneTestCaseSchema = new Schema<IMilestoneTestCase>(
  {
    testName: { type: String, required: true },
    expectedOutput: { type: String },
    hint: { type: String },
    hidden: { type: Boolean, default: true },
  },
  { _id: false }
);

const MilestoneSubSchema = new Schema<IMilestone>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },
    requiredFiles: [{ type: String }],
    testCases: [MilestoneTestCaseSchema],
    verificationScript: { type: String },
  },
  { _id: true }
);

const ProjectSchema = new Schema<IProject>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    language: { type: String, default: 'javascript' },
    template: { type: String, default: 'node-express' },
    entryFile: { type: String, default: 'server.js' },
    runCommand: { type: String, default: 'node server.js' },
    testCommand: { type: String, default: 'node test.js' },
    previewType: { type: String, enum: ['web', 'terminal', 'none'], default: 'web' },
    previewPort: { type: Number, default: 5000 },
    starterFiles: [
      {
        path: { type: String, required: true },
        content: { type: String, default: '' },
        isBinary: { type: Boolean, default: false },
      },
    ],
    milestones: [MilestoneSubSchema],
    skillsDemonstrated: [{ type: String }],
  },
  { timestamps: true }
);

export const ProjectModel = mongoose.model<IProject>('Project', ProjectSchema);
