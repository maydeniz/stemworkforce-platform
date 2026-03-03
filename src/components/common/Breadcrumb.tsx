import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/utils/helpers';

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbProps {
  /** Array of breadcrumb items */
  items?: BreadcrumbItem[];
  /** Whether to auto-generate breadcrumbs from current path */
  autoGenerate?: boolean;
  /** Whether to show home icon for first item */
  showHomeIcon?: boolean;
  /** Custom class name */
  className?: string;
  /** Maximum number of items to show (middle items will be collapsed) */
  maxItems?: number;
}

// Path segment to label mapping for auto-generation
const PATH_LABELS: Record<string, string> = {
  'students': 'For Students',
  'college': 'College Students',
  'high-school': 'High School Students',
  'jobs': 'Jobs',
  'events': 'Events',
  'training': 'Training',
  'resources': 'Resources',
  'challenges': 'Challenges',
  'partners': 'Partners',
  'education-partners': 'Education Partners',
  'industry-partners': 'Industry Partners',
  'nonprofit-partners': 'Nonprofit Partners',
  'national-labs': 'National Labs',
  'government': 'Government Partners',
  'workforce': 'Workforce Services',
  'services': 'Services',
  'admin': 'Admin',
  'dashboard': 'Dashboard',
  'settings': 'Settings',
  'resume-builder': 'Resume Builder',
  'interview-prep': 'Interview Prep',
  'career-launch': 'Career Launch',
  'internships': 'Internships',
  'scholarships': 'Scholarships',
  'essay-coach': 'Essay Coach',
  'college-matcher': 'College Matcher',
  'portfolio-builder': 'Portfolio Builder',
  'networking': 'Networking',
  'mentorship': 'Mentorship',
  'grad-school-prep': 'Graduate School Prep',
  'research-opportunities': 'Research Opportunities',
};

/**
 * Converts a path segment to a readable label
 */
function segmentToLabel(segment: string): string {
  if (PATH_LABELS[segment]) {
    return PATH_LABELS[segment];
  }
  // Convert kebab-case to Title Case
  return segment
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Auto-generates breadcrumb items from the current URL path
 */
function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const items: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

  let currentPath = '';
  segments.forEach((segment) => {
    // Skip ID-like segments (UUIDs, numbers)
    if (/^[0-9a-f-]{20,}$/i.test(segment) || /^\d+$/.test(segment)) {
      return;
    }

    currentPath += `/${segment}`;
    items.push({
      label: segmentToLabel(segment),
      path: currentPath,
    });
  });

  return items;
}

/**
 * Breadcrumb navigation component for wayfinding.
 * Helps users understand their location in the site hierarchy.
 *
 * @example
 * // Manual items
 * <Breadcrumb items={[
 *   { label: 'Home', path: '/' },
 *   { label: 'College Students', path: '/college' },
 *   { label: 'Resume Builder', path: '/college/resume-builder' },
 * ]} />
 *
 * @example
 * // Auto-generate from URL
 * <Breadcrumb autoGenerate />
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items: providedItems,
  autoGenerate = false,
  showHomeIcon = true,
  className,
  maxItems = 5,
}) => {
  const location = useLocation();

  const items = providedItems || (autoGenerate ? generateBreadcrumbs(location.pathname) : []);

  if (items.length === 0) {
    return null;
  }

  // Collapse middle items if too many
  let displayItems = items;
  let hasCollapsed = false;
  if (items.length > maxItems) {
    const first = items.slice(0, 1);
    const last = items.slice(-(maxItems - 2));
    displayItems = [...first, { label: '...', path: '' }, ...last];
    hasCollapsed = true;
  }

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center text-sm', className)}
    >
      <ol className="flex items-center gap-1.5">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          const isFirst = index === 0;
          const isCollapsed = item.label === '...' && hasCollapsed;

          return (
            <li key={item.path || index} className="flex items-center gap-1.5">
              {index > 0 && (
                <ChevronRight
                  size={14}
                  className="text-gray-600 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {isCollapsed ? (
                <span className="text-gray-500 px-1">...</span>
              ) : isLast ? (
                <span
                  className="text-gray-300 font-medium truncate max-w-[200px]"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    'text-gray-400 hover:text-white transition-colors truncate max-w-[150px]',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 rounded'
                  )}
                >
                  {isFirst && showHomeIcon ? (
                    <span className="flex items-center gap-1">
                      <Home size={14} aria-hidden="true" />
                      <span className="sr-only md:not-sr-only">{item.label}</span>
                    </span>
                  ) : (
                    item.label
                  )}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
