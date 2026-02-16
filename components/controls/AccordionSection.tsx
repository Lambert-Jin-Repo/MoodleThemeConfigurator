'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';

interface AccordionSectionProps {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function AccordionSection({
  title,
  defaultOpen = false,
  children,
}: AccordionSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = title.toLowerCase().replace(/\s+/g, '-');
  const setActiveControlSection = useThemeStore((s) => s.setActiveControlSection);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    setActiveControlSection(next ? id : null);
  };

  return (
    <div className="border-b border-gray-200">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
        aria-expanded={open}
        aria-controls={`section-${id}`}
        onClick={handleToggle}
      >
        {title}
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div id={`section-${id}`} className="px-4 pb-4 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}
