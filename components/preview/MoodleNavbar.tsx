'use client';

import { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useThemeStore } from '@/store/theme-store';
import CfaLogo from './CfaLogo';

export default function MoodleNavbar() {
  const [editMode, setEditMode] = useState(false);
  const navbarBorder = useThemeStore((s) => s.tokens.navbarBorder);
  const navbarBg = useThemeStore((s) => s.tokens.navbarBg);
  const editModeThumb = useThemeStore((s) => s.tokens.editModeThumbColour);
  const hasBorder = navbarBorder !== 'none';

  return (
    <nav
      data-section="navbar"
      className="flex items-center justify-between px-4 py-2"
      style={{
        backgroundColor: 'var(--cfa-navbar-bg)',
        borderBottom: hasBorder
          ? `3px solid var(--cfa-navbar-border)`
          : undefined,
      }}
    >
      {/* Left: logo + hamburger + nav links */}
      <div className="flex items-center gap-3">
        <button className="moodle-icon-btn" aria-label="Toggle side menu">
          <Menu size={20} style={{ color: 'var(--cfa-navbar-text)' }} />
        </button>

        <CfaLogo bgHex={navbarBg} variant="navbar" />

        <div className="flex items-center gap-1 ml-2">
          <span className="moodle-nav-link text-sm font-medium">Dashboard</span>
          <span className="moodle-nav-link text-sm font-medium">My courses</span>
        </div>
      </div>

      {/* Right: edit mode + bell + avatar */}
      <div className="flex items-center gap-3">
        <div data-section="edit-mode-toggle" className="flex items-center gap-2 edit-mode-area">
          <span
            className="text-xs font-medium"
            style={{ color: 'var(--cfa-navbar-text)' }}
          >
            Edit mode
          </span>
          <button
            role="switch"
            aria-checked={editMode}
            aria-label="Toggle edit mode"
            onClick={() => setEditMode(!editMode)}
            className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200 focus:outline-none"
            style={{
              backgroundColor: editMode
                ? 'var(--cfa-edit-mode-on-colour)'
                : 'rgba(255,255,255,0.3)',
            }}
          >
            <span
              className="inline-block h-3.5 w-3.5 rounded-full transition-transform duration-200"
              style={{
                transform: editMode ? 'translateX(18px)' : 'translateX(3px)',
                backgroundColor: editMode
                  ? editModeThumb
                  : 'rgba(255,255,255,0.7)',
              }}
            />
          </button>
        </div>

        <button className="moodle-icon-btn" aria-label="Notifications">
          <Bell size={18} style={{ color: 'var(--cfa-navbar-text)' }} />
        </button>

        <div className="moodle-avatar" aria-label="User menu" />
      </div>
    </nav>
  );
}

