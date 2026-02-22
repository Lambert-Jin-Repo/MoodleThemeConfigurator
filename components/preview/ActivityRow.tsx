'use client';

import {
  FileText,
  ClipboardCheck,
  MessageSquare,
  Users,
  Settings,
  type LucideIcon,
} from 'lucide-react';

type ActivityPurpose =
  | 'assessment'
  | 'communication'
  | 'collaboration'
  | 'content'
  | 'administration';

/**
 * Moodle 4.x fixed purpose colors for activity icons.
 * These are core Moodle colors and are NOT user-configurable via theme settings.
 */
const PURPOSE_COLORS: Record<ActivityPurpose, string> = {
  assessment: '#eb66a2',
  communication: '#11a676',
  collaboration: '#f7634d',
  content: '#399be2',
  administration: '#5d63f6',
};

const PURPOSE_ICONS: Record<ActivityPurpose, LucideIcon> = {
  assessment: ClipboardCheck,
  communication: MessageSquare,
  collaboration: Users,
  content: FileText,
  administration: Settings,
};

interface ActivityRowProps {
  title: string;
  type?: string;
  purpose?: ActivityPurpose;
}

export default function ActivityRow({
  title,
  type = 'Assignment',
  purpose,
}: ActivityRowProps) {
  const Icon = purpose ? PURPOSE_ICONS[purpose] : FileText;
  const iconColor = purpose
    ? PURPOSE_COLORS[purpose]
    : 'var(--cfa-btn-primary-bg)';

  return (
    <div className="moodle-activity-row flex items-center gap-3 px-2">
      <div
        className="flex items-center justify-center rounded-md flex-shrink-0"
        style={{
          width: 28,
          height: 28,
          backgroundColor: iconColor,
          opacity: 0.9,
        }}
      >
        <Icon size={16} style={{ color: '#ffffff' }} />
      </div>
      <div className="flex-1 min-w-0">
        <span data-section="links-&-focus" className="moodle-link text-sm">
          {title}
        </span>
        <p className="text-xs" style={{ color: 'var(--cfa-muted-text)' }}>
          {type}
        </p>
      </div>
    </div>
  );
}
