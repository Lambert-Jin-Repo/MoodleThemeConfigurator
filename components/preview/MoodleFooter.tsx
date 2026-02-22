'use client';

import { useThemeStore } from '@/store/theme-store';

export default function MoodleFooter() {
  const footerAccent = useThemeStore((s) => s.tokens.footerAccent);
  const hasAccent = footerAccent !== 'none';

  return (
    <footer
      data-section="footer"
      className="px-6 py-4 text-sm"
      style={{
        backgroundColor: 'var(--cfa-footer-bg)',
        color: 'var(--cfa-footer-text)',
        borderTop: hasAccent
          ? `4px solid var(--cfa-footer-accent)`
          : undefined,
      }}
    >
      <div className="flex items-center justify-between">
        <span>&copy; Centre for Accessibility Australia</span>
        <span className="moodle-footer-link">Support</span>
      </div>
    </footer>
  );
}
