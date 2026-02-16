# CFA Brand Sandbox — Project Tracker

> Tracks issues found, actions taken, mistakes made, and lessons learned.
> Purpose: prevent repeating the same errors in future sessions.

---

## Session: 2026-02-14 — Steps 9–14 Implementation

### Issues Found During User Review

| # | Issue | Reported By | Status |
|---|---|---|---|
| 1 | No visible colour picker/spinner — only a tiny swatch that opened a hidden popover | User | Fixed |
| 2 | Hardcoded personal name "Scott Admin" / "Hi, Scott!" in preview | User | Fixed |
| 3 | Tablet/phone responsive layout not working properly | User | Removed |
| 4 | No preset colour templates — only a single "Apply CFA Brand" button | User | Fixed |
| 5 | "Your free trial" banner — unnecessary fake content in preview | User | Removed |
| 6 | CSS/JS returning 404 — `.next` cache corruption from OneDrive syncing | Dev environment | Fixed (cache clean) |

### Actions Taken

#### Fix 1: Colour Picker Visibility
- **Problem:** ColourPicker only had a 7x7px swatch button that opened a popover with react-colorful HexColorPicker hidden behind a collapsible "Fine-tune (HSL)" section. User couldn't find or use it.
- **Root cause:** Over-designed the interaction — buried the visual picker behind two clicks (swatch click → collapsible toggle).
- **Fix:** Added a native `<input type="color">` (browser colour spinner) alongside the swatch button. The swatch still opens the advanced popover with CFA palette + HexColorPicker. User now has immediate access to a colour wheel.
- **File:** `components/controls/ColourPicker.tsx`

#### Fix 2: Remove Personal Names
- **Problem:** "Hi, Scott!" and "Scott Admin" were hardcoded in preview — looks like leftover test data.
- **Fix:** Changed to "Welcome back!" and "Site Admin".
- **Files:** `components/preview/DashboardPage.tsx`, `components/preview/MoodleFooter.tsx`

#### Fix 3: Remove Tablet/Phone Layout
- **Problem:** Responsive layout with drawer overlays (768–1439px) and bottom tab bar (<768px) didn't work properly. This is a desktop admin tool — responsive wasn't needed.
- **Root cause:** Implemented responsive layout as specified in plan without questioning whether the target user (admin on desktop) actually needs it.
- **Fix:** Reverted `PanelLayout.tsx` to simple 3-panel desktop layout. Removed tablet/phone viewport toggle from `PreviewToolbar.tsx`. Removed custom `2xl` breakpoint from `tailwind.config.ts`.
- **Lesson:** Question plan items that add complexity without clear user value. Admin tools used at a desk don't need mobile layouts.

#### Fix 4: Preset Templates
- **Problem:** Only one "Apply CFA Brand" button. User wanted multiple starting points based on the CFA style guide.
- **Fix:** Created 5 presets in `lib/tokens.ts` (PRESET_TEMPLATES array): CFA Standard, CFA Dark Navbar, CFA Purple Accent, CFA Warm, Moodle Default. Each shows 4 colour preview swatches, name, and description. Replaced the old single button with a preset gallery in the first accordion section.
- **Files:** `lib/tokens.ts`, `components/controls/ControlsPanel.tsx`

#### Fix 5: Remove Trial Banner
- **Problem:** Fake "Your free trial ends in 24 days" banner was unnecessary and confusing.
- **Fix:** Removed the entire trial banner div from `DashboardPage.tsx`.

#### Fix 6: .next Cache Corruption
- **Problem:** CSS and JS assets returning 404 errors. Dev server compiled successfully but browser got no styles.
- **Root cause:** OneDrive file syncing corrupts Next.js `.next` build cache (readlink errors on .json files).
- **Fix:** `rm -rf .next` then restart dev server. Need to do this any time the build cache shows EINVAL errors.
- **Lesson:** Always clean `.next` before starting dev server if the project is in a OneDrive-synced folder.

