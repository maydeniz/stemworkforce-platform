// ===========================================
// STEMWorkforce API Server - Entry Point
// ===========================================

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';

// Import routes
import { authRouter } from './routes/auth.js';
import { userRouter } from './routes/users.js';
import { jobsRouter } from './routes/jobs.js';
import { eventsRouter } from './routes/events.js';
import { trainingRouter } from './routes/training.js';
import { workforceRouter } from './routes/workforce.js';
import { partnersRouter } from './routes/partners.js';
import { challengesRouter } from './routes/challenges.js';
import { auditRouter } from './routes/audit.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { authMiddleware } from './middleware/auth.js';
import { logger } from './utils/logger.js';

// Initialize Prisma
export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Initialize Express
const app: Express = express();
const PORT = process.env.PORT || 8000;

// ===========================================
// Middleware Configuration
// ===========================================

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:3000',
    'https://stemworkforce.gov',
    'https://staging.stemworkforce.gov',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'X-Request-ID'],
}));

// Compression
app.use(compression());

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined', {
  stream: { write: (message) => logger.info(message.trim()) },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Request ID middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.id = req.headers['x-request-id'] as string || crypto.randomUUID();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// ===========================================
// Health Check Endpoints
// ===========================================

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/health/ready', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ready', database: 'connected' });
  } catch (error) {
    res.status(503).json({ status: 'not ready', database: 'disconnected' });
  }
});

app.get('/health/live', (req: Request, res: Response) => {
  res.json({ status: 'alive' });
});

// ===========================================
// API Routes
// ===========================================

const API_PREFIX = '/api/v1';

// Public routes
app.use(`${API_PREFIX}/auth`, authRouter);

// Protected routes (require authentication)
app.use(`${API_PREFIX}/user`, authMiddleware, userRouter);
app.use(`${API_PREFIX}/jobs`, jobsRouter); // Partially protected
app.use(`${API_PREFIX}/events`, eventsRouter); // Partially protected
app.use(`${API_PREFIX}/training`, trainingRouter); // Partially protected
app.use(`${API_PREFIX}/workforce`, workforceRouter);
app.use(`${API_PREFIX}/partners`, partnersRouter);
app.use(`${API_PREFIX}/challenges`, challengesRouter); // Partially protected
app.use(`${API_PREFIX}/audit`, authMiddleware, auditRouter);

// ===========================================
// Error Handling
// ===========================================

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// Global error handler
app.use(errorHandler);

// ===========================================
// Server Startup
// ===========================================

const startServer = async () => {
  try {
    // Connect to database
    await prisma.$connect();
    logger.info('✅ Database connected');

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📚 API available at http://localhost:${PORT}${API_PREFIX}`);
      logger.info(`💊 Health check at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async () => {
  logger.info('Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start
startServer();

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export default app;
