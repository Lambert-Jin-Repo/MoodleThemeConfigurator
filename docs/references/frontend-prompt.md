# Frontend Generation Prompt — CFA Brand Sandbox

## INSTRUCTION

Build a fully interactive, single-page **CFA Brand Sandbox** web application. The tool wraps a **pixel-accurate 1:1 replica** of the CFA Centre for Accessibility Moodle Cloud site inside a three-panel theme customizer. Users can change colours, typography, and layout options in real-time and see them reflected instantly on the replica.

**Tech stack:** Next.js 14+ (App Router), React 18+, TypeScript, Tailwind CSS, Zustand for state management.

**Critical rule:** Every single colour and typographic value in the Moodle replica MUST be driven by CSS custom properties. No hardcoded colours in replica components. All changes from the controls panel reflect in < 100ms. This is a client-side-only app — no backend calls needed.

---

## GLOBAL LAYOUT

Fixed viewport, no page-level scrolling. Three panels + sticky toolbar. Each panel scrolls independently.

```
┌────────────────────────────────────────────────────────────────────────┐
│  TOOLBAR — sticky, h-14, bg-[#1a1a2e], text-white, z-50              │
│  Left: "CFA Brand Sandbox" logo/text                                   │
│  Right: [Undo] [Redo] [Reset] | [Save Config] [Compare] [Export SCSS] │
├───────────────┬──────────────────────────────────┬─────────────────────┤
│ LEFT PANEL    │ CENTRE PANEL                     │ RIGHT PANEL         │
│ Controls      │ Live Moodle Preview              │ Audit & Export      │
│ w-[300px]     │ flex-1                           │ w-[320px]           │
│ bg-[#f8f9fa]  │ bg-[#e5e7eb] (canvas behind)     │ bg-[#f8f9fa]        │
│ overflow-y    │ overflow-y                       │ overflow-y          │
│ auto          │ auto                             │ auto                │
│ border-r      │                                  │ border-l            │
└───────────────┴──────────────────────────────────┴─────────────────────┘
```

### Responsive Behaviour
- **1440px+**: All three panels visible.
- **768–1439px**: Left and right panels collapse to toggle-able drawers. Preview fills width.
- **<768px**: Single panel view with bottom tab bar: Controls | Preview | Audit.

---

## CENTRE PANEL — 1:1 MOODLE REPLICA (the most important part)

This must faithfully replicate the EXACT layout from the real CFA Moodle Cloud site. It is NOT a generic mockup — it must look like a real Moodle Boost site.

### Preview Toolbar (inside centre panel, sticky top)
- **Page tabs:** `Dashboard` (default active) | `Course Page` | `Login Page`
  - Three tabs only — these are the three key pages CFA staff need to preview before applying changes to the real site
  - Styled as pill/underline tabs, small, unobtrusive
- **Viewport toggle:** Three icon buttons — Desktop (100%) | Tablet (768px) | Mobile (375px)
  - When tablet/mobile selected, constrain the preview container to that max-width with a visible device outline, centred
- **Zoom:** Dropdown — 50% | 75% | 100% | 125%. Applies `transform: scale()` to preview container.

### Preview Container
A `<div>` that sets all CSS custom properties on its `style` attribute, read from the Zustand store. All child Moodle components inherit these. The container has:
- `background-color: var(--cfa-page-bg)` (the light grey canvas that sits behind the Moodle content)
- `font-family: var(--cfa-font-family)`
- `font-size: var(--cfa-body-font-size)`
- `line-height: var(--cfa-line-height)`

### Brand Colour Propagation Logic (CRITICAL for accuracy)
When the user changes **Brand Colour (Accent)** in the controls, the following tokens must ALL update to match, unless the user has explicitly set them to a different value:
- `--cfa-btn-primary-bg` → matches brand primary
- `--cfa-link-colour` → matches brand primary
- `--cfa-nav-active-underline` → matches brand primary
- `--cfa-secondary-nav-active` → matches brand primary
- `--cfa-progress-fill` → matches brand primary
- `--cfa-focus-ring` → matches brand primary
- `--cfa-login-btn-bg` → matches brand primary

This mirrors how Moodle's `$primary` variable propagates through Bootstrap compilation. In the Zustand store, when `brandPrimary` changes, check each linked token — if it still equals the OLD brand value (meaning the user hasn't manually overridden it), update it to the new value. If the user has manually set a button colour different from brand, leave it alone.

This is the single most important behaviour for ensuring the sandbox matches the real Moodle site.

---

### PAGE 1: DASHBOARD (default view) — match screenshot exactly

#### Navbar (top, full-width, ~56px height)
Replicate exactly:
- **Background:** `var(--cfa-navbar-bg)` — default `#FFFFFF` (white, matching the real site)
- **Bottom border:** 1px solid `#dee2e6` (subtle separator)
- **Left section:**
  - CFA logo: A small red square icon (16x16) followed by text "Centre for" (line 1) "Accessibility" (line 2, bold) in dark text, with "AUSTRALIA" in small red text below. Use `var(--cfa-navbar-text)` for the main text, keep "AUSTRALIA" in red `#cc0000`.
  - Nav links (inline, ~14px, regular weight): "Home" | "Dashboard" | "My courses" | "Site administration" | "Visit us"
  - Link colour: `var(--cfa-navbar-text)` default `#404041`
  - **Active link ("Dashboard"):** Has a 3px bottom border in `var(--cfa-nav-active-underline)` default `#0f6cbf` (Moodle default blue). The text itself is the same colour as other links — only the underline distinguishes it.
  - Links have generous horizontal spacing (~20px gap)
