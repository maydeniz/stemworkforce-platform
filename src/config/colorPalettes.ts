// ===========================================
// Color Palette Configuration
// ===========================================
// Based on research from design experts and industry best practices
// Sources: Stripe, LinkedIn, Glassdoor, USWDS, EdTech Research
// ===========================================

export type PaletteId =
  | 'professional-tech'    // Stripe/Vercel inspired
  | 'linkedin-blue'        // LinkedIn professional networking
  | 'glassdoor-green'      // Job platform focused
  | 'government-trust'     // USWDS institutional
  | 'edtech-learning'      // Education/training focused
  | 'stemworkforce-dark';  // Current dark mode (default)

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface ColorPalette {
  id: PaletteId;
  name: string;
  description: string;
  mode: 'light' | 'dark';
  bestFor: string[];
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    error: ColorScale;
    neutral: ColorScale & { white?: string; black?: string };
  };
  // Semantic tokens for easy access
  semantic: {
    // Backgrounds
    bgPrimary: string;
    bgSecondary: string;
    bgTertiary: string;
    bgAccent: string;
    bgHover: string;

    // Text
    textPrimary: string;
    textSecondary: string;
    textMuted: string;
    textInverse: string;

    // Borders
    borderPrimary: string;
    borderSecondary: string;
    borderFocus: string;

    // Interactive
    buttonPrimary: string;
    buttonPrimaryHover: string;
    buttonSecondary: string;
    buttonAccent: string;
    buttonAccentHover: string;

    // Status
    statusSuccess: string;
    statusSuccessBg: string;
    statusWarning: string;
    statusWarningBg: string;
    statusError: string;
    statusErrorBg: string;
    statusInfo: string;
    statusInfoBg: string;
  };
}

// ===========================================
// PALETTE 1: PROFESSIONAL TECH STANDARD
// ===========================================
// Inspired by Stripe/Vercel - Enterprise SaaS
const professionalTech: ColorPalette = {
  id: 'professional-tech',
  name: 'Professional Tech',
  description: 'Enterprise-grade palette inspired by Stripe & Vercel. Maximum trust and modern aesthetics.',
  mode: 'light',
  bestFor: ['Financial services', 'HR platforms', 'Enterprise software', 'Professional services'],
  colors: {
    primary: {
      50: '#f0f4ff',
      100: '#dfe6ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#635bff',  // Stripe purple-blue
      600: '#5046e5',
      700: '#4338ca',
      800: '#0a2540',  // Deep navy (primary brand)
      900: '#061827',
    },
    secondary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    accent: {
      50: '#fef7ec',
      100: '#fdefd6',
      200: '#fbdfad',
      300: '#f8c97a',
      400: '#f5a623',  // Gold accent
      500: '#e08f0a',
      600: '#c47a07',
      700: '#9c5e08',
      800: '#7d4a0e',
      900: '#653d0f',
    },
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#2c8f3d',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f5a623',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#d32f2f',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    neutral: {
      white: '#ffffff',
      50: '#f6f9fc',   // Stripe off-white
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      black: '#000000',
    },
  },
  semantic: {
    bgPrimary: '#ffffff',
    bgSecondary: '#f6f9fc',
    bgTertiary: '#f1f5f9',
    bgAccent: '#f0f4ff',
    bgHover: '#e2e8f0',

    textPrimary: '#0a2540',
    textSecondary: '#475569',
    textMuted: '#64748b',
    textInverse: '#ffffff',

    borderPrimary: '#e2e8f0',
    borderSecondary: '#cbd5e1',
    borderFocus: '#635bff',

    buttonPrimary: '#0a2540',
    buttonPrimaryHover: '#061827',
    buttonSecondary: '#f1f5f9',
    buttonAccent: '#635bff',
    buttonAccentHover: '#5046e5',

    statusSuccess: '#2c8f3d',
    statusSuccessBg: '#ecfdf5',
    statusWarning: '#d97706',
    statusWarningBg: '#fffbeb',
    statusError: '#d32f2f',
    statusErrorBg: '#fef2f2',
    statusInfo: '#635bff',
    statusInfoBg: '#f0f4ff',
  },
};

