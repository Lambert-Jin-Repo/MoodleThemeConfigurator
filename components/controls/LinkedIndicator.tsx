'use client';

import { Link2, Unlink } from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';
import { BRAND_LINKED_KEYS } from '@/lib/tokens';
import type { ThemeTokens } from '@/lib/tokens';

interface LinkedIndicatorProps {
  tokenKey: keyof ThemeTokens;
  currentValue: string;
}

export default function LinkedIndicator({ tokenKey, currentValue }: LinkedIndicatorProps) {
  const brandPrimary = useThemeStore((s) => s.tokens.brandPrimary);
  const setToken = useThemeStore((s) => s.setToken);

  const isBrandLinked = BRAND_LINKED_KEYS.includes(tokenKey);
  if (!isBrandLinked) return null;

  const isLinked = currentValue.toUpperCase() === brandPrimary.toUpperCase();

  if (isLinked) {
    return (
      <span className="inline-flex items-center gap-1 text-gray-400" title="Linked to Brand Primary">
        <Link2 className="w-3 h-3" />
        <span className="text-[10px]">Linked</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1">
      <Unlink className="w-3 h-3 text-amber-500" />
      <button
        className="text-[10px] text-amber-600 hover:text-amber-800 hover:underline"
        onClick={(e) => {
          e.stopPropagation();
          setToken(tokenKey, brandPrimary);
        }}
        title="Reset to Brand Primary"
        aria-label={`Reset ${tokenKey} to brand primary colour`}
      >
        Reset to brand
      </button>
    </span>
  );
}
