'use client';

import { useThemeStore } from '@/store/theme-store';
import PreviewToolbar from './PreviewToolbar';
import MoodleShell from './MoodleShell';

export default function PreviewPanel() {
  const zoom = useThemeStore((s) => s.zoom);

  return (
    <div className="flex flex-col h-full bg-gray-100">
      <PreviewToolbar />
      <div className="flex-1 overflow-auto p-4">
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
      </div>
    </div>
  );
}
