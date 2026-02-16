'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Trash2 } from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';
import { useToastStore } from '@/store/toast-store';

interface SaveLoadModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SaveLoadModal({ open, onClose }: SaveLoadModalProps) {
  const [name, setName] = useState('');
  const savedConfigs = useThemeStore((s) => s.savedConfigs);
  const saveConfig = useThemeStore((s) => s.saveConfig);
  const loadConfig = useThemeStore((s) => s.loadConfig);
  const deleteConfig = useThemeStore((s) => s.deleteConfig);
  const showToast = useToastStore((s) => s.show);
  const modalRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    saveConfig(name.trim(), 0);
    setName('');
    showToast(`Configuration "${name.trim()}" saved`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-label="Save and load configurations"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-800">Saved Configurations</h3>
          <button
            ref={closeRef}
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4">
          {/* Save */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Configuration name"
              className="flex-1 text-sm border border-gray-300 rounded px-3 py-2"
              aria-label="Configuration name"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
              }}
            />
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="px-4 py-2 text-sm font-medium bg-gray-800 text-white rounded hover:bg-gray-700 disabled:opacity-50"
            >
              Save
            </button>
          </div>

          {/* Saved list */}
          {savedConfigs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              No saved configurations yet
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {savedConfigs.map((config) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">{config.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(config.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        loadConfig(config.id);
                        showToast(`Loaded "${config.name}"`);
                        onClose();
                      }}
                      className="text-xs text-blue-600 hover:underline px-2 py-1"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => deleteConfig(config.id)}
                      className="p-1 text-gray-400 hover:text-red-500"
                      aria-label={`Delete ${config.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
