import mongoose, { Document, Schema } from 'mongoose';
import { OwnershipClass, VerificationStatus, ResourceType } from '@codexa/shared';

export interface IResource extends Document {
  title: string;
  type: ResourceType;
  provider: string; // e.g., 'MDN', 'React Docs', 'YouTube', 'Codexa Originals'
  canonicalUrl: string;
  embedUrl?: string;
  externalId?: string;
  ownershipClass: OwnershipClass;
  license: string;
  verificationStatus: VerificationStatus;
  attribution?: string;
  verificationEvidence?: string;
  verificationDate?: Date;
  verifiedAt?: Date;
  lastCheckedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema = new Schema<IResource>(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['VIDEO', 'OFFICIAL_DOC', 'ARTICLE', 'REFERENCE'],
      default: 'OFFICIAL_DOC',
    },
    provider: { type: String, required: true, trim: true },
    canonicalUrl: { type: String, required: true, trim: true },
    embedUrl: { type: String, trim: true },
    externalId: { type: String, trim: true },
    ownershipClass: {
      type: String,
      enum: ['OWNED', 'EMBEDDED', 'EXTERNAL_LINK', 'OPEN_LICENSE'],
      default: 'OWNED',
    },
    license: { type: String, default: 'Proprietary - Codexa' },
    verificationStatus: {
      type: String,
      enum: ['VERIFIED', 'NEEDS_REVIEW', 'LICENSE_UNKNOWN', 'UNAVAILABLE'],
      default: 'VERIFIED',
    },
    attribution: { type: String, trim: true },
    verificationEvidence: { type: String, trim: true },
    verificationDate: { type: Date, default: Date.now },
    verifiedAt: { type: Date, default: Date.now },
    lastCheckedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ResourceModel = mongoose.model<IResource>('Resource', ResourceSchema);