---

## Session: 2026-02-14 (continued) — Hover Effects

### Issue Found During User Review

| # | Issue | Reported By | Status |
|---|---|---|---|
| 7 | No mouse hover effects in preview — user tested CFA Warm on real Moodle and saw hover states missing from the app | User | Fixed |
| 8 | `linkHover` token not auto-propagating when brand primary changes — stayed at stale default `#0a4b8c` | Dev | Fixed |
| 9 | Presets missing `linkHover` and `btnPrimaryHover` values — hover colours mismatched after applying preset | Dev | Fixed |

### Actions Taken

#### Fix 7: Add Hover Effects to All Preview Components
- **Problem:** Zero hover effects in the preview (only `hover:underline` on one course title link). User compared against real Moodle site and noticed interactive elements didn't respond to mouse hover.
- **Root cause:** Preview components used inline styles for colours but inline styles can't define `:hover` rules. Hover was never implemented.
- **Fix:**
  1. Added a `<style>` block injected via `dangerouslySetInnerHTML` in `MoodleShell.tsx` that defines hover rules using `var(--cfa-*)` CSS custom properties
  2. Added `.moodle-preview` wrapper class to MoodleShell container
  3. Added CSS class names to all interactive elements across 6 preview components:
     - `.moodle-link` — links (color → link-hover + underline)
     - `.moodle-btn-primary` — buttons (bg → btn-primary-hover + darken)
     - `.moodle-nav-link` — navbar links (opacity 0.75, matching Bootstrap)
     - `.moodle-icon-btn` — icon buttons (opacity 0.65)
     - `.moodle-card` — course cards (shadow lift + translateY)
     - `.moodle-footer-link` — footer links (underline + opacity)
     - `.moodle-tab` — secondary nav tabs (subtle bg highlight)
     - `.moodle-drawer-item` — drawer items (subtle bg highlight)
     - `.moodle-activity-row` — activity rows (very subtle row highlight)
     - `.moodle-btn-outline` — filter/dropdown buttons (bg + border change)
     - `.moodle-input` — form inputs (hover border, focus ring)
     - `.moodle-avatar` — avatar (opacity 0.8)
  4. All hover rules include `transition: all 0.15s ease` for smooth effects
- **Files modified:** `MoodleShell.tsx`, `MoodleNavbar.tsx`, `DashboardPage.tsx`, `CoursePage.tsx`, `LoginPage.tsx`, `CourseCard.tsx`, `MoodleFooter.tsx`
- **Lesson:** Preview must include hover states — users compare directly against real Moodle. Inline styles can't do `:hover`, so use injected `<style>` with CSS classes.

#### Fix 8: linkHover Auto-Propagation
- **Problem:** When `brandPrimary` changed, `linkHover` stayed at the old default `#0a4b8c` even though `linkColour` updated to the new brand colour.
- **Fix:** Added `linkHover: darkenHex(value, 20)` to `setBrandPrimary()` in `store/theme-store.ts`.
- **File:** `store/theme-store.ts`

#### Fix 9: Preset Hover Values
- **Problem:** Presets (CFA Standard, Dark Navbar, Purple Accent) didn't include `btnPrimaryHover` or `linkHover`, so applying a preset left hover colours at stale defaults.
- **Fix:** Added explicit `btnPrimaryHover` (darken 15%) and `linkHover` (darken 20%) to all preset token objects in `lib/tokens.ts`.
- **File:** `lib/tokens.ts`

---

## Mistakes Made by Agent

### Process Mistakes

| Mistake | Impact | Lesson |
|---|---|---|
| Never created a git branch | All changes on default branch, no rollback points | Always run `/create-branch` before first edit |
| Never committed between phases | No phase-level rollback, no git history | Run `/safe-commit` after each passing phase |
| Never used `/safe-commit` or `/safe-push` | No build/lint/secret validation before would-be commits | These skills exist for a reason — use them |
| Didn't use parallel agents for independent files | Slower execution, sequential bottleneck | Phase 2 had 5 independent new files — should have spawned 2–3 agents |
| Didn't run `/verify-build` skill | Used raw `npm run build` instead | Use the project skill for consistency |
| Didn't run `/check-theme-accuracy` | No visual verification against Moodle screenshots | Should run after preview changes |
| Didn't update MEMORY.md after completion | Next session won't know current state | Always update memory at end of session |

