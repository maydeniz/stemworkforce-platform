# Parent Navigation Implementation Guide

Quick reference for implementing the two-row navigation layout.

---

## Quick Navigation Layout Reference

```
┌─────────────────────────────────────────────────────────────┐
│ PRIMARY ROW (Row 1) - 6 Items                               │
├─────────────────────────────────────────────────────────────┤
│ Overview │ Messages ● │ Calendar ● │ Progress │ Resources │ Settings │
├─────────────────────────────────────────────────────────────┤
│ SECONDARY ROW (Row 2) - 8 Items                             │
├─────────────────────────────────────────────────────────────┤
│ Learning & Development:          Administrative:             │
│ AI Insights  Live Feed           Academic Progress          │
│ Celebrations Portfolio           Health Records              │
│                                  Conferences ●  Payments ●  │
└─────────────────────────────────────────────────────────────┘
```

---

## Item Mapping & Details

### Row 1: Primary Navigation Items

| ID | Label | Path | Badge | Icon | Freq |
|----|-------|------|-------|------|------|
| `overview` | Overview | `/parent/dashboard` | None | Home icon | Daily |
| `messages` | Messages | `/parent/messages` | Unread count | Mail icon | Daily |
| `calendar` | Calendar | `/parent/calendar` | Upcoming count | Calendar icon | Weekly |
| `progress` | Progress | `/parent/progress` | None | Chart icon | Weekly |
| `resources` | Resources | `/parent/resources` | None | Book icon | Monthly |
| `settings` | Settings | `/parent/settings` | None | Gear icon | Monthly |

### Row 2: Secondary Navigation Items

#### Group A: Learning & Development
| ID | Label | Path | Badge | Icon | Use Case |
|----|-------|------|-------|------|----------|
| `ai-insights` | AI Insights | `/parent/insights` | None | Sparkle icon | Automated analysis |
| `live-feed` | Live Feed | `/parent/feed` | None | Activity icon | Real-time updates |
| `celebrations` | Celebrations | `/parent/celebrations` | None | Star icon | Achievements |
| `portfolio` | Portfolio | `/parent/portfolio` | None | Briefcase icon | Work samples |

#### Group B: Administrative
| ID | Label | Path | Badge | Icon | Use Case |
|----|-------|------|-------|------|----------|
| `academic-progress` | Academic Progress | `/parent/academic-progress` | None | Grade icon | Detailed grades |
| `health-records` | Health Records | `/parent/health` | None | Heart icon | Medical info |
| `conferences` | Conferences | `/parent/conferences` | Registration deadline | Event icon | School meetings |
| `payments` | Payments | `/parent/payments` | Outstanding balance | Money icon | Tuition/fees |

---

## Component Structure

### 1. NavBadge Component

```tsx
// src/components/parent/NavBadge.tsx
import React from 'react';
import { cn } from '@/utils/helpers';

interface NavBadgeProps {
  count?: number;
  variant?: 'primary' | 'secondary';
  hasNotification?: boolean;
  ariaLabel?: string;
}

export const NavBadge: React.FC<NavBadgeProps> = ({
  count,
  variant = 'secondary',
  hasNotification = false,
  ariaLabel,
}) => {
  if (variant === 'primary' && count !== undefined) {
    // Numeric badge for primary nav (Messages, Calendar)
    return (
      <span
        className={cn(
          'inline-flex items-center justify-center',
          'min-w-[20px] h-[20px] px-[6px]',
          'rounded-full bg-red-500 text-white',
          'text-xs font-bold'
        )}
        aria-label={ariaLabel || `${count} unread`}
      >
        {count > 99 ? '99+' : count}
      </span>
    );
  }

  // Dot indicator for secondary nav (Conferences, Payments)
  if (variant === 'secondary' && hasNotification) {
    return (
      <span
        className={cn(
          'inline-block',
          'w-2 h-2 rounded-full',
          'bg-orange-500 ml-1',
          'flex-shrink-0'
        )}
        role="status"
        aria-label={ariaLabel || 'New notification'}
      />
    );
  }

  return null;
};
```

### 2. NavItem Component

