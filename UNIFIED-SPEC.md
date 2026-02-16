# CFA Brand Sandbox — Unified Specification v1.0

> **Purpose:** A simple, client-side web app that lets non-technical CFA admins preview colour and layout changes on a realistic Moodle replica, check accessibility, and export ready-to-paste SCSS for Moodle Cloud.
>
> **Workflow:** Pick colours → See live preview → Check contrast → Copy SCSS → Paste into Moodle → Done.

---

## 1. Constraints: What Moodle Cloud Actually Allows

The CFA Moodle site is hosted on **Moodle Cloud** (Boost theme only). This tool must only generate output that works within these constraints.

### Available Settings

| Moodle Cloud Setting | Admin Path | What It Accepts |
|---|---|---|
| Brand colour | `Site admin → Appearance → Themes → Boost → General settings` | Single hex value — propagates via `$brand-primary` / `$primary` |
| Background image | `Site admin → Appearance → Themes → Boost → General settings` | File upload (JPG/PNG) |
| Login background image | `Site admin → Appearance → Themes → Boost → General settings` | File upload |
| Raw initial SCSS | `Site admin → Appearance → Themes → Boost → Advanced settings` | SCSS variable declarations (compiled BEFORE Boost's SCSS) |
| Raw SCSS | `Site admin → Appearance → Themes → Boost → Advanced settings` | CSS/SCSS rule overrides (compiled AFTER Boost's SCSS) |
| Logos | `Site admin → Appearance → Logos` | Full logo, compact logo (navbar), favicon — file uploads |
| Site name | `Site admin → General → Site home settings` | Text field |
| Purge caches | `Site admin → Development → Purge all caches` | Required after SCSS changes (auto-purges on save, manual as fallback) |

### Not Available on Moodle Cloud
- Cannot install custom themes (Boost only)
- Cannot install plugins
- Cannot access file system / modify PHP or templates
- Cannot control Moodle version (auto-upgraded — likely running Moodle 5.x)
- Some admin settings locked ("Defined in config.php")

### Critical Technical Detail: $primary Propagation
When a user sets the **Brand colour** in Moodle, it maps to `$brand-primary` which feeds into Bootstrap's `$primary`. This single variable automatically propagates to:
- `.btn-primary` background
- Link colours (`$link-color` defaults to `$primary`)
- Focus ring colours
- Progress bar fills
- Active navigation states
- Checkbox/radio accent colours
- Dropdown active items

This propagation behaviour is the **most important thing** the sandbox must replicate accurately.

### Bootstrap 5 Migration Warning
Moodle 5.0+ migrates from Bootstrap 4 to Bootstrap 5. SCSS variables (`$primary`, `$body-bg`, etc.) still work. However, some utility class names change (e.g. `.ml-*` → `.ms-*`). CSS selectors in the export should be tested against the current Moodle Cloud version. The admin should verify their Moodle version at `Site admin → Notifications`.

---

## 2. CFA Brand Style Guide Reference

### Colour Palette (8 official colours)

| Name | Hex | PMS | Role |
|---|---|---|---|
| Charcoal | `#404041` | Cool Gray 11 C | Primary text, dark backgrounds |
| Light Grey | `#F0EEEE` | Cool Gray 1 C | Light backgrounds, subtle fills |
| Orange | `#F27927` | 151 C | Primary accent, CTAs, highlighted keywords |
| Purple | `#B500B5` | 253 C | Secondary accent |
| Sky Blue | `#00BFFF` | 306 C | Links, interactive elements |
| Teal | `#336E7B` | 5473 C | Brand primary, buttons, headings |
| Lime Green | `#BAF73C` | 389 C | Highlights, success states |
| Red | `#F64747` | 1787 C | Alerts, errors, emphasis |

### Typography
- **Brand font:** Source Sans Pro (Bold for headings, Regular for body)
- Moodle Boost default font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- The sandbox should include "Source Sans Pro" as a font option alongside system defaults

### Logo System
- Format: "CENTRE FOR" (charcoal `#404041`) + "ACCESSIBILITY" (colour — typically red `#F64747` on light backgrounds)
- On dark backgrounds: "CENTRE FOR" in white, "ACCESSIBILITY" in various brand colours (orange, teal, sky blue, lime green, purple)
- Byeline: "Celebrating an inclusive world"
- On the Moodle site navbar: Small red square icon + stacked text "Centre for" / "Accessibility" with "AUSTRALIA" in small red text below

### Layout Elements
- **Decorative motif:** Multi-colour square mosaic/pixel pattern using brand palette colours — used in banners, business cards, and event materials as corner/edge decoration
- **Banner pattern:** Bold heading with accent keyword in a brand colour (e.g. "Celebrating an **inclusive** world" where "inclusive" is in Purple `#B500B5`), three-column body text below, mosaic pattern on right edge
- **Light banners:** `#F0EEEE` background, charcoal text
- **Dark banners:** `#404041` background, white text, coloured keywords

---

## 3. Architecture

### Principles
- **Client-side only** — no backend, no database, no authentication
- **Zero dependency on live Moodle** — static HTML/CSS replica
- **localStorage** for saving configurations (survives page refresh)
- **Instant feedback** — all changes reflect in < 100ms via CSS custom properties

### Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 14+ (App Router) | Static export, fast loading, Vercel deployment |
| UI | React 18+ | Component-based preview rendering |
| Styling | Tailwind CSS (tool UI) + CSS Custom Properties (preview) | Tailwind for controls; CSS vars for Moodle replica |
| State | Zustand + zustand-temporal | Token store with undo/redo (50-step history) |
| Hosting | Vercel | Zero-config static deployment |
| Persistence | localStorage | No backend needed |

### File Structure

```
app/
  layout.tsx                  — Root layout, font imports
  page.tsx                    — Main three-panel layout
  globals.css                 — Tailwind directives, global resets
components/
  Toolbar.tsx                 — Sticky top toolbar (undo/redo/reset/save/export)
  PanelLayout.tsx             — Three-panel responsive container
  controls/
    ControlsPanel.tsx         — Left sidebar wrapper with accordion sections
    AccordionSection.tsx      — Collapsible section
    ColourPicker.tsx          — Swatch + hex input + popover + CFA palette row
    SliderControl.tsx         — Labelled range slider
    SelectControl.tsx         — Labelled dropdown
  preview/
    PreviewPanel.tsx          — Centre panel wrapper
    PreviewToolbar.tsx        — Page tabs + viewport toggle + zoom
    MoodleShell.tsx           — CSS variable container wrapping all pages
    MoodleNavbar.tsx          — Shared navbar
    DashboardPage.tsx         — Dashboard replica
    CoursePage.tsx            — Course page replica with drawer
    LoginPage.tsx             — Login page replica
    CourseCard.tsx            — Reusable course card
    CourseDrawer.tsx          — Left course index drawer
    ActivityRow.tsx           — Activity item row
    SecondaryNav.tsx          — Secondary navigation tabs
  audit/
    AuditPanel.tsx            — Right sidebar wrapper
    ScoreBadge.tsx            — Circular percentage ring
    ContrastCard.tsx          — Single colour pair check with ratio
  export/
    ExportSection.tsx         — Two-block SCSS export + copy buttons
    MoodlePaths.tsx           — Collapsible admin path reference
    ScssPreview.tsx           — Code block with generated SCSS
  SaveLoadBar.tsx             — Save/load configs (localStorage)
  Toast.tsx                   — Toast notification
lib/
  accessibility.ts            — WCAG contrast ratio + suggestions
  scss-generator.ts           — Token → two-block SCSS generation
  moodle-paths.ts             — Control → Moodle admin path mapping
  tokens.ts                   — Default values, types, CFA palette
store/
  theme-store.ts              — Zustand store with temporal undo/redo
```

---

## 4. Global Layout

Fixed viewport, no page-level scrolling. Three panels + sticky toolbar. Each panel scrolls independently.

```
┌────────────────────────────────────────────────────────────────────────┐
│  TOOLBAR — sticky, h-14, bg-[#404041], text-white, z-50               │
│  Left: CFA logo + "CFA Brand Sandbox"                                 │
│  Right: [Undo] [Redo] [Reset] | [Save] [Export SCSS]                  │
├───────────────┬──────────────────────────────────┬─────────────────────┤
│ LEFT PANEL    │ CENTRE PANEL                     │ RIGHT PANEL         │
│ Controls      │ Live Moodle Preview              │ Audit & Export      │
│ w-[300px]     │ flex-1                           │ w-[320px]           │
│ bg-[#f8f9fa]  │ bg-[#e5e7eb] (canvas)            │ bg-[#f8f9fa]        │
│ overflow-y    │ overflow-y                       │ overflow-y          │
│ auto          │ auto                             │ auto                │
│ border-r      │                                  │ border-l            │
└───────────────┴──────────────────────────────────┴─────────────────────┘
```

### Toolbar
- **Background:** CFA Charcoal `#404041`
- **Left:** CFA logo (small red square icon) + "CFA Brand Sandbox" in white, bold, Source Sans Pro
- **Right buttons** (small, ~32px height):
  - Undo (arrow icon) — disabled state when nothing to undo
  - Redo (arrow icon) — disabled state when nothing to redo
  - Reset — text button, restores all defaults
  - Divider (thin vertical line)
  - Save — outlined white button
  - Export SCSS — solid CFA Orange `#F27927` button, white text, bold — primary CTA

### Responsive Behaviour
- **1440px+**: All three panels visible
- **768–1439px**: Left and right panels collapse to toggle-able drawers. Preview fills width.
- **<768px**: Single panel view with bottom tab bar: Controls | Preview | Audit

### Keyboard Shortcuts
| Shortcut | Action |
|---|---|
| Ctrl + Z | Undo |
| Ctrl + Y | Redo |
| Ctrl + S | Save configuration |
| Ctrl + E | Open export panel |
| Escape | Close modals/popovers |

---

## 5. Centre Panel — Live Moodle Replica

This is the most important part. It must faithfully replicate the EXACT layout from the real CFA Moodle Cloud site. It is NOT a generic mockup — it must look like the real Moodle Boost site as shown in the reference screenshots.

### Preview Toolbar (inside centre panel, sticky top)
- **Page tabs:** `Dashboard` (default) | `Course Page` | `Login Page`
  - Three tabs — the key pages admins need to preview
  - Styled as pill/underline tabs
- **Viewport toggle:** Desktop (100%) | Tablet (768px) | Mobile (375px)
  - Tablet/mobile: constrain preview to that max-width with visible device outline, centred
- **Zoom:** Dropdown — 50% | 75% | 100% | 125%. Applies `transform: scale()`.

### Preview Container
A `<div>` that sets all CSS custom properties on its `style` attribute, read from the Zustand store. All child components inherit these variables.

```css
background-color: var(--cfa-page-bg);
font-family: var(--cfa-font-family);
font-size: var(--cfa-body-font-size);
line-height: var(--cfa-line-height);
```

### Brand Colour Propagation Logic (CRITICAL)
When the user changes **Brand Colour** in the controls, the following tokens must ALL update to match, UNLESS the user has explicitly overridden them to a different value:

- `--cfa-btn-primary-bg` → matches brand primary
- `--cfa-link-colour` → matches brand primary
- `--cfa-nav-active-underline` → matches brand primary
- `--cfa-secondary-nav-active` → matches brand primary
- `--cfa-progress-fill` → matches brand primary
- `--cfa-focus-ring` → matches brand primary
- `--cfa-login-btn-bg` → matches brand primary

Implementation: In the Zustand store, when `brandPrimary` changes, check each linked token — if it still equals the OLD brand value (user hasn't manually overridden it), update it to the new value. If the user has manually set a different value, leave it alone.

This mirrors how Moodle's `$primary` variable propagates through Bootstrap compilation.

---

### PAGE 1: DASHBOARD (default view)

Must match the reference screenshot (`Moodle Home Page Sample.png`) exactly.

#### Navbar (top, full-width, ~56px height)
- **Background:** `var(--cfa-navbar-bg)` default `#FFFFFF`
- **Bottom border:** 1px solid `#dee2e6`
- **Left section:**
  - CFA logo: Small red square icon (16x16) + "Centre for" (line 1) + "Accessibility" (line 2, bold) in `var(--cfa-navbar-text)` default `#404041`, with "AUSTRALIA" in small red `#F64747` text below
  - Nav links (~14px, regular weight): "Home" | "Dashboard" | "My courses" | "Site administration" | "Visit us"
  - Link colour: `var(--cfa-navbar-text)` default `#404041`
  - **Active link ("Dashboard"):** 3px bottom border in `var(--cfa-nav-active-underline)` default matches `brandPrimary`
  - Generous horizontal spacing (~20px gap)
- **Right section:**
  - Bell icon (notifications) + Chat icon
  - "Active Users" with thin progress bar below
  - "Storage" with thin progress bar below
  - User avatar: grey circle with person silhouette + dropdown caret
- All icons `var(--cfa-navbar-text)` colour, ~18px

#### Main Content Area
- **Background:** `var(--cfa-page-bg)` default `#f5f5f5`
- **Content centred:** `max-width: var(--cfa-content-max-width)` default `830px`, `margin: 0 auto`, `padding: 24px 16px`

##### Heading Section
- **"Dashboard"** — Bold, ~28px, `var(--cfa-heading-text)` default `#1d2125`
- **"Hi, Scott!"** with wave emoji — ~22px, slightly lighter weight

##### Trial Banner
- Rounded card with 4px left border in `var(--cfa-info)` default matches `brandPrimary`
- Background: `var(--cfa-alert-info-bg)` default `#e7f3fe`
- Text: "Your free trial ends in **24 days**. You can upgrade to a paid plan in the MoodleCloud customer portal."
- Right: "Upgrade" button in `var(--cfa-btn-primary-bg)`, white text, rounded pill

##### Course Overview Section
- **"Course overview"** heading — ~18px, bold
- **Filter bar:** "All" dropdown | Search input | "Sort by course name" dropdown | "Card" view dropdown
- **Course cards** (2 per row, ~50% width each, 16px gap):

**Card 1:**
- Image: Dark navy gradient `#1a1a4e` with "Website Accessibility" text, three coloured circle icons
- Title: "Web Accessibility Compliance SC" in `var(--cfa-link-colour)`
- Category: "Accessibility Training" in `var(--cfa-muted-text)` `#6c757d`
- Footer: "0% complete", empty progress bar, three-dot menu

**Card 2:**
- Image: Grey/blue gradient placeholder
- Title: "Starting with Moodle" in `var(--cfa-link-colour)`
- Category: "Accessibility Training"
- Badge: "Hidden from students" green pill `#0f7b5f`
- Footer: "0% complete", empty progress bar, three-dot menu

Cards: 1px border `var(--cfa-card-border)` `#dee2e6`, border-radius 6px, white background `var(--cfa-card-bg)`

---

### PAGE 2: COURSE PAGE

Must match `Moodle Course Page Sample.png`. Shows "Web Accessibility Compliance SC" course.

#### Same navbar as dashboard (no active underline, or "My courses" active)

#### Course Index Drawer (left side, ~160px wide)
- Close button (X) top-left, three-dot menu top-right
- Background: `var(--cfa-drawer-bg)` default `#FFFFFF`
- Right border: 1px solid `var(--cfa-drawer-border)` `#dee2e6`
- Collapsible section groups with circle indicators (○) for incomplete items:

```
▼ General (expanded)
  Welcome, Introductions, ○ Reflections, ○ General Discussion,
  Aims & Objectives, Graduate Qualities

○ Teleconference recordings
  Resources, Contacts, Acknowledgements, Evaluation, News forum

▼ Modules (expanded)
  Modules, Module 1: Why should you car..., Module 2: W3C accessibility st...,
  Module 3: Essential WCAG tec..., Module 4: Advanced WCAG te...,
  Module 5: Authoring Tool Acce..., Module 6: Evaluation and futur...

○ Level A quick tips

▼ Assessments
  Key Dates, ○ Assignment 1, ○ Assignment 1 Project Analy... 🔒,
  Assignment One Mark Sheet (..., ○ Assignment 2
```

- Items ~13px, truncated with ellipsis, scrolls independently

#### Course Title
- **"Web Accessibility Compliance SC"** — Bold, ~28px, `var(--cfa-heading-text)`

#### Secondary Navigation Tabs
- **"Course"** (active) — 3px bottom border in `var(--cfa-secondary-nav-active)`
- **"Settings"** — displayed in `var(--cfa-link-colour)` (blue, distinct from other tabs)
- **"Participants"** | **"Grades"** | **"Activities"** — `var(--cfa-secondary-nav-text)` `#404041`
- **"More ▾"** — dropdown for overflow items
- ~14px, generous spacing (~24px gap)

#### Course Content
White card container with collapsible sections. Activity items as stacked rows (~48px each):
- Left: Small coloured square icon (28x28, rounded). Pages = teal `#0f7b5f` with document icon. Forums = teal with speech bubble icon.
- Centre: Activity name as link in `var(--cfa-link-colour)`
- Right: Optional "To do ▾" dropdown or group icon

General section items: Welcome, Introductions, Reflections, General Discussion, Aims & Objectives, Graduate Qualities.

Hidden section banner: Grey "Hidden from students" badge + "Teleconference recordings" text + "Mark as done" button.

---

### PAGE 3: LOGIN PAGE

Must match `Moodle Login Page Sample.png`. No navbar — standalone full-page form.

- **Background:** `var(--cfa-login-bg)` default `#e8eaed`
- **Centred login card** (max-width ~480px, vertically + horizontally centred):
  - Background: `var(--cfa-login-card-bg)` default `#FFFFFF`
  - Border-radius: 12px, box-shadow: `0 2px 16px rgba(0,0,0,0.08)`, padding: 40px

**Login Section:**
- Heading: "Log in to CFA Learning Portal" — `var(--cfa-login-heading)` default `#1d2125`, ~26px, bold, left-aligned
- Username input: Full width, pill shape (border-radius: `var(--cfa-login-input-radius)` default 24px), placeholder "Username or email"
- Password input: Same style, placeholder "Password"
- "Log in" button: Compact, left-aligned, `var(--cfa-login-btn-bg)`, `var(--cfa-login-btn-text)`, border-radius 6px
- "Lost password?" link in `var(--cfa-link-colour)`

**Divider:** 1px solid `#dee2e6`

**Signup Section:**
- "Is this your first time here?" — bold, ~20px
- Body text about creating an account
- "Create new account" button — `var(--cfa-signup-btn-bg)` default `#404041`, white text

**Footer:** Language selector + "Cookies notice" pill + "Cookie Settings" link

---

## 6. Left Panel — Controls

Scrollable sidebar with collapsible accordion sections. Each section has a chevron toggle.

### Colour Picker Component (reusable)
Every colour input renders as:
1. Colour swatch square (24x24, rounded 4px)
2. Editable hex text input (`#XXXXXX`)
3. On swatch click: popover colour picker with:
   - Standard colour spectrum picker
   - **CFA Brand Palette row:** `#F27927` (Orange), `#336E7B` (Teal), `#404041` (Charcoal), `#BAF73C` (Green), `#00BFFF` (Blue), `#F64747` (Red), `#B500B5` (Purple), `#F0EEEE` (Light Grey), `#FFFFFF` (White), `#1d2125` (Near Black)
   - Clicking a swatch applies immediately
4. If colour is NOT in CFA palette → amber "Off-brand" badge
5. Below picker: small grey italic Moodle path tooltip (e.g., "→ Boost → Advanced → Raw SCSS")

### Control Sections

**Section 1: Brand Colour** (default expanded)
- **Brand Colour (Primary):** colour picker, default `#0f6cbf` (Moodle default)
  - Moodle path: `Boost → General → Brand colour` (sets `$primary`)
  - This is the most powerful setting — propagates everywhere
  - **Quick-apply preset:** "Apply CFA Brand" button → sets brand to `#336E7B` (Teal) and cascades
- Logo: Upload placeholder (non-functional, shows "Replace Logo")

**Section 2: Navigation Bar**
- Background: colour picker, default `#FFFFFF`
  - Moodle path: `Boost → Advanced → Raw SCSS` (selector: `.navbar.fixed-top`)
  - Note: Navbar bg is NOT controlled by `$primary` — requires explicit CSS override with `!important`
- Text / Link Colour: colour picker, default `#404041`
- Active Tab Underline: colour picker, default matches `brandPrimary`

**Section 3: Buttons**
- Primary Background: colour picker, default matches `brandPrimary`
  - If same as Brand Colour: automatically handled by `$primary`. If different: needs Raw SCSS override.
- Primary Text: colour picker, default `#FFFFFF`
- Hover Background: colour picker, default (auto-darken 15% from primary)
- Border Radius: slider 0–24px, default 4px

**Section 4: Login Page**
- Page Background: colour picker, default `#e8eaed`
  - Moodle path: `Boost → Advanced → Raw SCSS` (selector: `body#page-login-index`)
- Card Background: colour picker, default `#FFFFFF`
- Heading Colour: colour picker, default `#1d2125`
- Input Border Radius: slider 4–30px, default 24px
- Login Button Background: colour picker, default matches `brandPrimary`
- Login Button Text: colour picker, default `#FFFFFF`
- Signup Button Background: colour picker, default `#404041`

**Section 5: Typography**
- Font Family: dropdown — "System Default (Moodle)" | "Source Sans Pro (CFA Brand)" | "Open Sans" | "Roboto" | "Inter"
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$font-family-sans-serif`)
- Body Font Size: slider 12–22px, default 14px
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$font-size-base`)
- Heading Scale: dropdown — "Minor Third (1.2)" | "Major Third (1.25)" | "Perfect Fourth (1.333)"
- Line Height: slider 1.0–2.5, step 0.1, default 1.5
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$line-height-base`)

**Section 6: Content Area**
- Page Background: colour picker, default `#f5f5f5`
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$body-bg`)
- Card Background: colour picker, default `#FFFFFF`
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$card-bg`)
- Card Border: colour picker, default `#dee2e6`
- Content Max Width: slider 600–1400px, default 830px
- Link Colour: colour picker, default matches `brandPrimary`
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$link-color`)
- Link Hover Colour: colour picker, default (auto-darken 20% from link colour)

**Section 7: Footer**
- Background: colour picker, default `#FFFFFF`
  - Moodle path: `Boost → Advanced → Raw SCSS` (selector: `#page-footer`)
- Text Colour: colour picker, default `#404041`
- Link Colour: colour picker, default matches `brandPrimary`

**Section 8: Alerts & Progress**
- Success: colour picker, default `#0f7b5f`
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$success`)
- Warning: colour picker, default `#f0ad4e`
- Error: colour picker, default `#d9534f`
- Info: colour picker, default matches `brandPrimary`
- Progress Bar Fill: colour picker, default matches `brandPrimary`

### How Controls Map to Moodle (Three Mechanisms)

| Mechanism | Moodle Field | What It Controls | Reliability |
|---|---|---|---|
| **Brand colour setting** | Boost → General → Brand colour | Sets `$brand-primary` / `$primary`. Single hex field. | 100% — native setting |
| **SCSS variables** | Boost → Advanced → Raw initial SCSS | `$primary`, `$link-color`, `$body-bg`, `$body-color`, `$font-family-sans-serif`, `$font-size-base`, `$line-height-base`, `$card-bg`, `$success`, `$warning`, `$danger`, `$info` | 99% — compiled by Moodle's SCSS engine |
| **CSS rule overrides** | Boost → Advanced → Raw SCSS | Navbar bg/text, login page, secondary nav, drawers, footer — anything not covered by variables | 95% — verified selectors, may shift on major Moodle updates |

---

## 7. Right Panel — Audit & Export

### A. Accessibility Score Badge
Circular progress ring (120px diameter). Percentage of passing checks. Green > 90%, amber 70–90%, red < 70%.

### B. Contrast Check Cards
Vertical list of colour pair checks. Each card shows:

**Passing:**
```
[fg swatch] [bg swatch]  Navbar Text
Ratio: 12.7 : 1
[AA ✓ green] [AAA ✓ green]
```

**Failing:**
```
[fg swatch] [bg swatch]  Link on Page   ← red left border
Ratio: 2.8 : 1
[AA ✗ red] [AAA ✗ grey]
Suggestion: #0d5ca3 (4.6:1) [Apply]
```

**Pairs to check (real-time):**
1. Navbar Text on Navbar Background
2. Button Text on Button Background
3. Body Text on Page Background
4. Link Colour on Page Background
5. Link Colour on Card Background
6. Login Heading on Login Card Background
7. Login Button Text on Login Button Background
8. Muted Text (`#6c757d`) on Page Background
9. Muted Text on Card Background
10. Heading Text on Page Background

**WCAG contrast algorithm:**
```typescript
function getRelativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const [R, G, B] = [r, g, b].map(c =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function getContrastRatio(fg: string, bg: string): number {
  const L1 = Math.max(getRelativeLuminance(fg), getRelativeLuminance(bg));
  const L2 = Math.min(getRelativeLuminance(fg), getRelativeLuminance(bg));
  return (L1 + 0.05) / (L2 + 0.05);
}
```
AA pass = ratio >= 4.5 (normal text), >= 3.0 (large text 18px+). AAA pass = ratio >= 7.0.

**Suggestion algorithm:** When a pair fails, check CFA palette colours against the background. Pick nearest passing colour. If no brand colour passes, darken/lighten original until 4.5:1 reached. "Apply" button sets the value.

### C. Additional Checks
- ✓ / ✗ "Body text >= 16px" — checks font size value
- ✓ / ✗ "Line height >= 1.5" — checks line height value
- ✓ "Focus indicators visible"

---

### D. SCSS Export Section

**CRITICAL: The export generates TWO separate code blocks**, matching the two SCSS input fields in Moodle. The admin must paste each block into the correct field.

#### Step-by-Step Instructions (always visible)
A numbered instruction card:
1. **Set Brand colour:** Go to `Site admin → Appearance → Themes → Boost → General settings → Brand colour` and enter `{brandPrimary}`.
2. **Paste Raw initial SCSS:** Go to `Site admin → Appearance → Themes → Boost → Advanced settings → Raw initial SCSS` and paste Block 1 below.
3. **Paste Raw SCSS:** On the same page, paste Block 2 into `Raw SCSS`.
4. **Upload logos:** Go to `Site admin → Appearance → Logos` to upload logo, compact logo, and favicon.
5. **Purge caches:** Go to `Site admin → Development → Purge all caches` (usually auto-purges on save, but do this as a fallback).

#### Moodle Admin Paths Reference (collapsible)
Full mapping from each control to its exact Moodle location — same as listed in the Controls section.

#### Export Buttons
- **"Copy All to Clipboard"** — Primary button, CFA Orange `#F27927`, full width. Copies both blocks with labels. Toast: "Copied! Follow the paste instructions above."
- **"Copy Block 1 (Variables)"** — Secondary, half width
- **"Copy Block 2 (Overrides)"** — Secondary, half width
- **"Download .scss"** — Outline button, full width. Downloads `cfa-moodle-theme.scss`

#### SCSS Code Preview (two tabbed panels)

**Tab 1: "Raw initial SCSS" (Variables)**
Label: "Paste into: Site admin → Appearance → Themes → Boost → Advanced settings → Raw initial SCSS"

```scss
/* ================================================
   CFA Moodle Theme — SCSS Variables
   Generated by CFA Brand Sandbox
   Date: {ISO timestamp}
   ================================================
   PASTE INTO: Raw initial SCSS
   (Site admin → Appearance → Themes → Boost → Advanced settings)
   ================================================ */

/* --- BRAND / BOOTSTRAP OVERRIDES --- */
$primary: {brandPrimary};
$link-color: {linkColour};
$body-bg: {pageBg};
$body-color: {bodyText};
$font-family-sans-serif: {fontFamily};
$font-size-base: {bodyFontSize / 16}rem;
$line-height-base: {lineHeight};
$card-bg: {cardBg};
$card-border-color: {cardBorder};
$border-color: {cardBorder};
$input-focus-border-color: {brandPrimary};
$breadcrumb-bg: transparent;

/* --- ALERT COLOURS --- */
$success: {success};
$warning: {warning};
$danger: {error};
$info: {info};
```

**Tab 2: "Raw SCSS" (Custom Rules)**
Label: "Paste into: Site admin → Appearance → Themes → Boost → Advanced settings → Raw SCSS"

```scss
/* ================================================
   CFA Moodle Theme — Custom CSS Overrides
   Generated by CFA Brand Sandbox
   Date: {ISO timestamp}
   ================================================
   PASTE INTO: Raw SCSS
   (Site admin → Appearance → Themes → Boost → Advanced settings)
   ================================================ */

/* --- NAVBAR --- */
.navbar.fixed-top {
  background-color: {navbarBg} !important;
  border-bottom: 1px solid {navbarBorder};
}
.navbar.fixed-top .nav-link,
.navbar.fixed-top .navbar-brand {
  color: {navbarText} !important;
}

/* --- PRIMARY BUTTONS --- */
/* Only included if button colour differs from $primary */
.btn-primary {
  background-color: {btnPrimaryBg} !important;
  border-color: {btnPrimaryBg} !important;
  color: {btnPrimaryText} !important;
  border-radius: {btnRadius}px;
}
.btn-primary:hover,
.btn-primary:focus,
.btn-primary:active {
  background-color: {btnPrimaryHover} !important;
  border-color: {btnPrimaryHover} !important;
}

/* --- LOGIN PAGE --- */
body#page-login-index {
  background-color: {loginBg} !important;
}
body#page-login-index .login-container {
  background-color: {loginCardBg};
  border-radius: 12px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.08);
}
body#page-login-index .login-heading {
  color: {loginHeading} !important;
}
body#page-login-index .login-form input[type="text"],
body#page-login-index .login-form input[type="password"] {
  border-radius: {loginInputRadius}px;
  padding: 14px 20px;
}
body#page-login-index #loginbtn {
  background-color: {loginBtnBg} !important;
  border-color: {loginBtnBg} !important;
  color: {loginBtnText} !important;
  border-radius: 6px;
}

/* --- SECONDARY NAVIGATION (Moodle 4.x+ course tabs) --- */
.secondary-navigation .nav-tabs .nav-link.active {
  border-bottom-color: {secondaryNavActive} !important;
}

/* --- COURSE CARDS --- */
.card.dashboard-card {
  background-color: {cardBg};
  border-color: {cardBorder};
}

/* --- DRAWERS / SIDEBARS --- */
.drawer {
  background-color: {drawerBg};
  border-color: {drawerBorder};
}

/* --- FOOTER --- */
#page-footer {
  background-color: {footerBg};
  color: {footerText};
}
#page-footer a {
  color: {footerLink};
}

/* --- ALERTS --- */
.alert-info {
  background-color: {alertInfoBg};
  border-left: 4px solid {info};
}

/* --- PROGRESS BARS --- */
.progress-bar {
  background-color: {progressFill} !important;
}

/* --- CONTENT MAX WIDTH --- */
#page.drawers .main-inner {
  max-width: {contentMaxWidth}px;
}

/* ================================================
   AFTER PASTING: Purge all caches!
   Site admin → Development → Purge all caches
   ================================================ */
```

#### Smart Export Logic
- If `btnPrimaryBg` equals `brandPrimary`: omit button section with comment "Button section omitted — $primary handles .btn-primary"
- If `navbarBg` is `#FFFFFF` (Moodle default): omit navbar section with comment "Navbar section omitted — using Moodle default"
- If `loginBg` is `#e8eaed` (default): omit login background override
- Keep exported SCSS minimal — only include overrides for values that differ from Moodle defaults

#### Reminder Banner
Amber info box below export: **"After pasting into Moodle, purge caches for changes to take effect:** `Site admin → Development → Purge all caches`"

#### Accuracy Note (collapsible)
"**How accurate is this?** The Raw initial SCSS variables (`$primary`, `$link-color`, etc.) are compiled by Moodle's own SCSS engine — 99% accurate. The Raw SCSS rules use verified selectors tested against Moodle Cloud (Boost theme). Selectors may need updating after major Moodle version upgrades. Check your Moodle version at `Site admin → Notifications`."

---

## 8. CSS Custom Properties — Complete Token List

These are set on the preview container's `style` attribute. All defaults match Moodle Boost out-of-the-box state.

```css
/* Navbar */
--cfa-navbar-bg: #FFFFFF;
--cfa-navbar-text: #404041;
--cfa-navbar-border: #dee2e6;
--cfa-nav-active-underline: #0f6cbf;     /* linked to brandPrimary */

/* Brand */
--cfa-brand-primary: #0f6cbf;             /* THE key variable */

/* Buttons */
--cfa-btn-primary-bg: #0f6cbf;            /* linked to brandPrimary */
--cfa-btn-primary-text: #FFFFFF;
--cfa-btn-primary-hover: #0d5ca3;
--cfa-btn-radius: 4px;

/* Login Page */
--cfa-login-bg: #e8eaed;
--cfa-login-card-bg: #FFFFFF;
--cfa-login-heading: #1d2125;
--cfa-login-btn-bg: #0f6cbf;              /* linked to brandPrimary */
--cfa-login-btn-text: #FFFFFF;
--cfa-login-input-radius: 24px;
--cfa-signup-btn-bg: #404041;

/* Typography */
--cfa-body-font-size: 14px;
--cfa-heading-scale: 1.25;
--cfa-line-height: 1.5;
--cfa-font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--cfa-heading-text: #1d2125;
--cfa-body-text: #404041;
--cfa-muted-text: #6c757d;

/* Content Area */
--cfa-page-bg: #f5f5f5;
--cfa-card-bg: #FFFFFF;
--cfa-card-border: #dee2e6;
--cfa-content-max-width: 830px;
--cfa-link-colour: #0f6cbf;               /* linked to brandPrimary */
--cfa-link-hover: #0a4b8c;

/* Secondary Navigation */
--cfa-secondary-nav-active: #0f6cbf;      /* linked to brandPrimary */
--cfa-secondary-nav-text: #404041;

/* Drawers / Sidebars */
--cfa-drawer-bg: #FFFFFF;
--cfa-drawer-border: #dee2e6;

/* Footer */
--cfa-footer-bg: #FFFFFF;
--cfa-footer-text: #404041;
--cfa-footer-link: #0f6cbf;               /* linked to brandPrimary */

/* Alerts & States */
--cfa-success: #0f7b5f;
--cfa-warning: #f0ad4e;
--cfa-error: #d9534f;
--cfa-info: #0f6cbf;                       /* linked to brandPrimary */
--cfa-alert-info-bg: #e7f3fe;

/* Progress */
--cfa-progress-bg: #e9ecef;
--cfa-progress-fill: #0f6cbf;             /* linked to brandPrimary */

/* Focus */
--cfa-focus-ring: #0f6cbf;                /* linked to brandPrimary */
```

**Note on defaults:** These are Moodle Boost defaults, NOT CFA brand colours. The sandbox starts in the "current Moodle state" so the admin can see what they're changing FROM. The CFA brand palette is available as quick-apply swatches and the "Apply CFA Brand" preset button.

---

## 9. Zustand Store

```typescript
interface ThemeTokens {
  // Navbar
  navbarBg: string;
  navbarText: string;
  navbarBorder: string;
  navActiveUnderline: string;

  // Brand
  brandPrimary: string;

  // Buttons
  btnPrimaryBg: string;
  btnPrimaryText: string;
  btnPrimaryHover: string;
  btnRadius: number;

  // Login
  loginBg: string;
  loginCardBg: string;
  loginHeading: string;
  loginBtnBg: string;
  loginBtnText: string;
  loginInputRadius: number;
  signupBtnBg: string;

  // Typography
  bodyFontSize: number;
  headingScale: number;
  lineHeight: number;
  fontFamily: string;
  headingText: string;
  bodyText: string;
  mutedText: string;

  // Content
  pageBg: string;
  cardBg: string;
  cardBorder: string;
  contentMaxWidth: number;
  linkColour: string;
  linkHover: string;

  // Secondary Nav
  secondaryNavActive: string;
  secondaryNavText: string;

  // Drawers
  drawerBg: string;
  drawerBorder: string;

  // Footer
  footerBg: string;
  footerText: string;
  footerLink: string;

  // Alerts
  success: string;
  warning: string;
  error: string;
  info: string;
  alertInfoBg: string;

  // Progress
  progressBg: string;
  progressFill: string;

  // Focus
  focusRing: string;
}
```

Store features:
- `tokens: ThemeTokens` — current values
- `setToken(key, value)` — update one token, push to undo stack, trigger brandPrimary propagation if key is `brandPrimary`
- `undo()` / `redo()` — via zustand-temporal (max 50 entries)
- `reset()` — restore all Moodle defaults
- `savedConfigs: SavedConfig[]` — saved to localStorage
- `saveConfig(name)` — snapshot current tokens to localStorage
- `loadConfig(id)` — restore a saved config
- `generateSCSS()` — return two-block SCSS from current tokens

---

## 10. Save / Load (localStorage, no backend)

### Save
- Toolbar "Save" button opens a small modal/popover
- Name text input (required)
- Current accessibility score shown
- Saves to localStorage as JSON array

### Load
- Dropdown listing saved configs: name, date, score percentage
- Click to load and apply

### "Apply CFA Brand" Preset
A special one-click button in the Brand Colour section that applies the CFA brand palette:
- Brand Primary → `#336E7B` (Teal)
- Body Text → `#404041` (Charcoal)
- Font Family → "Source Sans Pro"
- All `brandPrimary`-linked tokens cascade to Teal

---

## 11. Verified CSS Selectors

These selectors have been verified against Moodle 4.x Boost theme. The admin should confirm their Moodle Cloud version, as selectors may change in Moodle 5.x.

| Target | Selector | Status |
|---|---|---|
| Navbar background | `.navbar.fixed-top` | Verified (needs `!important` due to `.bg-white`) |
| Navbar links | `.navbar.fixed-top .nav-link` | Verified |
| Login page body | `body#page-login-index` | Verified |
| Login container | `.login-container` | Verified |
| Login heading | `.login-heading` | Verified |
| Login form inputs | `.login-form input[type="text"]` | Verified |
| Login button | `#loginbtn` | Verified |
| Secondary nav active tab | `.secondary-navigation .nav-tabs .nav-link.active` | Verified |
| Dashboard page | `body#page-my-index` | Verified (convention-based) |
| Course cards | `.card.dashboard-card` | Partially verified (may vary) |
| Course drawer | `.drawer` | Verified (generic drawer class) |
| Footer | `#page-footer` | Verified |
| Progress bars | `.progress-bar` | Verified (Bootstrap class) |
| Alerts | `.alert-info` | Verified (Bootstrap class) |
| Content max width | `#page.drawers .main-inner` | Verify against your version |

---

## 12. Tool Accessibility

As a tool built by an accessibility organisation, the sandbox UI itself must meet WCAG 2.2 AA:

- Skip-to-content link (visible on Tab focus)
- All colour pickers have hex text input alternatives (not colour-only)
- Sliders are keyboard-operable (Arrow keys, Home/End)
- All icons have `aria-label`
- Accordion sections use `aria-expanded`, `aria-controls`
- Panel landmarks: left sidebar `role="complementary" aria-label="Theme controls"`, centre `role="main"`, right `role="complementary" aria-label="Accessibility audit"`
- Focus ring: 3px solid with 2px offset on all interactive elements
- Toast notifications: `role="status"` + `aria-live="polite"`
- Minimum 4.5:1 contrast on all tool UI text
- Reduced-motion: respect `prefers-reduced-motion`

---

## 13. What Is NOT in v1 (Deferred)

These features from the original PRD are deferred to keep v1 simple:

| Feature | Reason for Deferral |
|---|---|
| Supabase backend + PostgreSQL | Not needed — localStorage is sufficient for single admin |
| Authentication (magic links, allowlist) | Not needed — it's a tool, not a platform |
| User roles (admin/editor/viewer) | Single user, no roles needed |
| Audit logs | Admin wants to preview, not track changes |
| Automated Playwright selector verification | Premature — verify manually per Moodle upgrade |
| CI/CD with visual regression | Overkill for a utility tool |
| PDF export | Admin needs copy-paste SCSS, not PDF reports |
| Shareable read-only links | Requires backend — defer to v2 |
| Admin panel (manage users/palettes) | No backend, no users to manage |
| Colour blindness simulation | Nice-to-have, add in v1.1 |
| Side-by-side comparison mode | Nice-to-have, add in v1.1 |
| Forum page replica | 3 pages sufficient for MVP |
| Dark mode for tool UI | Cosmetic, not needed for core workflow |
| Zod schema validation | No backend to validate against |
| Analytics (Vercel/PostHog) | Premature — measure usage need first |

---

## 14. Summary

**What this tool is:** A focused, client-side web app that renders a pixel-accurate Moodle Boost replica, lets an admin pick colours from the CFA brand palette, shows WCAG contrast results in real time, and generates two-block SCSS ready to paste into Moodle Cloud's admin settings.

**What this tool is NOT:** An enterprise SaaS platform, a multi-user collaboration tool, or a full Moodle theme engine.

**Core workflow:**
1. Admin opens the sandbox in a browser
2. Picks colours using CFA brand palette swatches (or the "Apply CFA Brand" preset)
3. Sees the Moodle preview update instantly across Dashboard, Course, and Login pages
4. Checks the audit panel for any contrast failures
5. Clicks "Export SCSS" and copies the two code blocks
6. Pastes Block 1 into Moodle's "Raw initial SCSS" field
7. Pastes Block 2 into Moodle's "Raw SCSS" field
8. Purges caches
9. Done — the live site now matches the preview