### Design/Implementation Mistakes

| Mistake | Impact | Lesson |
|---|---|---|
| Hid the colour picker behind a collapsible section | User couldn't find it — "no colour spinner options" | Primary controls must be immediately visible, not buried behind clicks |
| Used personal name "Scott" in preview | Looked like leftover test data | Use generic role names (Admin, Student) in preview content |
| Built tablet/phone responsive layout | Wasted effort — doesn't work well and not needed for admin tool | Validate with user before building complex responsive layouts |
| Used "Your free trial" as sample content | Confusing — not part of a typical Moodle instance | Only include preview content that represents real Moodle pages |
| Didn't add native `<input type="color">` initially | Relied entirely on react-colorful popover which was too hidden | Always include a visible, obvious colour control — native inputs work everywhere |
| No hover effects in preview | User noticed preview didn't match real Moodle — no visual feedback on interactive elements | Always implement hover states for preview components — users compare against real site |
| `linkHover` not in brand propagation | Hover colour stayed stale when brand changed | All derived tokens (hover, focus) must auto-update with their parent token |

---

## Architecture Notes for Future Sessions

### .next Cache on OneDrive
- OneDrive syncing corrupts the Next.js `.next` directory
- Symptom: `EINVAL: invalid argument, readlink` errors on build, or 404 on all static assets
- Fix: Delete `.next` folder and rebuild
- Consider adding `.next` to OneDrive exclusions

### Colour Picker Architecture
- **Native `<input type="color">`** — always visible, opens OS colour picker. Simple, reliable.
- **Swatch button** — opens advanced popover with CFA palette swatches + HexColorPicker from react-colorful.
- **Hex text input** — manual hex entry.
- **Quick palette row** — small CFA colour swatches below for one-click brand colours.
- All four methods call the same `handleChange` callback.

### Preset System
- Presets defined in `lib/tokens.ts` as `PRESET_TEMPLATES` array
- Each preset has: id, name, description, preview colours (4 hex values), and a Partial<ThemeTokens> object
- Applied via `applyPreset()` from the Zustand store — merges onto current tokens
- "Moodle Default" preset uses spread of `DEFAULT_TOKENS` for full reset
- All presets must include `btnPrimaryHover` and `linkHover` values

### Hover System
- Hover CSS injected via `<style dangerouslySetInnerHTML>` in `MoodleShell.tsx`
- Scoped under `.moodle-preview` wrapper class to avoid leaking into tool UI
- Uses `var(--cfa-*)` custom properties so hovers update live with theme changes
- CSS classes follow `.moodle-*` naming convention (e.g. `.moodle-link`, `.moodle-btn-primary`)
- Hover token propagation: `setBrandPrimary()` computes `btnPrimaryHover` (darken 15%) and `linkHover` (darken 20%)
- Matches real Moodle Boost/Bootstrap behaviour: navbar links fade opacity, buttons darken, links change colour + underline

---

## Session: 2026-02-15 — Clean Rebuild + Logo Replication

### Clean Rebuild (Phase 1–7)

All source files (`app/`, `components/`, `lib/`, `store/`) were deleted and rewritten from scratch following the `CFA_Moodle_Theme_Configurator_Prompt.md` spec. This addressed significant gaps in the previous implementation.

**What was rebuilt (41 files total):**

