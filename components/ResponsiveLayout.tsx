'use client';

import { useThemeStore } from '@/store/theme-store';
import AuditDrawer from '@/components/audit/AuditDrawer';

interface ResponsiveLayoutProps {
  controls: React.ReactNode;
  preview: React.ReactNode;
  audit: React.ReactNode;
}

export default function ResponsiveLayout({ controls, preview, audit }: ResponsiveLayoutProps) {
  const mobileTab = useThemeStore((s) => s.mobileTab);

  return (
    <>
      {/* ── Desktop layout (lg+): 3-panel, identical to original ── */}
      <div className="hidden lg:flex h-full">
        <div className="w-[320px] flex-shrink-0 overflow-hidden">
          {controls}
        </div>
        <div className="flex-1 overflow-hidden" id="main-content">
          {preview}
        </div>
        <div className="w-[300px] flex-shrink-0 overflow-hidden">
          {audit}
        </div>
      </div>

      {/* ── Tablet layout (md–lg): 2-column + audit drawer ── */}
      <div className="hidden md:flex lg:hidden h-full relative">
        <div className="w-[280px] flex-shrink-0 overflow-hidden">
          {controls}
        </div>
        <div className="flex-1 overflow-hidden relative" id="main-content-tablet">
          {preview}
          <AuditDrawer>{audit}</AuditDrawer>
        </div>
      </div>

      {/* ── Mobile layout (<md): single panel via tab bar ── */}
      <div className="flex md:hidden h-full pb-14">
        <div
          className={`w-full h-full overflow-hidden ${mobileTab !== 'controls' ? 'hidden' : ''}`}
        >
          {controls}
        </div>
        <div
          className={`w-full h-full overflow-hidden ${mobileTab !== 'preview' ? 'hidden' : ''}`}
          id="main-content-mobile"
        >
          {preview}
        </div>
        <div
          className={`w-full h-full overflow-hidden ${mobileTab !== 'audit' ? 'hidden' : ''}`}
        >
          {audit}
        </div>
      </div>
    </>
  );
}
