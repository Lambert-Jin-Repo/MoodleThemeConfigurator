'use client';

import { useThemeStore } from '@/store/theme-store';
import { ListTodo, ChevronLeft, ChevronRight, ChevronDown, Search } from 'lucide-react';

/* ── February 2026 calendar data ── */
const TODAY = 23;
const DAYS_IN_MONTH = 28;
const FIRST_DAY_OF_WEEK = 0; // Feb 1 2026 is a Sunday
const DAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function buildCalendarGrid(): (number | null)[][] {
  const rows: (number | null)[][] = [];
  let day = 1;
  // First row
  const firstRow: (number | null)[] = [];
  for (let i = 0; i < 7; i++) {
    if (i < FIRST_DAY_OF_WEEK) {
      firstRow.push(null);
    } else {
      firstRow.push(day++);
    }
  }
  rows.push(firstRow);
  // Remaining rows
  while (day <= DAYS_IN_MONTH) {
    const row: (number | null)[] = [];
    for (let i = 0; i < 7; i++) {
      if (day <= DAYS_IN_MONTH) {
        row.push(day++);
      } else {
        row.push(null);
      }
    }
    rows.push(row);
  }
  return rows;
}

const CALENDAR_ROWS = buildCalendarGrid();

export default function DashboardPage() {
  const tokens = useThemeStore((s) => s.tokens);

  /* ── Shared card style ── */
  const cardStyle: React.CSSProperties = {
    backgroundColor: 'var(--cfa-card-bg)',
    border: '1px solid var(--cfa-card-border)',
    borderRadius: 6,
  };

  return (
    <div
      className="p-6 max-w-[830px] mx-auto"
      style={{ backgroundColor: 'var(--cfa-page-bg)' }}
    >
      {/* ── 1. Dashboard Heading ── */}
      <h2
        className="font-bold mb-5 highlight-text"
        style={{
          color: 'var(--cfa-heading-text)',
          fontSize: 24,
          lineHeight: 1.3,
        }}
      >
        Dashboard
      </h2>

      {/* ── 2. Recently accessed courses ── */}
      <section className="mb-5">
        <div style={{ ...cardStyle, padding: '16px 20px' }}>
          <h3
            className="font-semibold mb-4"
            style={{
              color: 'var(--cfa-heading-text)',
              fontSize: 16,
            }}
          >
            Recently accessed courses
          </h3>

          <div className="flex gap-4">
            {/* Course card 1 — dark navy gradient placeholder */}
            <div
              className="moodle-card overflow-hidden flex-1"
              style={{ minWidth: 0 }}
            >
              {/* Image area */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #1a1a4e, #2a2a6e)',
                  height: 120,
                  position: 'relative',
                  padding: 12,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                }}
              >
                <span
                  style={{
                    color: '#FFFFFF',
                    fontSize: 13,
                    fontWeight: 600,
                    lineHeight: 1.3,
                  }}
                >
                  Centre for Accessibili
                </span>
                <span
                  style={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: 11,
                    marginTop: 2,
                  }}
                >
                  AUSTRALIA
                </span>
              </div>
              {/* Title + category */}
              <div style={{ padding: '10px 12px' }}>
                <span className="moodle-link" style={{ fontSize: 13 }}>
                  Web Accessibility Compliance S...
                </span>
                <div
                  style={{
                    color: 'var(--cfa-muted-text)',
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Category 1
                </div>
              </div>
            </div>

            {/* Course card 2 — grey placeholder */}
            <div
              className="moodle-card overflow-hidden flex-1"
              style={{ minWidth: 0 }}
            >
              {/* Image area */}
              <div
                style={{
                  backgroundColor: '#d5d8dc',
                  height: 120,
                }}
              />
              {/* Title + category */}
              <div style={{ padding: '10px 12px' }}>
                <span className="moodle-link" style={{ fontSize: 13 }}>
                  Starting with Moodle
                </span>
                <div
                  style={{
                    color: 'var(--cfa-muted-text)',
                    fontSize: 12,
                    marginTop: 4,
                  }}
                >
                  Category 1
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Timeline ── */}
      <section className="mb-5">
        <div style={{ ...cardStyle, padding: '16px 20px' }}>
          <h3
            className="font-semibold mb-4"
            style={{
              color: 'var(--cfa-heading-text)',
              fontSize: 16,
            }}
          >
            Timeline
          </h3>

          {/* Filter bar */}
          <div className="flex items-center gap-3 mb-5">
            {/* Next 7 days dropdown */}
            <div className="relative">
              <select
                className="moodle-btn-secondary"
                aria-label="Timeline range"
                defaultValue="7days"
                style={{
                  appearance: 'none',
                  backgroundColor: '#e9ecef',
                  color: '#1d2125',
                  border: '1px solid #ced4da',
                  borderRadius: tokens.btnRadius,
                  padding: '6px 30px 6px 12px',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <option value="7days">Next 7 days</option>
                <option value="30days">Next 30 days</option>
                <option value="3months">Next 3 months</option>
                <option value="6months">Next 6 months</option>
              </select>
              <ChevronDown
                size={14}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#1d2125',
                }}
              />
            </div>

            {/* Sort by dates dropdown */}
            <div className="relative">
              <select
                className="moodle-btn-secondary"
                aria-label="Sort order"
                defaultValue="dates"
                style={{
                  appearance: 'none',
                  backgroundColor: '#e9ecef',
                  color: '#1d2125',
                  border: '1px solid #ced4da',
                  borderRadius: tokens.btnRadius,
                  padding: '6px 30px 6px 12px',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <option value="dates">Sort by dates</option>
                <option value="courses">Sort by courses</option>
              </select>
              <ChevronDown
                size={14}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#1d2125',
                }}
              />
            </div>

            {/* Search input */}
            <div className="relative flex-1">
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: 10,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--cfa-muted-text)',
                  pointerEvents: 'none',
                }}
              />
              <input
                type="text"
                className="moodle-input w-full"
                placeholder="Search by activity type or name"
                aria-label="Search activities"
                style={{
                  fontSize: 13,
                  paddingLeft: 30,
                }}
                readOnly
              />
            </div>
          </div>

          {/* Empty state */}
          <div
            className="flex flex-col items-center justify-center py-10"
          >
            <ListTodo
              size={48}
              strokeWidth={1.2}
              style={{ color: 'var(--cfa-muted-text)', marginBottom: 12 }}
            />
            <span
              style={{
                color: 'var(--cfa-muted-text)',
                fontSize: 14,
              }}
            >
              No activities require action
            </span>
          </div>
        </div>
      </section>

      {/* ── 4. Calendar ── */}
      <section className="mb-5">
        <div style={{ ...cardStyle, padding: '16px 20px' }}>
          {/* Header row: course filter + new event button */}
          <div className="flex items-center justify-between mb-4">
            <div className="relative">
              <select
                className="moodle-btn-secondary"
                aria-label="Calendar course filter"
                defaultValue="all"
                style={{
                  appearance: 'none',
                  backgroundColor: '#e9ecef',
                  color: '#1d2125',
                  border: '1px solid #ced4da',
                  borderRadius: tokens.btnRadius,
                  padding: '6px 30px 6px 12px',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <option value="all">All courses</option>
              </select>
              <ChevronDown
                size={14}
                style={{
                  position: 'absolute',
                  right: 8,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: '#1d2125',
                }}
              />
            </div>

            <button
              className="moodle-btn-primary"
              aria-label="New event"
            >
              New event
            </button>
          </div>

          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <span className="moodle-link" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 2 }}>
              <ChevronLeft size={14} />
              January
            </span>
            <span
              className="font-bold"
              style={{
                color: 'var(--cfa-heading-text)',
                fontSize: 15,
              }}
            >
              February 2026
            </span>
            <span className="moodle-link" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 2 }}>
              March
              <ChevronRight size={14} />
            </span>
          </div>

          {/* Day grid */}
          <table
            style={{ width: '100%', borderCollapse: 'collapse' }}
            aria-label="February 2026 calendar"
          >
            <thead>
              <tr>
                {DAY_HEADERS.map((d) => (
                  <th
                    key={d}
                    style={{
                      color: 'var(--cfa-body-text)',
                      fontSize: 12,
                      fontWeight: 700,
                      textAlign: 'center',
                      padding: '6px 0',
                    }}
                  >
                    {d}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CALENDAR_ROWS.map((row, ri) => (
                <tr key={ri}>
                  {row.map((day, ci) => {
                    const isToday = day === TODAY;
                    return (
                      <td
                        key={ci}
                        style={{
                          textAlign: 'center',
                          padding: '4px 0',
                          fontSize: 13,
                        }}
                      >
                        {day !== null && (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 28,
                              height: 28,
                              borderRadius: '50%',
                              backgroundColor: isToday
                                ? 'var(--cfa-btn-primary-bg)'
                                : 'transparent',
                              color: isToday
                                ? '#FFFFFF'
                                : 'var(--cfa-body-text)',
                              fontWeight: isToday ? 700 : 400,
                            }}
                          >
                            {day}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