| Category | Files | Key Changes vs Previous |
|---|---|---|
| `lib/` (6 files) | tokens, accessibility, scss-generator, use-keyboard-shortcuts, url-share, audit-report | 56 tokens (was ~40), 8 presets (was 5), new tokens: editModeOnColour, editModeThumbColour, breadcrumbBg, footerAccent, sectionAccent, focusRing, focusRingWidth, loginGradientEnabled, loginGradientEnd, navHoverBg, navHoverText, signupBtnBg |
| `store/` (2 files) | theme-store, toast-store | Fixed middleware order: `temporal(persist(...))` — temporal must be outermost for `.temporal` property access |
| `components/preview/` (13 files) | MoodleShell, MoodleNavbar, MoodleBreadcrumb (NEW), MoodleFooter, DashboardPage, CoursePage, LoginPage, CourseCard, ActivityRow, SecondaryNav, CourseDrawer, PreviewPanel, PreviewToolbar | New: breadcrumb bar, edit mode form-switch toggle, gradient login, footer accent border, section accent underlines, course drawer |
| `components/controls/` (7 files) | ControlsPanel, PresetSelector (NEW), AccordionSection, ColourPicker, SliderControl, SelectControl, GradientToggle (NEW) | New: `role="radiogroup"` preset selector, gradient toggle, 12 accordion sections (was ~8), blocked colour validation (orange/cyan) |
| `components/audit/` (3 files) | AuditPanel, ScoreBadge, ContrastCard | 11 contrast checks (was ~9), new: edit-mode-on-navbar check, export blocking when any ratio < 3:1 |
| `components/export/` (3 files) | ExportModal (NEW), CodeBlock (NEW), InstructionPanel (NEW) | Full modal with focus trap (was inline section), 3 code blocks with copy buttons, 9-step instruction panel, download as .txt |
| `components/` root (4 files) | Toolbar, PanelLayout, SaveLoadModal, Toast | Unchanged architecture |
| `app/` (3 files) | layout, page, globals.css | Skip-to-content link, `aria-live` region |

