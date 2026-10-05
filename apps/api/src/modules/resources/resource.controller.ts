import { Router, Request, Response } from 'express';
import { ResourceModel } from '../../database/models/Resource';
import { authenticateToken, requireRole, AuthRequest } from '../auth/auth.middleware';
import { parseYouTubeId, getYouTubeEmbedUrl, isValidYouTubeUrl } from '@codexa/shared';

export const resourcesRouter = Router();

// Student-facing: Get only verified resources (excluding private admin verification evidence)
resourcesRouter.get('/', async (req: Request, res: Response) => {
  try {
    const { type, provider } = req.query;
    const filter: any = { verificationStatus: 'VERIFIED' };
    if (type) filter.type = type;
    if (provider) filter.provider = provider;

    const resources = await ResourceModel.find(filter)
      .select('-verificationEvidence -__v')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin-facing: Get all resources with full metadata
resourcesRouter.get('/admin', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const resources = await ResourceModel.find().sort({ createdAt: -1 });
    res.json(resources);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin-facing: Get single resource by ID
resourcesRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const resource = await ResourceModel.findById(req.params.id);
    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    res.json(resource);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin-facing: Create new resource with YouTube auto-normalization
resourcesRouter.post('/', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      type,
      provider,
      canonicalUrl,
      embedUrl,
      externalId,
      ownershipClass,
      license,
      attribution,
      verificationStatus,
      verificationEvidence,
    } = req.body;

    if (!title || !canonicalUrl || !provider) {
      res.status(400).json({ error: 'title, provider, and canonicalUrl are required' });
      return;
    }

    let resolvedType = type || 'OFFICIAL_DOC';
    let resolvedOwnership = ownershipClass || 'OPEN_LICENSE';
    let resolvedExternalId = externalId;
    let resolvedEmbedUrl = embedUrl;
    let resolvedLicense = license || 'CC-BY-4.0';

    // Auto-detect & normalize YouTube URLs
    const isYouTube =
      provider.toUpperCase().includes('YOUTUBE') ||
      canonicalUrl.includes('youtube.com') ||
      canonicalUrl.includes('youtu.be');

    if (isYouTube) {
      const ytId = parseYouTubeId(canonicalUrl) || parseYouTubeId(externalId);
      if (!ytId) {
        res.status(400).json({ error: 'Invalid YouTube URL or Video ID provided' });
        return;
      }
      resolvedType = 'VIDEO';
      resolvedOwnership = 'EMBEDDED';
      resolvedExternalId = ytId;
      resolvedEmbedUrl = getYouTubeEmbedUrl(ytId);
      resolvedLicense = license || 'YouTube Standard License (Embedded)';
    }

    const resource = await ResourceModel.create({
      title,
      type: resolvedType,
      provider,
      canonicalUrl,
      embedUrl: resolvedEmbedUrl,
      externalId: resolvedExternalId,
      ownershipClass: resolvedOwnership,
      license: resolvedLicense,
      attribution: attribution || (isYouTube ? 'YouTube Creator' : provider),
      verificationStatus: verificationStatus || 'VERIFIED',
      verificationEvidence: verificationEvidence || (isYouTube ? 'Verified YouTube educational embed ID' : 'Verified official documentation URL'),
      verificationDate: new Date(),
      verifiedAt: new Date(),
      lastCheckedAt: new Date(),
    });

    res.status(201).json(resource);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin-facing: Update resource / verification
resourcesRouter.put('/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, lastCheckedAt: new Date() };

    // If canonicalUrl changed and is YouTube, re-normalize
    if (updates.canonicalUrl && (updates.provider?.toUpperCase().includes('YOUTUBE') || updates.canonicalUrl.includes('youtu'))) {
      const ytId = parseYouTubeId(updates.canonicalUrl);
      if (ytId) {
        updates.externalId = ytId;
        updates.embedUrl = getYouTubeEmbedUrl(ytId);
        updates.type = 'VIDEO';
        updates.ownershipClass = 'EMBEDDED';
      }
    }

    const resource = await ResourceModel.findByIdAndUpdate(id, updates, { new: true });
    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }

    res.json(resource);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Admin-facing: Delete resource
resourcesRouter.delete('/:id', authenticateToken, requireRole('ADMIN'), async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await ResourceModel.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    res.json({ message: 'Resource deleted successfully', id });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
