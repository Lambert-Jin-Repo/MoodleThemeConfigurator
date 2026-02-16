# Prompt: CFA Moodle Theme Configurator — Web Application

## Project Brief

Build an interactive, accessibility-first web application that allows administrators of the Centre for Accessibility Australia (CFA) Moodle site to visually design and export Boost theme configurations for MoodleCloud.

The app must provide 7 pre-set WCAG-compliant colour combinations, plus a fully custom mode with colour pickers. Every colour change must instantly update a live, pixel-accurate Moodle Boost preview. The final output is copy-paste-ready SCSS code (Raw Initial SCSS + Raw SCSS) that the admin pastes into MoodleCloud's Boost theme settings.

---

## 1. Target Users & Context

**Who:** Non-technical CFA administrators and support staff who manage cfaa.moodlecloud.com. They are accessibility practitioners — the app itself must lead by example.

**Platform being themed:** MoodleCloud (hosted), Boost theme only. Admins have three input fields in Site administration → Appearance → Themes → Boost:
1. **Brand colour** — a single hex colour picker
2. **Raw initial SCSS** — SCSS variables (e.g., `$primary`, `$body-bg`)
3. **Raw SCSS** — Custom CSS/SCSS rules

The app generates all three outputs from the user's colour selections.

**What they cannot do:** Install custom themes, edit PHP, access server config, or modify Moodle core files.

---

## 2. CFA Brand Identity (Mandatory Reference)

### 2.1 Official Colour Palette

All colours come from the CFA Brand Style Guide. The app must use ONLY these colours (or WCAG-safe derivatives of them) as its starting palette. Users can customise further, but presets are anchored to the brand.

| Name | Hex | PMS | WCAG on White | Usage Notes |
|------|-----|-----|---------------|-------------|
| Dark Gray | `#404041` | Cool Gray 11 C | 10.36:1 ✅ AAA | Body text, dark navbar option |
| Light Gray | `#F0EEEE` | Cool Gray 1 C | — (background) | Breadcrumbs, secondary backgrounds |
| Orange | `#F27927` | 151 C | 2.79:1 ❌ FAIL | **Never as link/text on white.** Only on dark surfaces (navbar hover, footer links, accents) |
| Purple | `#B500B5` | 253 C | 5.78:1 ✅ AA | Can be navbar/primary. Darkened #8A008A = 8.58:1 AAA for links |
| Cyan | `#00BFFF` | 306 C | 2.12:1 ❌ FAIL | **Never as link/text on white.** Only decorative on dark surfaces |
| Teal | `#336E7B` | 5473 C | 5.74:1 ✅ AA | Recommended primary brand colour. Darkened #245058 = 8.89:1 AAA |
| Lime | `#BAF73C` | 389 C | — (accent only) | Only on dark surfaces (nav hover in dark mode) |
| Red | `#F64747` | 1787 C | — (status only) | Danger/error states |

### 2.2 Typeface

**Source Sans Pro Bold** — the official CFA typeface. The app and generated SCSS must use:
```
font-family: "Source Sans Pro", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### 2.3 Logo

The CFA logo uses the 4-colour square icon (lime, lime, orange, cyan on dark background). The app preview should render a simplified version of this icon in the navbar. Note: current logo files have solid black backgrounds with no transparency — the app should flag this to users.

---

## 3. The 7 Pre-Set Theme Options

Each preset is a tested, WCAG-verified combination. All use `$body-bg: #FFFFFF` (white page background) — this is a hard architectural decision because Moodle Boost has dozens of elements that default to white, and tinted body backgrounds create inconsistent block-on-tint artefacts everywhere.

