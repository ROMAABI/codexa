import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectFile {
  path: string;
  content: string;
  isBinary?: boolean;
}

export interface IProjectCheckpoint {
  milestone: number;
  savedAt: Date;
  commitMessage?: string;
  files: IProjectFile[];
}

export interface IProjectWorkspace extends Document {
  userId: mongoose.Types.ObjectId;
  projectId: mongoose.Types.ObjectId;
  projectSlug: string;
  files: IProjectFile[];
  activeMilestone: number;
  activeFilePath: string;
  openFiles: string[];
  checkpoints: IProjectCheckpoint[];
  lastSavedAt: Date;
  lastRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectFileSchema = new Schema<IProjectFile>(
  {
    path: { type: String, required: true },
    content: { type: String, default: '' },
    isBinary: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProjectCheckpointSchema = new Schema<IProjectCheckpoint>(
  {
    milestone: { type: Number, required: true },
    savedAt: { type: Date, default: Date.now },
    commitMessage: { type: String },
    files: [ProjectFileSchema],
  },
  { _id: true }
);

const ProjectWorkspaceSchema = new Schema<IProjectWorkspace>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
    projectSlug: { type: String, required: true, index: true },
    files: [ProjectFileSchema],
    activeMilestone: { type: Number, default: 1 },
    activeFilePath: { type: String, default: 'server.js' },
    openFiles: [{ type: String }],
    checkpoints: [ProjectCheckpointSchema],
    lastSavedAt: { type: Date, default: Date.now },
    lastRunAt: { type: Date },
  },
  { timestamps: true }
);

ProjectWorkspaceSchema.index({ userId: 1, projectId: 1 }, { unique: true });
ProjectWorkspaceSchema.index({ userId: 1, projectSlug: 1 }, { unique: true });

export const ProjectWorkspaceModel = mongoose.model<IProjectWorkspace>(
  'ProjectWorkspace',
  ProjectWorkspaceSchema
);
