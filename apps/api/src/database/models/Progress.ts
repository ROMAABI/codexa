import mongoose, { Document, Schema } from 'mongoose';
import { ActivityState } from '@codexa/shared';

export interface IProgress extends Document {
  userId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  completedActivities: mongoose.Types.ObjectId[];
  currentActivityId?: mongoose.Types.ObjectId;
  activityStates: Map<string, ActivityState>;
  percentComplete: number;
  lastAccessedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProgressSchema = new Schema<IProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    completedActivities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    currentActivityId: { type: Schema.Types.ObjectId, ref: 'Activity' },
    activityStates: {
      type: Map,
      of: String,
      default: {},
    },
    percentComplete: { type: Number, default: 0, min: 0, max: 100 },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

ProgressSchema.index({ userId: 1, courseId: 1 }, { unique: true });

export const ProgressModel = mongoose.model<IProgress>('Progress', ProgressSchema);