// ===========================================
// PALETTE 2: LINKEDIN PROFESSIONAL
// ===========================================
// Inspired by LinkedIn - Professional networking
const linkedinBlue: ColorPalette = {
  id: 'linkedin-blue',
  name: 'LinkedIn Professional',
  description: 'Professional networking palette. Proven trust and career-focused engagement.',
  mode: 'light',
  bestFor: ['Job boards', 'Professional networks', 'Career platforms', 'Talent marketplaces'],
  colors: {
    primary: {
      50: '#e8f4fc',
      100: '#c5e4f6',
      200: '#9ed3f0',
      300: '#70c1ea',
      400: '#4cb0e0',
      500: '#0a66c2',  // LinkedIn blue
      600: '#004182',  // Darker variant
      700: '#003366',
      800: '#002d5a',
      900: '#00264d',
    },
    secondary: {
      50: '#f0f9eb',
      100: '#d9f0c8',
      200: '#bfe4a4',
      300: '#a4d87f',
      400: '#8bc762',
      500: '#83941f',  // LinkedIn green
      600: '#44712e',
      700: '#3a5f27',
      800: '#304d20',
      900: '#273f1a',
    },
    accent: {
      50: '#fdf6e3',
      100: '#fae9b8',
      200: '#f7db8a',
      300: '#f4cd5c',
      400: '#e7a33e',  // LinkedIn gold
      500: '#d4940f',
      600: '#b07b0d',
      700: '#8c620a',
      800: '#684908',
      900: '#443006',
    },
    success: {
      50: '#f0f9eb',
      100: '#d9f0c8',
      200: '#bfe4a4',
      300: '#a4d87f',
      400: '#8bc762',
      500: '#44712e',
      600: '#3a5f27',
      700: '#304d20',
      800: '#273f1a',
      900: '#1e3113',
    },
    warning: {
      50: '#fff8e1',
      100: '#ffecb3',
      200: '#ffe082',
      300: '#ffd54f',
      400: '#ffca28',
      500: '#ffc107',
      600: '#ffb300',
      700: '#ffa000',
      800: '#ff8f00',
      900: '#ff6f00',
    },
    error: {
      50: '#fef0ed',
      100: '#fdd9d2',
      200: '#fbb8ab',
      300: '#f9978a',
      400: '#f5987e',  // LinkedIn error
      500: '#e57373',
      600: '#d32f2f',
      700: '#c62828',
      800: '#b71c1c',
      900: '#8e1a1a',
    },
    neutral: {
      white: '#ffffff',
      50: '#f3f6f8',
      100: '#eef3f7',
      200: '#dce6f1',
      300: '#c1d0e0',
      400: '#8fa8c2',
      500: '#56687a',
      600: '#434a51',
      700: '#38434f',
      800: '#283e4a',
      900: '#1d2226',
      black: '#000000',
    },
  },
  semantic: {
    bgPrimary: '#ffffff',
    bgSecondary: '#f3f6f8',
    bgTertiary: '#eef3f7',
    bgAccent: '#e8f4fc',
    bgHover: '#dce6f1',

    textPrimary: '#1d2226',
    textSecondary: '#56687a',
    textMuted: '#8fa8c2',
    textInverse: '#ffffff',

    borderPrimary: '#dce6f1',
    borderSecondary: '#c1d0e0',
    borderFocus: '#0a66c2',

    buttonPrimary: '#0a66c2',
    buttonPrimaryHover: '#004182',
    buttonSecondary: '#eef3f7',
    buttonAccent: '#e7a33e',
    buttonAccentHover: '#d4940f',

    statusSuccess: '#44712e',
    statusSuccessBg: '#f0f9eb',
    statusWarning: '#ffa000',
    statusWarningBg: '#fff8e1',
    statusError: '#d32f2f',
    statusErrorBg: '#fef0ed',
    statusInfo: '#0a66c2',
    statusInfoBg: '#e8f4fc',
  },
};

