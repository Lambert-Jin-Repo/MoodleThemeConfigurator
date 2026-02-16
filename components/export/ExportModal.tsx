'use client';

import { useEffect, useRef, useMemo, useState } from 'react';
import { X, Download, Copy, Check, ExternalLink } from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';
import { generateScss } from '@/lib/scss-generator';
import { contrastRatio } from '@/lib/accessibility';
import { CONTRAST_CHECKS } from '@/lib/accessibility';
import type { ThemeTokens } from '@/lib/tokens';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
}

function CopyButton({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold rounded-lg border-2 transition-all"
      style={{
        borderColor: copied ? '#357a32' : '#dee2e6',
        backgroundColor: copied ? '#f0fdf0' : '#FFFFFF',
        color: copied ? '#357a32' : '#404041',
      }}
      aria-label={`Copy ${label} to clipboard`}
    >
      {copied ? (
        <>
          <Check size={18} className="text-green-600" />
          Copied!
        </>
      ) : (
        <>
          <Copy size={18} />
          Copy {label}
        </>
      )}
    </button>
  );
}

export default function ExportModal({ open, onClose }: ExportModalProps) {
  const tokens = useThemeStore((s) => s.tokens);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const canExport = useMemo(() => {
    return !CONTRAST_CHECKS.some((check) => {
      const fg = tokens[check.fgKey as keyof ThemeTokens] as string;
      const bg = tokens[check.bgKey as keyof ThemeTokens] as string;
      return contrastRatio(fg, bg) < 3;
    });
  }, [tokens]);

  const scss = useMemo(() => generateScss(tokens), [tokens]);

  // Focus trap + Escape
  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleDownload = () => {
    const content = [
      '=== CFA Moodle Theme Configuration ===',
      '',
      '--- Brand Colour ---',
      scss.brandColour,
      '',
      '--- Raw Initial SCSS ---',
      scss.block1,
      '',
      '--- Raw SCSS ---',
      scss.block2,
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cfa-moodle-theme.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Apply on Moodle"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Apply on Moodle</h3>
          <button
            ref={closeRef}
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {!canExport && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700" role="alert">
              Export is blocked — fix colour pairings with less than 3:1 contrast in the Audit panel first.
            </div>
          )}

          {/* Step 1: Where to go */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F27927] text-white text-xs font-bold">1</span>
              <h4 className="text-sm font-bold text-gray-800">Go to your Moodle theme settings</h4>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 space-y-1.5 ml-8">
              <p className="font-medium">Site administration &rarr; Appearance &rarr; Themes &rarr; Boost</p>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <ExternalLink size={12} />
                <span>cfaa.moodlecloud.com &rarr; Site admin menu</span>
              </div>
            </div>
          </div>

          {/* Step 2: Brand Colour */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F27927] text-white text-xs font-bold">2</span>
              <h4 className="text-sm font-bold text-gray-800">Set the Brand colour</h4>
            </div>
            <div className="ml-8 space-y-2">
              <p className="text-sm text-gray-600">
                Enter this value in the <span className="font-semibold">Brand colour</span> field:
              </p>
              <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                <div
                  className="w-8 h-8 rounded border border-gray-300 flex-shrink-0"
                  style={{ backgroundColor: scss.brandColour }}
                />
                <code className="text-sm font-mono font-bold text-gray-800">{scss.brandColour}</code>
              </div>
            </div>
          </div>

          {/* Step 3: Raw Initial SCSS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F27927] text-white text-xs font-bold">3</span>
              <h4 className="text-sm font-bold text-gray-800">Paste into &ldquo;Raw initial SCSS&rdquo;</h4>
            </div>
            <div className="ml-8 space-y-2">
              <p className="text-sm text-gray-600">
                Expand <span className="font-semibold">Advanced settings</span>, then paste into the first SCSS box.
              </p>
              <CopyButton label="Raw Initial SCSS" text={scss.block1} />
            </div>
          </div>

          {/* Step 4: Raw SCSS */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F27927] text-white text-xs font-bold">4</span>
              <h4 className="text-sm font-bold text-gray-800">Paste into &ldquo;Raw SCSS&rdquo;</h4>
            </div>
            <div className="ml-8 space-y-2">
              <p className="text-sm text-gray-600">
                Paste into the second SCSS box, directly below the first one.
              </p>
              <CopyButton label="Raw SCSS" text={scss.block2} />
            </div>
          </div>

          {/* Step 5: Save & Purge */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#F27927] text-white text-xs font-bold">5</span>
              <h4 className="text-sm font-bold text-gray-800">Save and purge caches</h4>
            </div>
            <div className="ml-8 text-sm text-gray-600 space-y-1">
              <p>Click <span className="font-semibold">Save changes</span>, then go to:</p>
              <p className="font-medium text-gray-700">Site administration &rarr; Development &rarr; Purge all caches</p>
              <p className="text-xs text-gray-500 mt-1">Test in an incognito window to see changes immediately.</p>
            </div>
          </div>

          {/* Download option */}
          <div className="pt-2 border-t border-gray-200">
            <button
              onClick={handleDownload}
              disabled={!canExport}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Download size={16} />
              Download all as .txt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
