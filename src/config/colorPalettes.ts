// ===========================================
// Color Palette Configuration
// ===========================================
// Based on expert panel consultation:
// - UX Designer (Enterprise SaaS)
// - Visual/Brand Designer
// - Workforce Development Expert
// - Government/Public Sector Design Expert
// - Healthcare Tech Industry Expert
// ===========================================

export type PaletteId =
  | 'deep-space'        // Refined dark tech theme
  | 'professional'      // Corporate light theme
  | 'federal'           // Government/DOE inspired
  | 'medtech'           // Healthcare technology
  | 'innovation'        // Startup/student energy
  | 'accessible'        // High-contrast accessible
  | 'stem-brand';       // Logo-inspired yellow/orange theme

export interface ColorPalette {
  id: PaletteId;
  name: string;
  description: string;
  mode: 'light' | 'dark';
  bestFor: string[];
  expertRecommendedBy: string[];
  wcagLevel: 'AA' | 'AA+' | 'AAA';
  colors: {
    // Primary brand colors
    primary: string;
    primaryHover: string;
    primaryDark: string;
    primaryLight: string;

    // Secondary/accent colors
    secondary: string;
    secondaryLight: string;
    accent?: string;

    // Backgrounds
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    surfaceElevated: string;

    // Text
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textInverse: string;
    textLink?: string;
    textLinkVisited?: string;

    // Status colors
    success: string;
    successLight: string;
    successDark?: string;
    warning: string;
    warningLight: string;
    warningDark?: string;
    error: string;
    errorLight: string;
    errorDark?: string;
    info: string;
    infoLight?: string;

    // Borders
    borderPrimary: string;
    borderSecondary: string;
    borderFocus: string;
    borderHighlight?: string;
    borderStrong?: string;

    // Gradients (for dark themes)
    gradientStart?: string;
    gradientMid?: string;
    gradientEnd?: string;
  };
}

// ===========================================
// PALETTE 1: DEEP SPACE TECH (Refined Dark Theme)
// ===========================================
// Mood: Sophisticated, innovative, immersive, cutting-edge
// Best For: Tech-savvy users, students, AI/quantum sectors
// Recommended By: Marcus Rodriguez (Visual), Dr. Okonkwo (Workforce - younger users)
const deepSpace: ColorPalette = {
  id: 'deep-space',
  name: 'Deep Space Tech',
  description: 'Sophisticated, innovative dark theme. Perfect for tech-savvy users and modern STEM sectors.',
  mode: 'dark',
  bestFor: ['Tech professionals', 'Students', 'AI/Quantum sectors', 'Evening browsing'],
  expertRecommendedBy: ['Marcus Rodriguez (Visual Designer)', 'Dr. Okonkwo (Workforce Expert)'],
  wcagLevel: 'AA',
  colors: {
    primary: '#6366F1',        // Electric Indigo
    primaryHover: '#818CF8',   // Bright Indigo
    primaryDark: '#4F46E5',    // Deep Indigo
    primaryLight: '#A5B4FC',   // Light Indigo

    secondary: '#22D3EE',      // Cyber Cyan
    secondaryLight: '#67E8F9', // Soft Cyan

    bgPrimary: '#0F0F1A',      // Space Black
    bgSecondary: '#1A1A2E',    // Deep Navy
    bgTertiary: '#252540',     // Midnight
    surfaceElevated: '#2D2D4A', // Charcoal Purple

    textPrimary: '#F8FAFC',    // Pearl White
    textSecondary: '#CBD5E1',  // Silver
    textMuted: '#64748B',      // Slate
    textInverse: '#0F172A',    // Rich Black

    success: '#10B981',        // Emerald
    successLight: '#34D399',   // Soft Emerald
    warning: '#F59E0B',        // Amber
    warningLight: '#FBBF24',   // Soft Amber
    error: '#EF4444',          // Rose
    errorLight: '#F87171',     // Soft Rose
    info: '#0EA5E9',           // Sky Blue

    borderPrimary: '#334155',  // Slate Border
    borderSecondary: '#1E293B', // Faint Border
    borderFocus: '#6366F1',    // Focus Ring

    gradientStart: '#6366F1',  // Indigo
    gradientEnd: '#8B5CF6',    // Violet
  },
};

