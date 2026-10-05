import mongoose, { Document, Schema } from 'mongoose';
import { AIMentorMode } from '@codexa/shared';

export interface IAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  mode: AIMentorMode;
  groundedInLesson?: boolean;
  timestamp: Date;
}

export interface IAIConversation extends Document {
  userId: mongoose.Types.ObjectId;
  context: {
    courseId?: mongoose.Types.ObjectId;
    lessonId?: mongoose.Types.ObjectId;
    activityId?: mongoose.Types.ObjectId;
  };
  messages: IAIMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const AIMessageSubSchema = new Schema<IAIMessage>(
  {
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    mode: { type: String, required: true },
    groundedInLesson: { type: Boolean, default: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: true }
);

const AIConversationSchema = new Schema<IAIConversation>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    context: {
      courseId: { type: Schema.Types.ObjectId, ref: 'Course' },
      lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson' },
      activityId: { type: Schema.Types.ObjectId, ref: 'Activity' },
    },
    messages: [AIMessageSubSchema],
  },
  { timestamps: true }
);

export const AIConversationModel = mongoose.model<IAIConversation>(
  'AIConversation',
  AIConversationSchema
);
