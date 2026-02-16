'use client';

import { Home } from 'lucide-react';

export default function MoodleBreadcrumb() {
  return (
    <div
      className="moodle-breadcrumb px-4 py-2 text-sm flex items-center gap-2"
      style={{ backgroundColor: 'var(--cfa-breadcrumb-bg)' }}
    >
      <Home size={14} className="text-gray-500" />
      <span className="text-gray-500">/</span>
      <span className="moodle-link text-sm">Home</span>
      <span className="text-gray-500">/</span>
      <span className="text-gray-600 font-medium">Dashboard</span>
    </div>
  );
}
