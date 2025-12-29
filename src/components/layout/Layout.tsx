// ===========================================
// Main Layout Component
// ===========================================

import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ToastContainer } from '@/contexts/NotificationContext';
import { ErrorBoundary } from '@/components/common';

interface LayoutProps {
  children?: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  showHeader = true,
  showFooter = true,
}) => {
  return (
    <div className="min-h-screen bg-dark-bg text-white flex flex-col">
      {showHeader && <Header />}
      
      <main
        id="main-content"
        className="flex-1 pt-16" // pt-16 accounts for fixed header
        role="main"
      >
        <ErrorBoundary>
          {children || <Outlet />}
        </ErrorBoundary>
      </main>

      {showFooter && <Footer />}
      
      {/* Global toast notifications */}
      <ToastContainer />
    </div>
  );
};

// Dashboard layout with sidebar
interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  sidebar,
}) => {
  return (
    <div className="min-h-screen bg-dark-bg">
      <Header />
      
      <div className="pt-16 flex">
        {/* Sidebar */}
        {sidebar && (
          <aside className="hidden lg:block w-64 min-h-[calc(100vh-4rem)] bg-dark-surface border-r border-dark-border">
            {sidebar}
          </aside>
        )}
        
        {/* Main content */}
        <main
          id="main-content"
          className="flex-1 p-6"
          role="main"
        >
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </main>
      </div>
      
      <ToastContainer />
    </div>
  );
};

// Minimal layout (no header/footer)
export const MinimalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <ErrorBoundary>
        {children}
      </ErrorBoundary>
      <ToastContainer />
    </div>
  );
};

export default Layout;