- **Right section:**
  - Bell icon (notifications)
  - Chat/message icon
  - Text: "Active Users" with a thin progress bar below it (grey bar, partially filled)
  - Text: "Storage" with a thin progress bar below it
  - User avatar: A grey circle with a generic person silhouette, with a small dropdown caret
- All icons are `var(--cfa-navbar-text)` colour, ~18px

#### Main Content Area
- **Background:** `var(--cfa-page-bg)` default `#f5f5f5` (very light grey)
- **Content centred** with `max-width: var(--cfa-content-max-width)` default `830px`, with `margin: 0 auto`, `padding: 24px 16px`

##### Heading Section
- **"Dashboard"** — Bold, ~28px, colour `var(--cfa-heading-text)` default `#1d2125`
- **"Hi, Scott! 👋"** — ~22px, slightly lighter weight, same colour. The wave emoji is literal.

##### Trial Banner
- A rounded card (`border-radius: 4px`) with:
  - Left colour accent: 4px left border in `var(--cfa-info)` default `#0f6cbf`
  - Background: `var(--cfa-alert-info-bg)` default `#e7f3fe`
  - Text: "Your free trial ends in **24 days**. You can upgrade to a paid plan in the MoodleCloud customer portal."
  - Text colour: dark, ~14px
  - Right side: "Upgrade" button — `var(--cfa-btn-primary-bg)` default `#0f6cbf`, white text, rounded (`border-radius: 20px`), ~14px padding

##### Course Overview Section
- **"Course overview"** heading — ~18px, bold, `var(--cfa-heading-text)`
- **Filter bar row:**
  - "All" dropdown (small, bordered, ~13px)
  - Search text input (bordered, placeholder "Search", ~200px wide)
  - Right side: "Sort by course name" dropdown + "Card" view dropdown
  - All dropdowns have light grey borders, white backgrounds, small caret icons

##### Course Cards (2 cards in a row, ~50% width each)
Cards sit in a flex row with a ~16px gap. Each card:
- **Border:** 1px solid `#dee2e6`, `border-radius: 6px`, white background `var(--cfa-card-bg)` default `#FFFFFF`
- **Image header:** ~180px height, covers top of card, `border-radius: 6px 6px 0 0`
  - Card 1: Dark navy/purple gradient background (`#1a1a4e`) with text "Website Accessibility" in white, centred. Three circular icons below the text (orange envelope, purple code brackets, pink accessibility person icon). Use coloured circles with simple emoji/icons inside.
  - Card 2: Photo-style header — use a grey placeholder with a subtle illustration of hands on a tablet. Or use a gradient from `#8b9dc3` to `#b0c4de` with an overlay silhouette. Text is NOT on this image.
- **Card body** (padding 12px):
  - **Course title:** `var(--cfa-link-colour)` default `#0f6cbf`, ~15px, hover underline.
    - Card 1: "Web Accessibility Compliance SC"
    - Card 2: "Starting with Moodle"
  - **Category:** "Accessibility Training" — `var(--cfa-body-text)` default `#6c757d`, ~13px
  - Card 2 only: Green badge "Hidden from students" — small rounded pill, `background: #0f7b5f`, white text, ~11px
