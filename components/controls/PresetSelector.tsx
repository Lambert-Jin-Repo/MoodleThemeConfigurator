'use client';

import { useThemeStore } from '@/store/theme-store';
import { PRESET_TEMPLATES, DEFAULT_TOKENS } from '@/lib/tokens';
import { Star } from 'lucide-react';

export default function PresetSelector() {
  const activePresetId = useThemeStore((s) => s.activePresetId);
  const isCustomMode = useThemeStore((s) => s.isCustomMode);
  const applyPreset = useThemeStore((s) => s.applyPreset);
  const switchToCustom = useThemeStore((s) => s.switchToCustom);

  return (
    <div role="radiogroup" aria-label="Theme presets" className="space-y-2">
      {PRESET_TEMPLATES.map((preset) => {
        const isActive = activePresetId === preset.id;
        const overrides = { ...DEFAULT_TOKENS, ...preset.overrides };

        return (
          <button
            key={preset.id}
            role="radio"
            aria-checked={isActive}
            className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
              isActive
                ? 'border-gray-800 bg-gray-50'
                : 'border-gray-200 hover:border-gray-400'
            }`}
            onClick={() => applyPreset(preset.id)}
          >
            <div className="flex items-start gap-3">
              {/* Colour swatches */}
              <div className="flex flex-col gap-0.5 flex-shrink-0 mt-0.5">
                <div
                  className="w-6 h-3 rounded-t"
                  style={{ backgroundColor: overrides.navbarBg }}
                />
                <div
                  className="w-6 h-3"
                  style={{ backgroundColor: overrides.btnPrimaryBg }}
                />
                <div
                  className="w-6 h-3 rounded-b"
                  style={{ backgroundColor: overrides.footerBg }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-gray-800">
                    {preset.name}
                  </span>
                  {preset.recommended && (
                    <span className="flex items-center gap-0.5 text-xs bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full">
                      <Star size={10} />
                      Recommended
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{preset.description}</p>
              </div>
            </div>
          </button>
        );
      })}

      {/* Custom tile */}
      <button
        role="radio"
        aria-checked={isCustomMode}
        className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
          isCustomMode
            ? 'border-gray-800 bg-gray-50'
            : 'border-dashed border-gray-300 hover:border-gray-400'
        }`}
        onClick={switchToCustom}
      >
        <div className="flex items-center gap-3">
          <div className="w-6 h-9 rounded bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 flex-shrink-0" />
          <div>
            <span className="text-sm font-semibold text-gray-800">Custom</span>
            <p className="text-xs text-gray-500 mt-0.5">
              Unlock all colour pickers for full customisation
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
