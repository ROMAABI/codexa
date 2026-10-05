import mongoose, { Document, Schema } from 'mongoose';

export interface ILesson extends Document {
  moduleId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  order: number;
  activities: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const LessonSchema = new Schema<ILesson>(
  {
    moduleId: { type: Schema.Types.ObjectId, ref: 'Module', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    order: { type: Number, required: true },
    activities: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
  },
  { timestamps: true }
);

export const LessonModel = mongoose.model<ILesson>('Lesson', LessonSchema);