- **Card footer** (border-top 1px #eee, padding 8px 12px):
  - "0% complete" text, ~12px, `#6c757d`
  - Right: Three-dot vertical menu icon (⋮)
  - Between them: A thin progress bar — empty (grey track `#e9ecef`, 4px height, rounded)

The cards area sits inside a white container/card that has its own subtle border and rounded corners, wrapping the Course Overview heading + filters + cards.

#### Footer area
Leave empty space below the cards (the real Moodle has a lot of whitespace below dashboard content).

---

### PAGE 2: COURSE PAGE — match screenshot exactly

This page shows the "Web Accessibility Compliance SC" course. It has three key areas: a left drawer, secondary nav tabs, and the course content.

#### Same navbar as dashboard
- Nav links identical. No active underline on any tab (or "My courses" can be active).

#### Course Index Drawer (left side, ~160px wide, Moodle 4.x)
A collapsible left sidebar showing the full course structure. Must match the real screenshot exactly:
- **Top bar:** An "X" close button (left) and a three-dot menu icon "⋮" (right), separated by the drawer content
- **Background:** `var(--cfa-drawer-bg)` default `#FFFFFF`
- **Right border:** 1px solid `var(--cfa-drawer-border)` default `#dee2e6`
- **Content:** Collapsible section groups with small circle indicators (○) for incomplete items:

  **▼ General** (section heading, bold, expanded)
  - Welcome
  - Introductions
  - ○ Reflections
  - ○ General Discussion
  - Aims & Objectives
  - Graduate Qualities

  **○ Teleconference recordings** (section heading)
  - Resources
  - Contacts
  - Acknowledgements
  - Evaluation
  - News forum

  **▼ Modules** (section heading, bold, collapsed)
  - Modules
  - Module 1: Why should you car...
  - Module 2: W3C accessibility st...
  - Module 3: Essential WCAG tec...
  - Module 4: Advanced WCAG te...
  - Module 5: Authoring Tool Acce...
  - Module 6: Evaluation and futur...

  **○ Level A quick tips**

  **▼ Assessments** (section heading)
  - Key Dates
  - ○ Assignment 1
  - ○ Assignment 1 Project Analy... 🔒
  - Assignment One Mark Sheet (...
  - ○ Assignment 2

- Items are ~13px, `var(--cfa-body-text)`, truncated with ellipsis when too long
- Active/current items highlighted with a subtle left border or background tint
- The drawer scrolls independently from the main content

#### Course Title
- **"Web Accessibility Compliance SC"** — Bold, ~28px, `var(--cfa-heading-text)` default `#1d2125`
- Displayed above the secondary navigation, no breadcrumb visible

#### Secondary Navigation Tabs (Moodle 4.x `.secondary-navigation .nav-tabs`)
Horizontal tabs directly below the course title:
- **"Course"** (active) — `var(--cfa-secondary-nav-text)`, 3px bottom border in `var(--cfa-secondary-nav-active)` default `#0f6cbf`
- **"Settings"** — displayed in `var(--cfa-link-colour)` (blue link-style, distinguishing it from other tabs)
- **"Participants"** — `var(--cfa-secondary-nav-text)` default `#404041`
- **"Grades"** — same
- **"Activities"** — same
- **"More ▾"** — same, with a dropdown caret. Overflow items collapse into this dropdown (Moodle 4.x `.moremenu` pattern)
- Tab font size ~14px, regular weight, generous horizontal spacing (~24px gap)

#### Course Content Sections
White card container (rounded corners, subtle border) containing activity items:

**Section: "General"** (collapsible)
- **Section header row:** Collapse chevron (▼) + "**General**" (bold, ~18px) + "Collapse all" link (blue `var(--cfa-link-colour)`, right-aligned)
- **Activity items** (stacked rows, ~48px each, separated by subtle 1px bottom borders):

  Each activity row has:
  - **Left:** Small coloured square icon (28x28, rounded 4px). Pages = teal/green `#0f7b5f` background with document icon. Forums = teal with speech bubble icon. The icons are NOT emojis — they are small solid-colour squares with white icon glyphs inside.
  - **Centre:** Activity name as a link in `var(--cfa-link-colour)` default `#0f6cbf`, ~14px
  - **Right (optional):** "To do ▾" dropdown pill (small, grey border, ~12px) OR group icon OR nothing

  Items in the "General" section:
  - [Page icon teal] "Welcome"
  - [Forum icon teal] "Introductions" — group/people icon on right
  - [Forum icon teal] "Reflections" — "To do ▾" dropdown on right
  - [Forum icon teal] "General Discussion" — "To do ▾" dropdown on right
  - [Page icon teal] "Aims & Objectives"
  - [Page icon teal] "Graduate Qualities"

  Then a grey banner row:
  - Left: Grey "Hidden from students" badge (eye-slash icon + text, `background: #e9ecef`, dark text, rounded pill, ~12px)
  - Centre: "Teleconference recordings" — plain text, not a link
  - Right: "Mark as done" button (small, outlined, grey border, ~12px)

  More items:
  - [Page icon teal] "Resources"
  - [Page icon teal] "Contacts"
  - [Page icon teal] "Acknowledgements"
  - [Page icon teal] "Evaluation" — below it a small "Hidden from students" badge (inline, grey)
  - [Forum icon teal] "News forum"

**Section: "Modules"** (collapsible, collapsed by default)
- Collapse chevron (▶) + "**Modules**" heading
- When expanded, shows module list items

---

### PAGE 3: LOGIN PAGE — match screenshot exactly

This page has NO navbar. It is a standalone full-page login form.

#### Full-page layout:
- **Background:** `var(--cfa-login-bg)` default `#e8eaed` (light grey-blue, slightly cooler than the dashboard background)
- **Centred login card** (max-width ~480px, vertically and horizontally centred):
  - Background: `var(--cfa-login-card-bg)` default `#FFFFFF`
  - Border-radius: 12px
  - Box-shadow: `0 2px 16px rgba(0,0,0,0.08)`
  - Padding: 40px

  Contents (top to bottom):

  **Login Section:**
  - **Heading:** "Log in to CFA Learning Portal" — `var(--cfa-login-heading)` default `#1d2125`, ~26px, bold, left-aligned (NOT centred). The site name part comes from a configurable value.
  - **Spacer** (20px)
  - **Username input:** Full width, large rounded pill shape (`border-radius: 24px`), light grey border `#ced4da`, padding 14px 20px. **Placeholder text only** (no label above): "Username or email" in `#6c757d`. No visible label — the placeholder IS the label.
  - **Spacer** (12px)
  - **Password input:** Same style as username. Placeholder: "Password". type=password.
  - **Spacer** (16px)
  - **"Log in" button:** Compact (NOT full width), left-aligned, `var(--cfa-login-btn-bg)` default `#0f6cbf`, text `var(--cfa-login-btn-text)` default `#FFFFFF`, `border-radius: 6px`, padding `8px 24px`, ~15px text, font-weight 600. The button is small and left-aligned.
  - **Spacer** (8px)
  - **"Lost password?" link** — `var(--cfa-link-colour)` default `#0f6cbf`, ~14px, left-aligned

  **Horizontal divider** (1px solid `#dee2e6`, full width, with ~24px vertical margin)

  **Signup Section:**
  - **"Is this your first time here?"** — bold, ~20px, `var(--cfa-heading-text)` default `#1d2125`
  - **Body text:** "For full access to this site, you first need to create an account." — `var(--cfa-body-text)` default `#404041`, ~14px
  - **Spacer** (12px)
  - **"Create new account" button** — dark/charcoal `#404041` background, white text, rounded 6px, compact, left-aligned. Same size as the login button.

  **Spacer** (20px)

  **Footer area (bottom of card):**
  - **"English (en) ▾"** — language selector dropdown link, `var(--cfa-link-colour)`, ~13px
  - **"Cookies notice"** — small grey outlined button/pill (`background: #e9ecef`, dark text, rounded)
  - **"Cookie Settings"** — `var(--cfa-link-colour)` link, ~13px
  - These three items sit in a row with spacing between them

---

## CSS CUSTOM PROPERTIES — Complete List

Set these on the preview container's `style` attribute. All defaults match the REAL CFA Moodle site as observed:

```css
/* Navbar */
--cfa-navbar-bg: #FFFFFF;
--cfa-navbar-text: #404041;
--cfa-navbar-border: #dee2e6;
--cfa-nav-active-underline: #0f6cbf;

/* Brand */
--cfa-brand-primary: #0f6cbf;

/* Buttons */
--cfa-btn-primary-bg: #0f6cbf;
--cfa-btn-primary-text: #FFFFFF;
--cfa-btn-primary-hover: #0d5ca3;
--cfa-btn-radius: 4px;

/* Login Page */
--cfa-login-bg: #e8eaed;
--cfa-login-card-bg: #FFFFFF;
--cfa-login-heading: #1d2125;
--cfa-login-btn-bg: #0f6cbf;
--cfa-login-btn-text: #FFFFFF;
--cfa-login-input-radius: 24px;

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
--cfa-link-colour: #0f6cbf;
--cfa-link-hover: #0a4b8c;

/* Secondary Navigation (.secondary-navigation .nav-tabs in Moodle 4.x) */
--cfa-secondary-nav-active: #0f6cbf;
--cfa-secondary-nav-text: #404041;

/* Drawers / Sidebars (Moodle 4.x) */
--cfa-drawer-bg: #FFFFFF;
--cfa-drawer-border: #dee2e6;

/* Footer */
--cfa-footer-bg: #FFFFFF;
--cfa-footer-text: #404041;
--cfa-footer-link: #0f6cbf;

/* Alerts & States */
--cfa-success: #0f7b5f;
--cfa-warning: #f0ad4e;
--cfa-error: #d9534f;
--cfa-info: #0f6cbf;
--cfa-alert-info-bg: #e7f3fe;

/* Progress Bars */
--cfa-progress-bg: #e9ecef;
--cfa-progress-fill: #0f6cbf;

/* Focus */
--cfa-focus-ring: #0f6cbf;
```

---

## LEFT PANEL — Controls

Scrollable sidebar with collapsible accordion sections. Each section has a chevron toggle icon.

### Colour Picker Component (reusable)
Every colour input renders as:
1. A small colour swatch square (24x24, rounded 4px, showing current colour)
2. Next to it: editable hex text input (#XXXXXX)
3. On click of swatch: a popover colour picker opens with:
   - A standard colour wheel/spectrum picker
   - **CFA Brand Palette row:** Swatches for `#F27927` (CFA Orange), `#336E7B` (CFA Teal), `#404041` (CFA Charcoal), `#BAF73C` (CFA Green), `#00BFFF` (CFA Blue), `#F64747` (CFA Red), `#0f6cbf` (Moodle Blue), `#FFFFFF`, `#F0EEEE`, `#1d2125`
   - Clicking a swatch applies it immediately
4. If the selected colour is NOT in the CFA palette, show an amber pill badge: "Off-brand"
5. Below each picker: a small Moodle path tooltip (grey italic text): e.g., "Boost → Advanced → Raw SCSS"

### Control Sections:

**Section 1: Core Identity** (default expanded)
- Brand Colour (Accent): colour picker, default `#0f6cbf`
- Logo: Upload dropzone placeholder (non-functional, shows "Replace Logo")

**Section 2: Navigation Bar**
- Background: colour picker, default `#FFFFFF`
  - Moodle path: `Boost → Advanced → Raw SCSS` (selector: `.navbar.fixed-top`)
  - Note: Navbar bg is NOT controlled by $primary — requires explicit CSS override
- Text / Link Colour: colour picker, default `#404041`
- Active Tab Underline: colour picker, default `#0f6cbf`
- Hover Style: dropdown — "Underline" | "Background Highlight" | "Opacity"

**Section 3: Buttons**
- Primary Background: colour picker, default `#0f6cbf`
  - Moodle path: If same as Brand Colour, this is handled automatically by `$primary`. If different, goes into Raw SCSS (selector: `.btn-primary`)
- Primary Text: colour picker, default `#FFFFFF`
- Hover Background: colour picker, default `#0d5ca3`
- Border Radius: slider 0–24px, default 4px

**Section 4: Login Page**
- Page Background: colour picker, default `#e8eaed`
  - Moodle path: `Boost → Advanced → Raw SCSS` (selector: `body#page-login-index`)
- Login Background Image: upload placeholder (maps to `Boost → General → Login background image`)
- Card Background: colour picker, default `#FFFFFF`
- Heading Colour: colour picker, default `#1d2125`
  - The heading reads "Log in to [Site Name]" — e.g., "Log in to CFA Learning Portal"
- Input Border Radius: slider 4–30px, default 24px (Moodle uses pill-style rounded inputs)
- Login Button Background: colour picker, default `#0f6cbf`
- Login Button Text: colour picker, default `#FFFFFF`
- Signup Button Background: colour picker, default `#404041`
  - The "Create new account" button below the divider

**Section 5: Typography**
- Body Font Size: slider 12–22px, default 14px
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$font-size-base`)
- Heading Scale: dropdown — "Minor Third (1.2)" | "Major Third (1.25)" | "Perfect Fourth (1.333)" | "Golden Ratio (1.618)"
- Line Height: slider 1.0–2.5, step 0.1, default 1.5
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$line-height-base`)
- Font Family: dropdown — "System Default" | "Open Sans" | "Roboto" | "Inter" | "Source Sans Pro" | "Lato"
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$font-family-sans-serif`)

**Section 6: Content Area**
- Page Background: colour picker, default `#f5f5f5`
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$body-bg`)
- Card Background: colour picker, default `#FFFFFF`
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$card-bg`)
- Card Border: colour picker, default `#dee2e6`
- Content Max Width: slider 600–1400px, default 830px
- Link Colour: colour picker, default `#0f6cbf`
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$link-color`)
- Link Hover Colour: colour picker, default `#0a4b8c`

**Section 7: Drawers & Sidebars (Moodle 4.x)**
- Course Index Drawer Background: colour picker, default `#FFFFFF`
  - Moodle path: `Boost → Advanced → Raw SCSS` (selector: `#theme_boost-drawers-courseindex`)
- Block Drawer Background: colour picker, default `#FFFFFF`
  - Moodle path: `Boost → Advanced → Raw SCSS` (selector: `#theme_boost-drawers-blocks`)

**Section 8: Footer**
- Footer Background: colour picker, default `#FFFFFF`
  - Moodle path: `Boost → Advanced → Raw SCSS` (selector: `#page-footer`)
- Footer Text: colour picker, default `#404041`
- Footer Link Colour: colour picker, default `#0f6cbf`

**Section 9: Alerts & Progress**
- Info Background: colour picker, default `#e7f3fe`
- Success: colour picker, default `#0f7b5f`
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$success`)
- Warning: colour picker, default `#f0ad4e`
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$warning`)
- Error: colour picker, default `#d9534f`
  - Moodle path: `Boost → Advanced → Raw initial SCSS` (variable: `$danger`)
- Progress Bar Fill: colour picker, default `#0f6cbf`

### How Controls Map to Moodle (important context for the developer)

Each control in the sandbox maps to one of THREE places in Moodle. The export must route each setting to the correct field:

| Mechanism | Moodle Field | What It Controls | Reliability |
|---|---|---|---|
| **Brand colour setting** | Boost → General → Brand colour | Sets `$brand-primary`. A simple hex field in Moodle admin. | 100% — native Moodle setting |
| **SCSS variables** | Boost → Advanced → Raw initial SCSS | `$primary`, `$link-color`, `$body-bg`, `$body-color`, `$font-family-sans-serif`, `$font-size-base`, `$line-height-base`, `$card-bg`, `$success`, `$warning`, `$danger`, `$info` | 99% — compiled by Moodle's own SCSS engine, propagates everywhere automatically |
| **CSS rule overrides** | Boost → Advanced → Raw SCSS | Navbar bg/text, login page, secondary nav tabs, drawers, footer, breadcrumbs — anything not covered by variables | 95% — uses verified selectors, but selectors may shift on major Moodle updates |

The developer building this tool should understand: **the $primary variable is the single most powerful setting**. When a user changes "Brand Colour" in the sandbox, it should update buttons, links, focus rings, progress bars, active states, and checkboxes ALL AT ONCE in the preview — because that's exactly what happens on the real Moodle site.

---

## RIGHT PANEL — Audit & Export

### A. Accessibility Score Badge
A large circular progress ring at the top (120px diameter). Shows percentage of passing checks. Colour: green if > 90%, amber 70–90%, red < 70%. The number is large and bold inside the circle.

### B. Contrast Check Cards
A vertical list. Each card shows one colour pair being tested:

**Card anatomy:**
```
┌─────────────────────────────────────────┐
│ [fg swatch] [bg swatch]  Navbar Text    │
│ Ratio: 12.7 : 1                        │
│ [AA ✓ green badge] [AAA ✓ green badge]  │
└─────────────────────────────────────────┘
```

For failing pairs:
```
┌─ red left border ───────────────────────┐
│ [fg swatch] [bg swatch]  Link on Page   │
│ Ratio: 2.8 : 1                          │
│ [AA ✗ red badge] [AAA ✗ grey badge]     │
│ 💡 Suggestion: #0d5ca3 (4.6:1) [Apply] │
└─────────────────────────────────────────┘
```

**Pairs to check (all real-time):**
1. Navbar Text on Navbar Background
2. Button Text on Button Background
3. Body Text (`#404041`) on Page Background
4. Link Colour on Page Background
5. Link Colour on Card Background
6. Login Heading on Login Card Background
7. Login Button Text on Login Button Background
8. Muted Text (`#6c757d`) on Page Background
9. Muted Text on Card Background
10. Heading Text on Page Background

**WCAG contrast algorithm (implement exactly):**
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

### C. Colour Blindness Simulation
Dropdown: "Colour Vision Simulation"
- Normal Vision (default)
- Protanopia (red-blind)
- Deuteranopia (green-blind)
- Tritanopia (blue-blind)
- Achromatopsia (monochrome)

Applies an SVG `<filter>` with the appropriate colour matrix to the entire preview panel.

### D. Additional Checks (checklist)
- ✓ / ✗ "Body text ≥ 16px" — checks `--cfa-body-font-size`
- ✓ / ✗ "Line height ≥ 1.5" — checks `--cfa-line-height`
- ✓ "Interactive targets ≥ 44px"
- ✓ "Focus indicators visible"

### E. SCSS Export Section (below a divider)

**CRITICAL: The export generates TWO separate code blocks**, matching the two SCSS input fields in Moodle. The user must paste each block into the correct field for the changes to work identically to the preview.

#### Step-by-Step Moodle Instructions (always visible)
A numbered instruction card at the top of the export section:
1. **Set Brand colour:** Go to `Site admin → Appearance → Themes → Boost → General settings → Brand colour` and enter `{brandPrimary}`.
2. **Paste Raw initial SCSS:** Go to `Site admin → Appearance → Themes → Boost → Advanced settings → Raw initial SCSS` and paste Block 1 below.
3. **Paste Raw SCSS:** In the same Advanced settings page, paste Block 2 into `Raw SCSS`.
4. **Upload logos:** Go to `Site admin → Appearance → Logos` to upload logo, compact logo, and favicon.
5. **Purge caches:** Go to `Site admin → Development → Purge all caches`.

#### Moodle Admin Paths Reference (collapsible)
A detailed reference list mapping each control to its exact Moodle location:
- Brand colour → `Site admin → Appearance → Themes → Boost → General settings → Brand colour` (hex value field)
- Background image → `Site admin → Appearance → Themes → Boost → General settings → Background image` (file upload)
- Login background image → `Site admin → Appearance → Themes → Boost → General settings → Login background image` (file upload)
- SCSS variables → `Site admin → Appearance → Themes → Boost → Advanced settings → Raw initial SCSS`
- Custom CSS rules → `Site admin → Appearance → Themes → Boost → Advanced settings → Raw SCSS`
- Full logo → `Site admin → Appearance → Logos → Logo` (file upload)
- Compact logo → `Site admin → Appearance → Logos → Small logo` (file upload)
- Favicon → `Site admin → Appearance → Logos → Favicon` (file upload)
- Site name → `Site admin → General → Site home settings → Full site name`
- Custom menu items → `Site admin → Appearance → Advanced theme settings → Custom menu items`
- Additional HTML → `Site admin → Appearance → Additional HTML`
- Purge caches → `Site admin → Development → Purge all caches`

#### Export Buttons
- **"Copy All to Clipboard"** — Primary button, full width. Copies both blocks with clear labels. Toast: "Copied! Follow the paste instructions above."
- **"Copy Block 1 (Variables)"** — Secondary button, half width. Copies only Raw initial SCSS.
- **"Copy Block 2 (Custom CSS)"** — Secondary button, half width. Copies only Raw SCSS.
- **"Download .scss"** — Outline button, full width. Downloads `cfa-moodle-theme.scss` containing both blocks with comments.

#### SCSS Code Preview (two tabbed panels)

**Tab 1: "Raw initial SCSS" (Variables)**
Label above: "Paste into: Site admin → Appearance → Themes → Boost → Advanced settings → Raw initial SCSS"
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
/* These variables are compiled by Moodle's SCSS engine BEFORE
   all other styles. They propagate automatically into buttons,
   links, focus rings, progress bars, checkboxes, dropdowns,
   active states, and badges throughout the entire site. */

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
Label above: "Paste into: Site admin → Appearance → Themes → Boost → Advanced settings → Raw SCSS"
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
/* Overrides navbar background (not controlled by $primary variable) */
.navbar.fixed-top {
  background-color: {navbarBg} !important;
  border-bottom: 1px solid {navbarBorder};
}
.navbar.fixed-top .nav-link,
.navbar.fixed-top .navbar-brand {
  color: {navbarText} !important;
}
.navbar.fixed-top .nav-link:hover {
  color: {navbarText} !important;
  opacity: 0.8;
}

/* --- PRIMARY BUTTONS --- */
/* Only needed if button colour differs from $primary. */
/* If btnPrimaryBg === brandPrimary, this section can be omitted
   since $primary already handles .btn-primary via Bootstrap. */
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
/* body#page-login-index is Moodle's stable body ID for the login page */
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
body#page-login-index #loginbtn:hover {
  background-color: {btnPrimaryHover} !important;
  border-color: {btnPrimaryHover} !important;
}

/* --- SECONDARY NAVIGATION (Moodle 4.x course tabs) --- */
/* .secondary-navigation is the correct selector in Moodle 4.0+ */
.secondary-navigation .nav-tabs .nav-link.active {
  border-bottom-color: {secondaryNavActive} !important;
}

/* --- DASHBOARD PAGE --- */
body#page-my-index #page.drawers {
  background-color: {pageBg};
}