// ===========================================
// PALETTE 3: GLASSDOOR GREEN
// ===========================================
// Inspired by Glassdoor - Job platform focused
const glassdoorGreen: ColorPalette = {
  id: 'glassdoor-green',
  name: 'Glassdoor Fresh',
  description: 'Growth-focused palette for job platforms. Signals opportunity and career advancement.',
  mode: 'light',
  bestFor: ['Job search', 'Salary research', 'Company reviews', 'Career change platforms'],
  colors: {
    primary: {
      50: '#e6f7ed',
      100: '#b3e6c9',
      200: '#80d5a5',
      300: '#4dc482',
      400: '#26b86a',
      500: '#0caa41',  // Glassdoor green
      600: '#0a9239',
      700: '#087a30',
      800: '#066228',
      900: '#044a1f',
    },
    secondary: {
      50: '#f5f5f6',
      100: '#e5e5e7',
      200: '#ccccce',
      300: '#a3a3a6',
      400: '#71717a',
      500: '#52525b',
      600: '#3f3f46',
      700: '#313335',  // Glassdoor dark
      800: '#27272a',
      900: '#18181b',
    },
    accent: {
      50: '#fff4eb',
      100: '#ffe4cc',
      200: '#ffd4ad',
      300: '#ffc48e',
      400: '#ff9e47',
      500: '#ff6200',  // Glassdoor orange
      600: '#e65800',
      700: '#cc4e00',
      800: '#993b00',
      900: '#662700',
    },
    success: {
      50: '#e6f7ed',
      100: '#b3e6c9',
      200: '#80d5a5',
      300: '#4dc482',
      400: '#26b86a',
      500: '#0caa41',
      600: '#0a9239',
      700: '#087a30',
      800: '#066228',
      900: '#044a1f',
    },
    warning: {
      50: '#fff7e6',
      100: '#ffecb3',
      200: '#ffe180',
      300: '#ffd54d',
      400: '#ffca1a',
      500: '#e6b300',
      600: '#cc9f00',
      700: '#b38b00',
      800: '#997700',
      900: '#806300',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#d32f2f',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    neutral: {
      white: '#ffffff',
      50: '#f5f5f5',
      100: '#eeeeee',
      200: '#e0e0e0',
      300: '#bdbdbd',
      400: '#9e9e9e',
      500: '#757575',
      600: '#616161',
      700: '#424242',
      800: '#313335',
      900: '#212121',
      black: '#000000',
    },
  },
  semantic: {
    bgPrimary: '#ffffff',
    bgSecondary: '#f5f5f5',
    bgTertiary: '#eeeeee',
    bgAccent: '#e6f7ed',
    bgHover: '#e0e0e0',

    textPrimary: '#212121',
    textSecondary: '#616161',
    textMuted: '#9e9e9e',
    textInverse: '#ffffff',

    borderPrimary: '#e0e0e0',
    borderSecondary: '#bdbdbd',
    borderFocus: '#0caa41',

    buttonPrimary: '#0caa41',
    buttonPrimaryHover: '#0a9239',
    buttonSecondary: '#eeeeee',
    buttonAccent: '#ff6200',
    buttonAccentHover: '#e65800',

    statusSuccess: '#0caa41',
    statusSuccessBg: '#e6f7ed',
    statusWarning: '#e6b300',
    statusWarningBg: '#fff7e6',
    statusError: '#d32f2f',
    statusErrorBg: '#fef2f2',
    statusInfo: '#0077b5',
    statusInfoBg: '#e3f2fd',
  },
};

