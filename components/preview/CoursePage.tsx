'use client';

import { useThemeStore } from '@/store/theme-store';
import SecondaryNav from './SecondaryNav';
import CourseDrawer from './CourseDrawer';
import ActivityRow from './ActivityRow';

const ACTIVITIES = [
  { title: 'Welcome and Introduction', type: 'Page' },
  { title: 'Module 1: Understanding WCAG', type: 'Lesson' },
  { title: 'Knowledge Check Quiz', type: 'Quiz' },
  { title: 'Accessibility Checklist Template', type: 'File' },
  { title: 'Group Discussion: Barriers to Access', type: 'Forum' },
];

export default function CoursePage() {
  const sectionAccent = useThemeStore((s) => s.tokens.sectionAccent);
  const hasAccent = sectionAccent !== 'none';

  return (
    <div>
      <SecondaryNav />
      <div className="flex">
        <CourseDrawer />
        <div className="flex-1 p-6">
          <h2
            data-section="typography"
            className="text-lg font-semibold mb-1 highlight-text"
            style={{ color: 'var(--cfa-heading-text)' }}
          >
            Introduction to Web Accessibility
          </h2>
          <p className="text-sm mb-4" style={{ color: 'var(--cfa-muted-text)' }}>
            General &bull; Updated 2 days ago
          </p>

          <h3
            className="text-sm font-semibold mb-3"
            style={{
              color: 'var(--cfa-heading-text)',
              borderBottom: hasAccent
                ? `2px solid var(--cfa-section-accent)`
                : undefined,
              paddingBottom: 4,
            }}
          >
            General
          </h3>

          <div
            className="rounded-lg border mb-4"
            style={{
              backgroundColor: 'var(--cfa-card-bg)',
              borderColor: 'var(--cfa-card-border)',
            }}
          >
            {ACTIVITIES.map((a) => (
              <ActivityRow key={a.title} title={a.title} type={a.type} />
            ))}
          </div>

          <div className="flex gap-2">
            <button className="moodle-btn-primary text-sm">
              Mark all as complete
            </button>
            <button className="moodle-btn-outline text-sm">
              Download resources
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
