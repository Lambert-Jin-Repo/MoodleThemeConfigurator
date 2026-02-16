'use client';

const TABS = ['Course', 'Settings', 'Participants', 'Grades'];

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
    </div>
  );
}
