'use client';

import { useEffect, useRef, useMemo } from 'react';
import { X, Download } from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';
import { generateScss } from '@/lib/scss-generator';
import { contrastRatio } from '@/lib/accessibility';
import { CONTRAST_CHECKS } from '@/lib/accessibility';
import type { ThemeTokens } from '@/lib/tokens';
import CodeBlock from './CodeBlock';
import InstructionPanel from './InstructionPanel';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
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
      aria-label="Export SCSS"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Export SCSS</h3>
          <button
            ref={closeRef}
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Close export modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-4 space-y-4">
          {!canExport && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700" role="alert">
              Export is blocked because one or more colour pairings have less than 3:1 contrast ratio. Fix the failing pairs in the Audit panel first.
            </div>
          )}

          <CodeBlock title="Brand Colour" code={scss.brandColour} />
          <CodeBlock title="Raw Initial SCSS" code={scss.block1} />
          <CodeBlock title="Raw SCSS" code={scss.block2} />

          <div className="flex gap-2">
            <button
              onClick={handleDownload}
              disabled={!canExport}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-gray-800 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download size={16} />
              Download as .txt
            </button>
          </div>

          <InstructionPanel />
        </div>
      </div>
    </div>
  );
}
