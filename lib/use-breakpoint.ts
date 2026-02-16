'use client';

import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

const TABLET_QUERY = '(min-width: 768px)';
const DESKTOP_QUERY = '(min-width: 1024px)';

function getBreakpoint(): Breakpoint {
  if (typeof window === 'undefined') return 'desktop';
  if (window.matchMedia(DESKTOP_QUERY).matches) return 'desktop';
  if (window.matchMedia(TABLET_QUERY).matches) return 'tablet';
  return 'mobile';
}

export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>('desktop');

  useEffect(() => {
    setBp(getBreakpoint());

    const desktopMql = window.matchMedia(DESKTOP_QUERY);
    const tabletMql = window.matchMedia(TABLET_QUERY);

    const handler = () => setBp(getBreakpoint());

    desktopMql.addEventListener('change', handler);
    tabletMql.addEventListener('change', handler);

    return () => {
      desktopMql.removeEventListener('change', handler);
      tabletMql.removeEventListener('change', handler);
    };
  }, []);

  return bp;
}
