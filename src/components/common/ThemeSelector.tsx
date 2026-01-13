// ===========================================
// Theme Selector Component
// ===========================================
// Allows admins to preview and switch between 6 color palettes
// Based on expert panel recommendations

import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ColorPalette, PaletteId } from '@/config/colorPalettes';

interface ThemeSelectorProps {
  showPreview?: boolean;
  compact?: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  showPreview = true,
  compact = false,
}) => {
  const { paletteId, palette, setPalette, availablePalettes, resetToDefault } = useTheme();
  const [previewPalette, setPreviewPalette] = useState<ColorPalette | null>(null);

  const displayPalette = previewPalette || palette;

  const handlePaletteSelect = (id: PaletteId) => {
    setPalette(id);
    setPreviewPalette(null);
  };

  const handlePreview = (p: ColorPalette) => {
    setPreviewPalette(p);
  };

  const handlePreviewEnd = () => {
    setPreviewPalette(null);
  };

  // Group palettes by mode
  const darkPalettes = availablePalettes.filter(p => p.mode === 'dark');
  const lightPalettes = availablePalettes.filter(p => p.mode === 'light');

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {availablePalettes.map((p) => (
          <button
            key={p.id}
            onClick={() => handlePaletteSelect(p.id)}
            className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
              paletteId === p.id
                ? 'border-[var(--color-primary)] bg-[var(--color-bg-tertiary)]'
                : 'border-[var(--color-border-primary)] hover:border-[var(--color-primary)]'
            }`}
            title={p.description}
          >
            {/* Color preview dots */}
            <div className="flex gap-1">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: p.colors.primary }}
              />
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: p.colors.bgPrimary }}
              />
            </div>
            <span className="text-sm" style={{ color: 'var(--color-text-primary)' }}>
              {p.name}
            </span>
            {paletteId === p.id && (
              <span className="text-xs" style={{ color: 'var(--color-success)' }}>✓</span>
            )}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Theme Info */}
      <div
        className="p-4 rounded-xl"
        style={{
          backgroundColor: 'var(--color-bg-secondary)',
          border: '1px solid var(--color-border-primary)',
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <h3
            className="text-lg font-semibold"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Current Theme: {displayPalette.name}
          </h3>
          <span
            className="px-2 py-1 text-xs rounded-full"
            style={{
              backgroundColor: displayPalette.mode === 'dark'
                ? 'rgba(99, 102, 241, 0.2)'
                : 'rgba(34, 211, 238, 0.2)',
              color: displayPalette.mode === 'dark' ? '#818CF8' : '#22D3EE',
            }}
          >
            {displayPalette.mode === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </span>
        </div>
        <p
          className="text-sm mb-3"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          {displayPalette.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className="px-2 py-1 text-xs rounded"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              color: 'var(--color-text-muted)',
            }}
          >
            WCAG {displayPalette.wcagLevel}
          </span>
          {displayPalette.bestFor.slice(0, 3).map((use, i) => (
            <span
              key={i}
              className="px-2 py-1 text-xs rounded"
              style={{
                backgroundColor: 'var(--color-bg-tertiary)',
                color: 'var(--color-text-muted)',
              }}
            >
              {use}
            </span>
          ))}
        </div>
        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          <strong>Recommended by:</strong> {displayPalette.expertRecommendedBy.join(', ')}
        </div>
      </div>

      {showPreview && (
        <>
          {/* Color Preview */}
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: 'var(--color-bg-secondary)',
              border: '1px solid var(--color-border-primary)',
            }}
          >
            <h4
              className="text-sm font-medium mb-3"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Color Preview
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <ColorSwatch label="Primary" color={displayPalette.colors.primary} />
              <ColorSwatch label="Secondary" color={displayPalette.colors.secondary} />
              <ColorSwatch label="Background" color={displayPalette.colors.bgPrimary} />
              <ColorSwatch label="Surface" color={displayPalette.colors.bgSecondary} />
              <ColorSwatch label="Success" color={displayPalette.colors.success} />
              <ColorSwatch label="Warning" color={displayPalette.colors.warning} />
              <ColorSwatch label="Error" color={displayPalette.colors.error} />
              <ColorSwatch label="Info" color={displayPalette.colors.info} />
            </div>
          </div>

          {/* UI Preview */}
          <div
            className="p-4 rounded-xl"
            style={{
              backgroundColor: displayPalette.colors.bgPrimary,
              border: `1px solid ${displayPalette.colors.borderPrimary}`,
            }}
          >
            <h4
              className="text-sm font-medium mb-3"
              style={{ color: displayPalette.colors.textSecondary }}
            >
              UI Preview
            </h4>
            <div
              className="p-4 rounded-lg mb-3"
              style={{
                backgroundColor: displayPalette.colors.bgSecondary,
                border: `1px solid ${displayPalette.colors.borderPrimary}`,
              }}
            >
              <h5
                className="font-semibold mb-1"
                style={{ color: displayPalette.colors.textPrimary }}
              >
                Sample Card Title
              </h5>
              <p
                className="text-sm mb-3"
                style={{ color: displayPalette.colors.textSecondary }}
              >
                This is how text and cards will appear with this theme.
              </p>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1.5 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: displayPalette.colors.primary,
                    color: displayPalette.colors.textInverse,
                  }}
                >
                  Primary Button
                </button>
                <button
                  className="px-3 py-1.5 rounded-lg text-sm font-medium"
                  style={{
                    backgroundColor: displayPalette.colors.bgTertiary,
                    color: displayPalette.colors.textPrimary,
                    border: `1px solid ${displayPalette.colors.borderPrimary}`,
                  }}
                >
                  Secondary
                </button>
              </div>
            </div>
            {/* Status badges preview */}
            <div className="flex flex-wrap gap-2">
              <span
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${displayPalette.colors.success}20`,
                  color: displayPalette.colors.success,
                }}
              >
                Success
              </span>
              <span
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${displayPalette.colors.warning}20`,
                  color: displayPalette.colors.warning,
                }}
              >
                Warning
              </span>
              <span
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${displayPalette.colors.error}20`,
                  color: displayPalette.colors.error,
                }}
              >
                Error
              </span>
              <span
                className="px-2 py-1 text-xs rounded-full"
                style={{
                  backgroundColor: `${displayPalette.colors.info}20`,
                  color: displayPalette.colors.info,
                }}
              >
                Info
              </span>
            </div>
          </div>
        </>
      )}

      {/* Dark Themes */}
      <div>
        <h4
          className="text-sm font-medium mb-3 flex items-center gap-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <span>🌙</span> Dark Themes
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          {darkPalettes.map((p) => (
            <PaletteCard
              key={p.id}
              palette={p}
              isActive={paletteId === p.id}
              onSelect={() => handlePaletteSelect(p.id)}
              onPreview={() => handlePreview(p)}
              onPreviewEnd={handlePreviewEnd}
            />
          ))}
        </div>
      </div>

      {/* Light Themes */}
      <div>
        <h4
          className="text-sm font-medium mb-3 flex items-center gap-2"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <span>☀️</span> Light Themes
        </h4>
        <div className="grid sm:grid-cols-2 gap-3">
          {lightPalettes.map((p) => (
            <PaletteCard
              key={p.id}
              palette={p}
              isActive={paletteId === p.id}
              onSelect={() => handlePaletteSelect(p.id)}
              onPreview={() => handlePreview(p)}
              onPreviewEnd={handlePreviewEnd}
            />
          ))}
        </div>
      </div>

      {/* Reset button */}
      <div className="flex justify-end">
        <button
          onClick={resetToDefault}
          className="text-sm px-4 py-2 rounded-lg transition-colors"
          style={{
            color: 'var(--color-text-muted)',
            border: '1px solid var(--color-border-primary)',
          }}
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
};