// ===========================================
// PALETTE 4: GOVERNMENT TRUST (USWDS)
// ===========================================
// Based on U.S. Web Design System - Institutional
const governmentTrust: ColorPalette = {
  id: 'government-trust',
  name: 'Institutional Trust',
  description: 'Government-grade palette based on USWDS. Maximum accessibility and official authority.',
  mode: 'light',
  bestFor: ['Government platforms', 'Institutional portals', 'Compliance tools', 'Public sector'],
  colors: {
    primary: {
      50: '#e7f2fa',
      100: '#c2dff2',
      200: '#99ccea',
      300: '#70b8e1',
      400: '#4fa7d9',
      500: '#2378c3',  // USWDS blue-50
      600: '#276c9b',
      700: '#1a4f71',
      800: '#0d3b59',
      900: '#002d41',
    },
    secondary: {
      50: '#eceef7',
      100: '#ccd0e8',
      200: '#aab1d8',
      300: '#8892c8',
      400: '#6673b8',
      500: '#3d4076',  // USWDS indigo-70
      600: '#323568',
      700: '#282a5a',
      800: '#1e204c',
      900: '#14153e',
    },
    accent: {
      50: '#fdf3e3',
      100: '#fadfb8',
      200: '#f7cb8a',
      300: '#f4b75c',
      400: '#f1a32e',
      500: '#e08f00',
      600: '#c07a00',
      700: '#a06500',
      800: '#805000',
      900: '#603b00',
    },
    success: {
      50: '#e5f5ed',
      100: '#bfe5d1',
      200: '#95d5b5',
      300: '#6bc599',
      400: '#41b57d',
      500: '#077d4a',  // USWDS green-70
      600: '#066840',
      700: '#055336',
      800: '#043e2c',
      900: '#032922',
    },
    warning: {
      50: '#fef7e6',
      100: '#fdecc0',
      200: '#fce199',
      300: '#fbd673',
      400: '#f5a623',  // USWDS amber-50
      500: '#e09500',
      600: '#c78200',
      700: '#a86f00',
      800: '#8a5c00',
      900: '#6b4800',
    },
    error: {
      50: '#fceeee',
      100: '#f8d4d4',
      200: '#f4b9b9',
      300: '#f09f9f',
      400: '#ec8484',
      500: '#d83933',  // USWDS red-50
      600: '#c23028',
      700: '#a6271f',
      800: '#8a1e16',
      900: '#6e150d',
    },
    neutral: {
      white: '#ffffff',
      50: '#f5f6f7',
      100: '#edeff0',
      200: '#dfe1e2',
      300: '#c6cace',
      400: '#a9aeb1',
      500: '#71767a',
      600: '#565c65',
      700: '#3d4551',
      800: '#2d2e2f',
      900: '#1b1b1b',
      black: '#000000',
    },
  },
  semantic: {
    bgPrimary: '#ffffff',
    bgSecondary: '#f5f6f7',
    bgTertiary: '#edeff0',
    bgAccent: '#e7f2fa',
    bgHover: '#dfe1e2',

    textPrimary: '#1b1b1b',
    textSecondary: '#565c65',
    textMuted: '#71767a',
    textInverse: '#ffffff',

    borderPrimary: '#dfe1e2',
    borderSecondary: '#c6cace',
    borderFocus: '#2378c3',

    buttonPrimary: '#2378c3',
    buttonPrimaryHover: '#1a4f71',
    buttonSecondary: '#edeff0',
    buttonAccent: '#e08f00',
    buttonAccentHover: '#c07a00',

    statusSuccess: '#077d4a',
    statusSuccessBg: '#e5f5ed',
    statusWarning: '#e09500',
    statusWarningBg: '#fef7e6',
    statusError: '#d83933',
    statusErrorBg: '#fceeee',
    statusInfo: '#2378c3',
    statusInfoBg: '#e7f2fa',
  },
};

// ===========================================
// PALETTE 5: EDTECH LEARNING
// ===========================================
// Education/training focused
const edtechLearning: ColorPalette = {
  id: 'edtech-learning',
  name: 'EdTech Learning',
  description: 'Optimized for learning and skill development. Increases focus and retention.',
  mode: 'light',
  bestFor: ['Training platforms', 'Online learning', 'Corporate universities', 'Skills development'],
  colors: {
    primary: {
      50: '#e8f1fa',
      100: '#c5daf2',
      200: '#9ec3ea',
      300: '#77abe1',
      400: '#5094d9',
      500: '#1e5ba8',  // Educational blue
      600: '#194d8f',
      700: '#143f76',
      800: '#0f315d',
      900: '#0a2344',
    },
    secondary: {
      50: '#e8f5ec',
      100: '#c4e6cf',
      200: '#9dd7b1',
      300: '#76c893',
      400: '#4fb975',
      500: '#2d7a4e',  // Educational green
      600: '#266742',
      700: '#1f5436',
      800: '#18412a',
      900: '#112e1e',
    },
    accent: {
      50: '#fff4e5',
      100: '#ffe1b8',
      200: '#ffce8a',
      300: '#ffba5c',
      400: '#ffa82e',
      500: '#ff8c00',  // Educational orange
      600: '#e07c00',
      700: '#c06b00',
      800: '#a05a00',
      900: '#804900',
    },
    success: {
      50: '#e8f5ec',
      100: '#c4e6cf',
      200: '#9dd7b1',
      300: '#76c893',
      400: '#4fb975',
      500: '#2d7a4e',
      600: '#266742',
      700: '#1f5436',
      800: '#18412a',
      900: '#112e1e',
    },
    warning: {
      50: '#fff8e1',
      100: '#ffecb3',
      200: '#ffe082',
      300: '#ffd54f',
      400: '#ffca28',
      500: '#ffc107',
      600: '#ffb300',
      700: '#ffa000',
      800: '#ff8f00',
      900: '#ff6f00',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#d32f2f',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    neutral: {
      white: '#ffffff',
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#36454f',  // Charcoal
      900: '#262626',
      black: '#000000',
    },
  },
  semantic: {
    bgPrimary: '#ffffff',
    bgSecondary: '#fafafa',
    bgTertiary: '#f5f5f5',
    bgAccent: '#e8f1fa',
    bgHover: '#e5e5e5',

    textPrimary: '#262626',
    textSecondary: '#525252',
    textMuted: '#737373',
    textInverse: '#ffffff',

    borderPrimary: '#e5e5e5',
    borderSecondary: '#d4d4d4',
    borderFocus: '#1e5ba8',

    buttonPrimary: '#1e5ba8',
    buttonPrimaryHover: '#194d8f',
    buttonSecondary: '#f5f5f5',
    buttonAccent: '#ff8c00',
    buttonAccentHover: '#e07c00',

    statusSuccess: '#2d7a4e',
    statusSuccessBg: '#e8f5ec',
    statusWarning: '#ffa000',
    statusWarningBg: '#fff8e1',
    statusError: '#d32f2f',
    statusErrorBg: '#fef2f2',
    statusInfo: '#1e5ba8',
    statusInfoBg: '#e8f1fa',
  },
};

