import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../modules/auth/auth.middleware';

interface RateLimitRecord {
  timestamps: number[];
}

export interface RateLimitOptions {
  windowMs: number; // e.g., 60_000 for 1 minute
  maxRequests: number; // max requests within windowMs
  message?: string;
}

export function createRateLimiter(options: RateLimitOptions) {
  const { windowMs, maxRequests, message = 'Too many requests. Please slow down.' } = options;
  const store = new Map<string, RateLimitRecord>();

  // Periodically prune stale entries every 5 minutes
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);
      if (record.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);

  // Allow node to exit if this interval is still pending
  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    // In test environment or if disabled, allow bypass unless explicitly testing rate limits
    if (process.env.DISABLE_RATE_LIMITS === 'true' || (process.env.NODE_ENV === 'test' && !req.headers['x-test-rate-limit'])) {
      return next();
    }

    const clientKey =
      req.user?.userId ||
      req.ip ||
      (req.headers['x-forwarded-for'] as string) ||
      'unknown-client';

    const now = Date.now();
    let record = store.get(clientKey);

    if (!record) {
      record = { timestamps: [] };
      store.set(clientKey, record);
    }

    // Filter out timestamps older than window
    record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

    if (record.timestamps.length >= maxRequests) {
      res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', 0);
      res.status(429).json({
        error: message,
        retryAfterSeconds: Math.ceil(windowMs / 1000),
      });
      return;
    }

    record.timestamps.push(now);
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', maxRequests - record.timestamps.length);
    next();
  };
}

// Preset rate limiters
export const authRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
  message: 'Too many authentication attempts. Please wait a minute before retrying.',
});

export const aiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 40,
  message: 'AI request limit reached. Please wait a moment before sending more queries.',
});

export const executionRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
  message: 'Code execution rate limit exceeded. Please wait before submitting or running again.',
});

export const assessmentRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  maxRequests: 30,
  message: 'Assessment attempt rate limit exceeded. Please wait a moment before retrying.',
});
