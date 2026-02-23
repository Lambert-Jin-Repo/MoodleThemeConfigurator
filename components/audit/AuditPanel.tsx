'use client';

import { useMemo } from 'react';
import { useThemeStore } from '@/store/theme-store';
import { CONTRAST_CHECKS } from '@/lib/accessibility';
import { contrastRatio, meetsAA, meetsAALarge, bestLogoAccentColour } from '@/lib/accessibility';
import type { ThemeTokens } from '@/lib/tokens';
import { LOGO_ACCENT_COLOURS } from '@/lib/tokens';
import { Check, X } from 'lucide-react';
import ScoreBadge from './ScoreBadge';
import ContrastCard from './ContrastCard';

interface AdditionalCheck {
  id: string;
  label: string;
  passes: boolean;
}

export default function AuditPanel() {
  const tokens = useThemeStore((s) => s.tokens);
  const setToken = useThemeStore((s) => s.setToken);

  const { score, results, additionalChecks } = useMemo(() => {
    let passing = 0;
    const total = CONTRAST_CHECKS.length;
    const res = CONTRAST_CHECKS.map((check) => {
      let fg = tokens[check.fgKey as keyof ThemeTokens] as string;
      const bg = tokens[check.bgKey as keyof ThemeTokens] as string;

      // Resolve 'auto' logoAustraliaColour to computed value
      if (check.fgKey === 'logoAustraliaColour' && fg === 'auto') {
        fg = bestLogoAccentColour(bg);
      }

      const ratio = contrastRatio(fg, bg);
      const passes = check.isLargeText ? meetsAALarge(ratio) : meetsAA(ratio);
      if (passes) passing++;
      return { ...check, fg, bg, ratio, passes, isError: ratio < 3 };
    });
    // §7C non-contrast checks
    const additional: AdditionalCheck[] = [
      {
        id: 'font-size',
        label: 'Body text \u2265 16px (1rem)',
        passes: tokens.bodyFontSize >= 1,
      },
      {
        id: 'line-height',
        label: 'Line height \u2265 1.5',
        passes: tokens.lineHeight >= 1.5,
      },
      {
        id: 'focus-visible',
        label: 'Focus indicators visible',
        passes: tokens.focusRingWidth >= 2,
      },
    ];

    return {
      score: Math.round((passing / total) * 100),
      results: res,
      additionalChecks: additional,
    };
  }, [tokens]);

  return (
    <div className="h-full overflow-y-auto bg-white border-l border-gray-200">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-bold text-gray-800">Accessibility Audit</h2>
      </div>

      <div className="p-4 flex flex-col items-center border-b border-gray-200">
        <ScoreBadge score={score} />
      </div>

      <div className="p-4 space-y-3">
        {results.map((r) => (
          <ContrastCard
            key={r.id}
            label={r.label}
            description={r.description}
            fg={r.fg}
            bg={r.bg}
            isLargeText={r.isLargeText}
            onApplyFix={(fix) => {
              if (r.id === 'logo-australia' || r.id === 'logo-australia-login') {
                // For logo checks, suggest 'auto' which adapts per surface
                setToken('logoAustraliaColour', 'auto');
              } else {
                setToken(r.fgKey as keyof ThemeTokens, fix);
              }
            }}
          />
        ))}
      </div>

      {/* §7C Additional Checks */}
      <div className="px-4 pb-4 space-y-2 border-t border-gray-200 pt-3">
        <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Additional Checks</h3>
        {additionalChecks.map((check) => (
          <div key={check.id} className="flex items-center gap-2 text-sm">
            {check.passes ? (
              <Check className="w-4 h-4 text-green-600 flex-shrink-0" aria-hidden="true" />
            ) : (
              <X className="w-4 h-4 text-red-500 flex-shrink-0" aria-hidden="true" />
            )}
            <span className={check.passes ? 'text-gray-700' : 'text-red-700'}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
