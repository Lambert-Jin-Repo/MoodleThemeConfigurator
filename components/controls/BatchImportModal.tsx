'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';
import { relativeLuminance, hexToHsl } from '@/lib/accessibility';
import type { ThemeTokens } from '@/lib/tokens';

interface BatchImportModalProps {
  open: boolean;
  onClose: () => void;
}

interface ParsedColor {
  hex: string;
  assignedToken: keyof ThemeTokens;
  luminance: number;
  saturation: number;
}

const TOKEN_OPTIONS: { key: keyof ThemeTokens; label: string }[] = [
  { key: 'brandPrimary', label: 'Brand Primary' },
  { key: 'navbarBg', label: 'Navbar BG' },
  { key: 'btnPrimaryBg', label: 'Button Primary BG' },
  { key: 'footerBg', label: 'Footer BG' },
  { key: 'linkColour', label: 'Link Colour' },
  { key: 'loginBg', label: 'Login BG' },
  { key: 'loginCardBg', label: 'Login Card BG' },
  { key: 'cardBg', label: 'Card BG' },
  { key: 'bodyText', label: 'Body Text' },
  { key: 'headingText', label: 'Heading Text' },
  { key: 'sectionAccent', label: 'Section Accent' },
  { key: 'focusRing', label: 'Focus Ring' },
];

function parseHexValues(input: string): string[] {
  const matches = input.match(/(?:#|0x)?([0-9A-Fa-f]{6})/g);
  if (!matches) return [];
  const all = matches.map((m) => {
    const clean = m.replace(/^(#|0x)/, '');
    return `#${clean.toUpperCase()}`;
  });
  return Array.from(new Set(all));
}

function autoAssign(hexValues: string[]): ParsedColor[] {
  const colors = hexValues.map((hex) => {
    const [, s] = hexToHsl(hex);
    return { hex, luminance: relativeLuminance(hex), saturation: s };
  });

  // Sort by luminance ascending (darkest first)
  const byLuminance = [...colors].sort((a, b) => a.luminance - b.luminance);
  // Sort by saturation descending (most saturated first)
  const bySaturation = [...colors].sort((a, b) => b.saturation - a.saturation);

  const assigned = new Set<string>();
  const result: ParsedColor[] = colors.map((c) => ({ ...c, assignedToken: 'brandPrimary' as keyof ThemeTokens }));

  const assign = (hex: string, token: keyof ThemeTokens) => {
    const entry = result.find((r) => r.hex === hex && !assigned.has(hex));
    if (entry) {
      entry.assignedToken = token;
      assigned.add(hex);
    }
  };

  // Darkest → navbar, footer
  if (byLuminance[0]) assign(byLuminance[0].hex, 'navbarBg');
  if (byLuminance[1]) assign(byLuminance[1].hex, 'footerBg');

  // Lightest → loginCardBg, cardBg
  const lightest = [...byLuminance].reverse();
  if (lightest[0] && !assigned.has(lightest[0].hex)) assign(lightest[0].hex, 'loginCardBg');
  if (lightest[1] && !assigned.has(lightest[1].hex)) assign(lightest[1].hex, 'cardBg');

  // Most saturated of remaining → brandPrimary
  for (const c of bySaturation) {
    if (!assigned.has(c.hex)) {
      assign(c.hex, 'brandPrimary');
      break;
    }
  }

  // Next most saturated → sectionAccent
  for (const c of bySaturation) {
    if (!assigned.has(c.hex)) {
      assign(c.hex, 'sectionAccent');
      break;
    }
  }

  // Assign any remaining
  const fallbackTokens: (keyof ThemeTokens)[] = ['linkColour', 'loginBg', 'bodyText', 'headingText'];
  let fi = 0;
  for (const r of result) {
    if (!assigned.has(r.hex) && fi < fallbackTokens.length) {
      r.assignedToken = fallbackTokens[fi++];
      assigned.add(r.hex);
    }
  }

  return result;
}

export default function BatchImportModal({ open, onClose }: BatchImportModalProps) {
  const batchSetTokens = useThemeStore((s) => s.batchSetTokens);
  const setBrandPrimary = useThemeStore((s) => s.setBrandPrimary);

  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<ParsedColor[]>([]);
  const [step, setStep] = useState<'input' | 'preview'>('input');

  if (!open) return null;

  const handleParse = () => {
    const hexValues = parseHexValues(input);
    if (hexValues.length === 0) return;
    setParsed(autoAssign(hexValues));
    setStep('preview');
  };

  const handleReassign = (index: number, token: keyof ThemeTokens) => {
    setParsed((prev) => prev.map((p, i) => (i === index ? { ...p, assignedToken: token } : p)));
  };

  const handleApply = () => {
    const updates: Record<string, string> = {};
    let brandValue: string | null = null;

    for (const color of parsed) {
      if (color.assignedToken === 'brandPrimary') {
        brandValue = color.hex;
      } else {
        updates[color.assignedToken] = color.hex;
      }
    }

    // Apply brand first (triggers propagation), then batch the rest
    if (brandValue) setBrandPrimary(brandValue);
    if (Object.keys(updates).length > 0) batchSetTokens(updates as Partial<ThemeTokens>);

    onClose();
    setInput('');
    setParsed([]);
    setStep('input');
  };

  const handleClose = () => {
    onClose();
    setInput('');
    setParsed([]);
    setStep('input');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={handleClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Import Colors</h3>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {step === 'input' ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Paste hex colour values from your brand guide. Supports #RRGGBB, RRGGBB, comma or newline separated.
              </p>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full h-32 text-sm border border-gray-300 rounded-lg px-3 py-2 font-mono resize-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="404041, F27927, 336E7B, F0EEEE"
                aria-label="Hex colour values"
              />
              <button
                onClick={handleParse}
                disabled={!input.trim()}
                className="w-full py-2 text-sm font-medium rounded-lg bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Parse Colors
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                {parsed.length} colour{parsed.length !== 1 ? 's' : ''} detected. Reassign if needed.
              </p>
              {parsed.map((color, i) => (
                <div key={color.hex} className="flex items-center gap-3">
                  <span
                    className="w-8 h-8 rounded border border-gray-300 flex-shrink-0"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-xs font-mono text-gray-600 w-16">{color.hex}</span>
                  <select
                    value={color.assignedToken}
                    onChange={(e) => handleReassign(i, e.target.value as keyof ThemeTokens)}
                    className="flex-1 text-xs border border-gray-300 rounded px-2 py-1.5"
                    aria-label={`Assign ${color.hex}`}
                  >
                    {TOKEN_OPTIONS.map((opt) => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              ))}
              <button
                onClick={() => setStep('input')}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Back to input
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {step === 'preview' && (
          <div className="px-5 py-3 border-t border-gray-200 flex gap-2">
            <button
              onClick={handleClose}
              className="flex-1 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="flex-1 py-2 text-sm font-medium rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            >
              Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