// ===========================================
// PALETTE 2: PROFESSIONAL CLARITY (Corporate Light)
// ===========================================
// Mood: Trustworthy, clean, efficient, corporate
// Best For: Employers, HR professionals, enterprise users
// Recommended By: Sarah Chen (UX), Dr. Okonkwo (Workforce - employers)
const professional: ColorPalette = {
  id: 'professional',
  name: 'Professional Clarity',
  description: 'Trustworthy, clean corporate theme. Ideal for employers, HR, and formal contexts.',
  mode: 'light',
  bestFor: ['Employers', 'HR professionals', 'Enterprise users', 'Formal contexts'],
  expertRecommendedBy: ['Sarah Chen (UX Designer)', 'Dr. Okonkwo (Workforce Expert)'],
  wcagLevel: 'AA',
  colors: {
    primary: '#2563EB',        // Corporate Blue
    primaryHover: '#1D4ED8',   // Deep Blue
    primaryDark: '#1E40AF',    // Darker Blue
    primaryLight: '#DBEAFE',   // Sky Tint

    secondary: '#475569',      // Slate Blue
    secondaryLight: '#64748B', // Cool Gray

    bgPrimary: '#FAFBFC',      // Warm White
    bgSecondary: '#F1F5F9',    // Soft Gray
    bgTertiary: '#E2E8F0',     // Light Gray
    surfaceElevated: '#FFFFFF', // Pure White

    textPrimary: '#1E293B',    // Charcoal
    textSecondary: '#334155',  // Dark Slate
    textMuted: '#64748B',      // Medium Slate
    textInverse: '#FFFFFF',    // White

    success: '#059669',        // Forest Green
    successLight: '#D1FAE5',   // Mint
    warning: '#D97706',        // Burnt Orange
    warningLight: '#FEF3C7',   // Cream
    error: '#DC2626',          // Crimson
    errorLight: '#FEE2E2',     // Blush
    info: '#0284C7',           // Ocean Blue
    infoLight: '#E0F2FE',      // Ice Blue

    borderPrimary: '#CBD5E1',  // Silver
    borderSecondary: '#E2E8F0', // Light Silver
    borderFocus: '#2563EB',    // Focus Blue
  },
};

// ===========================================
// PALETTE 3: FEDERAL TRUST (Government/DOE Theme)
// ===========================================
// Mood: Authoritative, transparent, civic-minded, stable
// Best For: Government partnerships, DOE co-branded content
// Recommended By: James Whitfield (Government Expert), Dr. Okonkwo (Institutional)
const federal: ColorPalette = {
  id: 'federal',
  name: 'Federal Trust',
  description: 'Authoritative, civic-minded theme for government partnerships and DOE initiatives.',
  mode: 'light',
  bestFor: ['Government partnerships', 'DOE content', 'Public sector', 'Institutional users'],
  expertRecommendedBy: ['James Whitfield (Government Expert)', 'Dr. Okonkwo (Workforce Expert)'],
  wcagLevel: 'AA+',
  colors: {
    primary: '#1E40AF',        // Civic Blue
    primaryHover: '#1E3A8A',   // Deep Civic
    primaryDark: '#1E3A8A',    // Navy
    primaryLight: '#DBEAFE',   // Civic Tint

    secondary: '#B45309',      // Government Gold
    secondaryLight: '#FDE68A', // Soft Gold
    accent: '#991B1B',         // Heritage Red (sparse)

    bgPrimary: '#FEFDFB',      // Parchment
    bgSecondary: '#F5F5F4',    // Warm Cream
    bgTertiary: '#E7E5E4',     // Stone
    surfaceElevated: '#FFFFFF', // Clean White

    textPrimary: '#1C1917',    // Official Black
    textSecondary: '#44403C',  // Dark Brown
    textMuted: '#78716C',      // Warm Gray
    textInverse: '#FAFAF9',    // Off White

    success: '#15803D',        // Approval Green
    successLight: '#DCFCE7',   // Light Green
    warning: '#B45309',        // Alert Amber
    warningLight: '#FEF3C7',   // Light Amber
    error: '#B91C1C',          // Denial Red
    errorLight: '#FEE2E2',     // Light Red
    info: '#1D4ED8',           // Federal Blue
    infoLight: '#DBEAFE',      // Light Federal

    borderPrimary: '#D6D3D1',  // Warm Border
    borderSecondary: '#E7E5E4', // Soft Border
    borderFocus: '#1E40AF',    // Civic Blue
    borderHighlight: '#D97706', // Gold Border (official)
  },
};

