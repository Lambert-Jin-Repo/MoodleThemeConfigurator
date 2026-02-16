'use client';

interface SliderControlProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  disabled?: boolean;
}

export default function SliderControl({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = '',
  disabled = false,
}: SliderControlProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <div className="flex items-center justify-between mb-1">
        <label htmlFor={`slider-${id}`} className="text-xs font-medium text-gray-600">
          {label}
        </label>
        <span className="text-xs font-mono text-gray-500">
          {value}{unit}
        </span>
      </div>
      <input
        id={`slider-${id}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-700"
        aria-label={label}
      />
    </div>
  );
}
