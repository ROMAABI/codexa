import mongoose, { Document, Schema } from 'mongoose';
import { SubmissionStatus, TestResultItem } from '@codexa/shared';

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  code: string;
  status: SubmissionStatus;
  results: TestResultItem[];
  passedCount: number;
  totalCount: number;
  executionTimeMs: number;
  memoryUsageKb?: number;
  stdout?: string;
  stderr?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
    code: { type: String, required: true },
    status: {
      type: String,
      enum: ['QUEUED', 'RUNNING', 'PASSED', 'FAILED', 'TIMEOUT', 'ERROR'],
      default: 'QUEUED',
      index: true,
    },
    results: [
      {
        testCaseId: { type: String },
        description: { type: String },
        passed: { type: Boolean },
        actualOutput: { type: String },
        expectedOutput: { type: String },
        errorMessage: { type: String },
        durationMs: { type: Number },
      },
    ],
    passedCount: { type: Number, default: 0 },
    totalCount: { type: Number, default: 0 },
    executionTimeMs: { type: Number, default: 0 },
    memoryUsageKb: { type: Number },
    stdout: { type: String },
    stderr: { type: String },
    error: { type: String },
  },
  { timestamps: true }
);

export const SubmissionModel = mongoose.model<ISubmission>('Submission', SubmissionSchema);
