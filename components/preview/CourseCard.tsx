'use client';

interface CourseCardProps {
  title: string;
  category?: string;
}

export default function CourseCard({ title, category = 'General' }: CourseCardProps) {
  return (
    <div className="moodle-card overflow-hidden">
      {/* Card image placeholder */}
      <div
        className="h-28 flex items-center justify-center"
        style={{ backgroundColor: 'var(--cfa-btn-primary-bg)', opacity: 0.15 }}
      >
        <span className="text-gray-400 text-xs">Course Image</span>
      </div>

      <div className="p-4">
        <p className="text-xs mb-1" style={{ color: 'var(--cfa-muted-text)' }}>
          {category}
        </p>
        <h3
          className="font-semibold text-sm mb-2"
          style={{ color: 'var(--cfa-heading-text)' }}
        >
          {title}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          {/* Progress bar */}
          <div
            className="flex-1 h-2 rounded-full"
            style={{ backgroundColor: 'var(--cfa-progress-bg)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                backgroundColor: 'var(--cfa-progress-fill)',
                width: '60%',
              }}
            />
          </div>
          <span className="text-xs" style={{ color: 'var(--cfa-muted-text)' }}>
            60%
          </span>
        </div>
        <div className="flex gap-2">
          <button className="moodle-btn-primary text-xs">Continue</button>
          <button className="moodle-btn-outline text-xs">View</button>
        </div>
      </div>
    </div>
  );
}
