'use client';

import { useThemeStore } from '@/store/theme-store';
import { isDarkBackground, bestLogoAccentColour } from '@/lib/accessibility';

interface CfaLogoProps {
  /** Background colour the logo sits on — used for auto text colour detection */
  bgHex: string;
  /** 'navbar' = compact (~28px), 'login' = large (~200px wide), 'toolbar' = tiny (~20px) */
  variant: 'navbar' | 'login' | 'toolbar';
}

/**
 * CFA Logo — dynamic SVG/HTML rendering.
 * - 3-square staircase icon (always lime/orange/blue)
 * - "Centre for" / "Accessibility" text auto-switches charcoal/light based on bg
 * - "AUSTRALIA" text uses auto-detected or user-selected accent colour
 */
export default function CfaLogo({ bgHex, variant }: CfaLogoProps) {
  const logoAustraliaColour = useThemeStore((s) => s.tokens.logoAustraliaColour);

  const isDark = isDarkBackground(bgHex);
  const mainTextColour = isDark ? '#F0EEEE' : '#404041';
  const australiaColour =
    logoAustraliaColour === 'auto'
      ? bestLogoAccentColour(bgHex)
      : logoAustraliaColour;

  // Shared 3-square icon SVG
  const icon = (w: number, h: number) => (
    <svg width={w} height={h} viewBox="0 0 20 29" fill="none" aria-hidden="true">
      <rect x="11" y="0" width="9" height="9" fill="#BAF73C" />
      <rect x="0" y="10" width="9" height="9" fill="#F27927" />
      <rect x="11" y="20" width="9" height="9" fill="#00BFFF" />
    </svg>
  );

  if (variant === 'toolbar') {
    return (
      <div className="flex items-center gap-1" style={{ lineHeight: 1.1 }}>
        {icon(10, 15)}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: mainTextColour, fontSize: '6px', fontWeight: 600, letterSpacing: '0.04em' }}>
            Centre for
          </span>
          <span style={{ color: mainTextColour, fontSize: '7.5px', fontWeight: 800, letterSpacing: '0.02em' }}>
            Accessibility
          </span>
          <span style={{ color: australiaColour, fontSize: '4px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const }}>
            Australia
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'navbar') {
    return (
      <div className="flex items-center gap-1.5" style={{ lineHeight: 1.15 }}>
        {icon(14, 20)}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ color: mainTextColour, fontSize: '7.5px', fontWeight: 600, letterSpacing: '0.04em' }}>
            Centre for
          </span>
          <span style={{ color: mainTextColour, fontSize: '9.5px', fontWeight: 800, letterSpacing: '0.02em' }}>
            Accessibility
          </span>
          <span style={{ color: australiaColour, fontSize: '5.5px', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' as const }}>
            Australia
          </span>
        </div>
      </div>
    );
  }

  // Login variant — large, centred
  return (
    <div className="flex items-center gap-3 justify-center" style={{ lineHeight: 1.15 }}>
      {icon(40, 58)}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ color: mainTextColour, fontSize: '18px', fontWeight: 600, letterSpacing: '0.04em' }}>
          Centre for
        </span>
        <span style={{ color: mainTextColour, fontSize: '22px', fontWeight: 800, letterSpacing: '0.02em' }}>
          Accessibility
        </span>
        <span style={{ color: australiaColour, fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase' as const }}>
          Australia
        </span>
      </div>
    </div>
  );
}
