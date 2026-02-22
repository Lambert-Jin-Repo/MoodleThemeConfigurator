'use client';

import { useState, useRef, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { CFA_PALETTE } from '@/lib/tokens';
import type { ThemeTokens } from '@/lib/tokens';
import { contrastRatio, isBlockedColour } from '@/lib/accessibility';
import LinkedIndicator from './LinkedIndicator';

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
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [hexInput, setHexInput] = useState(value);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHexInput(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setPopoverOpen(false);
      }
    }
    if (popoverOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [popoverOpen]);

  const isLinkOrText = tokenKey === 'linkColour' || tokenKey === 'bodyText';
  const blocked = isLinkOrText && isBlockedColour(value);
  const ratio = showContrastOn ? contrastRatio(value, showContrastOn) : null;

  const handleHexChange = (hex: string) => {
    setHexInput(hex);
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      onChange(hex.toUpperCase());
    }
  };

  const handleNativeChange = (hex: string) => {
    onChange(hex.toUpperCase());
    setHexInput(hex.toUpperCase());
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

        {/* Hex text input */}
        <input
          type="text"
          value={hexInput}
          onChange={(e) => handleHexChange(e.target.value)}
          className="flex-1 text-xs border border-gray-300 rounded px-2 py-1.5 font-mono"
          aria-label={`${label} hex value`}
          maxLength={7}
        />

        {/* Popover toggle */}
        <button
          className="text-xs text-gray-500 hover:text-gray-700 px-1 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center"
          onClick={() => setPopoverOpen(!popoverOpen)}
          aria-label={`Advanced picker for ${label}`}
        >
          &#9660;
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

      {/* Advanced popover */}
      {popoverOpen && (
        <div
          ref={popoverRef}
          className="absolute z-50 mt-1 p-3 bg-white rounded-lg shadow-xl border border-gray-200"
        >
          <HexColorPicker
            color={value}
            onChange={(c) => {
              onChange(c.toUpperCase());
              setHexInput(c.toUpperCase());
            }}
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {CFA_PALETTE.map((swatch) => (
              <button
                key={swatch.hex}
                className="w-8 h-8 md:w-6 md:h-6 rounded border border-gray-300 hover:ring-2 hover:ring-offset-1 hover:ring-gray-400"
                style={{ backgroundColor: swatch.hex }}
                onClick={() => {
                  onChange(swatch.hex);
                  setHexInput(swatch.hex);
                }}
                aria-label={`${swatch.name} (${swatch.hex})`}
                title={swatch.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
