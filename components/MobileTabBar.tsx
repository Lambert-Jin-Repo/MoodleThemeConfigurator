'use client';

import { Sliders, Monitor, ShieldCheck } from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';
import type { MobileTab } from '@/store/theme-store';

const TABS: { id: MobileTab; label: string; icon: typeof Sliders }[] = [
  { id: 'controls', label: 'Controls', icon: Sliders },
  { id: 'preview', label: 'Preview', icon: Monitor },
  { id: 'audit', label: 'Audit', icon: ShieldCheck },
];

export default function MobileTabBar() {
  const mobileTab = useThemeStore((s) => s.mobileTab);
  const setMobileTab = useThemeStore((s) => s.setMobileTab);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden bg-[#404041] border-t border-gray-600"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Panel navigation"
    >
      {TABS.map((tab) => {
        const active = mobileTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setMobileTab(tab.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2 min-h-[56px] transition-colors ${
              active ? 'text-[#F27927]' : 'text-gray-400 active:text-gray-200'
            }`}
            aria-label={tab.label}
            aria-current={active ? 'page' : undefined}
          >
            <Icon size={20} />
            <span className="text-[10px] mt-0.5 font-medium">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
