'use client';

import { X } from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';

interface AuditDrawerProps {
  children: React.ReactNode;
}

export default function AuditDrawer({ children }: AuditDrawerProps) {
  const open = useThemeStore((s) => s.auditDrawerOpen);
  const setOpen = useThemeStore((s) => s.setAuditDrawerOpen);

  return (
    <div
      className={`absolute top-0 right-0 h-full w-[300px] bg-white border-l border-gray-200 shadow-xl z-40 transition-transform duration-200 ${
        open ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-700">Accessibility Audit</span>
        <button
          onClick={() => setOpen(false)}
          className="p-1.5 rounded hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close audit panel"
        >
          <X size={16} />
        </button>
      </div>
      <div className="overflow-y-auto h-[calc(100%-41px)]">
        {children}
      </div>
    </div>
  );
}
