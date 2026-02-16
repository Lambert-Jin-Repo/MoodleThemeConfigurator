'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const STEPS = [
  'Log in to cfaa.moodlecloud.com as admin',
  'Go to Site administration → Appearance → Themes → Boost',
  'Enter the Brand colour hex value into the Brand colour picker',
  'Expand "Advanced settings"',
  'Paste the "Raw Initial SCSS" code into the first SCSS box',
  'Paste the "Raw SCSS" code into the second SCSS box',
  'Click "Save changes"',
  'Go to Site administration → Development → Purge all caches',
  'Test the changes in an incognito/private browsing window',
];

export default function InstructionPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
      >
        How to apply in Moodle
        <ChevronDown
          size={16}
          className={`transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <ol className="px-3 pb-3 space-y-1.5">
          {STEPS.map((step, i) => (
            <li key={i} className="text-xs text-gray-600 flex gap-2">
              <span className="font-bold text-gray-800 flex-shrink-0">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
