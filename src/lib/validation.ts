// ===========================================
// Centralized Input Validation with Zod
// ===========================================

import { z } from 'zod';

// ===========================================
// Common Validators
// ===========================================

/**
 * Email validation with proper RFC compliance
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Invalid email address')
  .max(255, 'Email must be less than 255 characters')
  .transform((email) => email.toLowerCase().trim());

/**
 * Password validation with strength requirements
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Simple password (for login - no strength requirements)
 */
export const loginPasswordSchema = z
  .string()
  .min(1, 'Password is required')
  .max(128, 'Password must be less than 128 characters');

/**
 * Phone number validation
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-()]{10,20}$/, 'Invalid phone number format')
  .transform((phone) => phone.replace(/[\s\-()]/g, ''));

/**
 * URL validation
 */
export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .max(2048, 'URL must be less than 2048 characters');

/**
 * Optional URL that can be empty string
 */
export const optionalUrlSchema = z
  .string()
  .transform((val) => val.trim())
  .refine((val) => val === '' || z.string().url().safeParse(val).success, {
    message: 'Invalid URL format',
  })
  .optional()
  .or(z.literal(''));

/**
 * UUID validation
 */
export const uuidSchema = z.string().uuid('Invalid ID format');

/**
 * Safe string - sanitized for XSS
 */
export const safeStringSchema = (maxLength = 1000) =>
  z
    .string()
    .max(maxLength, `Must be less than ${maxLength} characters`)
    .transform((str) =>
      str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .trim()
    );

/**
 * Search query - sanitized and length-limited
 */
export const searchQuerySchema = z
  .string()
  .max(256, 'Search query too long')
  .transform((str) =>
    str
      .replace(/[<>'"`;]/g, '') // Remove potentially dangerous chars
      .trim()
  );

// ===========================================
// User-Related Schemas
// ===========================================

/**
 * User name validation
 */
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s\-']+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
  .transform((name) => name.trim());

/**
 * User role validation
 */
export const userRoleSchema = z.enum([
  'intern',
  'jobseeker',
  'educator',
  'partner',
  'employer',
  'service_provider',
  'admin',
  'super_admin',
]);

/**
 * User registration schema
 */
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  role: userRoleSchema.optional().default('jobseeker'),
  organizationName: safeStringSchema(200).optional(),
  agreedToTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must agree to the terms and conditions' }),
  }),
});

/**
 * User login schema
 */
export const userLoginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

/**
 * Password reset request schema
 */
export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

/**
 * Password reset schema
 */
export const passwordResetSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

// ===========================================
// Profile Schemas
// ===========================================

/**
 * User profile update schema
 */
export const userProfileSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  phone: phoneSchema.optional().or(z.literal('')),
  bio: safeStringSchema(2000).optional(),
  location: safeStringSchema(200).optional(),
  website: optionalUrlSchema,
  linkedinUrl: optionalUrlSchema,
  githubUrl: optionalUrlSchema,
});

// ===========================================
// Job-Related Schemas
// ===========================================

/**
 * Salary validation
 */
export const salarySchema = z.object({
  min: z.number().min(0, 'Salary cannot be negative').max(10000000, 'Salary seems too high'),
  max: z.number().min(0, 'Salary cannot be negative').max(10000000, 'Salary seems too high'),
}).refine((data) => data.min <= data.max, {
  message: 'Minimum salary cannot be greater than maximum',
  path: ['min'],
});

/**
 * Job posting schema
 */
export const jobPostingSchema = z.object({
  title: safeStringSchema(200),
  description: safeStringSchema(10000),
  company: safeStringSchema(200),
  location: safeStringSchema(200),
  salaryMin: z.number().min(0).max(10000000).optional(),
  salaryMax: z.number().min(0).max(10000000).optional(),
  jobType: z.enum(['full-time', 'part-time', 'contract', 'internship', 'temporary']),
  remote: z.boolean().optional(),
  requirements: z.array(safeStringSchema(500)).max(20).optional(),
  benefits: z.array(safeStringSchema(500)).max(20).optional(),
});

/**
 * Job application schema
 */
export const jobApplicationSchema = z.object({
  jobId: uuidSchema,
  coverLetter: safeStringSchema(5000).optional(),
  resumeUrl: urlSchema.optional(),
  portfolioUrl: optionalUrlSchema,
  availableStartDate: z.string().datetime().optional(),
});

// ===========================================
// Challenge-Related Schemas
// ===========================================

/**
 * Challenge submission schema
 */
export const challengeSubmissionSchema = z.object({
  challengeId: uuidSchema,
  title: safeStringSchema(200),
  description: safeStringSchema(5000),
  repositoryUrl: optionalUrlSchema,
  demoUrl: optionalUrlSchema,
  videoUrl: optionalUrlSchema,
});

