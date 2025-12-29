// ===========================================
// Authentication Middleware
// ===========================================

import { Request, Response, NextFunction } from 'express';
import { auth } from 'express-oauth2-jwt-bearer';
import jwt from 'jsonwebtoken';
import { prisma } from '../index.js';
import { logger } from '../utils/logger.js';

// Auth0 JWT validation
const jwtCheck = auth({
  audience: process.env.AUTH0_AUDIENCE || 'https://api.stemworkforce.gov',
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  tokenSigningAlg: 'RS256',
});

// Main auth middleware
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Check for Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'No token provided' },
      });
      return;
    }

    // In production, use Auth0 validation
    if (process.env.NODE_ENV === 'production') {
      jwtCheck(req, res, async (err) => {
        if (err) {
          logger.warn('Auth0 token validation failed', { error: err.message });
          res.status(401).json({
            error: { code: 'UNAUTHORIZED', message: 'Invalid token' },
          });
          return;
        }

        // Get user from database using Auth0 ID
        const auth0Id = (req as any).auth?.payload?.sub;
        if (!auth0Id) {
          res.status(401).json({
            error: { code: 'UNAUTHORIZED', message: 'Invalid token payload' },
          });
          return;
        }

        const user = await prisma.user.findUnique({
          where: { auth0Id },
          select: { id: true, email: true, role: true },
        });

        if (!user) {
          res.status(401).json({
            error: { code: 'UNAUTHORIZED', message: 'User not found' },
          });
          return;
        }

        req.user = user;
        next();
      });
    } else {
      // Development mode - simplified token handling
      const token = authHeader.substring(7);
      
      try {
        // Try to decode JWT for development
        const decoded = jwt.decode(token) as any;
        
        if (decoded && decoded.sub) {
          // Look up user by auth0Id or email
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { auth0Id: decoded.sub },
                { email: decoded.email },
              ],
            },
            select: { id: true, email: true, role: true },
          });

          if (user) {
            req.user = user;
            next();
            return;
          }
        }

        // For demo/development, create a mock user
        req.user = {
          id: 'demo-user-id',
          email: 'demo@stemworkforce.gov',
          role: 'jobseeker',
        };
        next();
      } catch {
        // Token decode failed, use demo user
        req.user = {
          id: 'demo-user-id',
          email: 'demo@stemworkforce.gov',
          role: 'jobseeker',
        };
        next();
      }
    }
  } catch (error) {
    logger.error('Auth middleware error', { error });
    res.status(500).json({
      error: { code: 'INTERNAL_ERROR', message: 'Authentication error' },
    });
  }
};

// Optional auth - doesn't require token but attaches user if present
export const optionalAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  // If token is present, try to authenticate
  authMiddleware(req, res, next);
};

// Role-based access control middleware
export const requireRole = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Required role: ${roles.join(' or ')}`,
        },
      });
      return;
    }

    next();
  };
};

// Check specific permissions
export const checkPermission = (permission: string) => {
  const rolePermissions: Record<string, string[]> = {
    admin: ['*'],
    partner: ['post_jobs', 'view_applicants', 'manage_postings', 'view_analytics'],
    educator: ['post_programs', 'manage_students', 'view_programs'],
    jobseeker: ['apply_jobs', 'save_jobs', 'register_events', 'enroll_training'],
    intern: ['apply_jobs', 'save_jobs', 'register_events', 'enroll_training'],
  };

  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: { code: 'UNAUTHORIZED', message: 'Authentication required' },
      });
      return;
    }

    const userPermissions = rolePermissions[req.user.role] || [];
    const hasPermission =
      userPermissions.includes('*') || userPermissions.includes(permission);

    if (!hasPermission) {
      res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: `Missing permission: ${permission}`,
        },
      });
      return;
    }

    next();
  };
};
