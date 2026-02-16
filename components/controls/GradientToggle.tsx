'use client';

import ColourPicker from './ColourPicker';

interface GradientToggleProps {
  enabled: boolean;
  endColour: string;
  onToggle: (enabled: boolean) => void;
  onEndColourChange: (colour: string) => void;
  disabled?: boolean;
}

export default function GradientToggle({
  enabled,
  endColour,
  onToggle,
  onEndColourChange,
  disabled = false,
}: GradientToggleProps) {
  return (
    <div className={`space-y-2 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-medium text-gray-600">Login Gradient</label>
        <button
          role="switch"
          aria-checked={enabled}
          aria-label="Toggle login gradient"
          onClick={() => onToggle(!enabled)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${
            enabled ? 'bg-gray-700' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform duration-200 ${
              enabled ? 'translate-x-[18px]' : 'translate-x-[3px]'
            }`}
          />
        </button>
      </div>
      {enabled && (
        <ColourPicker
          label="Gradient End Colour"
          value={endColour}
          onChange={onEndColourChange}
        />
      )}
    </div>
  );
}