/* --- COURSE CARDS --- */
.card.dashboard-card {
  background-color: {cardBg};
  border-color: {cardBorder};
}

/* --- DRAWERS / SIDEBARS (Moodle 4.x) --- */
.drawer {
  background-color: {cardBg};
  border-color: {cardBorder};
}
#theme_boost-drawers-courseindex {
  background-color: {cardBg};
}
#theme_boost-drawers-blocks {
  background-color: {cardBg};
}

/* --- BREADCRUMBS --- */
.breadcrumb-item a {
  color: {linkColour};
}

/* --- FOOTER --- */
#page-footer {
  background-color: {navbarBg};
  color: {navbarText};
}
#page-footer a {
  color: {linkColour};
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

/* --- TYPOGRAPHY --- */
body {
  font-size: {bodyFontSize}px !important;
  line-height: {lineHeight} !important;
}

/* --- LINK HOVER (supplement to $link-color variable) --- */
a:not(.btn):not(.nav-link):hover {
  color: {linkHover};
}

/* ================================================
   AFTER PASTING: Purge all caches!
   Site admin → Development → Purge all caches
   ================================================ */
```

#### Smart Export Logic
The SCSS generator should include comments explaining when sections can be omitted:
- If `btnPrimaryBg` equals `brandPrimary`, add a comment: "Button section omitted — $primary already handles .btn-primary"
- If `navbarBg` is `#FFFFFF` (Moodle default), add a comment: "Navbar section omitted — using Moodle default white navbar"
- This keeps the exported SCSS minimal and avoids unnecessary overrides.

