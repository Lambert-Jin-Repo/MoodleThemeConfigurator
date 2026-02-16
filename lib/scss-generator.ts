// ── SCSS Generator — Complete Rewrite ──
// Generates all 3 output blocks for Moodle Cloud Boost theme

import { ThemeTokens, DEFAULT_TOKENS } from './tokens';

interface ScssOutput {
  brandColour: string;
  block1: string;
  block2: string;
}

export function generateScss(tokens: ThemeTokens): ScssOutput {
  const d = DEFAULT_TOKENS;

  // ── Block 0: Brand Colour ──
  const brandColour = tokens.brandPrimary;

  // ── Block 1: Raw Initial SCSS (variables) ──
  const vars: string[] = [];
  vars.push('// CFA Moodle Theme — Raw Initial SCSS');
  vars.push('// Paste into: Site admin → Appearance → Themes → Boost → Raw initial SCSS');
  vars.push('');

  if (tokens.brandPrimary !== d.brandPrimary) vars.push(`$primary: ${tokens.brandPrimary};`);
  if (tokens.linkColour !== d.linkColour) vars.push(`$link-color: ${tokens.linkColour};`);
  vars.push(`$body-bg: #FFFFFF;`);
  if (tokens.bodyFontSize !== d.bodyFontSize) vars.push(`$font-size-base: ${tokens.bodyFontSize}rem;`);
  if (tokens.lineHeight !== d.lineHeight) vars.push(`$line-height-base: ${tokens.lineHeight};`);
  if (tokens.success !== d.success) vars.push(`$success: ${tokens.success};`);
  if (tokens.warning !== d.warning) vars.push(`$warning: ${tokens.warning};`);
  if (tokens.error !== d.error) vars.push(`$danger: ${tokens.error};`);
  if (tokens.info !== d.info) vars.push(`$info: ${tokens.info};`);
  if (tokens.btnRadius !== d.btnRadius) vars.push(`$btn-border-radius: ${tokens.btnRadius}px;`);
  if (tokens.loginInputRadius !== d.loginInputRadius) vars.push(`$input-border-radius: ${tokens.loginInputRadius}px;`);
  if (tokens.fontFamily !== d.fontFamily) vars.push(`$font-family-sans-serif: ${tokens.fontFamily};`);

  const block1 = vars.join('\n');

  // ── Block 2: Raw SCSS (CSS rules) ──
  const rules: string[] = [];
  rules.push('// CFA Moodle Theme — Raw SCSS');
  rules.push('// Paste into: Site admin → Appearance → Themes → Boost → Raw SCSS');
  rules.push('');

  const NAV_TEXT = tokens.navbarText;
  const NAV_BG = tokens.navbarBg;

  // --- Navbar ---
  if (NAV_BG !== d.navbarBg || NAV_TEXT !== d.navbarText) {
    rules.push('// ── Navbar ──');
    rules.push(`.navbar { color: ${NAV_TEXT} !important; }`);
    rules.push(`.navbar .navbar-brand { color: ${NAV_TEXT} !important; }`);
    rules.push(`.navbar .btn-open-nav { color: ${NAV_TEXT} !important; }`);
    rules.push(`.navbar .fa, .navbar .icon, .navbar [class*="bi-"] { color: ${NAV_TEXT} !important; }`);

    if (NAV_BG !== d.navbarBg) {
      rules.push(`.navbar.fixed-top { background-color: ${NAV_BG} !important; }`);
    }
    if (tokens.navbarBorder !== 'none') {
      rules.push(`.navbar.fixed-top { border-bottom: 3px solid ${tokens.navbarBorder} !important; }`);
    }

    // Nav links
    rules.push(`.navbar .primary-navigation .nav-link { color: ${NAV_TEXT} !important; }`);

    // Edit mode
    rules.push(`.navbar .editmode-switch-form .form-check-label { color: ${NAV_TEXT} !important; }`);
    rules.push(`.navbar .editmode-switch-form .form-check-input {`);
    rules.push(`  background-color: rgba(255,255,255,0.3) !important;`);
    rules.push(`  border-color: rgba(255,255,255,0.5) !important;`);
    rules.push(`}`);
    rules.push(`.navbar .editmode-switch-form .form-check-input:checked {`);
    rules.push(`  background-color: ${tokens.editModeOnColour} !important;`);
    rules.push(`  border-color: ${tokens.editModeOnColour} !important;`);
    rules.push(`  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23${tokens.editModeThumbColour.replace('#', '')}'/%3e%3c/svg%3e") !important;`);
    rules.push(`}`);
    rules.push(`.navbar .editmode-switch-form .btn { color: ${NAV_TEXT} !important; }`);

    // User menu
    rules.push(`.navbar .usermenu .login, .navbar .usermenu .usertext,`);
    rules.push(`.navbar .usermenu .userbutton, .navbar .usermenu .btn { color: ${NAV_TEXT} !important; }`);
    rules.push(`.navbar .action-menu-trigger { color: ${NAV_TEXT} !important; }`);
    rules.push(`.navbar .popover-region .nav-link { color: ${NAV_TEXT} !important; }`);

    // Nav hover
    rules.push('');
    rules.push('// Nav hover overlay');
    rules.push(`.navbar .primary-navigation .nav-link:hover,`);
    rules.push(`.navbar .primary-navigation .nav-link:focus {`);
    rules.push(`  background-color: ${tokens.navHoverBg} !important;`);
    if (tokens.navHoverText !== NAV_TEXT) {
      rules.push(`  color: ${tokens.navHoverText} !important;`);
    }
    rules.push(`}`);

    // Active underline
    if (tokens.navActiveUnderline !== d.navActiveUnderline) {
      rules.push(`.navbar .primary-navigation .nav-link.active {`);
      rules.push(`  border-bottom: 2px solid ${tokens.navActiveUnderline};`);
      rules.push(`}`);
    }

    // Dropdown overrides (dark text on white)
    rules.push('');
    rules.push('// Dropdowns on white background');
    rules.push(`.navbar .dropdown-menu, .navbar .popover-region-container,`);
    rules.push(`.navbar .usermenu .dropdown-menu {`);
    rules.push(`  .dropdown-item, .nav-link, a { color: #404041 !important; }`);
    rules.push(`}`);
    rules.push('');
  } else {
    rules.push('/* Navbar section omitted — using Moodle default */');
    rules.push('');
  }

  // --- Links ---
  rules.push('// ── Links ──');
  rules.push(`a { text-decoration: underline; }`);
  if (tokens.linkColour !== d.linkColour) {
    rules.push(`a:hover { color: ${tokens.linkHover} !important; }`);
  }
  rules.push('');

  // --- Focus ---
  rules.push('// ── Focus Ring ──');
  rules.push(`*:focus {`);
  rules.push(`  outline: ${tokens.focusRingWidth}px solid ${tokens.focusRing} !important;`);
  rules.push(`  outline-offset: 2px;`);
  rules.push(`}`);
  rules.push('');

  // --- Buttons ---
  if (tokens.btnPrimaryBg !== d.btnPrimaryBg || tokens.btnPrimaryText !== d.btnPrimaryText) {
    rules.push('// ── Buttons ──');
    rules.push(`.btn-primary {`);
    rules.push(`  background-color: ${tokens.btnPrimaryBg} !important;`);
    rules.push(`  border-color: ${tokens.btnPrimaryBg} !important;`);
    rules.push(`  color: ${tokens.btnPrimaryText} !important;`);
    rules.push(`}`);
    rules.push(`.btn-primary:hover, .btn-primary:focus {`);
    rules.push(`  background-color: ${tokens.btnPrimaryHover} !important;`);
    rules.push(`  border-color: ${tokens.btnPrimaryHover} !important;`);
    rules.push(`}`);
    rules.push('');
  }

  // --- Footer ---
  if (tokens.footerBg !== d.footerBg || tokens.footerText !== d.footerText) {
    rules.push('// ── Footer ──');
    rules.push(`#page-footer {`);
    rules.push(`  background-color: ${tokens.footerBg} !important;`);
    rules.push(`  color: ${tokens.footerText} !important;`);
    rules.push(`}`);
    rules.push(`#page-footer a { color: ${tokens.footerLink} !important; }`);
    if (tokens.footerAccent !== 'none') {
      rules.push(`#page-footer { border-top: 4px solid ${tokens.footerAccent} !important; }`);
    }
    rules.push('');
  }

  // --- Login ---
  if (tokens.loginBg !== d.loginBg) {
    rules.push('// ── Login Page ──');
    if (tokens.loginGradientEnabled) {
      rules.push(`body#page-login-index {`);
      rules.push(`  background: linear-gradient(135deg, ${tokens.loginBg}, ${tokens.loginGradientEnd}) !important;`);
      rules.push(`}`);
    } else {
      rules.push(`body#page-login-index {`);
      rules.push(`  background-color: ${tokens.loginBg} !important;`);
      rules.push(`}`);
    }
    if (tokens.loginBtnBg !== d.loginBtnBg) {
      rules.push(`#loginbtn {`);
      rules.push(`  background-color: ${tokens.loginBtnBg} !important;`);
      rules.push(`  border-color: ${tokens.loginBtnBg} !important;`);
      rules.push(`  color: ${tokens.loginBtnText} !important;`);
      rules.push(`}`);
    }
    rules.push('');
  }

  // --- Breadcrumb ---
  if (tokens.breadcrumbBg !== 'transparent' && tokens.breadcrumbBg !== d.breadcrumbBg) {
    rules.push('// ── Breadcrumb ──');
    rules.push(`.breadcrumb { background-color: ${tokens.breadcrumbBg} !important; }`);
    rules.push('');
  }

  // --- Section Accent ---
  if (tokens.sectionAccent !== 'none') {
    rules.push('// ── Section Accent ──');
    rules.push(`.course-section h3 { border-bottom: 2px solid ${tokens.sectionAccent}; padding-bottom: 4px; }`);
    rules.push('');
  }

  // --- Secondary Nav ---
  if (tokens.secondaryNavActive !== d.secondaryNavActive) {
    rules.push('// ── Secondary Navigation ──');
    rules.push(`.secondary-navigation .nav-tabs .nav-link.active {`);
    rules.push(`  border-bottom-color: ${tokens.secondaryNavActive} !important;`);
    rules.push(`  color: ${tokens.secondaryNavActive} !important;`);
    rules.push(`}`);
    rules.push('');
  }

  // --- Drawers ---
  if (tokens.drawerBg !== d.drawerBg) {
    rules.push('// ── Drawers ──');
    rules.push(`[data-region="right-hand-drawer"], .drawer {`);
    rules.push(`  background-color: ${tokens.drawerBg} !important;`);
    rules.push(`  border-color: ${tokens.drawerBorder} !important;`);
    rules.push(`}`);
    rules.push('');
  }

  // --- Typography ---
  if (tokens.headingText !== d.headingText) {
    rules.push('// ── Typography ──');
    rules.push(`h1, h2, h3, h4, h5, h6 { color: ${tokens.headingText} !important; }`);
    rules.push('');
  }
  if (tokens.bodyText !== d.bodyText) {
    rules.push(`body { color: ${tokens.bodyText} !important; }`);
  }

  // --- Background Images ---
  if (tokens.backgroundImage) {
    rules.push('// ── Background Image ──');
    rules.push('// Upload your background image at:');
    rules.push('// Site admin → Appearance → Themes → Boost → Background image');
    rules.push('// Moodle will apply: background-size: cover (desktop only, 768px+)');
    rules.push('');
  }
  if (tokens.loginBgImage) {
    rules.push('// ── Login Background Image ──');
    rules.push('// Upload your login background image at:');
    rules.push('// Site admin → Appearance → Themes → Boost → Login background image');
    rules.push('// Moodle will apply: background-size: cover on body.pagelayout-login #page');
    rules.push('');
  }

  // --- Card borders ---
  if (tokens.cardBorder !== d.cardBorder) {
    rules.push('// ── Cards ──');
    rules.push(`.card { border-color: ${tokens.cardBorder} !important; }`);
    rules.push('');
  }

  const block2 = rules.join('\n');

  return { brandColour, block1, block2 };
}
