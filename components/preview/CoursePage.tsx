'use client';

import { ChevronDown, FileText, MessageSquare, Users, EyeOff } from 'lucide-react';
import SecondaryNav from './SecondaryNav';
import CourseDrawer from './CourseDrawer';

/* ------------------------------------------------------------------ */
/*  Activity data matching real CFA Moodle course page                */
/* ------------------------------------------------------------------ */

interface Activity {
  title: string;
  icon: 'page' | 'forum';
  rightLabel?: string;   // e.g. "To do"
  rightIcon?: 'group';   // group/collaboration icon
}

interface HiddenSection {
  title: string;
  showMarkAsDone?: boolean;
}

const GENERAL_ACTIVITIES: Activity[] = [
  { title: 'Welcome', icon: 'page' },
  { title: 'Introductions', icon: 'forum', rightIcon: 'group' },
  { title: 'Reflections', icon: 'forum', rightLabel: 'To do' },
  { title: 'General Discussion', icon: 'forum', rightLabel: 'To do' },
  { title: 'Aims & Objectives', icon: 'page' },
  { title: 'Graduate Qualities', icon: 'page' },
];

const HIDDEN_SECTION: HiddenSection = {
  title: 'Teleconference recordings',
  showMarkAsDone: true,
};

const POST_HIDDEN_ACTIVITIES: Activity[] = [
  { title: 'Resources', icon: 'page' },
  { title: 'Contacts', icon: 'page' },
  { title: 'Acknowledgements', icon: 'page' },
];

// Evaluation has a "Hidden from students" sub-badge
const EVALUATION_ACTIVITY: Activity & { hiddenBadge?: boolean } = {
  title: 'Evaluation',
  icon: 'page',
  hiddenBadge: true,
};

const NEWS_FORUM: Activity = { title: 'News forum', icon: 'forum' };

/* ------------------------------------------------------------------ */
/*  Activity icon component                                           */
/* ------------------------------------------------------------------ */

function ActivityIcon({ type }: { type: 'page' | 'forum' }) {
  // Moodle 4.x uses teal (#0f7b5f) for both page and forum activity icons
  const bg = '#0f7b5f';
  const Icon = type === 'page' ? FileText : MessageSquare;
  return (
    <div
      className="flex items-center justify-center rounded flex-shrink-0"
      style={{ width: 28, height: 28, backgroundColor: bg }}
    >
      <Icon size={16} color="#fff" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Activity row                                                      */
/* ------------------------------------------------------------------ */

function ActivityRowItem({ activity }: { activity: Activity & { hiddenBadge?: boolean } }) {
  return (
    <div
      className="moodle-activity-row flex items-center gap-3 px-4 py-2 border-b"
      style={{ borderColor: 'var(--cfa-card-border)' }}
    >
      <ActivityIcon type={activity.icon} />
      <div className="flex-1 min-w-0">
        <span className="moodle-link text-sm">{activity.title}</span>
        {activity.hiddenBadge && (
          <div className="flex items-center gap-1 mt-0.5">
            <EyeOff size={12} style={{ color: 'var(--cfa-muted-text)' }} />
            <span className="text-xs" style={{ color: 'var(--cfa-muted-text)' }}>
              Hidden from students
            </span>
          </div>
        )}
      </div>
      {activity.rightIcon === 'group' && (
        <Users size={16} style={{ color: 'var(--cfa-muted-text)' }} />
      )}
      {activity.rightLabel && (
        <span
          className="text-xs flex items-center gap-0.5"
          style={{ color: 'var(--cfa-muted-text)' }}
        >
          {activity.rightLabel} <ChevronDown size={12} />
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export default function CoursePage() {
  return (
    <div>
      <SecondaryNav />
      <div className="flex">
        <CourseDrawer />
        <div className="flex-1 p-6">
          {/* Course title */}
          <h2
            className="text-lg font-bold mb-6 highlight-text"
            style={{ color: 'var(--cfa-heading-text)' }}
          >
            Web Accessibility Compliance SC
          </h2>

          {/* General section */}
          <div
            className="rounded-lg border mb-4 overflow-hidden"
            style={{
              backgroundColor: 'var(--cfa-card-bg)',
              borderColor: 'var(--cfa-card-border)',
            }}
          >
            {/* Section header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: 'var(--cfa-card-border)' }}
            >
              <div className="flex items-center gap-2">
                <ChevronDown
                  size={16}
                  style={{ color: 'var(--cfa-heading-text)' }}
                />
                <h3
                  className="font-semibold text-base"
                  style={{ color: 'var(--cfa-heading-text)' }}
                >
                  General
                </h3>
              </div>
              <span className="moodle-link text-sm">Collapse all</span>
            </div>

            {/* Activity rows */}
            {GENERAL_ACTIVITIES.map((a) => (
              <ActivityRowItem key={a.title} activity={a} />
            ))}

            {/* Hidden section banner */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{
                backgroundColor: '#f8f9fa',
                borderColor: 'var(--cfa-card-border)',
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded"
                  style={{ backgroundColor: '#e9ecef', color: 'var(--cfa-body-text)' }}
                >
                  <EyeOff size={12} />
                  Hidden from students
                </span>
                <span className="text-sm" style={{ color: 'var(--cfa-body-text)' }}>
                  {HIDDEN_SECTION.title}
                </span>
              </div>
              <span
                className="text-sm"
                style={{ color: 'var(--cfa-muted-text)' }}
              >
                Mark as done
              </span>
            </div>

            {/* Post-hidden activities */}
            {POST_HIDDEN_ACTIVITIES.map((a) => (
              <ActivityRowItem key={a.title} activity={a} />
            ))}

            {/* Evaluation with hidden badge */}
            <ActivityRowItem activity={EVALUATION_ACTIVITY} />

            {/* News forum */}
            <ActivityRowItem activity={NEWS_FORUM} />
          </div>

          {/* Modules section header */}
          <div
            className="rounded-lg border overflow-hidden"
            style={{
              backgroundColor: 'var(--cfa-card-bg)',
              borderColor: 'var(--cfa-card-border)',
            }}
          >
            <div className="flex items-center gap-2 px-4 py-3">
              <ChevronDown
                size={16}
                style={{ color: 'var(--cfa-heading-text)' }}
              />
              <h3
                className="font-semibold text-base"
                style={{ color: 'var(--cfa-heading-text)' }}
              >
                Modules
              </h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
