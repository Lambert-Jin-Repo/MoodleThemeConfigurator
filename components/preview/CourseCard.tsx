'use client';

import { BookOpen, GraduationCap } from 'lucide-react';

interface CourseCardProps {
  title: string;
  category?: string;
  imageType?: 'accessibility' | 'moodle';
}

export default function CourseCard({
  title,
  category = 'General',
  imageType = 'moodle',
}: CourseCardProps) {
  return (
    <div className="moodle-card overflow-hidden" style={{ borderRadius: '0.5rem' }}>
      {/* Image area */}
      {imageType === 'accessibility' ? (
        <div
          className="flex flex-col items-center justify-center overflow-hidden"
          style={{
            height: '150px',
            background: 'linear-gradient(135deg, #1a1a4e, #2a2a6e)',
            borderTopLeftRadius: '0.5rem',
            borderTopRightRadius: '0.5rem',
          }}
        >
          <span
            style={{
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 300,
              letterSpacing: '0.05em',
              lineHeight: 1.3,
            }}
          >
            Centre for
          </span>
          <span
            style={{
              color: '#ffffff',
              fontSize: '20px',
              fontWeight: 700,
              letterSpacing: '0.08em',
              lineHeight: 1.3,
            }}
          >
            Accessibili
          </span>
          <span
            style={{
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.25em',
              lineHeight: 1.5,
            }}
          >
            AUSTRALIA
          </span>
        </div>
      ) : (
        <div
          className="flex items-center justify-center gap-3 overflow-hidden"
          style={{
            height: '150px',
            backgroundColor: '#e9ecef',
            borderTopLeftRadius: '0.5rem',
            borderTopRightRadius: '0.5rem',
          }}
        >
          <BookOpen size={32} strokeWidth={1.5} style={{ color: '#adb5bd' }} />
          <GraduationCap size={32} strokeWidth={1.5} style={{ color: '#adb5bd' }} />
        </div>
      )}

      {/* Content area */}
      <div style={{ padding: '12px 14px' }}>
        <a
          className="moodle-link"
          href="#"
          onClick={(e) => e.preventDefault()}
          style={{
            fontSize: '14px',
            lineHeight: 1.4,
            display: 'block',
            textDecoration: 'none',
          }}
          aria-label={`Open course: ${title}`}
        >
          {title}
        </a>
        <p
          style={{
            color: 'var(--cfa-muted-text)',
            fontSize: '12px',
            marginTop: '4px',
            lineHeight: 1.4,
          }}
        >
          {category}
        </p>
      </div>
    </div>
  );
}
