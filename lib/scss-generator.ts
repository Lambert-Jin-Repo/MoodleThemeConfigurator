// ── SCSS Generator — Complete Rewrite ──
// Generates all 3 output blocks for Moodle Cloud Boost theme

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
  if (tokens.linkColour !== d.linkColour) vars.push(`$link-color: ${tokens.linkColour};`);
  if (tokens.pageBg !== d.pageBg) vars.push(`$body-bg: ${tokens.pageBg};`);
  if (tokens.bodyText !== d.bodyText) vars.push(`$body-color: ${tokens.bodyText};`);
  if (tokens.cardBg !== d.cardBg) vars.push(`$card-bg: ${tokens.cardBg};`);
  if (tokens.bodyFontSize !== d.bodyFontSize) vars.push(`$font-size-base: ${tokens.bodyFontSize}rem;`);
  if (tokens.lineHeight !== d.lineHeight) vars.push(`$line-height-base: ${tokens.lineHeight};`);
  if (tokens.success !== d.success) vars.push(`$success: ${tokens.success};`);
  if (tokens.warning !== d.warning) vars.push(`$warning: ${tokens.warning};`);
  if (tokens.error !== d.error) vars.push(`$danger: ${tokens.error};`);
  if (tokens.info !== d.info) vars.push(`$info: ${tokens.info};`);
  if (tokens.btnRadius !== d.btnRadius) vars.push(`$btn-border-radius: ${tokens.btnRadius}px;`);
  if (tokens.loginInputRadius !== d.loginInputRadius) vars.push(`$input-border-radius: ${tokens.loginInputRadius}px;`);
  if (tokens.fontFamily !== d.fontFamily) vars.push(`$font-family-sans-serif: ${tokens.fontFamily};`);
  if (tokens.fontWeight !== d.fontWeight) vars.push(`$font-weight-base: ${tokens.fontWeight};`);
  if (tokens.headingScale !== d.headingScale) {
    const base = tokens.bodyFontSize || 0.9375;
    vars.push(`$h1-font-size: ${(base * Math.pow(tokens.headingScale, 4)).toFixed(4)}rem;`);
    vars.push(`$h2-font-size: ${(base * Math.pow(tokens.headingScale, 3)).toFixed(4)}rem;`);
    vars.push(`$h3-font-size: ${(base * Math.pow(tokens.headingScale, 2)).toFixed(4)}rem;`);
    vars.push(`$h4-font-size: ${(base * tokens.headingScale).toFixed(4)}rem;`);
  }
  // Activity icon colours (Moodle 4.x purpose-based)
  const iconChanged = tokens.actIconAdmin !== d.actIconAdmin
    || tokens.actIconAssessment !== d.actIconAssessment
    || tokens.actIconCollaboration !== d.actIconCollaboration
    || tokens.actIconCommunication !== d.actIconCommunication
    || tokens.actIconContent !== d.actIconContent
    || tokens.actIconInterface !== d.actIconInterface;
  if (iconChanged) {
    vars.push(`$activity-icon-colors: (`);
    vars.push(`    "administration": ${tokens.actIconAdmin},`);
    vars.push(`    "assessment": ${tokens.actIconAssessment},`);
    vars.push(`    "collaboration": ${tokens.actIconCollaboration},`);
    vars.push(`    "communication": ${tokens.actIconCommunication},`);
    vars.push(`    "content": ${tokens.actIconContent},`);
    vars.push(`    "interface": ${tokens.actIconInterface}`);
    vars.push(`);`);
  }
  // Dark theme: Bootstrap form control variables
  if (darkMode) {
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
      rules.push(`  .dropdown-item, .nav-link, a { color: #404041 !important; }`);
      rules.push(`}`);
    }
    rules.push('');
  } else {
    rules.push('/* Navbar section omitted — using Moodle default */');
    rules.push('');
  }

  // --- Links ---
  rules.push('// ── Links ──');
  rules.push(`a { text-decoration: underline; }`);
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
      rules.push(`  color: #404041 !important;`);
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
  if (tokens.drawerBg !== d.drawerBg || tokens.drawerText !== d.drawerText) {
    rules.push('// ── Drawers ──');
    rules.push(`[data-region="right-hand-drawer"], .drawer {`);
    if (tokens.drawerBg !== d.drawerBg) {
      rules.push(`  background-color: ${tokens.drawerBg} !important;`);
      rules.push(`  border-color: ${tokens.drawerBorder} !important;`);
    }
    if (tokens.drawerText !== d.drawerText) {
      rules.push(`  color: ${tokens.drawerText} !important;`);
    }
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

  // --- Typography ---
  if (tokens.headingText !== d.headingText) {
    rules.push('// ── Typography ──');
    rules.push(`h1, h2, h3, h4, h5, h6 { color: ${tokens.headingText} !important; }`);
    rules.push('');
  }
  if (tokens.bodyText !== d.bodyText) {
    rules.push(`body { color: ${tokens.bodyText} !important; }`);
    rules.push('');

    // Icon visibility fix — icons sit on light wrappers even on dark themes,
    // so they need the default dark colour, not the light bodyText
    rules.push('// ── Icon Visibility Fix ──');
    rules.push(`.icon, .fa { color: ${d.bodyText} !important; }`);
    rules.push(`.breadcrumb .icon, .breadcrumb .fa { color: ${d.bodyText} !important; }`);
    rules.push(`.secondary-navigation .icon, .secondary-navigation .fa { color: ${d.bodyText} !important; }`);
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
    rules.push(`.btn-previous:hover .icon, .btn-previous:hover .fa,`);
    rules.push(`.btn-next:hover .icon, .btn-next:hover .fa { color: ${tokens.linkColour} !important; }`);
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

  // --- Content Max Width ---
  if (tokens.contentMaxWidth !== d.contentMaxWidth) {
    rules.push('// ── Content Max Width ──');
    rules.push(`#region-main { max-width: ${tokens.contentMaxWidth}px; margin-left: auto; margin-right: auto; }`);
    rules.push('');
  }

  // --- Signup Button ---
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

    // Page wrapper containers — prevent white gaps
    rules.push('#page, #page-wrapper, #topofscroll, .main-inner,');
    rules.push('#region-main-box, .pagelayout-standard #page.drawers {');
    rules.push(`  background-color: ${tokens.pageBg} !important;`);
    rules.push(`}`);
    rules.push('');

    // Secondary navigation background
    rules.push(`.secondary-navigation { background-color: ${tokens.pageBg} !important; }`);
    rules.push('');

    // Breadcrumb area
    rules.push(`.breadcrumb { background-color: ${tokens.breadcrumbBg === 'transparent' ? tokens.pageBg : tokens.breadcrumbBg} !important; }`);
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

    // Muted text (helper labels, calendar day numbers, timestamps, category labels)
    rules.push(`.text-muted, .text-secondary, small, .small,`);
    rules.push(`.coursecategory, .course-category, .coursecat, .dimmed_text,`);
    rules.push(`.categoryname, .categoryname.text-truncate {`);
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
    rules.push(`.dashboard-card-footer, .course-info-container {`);
    rules.push(`  background-color: ${tokens.cardBg} !important;`);
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

    // Course content area — backgrounds AND text
    rules.push('.course-content, #region-main, #page-content {');
    rules.push(`  background-color: ${tokens.pageBg} !important;`);
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

    // Activity icon containers — ensure purpose colours show on dark themes
    rules.push(`.activityiconcontainer {`);
    rules.push(`  filter: brightness(1.2) !important;`);
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
    rules.push(`  color: #404041 !important;`);
    rules.push(`  border-color: ${tokens.bodyText} !important;`);
    rules.push(`}`);
    rules.push('.activity-navigation .btn .icon,');
    rules.push('.activity-navigation .btn i,');
    rules.push('.activity-navigation .btn .fa,');
    rules.push('.activity-navigation .btn [class*="bi-"] {');
    rules.push(`  color: #404041 !important;`);
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
    rules.push('');

    // Login page text on dark backgrounds
    if (tokens.loginBg !== d.loginBg && isDarkBg(tokens.loginBg)) {
      rules.push('body#page-login-index .card,');
      rules.push('body#page-login-index .login-heading,');
      rules.push('body#page-login-index label,');
      rules.push('body#page-login-index .login-form-forgotpassword a,');
      rules.push('body#page-login-index .login-signup a {');
      rules.push(`  color: ${tokens.bodyText} !important;`);
      rules.push(`}`);
      rules.push('');
    }

    // Popover / tooltip
    rules.push(`.popover { background-color: ${tokens.cardBg} !important; color: ${tokens.bodyText} !important; }`);
    rules.push(`.popover-body { color: ${tokens.bodyText} !important; }`);
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
  }

  const block2 = rules.join('\n');

  return { brandColour, block1, block2 };
}
