// ===========================================
// Live Region Component for Dynamic Announcements
// ===========================================

import React, { useEffect, useState } from 'react';

interface LiveRegionProps {
  /**
   * Message to announce to screen readers
   */
  message: string;
  /**
   * Priority level for the announcement
   * - polite: waits for user to finish current task
   * - assertive: interrupts current task
   */
  priority?: 'polite' | 'assertive';
  /**
   * Whether to clear the message after announcing
   */
  clearAfter?: number;
  /**
   * Role for the live region
   */
  role?: 'status' | 'alert' | 'log';
}

/**
 * Announces dynamic content changes to screen readers
 */
export const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  priority = 'polite',
  clearAfter,
  role = 'status',
}) => {
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    if (message) {
      // Clear first to ensure re-announcement of same message
      setAnnouncement('');
      const timer = setTimeout(() => {
        setAnnouncement(message);
      }, 50);

      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    if (clearAfter && announcement) {
      const timer = setTimeout(() => {
        setAnnouncement('');
      }, clearAfter);

      return () => clearTimeout(timer);
    }
  }, [announcement, clearAfter]);

  return (
    <div
      role={role}
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  );
};

/**
 * Hook for programmatic announcements
 */
export function useAnnounce() {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'polite' | 'assertive'>('polite');

  const announce = (
    msg: string,
    level: 'polite' | 'assertive' = 'polite'
  ) => {
    setPriority(level);
    setMessage('');
    // Force re-render with new message
    setTimeout(() => setMessage(msg), 50);
  };

  const AnnouncerComponent = () => (
    <LiveRegion message={message} priority={priority} clearAfter={5000} />
  );

  return { announce, AnnouncerComponent };
}

export default LiveRegion;