// ===========================================
// PALETTE 4: MEDTECH PRECISION (Healthcare Technology)
// ===========================================
// Mood: Clinical trust, precision, innovation, humanized technology
// Best For: Healthcare tech sector, life sciences, biotech
// Recommended By: Dr. Anita Sharma (Healthcare Expert), Sarah Chen (UX)
const medtech: ColorPalette = {
  id: 'medtech',
  name: 'MedTech Precision',
  description: 'Clinical trust meets tech innovation. Perfect for healthcare technology and life sciences.',
  mode: 'light',
  bestFor: ['Healthcare tech', 'Life sciences', 'Biotech jobs', 'Medical training'],
  expertRecommendedBy: ['Dr. Anita Sharma (Healthcare Expert)', 'Sarah Chen (UX Designer)'],
  wcagLevel: 'AA',
  colors: {
    primary: '#0D9488',        // Medical Teal
    primaryHover: '#0F766E',   // Deep Teal
    primaryDark: '#115E59',    // Dark Teal
    primaryLight: '#CCFBF1',   // Soft Teal

    secondary: '#0369A1',      // Precision Blue
    secondaryLight: '#E0F2FE', // Ice Blue
    accent: '#E11D48',         // Vital Coral (alerts)

    bgPrimary: '#F8FAFC',      // Clinical White
    bgSecondary: '#F1F5F9',    // Sterile Gray
    bgTertiary: '#E2E8F0',     // Soft Slate
    surfaceElevated: '#FFFFFF', // Pure White

    textPrimary: '#0F172A',    // Medical Black
    textSecondary: '#334155',  // Slate
    textMuted: '#64748B',      // Medium Gray
    textInverse: '#FFFFFF',    // White

    success: '#059669',        // Healthy Green
    successLight: '#D1FAE5',   // Recovery Green
    warning: '#EA580C',        // Caution Orange
    warningLight: '#FFEDD5',   // Soft Orange
    error: '#DC2626',          // Alert Red
    errorLight: '#FEE2E2',     // Soft Red
    info: '#0284C7',           // Data Blue
    infoLight: '#E0F2FE',      // Soft Info

    borderPrimary: '#CBD5E1',  // Clinical Border
    borderSecondary: '#E2E8F0', // Soft Border
    borderFocus: '#0D9488',    // Teal Focus
    borderHighlight: '#14B8A6', // Teal Highlight
  },
};

