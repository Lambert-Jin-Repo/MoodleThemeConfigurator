// ── Accessibility Audit Report Generator ──

import { ThemeTokens } from './tokens';
import { CONTRAST_CHECKS, contrastRatio, meetsAA, meetsAAA, meetsAALarge, bestLogoAccentColour } from './accessibility';

export function generateAuditReport(tokens: ThemeTokens): string {
  const lines: string[] = [];
  lines.push('CFA Moodle Theme — Accessibility Audit Report');
  lines.push('='.repeat(50));
  lines.push(`Generated: ${new Date().toLocaleString()}`);
  lines.push('');

  // ── Contrast Checks ──
  lines.push('CONTRAST CHECKS');
  lines.push('-'.repeat(50));
  lines.push('');

  let passing = 0;
  const total = CONTRAST_CHECKS.length;

  for (const check of CONTRAST_CHECKS) {
    let fg = tokens[check.fgKey as keyof ThemeTokens] as string;
    const bg = tokens[check.bgKey as keyof ThemeTokens] as string;

    // Resolve 'auto' logoAustraliaColour to computed value
    if (check.fgKey === 'logoAustraliaColour' && fg === 'auto') {
      fg = bestLogoAccentColour(bg);
    }
    const ratio = contrastRatio(fg, bg);
    const aaa = meetsAAA(ratio);
    const passes = check.isLargeText ? meetsAALarge(ratio) : meetsAA(ratio);
    if (passes) passing++;

    let status: string;
    let criterion: string;
    if (aaa) {
      status = 'AAA PASS';
      criterion = 'WCAG 1.4.6 Enhanced Contrast';
    } else if (passes) {
      status = check.isLargeText ? 'AA PASS (large text)' : 'AA PASS';
      criterion = 'WCAG 1.4.3 Minimum Contrast';
    } else {
      status = 'FAIL';
      criterion = 'Below WCAG 1.4.3';
    }

    const textType = check.isLargeText ? ' [Large Text]' : '';
    lines.push(`${check.label}${textType}`);
    lines.push(`  ${check.description}`);
    lines.push(`  Foreground: ${fg} | Background: ${bg}`);
    lines.push(`  Ratio: ${ratio.toFixed(2)}:1 | ${status}`);
    lines.push(`  Criterion: ${criterion}`);
    lines.push('');
  }

  lines.push('-'.repeat(50));
  lines.push(`Contrast Score: ${passing}/${total} pairs pass (${Math.round((passing / total) * 100)}%)`);
  lines.push('');

  // ── Additional Checks (§7C) ──
  lines.push('ADDITIONAL CHECKS');
  lines.push('-'.repeat(50));

  const fontSizeOk = tokens.bodyFontSize >= 1;
  lines.push(`${fontSizeOk ? '✓' : '✗'} Body text ≥ 16px (1rem) — current: ${tokens.bodyFontSize}rem`);

  const lineHeightOk = tokens.lineHeight >= 1.5;
  lines.push(`${lineHeightOk ? '✓' : '✗'} Line height ≥ 1.5 — current: ${tokens.lineHeight}`);

  const focusOk = tokens.focusRingWidth >= 2;
  lines.push(`${focusOk ? '✓' : '✗'} Focus indicators visible (≥ 2px) — current: ${tokens.focusRingWidth}px`);

  lines.push('');
  lines.push('-'.repeat(50));
  lines.push('');
  lines.push('Note: WCAG 2.2 Level AA requires 4.5:1 for normal text and');
  lines.push('3.0:1 for large text ≥ 18px (WCAG 1.4.3). Level AAA requires 7.0:1 (WCAG 1.4.6).');

  return lines.join('\n');
}

export function downloadAuditReport(tokens: ThemeTokens): void {
  const report = generateAuditReport(tokens);
  const blob = new Blob([report], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'cfa-accessibility-audit.txt';
  a.click();
  URL.revokeObjectURL(url);
}