```tsx
// src/components/parent/NavItem.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/helpers';
import { NavBadge } from './NavBadge';

interface NavItemProps {
  id: string;
  label: string;
  path: string;
  badge?: {
    type: 'count' | 'dot';
    value?: number;
    hasNotification?: boolean;
  };
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  isActive?: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({
  id,
  label,
  path,
  badge,
  icon,
  variant = 'primary',
  isActive = false,
}) => {
  return (
    <Link
      to={path}
      className={cn(
        'nav-item',
        'inline-flex items-center justify-center gap-2',
        'transition-colors duration-200',
        variant === 'primary' && cn(
          'px-4 py-3',
          'text-base font-semibold',
          'text-gray-900',
          'border-r border-gray-200',
          'hover:bg-gray-100',
          isActive && 'bg-yellow-50 border-b-4 border-yellow-400'
        ),
        variant === 'secondary' && cn(
          'px-3 py-2',
          'text-sm font-medium',
          'text-gray-700',
          'hover:bg-gray-100',
          isActive && 'bg-gray-100'
        )
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{label}</span>
      {badge && (
        <NavBadge
          count={badge.type === 'count' ? badge.value : undefined}
          variant={variant === 'primary' ? 'primary' : 'secondary'}
          hasNotification={badge.hasNotification}
        />
      )}
    </Link>
  );
};
```

### 3. Parent Navigation Container

```tsx
// src/components/parent/ParentNavigation.tsx
import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/utils/helpers';
import { NavItem } from './NavItem';

interface ParentNavItem {
  id: string;
  label: string;
  path: string;
  icon?: React.ReactNode;
  badge?: {
    type: 'count' | 'dot';
    value?: number;
    hasNotification?: boolean;
  };
}

interface SecondaryNavGroup {
  groupId: string;
  groupLabel: string;
  items: ParentNavItem[];
}

interface ParentNavigationProps {
  primaryItems: ParentNavItem[];
  secondaryGroups: SecondaryNavGroup[];
  unreadMessagesCount?: number;
  upcomingEventsCount?: number;
}

export const ParentNavigation: React.FC<ParentNavigationProps> = ({
  primaryItems,
  secondaryGroups,
  unreadMessagesCount = 0,
  upcomingEventsCount = 0,
}) => {
  const location = useLocation();
  const [expandedSecondary, setExpandedSecondary] = useState(true);

  // Merge badge data with items
  const enrichedPrimaryItems = useMemo(() => {
    return primaryItems.map(item => {
      if (item.id === 'messages') {
        return {
          ...item,
          badge: { type: 'count' as const, value: unreadMessagesCount },
        };
      }
      if (item.id === 'calendar') {
        return {
          ...item,
          badge: { type: 'count' as const, value: upcomingEventsCount },
        };
      }
      return item;
    });
  }, [primaryItems, unreadMessagesCount, upcomingEventsCount]);

  const isCurrentPath = (path: string) => location.pathname === path;

  return (
    <nav
      className="parent-navigation bg-white border-b border-gray-200"
      role="navigation"
      aria-label="Parent dashboard navigation"
    >
      {/* Row 1: Primary Navigation */}
      <div className="primary-nav-row flex flex-wrap lg:flex-nowrap gap-0 bg-white">
        {enrichedPrimaryItems.map((item, idx) => (
          <div key={item.id} className="flex-1">
            <NavItem
              {...item}
              variant="primary"
              isActive={isCurrentPath(item.path)}
            />
          </div>
        ))}
      </div>

      {/* Row 2: Secondary Navigation */}
      <div
        className={cn(
          'secondary-nav-row',
          'bg-gray-50 border-t border-gray-200',
          'flex flex-wrap gap-0 px-4 py-2',
          'lg:flex-nowrap',
          'overflow-hidden',
          !expandedSecondary && 'lg:flex'
        )}
      >
        {secondaryGroups.map((group) => (
          <div key={group.groupId} className="flex gap-0">
            {group.items.map((item) => (
              <NavItem
                key={item.id}
                {...item}
                variant="secondary"
                isActive={isCurrentPath(item.path)}
              />
            ))}
          </div>
        ))}
      </div>
    </nav>
  );
};
```

---

## Usage Example