// ===========================================
// PALETTE 6: STEMWORKFORCE DARK (Current Default)
// ===========================================
const stemworkforceDark: ColorPalette = {
  id: 'stemworkforce-dark',
  name: 'STEMWorkforce Dark',
  description: 'Current dark mode theme. Tech-forward and dramatic for developer audiences.',
  mode: 'dark',
  bestFor: ['Tech platforms', 'Developer tools', 'Modern SaaS', 'Night usage'],
  colors: {
    primary: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',  // Emerald
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    secondary: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',  // Cyan/Teal
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
    },
    accent: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',  // Indigo
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
    },
    success: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',  // Amber
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    neutral: {
      white: '#ffffff',
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      black: '#000000',
    },
  },
  semantic: {
    bgPrimary: '#0f172a',     // slate-900
    bgSecondary: '#1e293b',   // slate-800
    bgTertiary: '#334155',    // slate-700
    bgAccent: '#1e3a5f',      // dark blue accent
    bgHover: '#334155',

    textPrimary: '#ffffff',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    textInverse: '#0f172a',

    borderPrimary: '#334155',
    borderSecondary: '#475569',
    borderFocus: '#10b981',

    buttonPrimary: '#10b981',
    buttonPrimaryHover: '#059669',
    buttonSecondary: '#334155',
    buttonAccent: '#6366f1',
    buttonAccentHover: '#4f46e5',

    statusSuccess: '#34d399',
    statusSuccessBg: 'rgba(16, 185, 129, 0.2)',
    statusWarning: '#fbbf24',
    statusWarningBg: 'rgba(245, 158, 11, 0.2)',
    statusError: '#f87171',
    statusErrorBg: 'rgba(239, 68, 68, 0.2)',
    statusInfo: '#818cf8',
    statusInfoBg: 'rgba(99, 102, 241, 0.2)',
  },
};

// ===========================================
// EXPORT ALL PALETTES
// ===========================================

export const COLOR_PALETTES: Record<PaletteId, ColorPalette> = {
  'professional-tech': professionalTech,
  'linkedin-blue': linkedinBlue,
  'glassdoor-green': glassdoorGreen,
  'government-trust': governmentTrust,
  'edtech-learning': edtechLearning,
  'stemworkforce-dark': stemworkforceDark,
};

export const PALETTE_LIST = Object.values(COLOR_PALETTES);

export const DEFAULT_PALETTE: PaletteId = 'stemworkforce-dark';

// ===========================================
// UTILITY FUNCTIONS
// ===========================================

export const getPalette = (id: PaletteId): ColorPalette => {
  return COLOR_PALETTES[id] || COLOR_PALETTES[DEFAULT_PALETTE];
};

export const getPalettesByMode = (mode: 'light' | 'dark'): ColorPalette[] => {
  return PALETTE_LIST.filter(p => p.mode === mode);
};

// Generate CSS variables from a palette
export const generateCSSVariables = (palette: ColorPalette): Record<string, string> => {
  const vars: Record<string, string> = {};

  // Semantic variables
  Object.entries(palette.semantic).forEach(([key, value]) => {
    vars[`--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`] = value;
  });

  // Color scale variables
  Object.entries(palette.colors).forEach(([colorName, scale]) => {
    if (typeof scale === 'object') {
      Object.entries(scale).forEach(([shade, color]) => {
        vars[`--color-${colorName}-${shade}`] = color as string;
      });
    }
  });

  return vars;
};

export default COLOR_PALETTES;
