// ===========================================
// Error Handler Middleware
// ===========================================

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { logger } from '../utils/logger.js';

// Custom API Error class
export class APIError extends Error {
  statusCode: number;
  code: string;
  details?: Record<string, string[]>;

  constructor(
    statusCode: number,
    code: string,
    message: string,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.name = 'APIError';
  }

  static badRequest(message: string, details?: Record<string, string[]>) {
    return new APIError(400, 'BAD_REQUEST', message, details);
  }

  static unauthorized(message = 'Authentication required') {
    return new APIError(401, 'UNAUTHORIZED', message);
  }

  static forbidden(message = 'Access denied') {
    return new APIError(403, 'FORBIDDEN', message);
  }

  static notFound(resource = 'Resource') {
    return new APIError(404, 'NOT_FOUND', `${resource} not found`);
  }

  static conflict(message: string) {
    return new APIError(409, 'CONFLICT', message);
  }

  static internal(message = 'Internal server error') {
    return new APIError(500, 'INTERNAL_ERROR', message);
  }
}

// Main error handler
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error
  logger.error('Error occurred', {
    requestId: req.id,
    method: req.method,
    path: req.path,
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Handle known error types
  if (err instanceof APIError) {
    res.status(err.statusCode).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    });
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const details: Record<string, string[]> = {};
    err.errors.forEach((error) => {
      const path = error.path.join('.');
      if (!details[path]) {
        details[path] = [];
      }
      details[path].push(error.message);
    });

    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input data',
        details,
      },
    });
    return;
  }

  // Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        res.status(409).json({
          error: {
            code: 'CONFLICT',
            message: 'A record with this value already exists',
            details: { field: (err.meta?.target as string[]) || [] },
          },
        });
        return;

      case 'P2025':
        res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Record not found',
          },
        });
        return;

      case 'P2003':
        res.status(400).json({
          error: {
            code: 'FOREIGN_KEY_ERROR',
            message: 'Referenced record does not exist',
          },
        });
        return;

      default:
        logger.error('Prisma error', { code: err.code, meta: err.meta });
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid query parameters',
      },
    });
    return;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json({
      error: {
        code: 'UNAUTHORIZED',
        message: err.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token',
      },
    });
    return;
  }

  // Multer errors (file upload)
  if (err.name === 'MulterError') {
    const multerError = err as any;
    let message = 'File upload error';
    
    if (multerError.code === 'LIMIT_FILE_SIZE') {
      message = 'File too large';
    } else if (multerError.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Unexpected file field';
    }

    res.status(400).json({
      error: {
        code: 'UPLOAD_ERROR',
        message,
      },
    });
    return;
  }

  // Default to 500 Internal Server Error
  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message:
        process.env.NODE_ENV === 'development'
          ? err.message
          : 'An unexpected error occurred',
    },
  });
};

// Async handler wrapper to catch async errors
export const asyncHandler = <T>(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<T>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
