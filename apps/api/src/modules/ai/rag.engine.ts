import mongoose from 'mongoose';
import { ActivityModel } from '../../database/models/Activity';
import { ResourceModel } from '../../database/models/Resource';
import { ResponseGuard } from './response.guard';

export interface RetrievedKnowledgeChunk {
  title: string;
  source: string;
  snippet: string;
}

export class RAGEngine {
  /**
   * Scoped Curriculum Knowledge Retrieval (V1 Keyword / BM25 Search)
   * Retrieves strictly verified notes and licensed documentation within current lesson scope.
   * Fail-safe: Returns empty array on any database failure rather than throwing.
   */
  static async retrieveApprovedContent(query: string, lessonId?: string): Promise<RetrievedKnowledgeChunk[]> {
    const chunks: RetrievedKnowledgeChunk[] = [];
    try {
      const queryTerms = (query || '').toLowerCase().split(/\s+/).filter((t) => t.length > 2);
      if (queryTerms.length === 0) return chunks;

      // 1. Search approved notes/activities within this lesson
      const queryFilter: any = {
        type: { $in: ['NOTES', 'ARTICLE', 'CODE_EXAMPLE'] },
      };
      if (lessonId && mongoose.Types.ObjectId.isValid(lessonId)) {
        queryFilter.lessonId = new mongoose.Types.ObjectId(lessonId);
      }

      const approvedActivities = await ActivityModel.find(queryFilter).limit(5);

      for (const act of approvedActivities) {
        if (!act.content) continue;
        const lowerContent = act.content.toLowerCase();
        const hasMatch = queryTerms.some((term) => lowerContent.includes(term));
        if (hasMatch || approvedActivities.length === 1) {
          const sanitizedContent = ResponseGuard.sanitizeInput(act.content.slice(0, 1000));
          chunks.push({
            title: act.title,
            source: 'Approved Curriculum Notes',
            snippet: sanitizedContent,
          });
        }
      }

      // 2. If nothing found in current lesson, query approved verified platform resources with valid licenses
      if (chunks.length === 0) {
        const verifiedResources = await ResourceModel.find({
          verificationStatus: 'VERIFIED',
          licenseValid: true,
        }).limit(3);

        for (const res of verifiedResources) {
          chunks.push({
            title: res.title,
            source: `${res.provider} [License: ${res.license}]`,
            snippet: `Approved reference documentation: ${res.canonicalUrl}`,
          });
        }
      }
    } catch (err) {
      console.warn('[RAGEngine] Non-critical knowledge retrieval error:', err);
    }

    return chunks;
  }
}
