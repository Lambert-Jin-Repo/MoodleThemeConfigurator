'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 1_048_576; // 1 MB

interface ImageUploadControlProps {
  label: string;
  value: string; // base64 data URL or ''
  onChange: (dataUrl: string) => void;
  onClear: () => void;
  disabled?: boolean;
  hint?: string;
}

export default function ImageUploadControl({
  label,
  value,
  onChange,
  onClear,
  disabled = false,
  hint,
}: ImageUploadControlProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');

  const processFile = useCallback(
    (file: File) => {
      setError(null);

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Only JPG, PNG, or WebP images are accepted.');
        return;
      }

      if (file.size > MAX_SIZE_BYTES) {
        setError('Image must be under 1 MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setFileName(file.name);
        onChange(reader.result as string);
      };
      reader.onerror = () => {
        setError('Failed to read file.');
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [disabled, processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = '';
    },
    [processFile]
  );

  const handleRemove = useCallback(() => {
    setFileName('');
    setError(null);
    onClear();
  }, [onClear]);

  return (
    <div className={`space-y-1.5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <label className="text-xs font-medium text-gray-600">{label}</label>

      {value ? (
        /* ── Thumbnail preview ── */
        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt={`${label} preview`}
            className="h-[60px] w-auto rounded object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-600 truncate">{fileName || 'Uploaded image'}</p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 rounded hover:bg-gray-200 transition-colors flex-shrink-0"
            aria-label={`Remove ${label}`}
          >
            <X size={14} className="text-gray-500" />
          </button>
        </div>
      ) : (
        /* ── Drop zone ── */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`w-full flex flex-col items-center gap-1.5 p-4 rounded border-2 border-dashed transition-colors cursor-pointer ${
            dragOver
              ? 'border-orange-400 bg-orange-50'
              : 'border-gray-300 hover:border-gray-400 bg-white'
          }`}
          aria-label={`Upload ${label}`}
        >
          <Upload size={18} className="text-gray-400" />
          <span className="text-xs text-gray-500">
            Drop image here or click to browse
          </span>
          <span className="text-[10px] text-gray-400">JPG, PNG, WebP &middot; Max 1 MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        aria-hidden="true"
      />

      {hint && !error && (
        <p className="text-[10px] text-gray-400 leading-tight">{hint}</p>
      )}

      {error && (
        <p className="text-[10px] text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}
