// ── SCSS Generator ──
// Generates all 3 output blocks for Moodle Cloud Boost theme
// Verified against Moodle 5.0+ / Bootstrap 5.3

import { ThemeTokens, DEFAULT_TOKENS } from './tokens';

interface ScssOutput {
  brandColour: string;
  block1: string;
  block2: string;
}

// Detect dark page background via relative luminance
function isDarkBg(hex: string): boolean {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = ((num >> 16) & 0xff) / 255;
  const g = ((num >> 8) & 0xff) / 255;
  const b = (num & 0xff) / 255;
  const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const lum = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return lum < 0.179;
}

// Auto-select readable text colour for a given background
function autoTextForHex(bgHex: string): string {
  return isDarkBg(bgHex) ? '#FFFFFF' : '#404041';
}

export function generateScss(tokens: ThemeTokens): ScssOutput {
  const d = DEFAULT_TOKENS;
  const darkMode = isDarkBg(tokens.pageBg);

  // ── Block 0: Brand Colour ──
  const brandColour = tokens.brandPrimary;

  // ── Block 1: Raw Initial SCSS (variables) ──
  const vars: string[] = [];
  vars.push('// CFA Moodle Theme — Raw Initial SCSS');
  vars.push('// Paste into: Site admin → Appearance → Themes → Boost → Raw initial SCSS');
  vars.push('');

  if (tokens.brandPrimary !== d.brandPrimary) vars.push(`$primary: ${tokens.brandPrimary};`);
  if (tokens.secondaryColour !== d.secondaryColour) vars.push(`$secondary: ${tokens.secondaryColour};`);
  if (tokens.linkColour !== d.linkColour) vars.push(`$link-color: ${tokens.linkColour};`);
  if (tokens.pageBg !== d.pageBg) vars.push(`$body-bg: ${tokens.pageBg};`);
  if (tokens.bodyText !== d.bodyText) vars.push(`$body-color: ${tokens.bodyText};`);
  if (tokens.cardBg !== d.cardBg) vars.push(`$card-bg: ${tokens.cardBg};`);
  if (tokens.bodyFontSize !== d.bodyFontSize) vars.push(`$font-size-base: ${tokens.bodyFontSize}rem;`);
  if (tokens.lineHeight !== d.lineHeight) vars.push(`$line-height-base: ${tokens.lineHeight};`);
  if (tokens.fontFamily !== d.fontFamily) vars.push(`$font-family-sans-serif: ${tokens.fontFamily};`);
  if (tokens.fontWeight !== d.fontWeight) vars.push(`$font-weight-base: ${tokens.fontWeight};`);
  if (tokens.headingsFontWeight !== d.headingsFontWeight) vars.push(`$headings-font-weight: ${tokens.headingsFontWeight};`);
  if (tokens.headingText !== d.headingText) vars.push(`$headings-color: ${tokens.headingText};`);
  if (tokens.success !== d.success) vars.push(`$success: ${tokens.success};`);
  if (tokens.warning !== d.warning) vars.push(`$warning: ${tokens.warning};`);
  if (tokens.error !== d.error) vars.push(`$danger: ${tokens.error};`);
  if (tokens.info !== d.info) vars.push(`$info: ${tokens.info};`);

  // Border radius — use rem units to scale with font size
  if (tokens.borderRadius !== d.borderRadius) {
    vars.push(`$border-radius: ${(tokens.borderRadius / 16).toFixed(4)}rem;`);
  }
  if (tokens.btnRadius !== d.btnRadius && tokens.btnRadius !== tokens.borderRadius) {
    vars.push(`$btn-border-radius: ${(tokens.btnRadius / 16).toFixed(4)}rem;`);
  }
  if (tokens.loginInputRadius !== d.loginInputRadius && tokens.loginInputRadius !== tokens.borderRadius) {
    vars.push(`$input-border-radius: ${(tokens.loginInputRadius / 16).toFixed(4)}rem;`);
  }

  // Heading sizes — use Bootstrap's discrete multipliers
  if (tokens.headingScale !== d.headingScale) {
    const base = tokens.bodyFontSize || 0.9375;
    // Bootstrap 5 multipliers: h1=2.5, h2=2.0, h3=1.75, h4=1.5
    // Scale factor adjusts these proportionally
    const scaleFactor = tokens.headingScale / d.headingScale;
    vars.push(`$h1-font-size: ${(base * 2.5 * scaleFactor).toFixed(4)}rem;`);
    vars.push(`$h2-font-size: ${(base * 2.0 * scaleFactor).toFixed(4)}rem;`);
    vars.push(`$h3-font-size: ${(base * 1.75 * scaleFactor).toFixed(4)}rem;`);
    vars.push(`$h4-font-size: ${(base * 1.5 * scaleFactor).toFixed(4)}rem;`);
  }

  // Progress bar fill — only emit when different from $primary
  if (tokens.progressFill !== tokens.brandPrimary) {
    vars.push(`$progress-bar-bg: ${tokens.progressFill};`);
  }

  // Activity icon colours (Moodle 5.0+ individual $activity-icon-*-bg variables)
  const iconChanged = tokens.actIconAdmin !== d.actIconAdmin
    || tokens.actIconAssessment !== d.actIconAssessment
    || tokens.actIconCollaboration !== d.actIconCollaboration
    || tokens.actIconCommunication !== d.actIconCommunication
    || tokens.actIconContent !== d.actIconContent
    || tokens.actIconInteractiveContent !== d.actIconInteractiveContent
    || tokens.actIconInterface !== d.actIconInterface;
  if (iconChanged) {
    vars.push('');
    vars.push('// Activity icon background colours');
    if (tokens.actIconAdmin !== d.actIconAdmin) vars.push(`$activity-icon-administration-bg: ${tokens.actIconAdmin};`);
    if (tokens.actIconAssessment !== d.actIconAssessment) vars.push(`$activity-icon-assessment-bg: ${tokens.actIconAssessment};`);
    if (tokens.actIconCollaboration !== d.actIconCollaboration) vars.push(`$activity-icon-collaboration-bg: ${tokens.actIconCollaboration};`);
    if (tokens.actIconCommunication !== d.actIconCommunication) vars.push(`$activity-icon-communication-bg: ${tokens.actIconCommunication};`);
    if (tokens.actIconContent !== d.actIconContent) vars.push(`$activity-icon-content-bg: ${tokens.actIconContent};`);
    if (tokens.actIconInteractiveContent !== d.actIconInteractiveContent) vars.push(`$activity-icon-interactivecontent-bg: ${tokens.actIconInteractiveContent};`);
    if (tokens.actIconInterface !== d.actIconInterface) vars.push(`$activity-icon-interface-bg: ${tokens.actIconInterface};`);
  }

  // Dark theme: Bootstrap form control variables
  if (darkMode) {
    vars.push('');
    vars.push('// Dark theme form control variables');
    vars.push(`$input-color: ${tokens.bodyText};`);
    vars.push(`$input-bg: ${tokens.cardBg};`);
    vars.push(`$input-border-color: ${tokens.cardBorder};`);
    vars.push(`$table-color: ${tokens.bodyText};`);
    vars.push(`$dropdown-bg: ${tokens.cardBg};`);
    vars.push(`$dropdown-color: ${tokens.bodyText};`);
    vars.push(`$dropdown-link-color: ${tokens.bodyText};`);
    vars.push(`$dropdown-border-color: ${tokens.cardBorder};`);
  }

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
    rules.push(`.navbar .primary-navigation .nav-link:focus-visible {`);
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

    // Dropdown overrides
    rules.push('');
    if (darkMode) {
      rules.push('// Navbar dropdowns on dark theme');
      rules.push(`.navbar .dropdown-menu, .navbar .popover-region-container,`);
      rules.push(`.navbar .usermenu .dropdown-menu {`);
      rules.push(`  background-color: ${tokens.cardBg} !important;`);
      rules.push(`  border-color: ${tokens.cardBorder} !important;`);
      rules.push(`  .dropdown-item, .nav-link, a { color: ${tokens.bodyText} !important; }`);
      rules.push(`}`);
    } else {
      rules.push('// Dropdowns on white background');
      rules.push(`.navbar .dropdown-menu, .navbar .popover-region-container,`);
      rules.push(`.navbar .usermenu .dropdown-menu {`);
      rules.push(`  .dropdown-item, .nav-link, a { color: ${d.bodyText} !important; }`);
      rules.push(`}`);
    }
    rules.push('');
  } else {
    rules.push('/* Navbar section omitted — using Moodle default */');
    rules.push('');
  }

  // --- Links (conditional — only emit underline if changed from default) ---
  if (tokens.linkColour !== d.linkColour) {
    rules.push('// ── Links ──');
    rules.push(`a:hover { color: ${tokens.linkHover} !important; }`);
    rules.push('');
  }

  // --- Focus (use :focus-visible for modern keyboard-only focus) ---
  if (tokens.focusRing !== d.focusRing || tokens.focusRingWidth !== d.focusRingWidth) {
    rules.push('// ── Focus Ring ──');
    rules.push(`*:focus-visible {`);
    rules.push(`  outline: ${tokens.focusRingWidth}px solid ${tokens.focusRing} !important;`);
    rules.push(`  outline-offset: 2px;`);
    rules.push(`}`);
    rules.push('');
  }

  // --- Buttons ---
  if (tokens.btnPrimaryBg !== d.btnPrimaryBg || tokens.btnPrimaryText !== d.btnPrimaryText) {
    rules.push('// ── Buttons ──');
    rules.push(`.btn-primary {`);
    rules.push(`  background-color: ${tokens.btnPrimaryBg} !important;`);
    rules.push(`  border-color: ${tokens.btnPrimaryBg} !important;`);
    rules.push(`  color: ${tokens.btnPrimaryText} !important;`);
    rules.push(`}`);
    rules.push(`.btn-primary:hover, .btn-primary:focus-visible {`);
    rules.push(`  background-color: ${tokens.btnPrimaryHover} !important;`);
    rules.push(`  border-color: ${tokens.btnPrimaryHover} !important;`);
    rules.push(`}`);
    // Button-styled links — <a class="btn btn-primary"> (e.g. a custom "Create new
    // account" link dropped into the login instructions) — must keep the button text
    // colour on hover/focus. The global `a:hover, a:focus { color: linkHover }` (0,1,1)
    // otherwise overrides the base `.btn-primary { color }` (0,1,0), so the text turns
    // the link-hover colour and VANISHES on the same-hued button. This (0,2,1) rule
    // beats the global one and only targets links that are buttons (real <button>s are
    // unaffected — they're not `a`). The `.btn-primary:hover` bg change above still
    // provides the visible hover effect.
    rules.push(`a.btn-primary:hover, a.btn-primary:focus {`);
    rules.push(`  color: ${tokens.btnPrimaryText} !important;`);
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
  if (tokens.loginBg !== d.loginBg || tokens.loginBtnBg !== d.loginBtnBg || tokens.signupBtnBg !== d.signupBtnBg || tokens.loginHeading !== d.loginHeading) {
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
    if (tokens.loginCardBg !== d.loginCardBg) {
      rules.push(`body#page-login-index .card, body#page-login-index .login-container {`);
      rules.push(`  background-color: ${tokens.loginCardBg} !important;`);
      rules.push(`}`);
    }
    if (tokens.loginBtnBg !== d.loginBtnBg) {
      rules.push(`#loginbtn {`);
      rules.push(`  background-color: ${tokens.loginBtnBg} !important;`);
      rules.push(`  border-color: ${tokens.loginBtnBg} !important;`);
      rules.push(`  color: ${tokens.loginBtnText} !important;`);
      rules.push(`}`);
    }
    if (tokens.loginHeading !== d.loginHeading) {
      rules.push(`body#page-login-index .login-heading { color: ${tokens.loginHeading} !important; }`);
    }
    // Dark login background with light card: ensure card text stays readable
    if (isDarkBg(tokens.loginBg) && !isDarkBg(tokens.loginCardBg)) {
      rules.push(`body#page-login-index .card,`);
      rules.push(`body#page-login-index label,`);
      rules.push(`body#page-login-index .login-form-forgotpassword a,`);
      rules.push(`body#page-login-index .login-signup a {`);
      rules.push(`  color: ${d.bodyText} !important;`);
      rules.push(`}`);
    }
    if (tokens.signupBtnBg !== d.signupBtnBg) {
      rules.push(`body#page-login-index .login-signup .btn,`);
      rules.push(`body#page-login-index .btn-secondary {`);
      rules.push(`  background-color: ${tokens.signupBtnBg} !important;`);
      rules.push(`  border-color: ${tokens.signupBtnBg} !important;`);
      rules.push(`}`);
    }
    rules.push('');
  }

  // --- Login page: hide Moodle's auto-rendered signup button (PERMANENT) ---
  // The CFA login page places a custom "Create new account" <a class="btn btn-primary
  // btn-lg"> at the top of the login Instructions field (Moodle config, Site admin →
  // Plugins → Authentication → Manage authentication → Instructions). Moodle ALSO
  // auto-renders its own "Create new account" button in `.login-signup` when self-
  // registration is on, which would duplicate it — so hide the auto one.
  // Emitted UNCONDITIONALLY (every preset/export) so the login-page layout is stable
  // across all themes. The custom button itself lives in Moodle's Instructions HTML,
  // which the generator can't emit — this rule is the SCSS half of that pairing.
  // DO NOT remove when working on other visual issues. See docs/PROJECT-TRACKER.md (#152).
  rules.push('// ── Login Page: hide duplicate signup button ──');
  rules.push('body#page-login-index .login-signup {');
  rules.push('  display: none !important;');
  rules.push('}');
  rules.push('');

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
  if (tokens.drawerBg !== d.drawerBg || tokens.drawerText !== d.drawerText || tokens.drawerBorder !== d.drawerBorder) {
    rules.push('// ── Drawers ──');
    rules.push(`[data-region="right-hand-drawer"], .drawer {`);
    rules.push(`  background-color: ${tokens.drawerBg} !important;`);
    rules.push(`  color: ${tokens.drawerText} !important;`);
    rules.push(`  border-color: ${tokens.drawerBorder} !important;`);
    rules.push(`}`);
    rules.push(`[data-region="right-hand-drawer"] a, .drawer a {`);
    rules.push(`  color: ${tokens.drawerText} !important;`);
    rules.push(`}`);
    if (tokens.drawerText !== d.drawerText) {
      rules.push(`[data-region="right-hand-drawer"] .icon, [data-region="right-hand-drawer"] .fa,`);
      rules.push(`.drawer .icon, .drawer .fa { color: ${tokens.drawerText} !important; }`);
    }
    rules.push('');
  }

  // --- Typography (heading color via $headings-color in Block 1, body color via $body-color) ---
  // Only emit CSS overrides for body text if needed beyond $body-color variable
  if (tokens.bodyText !== d.bodyText) {
    rules.push('// ── Icon Visibility Fix ──');
    rules.push('// Icons sit on light wrappers even on dark themes — keep them dark');
    rules.push(`.icon, .fa { color: ${d.bodyText} !important; }`);
    rules.push(`.breadcrumb .icon, .breadcrumb .fa { color: ${d.bodyText} !important; }`);
    rules.push(`.secondary-navigation .icon, .secondary-navigation .fa { color: ${d.bodyText} !important; }`);
    // Module prev/next nav — Moodle 5.0 uses .activity_navigation .btn-link
    // (.btn-previous/.btn-next are book-only; kept for Moodle 4.x compat)
    rules.push(`.activity_navigation .btn-link .icon, .activity_navigation .btn-link .fa,`);
    rules.push(`.btn-previous .icon, .btn-previous .fa,`);
    rules.push(`.btn-next .icon, .btn-next .fa { color: ${d.bodyText} !important; }`);
    rules.push('');

    // Icon hover — accent colour on hover
    rules.push('// ── Icon Hover ──');
    rules.push(`.ftoggler:hover .icon, .ftoggler:hover .fa,`);
    rules.push(`.collapsed-icon:hover .icon, .collapsed-icon:hover .fa { color: ${tokens.linkColour} !important; }`);
    rules.push(`.secondary-navigation .nav-link:hover .icon,`);
    rules.push(`.secondary-navigation .nav-link:hover .fa { color: ${tokens.linkColour} !important; }`);
    rules.push(`.breadcrumb a:hover .icon, .breadcrumb a:hover .fa { color: ${tokens.linkColour} !important; }`);
    rules.push(`.activity_navigation .btn-link:hover .icon, .activity_navigation .btn-link:hover .fa,`);
    rules.push(`.btn-previous:hover .icon, .btn-previous:hover .fa,`);
    rules.push(`.btn-next:hover .icon, .btn-next:hover .fa { color: ${tokens.linkColour} !important; }`);
    rules.push('');

    // Book chapter nav buttons — lime green bg + black chevron on dark theme
    rules.push('// ── Book Chapter Nav Buttons ──');
    rules.push(`.path-mod-book .btn-previous,`);
    rules.push(`.path-mod-book .btn-next {`);
    rules.push(`  background: ${tokens.infoIconColour} !important;`);
    rules.push(`  border-color: ${tokens.infoIconColour} !important;`);
    rules.push(`}`);
    // Chevron — cover FontAwesome <i> AND inline <svg> (Moodle 4.5+ ships SVG)
    rules.push(`.path-mod-book .btn-previous .icon, .path-mod-book .btn-previous .fa,`);
    rules.push(`.path-mod-book .btn-previous svg,`);
    rules.push(`.path-mod-book .btn-next .icon, .path-mod-book .btn-next .fa,`);
    rules.push(`.path-mod-book .btn-next svg {`);
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push(`  fill: ${d.bodyText} !important;`);
    rules.push(`}`);
    // Hover — white bg + black chevron
    rules.push(`.path-mod-book .btn-previous:hover,`);
    rules.push(`.path-mod-book .btn-next:hover {`);
    rules.push(`  background: #FFFFFF !important;`);
    rules.push(`  border-color: #FFFFFF !important;`);
    rules.push(`}`);
    rules.push(`.path-mod-book .btn-previous:hover .icon, .path-mod-book .btn-previous:hover .fa,`);
    rules.push(`.path-mod-book .btn-previous:hover svg,`);
    rules.push(`.path-mod-book .btn-next:hover .icon, .path-mod-book .btn-next:hover .fa,`);
    rules.push(`.path-mod-book .btn-next:hover svg {`);
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push(`  fill: ${d.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');
  }

  // --- Content Max Width ---
  if (tokens.contentMaxWidth !== d.contentMaxWidth) {
    rules.push('// ── Content Max Width ──');
    rules.push(`#region-main { max-width: ${tokens.contentMaxWidth}px; margin-left: auto; margin-right: auto; }`);
    rules.push('');
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

  // --- Cards ---
  if (tokens.cardBg !== d.cardBg || tokens.cardBorder !== d.cardBorder) {
    rules.push('// ── Cards ──');
    if (tokens.cardBg !== d.cardBg) {
      rules.push(`.card { background-color: ${tokens.cardBg} !important; }`);
    }
    if (tokens.cardBorder !== d.cardBorder) {
      rules.push(`.card { border-color: ${tokens.cardBorder} !important; }`);
    }
    rules.push('');
  }

  // --- Signup Button (standalone, outside login gate) ---
  if (tokens.signupBtnBg !== d.signupBtnBg) {
    rules.push('// ── Signup Button ──');
    rules.push(`body#page-login-index .login-signup .btn,`);
    rules.push(`body#page-login-index .btn-secondary {`);
    rules.push(`  background-color: ${tokens.signupBtnBg} !important;`);
    rules.push(`  border-color: ${tokens.signupBtnBg} !important;`);
    rules.push(`}`);
    rules.push('');
  }

  // --- Link Hover ---
  if (tokens.linkHover !== d.linkHover) {
    rules.push('// ── Link Hover ──');
    rules.push(`a:hover, a:focus { color: ${tokens.linkHover} !important; }`);
    rules.push('');
  }

  // --- Secondary Nav (non-dark) ---
  if (tokens.secondaryNavText !== d.secondaryNavText && !darkMode) {
    rules.push('// ── Secondary Navigation Text ──');
    rules.push(`.secondary-navigation .nav-tabs .nav-link {`);
    rules.push(`  color: ${tokens.secondaryNavText} !important;`);
    rules.push(`}`);
    rules.push('');
  }

  // --- Nav Hover Text ---
  if (tokens.navHoverText !== d.navHoverText && (NAV_BG === d.navbarBg && NAV_TEXT === d.navbarText)) {
    // Output nav hover text even when navbar section is otherwise default
    rules.push('// ── Nav Hover Text ──');
    rules.push(`.navbar .primary-navigation .nav-link:hover,`);
    rules.push(`.navbar .primary-navigation .nav-link:focus {`);
    rules.push(`  color: ${tokens.navHoverText} !important;`);
    rules.push(`}`);
    rules.push('');
  }

  // --- Dark Theme: comprehensive text & widget overrides ---
  if (darkMode) {
    rules.push('// ── Dark Theme Overrides ──');
    rules.push('// Auto-generated for dark page backgrounds');
    rules.push('');

    // Page wrapper containers.
    // Moodle Boost paints the "Background image" setting on `body` (desktop-only,
    // @media min-width:768px). In stock Boost these wrappers are transparent, so
    // painting them a solid pageBg would cover the image. When a background image
    // is set, keep the dark colour on `body` as a fallback (also covers mobile
    // <768px where Boost omits the image) and make the wrappers transparent so the
    // body image shows through. With NO image, keep the opaque wrappers — this is
    // the original behaviour that prevents white gaps.
    if (tokens.backgroundImage) {
      rules.push(`body { background-color: ${tokens.pageBg} !important; }`);
      rules.push('#page, #page-wrapper, #topofscroll, .main-inner,');
      rules.push('#region-main-box, .pagelayout-standard #page.drawers {');
      rules.push('  background-color: transparent !important;');
      rules.push('}');
    } else {
      rules.push('#page, #page-wrapper, #topofscroll, .main-inner,');
      rules.push('#region-main-box, .pagelayout-standard #page.drawers {');
      rules.push(`  background-color: ${tokens.pageBg} !important;`);
      rules.push('}');
    }
    rules.push('');

    // Secondary navigation background — transparent when a body image is set so
    // it shows through; otherwise the dark page colour.
    rules.push(`.secondary-navigation { background-color: ${tokens.backgroundImage ? 'transparent' : tokens.pageBg} !important; }`);
    rules.push('');

    // Breadcrumb area — keep a custom breadcrumbBg if set; otherwise transparent
    // when a body image is present (so it shows through), else the dark page colour.
    const breadcrumbDarkBg = tokens.breadcrumbBg !== 'transparent'
      ? tokens.breadcrumbBg
      : (tokens.backgroundImage ? 'transparent' : tokens.pageBg);
    rules.push(`.breadcrumb { background-color: ${breadcrumbDarkBg} !important; }`);
    rules.push('');

    // Card background + text colour — critical for readability
    rules.push(`.card, .card-body, .card-title, .card-text, .card-footer {`);
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Moodle block containers (dashboard blocks, calendar, timeline, trial banner)
    rules.push(`.block, .block_timeline, .block_recentlyaccessedcourses,`);
    rules.push(`.block_myoverview, .block_calendar_month {`);
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Icons inside cards — override global dark icon colour for dark card backgrounds
    rules.push(`.card .icon, .card .fa, .card [class*="fa-"],`);
    rules.push(`.dashboard-card .icon, .dashboard-card .fa,`);
    rules.push(`.block_myoverview .card .icon, .block_myoverview .card .fa {`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Activity row icons (FontAwesome) — completion indicators, etc.
    rules.push(`.course-content .fa, .course-content [class*="fa-"],`);
    rules.push(`.activity-item .fa, .activity-item [class*="fa-"],`);
    rules.push(`.section .fa {`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Group mode icon — rendered as <img class="icon"> not FontAwesome,
    // so needs filter:invert to flip dark SVG to light on dark backgrounds
    rules.push(`.activity-groupmode-info img.icon,`);
    rules.push(`.groupmode-information img.icon,`);
    rules.push(`[data-region="groupmode"] img.icon,`);
    rules.push(`[data-region="groupmode-information"] img.icon {`);
    rules.push(`  filter: invert(1) !important;`);
    rules.push(`}`);
    rules.push('');

    // Completion icons — light-bg buttons inside course content, force dark icon
    rules.push(`.btn-subtle-success .fa, .btn-subtle-success .icon,`);
    rules.push(`.btn-subtle-warning .fa, .btn-subtle-warning .icon,`);
    rules.push(`.btn-subtle-info .fa, .btn-subtle-info .icon {`);
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Bootstrap text-utility icons — restore semantic colours that the generic
    // .icon/.fa dark override clobbers. Uses token values so colours stay dynamic.
    rules.push('// Semantic icon colours — override generic .icon/.fa dark rule');
    rules.push(`.icon.text-info, .fa.text-info {`);
    rules.push(`  color: ${tokens.infoIconColour} !important;`);
    rules.push(`}`);
    rules.push(`.icon.text-danger, .fa.text-danger {`);
    rules.push(`  color: ${tokens.error} !important;`);
    rules.push(`}`);
    rules.push(`.icon.text-warning, .fa.text-warning {`);
    rules.push(`  color: ${tokens.warning} !important;`);
    rules.push(`}`);
    rules.push(`.icon.text-success, .fa.text-success {`);
    rules.push(`  color: ${tokens.success} !important;`);
    rules.push(`}`);
    rules.push('// Link-style button icons (calendar picker, etc.) — follow link colour');
    rules.push(`.btn-link .icon, .btn-link .fa, .btn-link [class*="fa-"] {`);
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push(`}`);
    rules.push('// File manager — folder icon is a background-image on the span');
    rules.push('// Double-invert: invert span (fixes icon), counter-invert link (restores text)');
    rules.push(`.fp-path-folder {`);
    rules.push(`  filter: invert(1) !important;`);
    rules.push(`}`);
    rules.push(`.fp-path-folder a {`);
    rules.push(`  filter: invert(1) !important;`);
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push(`}`);
    rules.push('// File manager toolbar icons — follow link colour');
    rules.push(`.fp-pathbar .icon, .fp-pathbar .fa,`);
    rules.push(`.filemanager-toolbar .icon, .filemanager-toolbar .fa,`);
    rules.push(`.filemanager-toolbar [class*="fa-"] {`);
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push(`}`);
    rules.push('');

    // Link icons on dark page bg — action icons inside <a> follow link colour
    rules.push('// Link action icons — follow main theme colour');
    rules.push(`a .icon, a .fa, a [class*="fa-"] {`);
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push(`}`);
    rules.push('');

    // White-background containers — Moodle hardcodes .bg-white, dialogs, and
    // YUI3 widgets keep white bg. Force dark text so it's readable.
    // NOTE: must come AFTER message-app rule so .bg-white wins inside conversation area
    rules.push('// Force dark text on white-background containers');
    rules.push(`.bg-white, .bg-white *,`);
    rules.push(`.moodle-dialogue-bd, .moodle-dialogue-bd *,`);
    rules.push(`.fp-select, .fp-select *,`);
    rules.push(`.yui3-datatable, .yui3-datatable *,`);
    rules.push(`.yui3-widget-bd, .yui3-widget-bd * {`);
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push(`}`);
    rules.push('// Preserve link colour inside white containers');
    rules.push(`.bg-white a, .moodle-dialogue-bd a, .fp-select a,`);
    rules.push(`.yui3-datatable a, .yui3-widget-bd a {`);
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push(`}`);
    rules.push('');
    // Messaging drawer sidebar — dark bg, white text, main colour for interactive
    rules.push('// Messaging drawer sidebar');
    rules.push(`.message-app {`);
    rules.push(`  background-color: ${tokens.drawerBg} !important;`);
    rules.push(`}`);
    rules.push(`.message-app .view-overview-body,`);
    rules.push(`.message-app .view-overview-body *,`);
    rules.push(`.message-app .section, .message-app .section *,`);
    rules.push(`.message-app .card-header, .message-app .card-header * {`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  background-color: transparent !important;`);
    rules.push(`}`);
    rules.push(`.message-app .view-overview-body a,`);
    rules.push(`.message-app .section a,`);
    rules.push(`.message-app .card-header a {`);
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push(`}`);
    rules.push(`.message-app .view-overview-body .icon,`);
    rules.push(`.message-app .view-overview-body .fa,`);
    rules.push(`.message-app .section .icon, .message-app .section .fa {`);
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push(`}`);
    rules.push(`.message-app .text-muted, .message-app small {`);
    rules.push(`  color: ${tokens.mutedText} !important;`);
    rules.push(`}`);
    rules.push('// Search icon inside white input — force dark');
    rules.push(`.simplesearchform .btn-submit .icon,`);
    rules.push(`.simplesearchform .btn-submit .fa {`);
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Muted text (helper labels, calendar day numbers, timestamps, category labels)
    rules.push(`.text-muted, .text-secondary, small, .small,`);
    rules.push(`.coursecategory, .course-category, .coursecat, .dimmed_text,`);
    rules.push(`.categoryname, .categoryname.text-truncate,`);
    rules.push(`.resourcelinkdetails, .activity-altcontent, .activity-dates {`);
    rules.push(`  color: ${tokens.mutedText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Progress bars — dark background behind progress track + text
    rules.push('.progress {');
    rules.push(`  background-color: ${tokens.cardBorder} !important;`);
    rules.push(`}`);
    rules.push(`.progress-text, .progress .text, .progress .small {`);
    rules.push(`  color: ${tokens.mutedText} !important;`);
    rules.push(`}`);
    rules.push(`.dashboard-card-footer, .course-info-container,`);
    rules.push(`.course-card .card-footer, .card.course-card .card-footer.bg-white {`);
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push(`.course-card .progress-text, .block-cards .progress-text {`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Course card body — "My courses" page card backgrounds
    rules.push(`.dashboard-card-deck .dashboard-card,`);
    rules.push(`.dashboard-card-deck .dashboard-card .card-body,`);
    rules.push(`.dashboard-card-deck .dashboard-card .card-footer,`);
    rules.push(`.course-summaryitem, .coursebox,`);
    rules.push(`.block_myoverview .card, .block_myoverview .card-body,`);
    rules.push(`.block_myoverview .card-footer {`);
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Course overview filter bar & search area
    rules.push(`.block_myoverview .d-flex, .block_myoverview .dropdown,`);
    rules.push(`.block_myoverview [data-region="filter"],`);
    rules.push(`.block_myoverview [data-region="courses-view"] {`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Activity completion & availability info
    rules.push('.completioninfo, .completion-info, .automatic-completion-conditions,');
    rules.push('.activity-completion, .availability-info, .availabilityinfo {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  background-color: transparent !important;`);
    rules.push(`}`);
    rules.push('');

    // Course section headers & hidden sections
    rules.push('.course-section-header, .sectionname, .section-title,');
    rules.push('.sectionname a, .section-title a,');
    rules.push('.course-section-header h3, .course-section-header h4,');
    rules.push('.course-content h3.sectionname, .course-content .section-title h3 {');
    rules.push(`  color: ${tokens.headingText} !important;`);
    rules.push(`}`);
    rules.push('.sectionname a:hover, .section-title a:hover {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push(`}`);
    rules.push(`.sectionhidden, .dimmed { color: ${tokens.mutedText} !important; }`);
    rules.push('');

    // Section collapse/toggle icons
    rules.push(`.course-section-header .icons-collapse-expand,`);
    rules.push(`.course-section-header .completion-info,`);
    rules.push(`.course-content .section-chevron { color: ${tokens.mutedText} !important; }`);
    rules.push('');

    // Comment areas
    rules.push(`.comment-area, .comment-list, .comment-item {`);
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Form controls — inputs, selects, textareas
    rules.push('.form-control, input[type="text"], input[type="email"],');
    rules.push('input[type="password"], input[type="search"], input[type="url"],');
    rules.push('textarea, select {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push(`}`);
    rules.push('');

    // Placeholders
    rules.push(`::placeholder { color: ${tokens.mutedText} !important; opacity: 0.7; }`);
    rules.push('');

    // Form labels
    rules.push(`label, .form-label, .form-check-label { color: ${tokens.bodyText} !important; }`);
    // Toggle switches — main theme colour when checked, white when unchecked
    rules.push(`.form-check-input:checked {`);
    rules.push(`  background-color: ${tokens.linkColour} !important;`);
    rules.push(`  border-color: ${tokens.linkColour} !important;`);
    rules.push(`  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23000'/%3e%3c/svg%3e") !important;`);
    rules.push(`}`);
    rules.push(`.form-check-input:not(:checked) {`);
    rules.push(`  background-color: #FFFFFF !important;`);
    rules.push(`  border-color: #dee2e6 !important;`);
    rules.push(`}`);
    rules.push('');

    // Tables (calendar grid, participant lists)
    rules.push(`table, th, td { color: ${tokens.bodyText} !important; }`);
    rules.push(`th { background-color: rgba(0,0,0,0.15) !important; }`);
    rules.push(`.table-bordered th, .table-bordered td { border-color: ${tokens.cardBorder} !important; }`);
    rules.push('');

    // Calendar-specific
    rules.push('// Calendar on dark backgrounds');
    rules.push(`.calendarwrapper .day, .calendar_event_course,`);
    rules.push(`.calendar-controls a, .calendar td { color: ${tokens.bodyText} !important; }`);
    rules.push('');

    // Dropdowns (site-wide, not just navbar)
    rules.push('.dropdown-menu {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push(`}`);
    rules.push(`.dropdown-item { color: ${tokens.bodyText} !important; }`);
    rules.push(`.dropdown-item:hover, .dropdown-item:focus {`);
    rules.push(`  background-color: rgba(255,255,255,0.08) !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push(`.dropdown-divider { border-color: ${tokens.cardBorder} !important; }`);
    rules.push('');

    // Secondary nav text — all tab links, not just active
    if (tokens.secondaryNavText !== d.secondaryNavText) {
      rules.push(`.secondary-navigation .nav-tabs .nav-link {`);
      rules.push(`  color: ${tokens.secondaryNavText} !important;`);
      rules.push(`}`);
      rules.push('');
    }

    // Secondary nav tab hover — use secondaryNavActive as bg, auto-contrast text
    rules.push(`.secondary-navigation .nav-tabs .nav-link:hover,`);
    rules.push(`.secondary-navigation .nav-tabs .nav-link:focus {`);
    rules.push(`  background-color: ${tokens.secondaryNavActive} !important;`);
    rules.push(`  color: ${autoTextForHex(tokens.secondaryNavActive)} !important;`);
    rules.push(`  font-weight: 700;`);
    rules.push(`}`);
    rules.push('');

    // Breadcrumb text on dark background
    rules.push(`.breadcrumb-item, .breadcrumb-item a { color: ${tokens.bodyText} !important; }`);
    rules.push(`.breadcrumb-item + .breadcrumb-item::before { color: ${tokens.mutedText} !important; }`);
    rules.push('');

    // Course content area — backgrounds AND text. When a body image is set, drop
    // the opaque page colour (transparent) so the image shows through the content
    // column, but KEEP the text colour. Cards/blocks inside stay opaque.
    rules.push('.course-content, #region-main, #page-content {');
    rules.push(`  background-color: ${tokens.backgroundImage ? 'transparent' : tokens.pageBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Activity items — force dark bg on each activity row
    rules.push(`.activity-item, .activity-header, .activity-basis,`);
    rules.push(`.activity-info, .activity-actions {`);
    rules.push(`  background-color: transparent !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Activity icon containers — ensure icons are visible on dark themes
    // Do NOT set filter on the container — it overrides Moodle's SVG filter
    // that makes the icon image white. Instead ensure the icon img is white.
    rules.push(`.activityiconcontainer .activityicon,`);
    rules.push(`.activityiconcontainer .icon {`);
    rules.push(`  filter: brightness(0) invert(1) !important;`);
    rules.push(`}`);
    rules.push(`.activityiconcontainer.content {`);
    rules.push(`  background-color: ${tokens.actIconContent} !important;`);
    rules.push(`}`);
    rules.push(`.activityiconcontainer.assessment {`);
    rules.push(`  background-color: ${tokens.actIconAssessment} !important;`);
    rules.push(`}`);
    rules.push(`.activityiconcontainer.collaboration {`);
    rules.push(`  background-color: ${tokens.actIconCollaboration} !important;`);
    rules.push(`}`);
    rules.push(`.activityiconcontainer.communication {`);
    rules.push(`  background-color: ${tokens.actIconCommunication} !important;`);
    rules.push(`}`);
    rules.push(`.activityiconcontainer.administration {`);
    rules.push(`  background-color: ${tokens.actIconAdmin} !important;`);
    rules.push(`}`);
    rules.push(`.activityiconcontainer.interface {`);
    rules.push(`  background-color: ${tokens.actIconInterface} !important;`);
    rules.push(`}`);
    rules.push('');

    // Activity navigation (previous/next) buttons — invisible on dark backgrounds by default
    rules.push('.activity-navigation .btn,');
    rules.push('.course-content .activity-navigation .btn,');
    rules.push('#page-content .activity-navigation .btn {');
    rules.push(`  background-color: ${tokens.bodyText} !important;`);
    rules.push(`  color: ${autoTextForHex(tokens.bodyText)} !important;`);
    rules.push(`  border-color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push('.activity-navigation .btn .icon,');
    rules.push('.activity-navigation .btn i,');
    rules.push('.activity-navigation .btn .fa,');
    rules.push('.activity-navigation .btn [class*="bi-"] {');
    rules.push(`  color: ${autoTextForHex(tokens.bodyText)} !important;`);
    rules.push(`}`);
    rules.push('');

    // Course sections — entire section container + li items
    rules.push(`.course-content .section, .course-content .section li,`);
    rules.push(`.course-section, .course-section-header,`);
    rules.push('#region-main .course-content ul.section {');
    rules.push(`  background-color: transparent !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // "Hidden from students" dimmed activity banners
    rules.push(`.dimmed, .dimmed_text, .dimmed_category,`);
    rules.push(`.isrestricted, .ishidden {`);
    rules.push(`  background-color: rgba(255,255,255,0.05) !important;`);
    rules.push(`  color: ${tokens.mutedText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Bootstrap badge overrides for dark themes (.bg-secondary .text-dark)
    rules.push(`.badge.bg-secondary {`);
    rules.push(`  background-color: ${tokens.cardBorder} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push(`.badge.text-dark, .text-dark {`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push(`.badge.bg-success, .badge.bg-info, .badge.bg-warning {`);
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Btn-secondary / btn-outline on dark
    rules.push(`.btn-secondary, .btn-outline-secondary {`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push(`  background-color: transparent !important;`);
    rules.push(`}`);
    rules.push(`.btn-secondary:hover, .btn-outline-secondary:hover {`);
    rules.push(`  background-color: rgba(255,255,255,0.08) !important;`);
    rules.push(`}`);
    // Btn-outline-primary on dark — white text/border, main colour on hover
    rules.push(`.btn-outline-primary {`);
    rules.push(`  color: #FFFFFF !important;`);
    rules.push(`  border-color: #FFFFFF !important;`);
    rules.push(`  background-color: transparent !important;`);
    rules.push(`}`);
    rules.push(`.btn-outline-primary:hover, .btn-outline-primary:focus {`);
    rules.push(`  color: ${autoTextForHex(tokens.linkColour)} !important;`);
    rules.push(`  background-color: ${tokens.linkColour} !important;`);
    rules.push(`  border-color: ${tokens.linkColour} !important;`);
    rules.push(`}`);
    // Course section collapse/expand arrow — 3 states
    rules.push('// Section toggle arrow — default: main colour bg + white arrow');
    rules.push(`.icons-collapse-expand {`);
    rules.push(`  background-color: ${tokens.linkColour} !important;`);
    rules.push(`  border-radius: 4px !important;`);
    rules.push(`}`);
    rules.push(`.icons-collapse-expand .icon, .icons-collapse-expand .fa,`);
    rules.push(`.icons-collapse-expand [class*="fa-"] {`);
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push(`}`);
    rules.push('// Hover: dark bg + white arrow');
    rules.push(`.icons-collapse-expand:hover {`);
    rules.push(`  background-color: ${d.bodyText} !important;`);
    rules.push(`}`);
    rules.push(`.icons-collapse-expand:hover .icon, .icons-collapse-expand:hover .fa,`);
    rules.push(`.icons-collapse-expand:hover [class*="fa-"] {`);
    rules.push(`  color: #FFFFFF !important;`);
    rules.push(`}`);
    rules.push('// Expanded: white bg + dark arrow');
    rules.push(`.icons-collapse-expand[aria-expanded="true"] {`);
    rules.push(`  background-color: #FFFFFF !important;`);
    rules.push(`}`);
    rules.push(`.icons-collapse-expand[aria-expanded="true"] .icon,`);
    rules.push(`.icons-collapse-expand[aria-expanded="true"] .fa,`);
    rules.push(`.icons-collapse-expand[aria-expanded="true"] [class*="fa-"] {`);
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // Login page text on dark backgrounds
    if (tokens.loginBg !== d.loginBg && isDarkBg(tokens.loginBg)) {
      rules.push('body#page-login-index .card,');
      rules.push('body#page-login-index .login-heading,');
      rules.push('body#page-login-index label,');
      rules.push('body#page-login-index .login-form-forgotpassword a,');
      rules.push('body#page-login-index .toggle-sensitive-btn .icon,');
      rules.push('body#page-login-index .toggle-sensitive-btn .fa,');
      rules.push('body#page-login-index .login-signup a {');
      rules.push(`  color: ${tokens.bodyText} !important;`);
      rules.push(`}`);
      rules.push('');
    }

    // Popover / tooltip
    rules.push(`.popover { background-color: ${tokens.cardBg} !important; color: ${tokens.bodyText} !important; }`);
    rules.push(`.popover-body { color: ${tokens.bodyText} !important; }`);
    rules.push('');

    // Notifications popover (bell-icon dropdown) — Moodle renders this as a
    // `.popover-region-notifications` container portalled outside `.navbar`,
    // so the navbar `.popover-region-container` override does not catch it.
    // Boost ships it as a hardcoded white card with #f4f4f4 unread rows and
    // `$primary` hover — unreadable on dark presets.
    rules.push(`.popover-region-notifications .popover-region-container {`);
    rules.push(`  background-color: ${tokens.drawerBg} !important;`);
    rules.push(`  border-color: rgba(255,255,255,0.1) !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push(`.popover-region-notifications .popover-region-header-container {`);
    rules.push(`  border-bottom-color: rgba(255,255,255,0.1) !important;`);
    rules.push(`}`);
    rules.push(`.popover-region-notifications .popover-region-header-text {`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push(`.popover-region-notifications .content-item-container {`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-bottom-color: rgba(255,255,255,0.08) !important;`);
    rules.push(`}`);
    rules.push(`.popover-region-notifications .content-item-container.unread {`);
    rules.push(`  background-color: rgba(255,255,255,0.06) !important;`);
    rules.push(`}`);
    rules.push(`.popover-region-notifications .content-item-container:hover,`);
    rules.push(`.popover-region-notifications .content-item-container.unread:hover {`);
    rules.push(`  background-color: ${tokens.linkColour} !important;`);
    rules.push(`  color: ${autoTextForHex(tokens.linkColour)} !important;`);
    rules.push(`}`);
    // Anchors and inline text inside the row (.context-link, .view-more,
    // .notification-message, .timestamp) get colour from the global
    // `a:hover { color: linkHover }` rule (specificity 0,1,1) or from their own
    // selectors. Force contrast text on EVERY descendant of a hovered row.
    rules.push(`.popover-region-notifications .content-item-container:hover *,`);
    rules.push(`.popover-region-notifications .content-item-container:hover a:hover,`);
    rules.push(`.popover-region-notifications .content-item-container:hover a:focus,`);
    rules.push(`.popover-region-notifications .content-item-container.unread:hover *,`);
    rules.push(`.popover-region-notifications .content-item-container.unread:hover a:hover,`);
    rules.push(`.popover-region-notifications .content-item-container.unread:hover a:focus {`);
    rules.push(`  color: ${autoTextForHex(tokens.linkColour)} !important;`);
    rules.push(`  background-color: transparent !important;`);
    rules.push(`}`);
    rules.push(`.popover-region-notifications .content-item-footer .timestamp {`);
    rules.push(`  color: ${tokens.mutedText} !important;`);
    rules.push(`}`);
    rules.push(`.popover-region-notifications .popover-region-footer-container {`);
    rules.push(`  background-color: ${tokens.drawerBg} !important;`);
    rules.push(`  border-top-color: rgba(255,255,255,0.1) !important;`);
    rules.push(`}`);
    rules.push(`.popover-region-notifications .see-all-link,`);
    rules.push(`.popover-region-notifications .view-more {`);
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push(`}`);
    rules.push('');

    // List-group items (used in drawers, course index)
    rules.push(`.list-group-item {`);
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push(`}`);
    rules.push('');

    // Site administration tree — category rows
    rules.push(`.adminlink, .admintree, .admin_settingspage,`);
    rules.push(`#adminsettings, .adminsettingsflags {`);
    rules.push(`  background-color: transparent !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push('');

    // General content containers — catch remaining white-bg panels
    rules.push(`.generalbox, .box.py-3, .loginbox,`);
    rules.push(`.well, .alert-info {`);
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push(`}`);
    rules.push('');

    // FINAL: White-bg container overrides — MUST be last so they beat all
    // dark-theme button/form rules above that set light text colour.
    rules.push('// White-bg final overrides — highest cascade priority');
    rules.push(`.bg-white .form-select, .bg-white .form-control,`);
    rules.push(`.bg-white .btn, .bg-white .btn-secondary,`);
    rules.push(`.bg-white .btn-link, .bg-white label,`);
    rules.push(`.bg-white span, .bg-white p, .bg-white div,`);
    rules.push(`.bg-white legend, .bg-white option {`);
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push(`}`);
    rules.push(`.bg-white .form-select, .bg-white .form-control {`);
    rules.push(`  background-color: #FFFFFF !important;`);
    rules.push(`  border-color: #dee2e6 !important;`);
    rules.push(`}`);
    rules.push(`.bg-white a:not(.btn-primary) {`);
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push(`}`);
    // Filter join text ("and"/"or", "Match All of the following")
    rules.push(`[data-filterregion="joinadverb"],`);
    rules.push(`[data-filterregion="joinadverb"] div,`);
    rules.push(`[data-filterregion="filtermatch"],`);
    rules.push(`[data-filterregion="filtermatch"] label,`);
    rules.push(`[data-filterregion="filtermatch"] span {`);
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push(`}`);
    // Filter action buttons — visually on white panel but outside .bg-white DOM
    rules.push(`[data-filterregion="actions"] .btn-link,`);
    rules.push(`[data-filterregion="actions"] .btn-link span,`);
    rules.push(`[data-filterregion="actions"] .btn-link .icon,`);
    rules.push(`[data-filterregion="actions"] .btn-link .fa {`);
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push(`}`);
    rules.push(`[data-filterregion="actions"] .btn-secondary {`);
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push(`  border-color: ${d.bodyText} !important;`);
    rules.push(`  background-color: #FFFFFF !important;`);
    rules.push(`}`);
    rules.push(`.bg-white .btn-primary {`);
    rules.push(`  color: ${tokens.btnPrimaryText} !important;`);
    rules.push(`  background-color: ${tokens.btnPrimaryBg} !important;`);
    rules.push(`}`);
    rules.push('');
    // VERY LAST: Course card progress text — must beat .bg-white span override
    rules.push('.course-card .card-footer .progress-text,');
    rules.push('.course-card .card-footer .progress-text span,');
    rules.push('.block-cards .card-footer .progress-text,');
    rules.push('.block-cards .card-footer .progress-text span {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('');
    // Footer popover — dark bg, #page-footer ID beats .bg-white class specificity
    rules.push('#page-footer, #page-footer *,');
    rules.push('#page-footer .footer-content-popover,');
    rules.push('#page-footer .footer-content-popover *,');
    rules.push('#page-footer .logininfo, #page-footer .logininfo * {');
    rules.push(`  color: ${tokens.footerText} !important;`);
    rules.push('}');
    rules.push('#page-footer a, #page-footer .footer-content-popover a,');
    rules.push('#page-footer .logininfo a {');
    rules.push(`  color: ${tokens.footerLink} !important;`);
    rules.push('}');
    rules.push('');
    // ── Quiz edit page (#page-mod-quiz-edit) — Moodle's hardcoded LIGHT containers ──
    // The quiz module's own stylesheet (mod/quiz/styles.css) paints the
    // slot/section and question-bank containers light (#fafafa/#e6e6e6/#fff) but
    // gives them NO .bg-white class, so the white-bg overrides above never match
    // them. In dark presets our broad text rules repaint that text light → it
    // becomes invisible (e.g. the "Shuffle" label sitting on the #fafafa .content).
    // Fix: force the LIGHT-THEME default colours (d.*), which are accessible on a
    // light background — the "Fixed dark" classification. ID-anchored to
    // #page-mod-quiz-edit ONLY, scoped to the known light containers (never a bare
    // #page-mod-quiz-edit *), and colour-only (never background) — so nothing
    // outside this page or these containers can be affected.
    rules.push('// Quiz edit page — readable text on hardcoded light slot/section containers');
    rules.push('#page-mod-quiz-edit ul.slots li.section .content,');
    rules.push('#page-mod-quiz-edit ul.slots li.section .content *,');
    rules.push('#page-mod-quiz-edit .section-heading,');
    rules.push('#page-mod-quiz-edit .section-heading *,');
    rules.push('#page-mod-quiz-edit ul.slots li.activity,');
    rules.push('#page-mod-quiz-edit ul.slots li.activity *,');
    rules.push('#page-mod-quiz-edit .instancemaxmarkcontainer,');
    rules.push('#page-mod-quiz-edit .instancemaxmarkcontainer *,');
    rules.push('#page-mod-quiz-edit div.questionbank .categoryquestionscontainer,');
    rules.push('#page-mod-quiz-edit div.questionbank .categoryquestionscontainer * {');
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push('}');
    // Preserve link affordance with the accessible default blue (~5.5:1 on white),
    // NOT the dark-preset lime/orange link colour which would fail contrast here.
    rules.push('#page-mod-quiz-edit ul.slots li.section .content a:not(.btn),');
    rules.push('#page-mod-quiz-edit .section-heading a:not(.btn),');
    rules.push('#page-mod-quiz-edit ul.slots li.activity a:not(.btn),');
    rules.push('#page-mod-quiz-edit div.questionbank .categoryquestionscontainer a:not(.btn) {');
    rules.push(`  color: ${d.linkColour} !important;`);
    rules.push('}');
    // Exception: dark popovers INSIDE the light containers (e.g. the "Add" action
    // menu) keep their dark background, so they still need LIGHT text. The
    // fixed-dark rules above would otherwise force dark-on-dark inside the open
    // .dropdown-menu. Re-assert the standard dark-dropdown text colour, anchored
    // through each container root + .dropdown-menu so it beats the rules above
    // (the deeper .dropdown-item selector also beats the blue-link rule for the
    // <a> menu items). Only the open menu is affected — the toggle stays dark
    // on its light container because it is not inside .dropdown-menu.
    rules.push('#page-mod-quiz-edit ul.slots li.section .content .dropdown-menu,');
    rules.push('#page-mod-quiz-edit ul.slots li.section .content .dropdown-menu *,');
    rules.push('#page-mod-quiz-edit ul.slots li.section .content .dropdown-menu .dropdown-item,');
    rules.push('#page-mod-quiz-edit .section-heading .dropdown-menu,');
    rules.push('#page-mod-quiz-edit .section-heading .dropdown-menu *,');
    rules.push('#page-mod-quiz-edit .section-heading .dropdown-menu .dropdown-item,');
    rules.push('#page-mod-quiz-edit ul.slots li.activity .dropdown-menu,');
    rules.push('#page-mod-quiz-edit ul.slots li.activity .dropdown-menu *,');
    rules.push('#page-mod-quiz-edit ul.slots li.activity .dropdown-menu .dropdown-item {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    // #115 — inline editing input. Clicking a mark (.instancemaxmarkcontainer) or
    // a question/section name swaps in an <input class="form-control"> that the
    // global dark form rule paints with a DARK bg; the Tier-1 catch-all above then
    // forces its text dark too -> dark-on-dark while typing. Restore a white field
    // (Fixed-dark pattern) so the editing input is readable. Page-scoped to
    // #page-mod-quiz-edit and limited to .inplaceeditable, so the page's other
    // inputs (e.g. Maximum grade) and every other page are untouched.
    rules.push('#page-mod-quiz-edit .inplaceeditable input,');
    rules.push('#page-mod-quiz-edit .inplaceeditable .form-control,');
    rules.push('#page-mod-quiz-edit .inplaceeditable .form-select {');
    rules.push(`  background-color: #FFFFFF !important;`);
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push(`  border-color: #dee2e6 !important;`);
    rules.push('}');
    // #116 — modals launched from the quiz edit page (the "Add > a new question"
    // type chooser and "from question bank") are portalled to <body> (still under
    // #page-mod-quiz-edit) and keep Bootstrap's white .modal-content bg, but no
    // dark-theme rule darkens their text -> light-on-white. Mirror the .bg-white
    // treatment, page-scoped: force dark text, restore white inputs, keep links
    // blue and primary buttons on-brand. ID-anchored so no other page's modals
    // are affected.
    rules.push('#page-mod-quiz-edit .modal-content,');
    rules.push('#page-mod-quiz-edit .modal-content * {');
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push('}');
    rules.push('#page-mod-quiz-edit .modal-content .form-control,');
    rules.push('#page-mod-quiz-edit .modal-content .form-select,');
    rules.push('#page-mod-quiz-edit .modal-content input[type="text"],');
    rules.push('#page-mod-quiz-edit .modal-content input[type="search"] {');
    rules.push(`  background-color: #FFFFFF !important;`);
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push(`  border-color: #dee2e6 !important;`);
    rules.push('}');
    rules.push('#page-mod-quiz-edit .modal-content a:not(.btn) {');
    rules.push(`  color: ${d.linkColour} !important;`);
    rules.push('}');
    rules.push('#page-mod-quiz-edit .modal-content .btn-primary {');
    rules.push(`  background-color: ${tokens.btnPrimaryBg} !important;`);
    rules.push('}');
    rules.push('#page-mod-quiz-edit .modal-content .btn-primary,');
    rules.push('#page-mod-quiz-edit .modal-content .btn-primary * {');
    rules.push(`  color: ${tokens.btnPrimaryText} !important;`);
    rules.push('}');
    rules.push('');
    // ── Question bank page (#page-question-edit) — dark table surface ──
    // The standalone Question bank (question/edit.php) renders the question list
    // as a Bootstrap table (table.question-bank-table.generaltable.table). Bootstrap
    // paints every cell background from --bs-table-bg — which resolves to the LIGHT
    // --bs-body-bg — via `.table:not(caption)>*>* { background: var(--bs-table-bg) }`
    // (specificity 0,2,1). Our dark block repaints the text/links/icons light + lime
    // but never redefines the table background, and the only bg rule it emits
    // (th { background: rgba(0,0,0,.15) }, specificity 0,0,1) LOSES to Bootstrap's
    // rule → light/lime text on a light table = unreadable. The quiz-edit block does
    // NOT cover this: it is anchored to #page-mod-quiz-edit (quiz/edit.php), a
    // different page. Fix: give the table a dark CARD surface so the existing
    // light/lime text reads, matching cards/dropdowns/modals. Double-anchored to
    // #page-question-edit (the body id) AND .question-bank-table (the table class)
    // so it cannot touch any other page, the filter UI, or any other table. Redefine
    // the Bootstrap table variables on the table element (clean — cascades to header
    // + body), plus an !important cell rule as insurance against Bootstrap's
    // stripe/hover background-state trick. Colour + background only. Gated by
    // darkMode (isDarkBg(pageBg)) → emits for dark presets only, light presets never.
    rules.push('// Question bank table — dark surface so light/lime text is readable');
    rules.push('#page-question-edit .question-bank-table {');
    rules.push(`  --bs-table-bg: ${tokens.cardBg};`);
    rules.push(`  --bs-table-color: ${tokens.bodyText};`);
    rules.push(`  --bs-table-border-color: ${tokens.cardBorder};`);
    rules.push('}');
    rules.push('#page-question-edit .question-bank-table th,');
    rules.push('#page-question-edit .question-bank-table td {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    // White column headers for emphasis. .header (1,2,0) and thead th (1,1,1) both
    // beat the th/td body-text rule (1,1,1) on class count / source order.
    rules.push('#page-question-edit .question-bank-table .header,');
    rules.push('#page-question-edit .question-bank-table thead th {');
    rules.push(`  color: ${tokens.headingText} !important;`);
    rules.push('}');
    // Links (column sort links, the "Question 1" inplace-edit link) keep the
    // dark-theme link colour. a:not(.btn) (1,2,1) beats the .header / th rules so
    // header sort links read as links, not heading text.
    rules.push('#page-question-edit .question-bank-table a:not(.btn) {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    rules.push('');
    // ── Question bank — column action-handle + menu icons (dark surface) ──
    // The generic `.icon, .fa { color: ${d.bodyText} }` rule (Icon Visibility Fix,
    // ~line 349) keeps every FontAwesome glyph DARK (#1d2125) on the assumption icons
    // sit on light card wrappers. The table above is now a dark CARD surface, so the
    // column move/resize handles (<i class="icon fa fa-arrows-up-down-left-right">) and
    // the three-dot column-menu glyphs render dark-on-dark → invisible. Re-light them
    // to body text, scoped to .question-bank-table ONLY (icons on the light filter
    // panel elsewhere on this page MUST stay dark). :not([class*="text-"]) preserves
    // semantic status icons (.text-success/.text-danger). (1,3,0)+!important beats the
    // generic (0,2,0) rule.
    rules.push('#page-question-edit .question-bank-table .icon:not([class*="text-"]),');
    rules.push('#page-question-edit .question-bank-table .fa:not([class*="text-"]) {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('');
    // ── Question bank — "Show question text in the question list?" label ──
    // Bootstrap renders label.input-group-text as a light-grey chip (--bs-tertiary-bg).
    // It sits OUTSIDE .question-bank-table (the toolbar above the list), so the
    // dark-surface block can't reach it, and the broad light-text rule leaves it faint
    // on the grey chip. Force fixed-dark text (matches the filter-label precedent);
    // keep Bootstrap's chip background. (1,2,0)+!important wins.
    rules.push('#page-question-edit .input-group .input-group-text {');
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push('}');
    rules.push('');
    // ── Question preview page — dark contrast ──
    // Moodle hardcodes `.que .info` LIGHT ($gray-100, no .bg-white class), so none of
    // the white-bg overrides match it and the page-content light-text rule (~line 817)
    // lights its text → faint number/state/grade on a near-white box. Force fixed-dark
    // text (colour only — Moodle owns the background). The preview page body id changed
    // in Moodle 4.0+ (preview moved into the qbank_previewquestion plugin), so anchor
    // BOTH the legacy and plugin ids — a non-matching id simply no-ops.
    rules.push('#page-question-preview .que .info,');
    rules.push('#page-question-preview .que .info > div,');
    rules.push('#page-question-preview .que .info .state,');
    rules.push('#page-question-preview .que .info .grade,');
    rules.push('#page-question-preview .que .info h3.no,');
    rules.push('#page-question-preview .que .info span.qno,');
    rules.push('#page-question-bank-previewquestion-preview .que .info,');
    rules.push('#page-question-bank-previewquestion-preview .que .info > div,');
    rules.push('#page-question-bank-previewquestion-preview .que .info .state,');
    rules.push('#page-question-bank-previewquestion-preview .que .info .grade,');
    rules.push('#page-question-bank-previewquestion-preview .que .info h3.no,');
    rules.push('#page-question-bank-previewquestion-preview .que .info span.qno {');
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push('}');
    // Preview control buttons (Start again / Save / Fill in correct responses /
    // Close preview) render as transparent ghost outlines via the global dark
    // .btn-secondary rule. Give them a solid dark card surface so they read as real
    // buttons; .btn-primary ("Submit and finish") is left untouched to stay on-brand.
    // (2,1,0) beats the global .btn-secondary (0,1,0).
    rules.push('#page-question-preview #previewcontrols .btn-secondary,');
    rules.push('#page-question-preview #previewcontrols .btn-outline-secondary,');
    rules.push('#page-question-bank-previewquestion-preview #previewcontrols .btn-secondary,');
    rules.push('#page-question-bank-previewquestion-preview #previewcontrols .btn-outline-secondary {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('');
    // ── Question bank — datafilter panel DARK surface (#155) ──
    // The "Match … of the following" filter is Moodle's generic core/datafilter
    // component, built from three Bootstrap LIGHT utilities in the markup (no Moodle
    // SCSS, no !important): the outer panel `.filter-group.bg-light`, each condition
    // row's inner card `[data-filterregion="filter"] … .bg-white`, and the value pill
    // `.badge.bg-secondary.text-dark`. A pre-existing GLOBAL half-measure (~L1093)
    // keeps that panel light + forces its text dark — correct for OTHER datafilter
    // pages (Participants etc.), but the user wants the QUESTION BANK filter dark to
    // match the rest of the dark theme. Scope every rule to `#page-question-edit` so
    // ONLY the qbank changes (the global rules stay intact elsewhere). 3-level depth:
    // panel `drawerBg` (darkest, recessed), rows/fields `cardBg` (raised, bordered) —
    // mirrors the light design's panel-darker-than-rows hierarchy in BOTH presets
    // (drawerBg #1D2125 is always darker than cardBg). `#page-question-edit …` (1,x,0)
    // beats both Bootstrap's un-!important utilities and the generator's own
    // `.bg-white`/`[data-filterregion]` overrides (0,2,0).
    // (1) surfaces
    rules.push('#page-question-edit .filter-group.bg-light {');
    rules.push(`  background-color: ${tokens.drawerBg} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('#page-question-edit .filter-group [data-filterregion="filter"] .bg-white {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    // (2) all filter text → light (buttons + value pill handled below)
    rules.push('#page-question-edit .filter-group,');
    rules.push('#page-question-edit .filter-group label,');
    rules.push('#page-question-edit .filter-group legend,');
    rules.push('#page-question-edit .filter-group p,');
    rules.push('#page-question-edit .filter-group span,');
    rules.push('#page-question-edit .filter-group .bg-white,');
    rules.push('#page-question-edit .filter-group .bg-white label,');
    rules.push('#page-question-edit .filter-group .bg-white span,');
    rules.push('#page-question-edit .filter-group .bg-white div,');
    rules.push('#page-question-edit .filter-group [data-filterregion="filtermatch"] label,');
    rules.push('#page-question-edit .filter-group [data-filterregion="filtermatch"] span,');
    rules.push('#page-question-edit .filter-group [data-filterregion="joinadverb"],');
    rules.push('#page-question-edit .filter-group [data-filterregion="joinadverb"] div {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    // (3) selects (custom-select join/type) + autocomplete value input → dark field
    rules.push('#page-question-edit .filter-group .custom-select,');
    rules.push('#page-question-edit .filter-group select,');
    rules.push('#page-question-edit .filter-group .form-control {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('#page-question-edit .filter-group .form-control::placeholder {');
    rules.push(`  color: ${tokens.mutedText} !important;`);
    rules.push('}');
    // (4) value pill `.badge.bg-secondary.text-dark` → dark chip (like the grade-badge fix)
    rules.push('#page-question-edit .filter-group .badge.bg-secondary {');
    rules.push(`  background-color: ${tokens.cardBorder} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    // (5) icons (Add +, remove ⊗, pill ×) → light; spare any semantic .text-* icon
    rules.push('#page-question-edit .filter-group .icon:not([class*="text-"]),');
    rules.push('#page-question-edit .filter-group .fa:not([class*="text-"]) {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    // (6) buttons: "Show all" (btn-light) + "Clear filters" (btn-secondary, overriding
    // the global white half-measure) → dark secondary; "Add condition" (btn-link) text
    // light. "Apply filters" (.btn-primary, lime) is left to the Buttons section.
    rules.push('#page-question-edit .filter-group .btn-light,');
    rules.push('#page-question-edit .filter-group [data-filterregion="actions"] .btn-secondary {');
    rules.push(`  background-color: transparent !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('#page-question-edit .filter-group .btn-link,');
    rules.push('#page-question-edit .filter-group .btn-link span,');
    rules.push('#page-question-edit .filter-group [data-filteraction="add"],');
    rules.push('#page-question-edit .filter-group [data-filteraction="add"] span {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    // (7) "Reset columns" (a.btn.btn-outline-dark.action-link[data-action="reset"],
    // below the filter, NOT inside .filter-group) uses Bootstrap `.btn-outline-dark`
    // → dark text/border, invisible on the dark page. The generator handles
    // `.btn-outline-secondary`/`-primary` but not `-dark`. Re-light to bodyText
    // (white) + cardBorder, qbank-scoped. The `.bg-white .btn` override (~L1080)
    // still keeps it dark inside any white container.
    rules.push('#page-question-edit .btn-outline-dark {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('#page-question-edit .btn-outline-dark:hover,');
    rules.push('#page-question-edit .btn-outline-dark:focus {');
    rules.push(`  background-color: rgba(255,255,255,0.08) !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('');
    // ── Quiz attempt-summary table (.quizreviewsummary) — "Your attempts" / review ──
    // mod/quiz's own stylesheet hardcodes `table.quizreviewsummary td.cell` LIGHT
    // (`background:#fafafa`, th.cell `#f0f0f0`, no .bg-white class), so the dark theme's
    // light text — Status/Started/Completed/Duration/Grade — is invisible on the light
    // cell. The user wants a DARK surface here (consistent across all quiz pages): give
    // the cells the dark CARD surface + light text, links lime. The SAME table is
    // emitted by review_summary_table() on view.php (#page-mod-quiz-view), review.php
    // (#page-mod-quiz-review) AND summary.php (#page-mod-quiz-summary), so anchor on the
    // quiz body-id PREFIX `[id^="page-mod-quiz-"]` (same pattern as the `.que .info`
    // block below) — one rule covers all three. `.quizreviewsummary` is unique to this
    // table, so no other generaltable is touched. (0,3,2)+!important beats Moodle's
    // `table.quizreviewsummary td.cell` (0,2,2).
    rules.push('[id^="page-mod-quiz-"] .quizreviewsummary td.cell,');
    rules.push('[id^="page-mod-quiz-"] .quizreviewsummary th.cell {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('[id^="page-mod-quiz-"] .quizreviewsummary a:not(.btn) {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    rules.push('');
    // ── Quiz attempt/preview/review pages — `.que .info` status panel ──
    // Moodle hardcodes the `.que .info` left column LIGHT ($gray-100, no .bg-white),
    // so the dark theme's light text (question number, "Not yet answered", "Marked
    // out of 1.00", Flag/Edit links) is invisible. User wants a DARK surface + light
    // /lime text: give `.que .info` the dark CARD surface, force descendant text
    // light (number/state/grade) and links (Flag question / Edit question) lime. The
    // `.formulation` question body is given its own dark surface below (#132). Anchored
    // to the quiz module body-id PREFIX so it covers attempt/preview/review/summary
    // in one rule (quiz-edit has no `.que .info`, so it is unaffected). `.que .info`
    // (0,3,0)+!important beats Moodle's (0,2,0); the a:not(.btn) rule (0,4,1) keeps
    // links lime over the descendant-text rule.
    rules.push('[id^="page-mod-quiz-"] .que .info {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('[id^="page-mod-quiz-"] .que .info * {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('[id^="page-mod-quiz-"] .que .info a:not(.btn) {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    // The flag-state icon is a raw `<img class="questionflagimage" src=".../i/unflagged">`
    // (a PIX image, NOT a FontAwesome glyph), so the light-text `color` rules above
    // cannot recolour it. Two states, two filters (mutually exclusive via `src`):
    //  • UNFLAGGED (`i/unflagged`): light it to white to match the "Edit question" pen.
    //  • FLAGGED (`i/flagged`): Moodle's flagged image renders BLACK on this site, so
    //    tint it red — the conventional "flagged" colour (≈ CFA Red #F64747). A filter
    //    chain is required because an <img> can't take a `color`; it can't follow the
    //    `error` token dynamically, so it approximates the brand red.
    // `[src*="flagged"]:not([src*="unflagged"])` selects the flagged src only ("unflagged"
    // also contains the substring "flagged"). Image-based semantic icon → filter.
    rules.push('[id^="page-mod-quiz-"] .que .info .questionflagimage[src*="unflagged"] {');
    rules.push('  filter: brightness(0) invert(1);');
    rules.push('}');
    rules.push('[id^="page-mod-quiz-"] .que .info .questionflagimage[src*="flagged"]:not([src*="unflagged"]) {');
    rules.push('  filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(2400%) hue-rotate(320deg) brightness(98%) contrast(96%);');
    rules.push('}');
    rules.push('');
    // ── Quiz question body (.que .formulation) — dark surface ──
    // Moodle hardcodes the question body `.que .formulation` LIGHT BLUE (computed from
    // Bootstrap $info via shift-color → bg #ccf2ff, text #002633). On a dark theme that
    // pale-blue island clashes with the already-dark `.que .info` sidebar, and the per-
    // option ✓/✗ feedback icons — recoloured to the dark-preset success(lime)/error(red)
    // tokens by the generic .text-success/.text-danger rules (~L571) — are nearly
    // invisible / indistinguishable on the pale blue (lime ✓ ≈ 1.1:1). User chose a DARK
    // surface (consistent with `.que .info`): give the box the dark CARD surface + light
    // text + cardBorder, so the vivid lime ✓ / red ✗ read with MAXIMUM separation (lime
    // ≈ 11.7:1, red ≈ 4.7:1, amber partial ≈ 8:1 — all pass) and there is no white glare.
    // The ✓/✗ icons keep their semantic colours (their own !important rules at ~L571
    // win), so we DON'T touch them here. Global `.que .formulation` (question bodies
    // render the same everywhere — quiz attempt/review/preview, question preview);
    // (0,2,0)+!important beats Moodle's (0,2,0). In-question links + the "Clear my
    // choice" control follow the dark link colour (below).
    rules.push('.que .formulation {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    // Force the question text / options / feedback light. These target text containers,
    // NOT the ✓/✗ `<i>` icons (which keep their own .text-success/.text-danger colour).
    rules.push('.que .formulation .qtext,');
    rules.push('.que .formulation .ablock,');
    rules.push('.que .formulation .answer,');
    rules.push('.que .formulation .specificfeedback,');
    rules.push('.que .formulation .rightanswer,');
    rules.push('.que .formulation legend {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    // In-question links follow the dark link colour (lime/orange).
    rules.push('.que .formulation a:not(.btn) {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    rules.push('');
    // ── Multichoice "Clear my choice" link ──
    // After a radio option is selected, Moodle reveals a "Clear my choice" link
    // (.qtype_multichoice_clearchoice) inside the question body. Now that `.formulation`
    // is a dark surface (above), this control follows the dark link colour (lime/orange)
    // like every other in-question link — the earlier fixed CFA Purple (#B500B5, chosen
    // when the box was pale-blue) would be too dark on the dark card. Bold on hover for
    // feedback. Element-scoped to the clear-choice control (covers <a>/<button>/
    // [role=button] across Moodle versions).
    rules.push('.que .qtype_multichoice_clearchoice,');
    rules.push('.que .qtype_multichoice_clearchoice a,');
    rules.push('.que .qtype_multichoice_clearchoice button,');
    rules.push('.que .qtype_multichoice_clearchoice [role="button"] {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    rules.push('.que .qtype_multichoice_clearchoice a:hover,');
    rules.push('.que .qtype_multichoice_clearchoice button:hover,');
    rules.push('.que .qtype_multichoice_clearchoice [role="button"]:hover {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('  font-weight: 700 !important;');
    rules.push('}');
    rules.push('');
    // ── Gradebook setup page — dark table surface ──
    // Gradebook setup (grade/edit/tree/index.php) renders the categories/items as a
    // Bootstrap table (table#grade_edit_tree_table.generaltable.simple.setup-grades).
    // Moodle's grade.scss UNCONDITIONALLY hardcodes this table LIGHT — the wrapper +
    // header/total cells at $gray-100 (#f8f9fa) and the category/item rows at
    // $grade-table-td-bg (== #ffffff) — with no dark-mode variant. The dark block
    // lights text/links/icons but never the table bg, so light text on a near-white
    // table = washed out (the reported issue). Like qbank (#118) and quiz-view (#122),
    // the user wants a DARK surface + light/lime text (NOT dark-text-on-light).
    //
    // ANCHORING: this page is grade/edit/tree/INDEX.php. Unlike the view.php/edit.php
    // precedents (#page-mod-quiz-view, #page-question-edit), the body *id* of an
    // /index.php page is not reliably `#page-grade-edit-tree`, so an earlier attempt
    // that anchored on that id matched nothing. Anchor instead on the two selectors the
    // live DOM is known to expose: the table's OWN id `#grade_edit_tree_table` (Moodle
    // assigns it to this table on every version) and the `.path-grade-edit-tree` body
    // *class* (Moodle's own grade.scss rule uses it). An id + !important beats Moodle's
    // `.path-grade-edit-tree .gradetree-wrapper .setup-grades.table tr th` (0,4,2)
    // outright. Both are page-unique, so nothing else is touched. Gated by darkMode.
    rules.push('// Gradebook setup table — dark surface so light/lime text is readable');
    // Wrapper around the table (a 10px light $gray-100 frame) → dark card surface.
    // Body *class* .path-grade-edit-tree (confirmed present) + !important beats Moodle.
    rules.push('.path-grade-edit-tree .gradetree-wrapper {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push('}');
    // Redefine the Bootstrap table vars on the table (cascades to head + body cells).
    rules.push('#grade_edit_tree_table {');
    rules.push(`  --bs-table-bg: ${tokens.cardBg};`);
    rules.push(`  --bs-table-color: ${tokens.bodyText};`);
    rules.push(`  --bs-table-border-color: ${tokens.cardBorder};`);
    rules.push('}');
    // Cell surface + body text. Covers the header ($f8f9fa) AND the category/item/
    // total rows (#fff). `#id th` (1,0,1)+!important beats Moodle's (0,4,2) cell rules.
    rules.push('#grade_edit_tree_table th,');
    rules.push('#grade_edit_tree_table td,');
    rules.push('#grade_edit_tree_table tr th {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    // Descendant text inside cells (Name spans, Max grade, Status labels) → light, so
    // nothing inherits a dark colour from Moodle.
    rules.push('#grade_edit_tree_table th *,');
    rules.push('#grade_edit_tree_table td * {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    // Links (item-name edit links, category links, sort links) keep the dark-theme
    // link colour (lime/orange). a:not(.btn) (1,1,1) beats the descendant-text rule.
    rules.push('#grade_edit_tree_table a:not(.btn) {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    // Weights (+) add icon + three-dot Actions menu glyphs. The generic
    // `.icon, .fa { color: ${d.bodyText} }` rule (Icon Visibility Fix, ~L349) keeps
    // every glyph dark — invisible on the new dark card. Re-light scoped to the table;
    // :not([class*="text-"]) spares semantic .text-success/.text-danger status icons.
    rules.push('#grade_edit_tree_table .icon:not([class*="text-"]),');
    rules.push('#grade_edit_tree_table .fa:not([class*="text-"]) {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    // Muted/secondary metadata (dimmed labels, hints) → dark-theme muted token so it
    // stays legible but visually secondary. The extra class beats the body-text rule.
    rules.push('#grade_edit_tree_table .text-muted,');
    rules.push('#grade_edit_tree_table .dimmed_text,');
    rules.push('#grade_edit_tree_table small {');
    rules.push(`  color: ${tokens.mutedText} !important;`);
    rules.push('}');
    // Status pills (.badge.bg-light.text-dark — "Natural", "Exclude empty grades")
    // ship as a LIGHT chip with dark text, but the dark theme (global .badge.text-dark
    // rule + our `td *` rule) forces the text light → light-on-light = unreadable (the
    // remaining issue). Give them a dark chip surface + light text, matching the global
    // `.badge.bg-secondary` dark treatment (cardBorder bg + bodyText). (1,2,0)+!important
    // beats Bootstrap's `.bg-light` (0,1,0 !important) and our own `td *` rule (1,0,1).
    rules.push('#grade_edit_tree_table .badge.bg-light {');
    rules.push(`  background-color: ${tokens.cardBorder} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('#grade_edit_tree_table .badge.bg-light * {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('');
    // ── Quiz timer (#quiz-timer) — dark text on the always-white timer box ──
    // During a timed quiz attempt the countdown timer (mod/quiz/templates/timer.mustache:
    // `#quiz-timer-wrapper > #quiz-timer.quiz-timer-inner`, the "Time left" text node +
    // `<span id="quiz-time-left">` digits) is painted by Boost's modules.scss as a FIXED
    // white box (`#quiz-timer-wrapper #quiz-timer { background:#fff; border:1px solid
    // #ca3120 }`) with no dark variant. The dark theme leaves the bg white but the text
    // inherits the light $body-color → light-on-white = invisible. User wants the light
    // bg KEPT + dark text → fixed-dark: force d.bodyText (#1d2125, ~16:1 on white).
    // Anchored on the timer's own stable ids (hardcoded 4.4–5.x), NOT the body id, so it
    // covers attempt + summary pages + teacher preview in one rule.
    // `:not([class*="timeleft"])` is CRITICAL: in the last ~100s JS adds .timeleft0–16
    // classes that ramp the box red→pink with their own AA-tuned text — excluding them
    // leaves the low-time warning state untouched. Background/border are never touched.
    rules.push('#quiz-timer-wrapper #quiz-timer:not([class*="timeleft"]),');
    rules.push('#quiz-timer-wrapper #quiz-timer:not([class*="timeleft"]) * {');
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push('}');
    rules.push('');
    // ── Quiz "Time limit" preflight dialog — red Cancel button ──
    // Clicking "Attempt quiz" / "Preview quiz" on a TIMED quiz opens a YUI dialogue
    // (mod_quiz/preflightcheck.js: M.core.dialogue, extraClass .mod_quiz_preflight_popup)
    // that JS portals to <body>. The dialog is WHITE, but the global dark rule
    // `.btn-secondary { color: tokens.bodyText; background: transparent }` (~L903)
    // paints the standard mform Cancel input (input#id_cancel.btn-secondary[name="cancel"],
    // emitted by lib/form/cancel.php) light-grey-on-white → invisible. The Cancel markers
    // (#id_cancel / [data-cancel] / .btn-cancel) are SITE-WIDE (every mform), so we scope to
    // the dialog's unique popup class .mod_quiz_preflight_popup (stable since Moodle 3.1) and
    // never touch other forms' cancels. User chose a solid RED/warning button: d.error
    // (#ca3120 — white-on-red 5.29:1, WCAG AA; NOT tokens.error #F64747 which is only 3.55:1).
    // d.error (the light-theme default red) because the modal is a fixed WHITE surface — same
    // fixed-dark reasoning as the quiz-timer / #116 modal fixes. The green "Start attempt"
    // (name="submitbutton") is untouched.
    rules.push('.mod_quiz_preflight_popup #id_cancel,');
    rules.push('.mod_quiz_preflight_popup input[name="cancel"],');
    rules.push('.mod_quiz_preflight_popup .btn-cancel input {');
    rules.push(`  background-color: ${d.error} !important;`);
    rules.push('  color: #FFFFFF !important;');
    rules.push(`  border-color: ${d.error} !important;`);
    rules.push('}');
    // Keep it solid red on hover/focus (beat the global `.btn-secondary:hover` translucent-
    // white rule, ~L908) with a subtle darken for affordance.
    rules.push('.mod_quiz_preflight_popup #id_cancel:hover,');
    rules.push('.mod_quiz_preflight_popup #id_cancel:focus,');
    rules.push('.mod_quiz_preflight_popup input[name="cancel"]:hover,');
    rules.push('.mod_quiz_preflight_popup input[name="cancel"]:focus,');
    rules.push('.mod_quiz_preflight_popup .btn-cancel input:hover,');
    rules.push('.mod_quiz_preflight_popup .btn-cancel input:focus {');
    rules.push(`  background-color: ${d.error} !important;`);
    rules.push('  color: #FFFFFF !important;');
    rules.push(`  border-color: ${d.error} !important;`);
    rules.push('  filter: brightness(0.92);');
    rules.push('}');
    rules.push('');
    // ── Quiz navigation buttons (#mod_quiz_navblock .qnbutton) — per-state colours ──
    // The "Quiz navigation" panel shows numbered question buttons (a.qnbutton). The
    // visible number is a BARE TEXT NODE coloured by inherited body text, which our dark
    // rules push near-white → it washes out on Moodle's state-coloured buttons (esp. the
    // red incorrect/notanswered strip). Moodle puts the state colour on the lower
    // `.trafficlight` strip + a ✓/✗ pix glyph (a background-IMAGE). User asked for a clear
    // colour combination for finished quizzes → SOLID per-state fills + a fixed-dark
    // number `d.bodyText` (#1d2125), which passes WCAG AA on every state bg: lime 12.7:1,
    // red #F64747 4.56:1, amber 8.3:1, grey 6.2:1 (and Dark Ember green #4CAF50 5.8:1). We
    // fill BOTH the button and its `.trafficlight` (overriding only background-color, so
    // the ✓/✗ glyph image survives → state still conveyed non-chromatically, WCAG 1.4.1).
    // Backgrounds follow the active dark preset via the semantic tokens. Base (not-yet-
    // answered / answersaved, during an attempt) → a light surface so the dark number
    // reads; the graded states override it. Scoped to #mod_quiz_navblock (with the
    // .path-mod-quiz body class for specificity), so no other buttons are affected; the
    // block appears on review/attempt/summary pages alike. Dark presets only.
    // Base: dark number on a light surface (covers notyetanswered/answersaved).
    rules.push('.path-mod-quiz #mod_quiz_navblock .qnbutton {');
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push('  background-color: #FFFFFF !important;');
    rules.push('}');
    // Correct → success (lime on Dark Lime / green on Dark Ember).
    rules.push('.path-mod-quiz #mod_quiz_navblock .qnbutton.correct,');
    rules.push('.path-mod-quiz #mod_quiz_navblock .qnbutton.correct .trafficlight {');
    rules.push(`  background-color: ${tokens.success} !important;`);
    rules.push('}');
    // Incorrect → error red (#F64747; dark number = 4.56:1 AA, white would fail at 3.55).
    rules.push('.path-mod-quiz #mod_quiz_navblock .qnbutton.incorrect,');
    rules.push('.path-mod-quiz #mod_quiz_navblock .qnbutton.incorrect .trafficlight {');
    rules.push(`  background-color: ${tokens.error} !important;`);
    rules.push('}');
    // Partially correct → warning amber.
    rules.push('.path-mod-quiz #mod_quiz_navblock .qnbutton.partiallycorrect,');
    rules.push('.path-mod-quiz #mod_quiz_navblock .qnbutton.partiallycorrect .trafficlight {');
    rules.push(`  background-color: ${tokens.warning} !important;`);
    rules.push('}');
    // Not answered (finished, never answered) → muted grey, distinct from incorrect red.
    // Moodle paints this state's trafficlight red, so we recolour the strip too.
    rules.push('.path-mod-quiz #mod_quiz_navblock .qnbutton.notanswered,');
    rules.push('.path-mod-quiz #mod_quiz_navblock .qnbutton.notanswered .trafficlight {');
    rules.push(`  background-color: ${tokens.mutedText} !important;`);
    rules.push('}');
    rules.push('');
    // ── Multichoice / true-false answer radios — redraw so the SELECTED one is a
    //    clear light disc on the dark surface (#133) ──
    // Moodle's qtype_multichoice (single) and qtype_truefalse render their answer
    // options as RAW native `<input type="radio">` inside `.que .answer div.r0/.r1`
    // — WITHOUT Bootstrap's `.form-check-input` class, so the generic dark
    // `.form-check-input` rule above never matches them. With `.formulation` now a
    // dark surface (#132), the browser's native radio sits on a dark card and the
    // SELECTED option is barely distinguishable from the unchecked ones — on BOTH the
    // review page (radios `disabled`) AND the attempt/preview window (radios enabled).
    //
    // We can't fix this with colour alone: `accent-color` is ignored on the disabled
    // review radios, and a `filter:` on the native control does NOT reliably render
    // white on macOS (verified on the real site — DevTools showed the filter applied
    // but the radio stayed grey, because a native radio's fill is transparent). The
    // robust, cross-platform fix is to STRIP the native appearance (`appearance:none`)
    // and paint our own circle. `opacity:1` defeats the UA's disabled-control dimming.
    //
    // Category: this is a redraw of a native form control (not a colour token swap),
    // sized in px and shaped with border-radius — the values that are not theme
    // colours (sizes, radius) are intrinsic to the control, like the filter idiom
    // used for PIX images. The two COLOURS DO use tokens: muted ring + light fill.
    //
    // Both states are redrawn (not just `:checked`) so all options share one size and
    // baseline — a native/custom mix would misalign. Scope stays tight:
    //   • `input[type="radio"]` only → multi-answer checkboxes and text/select/
    //     textarea qtypes are untouched.
    //   • `[id^="page-mod-quiz-"]` → quiz attempt/review/summary/preview pages only
    //     (same prefix-anchor precedent as #122/#123), never global radios; emitted
    //     only inside `if (darkMode)`, so the 8 light presets get nothing.
    rules.push('[id^="page-mod-quiz-"] .que .answer input[type="radio"] {');
    rules.push('  -webkit-appearance: none !important;');
    rules.push('  appearance: none !important;');
    rules.push('  width: 16px !important;');
    rules.push('  height: 16px !important;');
    rules.push('  border-radius: 50% !important;');
    rules.push(`  border: 2px solid ${tokens.mutedText} !important;`);
    rules.push('  background-color: transparent !important;');
    rules.push('  background-image: none !important;');
    rules.push('  opacity: 1 !important;');
    rules.push('  vertical-align: middle !important;');
    rules.push('}');
    // Checked → solid light disc (light border + light fill), unmistakable vs the
    // hollow muted ring of the unchecked options.
    rules.push('[id^="page-mod-quiz-"] .que .answer input[type="radio"]:checked {');
    rules.push(`  border-color: ${tokens.bodyText} !important;`);
    rules.push(`  background-color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('');
    // ── Tooltips — accent text on dark (#134) ──
    // Bootstrap's `.tooltip` is portalled to <body>, OUTSIDE every dark container the
    // generator overrides (.bg-white / .card / .popover / .drawer), so none of those
    // dark-text rules reach `.tooltip-inner`. Under Bootstrap 5.3 (Moodle 5.x) the
    // tooltip text defaults to `var(--bs-body-bg)` → the dark theme makes it DARK on
    // the near-black box → unreadable (e.g. the "Open block drawer" toggle tooltip).
    // Recolour the text to the theme accent (`linkColour` = lime on Dark Lime / orange
    // on Dark Ember). Tooltips are generic body-portalled `.tooltip` elements with no
    // back-reference to their trigger, so there's no selector for just one — this
    // (correctly) covers ALL tooltips, which all share the same dark-on-dark problem.
    // Colour only: Moodle's existing near-black box is kept (best contrast — lime
    // ≈10:1, orange ≈5.8:1). `.tooltip-inner` is specificity (0,1,1) tying Bootstrap's
    // own rule, so `!important` is required.
    rules.push('.tooltip .tooltip-inner {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    rules.push('');
    // ── Icon buttons (.btn-icon) — accent glyph on hover (#135) ──
    // Moodle's `.btn-icon:hover` hardcodes a LIGHT-grey background (`$gray-200`
    // #e9ecef, no dark variant). On a dark theme the glyph keeps its light resting
    // colour (`drawerText`/`bodyText` #F0EEEE), so on hover a light icon sits on a
    // light box → invisible (e.g. the course-index "Course index options" three-dot
    // button, the drawer open/close toggles, section action menus — all share
    // `.btn-icon`). Recolouring the glyph ALONE does not fix it: lime on #e9ecef is
    // ~1.3:1. So on HOVER ONLY we (1) neutralise Moodle's pale box (transparent → the
    // glyph sits back on the dark surface) and (2) turn the glyph the accent
    // `linkColour` (lime / orange) → lime-on-dark ≈ 11:1. `:hover` only, so the resting
    // and active/open (`.show`) states are untouched (the user's constraint).
    // `:not(.icons-collapse-expand)` leaves the section collapse/expand toggles to
    // their existing handling. Broad `.btn-icon` so every icon button with this bug is
    // fixed at once. `!important` beats Moodle's `!important` resting colour + hover bg.
    rules.push('.btn-icon:not(.icons-collapse-expand):hover {');
    rules.push('  background-color: transparent !important;');
    rules.push('}');
    rules.push('.btn-icon:not(.icons-collapse-expand):hover .icon,');
    rules.push(`.btn-icon:not(.icons-collapse-expand):hover .fa { color: ${tokens.linkColour} !important; }`);
    rules.push('');

    // ── Student grade "User report" table (#136, + teacher route #144) ──
    // The `.user-grade` table renders in TWO routes that NEVER share a body class:
    //   • grade/report/user/index.php → body `.path-grade-report-user` (the student's
    //     OWN report + teacher "User report" via the Grades dropdown).
    //   • course/user.php?mode=grade  → body `.path-course-user`, wrapping the SAME
    //     table in a literal `<div class="grade-report-user">` (teacher → Participants
    //     → student → Grades). Moodle adds that div "to share styles with the real
    //     report page" — it is the only stable hook in this route (the body id/class
    //     is NOT `grade-report-*`). #144 was exactly this route rendering light.
    // Moodle's PLUGIN CSS `grade/report/user/styles.css` DUAL-anchors every rule
    // (`.path-grade-report-user …, .grade-report-user …`) with HARDCODED light hex
    // (#f8f9fa cells, white item/category rows, #dee2e6 borders — no SCSS vars, so
    // identical 4.4/4.5/5.0) and NO dark variant → on a dark theme the cells stay
    // light while the forced-light body text washes out. #136 only emitted the
    // `.path-grade-report-user` half, so the teacher Participants route (body
    // `.path-course-user`) stayed light. Mirror Moodle's own dual-anchor: emit the
    // IDENTICAL dark-surface treatment under BOTH prefixes (loop below) so one rule
    // set covers every context. Same dark-surface + light/lime approach as the
    // gradebook-setup (#126) and quiz-view (#122) fixes: dark `cardBg` surface, light
    // `bodyText` text (CFA Light Grey #F0EEEE), lime/orange `linkColour` links.
    // Notes carried from #136: (a) the bright WHITE frame + row/section separators
    // come from the GLOBAL `var(--bs-border-color)` (Bootstrap #dee2e6), NOT the table
    // var — Moodle's `.generaltable th/td` draws `border-top: … var(--bs-border-color)`
    // — so redefine the global var on the route prefix (it cascades to the table,
    // cells, and wrappers). (b) The thick light "frame" is NOT a border — it is the
    // `.user-report-container` wrapper, painted `background-color: #f8f9fa` with 10px
    // padding, so repaint it `cardBg` to blend the padding in. (c) The activity item
    // icon is an IMG-based PIX "monologo" (`img.icon.itemicon`), not FontAwesome, so
    // `color` can't touch it → recolour via `filter: brightness(0) invert(1)`. Anchored
    // on the route prefix + the unique `.user-grade` table class (NOT the body id,
    // which keeps the `-index` suffix on /index.php — documented gotcha). All
    // `!important` (Moodle's plugin rules are un-important, so we win regardless).
    ['.path-grade-report-user', '.grade-report-user'].forEach((p) => {
      rules.push(`${p} {`);
      rules.push(`  --bs-border-color: ${tokens.cardBorder};`);
      rules.push('}');
      rules.push(`${p} .user-report-container {`);
      rules.push(`  background-color: ${tokens.cardBg} !important;`);
      rules.push('}');
      rules.push(`${p} .user-grade {`);
      rules.push(`  --bs-table-bg: ${tokens.cardBg};`);
      rules.push(`  --bs-table-color: ${tokens.bodyText};`);
      rules.push(`  --bs-table-border-color: ${tokens.cardBorder};`);
      rules.push(`  --bs-border-color: ${tokens.cardBorder};`);
      rules.push('}');
      rules.push(`${p} .user-grade,`);
      rules.push(`${p} .user-grade thead,`);
      rules.push(`${p} .user-grade tbody,`);
      rules.push(`${p} .user-grade tr,`);
      rules.push(`${p} .user-grade th,`);
      rules.push(`${p} .user-grade td,`);
      rules.push(`${p} .user-grade tr th {`);
      rules.push(`  border-color: ${tokens.cardBorder} !important;`);
      rules.push('}');
      rules.push(`${p} .user-grade th,`);
      rules.push(`${p} .user-grade td,`);
      rules.push(`${p} .user-grade tr th {`);
      rules.push(`  background-color: ${tokens.cardBg} !important;`);
      rules.push(`  color: ${tokens.bodyText} !important;`);
      rules.push('}');
      rules.push(`${p} .user-grade th *,`);
      rules.push(`${p} .user-grade td * {`);
      rules.push(`  color: ${tokens.bodyText} !important;`);
      rules.push('}');
      rules.push(`${p} .user-grade a:not(.btn) {`);
      rules.push(`  color: ${tokens.linkColour} !important;`);
      rules.push('}');
      rules.push(`${p} .user-grade .icon:not([class*="text-"]),`);
      rules.push(`${p} .user-grade .fa:not([class*="text-"]) {`);
      rules.push(`  color: ${tokens.bodyText} !important;`);
      rules.push('}');
      rules.push(`${p} .user-grade img.icon,`);
      rules.push(`${p} .user-grade img.itemicon {`);
      rules.push('  filter: brightness(0) invert(1) !important;');
      rules.push('}');
      rules.push(`${p} .user-grade .text-muted,`);
      rules.push(`${p} .user-grade .dimmed_text,`);
      rules.push(`${p} .user-grade small {`);
      rules.push(`  color: ${tokens.mutedText} !important;`);
      rules.push('}');
    });
    rules.push('');

    // ── Gradebook cell-actions three-dot icon (#137) ──
    // `.cellmenubtn` (core_grades `grade/templates/cellmenu.mustache`) is the grade
    // "..." cell action menu shown across the grader report + user report + single
    // view. Markup: `<button class="btn btn-icon cellmenubtn"><i class="icon fa
    // fa-ellipsis-h">`. Moodle gives `.cellmenubtn` no colour of its own, so the
    // generic dark `.icon, .fa { color: ${d.bodyText} }` rule paints the glyph dark
    // → BLACK on the dark navbar/table at rest (the user's complaint). Re-light the
    // RESTING glyph to the theme's light text (`bodyText` = CFA Light Grey #F0EEEE,
    // reads as white). Hover is already the accent lime/orange via the broad
    // `.btn-icon:not(.icons-collapse-expand):hover` rule (#135), so the designed
    // behaviour is white at rest → lime on hover ("clickable → lime"). Scoped to the
    // unique, grade-only `.cellmenubtn` (NOT all `.btn-icon`) so it covers the three-
    // dots in BOTH reports without touching icons on light-surface modals. Specificity
    // (0,2,0) + `!important` beats the generic `.icon,.fa` (0,1,0) rule.
    rules.push('.cellmenubtn .icon,');
    rules.push('.cellmenubtn .fa {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('');

    // ── Course-listing enrolment-method icons (#138) ──
    // `.enrolmenticons` (core `course_enrolment_icons()`, inside `.coursebox .info`)
    // holds the per-course enrolment glyphs on the course/category listing —
    // self enrolment `<i class="icon fa-solid fa-right-to-bracket">`, plus `fa-key`,
    // `fa-lock`, `fa-lock-open` (guest). They are plain FontAwesome `<i class="icon
    // fa-...">` (so `color:` is the lever, NOT `filter:`) sitting on the DARK page
    // background of each course card. The generic dark `.icon, .fa { color:
    // ${d.bodyText} }` rule paints them dark → dark-on-dark, unreadable (the user's
    // complaint). Re-light to the theme's light text (`bodyText` = CFA Light Grey
    // #F0EEEE, reads as white). No enrolment icon carries a `.text-*` semantic class
    // (verified vs core `enrol/*/lib.php` icon maps — the meaning lives in the
    // title/aria-label, not the colour), so a blanket re-colour is safe and no
    // `:not([class*="text-"])` guard is needed. Container `.enrolmenticons` is stable
    // across Moodle 4.4 / 4.5 / 5.0. Specificity (0,2,0) + `!important` beats the
    // generic `.icon,.fa` (0,1,0) rule. Same resting-state re-light pattern as #137.
    rules.push('.enrolmenticons .icon,');
    rules.push('.enrolmenticons .fa {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('');

    // ── Footer "Show footer" help-button icon (#139) ──
    // The floating circular help button at the bottom-right of every page —
    // Boost `footer.mustache`: `<button class="btn btn-icon rounded-circle
    // bg-secondary btn-footer-popover" data-action="footer-popover"><i class="icon
    // fa fa-question fa-fw">` (the `?`). The icon is a plain FontAwesome glyph (so
    // `color:` is the lever, no `.text-*` class). Two facts make the `?` invisible
    // on dark themes: (1) the dark footer rule `#page-footer * { color: footerText
    // #F0EEEE }` paints the glyph near-white, and (2) the button keeps Moodle's
    // default LIGHT `.bg-secondary` (the dark presets do NOT override
    // `secondaryColour`, so `$secondary` stays `#ced4da`) → near-white on light grey
    // ≈ 1.2:1. Simply recolouring the glyph lime would be WORSE (lime on #ced4da ≈
    // 1.2:1, the documented "lime on light grey fails" trap, #135). So — per the
    // user's choice — darken JUST this one button to the dark card surface and make
    // the `?` lime green: lime `infoIconColour` (#BAF73C on BOTH dark presets, unlike
    // `linkColour` which is orange on Dark Ember) on `cardBg` ≈ 9–11:1. Scoped to the
    // stable `.btn-footer-popover` hook (NOT `rounded-circle`/`icon-no-margin`, which
    // churn between Moodle 4.x and 5.x) under the `#page-footer` ID. The bg rule
    // (1,1,0) beats Boost's `.bg-secondary` (0,1,0)!important; the icon rule (1,2,0)
    // beats the footer `#page-footer *` (1,0,0)!important. Both win over the #135
    // `.btn-icon:hover` rules (ID > classes) → dark circle + lime `?` in every state.
    rules.push('#page-footer .btn-footer-popover {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push('}');
    rules.push('#page-footer .btn-footer-popover .icon,');
    rules.push('#page-footer .btn-footer-popover .fa {');
    rules.push(`  color: ${tokens.infoIconColour} !important;`);
    rules.push('}');
    rules.push('');

    // ── Messaging drawer: full dark conversation surface (#140) ──
    // Moodle's message templates HARDCODE the conversation surfaces LIGHT (via
    // `bg-white`/`bg-light` classes in the markup, NOT SCSS): the conversation
    // header bar (avatar + name + "Online"), the footer bar holding the composer,
    // the message `<textarea data-region="send-message-txt" class="form-control
    // bg-light">`, and the emoji picker's `.input-group-text.bg-white` search chip.
    // The generator's philosophy is "`.bg-white` = always-light surface, just darken
    // its TEXT (#1d2125)" — correct for real white panels, but wrong inside the dark
    // message drawer: it leaves the bars light (clashing with the dark drawer) and on
    // the emoji picker (whose `.card` bg IS dark) it paints the `.category-name`
    // headings ("Recent", "Smileys & emotion") dark-on-dark → invisible (the user's
    // DevTools showed `.bg-white * { color:#1d2125 }` hitting them). Per the user,
    // make the WHOLE conversation window one cohesive dark panel: repaint the
    // hardcoded-light sub-surfaces to the dark drawer/card colours, force plain TEXT
    // light (`bodyText`) and interactive ICONS + links to the theme ACCENT
    // (`linkColour` — lime on Dark Lime, orange on Dark Ember; matches the contacts
    // list, which already lights its icons via `.view-overview-body .icon`).
    // Scoped to `.message-app` (+ standalone `.emoji-picker`, which JS can portal out
    // of the drawer); the message LIST/bubbles are NOT `.bg-white` so they keep
    // Moodle's auto-contrast, and the native colour-emoji glyphs (`String.fromCodePoint`)
    // are never `.icon`/`.fa` so they stay untouched. Appended last so it beats the
    // global `.bg-white *` (L~612) by specificity AND source order. Dark presets only.
    // (a) the hardcoded-light bars + chips → dark drawer surface; replace the bar's
    //     light/brand border (the stray bright line) with the dark drawer border.
    rules.push('.message-app .bg-white,');
    rules.push('.message-app .bg-light {');
    rules.push(`  background-color: ${tokens.drawerBg} !important;`);
    rules.push(`  border-color: ${tokens.drawerBorder} !important;`);
    rules.push('}');
    // (b) plain text on those bars (name, "Online", labels) → light. (0,2,0) beats the
    //     global `.bg-white *` (0,1,0).
    rules.push('.message-app .bg-white *,');
    rules.push('.message-app .bg-light * {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    // (c) interactive icons (send / emoji toggle / actions) + links → theme accent.
    //     (0,3,0)/(0,2,1) beats rule (b) above so icons read as "clickable" lime.
    rules.push('.message-app .bg-white .icon,');
    rules.push('.message-app .bg-white .fa,');
    rules.push('.message-app .bg-light .icon,');
    rules.push('.message-app .bg-light .fa,');
    rules.push('.message-app .bg-white a {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    // (d) the message composer textarea → a raised dark field (cardBg) with light text
    //     and a muted placeholder. (0,2,1) beats rule (a)'s drawerBg for this input.
    rules.push('.message-app textarea[data-region="send-message-txt"],');
    rules.push('.message-app .footer-container textarea.form-control {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('.message-app textarea[data-region="send-message-txt"]::placeholder {');
    rules.push(`  color: ${tokens.mutedText} !important;`);
    rules.push('}');
    // (e) emoji picker (a Bootstrap `.card`; may portal out of `.message-app`) → dark
    //     card surface, light category headings/labels, accent FA icons. The native
    //     emoji glyphs are plain Unicode (not `.icon`/`.fa`) → left in full colour.
    rules.push('.emoji-picker,');
    rules.push('.emoji-picker .card,');
    rules.push('.emoji-picker .card-header,');
    rules.push('.emoji-picker .card-body,');
    rules.push('.emoji-picker .card-footer,');
    rules.push('.emoji-picker .input-group-text {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('.emoji-picker .category-name,');
    rules.push('.emoji-picker .input-group-text,');
    rules.push('.emoji-picker .emoji-short-name,');
    rules.push('.emoji-picker .text-muted {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('.emoji-picker .icon,');
    rules.push('.emoji-picker .fa {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    rules.push('');

    // ── Emoji picker: search box dark field (#148, extends #140) ──
    // The emoji picker's search input (`lib/templates/emoji/picker.mustache` →
    // `<input class="form-control border-start-0" data-region="search-input">` inside
    // `.emoji-picker .card-body .input-group`) stayed WHITE on dark themes. #140 made
    // the picker `.card`/`.card-body`/`.input-group-text` chip + icons dark, but never
    // the `.form-control` input. The input sits inside the message-drawer conversation
    // footer whose root is `<div class="… bg-white …">`
    // (`message_drawer_view_conversation_footer.mustache`), so the generator's OWN
    // "white-bg final overrides" rule (`.bg-white .form-control { color: ${d.bodyText}
    // (#1d2125); background-color: #FFFFFF }`, L~1050-1060, cascade layer 5) forces it
    // white-bg + dark-text — correct for real white dialogs, wrong for this dark drawer.
    // Repaint the input to the dark `cardBg` field (matching the already-dark chip, so
    // the `border-start-0` join reads as one dark pill) + light `bodyText` + `mutedText`
    // placeholder. The magnifier chip + glyph are ALREADY dark/accent from #140 — not
    // re-asserted here. `:focus` included so Bootstrap's focus state can't revert it.
    // Selector `.emoji-picker .input-group .form-control` (0,3,0) beats the culprit
    // `.bg-white .form-control` (0,2,0) regardless of source order (a bare
    // `.emoji-picker .form-control` would be a fragile (0,2,0) tie). The full card
    // picker is messaging-only in stock Moodle (the inline `:smile:` autocomplete +
    // TinyMCE emoji use other templates), and this is dark-gated, so global
    // `.emoji-picker` scope is safe. Stable 4.4/4.5/5.0. Dark presets only.
    rules.push('.emoji-picker .input-group .form-control,');
    rules.push('.emoji-picker .input-group .form-control:focus {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('.emoji-picker .input-group .form-control::placeholder {');
    rules.push(`  color: ${tokens.mutedText} !important;`);
    rules.push('}');
    rules.push('');

    // ── Messaging drawer: search view dark surface (#147, extends #140) ──
    // The drawer's SEARCH view (`message_drawer_view_search_header.mustache`, rendered
    // INSIDE `.message-app`) was left light by #140 for two reasons:
    //  (1) the search field `<input class="form-control" data-region="search-input">`
    //      carries NO `.bg-white`/`.bg-light` class — it is white purely from
    //      Bootstrap's default `$input-bg` (#fff) — so #140's `.bg-white`/`.bg-light`
    //      repaint never matched it; and
    //  (2) Moodle's `theme/boost/scss/moodle/search.scss` hardcodes the submit button
    //      LIGHT: `.simplesearchform .btn-submit { background-color: $gray-100 (#f8f9fa);
    //      color: $gray-600 }`, and the pre-#140 rule above (`.simplesearchform
    //      .btn-submit .icon { color: ${d.bodyText} }`) forces that magnifier DARK
    //      (it assumed the box stays white) → once we darken the box it'd be invisible.
    // Make the whole search box one cohesive dark field, matching the #140 composer
    // textarea: dark `cardBg` input + light `bodyText` + `mutedText` placeholder, the
    // button on the same `cardBg` with the magnifier flipped to the theme accent
    // (`linkColour` — lime/orange), like the rest of the drawer's interactive icons.
    // MUST scope to `.message-app` — `.simplesearchform` is a GENERIC class shared by
    // the navbar global search + course search box (which use `data-region="input"`,
    // not `search-input`); a bare rule would leak to them. Specificity is the safety
    // net: the input `.message-app .simplesearchform .form-control` (0,3,0) beats
    // Bootstrap `.form-control` (0,1,0), the generator's global `.form-control` (0,1,0)
    // and any `.bg-white .form-control` (0,2,0); the button (0,3,0) beats Moodle's
    // `.simplesearchform .btn-submit` (0,2,0); the icon (0,4,0) + later source order
    // beats the pre-#140 `.simplesearchform .btn-submit .icon` (0,2,0). Dark presets only.
    rules.push('.message-app .simplesearchform .form-control,');
    rules.push('.message-app .simplesearchform input[data-region="search-input"] {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('.message-app .simplesearchform .form-control::placeholder,');
    rules.push('.message-app .simplesearchform input[data-region="search-input"]::placeholder {');
    rules.push(`  color: ${tokens.mutedText} !important;`);
    rules.push('}');
    rules.push('.message-app .simplesearchform .btn-submit {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('.message-app .simplesearchform .btn-submit .icon,');
    rules.push('.message-app .simplesearchform .btn-submit .fa {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    rules.push('');

    // ── Calendar month-view day-cell hover (#141) ──
    // Moodle's `calendar.scss` hovers a clickable month day cell to a LIGHT grey:
    // `.maincalendar .calendarmonth .clickable:hover { background-color: #ededed }`
    // (`$calendar-month-clickable-bg`, no `!important`, stable 4.4–5.x). The day
    // cells are otherwise transparent and show the dark `pageBg`, so on hover they
    // flip to light grey and the light date number (`.day-number`) + lime/orange
    // event links (`.eventname`) become invisible (the user's complaint). Override
    // the hover with a DARK surface so the existing light text/links read again.
    // NOTE: a first pass used `cardBg`, but on dark themes `cardBg` (#2D2D2E) is too
    // close to the resting `pageBg` (#404041) → the hover looked like "no effect".
    // So use `drawerBg` (#1D2125 — the theme's DARKEST surface, clearly darker than
    // BOTH `pageBg` and `cardBg` on either dark preset, so the cell visibly drops on
    // hover regardless of the resting shade) PLUS a 2px inset `linkColour` ring (lime
    // on Dark Lime / orange on Dark Ember) as an unmistakable, on-brand hover cue.
    // `box-shadow: inset` adds no layout shift (the cell doesn't reflow). Contrast on
    // `drawerBg`: date ≈14:1, lime link ≈13:1, orange link ≈6:1 — all comfortably AA
    // on BOTH dark presets (the lighter `cardBorder` was rejected: orange link 2.67:1
    // on Ember). Anchored `#region-main .maincalendar .calendarmonth .clickable:hover`
    // = (1,3,0) → beats Moodle's (0,3,0) non-important rule; `#region-main` scopes it
    // to the main month grid, not the mini-calendar block (own `inherit` + circle-tint
    // hover). The today-circle (`$primary`) + `.dayblank` padding cells are untouched.
    // Dark presets only.
    rules.push('#region-main .maincalendar .calendarmonth .clickable:hover {');
    rules.push(`  background-color: ${tokens.drawerBg} !important;`);
    rules.push(`  box-shadow: inset 0 0 0 2px ${tokens.linkColour} !important;`);
    rules.push('}');
    rules.push('');

    // ── Move-block YUI dialog — dark surface (#142) ──
    // Clicking a block's move/drag icon (Dashboard edit mode) opens a YUI
    // `M.core.dialogue` titled "Move <block>". It is a GENERIC dialogue (same base
    // class as the file picker / activity chooser) with NO distinguishing class or
    // id, portalled to `<body>`. Moodle paints it white from ONE place —
    // `.moodle-dialogue-base .moodle-dialogue-wrap { background-color: $white;
    // border: 1px solid #ccc }` (core.scss); the `-hd`/`-bd`/`-ft` are transparent
    // over the wrap (the header "grey bar" is just its `border-bottom: #dee2e6`).
    // The generator deliberately keeps ALL `.moodle-dialogue-bd` white-with-dark-text
    // (L~608-623) + lime links — so on this dialog the lime `.aalink` drop-targets
    // sit on white ≈ unreadable (the user's complaint). The dialog's ONLY unique
    // marker is its body content `<ul class="dragdrop-keyboard-drag">` (unique to the
    // block-move dialog — the file picker/datatables don't have it), so `:has()`
    // scopes JUST this dialog dark and leaves the other YUI dialogs white as intended.
    // (:has() is Baseline-2023, fine for Moodle 5.x's browsers; first use in the gen.)
    // Repaint the wrap to the dark popup surface (`cardBg`, like dropdowns/cards),
    // override the hd border, flip header/body/close-× text light (`bodyText`), and
    // keep the drop-target links at the accent `linkColour` (now readable on dark:
    // lime ≈10:1, orange ≈4.6:1). Specificity: the `.moodle-dialogue-base:has(…)`
    // qualifier adds a class over the global rules — text `(0,3,0)` beats the global
    // `.moodle-dialogue-bd *` `(0,2,0)`!important; links `(0,3,1)` beat `.moodle-
    // dialogue-bd a` `(0,2,1)`!important. Dark presets only.
    rules.push('.moodle-dialogue-base:has(.dragdrop-keyboard-drag) .moodle-dialogue-wrap {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('.moodle-dialogue-base:has(.dragdrop-keyboard-drag) .moodle-dialogue-hd {');
    rules.push(`  border-bottom-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('.moodle-dialogue-base:has(.dragdrop-keyboard-drag) .moodle-dialogue-hd,');
    rules.push('.moodle-dialogue-base:has(.dragdrop-keyboard-drag) .moodle-dialogue-hd *,');
    rules.push('.moodle-dialogue-base:has(.dragdrop-keyboard-drag) .moodle-dialogue-bd,');
    rules.push('.moodle-dialogue-base:has(.dragdrop-keyboard-drag) .moodle-dialogue-bd *,');
    rules.push('.moodle-dialogue-base:has(.dragdrop-keyboard-drag) .closebutton {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('.moodle-dialogue-base:has(.dragdrop-keyboard-drag) .dragdrop-keyboard-drag a,');
    rules.push('.moodle-dialogue-base:has(.dragdrop-keyboard-drag) .dragdrop-keyboard-drag a:hover {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    // On CLICK/FOCUS, Moodle's accessibility focus style (`.aalink:focus`,
    // `[role="button"]:focus`) paints the focused drop-target item a LIGHT highlight
    // → the lime link text washes out on it (the user's "invisible when clicked").
    // The focus highlight is always light, so flip the focused/active link text to
    // the fixed-dark default (`d.bodyText` #1d2125, ≈ black) — a fixed-dark-on-light
    // case, like the other always-light surfaces. (0,4,1) [extra `:focus` class] beats
    // the dialog's own lime link rule (0,3,1) and Moodle's `.aalink:focus` (≈0,2,0).
    rules.push('.moodle-dialogue-base:has(.dragdrop-keyboard-drag) .dragdrop-keyboard-drag a:focus,');
    rules.push('.moodle-dialogue-base:has(.dragdrop-keyboard-drag) .dragdrop-keyboard-drag a:focus-visible,');
    rules.push('.moodle-dialogue-base:has(.dragdrop-keyboard-drag) .dragdrop-keyboard-drag a:active {');
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push('}');
    rules.push('');

    // ── Quiz "Time limit" preflight dialog — dark surface (#154) ──
    // The YUI `M.core.dialogue` opened from "Attempt/Preview quiz" on a timed quiz
    // (class `.mod_quiz_preflight_popup`, portalled to <body>) renders WHITE on dark
    // themes: Moodle `core.scss` paints `.moodle-dialogue-wrap { background: $white }`
    // + header `border-bottom: 1px solid #dee2e6`, and the generator deliberately keeps
    // generic `.moodle-dialogue-bd` white-with-dark-text (L~640). Repaint THIS dialog to
    // the CFA dark card, mirroring the #142 move-dialog. Scoped to the popup's unique
    // class so other YUI dialogs (file picker, datatables) stay white.
    rules.push('.mod_quiz_preflight_popup .moodle-dialogue-wrap {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('.mod_quiz_preflight_popup .moodle-dialogue-hd {');
    rules.push(`  border-bottom-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    // Light text on the header + body. Exclude the buttons (`:not(.btn):not(button)
    // :not(input):not(a)`) so the green "Start attempt" (Buttons section) and red
    // "Cancel" (#129) keep their own colours; links handled separately below.
    rules.push('.mod_quiz_preflight_popup .moodle-dialogue-hd,');
    rules.push('.mod_quiz_preflight_popup .moodle-dialogue-hd *,');
    rules.push('.mod_quiz_preflight_popup .moodle-dialogue-bd,');
    rules.push('.mod_quiz_preflight_popup .moodle-dialogue-bd *:not(.btn):not(button):not(input):not(a),');
    rules.push('.mod_quiz_preflight_popup .closebutton {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('.mod_quiz_preflight_popup .moodle-dialogue-bd a,');
    rules.push('.mod_quiz_preflight_popup .moodle-dialogue-bd a:hover {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    rules.push('');

    // ── Focused content links — dark text on Moodle's light focus highlight (#143) ──
    // Generalises the #142 move-dialog focus fix. Moodle Boost `core.scss` has ONE
    // rule ("Rule A") that paints a LIGHT box behind a focused link AND sets dark
    // text on it — its own intent:
    //   .aalink, a:not([class]), .arrow_link, .activityinstance > a,
    //   #page-footer a:not([class]) { &:focus, &.focus {
    //     color: $gray-900; background-color: lighten($primary, 50%); } }
    // (no `!important`, stable 4.4–5.x). On dark themes our global
    // `a:hover, a:focus { color: ${tokens.linkHover} !important }` OVERRODE Moodle's
    // dark `$gray-900` (our `!important` wins) while Moodle's un-important LIGHT
    // `background-color` still applied → lime/orange link text on a pale box →
    // unreadable (the user's "invisible when clicked": course-name `.aalink`,
    // "Teacher:"/category class-less `<a>`, etc.). Fix = RESTORE the dark text Moodle
    // intended, on EXACTLY Rule A's selectors (the only ones that get the light box),
    // via the fixed-dark token `d.bodyText` (#1d2125 ≈ $gray-900). This is inherently
    // safe everywhere: Rule A always pairs these selectors with a light box, so dark
    // text is always correct — and it can't hit buttons/`[role=button]`/`.nav-link`
    // (Moodle "Rule B" gives THOSE only a translucent focus ring, NO light fill), so
    // the navbar/drawer/dropdown/button dark-bg focus states are untouched. No region
    // scoping or `:not()` chains needed. Cover `:focus`, `.focus` (JS-set), `:active`.
    // Specificity: `.aalink:focus` (0,2,0) / `a:not([class]):focus` (0,2,1) beat the
    // global `a:hover, a:focus` (0,1,1)!important and Moodle's un-important Rule A.
    rules.push('.aalink:focus, .aalink.focus, .aalink:active,');
    rules.push('a:not([class]):focus, a:not([class]).focus, a:not([class]):active,');
    rules.push('.arrow_link:focus, .arrow_link.focus,');
    rules.push('.activityinstance > a:focus, .activityinstance > a.focus,');
    rules.push('#page-footer a:not([class]):focus {');
    rules.push(`  color: ${d.bodyText} !important;`);
    rules.push('}');
    rules.push('');

    // ── Grader report — dark surface for Moodle's light-painted cells (#145) ──
    // Course → Grades → Grader report (`grade/report/grader`, body class
    // `.path-grade-report-grader`, wrapper `.gradeparent`, table `#user-grades`).
    // Moodle's `grade.scss` paints grader cells LIGHT (no dark variant, NO `!important`,
    // identical 4.4–5.x): `tr .cell, .floater .cell { background-color: $pagination-bg
    // (#fff) }` (EVERY cell) and `.heading .cell, .cell.category, .avg .cell {
    // background-color: $gray-100 (#f8f9fa) }` (header / category / Overall-average).
    // On dark themes the generator's general `th { background: rgba(0,0,0,.15) }` tints
    // the header/category `th.cell`, but the `td.cell` VALUE cells keep Moodle's light
    // fill — most visibly the "Overall average" row's values (`td.grade_type_value.cell`
    // in `tr.avg`, #f8f9fa) and, in non-edit view, every student value cell (#fff) →
    // washed-out (the user's report; they want it to match the dark matrix). Repaint
    // every grader cell to the dark card surface (`cardBg` + light `bodyText`,
    // `cardBorder` borders) so the whole table reads as one dark card, like the #136
    // user report. The user-name links keep their lime `linkColour` — re-assert it on
    // `.cell a:not(.btn)` (and we do NOT add a blanket `tr .cell *` colour sweep that
    // would override them; the `*` light-text sweep is limited to the link-free
    // heading/category/avg cells). Borders: Moodle uses `$table-border-color` =
    // `var(--bs-border-color)` (#dee2e6), so redefine that var on the wrapper + set
    // explicit `border-color`/`border-top-color` (the `tr.lastrow` top border too).
    // Anchored on the body CLASS `.path-grade-report-grader` (the `path-` loop drops
    // only the last URL segment, so the class is present — NOT a `#page-…-index` id) +
    // `.gradeparent`. `!important` beats Moodle's un-important rules outright. Dark
    // presets only.
    rules.push('.path-grade-report-grader .gradeparent {');
    rules.push(`  --bs-border-color: ${tokens.cardBorder};`);
    rules.push('}');
    rules.push('.path-grade-report-grader .gradeparent tr .cell,');
    rules.push('.path-grade-report-grader .gradeparent .floater .cell,');
    rules.push('.path-grade-report-grader .gradeparent .heading .cell,');
    rules.push('.path-grade-report-grader .gradeparent .cell.category,');
    rules.push('.path-grade-report-grader .gradeparent .avg .cell {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('.path-grade-report-grader .gradeparent .heading .cell *,');
    rules.push('.path-grade-report-grader .gradeparent .cell.category *,');
    rules.push('.path-grade-report-grader .gradeparent .avg .cell * {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('.path-grade-report-grader .gradeparent .cell a:not(.btn) {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    rules.push('.path-grade-report-grader .gradeparent tr.lastrow td,');
    rules.push('.path-grade-report-grader .gradeparent tr.lastrow th {');
    rules.push(`  border-top-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('');

    // ── Gradebook grade-status icons (#146) ──
    // Each grade cell carries a status-icon strip `<div class="text-muted grade_icons
    // data-collapse_gradeicons">` (category/total cells use `.category_grade_icons`),
    // emitted by `grade_structure::set_grade_status_icons()` →
    // `core_grades/status_icons` template — stable, byte-identical across Moodle
    // 4.4 / 4.5 / 5.0 / main. It holds up to five FontAwesome status markers:
    // Overridden (`fa-pen-to-square`, the user's complaint — a static `role="img"`
    // indicator), Hidden (`fa-eye-slash`), Locked (`fa-lock`), Excluded
    // (`fa-circle-minus`), Feedback (`fa-asterisk`). They are plain `<i class="icon
    // fa fa-...">` glyphs (so `color:` is the lever, NOT `filter:`) and — verified vs
    // `lib/templates/pix_icon_fontawesome.mustache` — NONE carries a `.text-*`
    // semantic class (only the CONTAINER div has `text-muted`), so a blanket re-light
    // is safe and no `:not([class*="text-"])` guard is needed (cf. #138).
    //
    // On dark themes the generator's general `.icon, .fa { color: ${d.bodyText}
    // (#1d2125) }` rule directly matches each `<i>` and — being `!important` on a
    // direct match — beats the merely-INHERITED light text colour of the now-dark
    // grader/user cells (#145 `cardBg` cells / #136). Result: near-black glyph on a
    // dark cell → invisible (DevTools confirmed `.icon,.fa { #1d2125 }` winning).
    // Re-light the strip's glyphs to the theme's light text (`bodyText` = CFA Light
    // Grey #F0EEEE) — the same "light white" used for #137 `.cellmenubtn` and #138
    // `.enrolmenticons`, so the icons match the rest of the dark UI. Specificity
    // (0,2,0) + `!important` beats the generic `.icon` (0,1,0). `.grade_icons` /
    // `.category_grade_icons` are gradebook-only classes (rendered solely by the
    // grade reports, whose cells are dark on dark themes), so a global scope is safe
    // and consistent with #137/#138 — no page anchor needed. Dark presets only (inside
    // `if (darkMode)`); light presets emit nothing.
    rules.push('.grade_icons .icon,');
    rules.push('.grade_icons .fa,');
    rules.push('.category_grade_icons .icon,');
    rules.push('.category_grade_icons .fa {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('');

    // ── Activity (outline) report table — dark surface (#149) ──
    // Course → Reports → Activity report (`report/outline/index.php`, body class
    // `.path-report-outline`, stable 4.4/4.5/5.0). The report table (`.generaltable`;
    // id `#outlinereport` on 4.5/5.0, `#outlinetable` on 4.4 — so anchor on the body
    // class + `.generaltable`, the only constants and the only table on the page) had
    // DARK header cells but WHITE data rows. Moodle's `theme/boost/scss/moodle/
    // tables.scss` paints `.generaltable { background-color: $table-bg (#fff) }` and
    // `tbody td, th { background-color: inherit }`, so the white table bg propagates to
    // every cell; the generator's general dark `th { background: rgba(0,0,0,.15) }`
    // tints only the header `th`, leaving the `td` value cells inheriting Moodle's
    // white. Repaint the whole table to the dark card surface, like the #145 grader
    // report / #136 user report. Belt-and-braces for the white source: redefine the
    // Bootstrap-5.3 table vars (`--bs-table-bg/-color/-border-color`, for the `.table`
    // cell rule that a recent point release added) AND set explicit `background-color`/
    // `color` on the table + `thead/tbody/tr/th/td` (for Moodle's `generaltable {…} td,
    // th { inherit }` + BS4). Borders: Moodle's generaltable cells pull from the GLOBAL
    // `var(--bs-border-color)` (not the table var) — the #136 gotcha — so redefine
    // `--bs-border-color: cardBorder` on the `.path-report-outline` scope + explicit
    // `border-color`. Keep activity links lime via `.generaltable a:not(.btn)` ((0,3,1)
    // beats the `td *` light-text sweep (0,2,1)). The activity-name icon is an
    // image-based monologo `<img class="icon">` (`pix_icon('monologo')`) → `color` is
    // inert, so light it with `filter: brightness(0) invert(1)` (image-based, like the
    // #136 `img.itemicon`); FA icons (if any) handled via `color` with the standard
    // `:not([class*="text-"])` semantic guard. Dark presets only.
    rules.push('.path-report-outline {');
    rules.push(`  --bs-border-color: ${tokens.cardBorder};`);
    rules.push('}');
    rules.push('.path-report-outline .generaltable {');
    rules.push(`  --bs-table-bg: ${tokens.cardBg};`);
    rules.push(`  --bs-table-color: ${tokens.bodyText};`);
    rules.push(`  --bs-table-border-color: ${tokens.cardBorder};`);
    rules.push(`  --bs-border-color: ${tokens.cardBorder};`);
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('.path-report-outline .generaltable thead,');
    rules.push('.path-report-outline .generaltable tbody,');
    rules.push('.path-report-outline .generaltable tr,');
    rules.push('.path-report-outline .generaltable th,');
    rules.push('.path-report-outline .generaltable td {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    rules.push('.path-report-outline .generaltable th *,');
    rules.push('.path-report-outline .generaltable td * {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('.path-report-outline .generaltable a:not(.btn) {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    rules.push('.path-report-outline .generaltable .icon:not([class*="text-"]),');
    rules.push('.path-report-outline .generaltable .fa:not([class*="text-"]) {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('.path-report-outline .generaltable img.icon {');
    rules.push('  filter: brightness(0) invert(1) !important;');
    rules.push('}');
    rules.push('.path-report-outline .generaltable .text-muted,');
    rules.push('.path-report-outline .generaltable .dimmed_text,');
    rules.push('.path-report-outline .generaltable small {');
    rules.push(`  color: ${tokens.mutedText} !important;`);
    rules.push('}');
    rules.push('');

    // ── Alert-info: re-light icon + link on the darkened info alert (#150) ──
    // The generator darkens `.alert-info` to the dark card surface (L~1040:
    // `.well, .alert-info { background-color: cardBg; color: bodyText; border-color:
    // cardBorder }`) — but only `.alert-info`, NOT the semantic success/warning/danger
    // alerts (those keep Moodle's light subtle bg). Two things inside the darkened
    // info alert were left dark-on-dark:
    //  (1) the info icon `<i class="icon fa fa-circle-info fa-fw">` (Moodle
    //      `notification_base.mustache` → `i/circleinfo`; FontAwesome, NO `.text-*`
    //      class) is painted dark `#1d2125` by the global `.icon, .fa` rule (L~349) →
    //      invisible. Re-light to `bodyText` (white, CFA Light Grey #F0EEEE).
    //  (2) a bare `<a>` (NOT `.alert-link`) is coloured by MOODLE's own `core.scss`
    //      `.alert-info a { color: darken(shift-color($info,40%),10%) }` (a dark shade
    //      for the LIGHT alert; (0,1,1), non-important) — it never picks up `$primary`
    //      / `--bs-link-color`, so it stays dark-on-dark, not lime. Force it to
    //      `linkColour` at rest + preserve the normal `linkHover` on hover so it
    //      behaves like every other page link.
    // MUST scope to `.alert-info` (NOT `.alert`) — the other alert types stay light and
    // must keep their dark semantic icon/link colours. Specificity: `.alert-info .icon`
    // (0,2,0) beats the global `.icon` (0,1,0); `.alert-info a` (0,2,0)+`!important`
    // beats Moodle's `.alert-info a` (0,1,1); the hover rule (0,2,1) beats both the rest
    // rule and the global `a:hover` (0,1,1). Dark presets only.
    rules.push('.alert-info .icon,');
    rules.push('.alert-info .fa {');
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('.alert-info a {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    rules.push('.alert-info a:hover,');
    rules.push('.alert-info a:focus {');
    rules.push(`  color: ${tokens.linkHover} !important;`);
    rules.push('}');
    rules.push('');

    // ── Signup / forgot-password: darken the .login-container "card" (#151) ──
    // The signup (`login/signup.php`) and forgot-password (`login/forgot_password.php`)
    // pages use the Boost `login` page layout (`theme/boost/templates/login.mustache`),
    // which wraps the mform in `<div class="login-container">`. Moodle's
    // `theme/boost/scss/moodle/login.scss` paints it WHITE (`$logincontainer-bg: $white`,
    // un-`!important`, byte-identical 4.4/4.5/5.0). It is NOT a `.card` and NOT `.bg-white`,
    // so none of the generator's dark surfaces reached it: the inputs already render dark
    // (global `.form-control` rule), the page is dark (`#region-main`), but the container
    // stayed white → inconsistent. The labels inside inherit `bodyText` (light) so they
    // were near-invisible on the white card too. Repaint the container to `cardBg` (same as
    // every other `.card`) so it reads as one cohesive dark card; labels become readable and
    // the inputs stay distinct via their `cardBorder` outline.
    // The login page itself (`#page-login-index`) has its own dark handling above (L~269,
    // gated behind login tokens) — these body-id-scoped rules never touch it. Scope to the
    // two body ids (NOT bare `.login-container`, which would also hit the login page).
    // Specificity `body#…` (1,1,0) + `!important` beats Moodle's un-`!important` white.
    rules.push('body#page-login-signup .login-container,');
    rules.push('body#page-login-forgot_password .login-container {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('');

    // ── Quiz report attempts table — dark surface (#156) ──
    // The quiz report (`mod/quiz/report.php`, body `#page-mod-quiz-report`) attempts
    // table (`table#attempts.flexible.generaltable.table-striped`) has WHITE cells on
    // dark themes. Root cause: `mod/quiz/styles.css` (scoped `body.path-mod-quiz`, NOT
    // !important) hardcodes the STICKY name column light (`#fff`/`#f7f7f7`) and the
    // GRADED (counted) attempt row light-blue (`.gradedattempt` `#d9edf7`); plus the
    // generic Boost `.generaltable` sticky/striping. Repaint dark, mirroring #149
    // (activity report) — redefine the BS table vars AND explicit cell bg (covers
    // BS4 striping + the sticky/graded hardcodes). Anchored on the body id +
    // `.generaltable` so it covers ALL quiz report modes (overview/responses/stats)
    // AND the "Show chart data" accessible table. The bar CHART itself is a Chart.js
    // <canvas> (JS-painted pixels) and CANNOT be themed via SCSS — out of scope.
    rules.push('#page-mod-quiz-report {');
    rules.push(`  --bs-border-color: ${tokens.cardBorder};`);
    rules.push('}');
    rules.push('#page-mod-quiz-report .generaltable {');
    rules.push(`  --bs-table-bg: ${tokens.cardBg};`);
    rules.push(`  --bs-table-color: ${tokens.bodyText};`);
    rules.push(`  --bs-table-border-color: ${tokens.cardBorder};`);
    rules.push(`  --bs-border-color: ${tokens.cardBorder};`);
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push('}');
    rules.push('#page-mod-quiz-report .generaltable thead,');
    rules.push('#page-mod-quiz-report .generaltable tbody,');
    rules.push('#page-mod-quiz-report .generaltable tr,');
    rules.push('#page-mod-quiz-report .generaltable th,');
    rules.push('#page-mod-quiz-report .generaltable td {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    // Sticky name column + graded (counted) attempt row — mod/quiz/styles.css hardcodes
    // these light (`#fff`/`#f7f7f7`/`#d9edf7`); repaint dark. id-scoped → wins regardless.
    rules.push('#page-mod-quiz-report .generaltable th.sticky-column,');
    rules.push('#page-mod-quiz-report .generaltable td.sticky-column,');
    rules.push('#page-mod-quiz-report .generaltable tr.gradedattempt td,');
    rules.push('#page-mod-quiz-report .generaltable tr.gradedattempt th,');
    rules.push('#page-mod-quiz-report .generaltable tr.gradedattempt td.sticky-column {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.bodyText} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    // Cell links (student name, email, "Review attempt") → lime/orange.
    rules.push('#page-mod-quiz-report .generaltable a:not(.btn) {');
    rules.push(`  color: ${tokens.linkColour} !important;`);
    rules.push('}');
    // Inline "Highest grade" highlight spans (#156c). The grade-method name is wrapped
    // in TWO different inline-highlight classes that BOTH render light-blue (#d9edf7,
    // border #bce8f1) on dark themes → faint text on a pale box:
    //   • intro text "The grading method for this quiz is Highest grade" → `span.gradedattempt`
    //   • form  "…one finished attempt per user (Highest grade)"        → `span.highlight`
    //     (`.highlight` is Moodle's generic search-highlight class; its core text colour
    //     here is CFA Sky Blue #00BFFF — still poor on the pale box on dark).
    // Target ONLY the inline spans (NOT the table `tr`/`td.gradedattempt` handled above)
    // → dark cardBg + LIME text. Use `infoIconColour` (#BAF73C on BOTH dark presets) not
    // `linkColour` (orange on Ember) since the user asked specifically for lime — same
    // precedent as the footer help icon. `.highlight` scoped to `#page-mod-quiz-report`
    // so generic search-highlighting elsewhere is untouched.
    rules.push('#page-mod-quiz-report span.gradedattempt,');
    rules.push('#page-mod-quiz-report span.highlight {');
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
    rules.push(`  color: ${tokens.infoIconColour} !important;`);
    rules.push(`  border-color: ${tokens.cardBorder} !important;`);
    rules.push('}');
    // Bar CHART backdrop (#156b). The chart is a Chart.js <canvas> whose bars/axis
    // text/legend are JS-painted pixels (NOT CSS-themeable) and DESIGNED for a light
    // background; the canvas itself is transparent, so on a dark page the grey axis
    // text + purple bars are hard to read. Give the canvas's HTML wrapper `.chart-image`
    // a fixed WHITE card backdrop → the existing light-theme chart content shows through
    // and reads clearly. Scoped to `.chart-image` only (NOT `.chart-area`) so the
    // "Show chart data" accessible `.generaltable` stays dark (above). Fixed #FFFFFF
    // (a designed-for-light surface, like the timer/modal exceptions).
    rules.push('#page-mod-quiz-report .chart-image {');
    rules.push('  background-color: #FFFFFF !important;');
    rules.push('  padding: 1rem !important;');
    rules.push('  border-radius: 0.5rem !important;');
    rules.push('}');
    rules.push('');
  }

  const block2 = rules.join('\n');

  return { brandColour, block1, block2 };
}