// Color Swatch Component
const ColorSwatch: React.FC<{ label: string; color: string }> = ({ label, color }) => (
  <div className="text-center">
    <div
      className="w-full h-10 rounded-lg mb-1 border"
      style={{
        backgroundColor: color,
        borderColor: 'var(--color-border-secondary)',
      }}
    />
    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
      {label}
    </span>
    <span
      className="block text-xs font-mono"
      style={{ color: 'var(--color-text-muted)' }}
    >
      {color}
    </span>
  </div>
);

// Palette Card Component
const PaletteCard: React.FC<{
  palette: ColorPalette;
  isActive: boolean;
  onSelect: () => void;
  onPreview: () => void;
  onPreviewEnd: () => void;
}> = ({ palette, isActive, onSelect, onPreview, onPreviewEnd }) => (
  <button
    onClick={onSelect}
    onMouseEnter={onPreview}
    onMouseLeave={onPreviewEnd}
    className={`relative p-4 rounded-xl text-left transition-all ${
      isActive ? 'ring-2 ring-[var(--color-primary)]' : ''
    }`}
    style={{
      backgroundColor: 'var(--color-bg-secondary)',
      border: `1px solid ${isActive ? 'var(--color-primary)' : 'var(--color-border-primary)'}`,
    }}
  >
    {isActive && (
      <div
        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs"
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-text-inverse)',
        }}
      >
        ✓
      </div>
    )}

    {/* Color preview strip */}
    <div className="flex gap-1 mb-3">
      <div
        className="w-8 h-8 rounded-lg"
        style={{ backgroundColor: palette.colors.primary }}
      />
      <div
        className="w-8 h-8 rounded-lg"
        style={{ backgroundColor: palette.colors.secondary }}
      />
      <div
        className="w-8 h-8 rounded-lg border"
        style={{
          backgroundColor: palette.colors.bgPrimary,
          borderColor: palette.colors.borderPrimary,
        }}
      />
      <div
        className="w-8 h-8 rounded-lg border"
        style={{
          backgroundColor: palette.colors.bgSecondary,
          borderColor: palette.colors.borderPrimary,
        }}
      />
    </div>

    <h5
      className="font-medium mb-1"
      style={{ color: 'var(--color-text-primary)' }}
    >
      {palette.name}
    </h5>
    <p
      className="text-xs mb-2 line-clamp-2"
      style={{ color: 'var(--color-text-muted)' }}
    >
      {palette.description}
    </p>
    <div className="flex items-center gap-2">
      <span
        className="px-1.5 py-0.5 text-xs rounded"
        style={{
          backgroundColor: 'var(--color-bg-tertiary)',
          color: 'var(--color-text-muted)',
        }}
      >
        {palette.wcagLevel}
      </span>
      <span
        className="text-xs"
        style={{ color: 'var(--color-text-muted)' }}
      >
        {palette.bestFor[0]}
      </span>
    </div>
  </button>
);

export default ThemeSelector;
