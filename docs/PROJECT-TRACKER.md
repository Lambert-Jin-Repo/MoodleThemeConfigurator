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

---

## Session: 2026-02-16 (continued) — Drawer Text, Logo Auto, Export Redesign, Highlight Pulse

### Fix: Drawer Text Invisible on Dark Backgrounds

CourseDrawer used page-level `bodyText` (#404041) on `drawerBg`, producing only 1.56:1 contrast in CFA Dark Mode (#1D2125 background). The accessibility audit had no check for text on drawer background.

| # | Issue | Action | Status |
|---|---|---|---|
| 37 | Drawer text invisible on dark backgrounds (1.56:1 contrast) | Added `drawerText` token that auto-computes from `drawerBg` via `autoTextColour()` | Fixed |
| 38 | No audit check for drawer text contrast | Added `drawer-text` check (drawerText on drawerBg) | Fixed |
| 39 | No Drawer Text colour picker in controls | Added to Drawers accordion section | Fixed |

**Files modified:** `lib/tokens.ts`, `store/theme-store.ts`, `components/preview/CourseDrawer.tsx`, `lib/accessibility.ts`, `components/controls/ControlsPanel.tsx`

### Fix: Logo "Australia" — Auto Colour Across All Surfaces

A single hardcoded `logoAustraliaColour` in presets couldn't serve both dark navbars and white login cards. 5 of 6 presets failed on the login page (e.g. lime #BAF73C on white = 1.28:1). The audit only checked navbar, missing the login card entirely.

| # | Issue | Action | Status |
|---|---|---|---|
| 40 | Logo "AUSTRALIA" lime on white login card = 1.28:1 contrast | Removed hardcoded `logoAustraliaColour` from all 6 presets — `'auto'` mode picks best colour per surface | Fixed |
| 41 | Audit only checked logo contrast on navbar, not login card | Added `logo-australia-login` check (logoAustraliaColour on loginCardBg) | Fixed |
| 42 | Audit fix suggested a single hex instead of auto mode | Fix handler now suggests `'auto'` which adapts per surface | Fixed |

**Auto mode results (all 8 presets verified):**
- Dark navbars → Lime #BAF73C (4.2–12.7:1 contrast)
- White login card → Red #F64747 (3.6:1 contrast)

**Files modified:** `lib/tokens.ts`, `lib/accessibility.ts`, `components/audit/AuditPanel.tsx`

### Feature: Export Redesign — "Apply on Moodle" Tutorial

Replaced the code-heavy export modal with a clean step-by-step tutorial.

| # | Issue | Action | Status |
|---|---|---|---|
| 43 | "Export SCSS" button name not user-friendly | Renamed to "Apply on Moodle" | Fixed |
| 44 | Export showed raw SCSS code blocks — confusing for non-technical admins | Redesigned as 5-step tutorial with copy buttons, no visible code | Fixed |

**New flow:** Step 1 (where to go) → Step 2 (brand colour with swatch) → Step 3 (copy Initial SCSS) → Step 4 (copy Raw SCSS) → Step 5 (save & purge caches). Download as .txt option at bottom.

**Files modified:** `components/Toolbar.tsx`, `components/export/ExportModal.tsx`

### Fix: Export Blocked Falsely on High Contrast AAA

| # | Issue | Action | Status |
|---|---|---|---|
| 45 | ExportModal passed raw `'auto'` string to `contrastRatio()` — treated as black (0,0,0) → false 1:1 contrast → export blocked | Added `bestLogoAccentColour()` resolution matching AuditPanel logic | Fixed |

**Root cause:** AuditPanel resolved `'auto'` before computing contrast, ExportModal did not. `hexToRgb('auto')` returned `[0,0,0]` (defensive guard), which against dark navbars gave ~1:1 ratio.

**File modified:** `components/export/ExportModal.tsx`

### Feature: 3-Cycle Breathing Pulse for Section Indicators

Replaced single-fire flash with a repeating glow animation for better discoverability.

| # | Issue | Action | Status |
|---|---|---|---|
| 46 | Section highlight flashed once (800ms) — easy to miss | Replaced with 3-cycle breathing glow pulse (~2.1s total) | Fixed |
| 47 | CSS cascade bug: second animation property overrode the first (pulse never played) | Consolidated to single `animation` property per element using `box-shadow`-based glow | Fixed |

**Animation design (follows Intercom/Stripe onboarding patterns):**
- BG sections: 600ms orange overlay fade + 3× glow pulse
- Text sections: 600ms text colour flash + 3× glow pulse
- Element sections: 3× scale pop + glow pulse
- All settle to persistent 2px orange outline while section stays open

**File modified:** `components/preview/MoodleShell.tsx`

### Preset Change: CFA High Contrast AAA as Recommended

| # | Issue | Action | Status |
|---|---|---|---|
| 48 | CFA Teal Professional was recommended — doesn't reflect CFA's accessibility mission | Moved `recommended: true` to CFA High Contrast AAA (AAA ratios, 3px focus, 17px font) | Changed |

**File modified:** `lib/tokens.ts`

### Build Status
- `npm run build` — zero errors
- `npm run lint` — zero warnings/errors
- Git repo: https://github.com/Lambert-Jin-Repo/MoodleThemeConfigurator

---

## Session: 2026-02-16 (continued) — Mobile & Tablet Responsive Design

### Feature: Three-Breakpoint Responsive Layout

Previously the app was desktop-only with a rigid 3-panel layout (Controls 320px | Preview flex-1 | Audit 300px). This session adds mobile and tablet support at three breakpoints while keeping the desktop experience 100% unchanged.

| Tier | Range | Tailwind prefix | Layout |
|------|-------|-----------------|--------|
| **Mobile** | <768px | *(default)* | Single panel + bottom tab bar |
| **Tablet** | 768–1023px | `md:` | Two-column + collapsible audit drawer |
| **Desktop** | 1024px+ | `lg:` | Original 3-panel (unchanged) |

### Files Created

| File | Purpose |
|------|---------|
| `lib/use-breakpoint.ts` | `useBreakpoint()` hook — returns `'mobile' \| 'tablet' \| 'desktop'` via `window.matchMedia` listeners, SSR-safe default `'desktop'` |
| `components/MobileTabBar.tsx` | Fixed bottom tab bar (56px) with 3 tabs: Controls (Sliders), Preview (Monitor), Audit (ShieldCheck). Active tab in CFA orange. `md:hidden` — auto-hidden on tablet/desktop. Safe-area padding for iPhone notch. |
| `components/ResponsiveLayout.tsx` | Three layout modes rendered via CSS `hidden`/`flex` (not conditional rendering — preserves React state). Mobile: single panel by `mobileTab`. Tablet: Controls (280px) + Preview (flex-1) + audit overlay drawer. Desktop: original 3-panel. |
| `components/audit/AuditDrawer.tsx` | Slide-in drawer (300px, absolute right) wrapping AuditPanel for tablet view. Close button header. Slides via `translate-x` transition. |

### Files Modified

| File | Changes |
|------|---------|
| `store/theme-store.ts` | Added `MobileTab` type, `mobileTab: 'preview'` and `auditDrawerOpen: false` state + `setMobileTab()` / `setAuditDrawerOpen()` setters. Both excluded from localStorage persist and undo/redo history. |
| `app/page.tsx` | Swapped `PanelLayout` import for `ResponsiveLayout` (controls/preview/audit props). Added `<MobileTabBar />` to root. |
| `components/Toolbar.tsx` | Mobile: shorter title ("Theme Config"), icon-only export button with 44px min tap target. Tablet: audit toggle button (ShieldCheck icon, `md:block lg:hidden`). Desktop: unchanged. |
| `components/preview/PreviewPanel.tsx` | Mobile: auto-fit zoom via `ResizeObserver` (containerWidth / 1280 design width), no padding. Desktop/Tablet: original percentage-based zoom math preserved exactly. |
| `components/preview/PreviewToolbar.tsx` | Zoom selector hidden on mobile (`hidden md:flex`). Tighter padding on mobile (`px-2 md:px-4`). Page tabs slightly smaller (`px-3 md:px-4`). |
| `components/controls/AccordionSection.tsx` | Cross-tab highlight linking: on mobile, opening a section auto-switches to Preview tab via `setMobileTab('preview')`. Auto-switches to login page when "Login Page" section is opened (improves UX at all breakpoints). |
| `components/controls/ColourPicker.tsx` | Larger touch targets on mobile: native colour input `w-10 h-10 md:w-8 md:h-8`, popover toggle `min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0`, palette swatches `w-8 h-8 md:w-6 md:h-6`. |
| `app/globals.css` | Added `.pb-safe` utility for `env(safe-area-inset-bottom)` padding. |
| `app/layout.tsx` | Added `viewport` export with `viewportFit: 'cover'` for iPhone safe-area support. |

### Design Decisions

| Decision | Rationale |
|---|---|
| CSS `hidden` vs conditional rendering | CSS `display:none` switches panels on mobile. Preserves React state (accordion open/close, scroll position, form values) when switching tabs. |
| Transform-based preview scaling | Moodle preview always renders at natural ~1280px width, scaled via CSS `transform: scale()`. On mobile at 390px the scale is ~0.30 — small but readable, consistent with "desktop site preview" behaviour. |
| No changes to preview internals | DashboardPage, CoursePage, LoginPage remain unchanged. Transform scaling means they render identically at all breakpoints. |
| Audit drawer (tablet) vs bottom sheet | Side drawer chosen because audit content is tall/scrollable and a side panel is more natural than a bottom sheet. |
| `PanelLayout.tsx` kept but unused | No code imports remain — only docs reference it. Harmless to leave; avoids breaking doc references. |

### Verification Checklist

| Check | Result |
|---|---|
| `npm run build` | Zero errors |
| `npm run lint` | Zero warnings/errors |
| Desktop layout (1024px+) unchanged | Identical 3-panel: Controls (320px) \| Preview (flex-1) \| Audit (300px) |
| Tablet layout (768–1023px) | Two-column + audit drawer toggle in toolbar |
| Mobile layout (<768px) | Single panel + bottom tab bar, auto-fit preview zoom |
| No regressions in undo/redo | `mobileTab` and `auditDrawerOpen` excluded from temporal history |
| No regressions in localStorage | Both new states excluded from persist `partialize` |

### Git Status
- **Branch:** `feat/responsive-mobile-tablet`
- **Commit:** `6a6ba86` — `feat(responsive): add mobile and tablet responsive layouts`
- **Pushed to:** `origin/feat/responsive-mobile-tablet`

---

## Session: 2026-02-23 — Moodle Layout Restructure

### Feature: Preview Layout Restructure to Match Real MoodleCloud Screenshots

Restructured all three preview pages (Dashboard, Course, Login) to match real MoodleCloud screenshots pixel-for-pixel, using exact CFA course content and real Moodle UI patterns.

### Files Modified
| File | Changes |
|---|---|
| `components/preview/DashboardPage.tsx` | Complete rewrite: "Dashboard" heading, "Recently accessed courses" with 2 image cards (no progress/buttons), Timeline with filter dropdowns + empty state, Calendar with full Feb 2026 month grid and today highlight |
| `components/preview/CourseCard.tsx` | Simplified: image + title + category only, new `imageType` prop for accessibility/moodle variants, removed progress bar and buttons |
| `components/preview/CourseDrawer.tsx` | Expanded: X close + 3-dot menu header, 5 sections (General/Teleconference/Modules/Level A/Assessments) with completion circles, lock icons, truncated text matching real CFA course |
| `components/preview/CoursePage.tsx` | Restructured: "Web Accessibility Compliance SC" title, collapsible General section with "Collapse all", activity rows with proper icons, hidden section banner with "Hidden from students" badge, Modules section |
| `components/preview/SecondaryNav.tsx` | Added Activities + "More ▾" tabs (was 4 tabs, now 5 + More dropdown) |
| `components/preview/LoginPage.tsx` | Restructured: removed "Log in" heading, small left-aligned login button, "Lost password?" link, "Is this your first time here?" signup section, "Create new account" grey button, footer with language/cookies |
| `components/preview/MoodleShell.tsx` | Replaced `.moodle-btn-outline` with `.moodle-btn-secondary` in hover styles and SECTION_HIGHLIGHT_MAP |

### Files Created
| File | Purpose |
|---|---|
| `docs/features/2026-02-23-moodle-layout-restructure.md` | Feature spec with 6 tasks |

---

## Session: 2026-02-23 — Quick Palette Typography + Moodle Accuracy Fixes

### Feature: Quick Palette Typography Controls

Added font family dropdown and text size slider directly in the Quick Palette section, including Source Sans Pro Bold as a font option per CFA style guide requirements.

| # | Issue | Action | Status |
|---|---|---|---|
| 49 | No font family or text size controls in Quick Palette | Added `<select>` for font family and `<input type="range">` for body font size below the swatch grid | Fixed |
| 50 | Source Sans Pro Bold not available as a font option | Added to FONT_OPTIONS with weight '700'; Source Sans 3 already loaded in globals.css with weights 400, 600, 700 | Fixed |
| 51 | `fontWeight` token missing from ThemeTokens | Added `fontWeight: string` to interface and `'400'` to DEFAULT_TOKENS | Fixed |
| 52 | Preview didn't consume typography CSS vars | Added global `.moodle-preview` font rules + heading styles in `buildHoverStyles()` | Fixed |
| 53 | ControlsPanel Font Family select didn't set fontWeight | Updated to composite `value||weight` pattern matching QuickPalette | Fixed |

**Files modified:** `lib/tokens.ts`, `components/controls/QuickPalette.tsx`, `components/preview/MoodleShell.tsx`, `components/controls/ControlsPanel.tsx`

### Fix: Colour Picker Popover Broken (Issue 1)

| # | Issue | Action | Status |
|---|---|---|---|
| 54 | Dropdown popover next to colour controls clipped by `overflow-y-auto` parent — no options visible | Replaced popover with inline HEX/RGB/HSL format cycler button | Fixed |

**Root cause:** `ColourPicker.tsx` used `position: absolute` for the advanced popover, but the parent `ControlsPanel` has `overflow-y-auto` which clips absolute children.

**Fix:** Removed the entire popover (HexColorPicker + CFA palette swatches). Replaced with a format cycle button — clicking cycles display between HEX → RGB → HSL. Text input parses the current format (e.g. `rgb(51, 110, 123)`) and converts back to hex. Native `<input type="color">` swatch remains for visual picking. Uses existing `hexToRgb`, `hexToHsl`, `hslToHex` from `lib/accessibility.ts`.

**File modified:** `components/controls/ColourPicker.tsx`

### Fix: Button Variants Don't Match Real Moodle (Issue 2)

| # | Issue | Action | Status |
|---|---|---|---|
| 55 | Preview showed `.moodle-btn-outline` (transparent bg + primary border) — this variant doesn't exist in Moodle Boost | Replaced with `.moodle-btn-secondary` (solid grey `#ced4da` bg, dark `#1d2125` text) | Fixed |

**Research finding:** Real Moodle Boost has `.btn-secondary` (`$gray-400` = `#ced4da` background) and `.btn-outline-secondary` (`$gray-600` border), but **no `.btn-outline-primary`**. The preview was showing a Bootstrap `btn-outline-primary` style that Moodle doesn't use.

**Files modified:** `components/preview/MoodleShell.tsx` (CSS + SECTION_HIGHLIGHT_MAP), `components/preview/CourseCard.tsx`, `components/preview/CoursePage.tsx`

### Fix: Calendar Preview Accuracy (Issue 3)

| # | Issue | Action | Status |
|---|---|---|---|
| 56 | Calendar "today" highlight was rounded rectangle, not circle like real Moodle | Changed to `border-radius: 50%` with proper 18x18px circle | Fixed |
| 57 | No indication that calendar event colours don't follow `$primary` | Added tooltip on Calendar header explaining the limitation | Fixed |

**Research finding:** Moodle's `calendar.scss` uses `$calendarCurrentDateBackground: $primary` for the today circle -- YES it changes. But event type colours (course, user, group) are hardcoded with independent `!default` variables and do NOT follow `$primary`.

**File modified:** `components/preview/BlocksDrawer.tsx`

### Fix: "CFA Dark Mode" Preset Misleading Name

| # | Issue | Action | Status |
|---|---|---|---|
| 58 | Preset named "CFA Dark Mode" but only darkens chrome (navbar/footer/drawers), content area stays white | Renamed to "CFA Dark Chrome" with accurate description | Fixed |

**Research finding:** Full dark mode is not reliably achievable on Moodle Cloud because:
- Moodle templates use hardcoded `.bg-white` CSS class (can't edit templates on Cloud)
- TinyMCE editor iframe can't be styled via SCSS
- Embedded content (H5P, SCORM) renders with its own styling
- MDL-68037 (native dark mode) still unresolved since Moodle 3.8

**File modified:** `lib/tokens.ts`

### Fix: SCSS Generator Missing Export Rules

| # | Issue | Action | Status |
|---|---|---|---|
| 59 | `pageBg` hardcoded as `$body-bg: #FFFFFF` -- never exported user changes | Now conditional: only exports `$body-bg` when `pageBg` differs from default | Fixed |
| 60 | `cardBg` had no SCSS export rule at all | Added `$card-bg` in Block 1 + `.card { background-color }` in Block 2 | Fixed |
| 61 | `loginCardBg` had no SCSS export rule | Added `body#page-login-index .card` override in Block 2 | Fixed |
| 62 | `drawerText` not exported -- drawer rule only had bg + border | Added `color` property to drawer CSS rule | Fixed |

**File modified:** `lib/scss-generator.ts`

### Fix: Breadcrumb Hardcoded Tailwind Colors

| # | Issue | Action | Status |
|---|---|---|---|
| 63 | `MoodleBreadcrumb.tsx` used `text-gray-500`/`text-gray-600` Tailwind classes instead of CSS variables | Replaced with `var(--cfa-muted-text)` and `var(--cfa-body-text)` inline styles | Fixed |

**File modified:** `components/preview/MoodleBreadcrumb.tsx`

### CLAUDE.md Enforcement Update

Added mandatory enforcement rules after agent violated worktree-first workflow by coding directly on `main`:
1. Worktree-first for all features
2. Never modify files on `main`
3. Follow all skill phases
4. No code before spec approval

**File modified:** `CLAUDE.md`

### Build Status
- `npm run build` — zero errors
- `npm run lint` — zero warnings/errors

### Git Status
- **Branch:** `feat/moodle-layout-restructure` (layout restructure), `feat/quick-palette-typography` (typography + accuracy fixes)
- **Commits:** `5a6f63a` (layout restructure), `53c4c5d` (typography controls), `fe3d159` (Moodle accuracy fixes)

## Session: 2026-03-26 — Dark Theme Icon Visibility Fixes

### Issues Found During User Review

| # | Issue | Reported By | Status |
|---|---|---|---|
| 64 | Help icons (`.icon.text-info`) invisible on dark theme — dark teal on dark bg | User (screenshot) | Fixed |
| 65 | Required field icons (`.icon.text-danger`) invisible — generic `.icon, .fa` rule clobbers `.text-danger` | User (screenshot) | Fixed |
| 66 | Calendar picker icon (`.btn-link .icon`) invisible — not covered by any dark override | User (screenshot) | Fixed |
| 67 | File manager folder icon (`.fp-path-folder`) invisible — image-based icon, CSS `color` doesn't work | User (screenshot) | Fixed |
| 68 | Initial fix for folder icon inverted child link text — `filter: invert(1)` on parent span affected all children | Self-caught during verify | Fixed |

### Root Cause Analysis

The generic dark theme icon rule `.icon, .fa { color: #1d2125 !important; }` was clobbering ALL icon colours, including:
1. **Bootstrap text-utility icons** (`.text-info`, `.text-danger`, `.text-warning`, `.text-success`) — equal specificity, cascade order loses
2. **Button link icons** (`.btn-link .icon`) — no specific override existed
3. **Image-based icons** (`.fp-path-folder`) — CSS `color` property has no effect on background-image icons

### Actions Taken

#### Fix 64: Help Icon Visibility (`.text-info`)
- **Problem:** Help icons (`fa-circle-question`) with `.text-info` class were invisible on dark backgrounds. Bootstrap applies `.text-info` with `!important`, but the generic `.icon, .fa` rule overrides it due to cascade order.
- **Fix:** Added new token `infoIconColour` linked to `brandPrimary` via `BRAND_LINKED_KEYS`. SCSS generator emits `.icon.text-info, .fa.text-info { color: ${tokens.infoIconColour} !important; }` in dark mode Block 2.
- **Design decision:** Initially linked to `info` token, later changed to follow `brandPrimary`/`linkColour` so it adapts to the main theme colour. Warning/danger icons intentionally keep their semantic colours.
- **Files:** `lib/tokens.ts`, `store/theme-store.ts`, `lib/scss-generator.ts`, `components/controls/ControlsPanel.tsx`

#### Fix 65: Semantic Icon Colours (`.text-danger`, `.text-warning`, `.text-success`)
- **Problem:** All Bootstrap text-utility icon classes were overridden by the generic dark icon rule.
- **Fix:** Added targeted overrides for all 4 semantic classes using token values: `infoIconColour` (follows brand), `error`, `warning`, `success`. All dynamic — no hardcoded hex.
- **File:** `lib/scss-generator.ts`

#### Fix 66: Calendar Picker Icon
- **Problem:** Calendar icon inside `<button class="btn btn-link">` had no dark theme override.
- **Fix:** Added `.btn-link .icon, .btn-link .fa, .btn-link [class*="fa-"] { color: ${tokens.linkColour} }` in dark mode section. Follows `brandPrimary` via `linkColour`.
- **File:** `lib/scss-generator.ts`

#### Fix 67–68: File Manager Folder Icon
- **Problem:** Folder icon is a CSS `background-image` on `<span class="fp-path-folder">`, not FontAwesome. CSS `color` has no effect.
- **First attempt:** `filter: invert(1)` on span — inverted the icon BUT also inverted the "Files" link text inside.
- **Second attempt:** `::before` pseudo-element target — folder icon isn't rendered via pseudo-element, no effect.
- **Final fix:** Double-invert trick — `filter: invert(1)` on `.fp-path-folder` (fixes icon), counter `filter: invert(1)` + `color: ${tokens.linkColour}` on `.fp-path-folder a` (restores text + applies theme colour).
- **File:** `lib/scss-generator.ts`

### New Token: `infoIconColour`

| Property | Value |
|---|---|
| Interface field | `infoIconColour: string` |
| Default | `#0f6cbf` (matches `brandPrimary` default) |
| Linked to | `brandPrimary` via `BRAND_LINKED_KEYS` + `linkColour` via `setToken` cascade |
| Dark presets | `#BAF73C` (lime green) in `cfa-dark-chrome`, `cfa-dark-lime`, `cfa-dark-ember` |
| Control | "Info Icon" colour picker in Alerts & Progress section, marked `linkedToBrand` |

### Skill Update: `/moodle-issue`

Updated `.claude/skills/moodle-issue/SKILL.md` with two new rules:
1. **Never hardcode hex in SCSS generator** — all colour values must use `${tokens.xxx}` references so colours adapt dynamically when users change theme tokens
2. **Token linking pattern** — when adding derived tokens, implement auto-follow logic in `store/theme-store.ts` `setToken()` so colours cascade from parent tokens

### Documentation Updates

- `docs/moodle-cloud-constraints.md` — added 7 new verified selectors + "Bootstrap Text-Utility Icon Overrides" section + "Non-FontAwesome Dark Icon Patterns" section
- `MEMORY.md` — saved dark theme icon override patterns (3 strategies)
- All 10 presets verified — 3 dark presets updated with `infoIconColour: '#BAF73C'`

### Lessons Learned

1. **`filter: invert()` affects all children** — when inverting image-based icons, always check if the container has text children. Use double-invert trick if needed.
2. **CSS `color` doesn't work on background-image icons** — identify whether an icon is FontAwesome (text-based, use `color`) or image-based (use `filter`).
3. **Always use token references in SCSS generator** — hardcoded hex values break when users change theme colours. Every colour value should be `${tokens.xxx}`.
4. **Link icon colours to `brandPrimary`, not `info`** — `info` is a semantic alert colour that may be dark even on dark themes. Interactive/UI icons should follow the main theme colour.

### Phase 2: Agent Code Review + Additional Fixes

Dispatched 4 review agents to audit all changes. Findings and fixes:

#### Fix: 4 hardcoded `#404041` in SCSS generator

| Line | Context | Changed to |
|---|---|---|
| 201 | Light-mode dropdown text | `${d.bodyText}` (fixed — Moodle default `#1d2125`) |
| 289 | Login card text (dark bg + light card) | `${d.bodyText}` (fixed) |
| 723 | Dark-mode activity nav button text | `autoTextForHex(tokens.bodyText)` (computed) |
| 730 | Dark-mode activity nav button icon | `autoTextForHex(tokens.bodyText)` (computed) |

#### Fix: 6 presets missing `infoIconColour`

All presets now explicitly set `infoIconColour` to match their `linkColour`:

| Preset | `infoIconColour` |
|---|---|
| cfa-teal-pro | `#336E7B` (teal) |
| cfa-teal-orange | `#336E7B` (teal) |
| cfa-purple | `#8A008A` (dark purple, matches linkColour) |
| cfa-warm-cream | `#336E7B` (teal) |
| cfa-high-contrast | `#245058` (dark teal) |
| cfa-burnt-orange | `#9E4E12` (burnt orange) |

#### Fix: Dark preset `error` token — CFA Red

Moodle default `#ca3120` fails contrast on dark backgrounds. Changed to CFA brand Red `#F64747` (3.58:1 on Charcoal, AA Large pass) in all 3 dark presets.

#### Fix: Dark-lime `info` token

Changed from `#336E7B` (teal, 1.80:1 on Charcoal = invisible) to `#00BFFF` (CFA Sky Blue, 4.12:1 = AA Large pass).

#### Fix: `info` picker false `linkedToBrand`

Removed `linkedToBrand` and `tokenKey` from the `info` colour picker — `info` is NOT in `BRAND_LINKED_KEYS`, so the UI indicator was misleading.

### Phase 3: White-Background Container Text Fix

| # | Issue | Reported By | Status |
|---|---|---|---|
| 69 | Text invisible in `.bg-white` containers (messaging settings, notifications) — light `$body-color` on white bg | User (screenshot) | Fixed |
| 70 | Text invisible in file manager dialog (`.moodle-dialogue-bd`, `.fp-select`) — labels white on white | User (screenshot) | Fixed |
| 71 | Text invisible in file manager table (`.yui3-datatable`) — file data white on white | User (screenshot) | Fixed |
| 72 | Messaging drawer sidebar dark text on dark bg (Starred, Group, Private sections) | User (screenshot) | **Not fixed — selector mismatch, deferred** |

**Root cause (69–71):** Moodle hardcodes `.bg-white` class and uses YUI3 widgets that retain white backgrounds. Dark theme `$body-color` is light → invisible text on white.

**Fix:** Added Block 2 rules forcing `${d.bodyText}` (`#1d2125`, fixed Moodle default dark text) on `.bg-white *`, `.moodle-dialogue-bd *`, `.fp-select *`, `.yui3-datatable *`, `.yui3-widget-bd *`, `.message-app .body-container *`. Links inside preserved with `${tokens.linkColour}` (dynamic).

**Issue 72 deferred:** Messaging drawer sidebar text not fixed. Tried `[data-region="message-drawer"]` and `.message-app` selectors — neither matched. Needs live DOM investigation to find correct selector. Removed non-working code.

### Lessons Learned (continued)

5. **White-background containers on dark themes are a major category** — Moodle uses `.bg-white`, YUI3 widgets, and dialog containers that keep white bg regardless of theme. Must force dark text with `${d.bodyText}` (fixed Moodle default), not dynamic token.
6. **Cascade order matters with `!important`** — when two rules both use `!important` with equal specificity, the later rule wins. Place light-text rules BEFORE white-bg dark-text rules.
7. **CFA brand colours for dark themes** — use Red `#F64747` for errors (not Moodle default `#ca3120`), Sky Blue `#00BFFF` for info, Lime Green `#BAF73C` for success/highlights. All verified against CFA Brand Style Guide contrast tables.
8. **Messaging drawer selector unknown** — `[data-region="message-drawer"]`, `.message-drawer`, and `.message-app` did not match. Needs live DOM inspection to identify correct selector.

### Phase 4: Link Action Icon Fixes

| # | Issue | Reported By | Status |
|---|---|---|---|
| 73 | Message icon (`i.icon.fa.fa-message.fa-fw`) dark/invisible on profile page dark bg | User (screenshot) | Fixed |
| 74 | Edit password pen icon (`i.icon.fa.fa-pen.fa-fw`) dark/invisible inside form link | User (screenshot) | Fixed |

**Root cause:** Both are plain FontAwesome icons inside `<a>` links on the dark page background. No Bootstrap text-utility class. The generic `.icon, .fa { color: #1d2125 }` rule forces them dark.

**Fix:** Added `a .icon, a .fa, a [class*="fa-"] { color: ${tokens.linkColour} !important; }` in dark mode Block 2, placed BEFORE the `.bg-white` rule so white containers override it back to dark text. Uses `${tokens.linkColour}` (dynamic, follows `brandPrimary` via `BRAND_LINKED_KEYS`).

**Impact:** All icons inside `<a>` links on dark backgrounds now follow main theme colour. Card/nav icons unaffected (higher specificity rules win). Light themes unaffected (rule only emits when `isDarkBg(pageBg)`).

### Phase 5: Additional Dark Theme Fixes

| # | Issue | Colour type | Token/Value | Status |
|---|---|---|---|---|
| 75 | "Manage courses" `.btn-outline-primary` invisible on dark bg | Default: fixed white; Hover: dynamic | `#FFFFFF` / `${tokens.linkColour}` | Fixed |
| 76 | Section collapse/expand arrow not themed | Default bg: dynamic; Arrow: fixed dark | `${tokens.linkColour}` / `${d.bodyText}` | Fixed |
| 77 | Activity icons — shape not visible, only bg colour showing | Fixed (white icon on coloured bg) | `filter: brightness(0) invert(1)` | Fixed |
| 78 | "Done" check icon invisible on light `.btn-subtle-success` button | Fixed dark | `${d.bodyText}` | Fixed |
| 79 | `.resourcelinkdetails` (file size) text invisible — `color: #555` on dark bg | Static muted | `${tokens.mutedText}` | Fixed |
| 80 | Message icon (`fa-message`) on profile page invisible | Dynamic (main colour) | `${tokens.linkColour}` | Fixed |
| 81 | Edit pen icon (`fa-pen`) inside form link invisible | Dynamic (main colour) | `${tokens.linkColour}` | Fixed |

#### Colour classification for all recent fixes

**Dynamic — follows main theme colour (`brandPrimary` → `linkColour`):**
- `.icon.text-info` → `${tokens.infoIconColour}` (in `BRAND_LINKED_KEYS`)
- `.btn-link .icon` → `${tokens.linkColour}` (calendar picker, actions)
- `.fp-path-folder a` → `${tokens.linkColour}` (file manager link)
- `.filemanager-toolbar .icon` → `${tokens.linkColour}`
- `a .icon, a .fa` → `${tokens.linkColour}` (all link action icons)
- `.btn-outline-primary:hover` bg → `${tokens.linkColour}`
- `.icons-collapse-expand` default bg → `${tokens.linkColour}`
- `.bg-white a` (links inside white containers) → `${tokens.linkColour}`

**Semantic — keeps alert/status colour (same across all dark themes):**
- `.icon.text-danger` → `${tokens.error}` (CFA Red `#F64747` on dark presets)
- `.icon.text-warning` → `${tokens.warning}`
- `.icon.text-success` → `${tokens.success}`

**Fixed dark — always dark text on always-light backgrounds:**
- `.bg-white *` → `${d.bodyText}` (`#1d2125`)
- `.moodle-dialogue-bd *` → `${d.bodyText}`
- `.fp-select *`, `.yui3-datatable *` → `${d.bodyText}`
- `.btn-subtle-success .fa` → `${d.bodyText}` (completion check on light button)
- `.icons-collapse-expand[aria-expanded] .icon` → `${d.bodyText}` (dark arrow on white bg)
- Light-mode dropdown text → `${d.bodyText}`
- Login card text → `${d.bodyText}`

**Fixed white — always white on always-dark backgrounds:**
- `.btn-outline-primary` text/border → `#FFFFFF`
- `.icons-collapse-expand:hover .icon` → white (via hover rule inheriting from container)
- `.activityiconcontainer .activityicon` → white via `filter: brightness(0) invert(1)`

**Computed — auto-contrast based on background:**
- Activity nav button text → `autoTextForHex(tokens.bodyText)`
- `.btn-outline-primary:hover` text → `autoTextForHex(tokens.linkColour)`

**Static muted — same muted grey across all dark themes:**
- `.text-muted`, `.resourcelinkdetails`, `.activity-dates` → `${tokens.mutedText}`
- `.dimmed`, `.ishidden` → `${tokens.mutedText}`

**Image-based — filter invert (not colour-controllable):**
- `.fp-path-folder` → `filter: invert(1)` + double-invert on child `a`
- `.activity-groupmode-info img.icon` → `filter: invert(1)`
- `.activityiconcontainer .activityicon` → `filter: brightness(0) invert(1)`

**Activity icon backgrounds — per-category Moodle 5.0+ purpose colours:**
- `.activityiconcontainer.content` → `${tokens.actIconContent}` (`#0099ad`)
- `.activityiconcontainer.assessment` → `${tokens.actIconAssessment}` (`#f90086`)
- `.activityiconcontainer.collaboration` → `${tokens.actIconCollaboration}` (`#5b40ff`)
- `.activityiconcontainer.communication` → `${tokens.actIconCommunication}` (`#eb6200`)
- `.activityiconcontainer.administration` → `${tokens.actIconAdmin}` (`#da58ef`)
- `.activityiconcontainer.interface` → `${tokens.actIconInterface}` (`#a378ff`)

### Phase 6: Button, Badge, Filter & Progress Text Fixes

| # | Issue | Colour type | Token/Value | Status |
|---|---|---|---|---|
| 82 | `.btn-outline-primary` ("Manage courses") invisible on dark bg | Default: fixed white; Hover: dynamic | `#FFFFFF` / `${tokens.linkColour}` | Fixed |
| 83 | Section toggle arrow not themed — 3-state interaction | Default bg: dynamic; Arrow: fixed dark; Hover: dark bg + white arrow; Expanded: white bg + dark arrow | `${tokens.linkColour}` / `${d.bodyText}` / `#FFFFFF` | Fixed |
| 84 | Activity icon shapes not visible — only bg colour showing | Fixed white via filter | `filter: brightness(0) invert(1)` | Fixed |
| 85 | "Done" check icon invisible on `.btn-subtle-success` | Fixed dark | `${d.bodyText}` | Fixed |
| 86 | `.resourcelinkdetails` file size text invisible | Static muted | `${tokens.mutedText}` | Fixed |
| 87 | Message icon (`fa-message`) on profile invisible | Dynamic | `${tokens.linkColour}` | Fixed |
| 88 | Edit pen icon (`fa-pen`) in form link invisible | Dynamic | `${tokens.linkColour}` | Fixed |
| 89 | Filter `.form-select` dropdown text invisible in `.bg-white` panel | Fixed dark | `${d.bodyText}` via `.bg-white` final overrides | Fixed |
| 90 | "Add condition" text + plus icon invisible on white filter panel | Fixed dark | `${d.bodyText}` | Fixed |
| 91 | "Clear filters" `.btn-secondary` text invisible on white filter panel | Fixed dark + white bg | `${d.bodyText}` + `#FFFFFF` bg | Fixed |
| 92 | Filter "Match" label + "of the following:" span invisible | Fixed dark | `${d.bodyText}` | Fixed |
| 93 | Filter "AND"/"OR" join text invisible | Fixed dark | `${d.bodyText}` | Fixed |
| 94 | "Active" badge text on `.bg-success` hard to read (white on green) | Fixed dark | `${d.bodyText}` | Fixed |
| 95 | "0% complete" text + number on course card invisible (`.bg-white` override conflict) | Dynamic bodyText | `${tokens.bodyText}` at end of cascade | Fixed |
| 96 | BUG: Section toggle hover — dark icon on dark bg (invisible) | Fixed white | `#FFFFFF` on hover | Fixed in review |

#### Full colour audit of all Phase 5–6 additions

All changes verified against classification system:

**Dynamic (follows main theme colour):**
- `a .icon, a .fa` → `${tokens.linkColour}` ✓
- `.btn-outline-primary:hover` bg → `${tokens.linkColour}` ✓
- `.icons-collapse-expand` default bg → `${tokens.linkColour}` ✓
- `.bg-white a` links → `${tokens.linkColour}` ✓
- `.btn-primary` inside `.bg-white` → `${tokens.btnPrimaryBg}` / `${tokens.btnPrimaryText}` ✓
- Course card footer bg → `${tokens.cardBg}` ✓
- Course card progress text → `${tokens.bodyText}` ✓

**Fixed dark (always dark on light backgrounds):**
- `.bg-white` final overrides (forms, buttons, labels) → `${d.bodyText}` ✓
- Filter join text, match label, action buttons → `${d.bodyText}` ✓
- `.btn-subtle-success .fa` (completion) → `${d.bodyText}` ✓
- `.badge.bg-success/info/warning` text → `${d.bodyText}` ✓
- `.icons-collapse-expand` default arrow → `${d.bodyText}` ✓
- `.icons-collapse-expand[aria-expanded]` arrow → `${d.bodyText}` ✓

**Fixed white (always white on dark backgrounds):**
- `.btn-outline-primary` default text/border → `#FFFFFF` ✓
- `.icons-collapse-expand:hover` arrow → `#FFFFFF` ✓
- `.icons-collapse-expand[aria-expanded]` bg → `#FFFFFF` ✓
- `.activityiconcontainer .activityicon` → white via filter ✓

**Computed:**
- `.btn-outline-primary:hover` text → `autoTextForHex(tokens.linkColour)` ✓

**Static muted:**
- `.resourcelinkdetails`, `.activity-altcontent`, `.activity-dates` → `${tokens.mutedText}` ✓

**No hardcoded hex found in new additions** (except `#FFFFFF` for fixed-white contexts, which is justified).

### Phase 7: Toggles, Badges, Filters, Progress, Messaging Drawer

| # | Issue | Colour type | Token/Value | Status |
|---|---|---|---|---|
| 97 | Toggle switches not themed — default blue on dark themes | Checked: dynamic; Unchecked: fixed white; Circle: fixed black | `${tokens.linkColour}` / `#FFFFFF` / SVG `#000` | Fixed |
| 98 | "Active" badge `.bg-success` white text hard to read on green | Fixed dark | `${d.bodyText}` | Fixed |
| 99 | Filter `.form-select` dropdown text invisible in `.bg-white` panel | Fixed dark via final cascade | `${d.bodyText}` | Fixed |
| 100 | "Add condition" + plus icon invisible on white filter panel | Fixed dark | `${d.bodyText}` | Fixed |
| 101 | "Clear filters" `.btn-secondary` invisible on white filter panel | Fixed dark + white bg | `${d.bodyText}` + `#FFFFFF` | Fixed |
| 102 | Filter "Match" label + "of the following:" span invisible | Fixed dark | `${d.bodyText}` | Fixed |
| 103 | Filter "AND"/"OR" join text invisible | Fixed dark | `${d.bodyText}` | Fixed |
| 104 | "0% complete" text + number on course card invisible | Dynamic bodyText at end of cascade | `${tokens.bodyText}` | Fixed |
| 105 | BUG: Section toggle hover — dark icon on dark bg (caught in review) | Fixed white | `#FFFFFF` on hover | Fixed |
| 106 | Messaging drawer sidebar — dark text on grey bg (previously unsolved #72) | Dynamic: body/link/muted | `${tokens.bodyText}` / `${tokens.linkColour}` / `${tokens.mutedText}` | **Fixed** |
| 107 | Messaging sidebar background too light | Dynamic drawer bg | `${tokens.drawerBg}` | Fixed |
| 108 | Search icon in messaging search bar invisible (white on white input) | Fixed dark | `${d.bodyText}` | Fixed |

#### Messaging Drawer Fix Details (previously unsolved issue #72, now resolved)

**Root cause:** `.message-app .body-container *` was in the white-bg container rule, forcing dark text on the ENTIRE messaging app including the dark-bg sidebar.

**Fix (3 parts):**
1. Removed `.message-app .body-container *` from white-bg rule (conversation area still handled by its own `.bg-white` class)
2. Added `.message-app` background: `${tokens.drawerBg}` (dark, matches other drawers)
3. Added sidebar text hierarchy:
   - Primary text (headings, names) → `${tokens.bodyText}` (white on dark themes)
   - Interactive (links, icons) → `${tokens.linkColour}` (dynamic, main theme colour)
   - Secondary (muted, counts) → `${tokens.mutedText}` (grey)
4. Added `.simplesearchform .btn-submit .icon` → `${d.bodyText}` (dark icon on white search input)

**Works on all dark presets** — all values are token-based: `drawerBg`, `bodyText`, `linkColour`, `mutedText` adapt per preset.

### Phase 8: Footer Popover Text Fix

| # | Issue | Colour type | Token/Value | Status |
|---|---|---|---|---|
| 109 | Footer popover text (login info, Cookie Settings, Policies, etc.) dark on dark bg | Dynamic footer tokens | `${tokens.footerText}` / `${tokens.footerLink}` | Fixed |

**Root cause:** `#page-footer` has `.bg-white` class. The `.bg-white *` rule forced dark text on the footer popover content which has a dark background.

**Fix:** Used `#page-footer` ID selector (specificity 1,0,0) which beats `.bg-white div` (specificity 0,1,1). Text uses `${tokens.footerText}`, links use `${tokens.footerLink}` — both dynamic, follow each preset's footer colour tokens.

**Lesson:** When `.bg-white` is on a container that has dark-bg children (like footer popover), ID selectors are needed to beat the class-based `.bg-white` overrides. Class-only selectors with `!important` lose on specificity.

### Build Status
- Dev server running — all changes verified via hot reload
- Previously unsolved issue #72 (messaging drawer) now resolved as #106–108

### Git Status
- **Branch:** `fix/dark-theme-info-icon`
- **Files modified:** `lib/tokens.ts`, `store/theme-store.ts`, `lib/scss-generator.ts`, `components/controls/ControlsPanel.tsx`, `docs/moodle-cloud-constraints.md`, `.claude/skills/moodle-issue/SKILL.md`, `docs/PROJECT-TRACKER.md`

### Phase 10: Notifications Popover Dark Theme

| # | Issue | Colour type | Token/Value | Status |
|---|---|---|---|---|
| 111 | Notifications popover (bell icon) renders as hardcoded white card with `#f4f4f4` unread rows + `$primary` hover — invisible on all dark presets | Fixed dark surface + dynamic hover + computed hover text | `${tokens.drawerBg}` / `${tokens.bodyText}` / `${tokens.linkColour}` / `autoTextForHex(linkColour)` / `${tokens.mutedText}` | Fixed |
| 112 | Notification row hover text stays whitish on lime green — unreadable on `cfa-dark-lime` | Computed hover text (descendant `*` selector required) | `autoTextForHex(tokens.linkColour)` | Fixed |

**Root cause:**
- The popover-region container is portalled out of `.navbar` as `aria-modal="true"`. The existing `.navbar .popover-region-container` rule never matches.
- It is NOT a Bootstrap `.popover` (different class), so the generic `.popover` dark rule does not apply either.
- The bell-icon dropdown uses Moodle-custom `.popover-region-notifications` markup which Boost hardcodes to `$white` via `$popover-region-container-bg`, with `#f4f4f4` unread rows and `$primary` hover.

**Fix:**
1. New dark-theme block targets `.popover-region-notifications` directly (~`lib/scss-generator.ts:942`).
2. Container + footer → `${tokens.drawerBg}` (matches messaging-drawer surface convention).
3. Header/body/row text → `${tokens.bodyText}` (dynamic).
4. Unread tint, borders → `rgba(255,255,255,0.06–0.1)` (fixed white at low alpha).
5. Hover bg → `${tokens.linkColour}` (dynamic). Hover text → `autoTextForHex(tokens.linkColour)` (computed contrast).
6. Timestamps → `${tokens.mutedText}` (static muted). "See all" / "View more" → `${tokens.linkColour}`.

**Hover text specificity gotcha (issue #112):**

The first attempt set `color: ${autoTextForHex(linkColour)}` on `.content-item-container:hover` only. The text inside the row lives inside `<a class="context-link">` — Boost's `.content-item-container:hover { color: inherit }` cascades to the anchor only via *inheritance*, but our own global rule:

```scss
a:hover { color: ${tokens.linkHover} !important; }   // specificity 0,1,1
```

applies *directly* to the anchor and wins over an inherited colour, regardless of how high the parent's specificity is. On `cfa-dark-lime` `linkHover` = `#A8E030` on a `#BAF73C` hover background — visually invisible.

The fix uses a descendant `*` selector so the rule applies *directly* to every child (anchor included):

```scss
.popover-region-notifications .content-item-container:hover *,
.popover-region-notifications .content-item-container:hover a:hover,
.popover-region-notifications .content-item-container:hover a:focus { ... }
```

Specificity 0,3,0 — beats `a:hover` 0,1,1.

**Token classification (per CLAUDE.md table):**

| Element | Token | Category |
|---|---|---|
| Container & footer bg | `drawerBg` | Fixed dark |
| Header, row, message text | `bodyText` | Dynamic |
| Hover bg | `linkColour` | Dynamic |
| Hover text (all descendants) | `autoTextForHex(linkColour)` | Computed |
| Unread tint, borders | `rgba(255,255,255,*)` | Fixed white (low alpha) |
| Timestamp | `mutedText` | Static muted |
| "See all" / "View more" | `linkColour` | Dynamic |

**Presets:** No preset changes needed — every token used here (`drawerBg`, `bodyText`, `mutedText`, `linkColour`) is already defined on all three dark presets (`cfa-dark-chrome`, `cfa-dark-lime`, `cfa-dark-ember`).

**Controls panel:** No new picker rows — all colours reuse tokens already exposed in the controls panel.

**Lesson:** When a hovered container wraps an `<a>` and you set `color` on the container, the global `a:hover` rule still wins on the anchor itself because *direct* style application beats *inherited* style regardless of selector specificity. Use a descendant `*` selector (or target the anchor explicitly) to force the colour onto the anchor directly.

**Branch:** `fix/dark-theme-notifications-popover` (off main).

---

## Session: 2026-05-14 — Dark Theme Background Image Cascade

### Problem

User uploaded a body background image at *Site admin → Boost → Background image* and purged caches, but the image did not render. Inspection showed `body { background-image: url(...) }` was present in the computed style, but a higher-priority `!important` rule on the page wrappers was painting over it.

### Root Cause

`lib/scss-generator.ts` emitted, inside the dark-theme branch, two rules that cover the entire viewport:

- L481-486: `#page, #page-wrapper, #topofscroll, .main-inner, #region-main-box, .pagelayout-standard #page.drawers { background-color: pageBg !important; }`
- L793-796: `.course-content, #region-main, #page-content { background-color: pageBg !important; ... }`

Both `#page-wrapper` and `#page-content` are full-viewport ancestors of `<body>` in the Boost DOM. Painting them with `!important` hides any uploaded body background image. The `body#page-login-index { background-color: ... !important }` rule did the same to the login background image.

### Fix

Branched the three rules on `tokens.backgroundImage` / `tokens.loginBgImage`:

| Rule | No image (default) | Image set |
|---|---|---|
| Page wrappers | All wrappers painted | Only `.main-inner, #region-main-box` painted; outer wrappers omitted |
| Course content | All three painted | `#page-content` dropped; only `bodyText` colour kept on `.course-content, #region-main` |
| Login body | Painted with `loginBg` | Omitted |

### Verification

Wrote an ad-hoc tsx script that runs `generateScss` against the `cfa-dark-lime` preset twice (with/without `backgroundImage`) and asserts the expected selectors appear or don't appear. All four cases pass. Script removed from final diff (it was scaffolding).

### Files Modified

- `lib/scss-generator.ts` — three branched rule blocks
- `docs/moodle-cloud-constraints.md` — new "Dark Theme: Body Background Image Cascade" section
- `docs/PROJECT-TRACKER.md` — this entry

### Lesson

When a generator emits `!important` page-wrapper backgrounds for "no white gaps", remember those wrappers cover ANY body background — colour or image. Either branch on whether an image is in use, or only paint inner panels (which are still covered by cards) and let the outer wrappers stay transparent.

### Branch

`worktree-fix-bg-image-cascade` (off main).

---

## Session: 2026-05-15 — Switch background-image cascade to unconditional

### Problem

The conditional fix from yesterday (branching on `tokens.backgroundImage` / `tokens.loginBgImage`) worked only when the user uploaded the image inside the Sandbox controls panel. Users typically upload directly to Moodle and skip the Sandbox upload — so the conditional never fired and the SCSS still hid the image. Hit twice in one session: first for the site background, then again for the login background.

A second bug surfaced during the login investigation: even when the body fill rule was correctly skipped, `#page-content` (a full-viewport child of `#page`, painted with `pageBg !important`) was covering Moodle's login image painted on `#page`. The original conditional only dropped `#page-content` for the site image case, not the login image case.

### Root Cause

The conditional approach assumed Sandbox state matched Moodle state, which it never does — the Sandbox has no way to know what's been uploaded directly to Moodle. The empirical test (purging Raw SCSS made both images appear) proved the page-wrapper painting was redundant defensive styling rather than a structural necessity: `body` has `$body-bg` from Block 1 and shows `pageBg` through transparent wrappers anyway.

### Fix

Removed the conditionals on `tokens.backgroundImage`. The wrapper rule and the content rule now emit unconditionally without the outer wrappers and without `#page-content`:

| Rule | Before (conditional) | After (unconditional) |
|---|---|---|
| Wrappers | Full list painted unless `backgroundImage` set | Only `.main-inner, #region-main-box` painted, always |
| Content | `#page-content` painted unless `backgroundImage` set | `#page-content` dropped, always |
| Login body fill | Painted unless `loginBgImage` set | Unchanged — still conditional on `loginBgImage` (controls custom login colour, doesn't actually hide the image) |

### Why this is safe

- No-image dark theme: `body` shows `$body-bg = pageBg` via Block 1 cascade, identical visual result to the old painted wrappers.
- Light themes: untouched (whole block sits inside `if (darkMode)`).
- Custom `pageBg`: `$body-bg` already emitted, no change.
- Custom `loginBg` colour without login image: still works — that conditional preserved.

### Verification

Re-wrote the verification script to cover all four scenarios (no images, site only, login only, both) plus a sanity check that `$body-bg` is emitted in Block 1. All five pass. Build clean. Script removed from diff.

### Lesson

If a generator's conditional depends on state the generator can't reliably observe (e.g., Sandbox tokens that mirror externally-uploaded files), the conditional will silently fail. Prefer structural fixes that work in all states. Defensive styling that's only proven necessary in hypothetical scenarios is usually deletable.

### Branch

`worktree-fix-bg-image-cascade` (off main, continued from yesterday's session).
