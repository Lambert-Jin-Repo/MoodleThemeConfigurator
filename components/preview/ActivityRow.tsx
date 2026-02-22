'use client';

import { FileText } from 'lucide-react';

interface ActivityRowProps {
  title: string;
  type?: string;
}

export default function ActivityRow({ title, type = 'Assignment' }: ActivityRowProps) {
  return (
    <div className="moodle-activity-row flex items-center gap-3 px-2">
      <FileText
        size={16}
        style={{ color: 'var(--cfa-btn-primary-bg)', flexShrink: 0 }}
      />
      <div className="flex-1 min-w-0">
        <span data-section="links-&-focus" className="moodle-link text-sm">{title}</span>
        <p className="text-xs" style={{ color: 'var(--cfa-muted-text)' }}>
          {type}
        </p>
      </div>
    </div>
  );
}