#### Reminder Banner
A yellow/amber info box below the export area:
"**After pasting into Moodle, you MUST purge caches for changes to take effect:** Site admin → Development → Purge all caches"

#### Reliability Note
A small collapsible info section:
"**How accurate is this?** The Raw initial SCSS variables ($primary, $link-color, etc.) are compiled by Moodle's own SCSS engine and propagate automatically — these are 99% accurate. The Raw SCSS custom rules use verified selectors tested on Moodle Cloud (Moodle 4.x with Boost theme). Selectors may need updating if Moodle Cloud upgrades to a new major version. Last verified: February 2026."

---

## ZUSTAND STORE

```typescript
interface ThemeTokens {
  // Navbar
  navbarBg: string;         // #FFFFFF — Raw SCSS: .navbar.fixed-top
  navbarText: string;       // #404041 — Raw SCSS: .navbar.fixed-top .nav-link
  navbarBorder: string;     // #dee2e6
  navActiveUnderline: string; // #0f6cbf

  // Brand (the single most important setting — propagates everywhere via $primary)
  brandPrimary: string;     // #0f6cbf — Moodle Brand colour field + $primary variable

  // Buttons
  btnPrimaryBg: string;     // #0f6cbf — auto from $primary, or Raw SCSS override
  btnPrimaryText: string;   // #FFFFFF
  btnPrimaryHover: string;  // #0d5ca3
  btnRadius: number;        // 4

  // Login
  loginBg: string;          // #e8eaed — Raw SCSS: body#page-login-index
  loginCardBg: string;      // #FFFFFF — Raw SCSS: body#page-login-index .login-container
  loginHeading: string;     // #1d2125 — Raw SCSS: body#page-login-index .login-heading
  loginBtnBg: string;       // #0f6cbf — Raw SCSS: body#page-login-index #loginbtn
  loginBtnText: string;     // #FFFFFF

  // Typography
  bodyFontSize: number;     // 14 — Raw initial SCSS: $font-size-base
  headingScale: number;     // 1.25
  lineHeight: number;       // 1.5 — Raw initial SCSS: $line-height-base
  fontFamily: string;       // system default — Raw initial SCSS: $font-family-sans-serif
  headingText: string;      // #1d2125
  bodyText: string;         // #404041 — Raw initial SCSS: $body-color
  mutedText: string;        // #6c757d

  // Content
  pageBg: string;           // #f5f5f5 — Raw initial SCSS: $body-bg
  cardBg: string;           // #FFFFFF — Raw initial SCSS: $card-bg
  cardBorder: string;       // #dee2e6 — Raw initial SCSS: $card-border-color
  contentMaxWidth: number;  // 830
  linkColour: string;       // #0f6cbf — Raw initial SCSS: $link-color
  linkHover: string;        // #0a4b8c

  // Secondary Nav (Moodle 4.x tabs: .secondary-navigation .nav-tabs)
  secondaryNavActive: string; // #0f6cbf
  secondaryNavText: string;   // #404041

  // Drawers / Sidebars (Moodle 4.x)
  drawerBg: string;           // #FFFFFF — Raw SCSS: .drawer, #theme_boost-drawers-*
  drawerBorder: string;       // #dee2e6

  // Footer
  footerBg: string;           // #FFFFFF — Raw SCSS: #page-footer
  footerText: string;         // #404041
  footerLinkColour: string;   // #0f6cbf

  // Alerts — Raw initial SCSS: $success, $warning, $danger, $info
  success: string;          // #0f7b5f
  warning: string;          // #f0ad4e
  error: string;            // #d9534f
  info: string;             // #0f6cbf
  alertInfoBg: string;      // #e7f3fe

  // Progress
  progressBg: string;       // #e9ecef
  progressFill: string;     // #0f6cbf
}
```

