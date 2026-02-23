'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ChevronRight } from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';
import { CFA_PALETTE, FONT_OPTIONS } from '@/lib/tokens';
import type { ThemeTokens } from '@/lib/tokens';

interface SwatchDef {
  label: string;
  tokenKey: keyof ThemeTokens;
  sectionId: string;
  useBrandAction?: boolean;
}

const SWATCHES: SwatchDef[] = [
  { label: 'Brand', tokenKey: 'brandPrimary', sectionId: 'brand-colour', useBrandAction: true },
  { label: 'Navbar', tokenKey: 'navbarBg', sectionId: 'navbar' },
  { label: 'Buttons', tokenKey: 'btnPrimaryBg', sectionId: 'buttons' },
  { label: 'Footer', tokenKey: 'footerBg', sectionId: 'footer' },
  { label: 'Links', tokenKey: 'linkColour', sectionId: 'links-&-focus' },
  { label: 'Login BG', tokenKey: 'loginBg', sectionId: 'login-page' },
  { label: 'Text', tokenKey: 'bodyText', sectionId: 'typography' },
  { label: 'Accent', tokenKey: 'sectionAccent', sectionId: 'content-area' },
];

export default function QuickPalette() {
  const tokens = useThemeStore((s) => s.tokens);
  const setToken = useThemeStore((s) => s.setToken);
  const setBrandPrimary = useThemeStore((s) => s.setBrandPrimary);
  const setActiveControlSection = useThemeStore((s) => s.setActiveControlSection);
  const requestScrollToSection = useThemeStore((s) => s.requestScrollToSection);

  const [activeSwatch, setActiveSwatch] = useState<string | null>(null);
  const [hexInput, setHexInput] = useState('');

  const handleSwatchClick = (swatch: SwatchDef) => {
    if (activeSwatch === swatch.tokenKey) {
      setActiveSwatch(null);
      return;
    }
    setActiveSwatch(swatch.tokenKey);
    setHexInput(String(tokens[swatch.tokenKey]));
  };

  const handleGoToSection = (swatch: SwatchDef) => {
    setActiveControlSection(swatch.sectionId);
    requestScrollToSection(swatch.sectionId);
    setActiveSwatch(null);
  };

  const handleColorChange = (color: string, swatch: SwatchDef) => {
    const upper = color.toUpperCase();
    if (swatch.useBrandAction) {
      setBrandPrimary(upper);
    } else {
      setToken(swatch.tokenKey, upper);
    }
    setHexInput(upper);
  };

  const handleHexInput = (hex: string, swatch: SwatchDef) => {
    setHexInput(hex);
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      handleColorChange(hex, swatch);
    }
  };

  const activeSwatchDef = SWATCHES.find((s) => s.tokenKey === activeSwatch);

  return (
    <div className="px-4 py-3 border-b border-gray-200">
      <label className="block text-xs font-semibold text-gray-500 mb-2">Quick Palette</label>
      <div className="grid grid-cols-4 gap-2">
        {SWATCHES.map((swatch) => {
          const value = String(tokens[swatch.tokenKey]);
          const isActive = activeSwatch === swatch.tokenKey;
          return (
            <button
              key={swatch.tokenKey}
              onClick={() => handleSwatchClick(swatch)}
              className={`flex flex-col items-center gap-1 p-1.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-gray-100 ring-2 ring-gray-400 ring-offset-1'
                  : 'hover:bg-gray-50'
              }`}
              aria-label={`Edit ${swatch.label} colour`}
              title={`${swatch.label}: ${value}`}
            >
              <span
                className="w-7 h-7 rounded-full border-2 border-gray-300 flex-shrink-0"
                style={{ backgroundColor: value === 'none' || value === 'transparent' ? '#FFFFFF' : value }}
              />
              <span className="text-[10px] text-gray-600 leading-tight">{swatch.label}</span>
            </button>
          );
        })}
      </div>

      {/* Typography quick controls */}
      <div className="mt-3 flex flex-col gap-2">
        <div>
          <label htmlFor="qp-font-family" className="block text-[10px] font-medium text-gray-500 mb-0.5">
            Font
          </label>
          <select
            id="qp-font-family"
            value={`${tokens.fontFamily}||${tokens.fontWeight}`}
            onChange={(e) => {
              const [family, weight] = e.target.value.split('||');
              setToken('fontFamily', family);
              setToken('fontWeight', weight);
            }}
            className="w-full text-xs border border-gray-300 rounded px-2 py-1.5 bg-white"
            aria-label="Font family"
          >
            {FONT_OPTIONS.map((opt) => (
              <option key={`${opt.value}||${opt.weight}`} value={`${opt.value}||${opt.weight}`}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div className="flex items-center justify-between mb-0.5">
            <label htmlFor="qp-font-size" className="text-[10px] font-medium text-gray-500">
              Text Size
            </label>
            <span className="text-[10px] font-mono text-gray-400">
              {tokens.bodyFontSize}rem
            </span>
          </div>
          <input
            id="qp-font-size"
            type="range"
            min={0.75}
            max={1.25}
            step={0.0625}
            value={tokens.bodyFontSize}
            onChange={(e) => setToken('bodyFontSize', Number(e.target.value))}
            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-700"
            aria-label="Base font size"
          />
        </div>
      </div>

      {/* Inline picker for active swatch */}
      {activeSwatchDef && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">{activeSwatchDef.label}</span>
            <div className="flex items-center gap-1.5">
              <button
                className="flex items-center gap-0.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full transition-colors"
                onClick={() => handleGoToSection(activeSwatchDef)}
                aria-label={`Go to ${activeSwatchDef.label} section for more options`}
                title="Jump to full section below"
              >
                All options
                <ChevronRight size={14} />
              </button>
              <button
                className="text-xs text-gray-400 hover:text-gray-600 px-1.5 py-0.5"
                onClick={() => setActiveSwatch(null)}
                aria-label="Close picker"
              >
                Done
              </button>
            </div>
          </div>
          <HexColorPicker
            color={String(tokens[activeSwatchDef.tokenKey])}
            onChange={(c) => handleColorChange(c, activeSwatchDef)}
            style={{ width: '100%', height: 140 }}
          />
          <div className="flex items-center gap-2 mt-2">
            <input
              type="text"
              value={hexInput}
              onChange={(e) => handleHexInput(e.target.value, activeSwatchDef)}
              className="flex-1 text-xs border border-gray-300 rounded px-2 py-1.5 font-mono"
              aria-label={`${activeSwatchDef.label} hex value`}
              maxLength={7}
            />
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {CFA_PALETTE.map((swatch) => (
              <button
                key={swatch.hex}
                className="w-6 h-6 rounded border border-gray-300 hover:ring-2 hover:ring-offset-1 hover:ring-gray-400"
                style={{ backgroundColor: swatch.hex }}
                onClick={() => handleColorChange(swatch.hex, activeSwatchDef)}
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
