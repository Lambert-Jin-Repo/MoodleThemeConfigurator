'use client';

import { Undo2, Redo2, RotateCcw, Save, FileCode } from 'lucide-react';
import { useStore } from 'zustand';
import { useThemeStore } from '@/store/theme-store';

interface ToolbarProps {
  onSave: () => void;
  onExport: () => void;
}

export default function Toolbar({ onSave, onExport }: ToolbarProps) {
  const reset = useThemeStore((s) => s.reset);
  const { undo, redo } = useStore(useThemeStore.temporal);

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-[#404041] text-white">
      {/* Left: title */}
      <h1 className="text-sm font-bold tracking-wide">
        Moodle Theme Configurator
      </h1>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          icon={<Undo2 size={16} />}
          label="Undo (Ctrl+Z)"
          onClick={() => undo()}
        />
        <ToolbarButton
          icon={<Redo2 size={16} />}
          label="Redo (Ctrl+Y)"
          onClick={() => redo()}
        />
        <div className="w-px h-5 bg-gray-600 mx-1" />
        <ToolbarButton
          icon={<RotateCcw size={16} />}
          label="Reset to defaults"
          onClick={reset}
        />
        <ToolbarButton
          icon={<Save size={16} />}
          label="Save configuration (Ctrl+S)"
          onClick={onSave}
        />
        <button
          onClick={onExport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F27927] text-white text-xs font-semibold rounded hover:bg-[#d96a20] transition-colors ml-1"
          aria-label="Export SCSS (Ctrl+E)"
        >
          <FileCode size={14} />
          Export SCSS
        </button>
      </div>
    </header>
  );
}

function ToolbarButton({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="p-1.5 rounded hover:bg-white/10 transition-colors"
      aria-label={label}
      title={label}
    >
      {icon}
    </button>
  );
}
