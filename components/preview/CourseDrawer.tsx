'use client';

import { ChevronDown, X, MoreVertical, Lock } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Data matching the real CFA Moodle Cloud course index drawer       */
/* ------------------------------------------------------------------ */

interface DrawerItem {
  name: string;
  incomplete?: boolean; // shows ○ indicator
  locked?: boolean;     // shows 🔒 lock icon
}

interface DrawerSection {
  title: string;
  expanded: boolean;
  hasCompletion: boolean; // section itself shows ○ when incomplete
  items: DrawerItem[];
}

const SECTIONS: DrawerSection[] = [
  {
    title: 'General',
    expanded: true,
    hasCompletion: false,
    items: [
      { name: 'Welcome' },
      { name: 'Introductions' },
      { name: 'Reflections', incomplete: true },
      { name: 'General Discussion', incomplete: true },
      { name: 'Aims & Objectives' },
      { name: 'Graduate Qualities' },
    ],
  },
  {
    title: 'Teleconference recordings',
    expanded: false,
    hasCompletion: true,
    items: [
      { name: 'Resources' },
      { name: 'Contacts' },
      { name: 'Acknowledgements' },
      { name: 'Evaluation' },
      { name: 'News forum' },
    ],
  },
  {
    title: 'Modules',
    expanded: true,
    hasCompletion: false,
    items: [
      { name: 'Modules' },
      { name: 'Module 1: Why should you car\u2026' },
      { name: 'Module 2: W3C accessibility st\u2026' },
      { name: 'Module 3: Essential WCAG tec\u2026' },
      { name: 'Module 4: Advanced WCAG te\u2026' },
      { name: 'Module 5: Authoring Tool Acce\u2026' },
      { name: 'Module 6: Evaluation and futur\u2026' },
    ],
  },
  {
    title: 'Level A quick tips',
    expanded: false,
    hasCompletion: true,
    items: [],
  },
  {
    title: 'Assessments',
    expanded: true,
    hasCompletion: false,
    items: [
      { name: 'Key Dates' },
      { name: 'Assignment 1', incomplete: true },
      { name: 'Assignment 1 Project Analy\u2026', incomplete: true, locked: true },
      { name: 'Assignment One Mark Sheet (\u2026' },
      { name: 'Assignment 2', incomplete: true },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Incomplete circle indicator                                       */
/* ------------------------------------------------------------------ */

function IncompleteCircle() {
  return (
    <span
      className="inline-block flex-shrink-0"
      style={{
        width: 10,
        height: 10,
        borderRadius: '50%',
        border: '1.5px solid var(--cfa-drawer-text)',
        opacity: 0.55,
      }}
      aria-label="Incomplete"
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                    */
/* ------------------------------------------------------------------ */

export default function CourseDrawer() {
  return (
    <aside
      className="moodle-drawer w-44 flex-shrink-0 flex flex-col border-r"
      style={{
        backgroundColor: 'var(--cfa-drawer-bg)',
        borderColor: 'var(--cfa-drawer-border)',
        color: 'var(--cfa-drawer-text)',
      }}
    >
      {/* ---- Header bar ---- */}
      <div
        className="flex items-center justify-between px-2 py-1.5 border-b"
        style={{ borderColor: 'var(--cfa-drawer-border)' }}
      >
        <button
          className="moodle-icon-btn p-1 rounded hover:opacity-70"
          style={{ color: 'var(--cfa-drawer-text)' }}
          aria-label="Close course index"
        >
          <X size={16} />
        </button>
        <button
          className="moodle-icon-btn p-1 rounded hover:opacity-70"
          style={{ color: 'var(--cfa-drawer-text)' }}
          aria-label="More options"
        >
          <MoreVertical size={16} />
        </button>
      </div>

      {/* ---- Scrollable course index ---- */}
      <div className="flex-1 overflow-y-auto py-1">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            {/* Section header */}
            <div
              className="moodle-drawer-item flex items-center gap-1 px-2 py-1 cursor-pointer select-none"
              style={{ color: 'var(--cfa-drawer-text)' }}
              role="button"
              aria-expanded={section.expanded}
              aria-label={`${section.expanded ? 'Collapse' : 'Expand'} ${section.title}`}
            >
              {/* Completion indicator OR chevron space */}
              {section.hasCompletion ? (
                <IncompleteCircle />
              ) : section.expanded ? (
                <ChevronDown size={12} className="flex-shrink-0 opacity-70" />
              ) : (
                <ChevronDown
                  size={12}
                  className="flex-shrink-0 opacity-70"
                  style={{ transform: 'rotate(-90deg)' }}
                />
              )}
              <span
                className="text-xs font-bold truncate leading-tight"
                style={{ fontSize: 13 }}
              >
                {section.title}
              </span>
            </div>

            {/* Section items (only when expanded) */}
            {section.expanded &&
              section.items.map((item) => (
                <div
                  key={item.name}
                  className="moodle-drawer-item flex items-center gap-1.5 pl-5 pr-2 py-0.5 cursor-pointer hover:opacity-80"
                  style={{ color: 'var(--cfa-drawer-text)' }}
                >
                  {/* Incomplete circle or spacer */}
                  {item.incomplete ? (
                    <IncompleteCircle />
                  ) : (
                    <span className="inline-block flex-shrink-0" style={{ width: 10 }} />
                  )}

                  <span
                    className="truncate leading-tight"
                    style={{ fontSize: 13 }}
                  >
                    {item.name}
                  </span>

                  {/* Lock icon for restricted items */}
                  {item.locked && (
                    <Lock
                      size={12}
                      className="flex-shrink-0 opacity-50"
                      style={{ color: 'var(--cfa-drawer-text)' }}
                      aria-label="Restricted"
                    />
                  )}
                </div>
              ))}
          </div>
        ))}
      </div>
    </aside>
  );
}
