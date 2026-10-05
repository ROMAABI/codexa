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
   */
  static async retrieveApprovedContent(query: string, lessonId?: string): Promise<RetrievedKnowledgeChunk[]> {
    const chunks: RetrievedKnowledgeChunk[] = [];
    const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);

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
        // Sanitize snippet to neutralize any prompt injection markers inside content
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

    return chunks;
  }
}
