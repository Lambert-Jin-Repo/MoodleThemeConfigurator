'use client';

import { useMemo, useCallback } from 'react';
import { useThemeStore } from '@/store/theme-store';
import { tokenToCssVar } from '@/lib/tokens';
import type { ThemeTokens, PreviewPage } from '@/lib/tokens';
import MoodleNavbar from './MoodleNavbar';
import MoodleFooter from './MoodleFooter';
import MoodleBreadcrumb from './MoodleBreadcrumb';
import DashboardPage from './DashboardPage';
import CoursePage from './CoursePage';
import LoginPage from './LoginPage';

// Token keys that hold large base64 data — skip from CSS vars
const IMAGE_TOKEN_KEYS = new Set(['backgroundImage', 'loginBgImage']);

// Maps control section IDs to CSS selectors for preview highlighting
const SECTION_HIGHLIGHT_MAP: Record<string, string> = {
  'navbar': '.moodle-preview nav',
  'edit-mode-toggle': '.moodle-preview .edit-mode-area',
  'links-&-focus': '.moodle-preview .moodle-link',
  'buttons': '.moodle-preview .moodle-btn-primary, .moodle-preview .moodle-btn-secondary',
  'content-area': '.moodle-preview .moodle-card, .moodle-preview .moodle-breadcrumb',
  'background-images': '.moodle-preview',
  'login-page': '.moodle-preview .login-area',
  'footer': '.moodle-preview footer',
  'typography': '.moodle-preview .highlight-text',
  'drawers': '.moodle-preview .moodle-drawer',
  'alerts-&-progress': '.moodle-preview .moodle-alert',
  'brand-colour': '.moodle-preview nav, .moodle-preview .moodle-btn-primary, .moodle-preview .moodle-link',
};

// Sections whose background should flash (solid coloured areas)
const BG_FLASH_SECTIONS = new Set([
  'navbar', 'edit-mode-toggle', 'footer', 'login-page', 'drawers',
  'background-images', 'brand-colour',
]);

// Sections whose content should get a text colour flash
const TEXT_FLASH_SECTIONS = new Set(['typography', 'links-&-focus']);

function buildHighlightStyles(section: string | null): string {
  if (!section || !SECTION_HIGHLIGHT_MAP[section]) return '';
  const selector = SECTION_HIGHLIGHT_MAP[section];

  // Shared keyframes for 3-cycle breathing glow (box-shadow based — works cross-browser)
  const sharedKeyframes = `
    @keyframes cfa-glow-pulse {
      0%   { box-shadow: 0 0 0 3px rgba(242, 121, 39, 0.2); }
      50%  { box-shadow: 0 0 8px 4px rgba(242, 121, 39, 0.5); }
      100% { box-shadow: 0 0 0 3px rgba(242, 121, 39, 0.2); }
    }
  `;

  // Base styles: persistent outline + 3-cycle glow pulse
  const base = `
    ${selector} {
      position: relative;
      z-index: 2;
      border-radius: 4px;
      outline: 2px solid rgba(242, 121, 39, 0.5) !important;
      outline-offset: 3px !important;
    }
  `;

  if (BG_FLASH_SECTIONS.has(section)) {
    // ::after overlay flash + glow pulse on the element itself via a wrapper approach
    return sharedKeyframes + base + `
      ${selector} {
        overflow: hidden;
        animation: cfa-glow-pulse 700ms ease-in-out 3;
      }
      ${selector}::after {
        content: '';
        position: absolute;
        inset: 0;
        background-color: #F27927;
        pointer-events: none;
        border-radius: inherit;
        z-index: 10;
        animation: cfa-bg-flash 600ms ease-out forwards;
      }
      @keyframes cfa-bg-flash {
        0%   { opacity: 0.45; }
        40%  { opacity: 0.2; }
        100% { opacity: 0; }
      }
    `;
  }

  if (TEXT_FLASH_SECTIONS.has(section)) {
    // Text flashes orange then back, combined with glow pulse
    return sharedKeyframes + base + `
      ${selector} {
        animation: cfa-text-flash 600ms ease-out forwards, cfa-glow-pulse 700ms ease-in-out 3;
      }
      @keyframes cfa-text-flash {
        0%   { color: #F27927 !important; }
        30%  { color: #F27927 !important; }
        100% { color: inherit; }
      }
    `;
  }

  // Default: 3-cycle scale pop + glow for buttons, cards, alerts, etc.
  return sharedKeyframes + base + `
    ${selector} {
      animation: cfa-element-pulse 700ms ease-in-out 3;
    }
    @keyframes cfa-element-pulse {
      0%   { box-shadow: 0 0 0 3px rgba(242, 121, 39, 0.2);  transform: scale(1); }
      50%  { box-shadow: 0 0 8px 4px rgba(242, 121, 39, 0.45); transform: scale(1.02); }
      100% { box-shadow: 0 0 0 3px rgba(242, 121, 39, 0.2);  transform: scale(1); }
    }
  `;
}