**Gaps fixed from previous implementation:**
- Missing controls: footer accent, edit mode toggle colours, breadcrumb bg, section accent, focus ring width
- Missing preview elements: edit mode form-switch toggle, gradient login background, breadcrumb bar, course drawer
- Incomplete SCSS export: now includes all Section 4.6 selectors (navbar admin catch-all, dropdown overrides, link underlines, focus outlines, SVG thumb for edit mode, etc.)
- Wrong defaults: `pageBg` corrected from `#f5f5f5` to `#FFFFFF`
- No colour validation: orange (#F27927) and cyan (#00BFFF) now blocked as link/text on white with specific error messages
- Missing advanced features: shareable URL encoding, JSON export/import, downloadable audit report

**Build errors resolved during rebuild:**
1. `useTemporalStore` not exported from zundo v2.3 — fixed to `useStore(useThemeStore.temporal)`
2. TypeScript string literal comparison (`'var(--cfa-section-accent)' !== 'none'`) — fixed by reading token value from store
3. Middleware order (`persist` wrapping `temporal`) — swapped to `temporal(persist(...))`
4. TypeScript cast error in url-share.ts — added intermediate `unknown` cast

### CFA Logo Replication

| # | Issue | Action | Status |
|---|---|---|---|
| 10 | Logo icon used 4 squares (2 lime, 1 orange, 1 cyan) — actual CFA logo has 3 squares in L-shape | Fixed icon to 3 squares: lime (top-right), orange (bottom-left), cyan (bottom-right), top-left empty | Fixed |
| 11 | Login page had small icon only — no full CFA logo text | Added full logo: 3-square icon + "Centre for" / "Accessibility" text + "AUSTRALIA" in lime green | Fixed |
| 12 | Navbar showed just "CFA" text next to icon — not matching brand reference | Replaced with stacked text: "Centre for" (regular) / "Accessibility" (bold) / "AUSTRALIA" (lime green) | Fixed |
| 13 | "AUSTRALIA" text in navbar was red (#F64747) — should be lime green (#BAF73C / PMS 389 C) | Changed to #BAF73C | Fixed |

**Logo design (from reference images):**
```
Icon layout:        Full logo:
[     ] [Lime ]     [icon] Centre for
[Orange] [Cyan]           Accessibility
                          AUSTRALIA (lime green)
```

**Theme adaptation:** Login page logo text auto-switches based on card background luminance:
- Light card (luminance >= 0.4) → charcoal (#404041) text
- Dark card (luminance < 0.4) → white (#FFFFFF) text
- "AUSTRALIA" always lime green (#BAF73C) regardless of theme

**Files modified:**
- `components/preview/MoodleNavbar.tsx` — fixed icon (3 squares), stacked logo text, AUSTRALIA colour
- `components/preview/LoginPage.tsx` — full CFA logo with theme adaptation
- `components/Toolbar.tsx` — fixed icon (3 squares)

### Current State (end of session 2026-02-15)
- **Clean rebuild complete** — 41 files, all 7 phases implemented
- **CFA logo replicated** — matches reference images from Brand Style Guide
- **Build + lint pass** with zero errors
- **Dev server running** at localhost:3000

---

## Session: 2026-02-15 (continued) — Background Image Upload Feature

### Feature: Background Image Upload Controls

Added "Background image" and "Login page background image" upload controls, matching the same settings available in Moodle Cloud's Boost theme (Site admin > Appearance > Themes > Boost > General settings).

**Moodle's CSS behaviour:**
- Site background: `@media (min-width: 768px) { body { background-image: url('...'); background-size: cover; } }`
- Login background: `body.pagelayout-login #page { background-image: url('...'); background-size: cover; }`

### Files Created

| File | Purpose |
|---|---|
| `components/controls/ImageUploadControl.tsx` | Reusable image upload control with drag-drop, thumbnail preview, remove button, file validation (JPG/PNG/WebP only, max 1 MB) |

### Files Modified

| File | Changes |
|---|---|
| `lib/tokens.ts` | Added `backgroundImage` and `loginBgImage` string properties to `ThemeTokens` interface + `DEFAULT_TOKENS` (both default to `''`) |
| `components/controls/ControlsPanel.tsx` | New "Background Images" accordion section between Content Area and Login Page with two `ImageUploadControl` instances + hint text |
| `components/preview/MoodleShell.tsx` | Filter image tokens from CSS vars (`IMAGE_TOKEN_KEYS` set), `buildBackgroundImageStyles()` for site background on non-login pages, `background-images` entry in `SECTION_HIGHLIGHT_MAP` |
| `components/preview/LoginPage.tsx` | `bgStyle` prioritises `loginBgImage` (cover image with solid colour fallback) over gradient over solid colour |
| `lib/scss-generator.ts` | Instructional comments when images are set — guides user to Moodle's upload UI path (not SCSS, since Moodle handles image upload separately) |
| `store/theme-store.ts` | Strips base64 image data from localStorage persist (avoids quota issues) and from undo/redo temporal history; clears session markers on rehydrate |

### Design Decisions

| Decision | Rationale |
|---|---|
| Images are session-only (don't survive refresh) | base64 data URLs are too large (~1.3 MB each) for localStorage's 5-10 MB limit; persisting two images would consume half the budget |
| No preset changes | Presets use solid colours per SCSS reference recommendation; background images are a per-site customisation |
| SCSS export shows upload instructions, not CSS | Moodle handles background images via file upload in admin UI, not via SCSS field — the SCSS export correctly directs users to the upload setting |
| `<img>` instead of Next.js `<Image />` for preview thumbnail | `next/image` is designed for external/static URLs, not base64 data URLs; added eslint-disable comment |
| 1 MB file size limit | base64 adds ~33% overhead → ~1.33 MB in memory; keeps total memory usage reasonable |

### Build Status
- `npm run build` — zero errors
- `npm run lint` — zero warnings/errors
- Dev server running at localhost:3000

---

## Session: 2026-02-16 — Accessibility Audit Fixes + Logo Integration + Colour Flash

### Accessibility Audit Fixes

Consolidated analysis (Antigravity + Gemini) identified 8 issues in the audit feature. All fixes implemented and verified.

| # | Issue | Action | Status |
|---|---|---|---|
| 14 | `editModeThumbColour` missing `#` prefix in defaults + all 7 presets | Added `#` prefix; removed compensating hacks in ControlsPanel, MoodleNavbar | Fixed |
| 15 | Duplicate `editmode-navbar` contrast check (identical to `nav-navbar`) | Removed duplicate | Fixed |
| 16 | Missing spec checks: Link on Card (§7B #5), Muted on Card (§7B #9) | Added `link-card` and `muted-card` checks | Fixed |
| 17 | `isLargeText` wired but never set to `true` on any check | Set `isLargeText: true` on `heading-page` (headings ≥18px → 3.0:1 threshold) | Fixed |
| 18 | `suggestFix()` picked first passing CFA palette colour, not nearest | Now uses Euclidean RGB distance to pick closest matching colour | Fixed |
| 19 | ScoreBadge showed green only at 100% — spec says ≥90% | Changed threshold to `score >= 90` | Fixed |
| 20 | §7C non-contrast checks not implemented (font size, line height, focus ring) | Added 3 checks to AuditPanel with ✓/✗ icons | Fixed |
| 21 | `audit-report.ts` ignored `isLargeText` and missed non-contrast checks | Report now respects `isLargeText` flag, includes §7C section | Fixed |

**Files modified:** `lib/tokens.ts`, `lib/accessibility.ts`, `lib/audit-report.ts`, `lib/scss-generator.ts`, `components/controls/ControlsPanel.tsx`, `components/preview/MoodleNavbar.tsx`, `components/audit/AuditPanel.tsx`, `components/audit/ContrastCard.tsx`, `components/audit/ScoreBadge.tsx`

### Dynamic Logo Integration

Replaced hardcoded SVG logos with real CFA Full logo PNGs. Auto-switches between dark/light variants based on background colour luminance.

| # | Issue | Action | Status |
|---|---|---|---|
| 22 | Navbar used hardcoded SVG icon + text spans | Replaced with `<img>` using `CFA_Logo_Full_DarkTheme.png` / `CFA_Logo_Full_LightTheme.png` based on `isDarkBackground(navbarBg)` | Fixed |
| 23 | Login page used hardcoded SVG `CfaLogoFull` component | Replaced with `<img>` auto-switching based on `isDarkBackground(loginCardBg)` | Fixed |
| 24 | Toolbar had no logo | Added Full Dark logo before "Moodle Theme Configurator" title | Fixed |

**New utility:** `isDarkBackground(hex)` in `lib/accessibility.ts` — returns `true` when `relativeLuminance < 0.179` (same threshold as `autoTextColour`).

**Files created:** `public/logos/CFA_Logo_Full_DarkTheme.png`, `public/logos/CFA_Logo_Full_LightTheme.png`
**Files modified:** `lib/accessibility.ts`, `components/preview/MoodleNavbar.tsx`, `components/preview/LoginPage.tsx`, `components/Toolbar.tsx`

### Colour Flash Highlight

Replaced static orange outline with colour flash → fade-back animation when accordion sections open.

| Animation Type | Applies To | Effect |
|---|---|---|
| **Background flash** | Navbar, Footer, Login, Drawers, Edit Mode, Brand Colour | Orange overlay fades from 55% → 0 opacity over 800ms |
| **Text colour flash** | Typography, Links & Focus | Text briefly turns CFA orange then transitions back |
| **Element flash** | Buttons, Cards, Content Area, Alerts | Scale pop + orange glow shadow that fades away |

All animations leave a subtle persistent orange outline while the accordion section remains open.

**File modified:** `components/preview/MoodleShell.tsx`

### Build Status
- `npm run build` — zero errors
- Dev server running at localhost:3000

---

## Session: 2026-02-16 (continued) — Dynamic "Australia" Logo Text Colour

### Feature: WCAG-Aware Logo "Australia" Text Colour

The "AUSTRALIA" text in the CFA logo was hardcoded to lime green (#BAF73C) in static PNG images and couldn't adapt to different background colours. Now replaced with dynamic SVG/HTML rendering that auto-detects the best WCAG-compliant accent colour from the CFA Brand Style Guide palette, with manual override support.

| # | Issue | Action | Status |
|---|---|---|---|
| 25 | "AUSTRALIA" text always lime green regardless of navbar/login background | Replaced static PNG logos with dynamic `CfaLogo` component using SVG + HTML text | Fixed |
| 26 | No WCAG contrast check for "AUSTRALIA" text against background | Added `bestLogoAccentColour()` — picks best CFA accent colour meeting 3:1 contrast | Fixed |
| 27 | No manual override for "AUSTRALIA" text colour | Added `logoAustraliaColour` token + palette selector with Auto/manual options | Fixed |
| 28 | "Centre for Accessibility" text didn't adapt to light/dark backgrounds | `CfaLogo` auto-switches between #404041 (light bg) and #F0EEEE (dark bg) | Fixed |

### Design Decisions

| Decision | Rationale |
|---|---|
| Token default is `'auto'` not a hex value | Auto-detection covers most cases; manual override available when needed |
| WCAG AA Large (3:1) threshold for accent colour | "AUSTRALIA" is uppercase branding text, not body copy — 3:1 is appropriate per WCAG guidance |
| Brand Style Guide preference order | Light bg: Red → Teal → Purple; Dark bg: Lime → Orange → Sky Blue (matches page 6 of Brand Style Guide) |
| Single token for all logo instances | Navbar, login, and toolbar logos all use the same `logoAustraliaColour` value for brand consistency |
| Dynamic SVG/HTML replaces PNG images | PNGs can't have dynamic text colours; SVG/HTML gives full control while matching the reference logo structure |

### CFA Logo Accent Colours (from Brand Style Guide p.6)

| Colour | Hex | Best on |
|---|---|---|
| Red | #F64747 | Light backgrounds (default for light) |
| Orange | #F27927 | Dark backgrounds |
| Purple | #B500B5 | Light backgrounds |
| Sky Blue | #00BFFF | Dark backgrounds |
| Teal | #336E7B | Light backgrounds |
| Lime Green | #BAF73C | Dark backgrounds (default for dark) |

### Files Created

| File | Purpose |
|---|---|
| `components/preview/CfaLogo.tsx` | Shared dynamic logo component with navbar/login/toolbar variants |

### Files Modified

| File | Changes |
|---|---|
| `lib/tokens.ts` | Added `logoAustraliaColour` to ThemeTokens (default: `'auto'`), added `LOGO_ACCENT_COLOURS` constant |
| `lib/accessibility.ts` | Added `bestLogoAccentColour(bgHex)` function with WCAG contrast detection and brand preference ordering |
| `components/preview/MoodleNavbar.tsx` | Replaced PNG `<img>` with `<CfaLogo bgHex={navbarBg} variant="navbar">` |
| `components/preview/LoginPage.tsx` | Replaced PNG `<img>` with `<CfaLogo bgHex={tokens.loginCardBg} variant="login">` |
| `components/Toolbar.tsx` | Replaced PNG `<img>` with `<CfaLogo bgHex="#404041" variant="toolbar">` |
| `components/controls/ControlsPanel.tsx` | Added "Logo Australia Colour" control in Navbar section: 6 accent swatches + Auto button with computed colour preview |

### Build Status
- `npm run build` — zero errors
- `npm run lint` — zero warnings/errors

---

## Session: 2026-02-16 (continued) — Preset Logo Integration + Audit Hardening

### Feature: Logo Colour Updates with Presets

Presets now include curated `logoAustraliaColour` values so selecting a preset also updates the "AUSTRALIA" accent colour to match the theme.

| Preset | logoAustraliaColour | Rationale |
|---|---|---|
| CFA Teal Pro | `#F64747` (Red) | Best contrast on teal navbar |
| CFA Teal + Orange | `#F27927` (Orange) | Matches orange accent theme |
| CFA Dark Mode | `#BAF73C` (Lime) | Classic lime on dark bg |
| CFA Purple | `#BAF73C` (Lime) | High contrast on purple navbar |
| CFA Warm Cream | `#F27927` (Orange) | Matches warm orange brand |
| CFA Burnt Orange | `#00BFFF` (Sky Blue) | Best contrast on orange navbar |
| Moodle Default | (auto) | No override needed |
| CFA Standard | (auto) | No override needed |

### Feature: Logo Control Section Redesign

Moved the logo "Australia" colour control from inside the Navbar accordion to its own dedicated "Logo" accordion section (positioned between Brand Colour and Navbar) for better discoverability.

**New features:**
- Mini live logo preview on current navbar background
- Full-width "Auto" button showing the computed colour swatch and hex value
- 3-column grid of 6 CFA accent colour swatches with:
  - Colour name labels
  - Live contrast ratio against navbar bg
  - Pass/fail indicators (AA Large ≥ 3:1)

**Files modified:** `lib/tokens.ts`, `components/controls/ControlsPanel.tsx`

### Audit System Hardening

Full review of the accessibility audit system to eliminate hardcoded values and improve reliability.

| # | Issue | Action | Status |
|---|---|---|---|
| 29 | `hexToRgb()` crashed on undefined/non-hex input (e.g. `'auto'`, `'none'`) | Added defensive guard + regex hex validation + 3-digit hex support | Fixed |
| 30 | `isBlockedColour()` crashed on null/undefined hex input | Added null guard: `if (!hex) return false` | Fixed |
| 31 | `link-page` description hardcoded `(#FFFFFF)` | Changed to dynamic "Link colour on page background" | Fixed |
| 32 | `btn-primary` description said "White text" | Changed to "Button text on primary button" | Fixed |
| 33 | `bestLogoAccentColour()` had hardcoded hex arrays duplicating `LOGO_ACCENT_COLOURS` | Refactored to use the shared `LOGO_ACCENT_COLOURS` constant | Fixed |
| 34 | AuditPanel "Apply fix" for `logo-australia` used generic palette suggestion | Now filters `LOGO_ACCENT_COLOURS` by 3:1 contrast, picks highest ratio match | Fixed |

### Store Rehydration Fix

**Problem:** Adding new tokens (like `logoAustraliaColour`) caused runtime crashes when old localStorage data was loaded. Zustand's persist middleware uses shallow merge by default, replacing the entire `tokens` object with the stale persisted version — losing any new token defaults.

**Fix:** Added `merge` option to persist config for deep token merge:
```typescript
merge: (persistedState, currentState) => ({
  ...currentState,
  ...persisted,
  tokens: { ...currentState.tokens, ...(persisted.tokens || {}) },
})
```

**File modified:** `store/theme-store.ts`

### Build Status
- `npm run build` — zero errors
- `npm run lint` — zero warnings/errors

---

## Session: 2026-02-16 (continued) — Toolbar Cleanup + Git Upload + README

### Changes

| # | Issue | Action | Status |
|---|---|---|---|
| 35 | CFA logo in toolbar header (next to "Moodle Theme Configurator") | Removed logo from Toolbar.tsx per user preference — text only | Fixed |
| 36 | No README.md in repository | Created professional README with features, tech stack, setup instructions, architecture overview, deployment guide, and CFA logo disclaimer | Added |

### Files Modified
- `components/Toolbar.tsx` — removed `CfaLogo` import and component from toolbar header
- `README.md` — NEW: professional project documentation with CFA logo testing disclaimer

### Build Status
- `npm run build` — zero errors
- `npm run lint` — zero warnings/errors