```tsx
// src/pages/ParentDashboard.tsx
import { ParentNavigation } from '@/components/parent/ParentNavigation';

const PRIMARY_NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    path: '/parent/dashboard',
    icon: '📊',
  },
  {
    id: 'messages',
    label: 'Messages',
    path: '/parent/messages',
  },
  {
    id: 'calendar',
    label: 'Calendar',
    path: '/parent/calendar',
  },
  {
    id: 'progress',
    label: 'Progress',
    path: '/parent/progress',
    icon: '📈',
  },
  {
    id: 'resources',
    label: 'Resources',
    path: '/parent/resources',
    icon: '📚',
  },
  {
    id: 'settings',
    label: 'Settings',
    path: '/parent/settings',
    icon: '⚙️',
  },
];

const SECONDARY_NAV_GROUPS = [
  {
    groupId: 'learning',
    groupLabel: 'Learning & Development',
    items: [
      {
        id: 'ai-insights',
        label: 'AI Insights',
        path: '/parent/insights',
        icon: '✨',
      },
      {
        id: 'live-feed',
        label: 'Live Feed',
        path: '/parent/feed',
        icon: '📡',
      },
      {
        id: 'celebrations',
        label: 'Celebrations',
        path: '/parent/celebrations',
        icon: '🎉',
      },
      {
        id: 'portfolio',
        label: 'Portfolio',
        path: '/parent/portfolio',
        icon: '💼',
      },
    ],
  },
  {
    groupId: 'admin',
    groupLabel: 'Administrative',
    items: [
      {
        id: 'academic-progress',
        label: 'Academic Progress',
        path: '/parent/academic-progress',
        icon: '📝',
      },
      {
        id: 'health-records',
        label: 'Health Records',
        path: '/parent/health',
        icon: '❤️',
      },
      {
        id: 'conferences',
        label: 'Conferences',
        path: '/parent/conferences',
        icon: '🎓',
        badge: { type: 'dot', hasNotification: true },
      },
      {
        id: 'payments',
        label: 'Payments',
        path: '/parent/payments',
        icon: '💳',
        badge: { type: 'dot', hasNotification: true },
      },
    ],
  },
];

export const ParentDashboard = () => {
  // Fetch real data
  const { unreadMessages, upcomingEvents } = useParentData();

  return (
    <>
      <ParentNavigation
        primaryItems={PRIMARY_NAV_ITEMS}
        secondaryGroups={SECONDARY_NAV_GROUPS}
        unreadMessagesCount={unreadMessages}
        upcomingEventsCount={upcomingEvents}
      />

      {/* Dashboard content */}
      <main className="pt-8">
        {/* Content here */}
      </main>
    </>
  );
};
```

---

## Tailwind CSS Styles

Add to your global styles or component CSS module:

```css
/* Parent Navigation Styles */
.parent-navigation {
  @apply bg-white border-b border-gray-200;
}

.primary-nav-row {
  @apply flex flex-wrap lg:flex-nowrap gap-0 bg-white;
}

.primary-nav-row .nav-item {
  @apply flex-1 flex items-center justify-center gap-2;
  @apply px-4 py-3 text-base font-semibold text-gray-900;
  @apply border-r border-gray-200;
  @apply hover:bg-gray-100 transition-colors duration-200;
}

.primary-nav-row .nav-item[aria-current="page"] {
  @apply bg-yellow-50 border-b-4 border-b-yellow-400;
}

.primary-nav-row .nav-item:last-child {
  @apply border-r-0;
}

.secondary-nav-row {
  @apply bg-gray-50 border-t border-gray-200;
  @apply flex flex-wrap gap-0 px-4 py-2;
  @apply lg:flex-nowrap;
}

.secondary-nav-row .nav-item {
  @apply flex items-center justify-center gap-1;
  @apply px-3 py-2 text-sm font-medium text-gray-700;
  @apply hover:bg-gray-100 transition-colors duration-200;
}

.secondary-nav-row .nav-item[aria-current="page"] {
  @apply bg-gray-100;
}

/* Badge Styles */
.nav-item span[role="status"],
.nav-item span[aria-label*="unread"],
.nav-item span[aria-label*="notification"] {
  @apply flex-shrink-0;
}

/* Mobile Responsive */
@media (max-width: 767px) {
  .primary-nav-row .nav-item {
    @apply flex-1 basis-1/3;
    @apply px-2 py-2 text-xs;
  }

  .secondary-nav-row {
    @apply hidden;
  }

  .secondary-nav-row.expanded {
    @apply block;
  }
}

@media (max-width: 1023px) {
  .secondary-nav-row {
    @apply overflow-x-auto pb-2;
  }

  .secondary-nav-row .nav-item {
    @apply flex-shrink-0 whitespace-nowrap;
  }
}
```

---

## Testing Checklist

### Keyboard Navigation Testing

```typescript
// test/parent-navigation.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ParentNavigation } from '@/components/parent/ParentNavigation';

describe('ParentNavigation', () => {
  it('should have logical tab order', async () => {
    const user = userEvent.setup();
    render(<ParentNavigation {...testProps} />);

    // First item should be focusable
    const overview = screen.getByText('Overview');
    await user.tab();
    expect(overview).toHaveFocus();

    // Tab through all primary items
    await user.tab(); // Messages
    await user.tab(); // Calendar
    await user.tab(); // Progress
    await user.tab(); // Resources
    await user.tab(); // Settings

    // Secondary items should follow
    const aiInsights = screen.getByText('AI Insights');
    expect(aiInsights).toBeVisible(); // Visible in tab order
  });

  it('should have visible focus indicators', async () => {
    const user = userEvent.setup();
    render(<ParentNavigation {...testProps} />);

    const overview = screen.getByText('Overview');
    await user.tab();

    expect(overview).toHaveFocus();
    expect(overview).toHaveClass('focus:outline-2');
  });

  it('should announce badges to screen readers', () => {
    render(<ParentNavigation {...testProps} unreadMessagesCount={3} />);

    const badge = screen.getByLabelText('3 unread');
    expect(badge).toBeInTheDocument();
  });
});
```

