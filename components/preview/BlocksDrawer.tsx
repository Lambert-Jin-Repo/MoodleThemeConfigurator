'use client';

import { Calendar, Clock } from 'lucide-react';

const UPCOMING_EVENTS = [
  { title: 'Module 3 Quiz due', time: 'Tomorrow, 11:59 PM' },
  { title: 'Live Q&A Session', time: 'Wed 10:00 AM' },
  { title: 'Assignment 2 opens', time: 'Fri 9:00 AM' },
];

/** Day numbers for a simplified calendar grid (month placeholder) */
const CALENDAR_DAYS = Array.from({ length: 28 }, (_, i) => i + 1);
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export default function BlocksDrawer() {
  return (
    <aside
      data-section="drawers"
      className="w-52 flex-shrink-0 border-l p-3 moodle-drawer hidden lg:block"
      style={{
        backgroundColor: 'var(--cfa-drawer-bg)',
        borderColor: 'var(--cfa-drawer-border)',
      }}
    >
      {/* Calendar Block */}
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <Calendar
            size={14}
            style={{ color: 'var(--cfa-drawer-text)', opacity: 0.7 }}
          />
          <h4
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: 'var(--cfa-drawer-text)', opacity: 0.7 }}
            title="Today highlight follows Brand Primary. Event type colours use their own fixed palette."
          >
            Calendar
          </h4>
        </div>
        <div
          className="rounded border p-2"
          style={{
            borderColor: 'var(--cfa-drawer-border)',
          }}
        >
          {/* Day labels row */}
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {DAY_LABELS.map((label, i) => (
              <span
                key={`label-${i}`}
                className="text-center font-medium"
                style={{
                  color: 'var(--cfa-drawer-text)',
                  opacity: 0.5,
                  fontSize: '9px',
                  lineHeight: '14px',
                }}
              >
                {label}
              </span>
            ))}
          </div>
          {/* Day numbers grid */}
          <div className="grid grid-cols-7 gap-0.5">
            {CALENDAR_DAYS.map((day) => (
              <span
                key={day}
                className="text-center flex items-center justify-center"
                style={{
                  color: day === 15 ? 'var(--cfa-btn-primary-text)' : 'var(--cfa-drawer-text)',
                  fontSize: '9px',
                  width: '18px',
                  height: '18px',
                  borderRadius: day === 15 ? '50%' : '2px',
                  backgroundColor:
                    day === 15
                      ? 'var(--cfa-btn-primary-bg)'
                      : 'transparent',
                  margin: '0 auto',
                }}
              >
                {day}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Events Block */}
      <div>
        <div className="flex items-center gap-1.5 mb-2 px-1">
          <Clock
            size={14}
            style={{ color: 'var(--cfa-drawer-text)', opacity: 0.7 }}
          />
          <h4
            className="text-xs font-semibold uppercase tracking-wide"
            style={{ color: 'var(--cfa-drawer-text)', opacity: 0.7 }}
          >
            Upcoming Events
          </h4>
        </div>
        <div className="space-y-2">
          {UPCOMING_EVENTS.map((event) => (
            <div
              key={event.title}
              className="moodle-drawer-item"
              style={{ color: 'var(--cfa-drawer-text)' }}
            >
              <p className="text-xs font-medium leading-tight">
                {event.title}
              </p>
              <p
                className="text-xs mt-0.5"
                style={{ color: 'var(--cfa-muted-text)' }}
              >
                {event.time}
              </p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
