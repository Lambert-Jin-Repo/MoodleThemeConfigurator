// ── WCAG Accessibility Utilities ──

export function hexToRgb(hex: string): [number, number, number] {
  if (!hex || typeof hex !== 'string') return [0, 0, 0];
  const h = hex.replace('#', '');
  if (!/^[0-9A-Fa-f]{6}$/.test(h) && !/^[0-9A-Fa-f]{3}$/.test(h)) return [0, 0, 0];
  const full = h.length === 3 ? h[0]+h[0]+h[1]+h[1]+h[2]+h[2] : h;
  return [
    parseInt(full.substring(0, 2), 16),
    parseInt(full.substring(2, 4), 16),
    parseInt(full.substring(4, 6), 16),
  ];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

export function hexToHsl(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map(c => c / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h * 360, s, l];
}

export function hslToHex(h: number, s: number, l: number): string {
  h = h / 360;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  let r: number, g: number, b: number;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map(c => {
    c = c / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function isDarkBackground(hex: string): boolean {
  return relativeLuminance(hex) < 0.179;
}

export function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

export function meetsAA(ratio: number): boolean {
  return ratio >= 4.5;
}

export function meetsAAA(ratio: number): boolean {
  return ratio >= 7.0;
}

export function meetsAALarge(ratio: number): boolean {
  return ratio >= 3.0;
}

import { CFA_PALETTE, BLOCKED_COLOURS, LOGO_ACCENT_COLOURS } from './tokens';

export function isBlockedColour(hex: string): boolean {
  if (!hex) return false;
  const upper = hex.toUpperCase();
  return BLOCKED_COLOURS.some(b => b.toUpperCase() === upper);
}

export function suggestFix(
  fg: string,
  bg: string,
  isLargeText: boolean = false
): string | null {
  const targetRatio = isLargeText ? 3.0 : 4.5;

  // Try CFA palette colours — pick the nearest passing colour (smallest colour distance)
  let bestPalette: string | null = null;
  let bestDistance = Infinity;
  const [fgR, fgG, fgB] = hexToRgb(fg);
  for (const swatch of CFA_PALETTE) {
    if (contrastRatio(swatch.hex, bg) >= targetRatio) {
      const [sR, sG, sB] = hexToRgb(swatch.hex);
      const dist = Math.sqrt((fgR - sR) ** 2 + (fgG - sG) ** 2 + (fgB - sB) ** 2);
      if (dist < bestDistance) {
        bestDistance = dist;
        bestPalette = swatch.hex;
      }
    }
  }
  if (bestPalette) return bestPalette;

  // Darken the foreground until it passes
  const [h, s, l] = hexToHsl(fg);
  for (let step = 1; step <= 50; step++) {
    const darker = hslToHex(h, s, Math.max(0, l - step * 0.02));
    if (contrastRatio(darker, bg) >= targetRatio) return darker;
  }
  return null;
}

/**
 * Pick the best CFA accent colour for "AUSTRALIA" logo text on a given background.
 * Uses Brand Style Guide p.6 preference order:
 *   Light bg → Red, Teal, Purple, Orange, Lime Green, Sky Blue
 *   Dark bg  → Lime Green, Orange, Sky Blue, Red, Purple, Teal
 * Returns the first colour meeting WCAG AA Large (3:1) threshold,
 * or the highest-contrast option as fallback.
 */
export function bestLogoAccentColour(bgHex: string): string {
  if (!bgHex) return LOGO_ACCENT_COLOURS[0].hex;
  const dark = isDarkBackground(bgHex);

  // Preference order from Brand Style Guide page 6
  const accentMap = Object.fromEntries(LOGO_ACCENT_COLOURS.map(c => [c.hex, c]));
  const preferred = dark
    ? [accentMap['#BAF73C'], accentMap['#F27927'], accentMap['#00BFFF'], accentMap['#F64747'], accentMap['#B500B5'], accentMap['#336E7B']]
    : [accentMap['#F64747'], accentMap['#336E7B'], accentMap['#B500B5'], accentMap['#F27927'], accentMap['#BAF73C'], accentMap['#00BFFF']];

  // Return first meeting WCAG AA Large (3:1) — appropriate for uppercase branding text
  for (const accent of preferred) {
    if (accent && contrastRatio(accent.hex, bgHex) >= 3.0) return accent.hex;
  }

  // Fallback: highest contrast
  let best = preferred[0]?.hex ?? LOGO_ACCENT_COLOURS[0].hex;
  let bestRatio = 0;
  for (const accent of preferred) {
    if (!accent) continue;
    const ratio = contrastRatio(accent.hex, bgHex);
    if (ratio > bestRatio) {
      bestRatio = ratio;
      best = accent.hex;
    }
  }
  return best;
}

export interface ContrastCheck {
  id: string;
  label: string;
  description: string;
  fgKey: string;
  bgKey: string;
  isLargeText?: boolean;
}

export const CONTRAST_CHECKS: ContrastCheck[] = [
  {
    id: 'link-page',
    label: 'Link on Page',
    description: 'Link colour on page background',
    fgKey: 'linkColour',
    bgKey: 'pageBg',
  },
  {
    id: 'body-page',
    label: 'Body Text on Page',
    description: 'Body text on page background',
    fgKey: 'bodyText',
    bgKey: 'pageBg',
  },
  {
    id: 'nav-navbar',
    label: 'Nav Text on Navbar',
    description: 'Navigation text on navbar background',
    fgKey: 'navbarText',
    bgKey: 'navbarBg',
  },
  {
    id: 'footer-text',
    label: 'Footer Text',
    description: 'Footer text on footer background',
    fgKey: 'footerText',
    bgKey: 'footerBg',
  },
  {
    id: 'btn-primary',
    label: 'Button Text',
    description: 'Button text on primary button background',
    fgKey: 'btnPrimaryText',
    bgKey: 'btnPrimaryBg',
  },
  {
    id: 'footer-link',
    label: 'Footer Link',
    description: 'Footer link on footer background',
    fgKey: 'footerLink',
    bgKey: 'footerBg',
  },
  {
    id: 'heading-page',
    label: 'Heading on Page',
    description: 'Heading text on page background',
    fgKey: 'headingText',
    bgKey: 'pageBg',
    isLargeText: true,
  },
  {
    id: 'muted-page',
    label: 'Muted Text on Page',
    description: 'Muted text on page background',
    fgKey: 'mutedText',
    bgKey: 'pageBg',
  },
  {
    id: 'link-card',
    label: 'Link on Card',
    description: 'Link colour on card background',
    fgKey: 'linkColour',
    bgKey: 'cardBg',
  },
  {
    id: 'muted-card',
    label: 'Muted Text on Card',
    description: 'Muted text on card background',
    fgKey: 'mutedText',
    bgKey: 'cardBg',
  },
  {
    id: 'login-heading',
    label: 'Login Heading',
    description: 'Login heading on login card background',
    fgKey: 'loginHeading',
    bgKey: 'loginCardBg',
  },
  {
    id: 'login-btn',
    label: 'Login Button',
    description: 'Login button text on login button background',
    fgKey: 'loginBtnText',
    bgKey: 'loginBtnBg',
  },
  {
    id: 'logo-australia',
    label: 'Logo "AUSTRALIA" on Navbar',
    description: 'Logo accent text on navbar background',
    fgKey: 'logoAustraliaColour',
    bgKey: 'navbarBg',
    isLargeText: true,
  },
  {
    id: 'drawer-text',
    label: 'Drawer Text',
    description: 'Drawer item text on drawer background',
    fgKey: 'drawerText',
    bgKey: 'drawerBg',
  },
];
