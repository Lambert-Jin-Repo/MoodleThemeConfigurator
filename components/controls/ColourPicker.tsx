'use client';

import { useState, useEffect } from 'react';
import type { ThemeTokens } from '@/lib/tokens';
import { contrastRatio, isBlockedColour, hexToRgb, hexToHsl, hslToHex } from '@/lib/accessibility';
import LinkedIndicator from './LinkedIndicator';

type ColourFormat = 'hex' | 'rgb' | 'hsl';
const FORMAT_ORDER: ColourFormat[] = ['hex', 'rgb', 'hsl'];

function formatColour(hex: string, format: ColourFormat): string {
  switch (format) {
    case 'hex':
      return hex.toUpperCase();
    case 'rgb': {
      const [r, g, b] = hexToRgb(hex);
      return `rgb(${r}, ${g}, ${b})`;
    }
    case 'hsl': {
      const [h, s, l] = hexToHsl(hex);
      return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }
  }
}

/** Parse an rgb(...) string back to hex, or null if invalid */
function parseRgb(input: string): string | null {
  const m = input.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
  if (!m) return null;
  const [r, g, b] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (r > 255 || g > 255 || b > 255) return null;
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

/** Parse an hsl(...) string back to hex, or null if invalid */
function parseHsl(input: string): string | null {
  const m = input.match(/^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%?\s*,\s*(\d{1,3})%?\s*\)$/i);
  if (!m) return null;
  const [h, s, l] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (h > 360 || s > 100 || l > 100) return null;
  return hslToHex(h, s / 100, l / 100);
}

interface ColourPickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  showContrastOn?: string;
  tokenKey?: keyof ThemeTokens;
  linkedToBrand?: boolean;
}

export default function ColourPicker({
  label,
  value,
  onChange,
  disabled = false,
  showContrastOn,
  tokenKey,
  linkedToBrand = false,
}: ColourPickerProps) {
  const [colourFormat, setColourFormat] = useState<ColourFormat>('hex');
  const [textInput, setTextInput] = useState(value);

  useEffect(() => {
    setTextInput(formatColour(value, colourFormat));
  }, [value, colourFormat]);

  const cycleFormat = () => {
    const next = FORMAT_ORDER[(FORMAT_ORDER.indexOf(colourFormat) + 1) % FORMAT_ORDER.length];
    setColourFormat(next);
  };

  const isLinkOrText = tokenKey === 'linkColour' || tokenKey === 'bodyText';
  const blocked = isLinkOrText && isBlockedColour(value);
  const ratio = showContrastOn ? contrastRatio(value, showContrastOn) : null;

  const handleTextInput = (input: string) => {
    setTextInput(input);

    // Try to parse based on current format
    if (colourFormat === 'hex') {
      if (/^#[0-9A-Fa-f]{6}$/.test(input)) {
        onChange(input.toUpperCase());
      }
    } else if (colourFormat === 'rgb') {
      const hex = parseRgb(input);
      if (hex) onChange(hex);
    } else if (colourFormat === 'hsl') {
      const hex = parseHsl(input);
      if (hex) onChange(hex);
    }
  };

  const handleNativeChange = (hex: string) => {
    onChange(hex.toUpperCase());
  };

  const id = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`space-y-1 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={`color-${id}`} className="text-xs font-medium text-gray-600">
          {label}
        </label>
        {linkedToBrand && tokenKey && (
          <LinkedIndicator tokenKey={tokenKey} currentValue={value} />
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Native colour input (always visible) */}
        <input
          type="color"
          id={`color-${id}`}
          value={value}
          onChange={(e) => handleNativeChange(e.target.value)}
          className="w-10 h-10 md:w-8 md:h-8 rounded border border-gray-300 cursor-pointer p-0"
          aria-label={`${label} colour picker`}
        />

        {/* Format-aware text input */}
        <input
          type="text"
          value={textInput}
          onChange={(e) => handleTextInput(e.target.value)}
          className="flex-1 text-xs border border-gray-300 rounded px-2 py-1.5 font-mono"
          aria-label={`${label} ${colourFormat.toUpperCase()} value`}
        />

        {/* Format cycle button */}
        <button
          className="text-[10px] font-semibold font-mono text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded px-2 py-1 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center transition-colors uppercase tracking-wide"
          onClick={cycleFormat}
          aria-label={`Cycle colour format (currently ${colourFormat.toUpperCase()})`}
          title="Click to cycle: HEX / RGB / HSL"
        >
          {colourFormat}
        </button>
      </div>

      {/* Contrast badge */}
      {ratio !== null && (
        <div
          className={`text-xs px-2 py-0.5 rounded inline-block ${
            ratio >= 7
              ? 'bg-green-100 text-green-800'
              : ratio >= 4.5
              ? 'bg-green-50 text-green-700'
              : ratio >= 3
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}
          aria-live="polite"
        >
          {ratio.toFixed(1)}:1{' '}
          {ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail'}
        </div>
      )}

      {/* Blocked colour warning */}
      {blocked && (
        <p className="text-xs text-red-600 mt-1" role="alert">
          {value.toUpperCase()} has a {ratio?.toFixed(2)}:1 contrast ratio on white. WCAG AA requires at least 4.5:1. Choose a darker colour.
        </p>
      )}
    </div>
  );
}
