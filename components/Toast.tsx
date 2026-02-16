'use client';

import { useToastStore } from '@/store/toast-store';

export default function Toast() {
  const message = useToastStore((s) => s.message);

  if (!message) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white text-sm px-4 py-2 rounded-lg shadow-lg"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
