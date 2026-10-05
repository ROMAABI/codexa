import mongoose, { Document, Schema } from 'mongoose';
import { ProgrammingLanguage, ChallengeDifficulty } from '@codexa/shared';

export interface ITestCase {
  input: string;
  expectedOutput: string;
  description: string;
  hidden: boolean;
}

export interface IChallenge extends Document {
  activityId?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  language: ProgrammingLanguage;
  starterCode: string;
  solutionCode?: string;
  testHarness?: string; // custom test wrapper if any
  testCases: ITestCase[];
  hints: string[];
  skills: { skillId: string; weight: number }[];
  createdAt: Date;
  updatedAt: Date;
}

const TestCaseSubSchema = new Schema<ITestCase>(
  {
    input: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    description: { type: String, required: true },
    hidden: { type: Boolean, default: false },
  },
  { _id: true }
);

const ChallengeSchema = new Schema<IChallenge>(
  {
    activityId: { type: Schema.Types.ObjectId, ref: 'Activity', index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['EASY', 'MEDIUM', 'HARD'], default: 'EASY' },
    language: {
      type: String,
      enum: [
        'javascript',
        'typescript',
        'python',
        'sql',
        'java',
        'cpp',
        'go',
        'bash',
        'dockerfile',
        'yaml',
        'json',
        'html',
        'css',
        'markdown',
      ],
      default: 'javascript',
    },
    starterCode: { type: String, required: true },
    solutionCode: { type: String },
    testHarness: { type: String },
    testCases: [TestCaseSubSchema],
    hints: [{ type: String }],
    skills: [
      {
        skillId: { type: String, required: true },
        weight: { type: Number, default: 1.0 },
      },
    ],
  },
  { timestamps: true }
);

export const ChallengeModel = mongoose.model<IChallenge>('Challenge', ChallengeSchema);
