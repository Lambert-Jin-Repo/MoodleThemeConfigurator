'use client';

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import { Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';
import { parseScssToTokens } from '@/lib/scss-parser';
import type { ThemeTokens } from '@/lib/tokens';

interface ImportTabProps {
  onClose: () => void;
}

// ── Token category mapping ──

type TokenCategory =
  | 'Brand'
  | 'Navbar'
  | 'Buttons'
  | 'Links'
  | 'Content'
  | 'Login'
  | 'Footer'
  | 'Typography'
  | 'Alerts'
  | 'Drawers'
  | 'Focus'
  | 'Other';

const TOKEN_CATEGORIES: Record<string, TokenCategory> = {
  brandPrimary: 'Brand',

  navbarBg: 'Navbar',
  navbarText: 'Navbar',
  navbarBorder: 'Navbar',
  navActiveUnderline: 'Navbar',
  navHoverBg: 'Navbar',
  navHoverText: 'Navbar',
  editModeOnColour: 'Navbar',
  editModeThumbColour: 'Navbar',
  secondaryNavActive: 'Navbar',
  secondaryNavText: 'Navbar',

  btnPrimaryBg: 'Buttons',
  btnPrimaryText: 'Buttons',
  btnPrimaryHover: 'Buttons',
  btnRadius: 'Buttons',

  linkColour: 'Links',
  linkHover: 'Links',

  pageBg: 'Content',
  cardBg: 'Content',
  cardBorder: 'Content',
  contentMaxWidth: 'Content',
  sectionAccent: 'Content',
  breadcrumbBg: 'Content',

  loginBg: 'Login',
  loginCardBg: 'Login',
  loginHeading: 'Login',
  loginBtnBg: 'Login',
  loginBtnText: 'Login',
  loginInputRadius: 'Login',
  loginGradientEnabled: 'Login',
  loginGradientEnd: 'Login',

  footerBg: 'Footer',
  footerText: 'Footer',
  footerLink: 'Footer',
  footerAccent: 'Footer',

  bodyFontSize: 'Typography',
  headingScale: 'Typography',
  lineHeight: 'Typography',
  fontFamily: 'Typography',
  fontWeight: 'Typography',
  headingText: 'Typography',
  bodyText: 'Typography',
  mutedText: 'Typography',

  success: 'Alerts',
  warning: 'Alerts',
  error: 'Alerts',
  info: 'Alerts',
  alertInfoBg: 'Alerts',
  progressBg: 'Alerts',
  progressFill: 'Alerts',

  drawerBg: 'Drawers',
  drawerText: 'Drawers',
  drawerBorder: 'Drawers',

  focusRing: 'Focus',
  focusRingWidth: 'Focus',

  signupBtnBg: 'Other',
  logoAustraliaColour: 'Other',
};

function isHexColour(value: unknown): boolean {
  return typeof value === 'string' && /^#[0-9a-fA-F]{3,8}$/.test(value);
}

/** Human-friendly label from camelCase key */
function humanLabel(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

/** Format a token value for display */
function formatValue(key: string, value: unknown): string {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') {
    if (key.includes('Radius') || key.includes('Width') || key === 'contentMaxWidth')
      return `${value}px`;
    if (key === 'bodyFontSize') return `${value}rem`;
    return String(value);
  }
  if (typeof value === 'string') {
    // Truncate long font-family strings
    if (value.length > 40) return value.slice(0, 37) + '...';
    return value;
  }
  return String(value);
}

// ── Category order for display ──
const CATEGORY_ORDER: TokenCategory[] = [
  'Brand',
  'Navbar',
  'Buttons',
  'Links',
  'Content',
  'Login',
  'Footer',
  'Typography',
  'Drawers',
  'Alerts',
  'Focus',
  'Other',
];

export default function ImportTab({ onClose }: ImportTabProps) {
  const setBrandPrimary = useThemeStore((s) => s.setBrandPrimary);
  const batchSetTokens = useThemeStore((s) => s.batchSetTokens);

  const [scssText, setScssText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [parsedTokens, setParsedTokens] = useState<Partial<ThemeTokens> | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const tokenCount = parsedTokens ? Object.keys(parsedTokens).length : 0;

  // ── File reading ──

  const readFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setScssText(text);
        setFileName(file.name);
        // Reset parse state when new file loaded
        setParsedTokens(null);
        setParseError(null);
      }
    };
    reader.readAsText(file);
  }, []);

  const handleFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) readFile(file);
    },
    [readFile]
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) readFile(file);
    },
    [readFile]
  );

  // ── Parse ──

  const handleParse = useCallback(() => {
    const tokens = parseScssToTokens(scssText);
    if (Object.keys(tokens).length === 0) {
      setParseError(
        'No theme settings detected. Make sure you\'re pasting SCSS exported from this tool.'
      );
      setParsedTokens(null);
    } else {
      setParsedTokens(tokens);
      setParseError(null);
    }
  }, [scssText]);

  // ── Apply ──

  const handleApply = useCallback(() => {
    if (!parsedTokens) return;

    const { brandPrimary, ...rest } = parsedTokens;

    // Apply brandPrimary first to trigger propagation
    if (brandPrimary) {
      setBrandPrimary(brandPrimary);
    }

    // Then batch-set all remaining tokens
    if (Object.keys(rest).length > 0) {
      batchSetTokens(rest);
    }

    onClose();
  }, [parsedTokens, setBrandPrimary, batchSetTokens, onClose]);

  // ── Group parsed tokens by category ──

  const groupedTokens = parsedTokens
    ? CATEGORY_ORDER.reduce<
        { category: TokenCategory; entries: { key: string; value: unknown }[] }[]
      >((acc, category) => {
        const entries = Object.entries(parsedTokens)
          .filter(([key]) => (TOKEN_CATEGORIES[key] || 'Other') === category)
          .map(([key, value]) => ({ key, value }));
        if (entries.length > 0) {
          acc.push({ category, entries });
        }
        return acc;
      }, [])
    : [];

  return (
    <div className="space-y-4">
      {/* Input section */}
      <div>
        <label htmlFor="scss-import-textarea" className="block text-sm font-medium text-gray-700 mb-1.5">
          SCSS Code
        </label>
        <textarea
          id="scss-import-textarea"
          rows={12}
          className="w-full font-mono text-sm border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#336E7B] focus:border-transparent resize-y"
          placeholder="Paste your SCSS code here (both blocks accepted)..."
          value={scssText}
          onChange={(e) => {
            setScssText(e.target.value);
            setParsedTokens(null);
            setParseError(null);
            setFileName(null);
          }}
          aria-label="SCSS code input"
        />
      </div>

      {/* File upload drop zone */}
      <div
        role="button"
        tabIndex={0}
        className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-[#336E7B] bg-teal-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label="Upload SCSS file by dropping or clicking to browse"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".scss,.txt,.css"
          className="sr-only"
          onChange={handleFileChange}
          aria-label="Choose SCSS file to import"
          tabIndex={-1}
        />
        <Upload size={24} className="mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-600">
          Drop a <span className="font-medium">.scss</span>,{' '}
          <span className="font-medium">.txt</span>, or{' '}
          <span className="font-medium">.css</span> file here, or click to browse
        </p>
      </div>

      {/* Loaded filename indicator */}
      {fileName && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <FileText size={14} className="text-gray-400" />
          <span>
            Loaded: <span className="font-medium">{fileName}</span>
          </span>
        </div>
      )}

      {/* Parse button */}
      <button
        onClick={handleParse}
        disabled={!scssText.trim()}
        className="w-full px-4 py-2.5 text-sm font-semibold rounded-lg border-2 border-[#336E7B] text-[#336E7B] hover:bg-[#336E7B] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Parse SCSS code"
      >
        Parse SCSS
      </button>

      {/* Parse error */}
      {parseError && (
        <div
          className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700"
          role="alert"
        >
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{parseError}</span>
        </div>
      )}

      {/* Results preview */}
      {parsedTokens && tokenCount > 0 && (
        <div role="status" className="space-y-3">
          {/* Header */}
          <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
            <Check size={16} className="text-green-600" />
            <span>{tokenCount} setting{tokenCount !== 1 ? 's' : ''} detected</span>
          </div>

          {/* Grouped results */}
          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {groupedTokens.map(({ category, entries }) => (
              <div key={category}>
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  {category}
                </h5>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {entries.map(({ key, value }) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 text-xs text-gray-700 py-0.5"
                    >
                      {isHexColour(value) && (
                        <span
                          className="inline-block w-4 h-4 rounded border border-gray-300 flex-shrink-0"
                          style={{ backgroundColor: value as string }}
                          aria-hidden="true"
                        />
                      )}
                      <span className="truncate font-medium">{humanLabel(key)}</span>
                      <span className="text-gray-400 ml-auto font-mono text-[11px] flex-shrink-0">
                        {formatValue(key, value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Apply button */}
          <button
            onClick={handleApply}
            className="w-full px-4 py-3 text-sm font-bold rounded-lg text-white transition-colors hover:opacity-90"
            style={{ backgroundColor: '#F27927' }}
            aria-label={`Apply ${tokenCount} settings to preview`}
          >
            Apply {tokenCount} Setting{tokenCount !== 1 ? 's' : ''}
          </button>
        </div>
      )}
    </div>
  );
}
