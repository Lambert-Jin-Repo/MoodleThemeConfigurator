'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';
import { PRESET_TEMPLATES, DEFAULT_TOKENS, isModifiedFromPreset } from '@/lib/tokens';

export default function PresetDropdown() {
  const activePresetId = useThemeStore((s) => s.activePresetId);
  const tokens = useThemeStore((s) => s.tokens);
  const presetBaseline = useThemeStore((s) => s.presetBaseline);
  const applyPreset = useThemeStore((s) => s.applyPreset);

  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activePreset = PRESET_TEMPLATES.find((p) => p.id === activePresetId);
  const modified = isModifiedFromPreset(tokens, presetBaseline);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  // Get 3-color swatch for a preset
  const getSwatchColors = (presetId: string) => {
    const preset = PRESET_TEMPLATES.find((p) => p.id === presetId);
    if (!preset) return { navbar: DEFAULT_TOKENS.navbarBg, button: DEFAULT_TOKENS.btnPrimaryBg, footer: DEFAULT_TOKENS.footerBg };
    const merged = { ...DEFAULT_TOKENS, ...preset.overrides };
    return { navbar: merged.navbarBg, button: merged.btnPrimaryBg, footer: merged.footerBg };
  };

  const MiniSwatch = ({ colors }: { colors: { navbar: string; button: string; footer: string } }) => (
    <div className="flex gap-0.5" aria-hidden="true">
      <span className="w-3 h-3 rounded-sm border border-gray-300" style={{ backgroundColor: colors.navbar }} />
      <span className="w-3 h-3 rounded-sm border border-gray-300" style={{ backgroundColor: colors.button }} />
      <span className="w-3 h-3 rounded-sm border border-gray-300" style={{ backgroundColor: colors.footer }} />
    </div>
  );

  return (
    <div ref={containerRef} className="relative px-4 py-3 border-b border-gray-200">
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Start From</label>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white hover:border-gray-400 transition-colors"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select a preset theme"
      >
        <div className="flex items-center gap-2 min-w-0">
          {activePreset ? (
            <>
              <MiniSwatch colors={getSwatchColors(activePreset.id)} />
              <span className="truncate font-medium text-gray-800">{activePreset.name}</span>
              {modified && (
                <span className="flex-shrink-0 text-[10px] font-semibold px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                  Modified
                </span>
              )}
            </>
          ) : (
            <span className="text-gray-400">Select a preset...</span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute left-4 right-4 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto"
          role="listbox"
          aria-label="Theme presets"
        >
          {PRESET_TEMPLATES.map((preset) => {
            const colors = getSwatchColors(preset.id);
            const isActive = preset.id === activePresetId;
            return (
              <button
                key={preset.id}
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  applyPreset(preset.id);
                  setOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-gray-50 transition-colors ${
                  isActive ? 'bg-blue-50 border-l-2 border-l-blue-500' : 'border-l-2 border-l-transparent'
                }`}
              >
                <MiniSwatch colors={colors} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm truncate ${isActive ? 'font-semibold text-blue-700' : 'font-medium text-gray-800'}`}>
                      {preset.name}
                    </span>
                    {preset.recommended && (
                      <span className="text-[10px] font-semibold px-1 py-0.5 bg-green-100 text-green-700 rounded">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{preset.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