The store must include:
- `tokens: ThemeTokens` — all current values
- `setToken(key, value)` — update one token, push to undo stack
- `undo()` / `redo()` — history stack (max 50 entries)
- `reset()` — restore all defaults
- `savedConfigs: SavedConfig[]` — array of saved configurations
- `saveConfig(name, description)` — snapshot current tokens
- `loadConfig(id)` — restore a saved config
- `generateSCSS()` — return formatted SCSS string from current tokens

---

## SAVE / LOAD / COMPARE (in-memory, no backend)

### Save Modal
Triggered by "Save Config" toolbar button. Modal with:
- "Configuration Name" text input (required)
- "Description" textarea (optional)
- Current accessibility score shown
- [Save] [Cancel] buttons

### Load
Dropdown or modal listing saved configs: name, date saved, accessibility score percentage. Click to load.

### Compare Mode
Triggered by "Compare" toolbar button. Splits the centre panel into two side-by-side previews. Each has a dropdown to select a saved config. Both render the full Moodle replica with their respective tokens.

---

## TOOLBAR BUTTONS (match Sample Webpage reference)

The toolbar matches the sample frontend screenshot:
- **Background:** Dark charcoal/navy `#1a1a2e`, full width, ~48px height
- **Left side:** Orange CFA icon (small square, `#F27927`) + "CFA Brand Sandbox" in white, bold, ~16px
- **Right side buttons** (small, ~32px height, spaced evenly):
  - **Undo** (↩ icon) — disabled when nothing to undo, grey. Active: white.
  - **Redo** (↪ icon) — disabled when nothing to redo
  - **Reset** — small text button, white, "Reset"
  - **Divider** (thin vertical white/grey line)
  - **Compare** — outlined white button, ~13px text
  - **Save** — solid green/teal button (`#0f7b5f` bg, white text), ~13px
  - **Export SCSS** — solid accent button (`#F27927` background, white text, bold) — this is the primary CTA, most prominent button in the toolbar

