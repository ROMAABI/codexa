import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessmentAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  assessmentId: mongoose.Types.ObjectId;
  answers: Record<string, any>;
  score: number;
  passed: boolean;
  timeSpentSeconds: number;
  mistakes: {
    questionId: string;
    questionText: string;
    selected: any;
    correct: any;
    explanation: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const AssessmentAttemptSchema = new Schema<IAssessmentAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    assessmentId: { type: Schema.Types.ObjectId, ref: 'Assessment', required: true, index: true },
    answers: { type: Schema.Types.Mixed, default: {} },
    score: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    timeSpentSeconds: { type: Number, default: 0 },
    mistakes: [
      {
        questionId: { type: String },
        questionText: { type: String },
        selected: { type: Schema.Types.Mixed },
        correct: { type: Schema.Types.Mixed },
        explanation: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export const AssessmentAttemptModel = mongoose.model<IAssessmentAttempt>(
  'AssessmentAttempt',
  AssessmentAttemptSchema
);
