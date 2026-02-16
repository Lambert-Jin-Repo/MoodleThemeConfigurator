---
name: Continue Build
description: Resume implementation from current step
disable-model-invocation: true
---

# Continue Build

Resume the implementation from wherever it was left off.

## Steps

1. Read `docs/implementation-plan.md` for the full 14-step plan
2. Check what has been built so far:
   - Look at `package.json` — does the project exist?
   - Look at `lib/tokens.ts` — are token types defined?
   - Look at `store/theme-store.ts` — is the store built?
   - Look at `components/` — which components exist?
   - Look at `lib/scss-generator.ts` — is export working?

3. Determine the current step by checking what's missing:

| Step | Check File | Built? |
|---|---|---|
| 1. Scaffold | `package.json`, `tsconfig.json` | |
| 2. Tokens | `lib/tokens.ts` | |
| 3. Store | `store/theme-store.ts` | |
| 4. Layout | `components/Toolbar.tsx`, `components/PanelLayout.tsx` | |
| 5. Preview Shell | `components/preview/MoodleShell.tsx`, `components/preview/MoodleNavbar.tsx` | |
| 6. Dashboard | `components/preview/DashboardPage.tsx` | |
| 7. Course Page | `components/preview/CoursePage.tsx` | |
| 8. Login Page | `components/preview/LoginPage.tsx` | |
| 9. Controls | `components/controls/ControlsPanel.tsx`, `components/controls/ColourPicker.tsx` | |
| 10. Audit | `components/audit/AuditPanel.tsx`, `lib/accessibility.ts` | |
| 11. Export | `components/export/ExportSection.tsx`, `lib/scss-generator.ts` | |
| 12. Save/Load | Save/load in store + UI | |
| 13. Responsive | PanelLayout responsive behaviour | |
| 14. A11y Polish | Focus management, ARIA, keyboard | |

4. Pick up from the NEXT incomplete step
5. Read the step's details in `docs/implementation-plan.md`
6. Read `UNIFIED-SPEC.md` for the detailed specification of what to build
7. Build the step, then verify it works

## Key References While Building

- **Spec:** `UNIFIED-SPEC.md` (sections referenced by step)
- **Brand:** `docs/cfa-brand-reference.md` (colours, fonts, logo)
- **Moodle:** `docs/moodle-cloud-constraints.md` (selectors, SCSS fields)
- **Screenshots:** `docs/references/Moodle Site Sample Page/*.png` (visual targets)
- **UI mockup:** `docs/references/Sample Webpage.html` (layout reference)

## After Each Step

- Verify the step works (see verification criteria in implementation plan)
- Run `npm run build` to check for TypeScript/build errors
- Move to the next step