export default function MoodleShell() {
  const tokens = useThemeStore((s) => s.tokens);
  const activePage = useThemeStore((s) => s.activePage);
  const activeControlSection = useThemeStore((s) => s.activeControlSection);
  const setActiveControlSection = useThemeStore((s) => s.setActiveControlSection);
  const requestScrollToSection = useThemeStore((s) => s.requestScrollToSection);
  const setMobileTab = useThemeStore((s) => s.setMobileTab);

  const cssVars = useMemo(() => {
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(tokens)) {
      if (IMAGE_TOKEN_KEYS.has(key)) continue;
      vars[tokenToCssVar(key)] = String(value);
    }
    return vars;
  }, [tokens]);

  const hoverStyles = useMemo(() => buildHoverStyles(tokens), [tokens]);
  const highlightStyles = useMemo(() => buildHighlightStyles(activeControlSection), [activeControlSection]);
  const bgImageStyles = useMemo(() => buildBackgroundImageStyles(tokens, activePage), [tokens, activePage]);

  // Click-to-edit: click any [data-section] element → scroll controls to that section
  const handlePreviewClick = useCallback((e: React.MouseEvent) => {
    const target = (e.target as HTMLElement).closest('[data-section]');
    if (!target) return;
    const sectionId = target.getAttribute('data-section');
    if (!sectionId) return;
    setActiveControlSection(sectionId);
    requestScrollToSection(sectionId);
    setMobileTab('controls');
  }, [setActiveControlSection, requestScrollToSection, setMobileTab]);

  const clickToEditStyles = `
    .moodle-preview [data-section] {
      cursor: pointer;
      transition: outline 0.15s ease;
    }
    .moodle-preview [data-section]:hover {
      outline: 2px dashed rgba(242, 121, 39, 0.4);
      outline-offset: 2px;
    }
  `;

  return (
    <div className="moodle-preview" style={{ ...cssVars, backgroundColor: 'var(--cfa-page-bg)' }} onClick={handlePreviewClick}>
      <style dangerouslySetInnerHTML={{ __html: hoverStyles + highlightStyles + bgImageStyles + clickToEditStyles }} />
      {activePage === 'login' ? (
        <LoginPage />
      ) : (
        <>
          <MoodleNavbar />
          <MoodleBreadcrumb />
          <main
            className="min-h-[400px]"
            style={{ backgroundColor: 'var(--cfa-page-bg)' }}
          >
            {activePage === 'dashboard' && <DashboardPage />}
            {activePage === 'course' && <CoursePage />}
          </main>
          <MoodleFooter />
        </>
      )}
    </div>
  );
}

