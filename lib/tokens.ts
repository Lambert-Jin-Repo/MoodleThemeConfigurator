// ── CFA Brand Sandbox — Token Data Model ──

export interface ThemeTokens {
  // Brand
  brandPrimary: string;

  // Navbar
  navbarBg: string;
  navbarText: string;
  navbarBorder: string;
  navActiveUnderline: string;
  navHoverBg: string;
  navHoverText: string;

  // Edit Mode Toggle
  editModeOnColour: string;
  editModeThumbColour: string;

  // Breadcrumb
  breadcrumbBg: string;

  // Buttons
  btnPrimaryBg: string;
  btnPrimaryText: string;
  btnPrimaryHover: string;
  btnRadius: number;

  // Links
  linkColour: string;
  linkHover: string;

  // Content Area
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  contentMaxWidth: number;
  sectionAccent: string;

  // Login Page
  loginBg: string;
  loginCardBg: string;
  loginHeading: string;
  loginBtnBg: string;
  loginBtnText: string;
  loginInputRadius: number;
  loginGradientEnabled: boolean;
  loginGradientEnd: string;

  // Background Images
  backgroundImage: string;   // base64 data URL or '' (site-wide background)
  loginBgImage: string;       // base64 data URL or '' (login page background)

  // Footer
  footerBg: string;
  footerText: string;
  footerLink: string;
  footerAccent: string;

  // Drawers
  drawerBg: string;
  drawerText: string;
  drawerBorder: string;

  // Typography
  bodyFontSize: number;
  headingScale: number;
  lineHeight: number;
  fontFamily: string;
  headingText: string;
  bodyText: string;
  mutedText: string;

  // Secondary Nav
  secondaryNavActive: string;
  secondaryNavText: string;

  // Alerts & Progress
  success: string;
  warning: string;
  error: string;
  info: string;
  progressFill: string;

  // Focus
  focusRing: string;
  focusRingWidth: number;

  // Signup
  signupBtnBg: string;

  // Logo
  logoAustraliaColour: string; // 'auto' or hex — colour of "AUSTRALIA" text in CFA logo
}

// ── Moodle Boost defaults ──
export const DEFAULT_TOKENS: ThemeTokens = {
  brandPrimary: '#0f6cbf',

  navbarBg: '#0f6cbf',
  navbarText: '#FFFFFF',
  navbarBorder: 'none',
  navActiveUnderline: '#0f6cbf',
  navHoverBg: 'rgba(0,0,0,0.2)',
  navHoverText: '#FFFFFF',

  editModeOnColour: '#0f6cbf',
  editModeThumbColour: '#FFFFFF',

  breadcrumbBg: 'transparent',

  btnPrimaryBg: '#0f6cbf',
  btnPrimaryText: '#FFFFFF',
  btnPrimaryHover: '#0c5aa0',
  btnRadius: 4,

  linkColour: '#0f6cbf',
  linkHover: '#0a4a82',

  pageBg: '#FFFFFF',
  cardBg: '#FFFFFF',
  cardBorder: '#dee2e6',
  contentMaxWidth: 830,
  sectionAccent: 'none',

  loginBg: '#0f6cbf',
  loginCardBg: '#FFFFFF',
  loginHeading: '#404041',
  loginBtnBg: '#0f6cbf',
  loginBtnText: '#FFFFFF',
  loginInputRadius: 4,
  loginGradientEnabled: false,
  loginGradientEnd: '#0f6cbf',

  backgroundImage: '',
  loginBgImage: '',

  footerBg: '#FFFFFF',
  footerText: '#404041',
  footerLink: '#0f6cbf',
  footerAccent: 'none',

  drawerBg: '#FFFFFF',
  drawerText: '#404041',
  drawerBorder: '#dee2e6',

  bodyFontSize: 0.9375,
  headingScale: 1.25,
  lineHeight: 1.5,
  fontFamily: '"Source Sans Pro", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  headingText: '#404041',
  bodyText: '#404041',
  mutedText: '#6a737b',

  secondaryNavActive: '#0f6cbf',
  secondaryNavText: '#404041',

  success: '#357a32',
  warning: '#f0ad4e',
  error: '#ca3120',
  info: '#0f6cbf',
  progressFill: '#0f6cbf',

  focusRing: '#0f6cbf',
  focusRingWidth: 2,

  signupBtnBg: '#6c757d',

  logoAustraliaColour: 'auto',
};

