'use client';

import { Home } from 'lucide-react';

export default function MoodleBreadcrumb() {
  return (
    <div
      className="moodle-breadcrumb px-4 py-2 text-sm flex items-center gap-2"
      style={{ backgroundColor: 'var(--cfa-breadcrumb-bg)' }}
    >
      <Home size={14} style={{ color: 'var(--cfa-muted-text)' }} />
      <span style={{ color: 'var(--cfa-muted-text)' }}>/</span>
      <span className="moodle-link text-sm">Home</span>
      <span style={{ color: 'var(--cfa-muted-text)' }}>/</span>
      <span className="font-medium" style={{ color: 'var(--cfa-body-text)' }}>Dashboard</span>
    </div>
  );
}
