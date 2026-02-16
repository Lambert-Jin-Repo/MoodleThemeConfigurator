'use client';

import { useThemeStore } from '@/store/theme-store';
import CourseCard from './CourseCard';
import ActivityRow from './ActivityRow';

const COURSES = [
  { title: 'Introduction to Web Accessibility' },
  { title: 'Document Accessibility' },
  { title: 'WCAG 2.2 Standards' },
];

const TIMELINE = [
  { title: 'Module 3 Quiz', type: 'Quiz' },
  { title: 'Accessibility Audit Report', type: 'Assignment' },
  { title: 'Discussion: Inclusive Design', type: 'Forum' },
];

export default function DashboardPage() {
  const sectionAccent = useThemeStore((s) => s.tokens.sectionAccent);
  const hasAccent = sectionAccent !== 'none';

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2
        className="text-lg font-semibold mb-4 highlight-text"
        style={{ color: 'var(--cfa-heading-text)' }}
      >
        Welcome back!
      </h2>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-sm font-semibold"
            style={{
              color: 'var(--cfa-heading-text)',
              borderBottom: hasAccent
                ? `2px solid var(--cfa-section-accent)`
                : undefined,
              paddingBottom: 4,
            }}
          >
            Course overview
          </h3>
          <span className="moodle-link text-xs">View all</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {COURSES.map((c) => (
            <CourseCard key={c.title} title={c.title} />
          ))}
        </div>
      </section>

      <section className="mb-6">
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
          Timeline
        </h3>
        <div
          className="rounded-lg border p-3"
          style={{
            backgroundColor: 'var(--cfa-card-bg)',
            borderColor: 'var(--cfa-card-border)',
          }}
        >
          {TIMELINE.map((a) => (
            <ActivityRow key={a.title} title={a.title} type={a.type} />
          ))}
        </div>
      </section>

      <div
        className="moodle-alert rounded-md p-3 text-sm"
        style={{
          backgroundColor: 'var(--cfa-alert-info-bg)',
          color: 'var(--cfa-body-text)',
          border: `1px solid var(--cfa-info)`,
        }}
      >
        <strong>Reminder:</strong> The accessibility audit for Q2 is due next week.{' '}
        <span className="moodle-link">View details</span>
      </div>
    </div>
  );
}