// ===========================================
// File Upload Validation
// ===========================================

/**
 * Allowed file types for different upload categories
 */
export const ALLOWED_FILE_TYPES = {
  resume: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
} as const;

/**
 * File size limits (in bytes)
 */
export const FILE_SIZE_LIMITS = {
  resume: 10 * 1024 * 1024, // 10MB
  image: 5 * 1024 * 1024,   // 5MB
  document: 25 * 1024 * 1024, // 25MB
  video: 100 * 1024 * 1024,   // 100MB
} as const;

/**
 * Validate file upload
 */
export const validateFileUpload = (
  file: File,
  category: keyof typeof ALLOWED_FILE_TYPES
): { valid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ALLOWED_FILE_TYPES[category] as readonly string[];
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file size
  const maxSize = FILE_SIZE_LIMITS[category];
  if (file.size > maxSize) {
    const maxSizeMB = maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File too large. Maximum size is ${maxSizeMB}MB`,
    };
  }

  // Check for suspicious file names
  const dangerousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.sh$/i,
    /\.php$/i,
    /\.js$/i,
    /\.\./,
  ];

  if (dangerousPatterns.some((pattern) => pattern.test(file.name))) {
    return {
      valid: false,
      error: 'File name contains invalid characters or extension',
    };
  }

  return { valid: true };
};

/**
 * Validate multiple files
 */
export const validateMultipleFiles = (
  files: File[],
  category: keyof typeof ALLOWED_FILE_TYPES,
  maxFiles = 10
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (files.length > maxFiles) {
    errors.push(`Too many files. Maximum is ${maxFiles} files`);
  }

  files.forEach((file, index) => {
    const result = validateFileUpload(file, category);
    if (!result.valid) {
      errors.push(`File ${index + 1} (${file.name}): ${result.error}`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
};

// ===========================================
// Search & Filter Schemas
// ===========================================

/**
 * Pagination schema
 */
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

/**
 * Sort order schema
 */
export const sortOrderSchema = z.enum(['asc', 'desc']).default('desc');

/**
 * Job search filters schema
 */
export const jobSearchFiltersSchema = z.object({
  search: searchQuerySchema.optional(),
  location: safeStringSchema(200).optional(),
  jobType: z.array(z.enum(['full-time', 'part-time', 'contract', 'internship', 'temporary'])).optional(),
  remote: z.boolean().optional(),
  salaryMin: z.number().min(0).optional(),
  salaryMax: z.number().max(10000000).optional(),
  postedAfter: z.string().datetime().optional(),
  ...paginationSchema.shape,
});

// ===========================================
// Helper Functions
// ===========================================

/**
 * Safely parse and validate data
 * Returns the validated data or throws a formatted error
 */
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: Record<string, string[]> } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Format errors into a more usable structure
  const errors: Record<string, string[]> = {};
  result.error.errors.forEach((err) => {
    const path = err.path.join('.') || '_root';
    if (!errors[path]) {
      errors[path] = [];
    }
    errors[path].push(err.message);
  });

  return { success: false, errors };
}

/**
 * Validate and throw if invalid
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Create a validator function for a specific schema
 */
export function createValidator<T>(schema: z.ZodSchema<T>) {
  return (data: unknown) => validateData(schema, data);
}

// Export all schemas for use in forms
export const schemas = {
  email: emailSchema,
  password: passwordSchema,
  loginPassword: loginPasswordSchema,
  phone: phoneSchema,
  url: urlSchema,
  optionalUrl: optionalUrlSchema,
  uuid: uuidSchema,
  safeString: safeStringSchema,
  searchQuery: searchQuerySchema,
  name: nameSchema,
  userRole: userRoleSchema,
  userRegistration: userRegistrationSchema,
  userLogin: userLoginSchema,
  passwordResetRequest: passwordResetRequestSchema,
  passwordReset: passwordResetSchema,
  userProfile: userProfileSchema,
  salary: salarySchema,
  jobPosting: jobPostingSchema,
  jobApplication: jobApplicationSchema,
  challengeSubmission: challengeSubmissionSchema,
  pagination: paginationSchema,
  sortOrder: sortOrderSchema,
  jobSearchFilters: jobSearchFiltersSchema,
};

export type UserRegistrationInput = z.infer<typeof userRegistrationSchema>;
export type UserLoginInput = z.infer<typeof userLoginSchema>;
export type UserProfileInput = z.infer<typeof userProfileSchema>;
export type JobPostingInput = z.infer<typeof jobPostingSchema>;
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
export type ChallengeSubmissionInput = z.infer<typeof challengeSubmissionSchema>;
export type JobSearchFiltersInput = z.infer<typeof jobSearchFiltersSchema>;
