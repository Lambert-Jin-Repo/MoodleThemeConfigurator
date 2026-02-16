# CFA Brand Sandbox — Implementation Plan

## Context

The CFA (Centre for Accessibility) needs a simple web app that lets non-technical admins preview colour and layout changes on a realistic Moodle replica before applying them to their Moodle Cloud site. The unified specification (`UNIFIED-SPEC.md`) has been written and approved. This plan covers the full frontend build from project creation to final QA.

**Source of truth:** `UNIFIED-SPEC.md`
**Visual references:** `docs/references/Moodle Site Sample Page/*.png` (3 screenshots), `docs/references/Sample Webpage.html` (UI mockup), `docs/references/CFA Brand Style Guide.pdf`

---

## Tech Stack

| Layer | Technology | Package |
|---|---|---|
| Framework | Next.js 14+ (App Router) | `next` 14.x |
| UI | React 18+, TypeScript 5.x | `react`, `typescript` |
| Styling | Tailwind CSS 3.4+ | `tailwindcss` |
| State | Zustand 4.x + zundo 2.x (undo/redo) | `zustand`, `zundo` |
| Colour Picker | react-colorful (3KB, accessible) | `react-colorful` |
| Icons | Lucide React | `lucide-react` |
| IDs | nanoid | `nanoid` |
| Hosting | Vercel (static export) | — |

---

## Step 1: Project Scaffold & Configuration

**Goal:** Create the Next.js project with all tooling configured, rendering "Hello World" in browser.

**Files to create:**
- `package.json` — all dependencies listed above
- `tsconfig.json` — strict mode, path aliases (`@/components/*`, `@/lib/*`, `@/store/*`)
- `tailwind.config.ts` — extend with CFA brand colours (charcoal, cfaOrange, teal, etc.), add Source Sans Pro to fontFamily
- `next.config.mjs` — `output: 'export'` for static Vercel deployment
- `postcss.config.mjs` — standard Tailwind config
- `app/layout.tsx` — root layout, import Source Sans Pro + Inter via `next/font/google`, `<html lang="en">`
- `app/page.tsx` — placeholder text
- `app/globals.css` — Tailwind directives, custom scrollbar styles, global resets
- `.gitignore`, `.eslintrc.json`

**Key decisions:**
- Use `zundo` (actively maintained) instead of older `zustand-temporal`
- Use `react-colorful` for accessible colour picker (keyboard nav built in)
- `output: 'export'` for fully static site — no server needed

**Verify:** `npm run dev` → see placeholder at localhost:3000. `npm run build` succeeds.

---

## Step 2: Token Types, Defaults & CFA Palette Constants

**Goal:** Define the complete data model that the entire app depends on.

**File:** `lib/tokens.ts`

**Contents:**
- `ThemeTokens` interface — all 45+ token fields matching UNIFIED-SPEC.md Section 9
- `DEFAULT_TOKENS` constant — Moodle Boost defaults (NOT CFA colours): brandPrimary `#0f6cbf`, navbarBg `#FFFFFF`, bodyText `#404041`, etc.
- `CFA_PALETTE` array — the 8 brand colours + White + Near Black + Moodle Blue
- `CFA_BRAND_PRESET` — partial token set for "Apply CFA Brand" button
- `BRAND_LINKED_KEYS` — tokens that propagate from brandPrimary: `['btnPrimaryBg', 'linkColour', 'navActiveUnderline', 'secondaryNavActive', 'progressFill', 'focusRing', 'loginBtnBg', 'info', 'footerLink']`
- `FONT_OPTIONS`, `HEADING_SCALE_OPTIONS` — dropdown option arrays
- `TOKEN_MOODLE_PATHS` — record mapping each token key to its Moodle admin path string
- `tokenToCssVar(key)` — helper converting camelCase to `--cfa-kebab-case`

**Verify:** Import in page.tsx, render `JSON.stringify(DEFAULT_TOKENS)`, confirm all values display.

---

## Step 3: Zustand Store with Undo/Redo & Brand Propagation

**Goal:** Build the central state layer with the critical brand propagation logic.

**File:** `store/theme-store.ts`

