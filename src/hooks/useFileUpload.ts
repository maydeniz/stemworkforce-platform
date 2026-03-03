// ===========================================
// File Upload Hook with Validation
// ===========================================

import { useState, useCallback } from 'react';
import {
  validateFileUpload,
  validateMultipleFiles,
  ALLOWED_FILE_TYPES,
  FILE_SIZE_LIMITS,
} from '@/lib/validation';
import { logger } from '@/lib/logger';

type FileCategory = keyof typeof ALLOWED_FILE_TYPES;

interface UseFileUploadOptions {
  category: FileCategory;
  maxFiles?: number;
  onSuccess?: (files: File[]) => void;
  onError?: (errors: string[]) => void;
}

interface FileWithPreview extends File {
  preview?: string;
}

interface UseFileUploadReturn {
  files: FileWithPreview[];
  previews: string[];
  errors: string[];
  isValidating: boolean;
  addFiles: (newFiles: FileList | File[]) => void;
  removeFile: (index: number) => void;
  clearFiles: () => void;
  clearErrors: () => void;
  validateSingleFile: (file: File) => { valid: boolean; error?: string };
}

/**
 * Hook for handling file uploads with validation
 */
export function useFileUpload(options: UseFileUploadOptions): UseFileUploadReturn {
  const { category, maxFiles = 10, onSuccess, onError } = options;

  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState(false);

  /**
   * Create preview URL for file
   */
  const createPreview = useCallback((file: File): string | undefined => {
    if (file.type.startsWith('image/')) {
      return URL.createObjectURL(file);
    }
    return undefined;
  }, []);

  /**
   * Revoke preview URLs to free memory
   */
  const revokePreviews = useCallback((urls: string[]) => {
    urls.forEach((url) => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
  }, []);

  /**
   * Validate and add files
   */
  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      setIsValidating(true);
      setErrors([]);

      const fileArray = Array.from(newFiles);

      // Check total count
      const totalFiles = files.length + fileArray.length;
      if (totalFiles > maxFiles) {
        const newErrors = [`Maximum ${maxFiles} files allowed. You have ${files.length} files.`];
        setErrors(newErrors);
        onError?.(newErrors);
        setIsValidating(false);
        return;
      }

      // Validate all new files
      const validationResult = validateMultipleFiles(fileArray, category, maxFiles);

      if (!validationResult.valid) {
        setErrors(validationResult.errors);
        onError?.(validationResult.errors);
        logger.warn('File upload validation failed', { errors: validationResult.errors });
        setIsValidating(false);
        return;
      }

      // Create previews for valid files
      const newPreviews = fileArray.map(createPreview).filter(Boolean) as string[];

      // Add files
      setFiles((prev) => [...prev, ...fileArray]);
      setPreviews((prev) => [...prev, ...newPreviews]);

      logger.info('Files uploaded successfully', {
        count: fileArray.length,
        category,
      });

      onSuccess?.(fileArray);
      setIsValidating(false);
    },
    [files.length, maxFiles, category, createPreview, onSuccess, onError]
  );

  /**
   * Remove file at index
   */
  const removeFile = useCallback(
    (index: number) => {
      setFiles((prev) => {
        const newFiles = [...prev];
        newFiles.splice(index, 1);
        return newFiles;
      });

      setPreviews((prev) => {
        const newPreviews = [...prev];
        const removedPreview = newPreviews.splice(index, 1);
        revokePreviews(removedPreview);
        return newPreviews;
      });

      // Clear errors when removing files
      setErrors([]);
    },
    [revokePreviews]
  );

  /**
   * Clear all files
   */
  const clearFiles = useCallback(() => {
    revokePreviews(previews);
    setFiles([]);
    setPreviews([]);
    setErrors([]);
  }, [previews, revokePreviews]);

  /**
   * Clear errors only
   */
  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  /**
   * Validate a single file without adding it
   */
  const validateSingleFile = useCallback(
    (file: File) => {
      return validateFileUpload(file, category);
    },
    [category]
  );

  return {
    files,
    previews,
    errors,
    isValidating,
    addFiles,
    removeFile,
    clearFiles,
    clearErrors,
    validateSingleFile,
  };
}

/**
 * Get human-readable file type description
 */
export function getFileTypeDescription(category: FileCategory): string {
  const types = ALLOWED_FILE_TYPES[category];
  const extensions = types.map((type) => {
    const ext = type.split('/')[1];
    return ext.replace('vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx');
  });
  return extensions.join(', ').toUpperCase();
}

/**
 * Get max file size in human-readable format
 */
export function getMaxFileSize(category: FileCategory): string {
  const bytes = FILE_SIZE_LIMITS[category];
  return `${bytes / (1024 * 1024)}MB`;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default useFileUpload;