---

## ACCESSIBILITY OF THE TOOL ITSELF

This is built by an accessibility organisation. The tool MUST be exemplary:
- Skip-to-content link (visible on Tab focus)
- All colour pickers have hex text input alternatives
- Sliders are keyboard-operable (Arrow keys)
- All icons have `aria-label`
- Accordion sections use `aria-expanded`, `aria-controls`
- Panel landmarks: left sidebar `role="complementary" aria-label="Theme controls"`, centre `role="main"`, right `role="complementary" aria-label="Accessibility audit"`
- Focus ring: 3px solid `var(--cfa-focus-ring)` with 2px offset on all interactive elements
- Toast notifications: `role="status"` + `aria-live="polite"`
- Modals trap focus and close on Escape
- Minimum 4.5:1 contrast on all tool UI text

---

## FILE STRUCTURE

```
app/
  layout.tsx                  — Root layout, font imports, metadata
  page.tsx                    — Main page, renders three-panel layout
  globals.css                 — Tailwind directives, global resets
components/
  Toolbar.tsx                 — Sticky top toolbar
  PanelLayout.tsx             — Three-panel responsive container with draggable dividers
  controls/
    ControlsPanel.tsx         — Left sidebar wrapper
    AccordionSection.tsx      — Collapsible section with chevron
    ColourPicker.tsx          — Swatch + hex input + popover picker + CFA palette + off-brand badge
    SliderControl.tsx         — Labelled range slider with live value
    SelectControl.tsx         — Labelled dropdown
  preview/
    PreviewPanel.tsx          — Centre panel wrapper
    PreviewToolbar.tsx        — Page tabs + viewport toggle + zoom
    MoodleShell.tsx           — CSS variable container wrapping pages
    MoodleNavbar.tsx          — Navbar component (shared across pages)
    DashboardPage.tsx         — Dashboard replica
    CoursePage.tsx            — Course page replica
    LoginPage.tsx             — Login page replica
    CourseCard.tsx             — Reusable course card component
    CourseDrawer.tsx           — Left course index drawer (Moodle 4.x)
    ActivityRow.tsx            — Reusable activity item row (icon + name + action)
    SecondaryNav.tsx           — Secondary navigation tabs component
  audit/
    AuditPanel.tsx            — Right sidebar wrapper
    ScoreBadge.tsx            — Circular percentage ring
    ContrastCard.tsx          — Single colour pair check
    ColourBlindFilter.tsx     — SVG filter dropdown
    AccessibilityChecklist.tsx
  export/
    ExportSection.tsx         — Export buttons + reminder
    MoodlePaths.tsx           — Collapsible path reference
    ScssPreview.tsx           — Code block with generated SCSS
  SaveModal.tsx               — Save configuration modal
  LoadModal.tsx               — Load configuration modal/dropdown
  CompareMode.tsx             — Split-screen comparison
  Toast.tsx                   — Toast notification component
lib/
  accessibility.ts            — WCAG contrast calculation functions
  colour-blindness.ts         — SVG filter colour matrices
  scss-generator.ts           — Token → SCSS template generation
  moodle-paths.ts             — Control → Moodle admin path mapping
  tokens.ts                   — Default values, TypeScript types, CFA palette definition
store/
  theme-store.ts              — Zustand store with undo/redo history
```