**Store shape:**
```
tokens: ThemeTokens
setToken(key, value)         — update one token, push to undo stack
setBrandPrimary(value)       — THE critical function: cascading setter
reset()                      — restore DEFAULT_TOKENS
applyPreset(partial)         — merge a partial token set (for CFA preset)
savedConfigs: SavedConfig[]
saveConfig(name) / loadConfig(id) / deleteConfig(id)
activePage / viewport / zoom — UI state (excluded from undo history)
```

**Brand propagation logic (most important behaviour):**
When `setBrandPrimary(newValue)` is called:
1. Get current brandPrimary (oldValue)
2. For each key in `BRAND_LINKED_KEYS`: if `tokens[key] === oldValue` (not manually overridden), update to `newValue`
3. If user previously set a linked token to a different value, leave it alone
4. Auto-compute `btnPrimaryHover` by darkening new brandPrimary 15%

**Middleware stack:** `persist` (localStorage for savedConfigs) wrapping `temporal` from zundo (undo/redo on tokens only, max 50 entries). UI state excluded from temporal via `partialize`.

**Verify:**
1. Render brandPrimary on page, button calls `setBrandPrimary('#336E7B')`
2. Confirm linked tokens all cascade
3. Call undo → all revert. Call redo → all restore.
4. saveConfig → reload page → savedConfigs persist in localStorage

---

## Step 4: Global Layout Shell (Toolbar + Three Panels)

**Goal:** Build the app skeleton — sticky toolbar and three-panel responsive container.

**Files:**
- `components/Toolbar.tsx`
- `components/PanelLayout.tsx`
- `components/Toast.tsx`
- Update `app/page.tsx` to compose them

