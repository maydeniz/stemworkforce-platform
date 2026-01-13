// ===========================================
// useConsultationModal Hook
// ===========================================
// Manages consultation request modal state and auth flow
// Shows auth-required modal for unauthenticated users

import { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { IndustryType } from '@/types';

interface UseConsultationModalOptions {
  industry: IndustryType;
  serviceType: string;
  serviceName: string;
}

interface UseConsultationModalReturn {
  // Main consultation modal
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  // Auth required modal
  isAuthModalOpen: boolean;
  closeAuthModal: () => void;
  // Context data
  industry: IndustryType;
  serviceType: string;
  serviceName: string;
}

/**
 * Hook to manage the consultation request modal
 * Shows an informative auth modal for unauthenticated users
 * instead of silently redirecting them
 */
export function useConsultationModal(options: UseConsultationModalOptions): UseConsultationModalReturn {
  const { industry, serviceType, serviceName } = options;
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const openModal = useCallback(() => {
    if (!isAuthenticated) {
      // Show auth required modal instead of redirecting
      setIsAuthModalOpen(true);
      return;
    }
    setIsOpen(true);
  }, [isAuthenticated]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  return {
    isOpen,
    openModal,
    closeModal,
    isAuthModalOpen,
    closeAuthModal,
    industry,
    serviceType,
    serviceName,
  };
}

export default useConsultationModal;
