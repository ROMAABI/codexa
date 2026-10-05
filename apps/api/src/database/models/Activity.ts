import mongoose, { Document, Schema } from 'mongoose';
import { ActivityType } from '@codexa/shared';

export interface IActivity extends Document {
  lessonId: mongoose.Types.ObjectId;
  type: ActivityType;
  title: string;
  order: number;
  content?: string;
  resourceRef?: mongoose.Types.ObjectId;
  resourceRefs?: mongoose.Types.ObjectId[];
  assessmentRef?: mongoose.Types.ObjectId;
  challengeRef?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ActivitySchema = new Schema<IActivity>(
  {
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true },
    type: {
      type: String,
      enum: [
        'VIDEO',
        'ARTICLE',
        'NOTES',
        'CODE_EXAMPLE',
        'INTERACTIVE_EXERCISE',
        'DEBUGGING_CHALLENGE',
        'QUIZ',
        'CODING_CHALLENGE',
        'PROJECT_TASK',
        'RESOURCE',
        'REFERENCE',
      ],
      required: true,
    },
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
    content: { type: String },
    resourceRef: { type: Schema.Types.ObjectId, ref: 'Resource' },
    resourceRefs: [{ type: Schema.Types.ObjectId, ref: 'Resource' }],
    assessmentRef: { type: Schema.Types.ObjectId, ref: 'Assessment' },
    challengeRef: { type: Schema.Types.ObjectId, ref: 'Challenge' },
  },
  { timestamps: true }
);

export const ActivityModel = mongoose.model<IActivity>('Activity', ActivitySchema);