---

## Accessibility Audit Checklist

```
[ ] Keyboard Navigation
  [ ] Tab order flows logically (left-to-right, top-to-bottom)
  [ ] All nav items are keyboard accessible
  [ ] Focus indicator is visible (3:1 minimum contrast)
  [ ] No focus traps
  [ ] Enter/Space key works on all items

[ ] Screen Reader (Test with NVDA or JAWS)
  [ ] Nav labeled: aria-label="Parent dashboard navigation"
  [ ] All items announced with destination
  [ ] Badges announced: "Messages, 3 unread" (combined)
  [ ] Semantic HTML used (<nav>, <a>, not <div>)
  [ ] No redundant aria-labels

[ ] Touch & Mobile
  [ ] Touch targets: minimum 44x44px
  [ ] No hover-only interactions
  [ ] Mobile view works without horizontal scroll
  [ ] Expand/collapse functions without hover

[ ] Color & Contrast
  [ ] All text: 4.5:1 contrast (WCAG AA)
  [ ] Badge text: 7:1 contrast on background
  [ ] No information conveyed by color alone
  [ ] Active state visible (not just color)

[ ] Responsive Design
  [ ] At 200% zoom, layout doesn't break
  [ ] Text remains readable
  [ ] No overlapping elements
  [ ] Touch targets remain adequate

[ ] Animation & Motion
  [ ] No auto-playing animations
  [ ] Respects prefers-reduced-motion setting
  [ ] Transitions < 300ms
  [ ] No flashing content (>3 times/second)
```

---

## Data Connection Examples

### Real-time Badge Updates

```tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const useParentDashboardData = (parentId: string) => {
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState(0);

  useEffect(() => {
    // Fetch initial data
    Promise.all([
      supabase
        .from('messages')
        .select('count')
        .eq('recipient_id', parentId)
        .eq('read', false),
      supabase
        .from('calendar_events')
        .select('count')
        .eq('parent_id', parentId)
        .gte('date', new Date().toISOString()),
    ]).then(([messagesRes, eventsRes]) => {
      if (messagesRes.data?.length) setUnreadMessages(messagesRes.data[0].count);
      if (eventsRes.data?.length) setUpcomingEvents(eventsRes.data[0].count);
    });

    // Subscribe to real-time updates
    const messagesSubscription = supabase
      .channel(`messages:parent_${parentId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        (payload) => {
          // Update unread count
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesSubscription);
    };
  }, [parentId]);

  return { unreadMessages, upcomingEvents };
};
```

---

## Browser Support

- Chrome/Edge: 100+
- Firefox: 100+
- Safari: 15+
- Mobile Safari: 15+

All modern browsers with ES2020+ support.

---

## Performance Optimization

```tsx
// Use React.memo to prevent unnecessary re-renders
export const NavItem = React.memo(({ id, label, ...props }) => (
  // Component code
), (prevProps, nextProps) => {
  // Custom comparison for badge prop
  return (
    prevProps.id === nextProps.id &&
    prevProps.badge?.value === nextProps.badge?.value &&
    prevProps.isActive === nextProps.isActive
  );
});

// Use useMemo for computed values
const enrichedItems = useMemo(() => {
  return items.map(item => ({
    ...item,
    badge: computeBadge(item.id),
  }));
}, [items, computeBadge]);
```

---

## Troubleshooting

### Badge not showing count
- Check that `unreadMessagesCount` prop is being passed
- Verify badge data structure: `{ type: 'count', value: number }`
- Ensure NavBadge component receives correct variant prop

### Mobile items wrapping incorrectly
- Check Tailwind breakpoints (lg: 1024px)
- Verify flex properties on container
- Test at exact breakpoint: 768px, 1024px

### Focus indicator not visible
- Add `focus:outline-2 focus:outline-offset-2 focus:outline-blue-500`
- Ensure outline-offset is set
- Test with CSS focus-visible polyfill for older browsers

### Screen reader not announcing badges
- Verify `aria-label` on badge element
- Check that aria-label doesn't duplicate parent text
- Test with multiple screen readers (NVDA, JAWS, VoiceOver)

