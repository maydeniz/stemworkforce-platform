// ===========================================
// Jobs Routes
// ===========================================

import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from '../index.js';
import { authMiddleware, optionalAuth, requireRole, checkPermission } from '../middleware/auth.js';
import { asyncHandler, APIError } from '../middleware/errorHandler.js';
import { logger } from '../utils/logger.js';

export const jobsRouter = Router();

// Validation schemas
const jobFiltersSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
  query: z.string().optional(),
  industries: z.string().transform(s => s.split(',')).optional(),
  locations: z.string().transform(s => s.split(',')).optional(),
  remote: z.coerce.boolean().optional(),
  clearance: z.string().transform(s => s.split(',')).optional(),
  jobTypes: z.string().transform(s => s.split(',')).optional(),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  postedAfter: z.string().datetime().optional(),
  sortBy: z.enum(['postedAt', 'salary', 'company']).default('postedAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

const applySchema = z.object({
  resumeUrl: z.string().url(),
  coverLetter: z.string().max(5000).optional(),
  linkedInUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
  availability: z.string().max(200).optional(),
  expectedSalary: z.number().positive().optional(),
  referral: z.string().max(200).optional(),
});

// GET /jobs - List jobs (public, with optional auth)
jobsRouter.get(
  '/',
  optionalAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const filters = jobFiltersSchema.parse(req.query);
    const { page, pageSize, query, sortBy, sortOrder } = filters;

    // Build where clause
    const where: any = {
      status: 'active',
      expiresAt: { gte: new Date() },
    };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { organization: { name: { contains: query, mode: 'insensitive' } } },
      ];
    }

    if (filters.industries) {
      where.industry = { in: filters.industries };
    }

    if (filters.locations) {
      where.location = { in: filters.locations };
    }

    if (filters.remote !== undefined) {
      where.remote = filters.remote;
    }

    if (filters.clearance) {
      where.clearance = { in: filters.clearance };
    }

    if (filters.jobTypes) {
      where.type = { in: filters.jobTypes };
    }

    if (filters.salaryMin) {
      where.salaryMax = { gte: filters.salaryMin };
    }

    if (filters.salaryMax) {
      where.salaryMin = { lte: filters.salaryMax };
    }

    // Get total count
    const totalItems = await prisma.job.count({ where });

    // Get jobs
    const jobs = await prisma.job.findMany({
      where,
      include: {
        organization: {
          select: { id: true, name: true, logo: true },
        },
        _count: {
          select: { applications: true },
        },
      },
      orderBy: {
        [sortBy === 'salary' ? 'salaryMax' : sortBy === 'company' ? 'organization' : 'postedAt']:
          sortBy === 'company' ? { name: sortOrder } : sortOrder,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Transform response
    const data = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.organization.name,
      companyLogo: job.organization.logo,
      location: job.location,
      remote: job.remote,
      type: job.type,
      industry: job.industry,
      salary: job.salaryMin && job.salaryMax ? {
        min: job.salaryMin,
        max: job.salaryMax,
        currency: job.salaryCurrency,
        period: job.salaryPeriod,
      } : null,
      clearance: job.clearance,
      skills: job.skills,
      description: job.description.substring(0, 300) + '...',
      applicantsCount: job._count.applications,
      postedAt: job.postedAt.toISOString(),
      expiresAt: job.expiresAt.toISOString(),
      status: job.status,
    }));

    const totalPages = Math.ceil(totalItems / pageSize);

    res.json({
      data,
      meta: {
        page,
        pageSize,
        totalPages,
        totalItems,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    });
  })
);

// GET /jobs/:id - Get job details
jobsRouter.get(
  '/:id',
  optionalAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        organization: {
          select: { id: true, name: true, logo: true, website: true, description: true },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      throw APIError.notFound('Job');
    }

    // Increment view count
    await prisma.job.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    res.json({
      ...job,
      applicantsCount: job._count.applications,
    });
  })
);

// POST /jobs - Create job (partner/admin only)
jobsRouter.post(
  '/',
  authMiddleware,
  requireRole('partner', 'admin'),
  asyncHandler(async (req: Request, res: Response) => {
    const jobData = req.body; // Add validation schema

    const job = await prisma.job.create({
      data: {
        ...jobData,
        postedById: req.user!.id,
        slug: jobData.title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      include: {
        organization: true,
      },
    });

    logger.info('Job created', { jobId: job.id, userId: req.user!.id });

    res.status(201).json(job);
  })
);

// POST /jobs/:id/apply - Apply to job
jobsRouter.post(
  '/:id/apply',
  authMiddleware,
  checkPermission('apply_jobs'),
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const applicationData = applySchema.parse(req.body);

    // Check if job exists and is active
    const job = await prisma.job.findFirst({
      where: {
        id,
        status: 'active',
        expiresAt: { gte: new Date() },
      },
    });

    if (!job) {
      throw APIError.notFound('Job');
    }

    // Check for existing application
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        jobId_userId: {
          jobId: id,
          userId: req.user!.id,
        },
      },
    });

    if (existingApplication) {
      throw APIError.conflict('You have already applied to this job');
    }

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        jobId: id,
        userId: req.user!.id,
        resume: applicationData.resumeUrl,
        coverLetter: applicationData.coverLetter,
        linkedIn: applicationData.linkedInUrl,
        portfolio: applicationData.portfolioUrl,
        availability: applicationData.availability,
        expectedSalary: applicationData.expectedSalary,
        referral: applicationData.referral,
      },
    });

    logger.info('Job application submitted', {
      applicationId: application.id,
      jobId: id,
      userId: req.user!.id,
    });

    res.status(201).json(application);
  })
);

// POST /jobs/:id/save - Save job
jobsRouter.post(
  '/:id/save',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    // Check if job exists
    const job = await prisma.job.findUnique({ where: { id } });
    if (!job) {
      throw APIError.notFound('Job');
    }

    // Upsert saved job
    await prisma.savedJob.upsert({
      where: {
        userId_jobId: {
          userId: req.user!.id,
          jobId: id,
        },
      },
      create: {
        userId: req.user!.id,
        jobId: id,
      },
      update: {},
    });

    res.status(201).json({ saved: true });
  })
);

// DELETE /jobs/:id/save - Unsave job
jobsRouter.delete(
  '/:id/save',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await prisma.savedJob.deleteMany({
      where: {
        userId: req.user!.id,
        jobId: id,
      },
    });

    res.json({ saved: false });
  })
);

// GET /jobs/saved - Get saved jobs
jobsRouter.get(
  '/saved',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const savedJobs = await prisma.savedJob.findMany({
      where: { userId: req.user!.id },
      include: {
        job: {
          include: {
            organization: {
              select: { id: true, name: true, logo: true },
            },
          },
        },
      },
      orderBy: { savedAt: 'desc' },
    });

    res.json(savedJobs.map((s) => s.job));
  })
);

// GET /jobs/applications - Get user's applications
jobsRouter.get(
  '/applications',
  authMiddleware,
  asyncHandler(async (req: Request, res: Response) => {
    const applications = await prisma.jobApplication.findMany({
      where: { userId: req.user!.id },
      include: {
        job: {
          include: {
            organization: {
              select: { id: true, name: true, logo: true },
            },
          },
        },
      },
      orderBy: { appliedAt: 'desc' },
    });

    res.json(applications);
  })
);

export default jobsRouter;
