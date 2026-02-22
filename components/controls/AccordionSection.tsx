'use client';

import { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { ChevronDown } from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';
import { useBreakpoint } from '@/lib/use-breakpoint';

export interface AccordionSectionHandle {
  open: () => void;
  scrollIntoView: () => void;
}

interface AccordionSectionProps {
  title: string;
  sectionId?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const AccordionSection = forwardRef<AccordionSectionHandle, AccordionSectionProps>(
  function AccordionSection({ title, sectionId, defaultOpen = false, children }, ref) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const id = sectionId || title.toLowerCase().replace(/\s+/g, '-');
    const containerRef = useRef<HTMLDivElement>(null);
    const setActiveControlSection = useThemeStore((s) => s.setActiveControlSection);
    const setMobileTab = useThemeStore((s) => s.setMobileTab);
    const setActivePage = useThemeStore((s) => s.setActivePage);
    const bp = useBreakpoint();

    useImperativeHandle(ref, () => ({
      open: () => {
        setIsOpen(true);
        setActiveControlSection(id);
      },
      scrollIntoView: () => {
        requestAnimationFrame(() => {
          containerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
      },
    }));

    const handleToggle = () => {
      const next = !isOpen;
      setIsOpen(next);
      setActiveControlSection(next ? id : null);

      if (next && bp === 'mobile') {
        setMobileTab('preview');
      }

      if (next && id === 'login-page') {
        setActivePage('login');
      }
    };

    return (
      <div ref={containerRef} className="border-b border-gray-200">
        <button
          className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          aria-expanded={isOpen}
          aria-controls={`section-${id}`}
          onClick={handleToggle}
        >
          {title}
          <ChevronDown
            size={16}
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        {isOpen && (
          <div id={`section-${id}`} className="px-4 pb-4 space-y-3">
            {children}
          </div>
        )}
      </div>
    );
  }
);

export default AccordionSection;
