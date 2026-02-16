'use client';

import { ChevronRight } from 'lucide-react';

const ITEMS = [
  'General',
  'Topic 1: Getting Started',
  'Topic 2: Core Concepts',
  'Topic 3: Advanced Topics',
];

export default function CourseDrawer() {
  return (
    <aside
      className="w-56 flex-shrink-0 border-r p-3 moodle-drawer"
      style={{
        backgroundColor: 'var(--cfa-drawer-bg)',
        borderColor: 'var(--cfa-drawer-border)',
      }}
    >
      <h4
        className="text-xs font-semibold uppercase tracking-wide mb-3 px-2"
        style={{ color: 'var(--cfa-muted-text)' }}
      >
        Course Index
      </h4>
      {ITEMS.map((item, i) => (
        <div
          key={item}
          className="moodle-drawer-item flex items-center justify-between text-sm"
          style={{
            color: i === 0 ? 'var(--cfa-link-colour)' : 'var(--cfa-body-text)',
            fontWeight: i === 0 ? 600 : 400,
          }}
        >
          <span>{item}</span>
          <ChevronRight size={14} className="opacity-40" />
        </div>
      ))}
    </aside>
  );
}
