// ===========================================
// Theme Context - Color Palette Management
// ===========================================
// Supports 6 expert-designed color palettes with admin switching

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PaletteId,
  ColorPalette,
  COLOR_PALETTES,
  PALETTE_LIST,
  DEFAULT_PALETTE,
  getPalette,
  generateCSSVariables,
  getPalettePreview,
} from '@/config/colorPalettes';

interface ThemeContextType {
  // Current palette
  paletteId: PaletteId;
  palette: ColorPalette;
  setPalette: (id: PaletteId) => void;

  // Theme mode (derived from palette)
  isDark: boolean;
  isLight: boolean;
  mode: 'light' | 'dark';

  // Available palettes
  availablePalettes: ColorPalette[];
  darkPalettes: ColorPalette[];
  lightPalettes: ColorPalette[];

  // Utility functions
  getPalettePreviewColors: (palette: ColorPalette) => ReturnType<typeof getPalettePreview>;
  resetToDefault: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const STORAGE_KEY = 'stemworkforce-palette';

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultPalette?: PaletteId;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultPalette = DEFAULT_PALETTE
}) => {
  // Initialize palette from localStorage or default
  const [paletteId, setPaletteIdState] = useState<PaletteId>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as PaletteId;
      if (stored && COLOR_PALETTES[stored]) {
        return stored;
      }
    }
    return defaultPalette;
  });

  // Get current palette object
  const palette = getPalette(paletteId);
  const mode = palette.mode;
  const isDark = mode === 'dark';
  const isLight = mode === 'light';

  // Filter palettes by mode
  const darkPalettes = PALETTE_LIST.filter(p => p.mode === 'dark');
  const lightPalettes = PALETTE_LIST.filter(p => p.mode === 'light');

  // Apply palette CSS variables and mode class to document
  useEffect(() => {
    const root = document.documentElement;
    const cssVars = generateCSSVariables(palette);

    // Apply all CSS variables with transition
    root.style.setProperty('--theme-transition', 'all 200ms ease-in-out');

    Object.entries(cssVars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    // Update mode classes
    if (isDark) {
      root.classList.add('dark-mode');
      root.classList.remove('light-mode');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.add('light-mode');
      root.classList.remove('dark-mode');
      root.style.colorScheme = 'light';
    }

    // Add palette-specific class for additional styling hooks
    PALETTE_LIST.forEach(p => root.classList.remove(`palette-${p.id}`));
    root.classList.add(`palette-${paletteId}`);

    // Store palette preference
    localStorage.setItem(STORAGE_KEY, paletteId);

    // Remove transition after applied
    setTimeout(() => {
      root.style.removeProperty('--theme-transition');
    }, 200);
  }, [palette, paletteId, isDark]);

  // Listen for system preference changes (only if no preference stored)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Auto-switch to appropriate default based on system preference
        setPaletteIdState(e.matches ? 'deep-space' : 'professional');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setPalette = useCallback((id: PaletteId) => {
    if (COLOR_PALETTES[id]) {
      setPaletteIdState(id);
    }
  }, []);

  const resetToDefault = useCallback(() => {
    setPaletteIdState(defaultPalette);
    localStorage.removeItem(STORAGE_KEY);
  }, [defaultPalette]);

  const getPalettePreviewColors = useCallback((p: ColorPalette) => {
    return getPalettePreview(p);
  }, []);

  const value: ThemeContextType = {
    paletteId,
    palette,
    setPalette,
    isDark,
    isLight,
    mode,
    availablePalettes: PALETTE_LIST,
    darkPalettes,
    lightPalettes,
    getPalettePreviewColors,
    resetToDefault,
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

// Utility hook for common color access
export const useColors = () => {
  const { palette } = useTheme();
  return palette.colors;
};

export default ThemeProvider;
