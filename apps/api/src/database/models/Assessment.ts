import mongoose, { Document, Schema } from 'mongoose';
import { QuestionType } from '@codexa/shared';

export interface IQuestion {
  question: string;
  type: QuestionType;
  options: string[];
  correctOption: number | number[]; // index or indices
  explanation: string;
  points: number;
  codeSnippet?: string;
}

export interface IAssessment extends Document {
  activityId?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  passingScore: number;
  skills: { skillId: string; weight: number }[];
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionSubSchema = new Schema<IQuestion>(
  {
    question: { type: String, required: true },
    type: {
      type: String,
      enum: [
        'MULTIPLE_CHOICE',
        'MULTIPLE_SELECT',
        'CODE_SNIPPET',
        'TRUE_FALSE',
        'CODE_OUTPUT_PREDICTION',
        'CONCEPTUAL',
        'SHORT_ANSWER',
      ],
      default: 'MULTIPLE_CHOICE',
    },
    options: [{ type: String, required: true }],
    correctOption: { type: Schema.Types.Mixed, required: true },
    explanation: { type: String, default: '' },
    points: { type: Number, default: 10 },
    codeSnippet: { type: String },
  },
  { _id: true }
);

const AssessmentSchema = new Schema<IAssessment>(
  {
    activityId: { type: Schema.Types.ObjectId, ref: 'Activity', index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    passingScore: { type: Number, default: 70 },
    skills: [
      {
        skillId: { type: String, required: true },
        weight: { type: Number, default: 1.0 },
      },
    ],
    questions: [QuestionSubSchema],
  },
  { timestamps: true }
);

export const AssessmentModel = mongoose.model<IAssessment>('Assessment', AssessmentSchema);
