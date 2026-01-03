// ===========================================
// Theme Context - Light/Dark Mode + Color Palette Support
// ===========================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PaletteId,
  ColorPalette,
  COLOR_PALETTES,
  PALETTE_LIST,
  DEFAULT_PALETTE,
  getPalette,
  generateCSSVariables,
} from '@/config/colorPalettes';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  // Theme (dark/light)
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  isLight: boolean;
  // Color Palette
  paletteId: PaletteId;
  palette: ColorPalette;
  setPalette: (id: PaletteId) => void;
  availablePalettes: ColorPalette[];
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('stemworkforce-theme') as Theme;
      if (stored === 'light' || stored === 'dark') {
        return stored;
      }
      // Check system preference
      if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark'; // Default to dark
  });

  // Initialize palette from localStorage
  const [paletteId, setPaletteIdState] = useState<PaletteId>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('stemworkforce-palette') as PaletteId;
      if (stored && COLOR_PALETTES[stored]) {
        return stored;
      }
    }
    return DEFAULT_PALETTE;
  });

  // Get current palette object
  const palette = getPalette(paletteId);

  // Apply theme classes to document
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
    } else {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
    }
    localStorage.setItem('stemworkforce-theme', theme);
  }, [theme]);

  // Apply palette CSS variables to document
  useEffect(() => {
    const root = document.documentElement;
    const cssVars = generateCSSVariables(palette);

    // Apply all CSS variables
    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Store palette preference
    localStorage.setItem('stemworkforce-palette', paletteId);

    // Also update theme based on palette mode (optional auto-sync)
    // Uncomment if you want palette to auto-set theme mode:
    // if (palette.mode !== theme) {
    //   setThemeState(palette.mode);
    // }
  }, [palette, paletteId]);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('stemworkforce-theme');
      if (!stored) {
        setThemeState(e.matches ? 'light' : 'dark');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
  }, []);

  const setPalette = useCallback((id: PaletteId) => {
    setPaletteIdState(id);
    // Optionally sync theme with palette mode
    const newPalette = getPalette(id);
    setThemeState(newPalette.mode);
  }, []);

  const value: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    isDark: theme === 'dark',
    isLight: theme === 'light',
    paletteId,
    palette,
    setPalette,
    availablePalettes: PALETTE_LIST,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

// Hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