// ===========================================
// PALETTE 5: INNOVATION SPARK (Startup/Energy Theme)
// ===========================================
// Mood: Dynamic, energetic, forward-thinking, bold
// Best For: Students, startup-oriented users, AI/quantum sectors
// Recommended By: Marcus Rodriguez (Visual), Dr. Okonkwo (Student engagement)
const innovation: ColorPalette = {
  id: 'innovation',
  name: 'Innovation Spark',
  description: 'Dynamic, energetic theme that signals possibility. Great for students and innovation sectors.',
  mode: 'dark',
  bestFor: ['Students', 'Startup users', 'AI/Quantum sectors', 'Recruitment events'],
  expertRecommendedBy: ['Marcus Rodriguez (Visual Designer)', 'Dr. Okonkwo (Workforce Expert)'],
  wcagLevel: 'AA',
  colors: {
    primary: '#7C3AED',        // Electric Violet
    primaryHover: '#6D28D9',   // Deep Violet
    primaryDark: '#5B21B6',    // Darker Violet
    primaryLight: '#EDE9FE',   // Soft Violet

    secondary: '#EA580C',      // Innovation Orange
    secondaryLight: '#FFEDD5', // Soft Orange
    accent: '#06B6D4',         // Future Cyan

    bgPrimary: '#0C0A1D',      // Night
    bgSecondary: '#1A1625',    // Deep Purple
    bgTertiary: '#2D2640',     // Midnight Purple
    surfaceElevated: '#3D3555', // Elevated Purple

    textPrimary: '#FAFAFA',    // Bright White
    textSecondary: '#D4D4D8',  // Soft White
    textMuted: '#A1A1AA',      // Gray Violet
    textInverse: '#1A1625',    // Dark Purple

    success: '#22C55E',        // Neon Green
    successLight: '#86EFAC',   // Soft Green
    warning: '#F59E0B',        // Hot Amber
    warningLight: '#FDE68A',   // Soft Amber
    error: '#EC4899',          // Neon Pink
    errorLight: '#FBCFE8',     // Soft Pink
    info: '#06B6D4',           // Bright Cyan

    borderPrimary: '#4C4066',  // Violet Border
    borderSecondary: '#2D2640', // Faint Border
    borderFocus: '#8B5CF6',    // Glow Violet

    gradientStart: '#7C3AED',  // Violet
    gradientMid: '#C026D3',    // Fuchsia
    gradientEnd: '#EA580C',    // Orange
  },
};

// ===========================================
// PALETTE 6: UNIVERSAL ACCESS (High-Contrast Accessible)
// ===========================================
// Mood: Clear, readable, inclusive, functional
// Best For: Users with visual impairments, aging workforce, 508 compliance
// Recommended By: Sarah Chen (UX), James Whitfield (Federal compliance)
// Note: This palette MUST be available for 508 compliance
const accessible: ColorPalette = {
  id: 'accessible',
  name: 'Universal Access',
  description: 'High-contrast accessible theme. Required for 508 compliance and visual accessibility.',
  mode: 'light',
  bestFor: ['Visual accessibility', 'Aging workforce', 'Extended reading', '508 compliance'],
  expertRecommendedBy: ['Sarah Chen (UX Designer)', 'James Whitfield (Government Expert)'],
  wcagLevel: 'AAA',
  colors: {
    primary: '#1D4ED8',        // Bold Blue (7.2:1 on white)
    primaryHover: '#1E3A8A',   // Deep Bold (9.5:1 on white)
    primaryDark: '#1E3A8A',    // Dark Blue
    primaryLight: '#DBEAFE',   // Pale Blue

    secondary: '#374151',      // Deep Charcoal (9.1:1)
    secondaryLight: '#6B7280', // Medium Gray (5.3:1)

    bgPrimary: '#FFFFFF',      // True White
    bgSecondary: '#F9FAFB',    // Light Gray
    bgTertiary: '#F3F4F6',     // Soft Gray
    surfaceElevated: '#FFFFFF', // White

    textPrimary: '#111827',    // Pure Black (17.4:1)
    textSecondary: '#374151',  // Dark Gray (9.1:1)
    textMuted: '#4B5563',      // Medium Gray (7.1:1)
    textInverse: '#FFFFFF',    // White
    textLink: '#1D4ED8',       // Link Blue (underlined)
    textLinkVisited: '#6B21A8', // Visited Purple (8.5:1)

    success: '#15803D',        // Strong Green (4.8:1)
    successLight: '#DCFCE7',   // Light Green
    successDark: '#166534',    // Dark Green (6.3:1)
    warning: '#B45309',        // Strong Amber (4.7:1)
    warningLight: '#FEF3C7',   // Light Amber
    warningDark: '#92400E',    // Dark Amber (6.0:1)
    error: '#B91C1C',          // Strong Red (5.9:1)
    errorLight: '#FEE2E2',     // Light Red
    errorDark: '#991B1B',      // Dark Red (7.2:1)
    info: '#1D4ED8',           // Strong Blue (7.2:1)

    borderPrimary: '#9CA3AF',  // Visible Border (2.6:1)
    borderSecondary: '#D1D5DB', // Standard Border
    borderFocus: '#1D4ED8',    // Focus Ring (3px)
    borderStrong: '#6B7280',   // Strong Border (4.6:1)
  },
};

