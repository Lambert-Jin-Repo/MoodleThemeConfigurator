'use client';

import { contrastRatio, meetsAA, meetsAAA, meetsAALarge, suggestFix } from '@/lib/accessibility';

interface ContrastCardProps {
  label: string;
  description: string;
  fg: string;
  bg: string;
  isLargeText?: boolean;
  onApplyFix?: (colour: string) => void;
}

export default function ContrastCard({
  label,
  description,
  fg,
  bg,
  isLargeText = false,
  onApplyFix,
}: ContrastCardProps) {
  const ratio = contrastRatio(fg, bg);
  const passes = isLargeText ? meetsAALarge(ratio) : meetsAA(ratio);
  const passesAAA = meetsAAA(ratio);
  const isError = ratio < 3;

  const fix = !passes ? suggestFix(fg, bg, isLargeText) : null;

  return (
    <div
      className={`rounded-lg border p-3 ${
        isError ? 'border-red-300 bg-red-50' : !passes ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200'
      }`}
      aria-describedby={`contrast-${label.replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-800">{label}</h4>
          <p className="text-xs text-gray-500 mt-0.5">{description}</p>
        </div>
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded ${
            passesAAA
              ? 'bg-green-100 text-green-800'
              : passes
              ? 'bg-green-50 text-green-700'
              : isError
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {ratio.toFixed(1)}:1 {passesAAA ? 'AAA' : passes ? (isLargeText ? 'AA Large' : 'AA') : 'Fail'}
        </span>
      </div>

      {/* Colour swatches */}
      <div className="flex items-center gap-2 mt-2">
        <div className="flex items-center gap-1">
          <div
            className="w-5 h-5 rounded border border-gray-300"
            style={{ backgroundColor: fg }}
          />
          <span className="text-xs font-mono text-gray-500">{fg}</span>
        </div>
        <span className="text-xs text-gray-400">on</span>
        <div className="flex items-center gap-1">
          <div
            className="w-5 h-5 rounded border border-gray-300"
            style={{ backgroundColor: bg }}
          />
          <span className="text-xs font-mono text-gray-500">{bg}</span>
        </div>
      </div>

      {/* Fix suggestion */}
      {fix && onApplyFix && (
        <div className="mt-2 flex items-center gap-2">
          <div
            className="w-4 h-4 rounded border border-gray-300"
            style={{ backgroundColor: fix }}
          />
          <span className="text-xs text-gray-600">
            Suggested: {fix}
          </span>
          <button
            className="text-xs text-blue-600 hover:underline font-medium"
            onClick={() => onApplyFix(fix)}
            aria-label={`Apply fix: change to ${fix}`}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
