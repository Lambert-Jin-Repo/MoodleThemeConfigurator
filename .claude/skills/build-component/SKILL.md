---
name: Build Component
description: Generate a new component following project patterns
argument-hint: "[component-name]"
---

# Build Component

Build a new component for the CFA Brand Sandbox project. Before writing code:

1. Read `UNIFIED-SPEC.md` for the component's specification
2. Read `docs/cfa-brand-reference.md` for brand colours and typography
3. Read `docs/moodle-cloud-constraints.md` if the component involves Moodle selectors or SCSS export
4. Check existing components in `components/` for patterns to follow

## Rules for Preview Components (components/preview/*)

- ALL colours MUST use CSS custom properties: `var(--cfa-navbar-bg)`, `var(--cfa-link-colour)`, etc.
- NEVER hardcode colours. The only exception is the CFA logo "AUSTRALIA" text which stays `#F64747`.
- Import nothing from the Zustand store directly — preview components receive their styling purely through CSS variables inherited from the `MoodleShell` wrapper.
- Match the Moodle screenshots in `Moodle Site Sample Page/` as closely as possible.

## Rules for Control Components (components/controls/*)

- Each control calls `useThemeStore(s => s.setToken)` or `useThemeStore(s => s.setBrandPrimary)`.
- All inputs must be keyboard accessible (arrow keys for sliders, Tab/Enter for pickers).
- Include `aria-label` on all interactive elements.
- Show the Moodle admin path tooltip below each colour picker (from `TOKEN_MOODLE_PATHS` in `lib/tokens.ts`).

## Rules for Audit/Export Components (components/audit/*, components/export/*)

- Audit calculations use functions from `lib/accessibility.ts`.
- SCSS generation uses `lib/scss-generator.ts`.
- Export must produce TWO separate blocks (Raw initial SCSS + Raw SCSS).

## After Building

- Verify the component renders without errors
- If it's a preview component, confirm all colours come from CSS variables (check DevTools)
- If it's a control, confirm changing it updates the preview in real-time