---

## PURPOSE (read this first)

This tool is built for **CFA staff** (site administrators, brand leads, accessibility auditors) who manage the CFA Moodle Cloud training platform. Today, every colour or styling change requires them to write SCSS, paste it into Moodle's admin settings, purge caches, and check the result — a slow, risky trial-and-error loop.

**This tool lets them:**
1. Try different colour combinations on a realistic Moodle replica — in bulk, all at once
2. See exactly how each change affects the Dashboard, a Course Page, and the Login Page — in real time
3. Check WCAG accessibility standards during the process (contrast ratios, pass/fail)
4. When happy, copy the generated CSS/SCSS code and paste it directly into Moodle's admin fields
5. The colour effects in the sandbox match the same logic as the official Moodle Cloud site — what you see here is what you get there

**The workflow is:** Pick colours → See preview → Check WCAG → Copy code → Paste into Moodle → Done.

---

## SUMMARY OF REQUIREMENTS

1. **1:1 Moodle Boost replica** matching the real CFA Moodle Cloud site: white navbar, CFA logo, course cards, trial banner, Moodle 4.x secondary navigation tabs, course index drawer, exact spacing and typography
2. **Three page views:** Dashboard (default), Course Page (with drawer + secondary tabs), Login Page — these are the three key pages staff need to preview. All driven by CSS variables.
3. **Brand colour propagation:** Changing Brand Colour auto-updates buttons, links, active states, progress bars, focus rings — exactly like Moodle's `$primary` variable. What the staff sees in the sandbox is what they'll get on the real site.
4. **Left panel:** Colour pickers with CFA palette swatches, sliders, dropdowns — each control shows which Moodle field it maps to (Brand colour setting, Raw initial SCSS variable, or Raw SCSS selector)
5. **Centre panel:** Live preview with page tabs, viewport toggle (desktop/tablet/mobile), zoom control, Moodle 4.x drawer sidebar on course page
6. **Right panel:** Real-time WCAG contrast audit for 10+ colour pairs, pass/fail badges, accessible colour suggestions, colour blindness simulation, additional accessibility checks
7. **Two-part SCSS export:** Separate "Raw initial SCSS" (variables: `$primary`, `$link-color`, `$body-bg`, etc.) and "Raw SCSS" (selector overrides: `.navbar.fixed-top`, `body#page-login-index`, `.secondary-navigation`, etc.) — matching Moodle's two input fields exactly. Staff copies each block and pastes it into the correct field in Moodle admin.
8. **Step-by-step Moodle instructions** in the export panel — tells staff exactly where to go in Moodle admin and what to paste where
9. **Instant feedback:** All changes reflect in < 100ms via CSS custom properties
10. **Undo/redo** with 50-step history
11. **Save/load/compare** configurations (in-memory)
12. **Responsive:** Three panels on desktop, drawers on tablet, tabbed on mobile
13. **Fully accessible tool UI:** Keyboard navigation, ARIA, focus management, skip links, screen-reader friendly
14. **Off-brand colour warnings** when colours don't match CFA palette
15. **Smart export:** Omits unnecessary overrides when values match what `$primary` already handles
16. **Verified selectors:** All CSS selectors in the export have been verified against Moodle Cloud 4.x with Boost theme (February 2026)