### Option A — "CFA Teal Professional" ⭐ Recommended
- Brand: `#336E7B` | Navbar: Teal (#336E7B) | Links: Teal | Accents: None
- Character: Clean, conservative, monochrome. Maximum familiarity.
- Edit mode ON toggle: White track with teal thumb
- Footer: Dark gray (#404041), light text

### Option B — "CFA Teal & Orange Accent"
- Brand: `#336E7B` | Navbar: Dark Gray (#404041) | Links: Teal | Accents: CFA Orange on dark surfaces
- Character: Energetic, branded. Orange hover on nav, orange footer border, orange section underlines
- Edit mode ON toggle: Orange track with white thumb
- Footer: Dark gray + 4px orange top border

### Option C — "CFA Dark Mode"
- Brand: `#336E7B` | Navbar: Near-black (#1D2125) + orange bottom border | Links: Teal
- Character: Bold, modern. Lime (#BAF73C) nav hover, cyan (#00BFFF) footer links, dark drawer
- Edit mode ON toggle: Lime track with near-black thumb
- Footer: Near-black, cyan links

### Option D — "CFA Purple Spotlight"
- Brand: `#B500B5` | Navbar: Purple (#B500B5) | Links: Dark Purple (#8A008A)
- Character: Creative, distinctive. Purple accents, teal secondary
- Edit mode ON toggle: White track with purple thumb
- Footer: Dark gray

### Option E — "CFA Warm Cream"
- Brand: `#336E7B` | Navbar: Dark Gray (#404041) | Links: Teal | Accents: Orange hover
- Character: Warm, approachable. Cream breadcrumb tint (#F8F5F0), warm card borders (#E8E2D9), gradient login
- Edit mode ON toggle: Orange track with white thumb
- Login: Gradient (dark gray → teal)

### Option F — "CFA High Contrast AAA"
- Brand: `#245058` | Navbar: Near-black (#1D2125) | Links: Dark Teal (#245058, 8.89:1 AAA)
- Character: Maximum accessibility. Larger base font (1.0625rem), 3px focus rings, bold borders, forced underlines
- Edit mode ON toggle: White track with near-black thumb
- Body text: Near-black (#1D2125, 16.20:1 AAA)

### Option G — "CFA Burnt Orange"
- Brand: `#9E4E12` | Navbar: Burnt Orange (#9E4E12, 5.91:1 AA on white) | Links: Burnt Orange
- Character: Warm, bold, memorable. Teal secondary buttons, gradient login
- Edit mode ON toggle: White track with burnt-orange thumb
- Login: Gradient (burnt orange → dark)

---

## 4. Functional Requirements

### 4.1 Preset Selection Panel
- Display all 7 presets as selectable cards/tiles with a visual swatch strip (navbar colour, accent, footer colour) and a short label
- "Recommended" badge on Option A
- Clicking a preset instantly applies all its colours to the live preview and colour controls
- One additional tile for "Custom" mode that unlocks all colour pickers

### 4.2 Custom Colour Controls
- When a preset is active, colour pickers show the preset values but are locked/dimmed. Users can click "Customise" to unlock them (which switches to Custom mode, seeded with the current preset values)
- Colour controls required (each with a hex input field AND a visual colour picker wheel/swatch):

| Control | What It Sets | Constraint |
|---------|-------------|-----------|
| **Primary Brand Colour** | `$primary`, navbar bg (unless overridden), buttons, links | Must pass WCAG AA (4.5:1) on white. Show live contrast badge. |
| **Navbar Background** | `.navbar { background-color }` | Auto-determines whether nav text is white or dark |
| **Navbar Text / Hover** | Nav link colour, hover colour | Must pass AA on navbar bg |
| **Link Colour** | `$link-color`, `a { color }` | Must pass AA on white (#FFFFFF). Block/warn if fails. |
| **Button Primary** | `.btn-primary { background }` | Must pass AA for white text on this colour |
| **Footer Background** | `#page-footer { background }` | Auto-determines footer text light/dark |
| **Footer Accent** | Optional top border colour on footer | Can be "none" |
| **Login Page Background** | `#page-login-index { background }` | Solid colour or gradient toggle |
| **Edit Mode ON Colour** | `.form-check-input:checked { background }` | Must be visible on navbar bg |
| **Breadcrumb Background** | `.breadcrumb { background }` | Subtle tint, or transparent |
| **Section Accent** | Optional underline colour for course section headings | Can be "none" |
| **Focus Ring Colour** | `*:focus { outline-color }` | Should be visible on white AND on the navbar |

### 4.3 Live Contrast Checker (Critical)
- Every colour pairing in the preview must display a real-time contrast ratio badge (e.g., "5.7:1 AA ✅" or "2.8:1 ✗")
- Minimum pairings to check and display:
  - Link colour vs. page background (#FFFFFF)
  - Body text vs. page background
  - Nav text vs. navbar background
  - Edit mode label vs. navbar background
  - Footer text vs. footer background
  - Button text (white) vs. button primary colour
- If any pairing drops below 4.5:1 (AA for normal text), show a warning badge. If below 3:1, show a red error badge and prevent SCSS export until fixed.
- Use the standard WCAG 2.x relative luminance formula.

### 4.4 Live Moodle Preview (Core Feature)

The preview must render an accurate visual replica of a MoodleCloud Boost site. It must include:

**Navbar:**
- Background colour with correct nav text colour
- CFA 4-square logo icon (simplified) as compact logo
- "CFA" text as brand name
- Hamburger menu icon
- "Dashboard" and "My courses" nav links with hover states (showing hover background + hover colour)
- Edit mode toggle: a form-switch (`.form-check.form-switch`) with "Edit mode" label text + sliding toggle track + thumb dot — **not** a button. OFF state: translucent track on navbar. ON state: accent-coloured track with contrasting thumb.
- User avatar circle (placeholder)
- Notification bell icon

**Breadcrumb:** Tinted or transparent bar below navbar

**Content area (always white #FFFFFF):**
- A course card with heading, section accent underline (if enabled), body text, link text, primary button, secondary button
- All with correct colours and hover states on interaction

**Footer:**
- Background colour, text colour, link colour, optional accent border
- "© Centre for Accessibility Australia" + "Support" link

**Login page (separate tab/toggle in preview):**
- Full login page with background colour/gradient
- Centred login card with border/accent treatment
- CFA logo, username/password fields, login button with correct colour

**Sidebar / Drawer (for Option C):**
- If the preset defines a dark drawer, show a dark sidebar panel

**Responsive:** The preview should have a "Desktop / Tablet / Mobile" toggle to show the layout at different breakpoints (navbar collapse behaviour, stacked layout).

### 4.5 SCSS Export

A prominent "Export SCSS" button that opens a modal/panel with three clearly labelled, copy-ready code blocks:

1. **Brand Colour** — The single hex value to paste into the Brand colour picker
2. **Raw Initial SCSS** — All `$variable` definitions
3. **Raw SCSS** — All CSS/SCSS rules

Each block must have a one-click "Copy to clipboard" button.

Also include a "Download as .txt" option that saves all three blocks into a single file with clear section headers and instructions.

Below the code blocks, show a step-by-step instruction panel:
1. Log in to cfaa.moodlecloud.com as admin
2. Go to Site administration → Appearance → Themes → Boost
3. Enter the Brand colour hex
4. Expand "Advanced settings"
5. Paste Raw Initial SCSS into the first box
6. Paste Raw SCSS into the second box
7. Click Save changes
8. Go to Site administration → Development → Purge all caches
9. Test in incognito/private browsing

### 4.6 SCSS Generation Rules (Hard Constraints)

The generated SCSS must follow these rules from our verified v6 configuration:

**Page background:** Always `$body-bg: #FFFFFF`. Never generate a tinted body background — dozens of Moodle elements default to white, creating patchy block-on-tint artefacts.

**Navbar admin UI:** Must include ALL of the following selectors to prevent invisible text:
```scss
// Base catch-all
.navbar { color: {NAV_TEXT} !important; }
// Specific elements
.navbar .navbar-brand { color: {NAV_TEXT} !important; }
.navbar .btn-open-nav { color: {NAV_TEXT} !important; }
.navbar .fa, .navbar .icon, .navbar [class*="bi-"] { color: {NAV_TEXT} !important; }
// Nav links
.navbar .primary-navigation .nav-link { color: {NAV_TEXT} !important; }
// Edit mode (Moodle 4.2+/5.0 form-switch)
.navbar .editmode-switch-form .form-check-label { color: {NAV_TEXT} !important; }
.navbar .editmode-switch-form .form-check-input { /* translucent track */ }
.navbar .editmode-switch-form .form-check-input:checked { /* accent track + SVG thumb */ }
.navbar .editmode-switch-form .btn { /* older Moodle fallback */ }
// User menu
.navbar .usermenu .login, .navbar .usermenu .usertext,
.navbar .usermenu .userbutton, .navbar .usermenu .btn { color: {NAV_TEXT} !important; }
.navbar .action-menu-trigger { color: {NAV_TEXT} !important; }
.navbar .popover-region .nav-link { color: {NAV_TEXT} !important; }
```

**Nav link hover:** Must use `background-color: rgba(0,0,0,0.2)` (or `rgba(255,255,255,0.08)` for very dark navbars) — never let Boost's default white hover background appear.

**Dropdowns on white:** All dropdown/popover content from the navbar must have dark text:
```scss
.navbar .dropdown-menu, .navbar .popover-region-container,
.navbar .usermenu .dropdown-menu {
  .dropdown-item, .nav-link, a { color: #404041 !important; }
}
```

**Edit mode toggle SVG thumb:** Use an inline SVG data URI for the checked toggle thumb colour:
```scss
background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23{THUMB_HEX}'/%3e%3c/svg%3e") !important;
```

**Links:** Always include `text-decoration: underline` (WCAG 1.4.1 — colour alone must not be the only way to identify links).

**Focus:** Always include a visible `outline` on `*:focus` with `outline-offset: 2px`.

**Orange/Cyan on white:** The generator must BLOCK `#F27927` and `#00BFFF` (and similar failing colours) from being used as link colour or body text on white. These fail WCAG AA. Show a clear error message explaining why.

---

## 5. Accessibility Requirements (WCAG 2.2 AA)

The app itself must meet WCAG 2.2 Level AA. This is non-negotiable — CFA is an accessibility organisation.

### 5.1 Perceivable
- All images/icons have text alternatives
- Colour is never the sole means of conveying information (contrast badges use text + colour)
- Text resizes to 200% without loss of content
- All colour pickers have an associated text hex input for keyboard/screen reader users

### 5.2 Operable
- Fully keyboard navigable: Tab through all controls, Enter/Space to activate, Escape to close modals
- Visible focus indicators on every interactive element (use the CFA teal #336E7B focus ring)
- No keyboard traps
- Skip navigation link
- Colour pickers must be operable via keyboard (hex input is the primary method; the visual picker is an enhancement)

### 5.3 Understandable
- Clear labels on all form controls (not just placeholders)
- Error messages are specific: "Link colour #F27927 has a 2.79:1 contrast ratio on white. WCAG AA requires at least 4.5:1. Choose a darker colour."
- Consistent navigation and layout
- Language is plain English, no jargon

### 5.4 Robust
- Semantic HTML: `<main>`, `<nav>`, `<section>`, `<form>`, `<label>`, `<button>` (not `<div>` with click handlers)
- ARIA landmarks and roles where needed
- Works with screen readers (VoiceOver, NVDA, JAWS)
- Works in latest Chrome, Firefox, Safari, Edge

### 5.5 Specific Patterns
- Colour pickers: Use `<input type="color">` paired with `<input type="text">` for hex, with `<label>` and `aria-describedby` linking to the contrast badge
- Preset cards: Use `role="radiogroup"` with `role="radio"` and `aria-checked`
- Live preview: Use `aria-live="polite"` region that announces when colours change (e.g., "Navbar colour updated to teal, contrast ratio 13.2 to 1, passes triple A")
- Export modal: Focus trapped inside modal, Escape to close, return focus to trigger button

---

## 6. Technical Architecture

### 6.1 Recommended Stack
- **React** (functional components with hooks) — for reactive colour state and instant preview updates
- **Tailwind CSS** for the app's own UI (NOT for the Moodle preview — the preview uses inline styles matching actual Moodle Boost)
- **No backend required** — everything runs client-side. The SCSS is generated in the browser.

### 6.2 State Management
- Central state object holding all colour values + the active preset key (or "custom")
- When a preset is selected, populate all colour values from the preset definition
- When any colour is changed manually, switch to "custom" mode
- Derive computed values from state: contrast ratios, pass/fail badges, auto light/dark text decisions

### 6.3 Contrast Calculation
Implement the WCAG 2.x relative luminance and contrast ratio formulas:
```javascript
function relativeLuminance(hex) {
  const [r, g, b] = hexToRgb(hex).map(c => {
    c = c / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}
```

### 6.4 Auto Light/Dark Text
When the user picks a navbar or footer background colour, automatically determine whether text should be white (#FFFFFF) or dark (#404041):
```javascript
const textColour = relativeLuminance(bgHex) > 0.179 ? "#404041" : "#FFFFFF";
```

### 6.5 SCSS Template Engine
Maintain a SCSS template string with `{PLACEHOLDER}` tokens. When exporting, replace tokens with the current colour values. Ensure the generated SCSS includes every selector from Section 4.6.

---

## 7. UI Layout & Design

### 7.1 Overall Layout
```
┌─────────────────────────────────────────────────┐
│  Header: CFA Logo + "Moodle Theme Configurator" │
├────────────┬────────────────────────────────────┤
│            │                                    │
│  Left      │     Live Moodle Preview            │
│  Panel     │     (Course Page / Login Page       │
│            │      / Dashboard tabs)              │
│  Presets   │                                    │
│  +         │     [Desktop] [Tablet] [Mobile]    │
│  Colour    │                                    │
│  Controls  │                                    │
│  +         ├────────────────────────────────────┤
│  Contrast  │     Contrast Summary Panel         │
│  Summary   │     (all pairings with badges)     │
│            │                                    │
├────────────┴────────────────────────────────────┤
│  [Export SCSS]  [Reset to Preset]  [Share URL]  │
└─────────────────────────────────────────────────┘
```

### 7.2 Mobile Layout
- Stack: Preview on top, controls below
- Collapsible accordion for colour controls
- Sticky export button at bottom

### 7.3 Visual Style of the App Itself
- Use CFA brand colours: Teal primary, Dark Gray text, Light Gray backgrounds, Source Sans Pro font
- Clean, minimal, generous whitespace
- Cards with subtle shadows (matching CFA brand guide's layout element hierarchy)
- The app should feel like a CFA product

---

## 8. Advanced Features (Nice to Have)

### 8.1 Shareable URL
Encode the current colour configuration into a URL query string so users can share a theme preview link with colleagues.

### 8.2 Side-by-Side Compare
Let users pin one preset and compare it against their custom configuration side by side.

### 8.3 Dark Mode for the App
Toggle the configurator app itself between light and dark mode (independent of the Moodle theme being designed).

### 8.4 Colour Harmony Suggestions
When a user picks a custom primary colour, suggest complementary/analogous colours from the CFA palette that would work well together.

### 8.5 Export as JSON
Export the full colour configuration as a JSON file that can be re-imported later. This allows saving and sharing configurations without URLs.

### 8.6 Accessibility Audit Report
Generate a downloadable report listing every colour pairing, its contrast ratio, WCAG level (AA/AAA/fail), and the specific WCAG criterion it satisfies (1.4.3 Minimum Contrast, 1.4.6 Enhanced Contrast).

---

## 9. Validation & Testing Checklist

Before shipping, the app must pass:

- [ ] All 7 presets generate valid SCSS that compiles without error
- [ ] Generated SCSS applied to a real MoodleCloud Boost theme produces the expected visual result
- [ ] All colour pairings in every preset pass WCAG 2.2 AA (4.5:1 for normal text, 3:1 for large text)
- [ ] Custom mode blocks export when any text-on-background pairing fails AA
- [ ] Edit mode toggle renders correctly in preview (OFF: translucent, ON: accent colour)
- [ ] Nav hover shows dark overlay background (not white flash)
- [ ] Dropdown menus in preview show dark text on white background
- [ ] Keyboard navigation works for all controls including colour pickers
- [ ] Screen reader announces colour changes, contrast ratios, and errors
- [ ] App meets WCAG 2.2 AA itself (test with axe DevTools, Lighthouse, and manual screen reader)
- [ ] Works in Chrome, Firefox, Safari, Edge (latest)
- [ ] Responsive from 320px to 2560px width

---

## 10. Key Lessons Learned (From Our Configuration Work)

These hard-won lessons must be baked into the app's logic:

1. **Never use tinted body backgrounds.** Moodle Boost has too many white-default elements. Always `$body-bg: #FFFFFF`.

2. **The Edit Mode toggle is a form-switch, not a button.** In Moodle 4.2+/5.0, target `.form-check-label` and `.form-check-input`, not `.btn`.

3. **Navbar hover must override Boost's default.** Boost applies a white/light background on `.nav-link:hover`. Our SCSS must force a dark overlay (`rgba(0,0,0,0.2)` or `rgba(255,255,255,0.08)`).

4. **Orange (#F27927) and Cyan (#00BFFF) fail WCAG on white.** They are accent-only colours, safe on dark surfaces but never for text on light backgrounds.

5. **Every element inside `.navbar` needs explicit colour.** Moodle adds user menu text, notification icons, settings gear, and edit mode controls inside the navbar — all need white/light text when the navbar is dark.

6. **Dropdown menus open on white backgrounds** even from a dark navbar. They need dark text overrides.

7. **Logo files need transparent backgrounds.** Current CFA logos have solid black backgrounds. The app should display a warning about this.

8. **Always include older Moodle fallback selectors** (`.editmode-switch-form .btn`) alongside the modern form-switch selectors.

9. **After applying SCSS, users must Purge All Caches** and test in incognito. Include this in export instructions.

---

## 11. Reference Materials

- CFA Brand Style Guide (PDF) — colour palette, typeface, logo usage, layout hierarchy
- CFA Moodle Administration Training Guide (Phase 2) — Boost theme settings location, MoodleCloud constraints
- Moodle Boost theme documentation: docs.moodle.org/en/Boost_theme
- WCAG 2.2 specification: w3.org/TR/WCAG22/
- Moodle SCSS customisation: docs.moodle.org/en/Boost_theme#Raw_SCSS
