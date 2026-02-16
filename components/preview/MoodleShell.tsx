'use client';

import { useMemo } from 'react';
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
  'buttons': '.moodle-preview .moodle-btn-primary, .moodle-preview .moodle-btn-outline',
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

  // Common: subtle persistent outline after flash settles
  const persistentOutline = `
    ${selector} {
      outline: 2px solid rgba(242, 121, 39, 0.5) !important;
      outline-offset: 3px !important;
      border-radius: 4px;
      position: relative;
      z-index: 2;
      transition: outline-color 0.3s ease;
    }
  `;

  if (BG_FLASH_SECTIONS.has(section)) {
    // Background flash via ::after overlay that fades from opaque orange to transparent
    return persistentOutline + `
      ${selector} {
        overflow: hidden;
      }
      ${selector}::after {
        content: '';
        position: absolute;
        inset: 0;
        background-color: #F27927;
        pointer-events: none;
        border-radius: inherit;
        z-index: 10;
        animation: cfa-bg-flash 800ms ease-out forwards;
      }
      @keyframes cfa-bg-flash {
        0%   { opacity: 0.55; }
        20%  { opacity: 0.45; }
        50%  { opacity: 0.2; }
        100% { opacity: 0; }
      }
    `;
  }

  if (TEXT_FLASH_SECTIONS.has(section)) {
    // Text colour flash: briefly turns orange then back
    return persistentOutline + `
      ${selector} {
        animation: cfa-text-flash 800ms ease-out forwards;
      }
      @keyframes cfa-text-flash {
        0%   { color: #F27927 !important; }
        25%  { color: #F27927 !important; }
        100% { color: inherit; }
      }
    `;
  }

  // Default: scale pop + overlay flash for buttons, cards, alerts, etc.
  return persistentOutline + `
    ${selector} {
      animation: cfa-element-flash 800ms ease-out forwards;
      box-shadow: 0 0 0 4px rgba(242, 121, 39, 0.3);
    }
    @keyframes cfa-element-flash {
      0%   {
        box-shadow: 0 0 0 6px rgba(242, 121, 39, 0.5);
        transform: scale(1.03);
      }
      30%  {
        box-shadow: 0 0 0 8px rgba(242, 121, 39, 0.35);
        transform: scale(1.01);
      }
      60%  {
        box-shadow: 0 0 0 4px rgba(242, 121, 39, 0.15);
        transform: scale(0.998);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(242, 121, 39, 0);
        transform: scale(1);
      }
    }
  `;
}

export default function MoodleShell() {
  const tokens = useThemeStore((s) => s.tokens);
  const activePage = useThemeStore((s) => s.activePage);
  const activeControlSection = useThemeStore((s) => s.activeControlSection);

  const cssVars = useMemo(() => {
    const vars: Record<string, string> = {};
    for (const [key, value] of Object.entries(tokens)) {
      if (IMAGE_TOKEN_KEYS.has(key)) continue; // skip large base64 from inline styles
      vars[tokenToCssVar(key)] = String(value);
    }
    return vars;
  }, [tokens]);

  const hoverStyles = useMemo(() => buildHoverStyles(tokens), [tokens]);
  const highlightStyles = useMemo(() => buildHighlightStyles(activeControlSection), [activeControlSection]);
  const bgImageStyles = useMemo(() => buildBackgroundImageStyles(tokens, activePage), [tokens, activePage]);

  return (
    <div className="moodle-preview" style={cssVars}>
      <style dangerouslySetInnerHTML={{ __html: hoverStyles + highlightStyles + bgImageStyles }} />
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
    .moodle-preview .moodle-btn-outline {
      background-color: transparent;
      color: var(--cfa-btn-primary-bg);
      border: 1px solid var(--cfa-btn-primary-bg);
      padding: 6px 16px;
      border-radius: ${tokens.btnRadius}px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
      transition: background-color 0.15s, color 0.15s;
    }
    .moodle-preview .moodle-btn-outline:hover {
      background-color: var(--cfa-btn-primary-bg);
      color: var(--cfa-btn-primary-text);
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
      border: 1px solid #ced4da;
      border-radius: ${tokens.loginInputRadius}px;
      padding: 6px 12px;
      outline: none;
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