function buildHoverStyles(tokens: ThemeTokens): string {
  return `
    .moodle-preview {
      font-family: var(--cfa-font-family);
      font-size: calc(var(--cfa-body-font-size) * 1rem);
      font-weight: var(--cfa-font-weight);
      line-height: var(--cfa-line-height);
    }
    .moodle-preview h1,
    .moodle-preview h2,
    .moodle-preview h3,
    .moodle-preview h4 {
      font-family: var(--cfa-font-family);
      font-weight: 700;
    }
    .moodle-preview .moodle-link {
      color: var(--cfa-link-colour);
      text-decoration: underline;
      cursor: pointer;
      transition: color 0.15s;
    }
    .moodle-preview .moodle-link:hover {
      color: var(--cfa-link-hover);
    }
    .moodle-preview .moodle-btn-primary {
      background-color: var(--cfa-btn-primary-bg);
      color: var(--cfa-btn-primary-text);
      border: none;
      padding: 6px 16px;
      border-radius: ${tokens.btnRadius}px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: background-color 0.15s;
    }
    .moodle-preview .moodle-btn-primary:hover {
      background-color: var(--cfa-btn-primary-hover);
    }
    .moodle-preview .moodle-btn-secondary {
      background-color: var(--cfa-card-bg);
      color: var(--cfa-body-text);
      border: 1px solid var(--cfa-card-border);
      padding: 6px 16px;
      border-radius: ${tokens.btnRadius}px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: background-color 0.15s, border-color 0.15s;
    }
    .moodle-preview .moodle-btn-secondary:hover {
      background-color: rgba(128,128,128,0.2);
      border-color: rgba(128,128,128,0.4);
    }
    .moodle-preview .moodle-nav-link {
      color: var(--cfa-navbar-text);
      cursor: pointer;
      padding: 6px 12px;
      border-radius: 4px;
      transition: background-color 0.15s;
    }
    .moodle-preview .moodle-nav-link:hover {
      background-color: ${tokens.navHoverBg};
      color: ${tokens.navHoverText};
    }
    .moodle-preview .moodle-card {
      background: var(--cfa-card-bg);
      border: 1px solid var(--cfa-card-border);
      border-radius: 6px;
      transition: box-shadow 0.15s;
      cursor: pointer;
    }
    .moodle-preview .moodle-card:hover {
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    .moodle-preview .moodle-footer-link {
      color: var(--cfa-footer-link);
      text-decoration: underline;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .moodle-preview .moodle-footer-link:hover {
      opacity: 0.8;
    }
    .moodle-preview .moodle-tab {
      cursor: pointer;
      padding: 8px 16px;
      border-bottom: 3px solid transparent;
      color: var(--cfa-secondary-nav-text);
      transition: border-color 0.15s, color 0.15s;
    }
    .moodle-preview .moodle-tab:hover {
      border-bottom-color: var(--cfa-secondary-nav-active);
      color: var(--cfa-secondary-nav-active);
    }
    .moodle-preview .moodle-tab.active {
      border-bottom-color: var(--cfa-secondary-nav-active);
      color: var(--cfa-secondary-nav-active);
      font-weight: 600;
    }
    .moodle-preview .moodle-drawer-item {
      padding: 8px 12px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.15s;
    }
    .moodle-preview .moodle-drawer-item:hover {
      background-color: rgba(0,0,0,0.05);
    }
    .moodle-preview .moodle-activity-row {
      padding: 8px 0;
      cursor: pointer;
      transition: background-color 0.15s;
    }
    .moodle-preview .moodle-activity-row:hover {
      background-color: rgba(0,0,0,0.03);
    }
    .moodle-preview .moodle-input {
      border: 1px solid var(--cfa-card-border);
      border-radius: ${tokens.loginInputRadius}px;
      padding: 6px 12px;
      outline: none;
      color: var(--cfa-body-text);
      background-color: var(--cfa-card-bg);
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .moodle-preview .moodle-input:focus {
      border-color: var(--cfa-focus-ring);
      box-shadow: 0 0 0 var(--cfa-focus-ring-width) rgba(51,110,123,0.25);
    }
    .moodle-preview .moodle-icon-btn {
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: background-color 0.15s;
    }
    .moodle-preview .moodle-icon-btn:hover {
      background-color: ${tokens.navHoverBg};
    }
    .moodle-preview .moodle-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.3);
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .moodle-preview .moodle-avatar:hover {
      opacity: 0.8;
    }
  `;
}

function buildBackgroundImageStyles(tokens: ThemeTokens, activePage: PreviewPage): string {
  if (activePage === 'login' || !tokens.backgroundImage) return '';
  return `
    .moodle-preview {
      background-image: url('${tokens.backgroundImage}');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
    }
  `;
}
