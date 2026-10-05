import mongoose, { Document, Schema } from 'mongoose';
import { Role } from '@codexa/shared';

export interface IUser extends Document {
  email: string;
  passwordHash: string;
  name: string;
  role: Role;
  xp: number;
  streak: number;
  googleId?: string;
  avatarUrl?: string;
  lastActiveDate?: string; // YYYY-MM-DD
  preferences: {
    learningGoal?: string;
    experienceLevel?: string;
    weeklyTargetHours?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['STUDENT', 'ADMIN'], default: 'STUDENT' },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 1 },
    googleId: { type: String },
    avatarUrl: { type: String },
    lastActiveDate: { type: String },
    preferences: {
      learningGoal: { type: String },
      experienceLevel: { type: String, default: 'beginner' },
      weeklyTargetHours: { type: Number, default: 5 },
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.model<IUser>('User', UserSchema);
