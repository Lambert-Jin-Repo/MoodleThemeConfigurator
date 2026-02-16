'use client';

import { useEffect } from 'react';
import { useStore } from 'zustand';
import { useThemeStore } from '@/store/theme-store';

export function useKeyboardShortcuts({
  onSave,
  onExport,
}: {
  onSave: () => void;
  onExport: () => void;
}) {
  const { undo, redo } = useStore(useThemeStore.temporal);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        return;
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              redo();
            } else {
              undo();
            }
            break;
          case 'y':
            e.preventDefault();
            redo();
            break;
          case 's':
            e.preventDefault();
            onSave();
            break;
          case 'e':
            e.preventDefault();
            onExport();
            break;
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, onSave, onExport]);
}
