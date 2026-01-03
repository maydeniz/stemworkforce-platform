// ===========================================
// Layout Component - LIGHT MODE VERSION
// Wrapper layout for light mode test pages
// ===========================================

import React from 'react';
import { Outlet } from 'react-router-dom';
import { HeaderLight } from './HeaderLight';
import { FooterLight } from './FooterLight';
import { ToastContainer } from '@/contexts/NotificationContext';
import { ErrorBoundary } from '@/components/common';

// Light mode color palette
const PALETTE = {
  background: '#ffffff',
  textPrimary: '#1e293b',
};

interface LayoutLightProps {
  children?: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const LayoutLight: React.FC<LayoutLightProps> = ({
  children,
  showHeader = true,
  showFooter = true,
}) => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: PALETTE.background, color: PALETTE.textPrimary }}
    >
      {showHeader && <HeaderLight />}

      <main
        id="main-content"
        className="flex-1 pt-16"
        role="main"
      >
        <ErrorBoundary>
          {children || <Outlet />}
        </ErrorBoundary>
      </main>

      {showFooter && <FooterLight />}

      <ToastContainer />
    </div>
  );
};

export default LayoutLight;