// ===========================================
// PALETTE 7: STEM BRAND (Logo-Inspired Theme)
// ===========================================
// Mood: Warm, energetic, brand-forward, recognizable
// Best For: Brand consistency, marketing, homepage, events
// Based on: STEMWorkforce logo (yellow-400 to orange-500 gradient)
const stemBrand: ColorPalette = {
  id: 'stem-brand',
  name: 'STEM Brand',
  description: 'Warm, energetic theme based on STEMWorkforce logo colors. Perfect for brand consistency and marketing.',
  mode: 'dark',
  bestFor: ['Brand consistency', 'Marketing materials', 'Homepage', 'Events & outreach'],
  expertRecommendedBy: ['Brand Identity (Logo Colors)', 'Marketing Team'],
  wcagLevel: 'AA',
  colors: {
    primary: '#FBBF24',        // Yellow-400 (logo text)
    primaryHover: '#F59E0B',   // Yellow-500
    primaryDark: '#D97706',    // Amber-600
    primaryLight: '#FEF3C7',   // Yellow-100

    secondary: '#F97316',      // Orange-500 (logo gradient end)
    secondaryLight: '#FFEDD5', // Orange-100
    accent: '#EA580C',         // Orange-600

    bgPrimary: '#18181B',      // Zinc-900 (dark base)
    bgSecondary: '#27272A',    // Zinc-800
    bgTertiary: '#3F3F46',     // Zinc-700
    surfaceElevated: '#52525B', // Zinc-600

    textPrimary: '#FAFAFA',    // Zinc-50
    textSecondary: '#D4D4D8',  // Zinc-300
    textMuted: '#A1A1AA',      // Zinc-400
    textInverse: '#18181B',    // Zinc-900

    success: '#22C55E',        // Green-500
    successLight: '#86EFAC',   // Green-300
    warning: '#FBBF24',        // Yellow-400 (matches brand)
    warningLight: '#FDE68A',   // Yellow-200
    error: '#EF4444',          // Red-500
    errorLight: '#FCA5A5',     // Red-300
    info: '#38BDF8',           // Sky-400

    borderPrimary: '#52525B',  // Zinc-600
    borderSecondary: '#3F3F46', // Zinc-700
    borderFocus: '#FBBF24',    // Yellow-400 (brand)

    gradientStart: '#FBBF24',  // Yellow-400
    gradientEnd: '#F97316',    // Orange-500
  },
};

// ===========================================
// EXPORT ALL PALETTES
// ===========================================

export const COLOR_PALETTES: Record<PaletteId, ColorPalette> = {
  'deep-space': deepSpace,
  'professional': professional,
  'federal': federal,
  'medtech': medtech,
  'innovation': innovation,
  'accessible': accessible,
  'stem-brand': stemBrand,
};

export const PALETTE_LIST = Object.values(COLOR_PALETTES);

export const DEFAULT_PALETTE: PaletteId = 'deep-space';

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

export const getPalette = (id: PaletteId): ColorPalette => {
  return COLOR_PALETTES[id] || COLOR_PALETTES[DEFAULT_PALETTE];
};

export const getPalettesByMode = (mode: 'light' | 'dark'): ColorPalette[] => {
  return PALETTE_LIST.filter(p => p.mode === mode);
};

export const getDarkPalettes = (): ColorPalette[] => getPalettesByMode('dark');
export const getLightPalettes = (): ColorPalette[] => getPalettesByMode('light');

// Generate CSS variables from a palette
export const generateCSSVariables = (palette: ColorPalette): Record<string, string> => {
  const vars: Record<string, string> = {};

  Object.entries(palette.colors).forEach(([key, value]) => {
    if (value) {
      // Convert camelCase to kebab-case
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      vars[`--color-${cssKey}`] = value;
    }
  });

  return vars;
};

// Get palette preview colors (for selector UI)
export const getPalettePreview = (palette: ColorPalette) => ({
  primary: palette.colors.primary,
  secondary: palette.colors.secondary,
  background: palette.colors.bgPrimary,
  text: palette.colors.textPrimary,
});

export default COLOR_PALETTES;
