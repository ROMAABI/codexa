import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../../config/env';
import { Role } from '@codexa/shared';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Role;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ error: 'Authentication required. No token provided.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedUser;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token.' });
    return;
  }
}

export function requireRole(role: Role) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }
    if (req.user.role !== role && req.user.role !== 'ADMIN') {
      res.status(403).json({ error: `Forbidden: requires ${role} role` });
      return;
    }
    next();
  };
}

export function enforceStudentIsolation(req: AuthRequest, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  // If a request provides a target userId parameter, it MUST match the authenticated user, unless ADMIN
  const targetUserId = req.params.userId || req.body.userId || req.query.userId;
  if (targetUserId && targetUserId !== req.user.userId && req.user.role !== 'ADMIN') {
    res.status(403).json({ error: 'Access denied: Cannot access or modify other student records.' });
    return;
  }
  next();
}