**Toolbar (h-14, bg-[#404041]):**
- Left: CFA red square logo (28x28, `#F64747`) + "CFA Brand Sandbox" white bold
- Right: Undo/Redo (disabled when empty), Reset, divider, Save (outlined white), Export SCSS (solid `#F27927` orange — primary CTA)
- Wire keyboard shortcuts: Ctrl+Z (undo), Ctrl+Y (redo), Ctrl+S (save, preventDefault), Ctrl+E (export)
- All buttons have `aria-label`

**PanelLayout (grid: 300px 1fr 320px):**
- Left: `overflow-y-auto`, `border-r`, `bg-[#f8f9fa]`, `role="complementary"` `aria-label="Theme controls"`
- Centre: `flex-1`, `overflow-y-auto`, `role="main"` `id="main-content"`
- Right: `overflow-y-auto`, `border-l`, `bg-[#f8f9fa]`, `role="complementary"` `aria-label="Accessibility audit"`
- Height: `h-[calc(100vh-56px)]`

**Toast:** Fixed bottom-right, auto-dismiss 3s, `role="status"` `aria-live="polite"`

**Skip-to-content link:** `<a href="#main-content">` in layout.tsx, sr-only until focused

**Verify:** See charcoal toolbar with all buttons. Three empty panels below. Tab through buttons — focus rings visible.

---

## Step 5: Preview Shell & Moodle Navbar

**Goal:** Build the CSS custom property container and the shared Moodle navbar.

**Files:**
- `components/preview/PreviewPanel.tsx` — wrapper: PreviewToolbar + scrollable MoodleShell
- `components/preview/PreviewToolbar.tsx` — page tabs, viewport toggle, zoom dropdown
- `components/preview/MoodleShell.tsx` — THE CSS variable bridge
- `components/preview/MoodleNavbar.tsx` — shared navbar component

**MoodleShell (critical):**
- Reads ALL tokens from Zustand, converts to `--cfa-*` CSS variables via `tokenToCssVar()`
- Applies `transform: scale(zoom)`, `max-width` based on viewport
- Conditionally renders active page component
- NO hardcoded colours in any preview component

**MoodleNavbar (match Moodle Home Page Sample.png):**
- ~56px height, bg `var(--cfa-navbar-bg)`, bottom border
- Left: Red square + "Centre for" / "Accessibility" + "AUSTRALIA" in red
- Nav links with active underline in `var(--cfa-nav-active-underline)`
- Right: bell, chat, Active Users bar, Storage bar, avatar

**Verify:** Navbar renders matching screenshot. DevTools shows all `--cfa-*` variables. Viewport/zoom work.

---

## Step 6: Dashboard Page Replica

**Goal:** Pixel-accurate Dashboard matching `Moodle Home Page Sample.png`.

**Files:** `components/preview/DashboardPage.tsx`, `components/preview/CourseCard.tsx`

**Layout:** bg `var(--cfa-page-bg)`, centred content, Dashboard heading, "Hi, Scott!", trial banner, course overview section with 2 course cards.

**Verify:** Compare with screenshot. Change brandPrimary → course titles, Upgrade button, nav underline all update.

---

## Step 7: Course Page Replica

**Goal:** Course Page matching `Moodle Course Page Sample.png`.

**Files:** `components/preview/CoursePage.tsx`, `CourseDrawer.tsx`, `SecondaryNav.tsx`, `ActivityRow.tsx`

**Layout:** Navbar + CourseDrawer (left) + main content (heading, secondary nav, activity rows, hidden section banner).

**Verify:** Compare with screenshot. Change brandPrimary → links and active tab update.

---

## Step 8: Login Page Replica

**Goal:** Login page matching `Moodle Login Page Sample.png`.

**File:** `components/preview/LoginPage.tsx`

**Layout:** No navbar. Grey bg, centred white card, "Log in to CFA Learning Portal", pill inputs, compact login button, divider, signup section, footer.

**Verify:** Compare with screenshot. Change login tokens → all update live.

---

## Step 9: Controls Panel (Colour Pickers, Sliders, Accordions)

**Goal:** Full left panel with all 8 control sections.

**Files:** `ControlsPanel.tsx`, `AccordionSection.tsx`, `ColourPicker.tsx`, `SliderControl.tsx`, `SelectControl.tsx`

**8 Sections:** Brand Colour, Navigation Bar, Buttons, Login Page, Typography, Content Area, Footer, Alerts & Progress.

**Verify:** Pick CFA Teal → preview updates. Slider changes font size. "Apply CFA Brand" changes multiple tokens. Off-brand badge appears.

---

## Step 10: Accessibility Audit Panel

**Goal:** WCAG contrast engine + audit display.

**Files:** `lib/accessibility.ts`, `AuditPanel.tsx`, `ScoreBadge.tsx`, `ContrastCard.tsx`

**Verify:** Score badge, 10 contrast cards, suggestions with "Apply" button.

---

## Step 11: SCSS Generator & Export Section

**Goal:** Two-block SCSS generator and export UI.

**Files:** `lib/scss-generator.ts`, `lib/moodle-paths.ts`, `ExportSection.tsx`, `ScssPreview.tsx`, `MoodlePaths.tsx`

**Smart export:** Only changed values. Omitted sections get comments.

**Verify:** Two SCSS blocks. Copy/download work. Smart omission logic correct.

---

## Step 12: Save/Load Configuration

**Goal:** localStorage persistence for named configurations.

**Verify:** Save → Reset → Load → colours restore. Persists across reload.

---

## Step 13: Responsive Layout Polish

**Goal:** Tablet drawers + mobile tab bar.

**Verify:** 1440px+ three panels. 1000px drawers. 600px bottom tabs.

---

## Step 14: Accessibility Polish & Final QA

**Goal:** WCAG 2.2 AA for the tool itself + end-to-end validation.

**End-to-end test:**
1. Load → Moodle defaults
2. Apply CFA Brand → teal everywhere
3. Check all 3 pages
4. Audit panel shows scores
5. Fix contrasts
6. Export SCSS → valid
7. Save/Load works
8. Undo/Redo works

---

## Dependency Graph

```
Step 1  (Scaffold)
  ↓
Step 2  (Tokens/Types)
  ↓
Step 3  (Zustand Store)
  ↓
Step 4  (Layout Shell)
  ↓
Step 5  (Preview Shell + Navbar)
  ↓
  ├── Step 6  (Dashboard)  ──┐
  ├── Step 7  (Course Page) ──┤  (can be parallel)
  └── Step 8  (Login Page) ──┘
        ↓
Step 9  (Controls Panel)
  ↓
  ├── Step 10 (Audit Panel)  ─┐
  ├── Step 11 (Export)        ├  (can be parallel)
  └── Step 12 (Save/Load)   ─┘
        ↓
Step 13 (Responsive Polish)
  ↓
Step 14 (Accessibility + QA)
```
