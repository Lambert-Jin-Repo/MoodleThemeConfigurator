'use client';

import { useThemeStore } from '@/store/theme-store';
import type { PreviewPage } from '@/lib/tokens';

const PAGES: { id: PreviewPage; label: string }[] = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'course', label: 'Course' },
  { id: 'login', label: 'Login' },
];

const ZOOM_OPTIONS = [75, 100, 125];

export default function PreviewToolbar() {
  const activePage = useThemeStore((s) => s.activePage);
  const setActivePage = useThemeStore((s) => s.setActivePage);
  const zoom = useThemeStore((s) => s.zoom);
  const setZoom = useThemeStore((s) => s.setZoom);

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
      <div className="flex gap-1" role="tablist" aria-label="Preview pages">
        {PAGES.map((page) => (
          <button
            key={page.id}
            role="tab"
            aria-selected={activePage === page.id}
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activePage === page.id
                ? 'bg-gray-800 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setActivePage(page.id)}
          >
            {page.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label htmlFor="zoom-select" className="text-xs text-gray-500">
          Zoom
        </label>
        <select
          id="zoom-select"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="text-sm border border-gray-300 rounded px-2 py-1"
        >
          {ZOOM_OPTIONS.map((z) => (
            <option key={z} value={z}>
              {z}%
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
