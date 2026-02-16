# Moodle Theme Configurator

A client-side web application that enables Moodle Cloud administrators to preview, customise, and export theme configurations without writing code. Built for the [Moodle Boost](https://docs.moodle.org/en/Boost_theme) theme on Moodle Cloud environments.

## Overview

Moodle Cloud restricts theme customisation to two SCSS input fields: **Raw initial SCSS** (variable declarations) and **Raw SCSS** (CSS rule overrides). This tool provides a visual interface to configure those values — administrators can adjust colours, preview changes on realistic page replicas, verify WCAG accessibility compliance, and export ready-to-paste SCSS.

### Key Features

- **Live Preview** — Realistic replicas of Moodle's Dashboard, Course, and Login pages that update in real time as settings change
- **8 Preset Templates** — Pre-configured colour schemes based on organisational brand guidelines, each fully editable
- **WCAG Accessibility Audit** — Real-time contrast ratio checking against WCAG 2.1 AA/AAA standards with automated fix suggestions
- **SCSS Export** — Two-block output (variables + rule overrides) formatted for direct paste into Moodle Cloud's theme settings
- **Background Image Upload** — Drag-and-drop image upload for site and login page backgrounds with live preview
- **Dynamic Logo Rendering** — SVG-based logo that automatically adapts accent colours for WCAG compliance against any background
- **Undo/Redo** — Full state history with keyboard shortcuts (Ctrl+Z / Ctrl+Y)
- **Save/Load Configurations** — Persist multiple theme configurations locally for comparison
- **Downloadable Audit Report** — Export accessibility audit results as a text report

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 14](https://nextjs.org/) (App Router, static export) |
| Language | TypeScript (strict mode) |
| UI Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Preview Styling | CSS Custom Properties (`--cfa-*` variables) |
| State Management | [Zustand](https://zustand-demo.pmnd.rs/) + [zundo](https://github.com/charkour/zundo) (undo/redo) |
| Colour Picker | [react-colorful](https://github.com/omgovich/react-colorful) |
| Icons | [Lucide React](https://lucide.dev/) |
| Deployment | [Vercel](https://vercel.com/) (static site) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
git clone https://github.com/Lambert-Jin-Repo/MoodleThemeConfigurator.git
cd MoodleThemeConfigurator
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

Generates a static export in the `/out` directory, ready for deployment to any static hosting platform.

### Lint

```bash
npm run lint
```

## Project Structure

```
├── app/                    # Next.js App Router (layout, page, global styles)
├── components/
│   ├── controls/           # Theme controls (colour pickers, sliders, presets)
│   ├── preview/            # Moodle page replicas (dashboard, course, login)
│   ├── audit/              # WCAG accessibility audit panel
│   └── export/             # SCSS export modal and instructions
├── lib/                    # Core logic (tokens, accessibility, SCSS generation)
├── store/                  # Zustand state management
├── public/                 # Static assets (logos)
└── docs/                   # Project documentation and references
```

## Architecture

The application follows a unidirectional data flow:

1. **Controls Panel** — Users adjust theme tokens (colours, sizes, toggles) via the left panel
2. **Zustand Store** — Token changes propagate through centralised state with brand-linked auto-updates
3. **CSS Custom Properties** — `MoodleShell` converts tokens to `--cfa-*` CSS variables on the preview container
4. **Preview Panel** — All preview components consume `var(--cfa-*)` for styling, ensuring live updates
5. **Audit Panel** — Contrast ratios are computed in real time against WCAG thresholds
6. **SCSS Generator** — Exports only modified values as Moodle-compatible SCSS

## Deployment

This project is configured for static export (`output: 'export'` in `next.config.mjs`). No server-side runtime or environment variables are required.

### Vercel

1. Import the repository at [vercel.com/new](https://vercel.com/new)
2. Vercel auto-detects the Next.js framework and static export configuration
3. Deploy — no additional settings needed

### Other Platforms

Run `npm run build` and serve the `/out` directory from any static file host (Netlify, GitHub Pages, S3, etc.).

## Disclaimer

> **The CFA (Centre for Accessibility) logo and brand assets included in this project are used strictly for development and testing purposes only. They are not intended for marketing, commercial distribution, or public representation of the CFA organisation. All CFA brand materials remain the property of the Centre for Accessibility Australia.**

## License

See [LICENSE](LICENSE) for details.
