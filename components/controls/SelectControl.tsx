'use client';

interface SelectControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { label: string; value: string }[];
  disabled?: boolean;
}

export default function SelectControl({
  label,
  value,
  onChange,
  options,
  disabled = false,
}: SelectControlProps) {
  const id = label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={disabled ? 'opacity-50 pointer-events-none' : ''}>
      <label htmlFor={`select-${id}`} className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      <select
        id={`select-${id}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full text-sm border border-gray-300 rounded px-2 py-1.5"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
