'use client';

import { useRef, useState, useEffect } from 'react';
import { useThemeStore } from '@/store/theme-store';
import { useBreakpoint } from '@/lib/use-breakpoint';
import PreviewToolbar from './PreviewToolbar';
import MoodleShell from './MoodleShell';

const DESIGN_WIDTH = 1280;

export default function PreviewPanel() {
  const zoom = useThemeStore((s) => s.zoom);
  const bp = useBreakpoint();
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScale, setAutoScale] = useState(1);

  // Auto-fit: observe container width on mobile and compute scale
  useEffect(() => {
    if (bp !== 'mobile') return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? el.clientWidth;
      setAutoScale(width / DESIGN_WIDTH);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [bp]);

  const isMobile = bp === 'mobile';

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <PreviewToolbar />
      <div
        ref={containerRef}
        className={`flex-1 overflow-auto ${isMobile ? '' : 'p-4'}`}
      >
        {isMobile ? (
          /* Mobile: fixed design width, auto-scaled to fit */
          <div
            className="bg-white shadow-lg origin-top-left"
            style={{
              transform: `scale(${autoScale})`,
              width: `${DESIGN_WIDTH}px`,
              height: autoScale > 0 ? `${100 / autoScale}%` : undefined,
            }}
          >
            <MoodleShell />
          </div>
        ) : (
          /* Desktop/Tablet: original percentage-based zoom */
          <div
            className="mx-auto bg-white shadow-lg origin-top"
            style={{
              transform: `scale(${zoom / 100})`,
              width: `${100 / (zoom / 100)}%`,
              maxWidth: zoom < 100 ? `${100 / (zoom / 100)}%` : '100%',
            }}
          >
            <MoodleShell />
          </div>
        )}
      </div>
    </div>
  );
}