// ── CFA Logo accent colours (from Brand Style Guide p.6) ──
export const LOGO_ACCENT_COLOURS = [
  { name: 'Red', hex: '#F64747' },
  { name: 'Orange', hex: '#F27927' },
  { name: 'Purple', hex: '#B500B5' },
  { name: 'Sky Blue', hex: '#00BFFF' },
  { name: 'Teal', hex: '#336E7B' },
  { name: 'Lime Green', hex: '#BAF73C' },
] as const;

// ── CFA Palette ──
export const CFA_PALETTE = [
  { name: 'Charcoal', hex: '#404041' },
  { name: 'Light Grey', hex: '#F0EEEE' },
  { name: 'Orange', hex: '#F27927' },
  { name: 'Purple', hex: '#B500B5' },
  { name: 'Sky Blue', hex: '#00BFFF' },
  { name: 'Teal', hex: '#336E7B' },
  { name: 'Lime Green', hex: '#BAF73C' },
  { name: 'Red', hex: '#F64747' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Near Black', hex: '#1D2125' },
] as const;

// ── Colours blocked from link/text on white ──
export const BLOCKED_COLOURS = ['#F27927', '#00BFFF'] as const;

// ── Tokens that cascade when brandPrimary changes ──
export const BRAND_LINKED_KEYS: (keyof ThemeTokens)[] = [
  'btnPrimaryBg',
  'linkColour',
  'navActiveUnderline',
  'secondaryNavActive',
  'progressFill',
  'focusRing',
  'loginBtnBg',
  'loginBg',
  'info',
  'footerLink',
];

// ── Font options ──
export const FONT_OPTIONS = [
  { label: 'Source Sans Pro', value: '"Source Sans Pro", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
  { label: 'Inter', value: '"Inter", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
  { label: 'System Default', value: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' },
] as const;

// ── Preview pages ──
export type PreviewPage = 'dashboard' | 'course' | 'login';
export type Viewport = 'desktop';

// ── Saved config ──
export interface SavedConfig {
  id: string;
  name: string;
  tokens: ThemeTokens;
  score: number;
  timestamp: number;
}

// ── Preset template ──
export interface PresetTemplate {
  id: string;
  name: string;
  description: string;
  recommended?: boolean;
  overrides: Partial<ThemeTokens>;
}

// ── Utility: darken a hex colour ──
export function darkenHex(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.round(((num >> 16) & 0xff) * (1 - percent / 100)));
  const g = Math.max(0, Math.round(((num >> 8) & 0xff) * (1 - percent / 100)));
  const b = Math.max(0, Math.round((num & 0xff) * (1 - percent / 100)));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// ── Utility: auto text colour (white or dark) ──
export function autoTextColour(bgHex: string): string {
  const num = parseInt(bgHex.replace('#', ''), 16);
  const r = ((num >> 16) & 0xff) / 255;
  const g = ((num >> 8) & 0xff) / 255;
  const b = (num & 0xff) / 255;
  const toLinear = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const lum = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return lum > 0.179 ? '#404041' : '#FFFFFF';
}

// ── Utility: camelCase token key → CSS custom property ──
export function tokenToCssVar(key: string): string {
  const kebab = key.replace(/([A-Z])/g, '-$1').toLowerCase();
  return `--cfa-${kebab}`;
}

// ── 7 CFA Presets + Moodle Default ──
// All values verified against docs/references/CFA_Moodle_SCSS_All_Options.md (v6)
export const PRESET_TEMPLATES: PresetTemplate[] = [
  {
    id: 'cfa-teal-pro',
    name: 'CFA Teal Professional',
    description: 'Clean, conservative monochrome teal theme',
    overrides: {
      brandPrimary: '#336E7B',
      navbarBg: '#336E7B',
      navbarText: '#FFFFFF',
      navbarBorder: 'none',
      navActiveUnderline: '#336E7B',
      navHoverBg: 'rgba(0,0,0,0.2)',
      navHoverText: '#F0EEEE',
      editModeOnColour: '#FFFFFF',
      editModeThumbColour: '#336E7B',
      breadcrumbBg: '#F0EEEE',
      btnPrimaryBg: '#336E7B',
      btnPrimaryText: '#FFFFFF',
      btnPrimaryHover: '#245058',
      linkColour: '#336E7B',
      linkHover: '#245058',
      footerBg: '#404041',
      footerText: '#F0EEEE',
      footerLink: '#F0EEEE',
      footerAccent: 'none',
      loginBg: '#404041',
      loginBtnBg: '#336E7B',
      loginHeading: '#336E7B',
      loginGradientEnabled: false,
      secondaryNavActive: '#336E7B',
      progressFill: '#336E7B',
      focusRing: '#336E7B',
      focusRingWidth: 2,
      info: '#336E7B',
      sectionAccent: 'none',
      signupBtnBg: '#6c757d',
    },
  },
  {
    id: 'cfa-teal-orange',
    name: 'CFA Teal & Orange',
    description: 'Energetic teal with orange accents on dark surfaces',
    overrides: {
      brandPrimary: '#336E7B',
      navbarBg: '#404041',
      navbarText: '#F0EEEE',
      navbarBorder: 'none',
      navActiveUnderline: '#F27927',
      navHoverBg: 'rgba(0,0,0,0.2)',
      navHoverText: '#F27927',
      editModeOnColour: '#F27927',
      editModeThumbColour: '#FFFFFF',
      breadcrumbBg: '#F0EEEE',
      btnPrimaryBg: '#336E7B',
      btnPrimaryText: '#FFFFFF',
      btnPrimaryHover: '#F27927',
      linkColour: '#336E7B',
      linkHover: '#245058',
      footerBg: '#404041',
      footerText: '#F0EEEE',
      footerLink: '#F27927',
      footerAccent: '#F27927',
      loginBg: '#404041',
      loginBtnBg: '#F27927',
      loginHeading: '#336E7B',
      loginGradientEnabled: false,
      secondaryNavActive: '#336E7B',
      progressFill: '#336E7B',
      focusRing: '#F27927',
      focusRingWidth: 2,
      info: '#336E7B',
      sectionAccent: '#F27927',
      signupBtnBg: '#6c757d',
    },
  },
  {
    id: 'cfa-dark-mode',
    name: 'CFA Dark Mode',
    description: 'Bold, modern with lime accents and dark drawer',
    overrides: {
      brandPrimary: '#336E7B',
      navbarBg: '#1D2125',
      navbarText: '#F0EEEE',
      navbarBorder: '#F27927',
      navActiveUnderline: '#BAF73C',
      navHoverBg: 'rgba(255,255,255,0.08)',
      navHoverText: '#BAF73C',
      editModeOnColour: '#BAF73C',
      editModeThumbColour: '#1D2125',
      breadcrumbBg: '#F0EEEE',
      btnPrimaryBg: '#336E7B',
      btnPrimaryText: '#FFFFFF',
      btnPrimaryHover: '#1D2125',
      linkColour: '#336E7B',
      linkHover: '#245058',
      footerBg: '#1D2125',
      footerText: '#F0EEEE',
      footerLink: '#00BFFF',
      footerAccent: 'none',
      drawerBg: '#1D2125',
      drawerText: '#F0EEEE',
      drawerBorder: '#404041',
      loginBg: '#1D2125',
      loginBtnBg: '#336E7B',
      loginHeading: '#336E7B',
      loginGradientEnabled: false,
      secondaryNavActive: '#336E7B',
      progressFill: '#336E7B',
      focusRing: '#336E7B',
      focusRingWidth: 2,
      info: '#336E7B',
      sectionAccent: 'none',
      signupBtnBg: '#6c757d',
    },
  },
  {
    id: 'cfa-purple',
    name: 'CFA Purple Spotlight',
    description: 'Creative, distinctive with purple accents',
    overrides: {
      brandPrimary: '#B500B5',
      navbarBg: '#B500B5',
      navbarText: '#FFFFFF',
      navbarBorder: 'none',
      navActiveUnderline: '#FFFFFF',
      navHoverBg: 'rgba(0,0,0,0.2)',
      navHoverText: '#F0EEEE',
      editModeOnColour: '#FFFFFF',
      editModeThumbColour: '#B500B5',
      breadcrumbBg: '#F5F0F5',
      btnPrimaryBg: '#B500B5',
      btnPrimaryText: '#FFFFFF',
      btnPrimaryHover: '#8A008A',
      linkColour: '#8A008A',
      linkHover: '#5E005E',
      footerBg: '#404041',
      footerText: '#F0EEEE',
      footerLink: '#F0EEEE',
      footerAccent: 'none',
      loginBg: '#404041',
      loginBtnBg: '#B500B5',
      loginHeading: '#B500B5',
      loginGradientEnabled: false,
      secondaryNavActive: '#336E7B',
      progressFill: '#B500B5',
      focusRing: '#B500B5',
      focusRingWidth: 2,
      info: '#B500B5',
      sectionAccent: '#B500B5',
      signupBtnBg: '#336E7B',
    },
  },
  {
    id: 'cfa-warm-cream',
    name: 'CFA Warm Cream',
    description: 'Warm, approachable with cream tones and gradient login',
    overrides: {
      brandPrimary: '#336E7B',
      navbarBg: '#404041',
      navbarText: '#F0EEEE',
      navbarBorder: 'none',
      navActiveUnderline: '#F27927',
      navHoverBg: 'rgba(0,0,0,0.2)',
      navHoverText: '#F27927',
      editModeOnColour: '#F27927',
      editModeThumbColour: '#FFFFFF',
      breadcrumbBg: '#F8F5F0',
      btnPrimaryBg: '#336E7B',
      btnPrimaryText: '#FFFFFF',
      btnPrimaryHover: '#245058',
      linkColour: '#336E7B',
      linkHover: '#245058',
      cardBorder: '#E8E2D9',
      headingText: '#2A2A2B',
      footerBg: '#2A2A2B',
      footerText: '#F0EEEE',
      footerLink: '#F0EEEE',
      footerAccent: 'none',
      loginBg: '#404041',
      loginBtnBg: '#336E7B',
      loginHeading: '#336E7B',
      loginGradientEnabled: true,
      loginGradientEnd: '#336E7B',
      secondaryNavActive: '#336E7B',
      progressFill: '#336E7B',
      focusRing: '#336E7B',
      focusRingWidth: 2,
      info: '#336E7B',
      sectionAccent: 'none',
      signupBtnBg: '#6c757d',
    },
  },
  {
    id: 'cfa-high-contrast',
    name: 'CFA High Contrast AAA',
    description: 'Maximum accessibility with AAA contrast and 3px focus rings',
    recommended: true,
    overrides: {
      brandPrimary: '#245058',
      navbarBg: '#1D2125',
      navbarText: '#FFFFFF',
      navbarBorder: 'none',
      navActiveUnderline: '#FFFFFF',
      navHoverBg: 'rgba(255,255,255,0.1)',
      navHoverText: '#F0EEEE',
      editModeOnColour: '#FFFFFF',
      editModeThumbColour: '#1D2125',
      breadcrumbBg: '#F0EEEE',
      btnPrimaryBg: '#245058',
      btnPrimaryText: '#FFFFFF',
      btnPrimaryHover: '#1D2125',
      linkColour: '#245058',
      linkHover: '#1D2125',
      bodyText: '#1D2125',
      headingText: '#1D2125',
      cardBorder: '#404041',
      footerBg: '#1D2125',
      footerText: '#FFFFFF',
      footerLink: '#FFFFFF',
      footerAccent: 'none',
      loginBg: '#1D2125',
      loginBtnBg: '#245058',
      loginHeading: '#245058',
      loginGradientEnabled: false,
      secondaryNavActive: '#245058',
      progressFill: '#245058',
      focusRing: '#1D2125',
      focusRingWidth: 3,
      bodyFontSize: 1.0625,
      info: '#245058',
      sectionAccent: 'none',
      signupBtnBg: '#6c757d',
    },
  },
  {
    id: 'cfa-burnt-orange',
    name: 'CFA Burnt Orange',
    description: 'Warm, bold burnt orange with teal secondary accents',
    overrides: {
      brandPrimary: '#9E4E12',
      navbarBg: '#9E4E12',
      navbarText: '#FFFFFF',
      navbarBorder: 'none',
      navActiveUnderline: '#FFFFFF',
      navHoverBg: 'rgba(0,0,0,0.2)',
      navHoverText: '#F0EEEE',
      editModeOnColour: '#FFFFFF',
      editModeThumbColour: '#9E4E12',
      breadcrumbBg: '#FDF5EE',
      btnPrimaryBg: '#9E4E12',
      btnPrimaryText: '#FFFFFF',
      btnPrimaryHover: '#7A3D0E',
      linkColour: '#9E4E12',
      linkHover: '#7A3D0E',
      footerBg: '#404041',
      footerText: '#F0EEEE',
      footerLink: '#F27927',
      footerAccent: '#9E4E12',
      loginBg: '#9E4E12',
      loginBtnBg: '#9E4E12',
      loginHeading: '#9E4E12',
      loginGradientEnabled: true,
      loginGradientEnd: '#7A3D0E',
      secondaryNavActive: '#336E7B',
      progressFill: '#9E4E12',
      focusRing: '#9E4E12',
      focusRingWidth: 2,
      info: '#9E4E12',
      sectionAccent: '#336E7B',
      signupBtnBg: '#336E7B',
    },
  },
  {
    id: 'moodle-default',
    name: 'Moodle Default',
    description: 'Reset to Moodle Boost defaults',
    overrides: {},
  },
];
