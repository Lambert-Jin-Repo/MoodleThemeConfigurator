'use client';

import { ChevronDown } from 'lucide-react';

const TABS = ['Course', 'Settings', 'Participants', 'Grades', 'Activities'];

export default function SecondaryNav() {
  return (
    <div
      className="flex border-b"
      style={{ borderColor: 'var(--cfa-card-border)' }}
    >
      {TABS.map((tab, i) => (
        <span
          key={tab}
          className={`moodle-tab text-sm ${i === 0 ? 'active' : ''}`}
        >
          {tab}
        </span>
      ))}
      <span className="moodle-tab text-sm flex items-center gap-1">
        More <ChevronDown size={14} />
      </span>
    </div>
  );
}
