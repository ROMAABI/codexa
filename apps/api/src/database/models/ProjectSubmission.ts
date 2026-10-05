import mongoose, { Document, Schema } from 'mongoose';
import { SubmissionStatus } from '@codexa/shared';

export interface IProjectTestResult {
  testName: string;
  passed: boolean;
  expectedOutput?: string;
  actualOutput?: string;
  errorMessage?: string;
  hint?: string;
  durationMs?: number;
}

export interface IProjectSubmission extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  projectSlug: string;
  milestoneOrder: number;
  filesSnapshot: Array<{ path: string; content: string }>;
  status: SubmissionStatus;
  score: number;
  passedCount: number;
  totalCount: number;
  testResults: IProjectTestResult[];
  stdout: string;
  stderr: string;
  executionTimeMs: number;
  feedback: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectTestResultSchema = new Schema<IProjectTestResult>(
  {
    testName: { type: String, required: true },
    passed: { type: Boolean, required: true },
    expectedOutput: { type: String },
    actualOutput: { type: String },
    errorMessage: { type: String },
    hint: { type: String },
    durationMs: { type: Number, default: 0 },
  },
  { _id: false }
);

const ProjectSubmissionSchema = new Schema<IProjectSubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    projectSlug: { type: String, required: true, index: true },
    milestoneOrder: { type: Number, required: true },
    filesSnapshot: [
      {
        path: { type: String, required: true },
        content: { type: String, default: '' },
      },
    ],
    status: {
      type: String,
      enum: ['QUEUED', 'RUNNING', 'PASSED', 'FAILED', 'TIMEOUT', 'ERROR'],
      default: 'QUEUED',
    },
    score: { type: Number, default: 0 },
    passedCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
    testResults: [ProjectTestResultSchema],
    stdout: { type: String, default: '' },
    stderr: { type: String, default: '' },
    executionTimeMs: { type: Number, default: 0 },
    feedback: { type: String, default: '' },
  },
  { timestamps: true }
);

export const ProjectSubmissionModel = mongoose.model<IProjectSubmission>(
  'ProjectSubmission',
  ProjectSubmissionSchema
);
