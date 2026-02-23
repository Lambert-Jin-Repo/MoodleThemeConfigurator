# Moodle Cloud Constraints & Theming Reference

> Research-verified as of February 2026. The CFA site is hosted on Moodle Cloud (Standard plan).
> This is the single reference for Moodle Cloud platform limits, SCSS theming, dark theme support, verified selectors, and preset creation.

---

## 1. What Moodle Cloud Allows

### Theme Settings

| Setting | Admin Path | Accepts |
|---|---|---|
| Brand colour | `Site admin > Appearance > Themes > Boost > General settings > Brand colour` | Single hex value |
| Background image | `Site admin > Appearance > Themes > Boost > General settings > Background image` | File upload (JPG/PNG, 1920x1080, <150dpi) |
| Login background image | `Site admin > Appearance > Themes > Boost > General settings > Login background image` | File upload |
| Theme preset | `Site admin > Appearance > Themes > Boost > General settings > Theme preset` | Default or Plain |
| Raw initial SCSS | `Site admin > Appearance > Themes > Boost > Advanced settings > Raw initial SCSS` | SCSS variable declarations |
| Raw SCSS | `Site admin > Appearance > Themes > Boost > Advanced settings > Raw SCSS` | CSS/SCSS rule overrides |
| Full logo | `Site admin > Appearance > Logos > Logo` | File upload |
| Compact logo (navbar) | `Site admin > Appearance > Logos > Small logo` | File upload (100x100) |
| Favicon | `Site admin > Appearance > Logos > Favicon` | File upload |
| Site name | `Site admin > General > Site home settings > Full site name` | Text |
| Custom menu items | `Site admin > Appearance > Advanced theme settings > Custom menu items` | Text (Link\|URL format) |
| Additional HTML | `Site admin > Appearance > Additional HTML` | HTML/CSS/JS injection |
| Purge caches | `Site admin > Development > Purge all caches` | Button click |

### What Moodle Cloud CANNOT Do

- Install custom or third-party themes (Boost only)
- Install plugins from the Moodle Plugin Directory
- Access file system (no FTP/SSH)
- Modify PHP, Mustache templates, or theme files
- Control Moodle version or upgrade timing (auto-upgraded)
- Override settings marked "Defined in config.php"
- Switch to Classic theme (removed from current plans)

---

## 2. SCSS Compilation Order

```
1. theme_boost_get_pre_scss()    <-- Brand colour -> $brand-primary variable
2. Raw initial SCSS field        <-- YOUR VARIABLES (Block 1)
3. Bootstrap 4/5 _variables.scss <-- Uses !default, so your values win
4. Moodle's own SCSS files       <-- theme/boost/scss/**
5. Raw SCSS field                <-- YOUR OVERRIDES (Block 2)
```

### Block 0: Brand Colour

A single hex value pasted into **Site admin > Appearance > Themes > Boost > General settings > Brand colour**. Maps to `$brand-primary` internally. This is `tokens.brandPrimary`.

### Block 1: Raw Initial SCSS (Bootstrap $variables)

- Injected BEFORE all other SCSS
- Variables use `!default` in Bootstrap, so declaring them here overrides the defaults
- Contains: `$primary`, `$body-bg`, `$body-color`, `$card-bg`, `$font-size-base`, `$btn-border-radius`, `$activity-icon-colors`, etc.
- Example:
  ```scss
  $primary: #336E7B;
  $link-color: #336E7B;
  $body-bg: #f5f5f5;
  $font-size-base: 0.875rem;
  ```

### Block 2: Raw SCSS (CSS rule overrides)

- Appended AFTER all other SCSS
- Both valid SCSS and plain CSS work here (SCSS is a superset of CSS)
- Use for anything not controllable via variables (navbar bg, login page, etc.)
- Example:
  ```scss
  .navbar.fixed-top {
    background-color: #404041 !important;
  }
  ```

### $primary Variable Propagation

Setting `$primary` (or the Brand colour field which maps to `$brand-primary`) automatically affects:
- `.btn-primary` background and border
- Link colours (if `$link-color` not separately set)
- `.form-control:focus` border colour
- Progress bar fills (`.progress-bar`)
- Active navigation states
- Checkbox/radio accent colours
- Dropdown active item backgrounds
- Focus ring colours
- Badge backgrounds

This is WHY the sandbox must replicate this cascading behaviour -- it's the single most impactful setting.

---

## 3. Verified CSS Selectors

Tested against Moodle 4.x Boost theme. Some may need updating for Moodle 5.x.

### High Confidence (Verified in docs/forums/source)

| Target | Selector | Notes |
|---|---|---|
| Navbar background | `.navbar.fixed-top` | Has `.bg-white` class -- needs `!important` |
| Navbar links | `.navbar.fixed-top .nav-link, .navbar.fixed-top .navbar-brand` | |
| Login page body | `body#page-login-index` | Moodle body ID convention |
| Login container | `.login-container` | In `login.mustache` template |
| Login heading | `.login-heading` | `h1.login-heading` or `h2.login-heading` |
| Login form inputs | `.login-form input[type="text"], .login-form input[type="password"]` | |
| Login button | `#loginbtn` | Stable ID |
| Secondary nav active | `.secondary-navigation .nav-tabs .nav-link.active` | Moodle 4.0+ |
| Footer | `#page-footer` | In `footer.mustache` |
| Progress bars | `.progress-bar` | Bootstrap class |
| Alerts | `.alert-info` | Bootstrap class |

### Medium Confidence (Convention-based, verify per version)

| Target | Selector | Notes |
|---|---|---|
| Dashboard page | `body#page-my-index` | Body ID from `/my/index.php` |
| Dashboard cards | `.card.dashboard-card` | May vary between versions |
| Course drawers | `.drawer` | Generic drawer class in Moodle 4.x |
| Course index drawer | `#theme_boost-drawers-courseindex` | Naming convention, verify in DevTools |
| Block drawer | `#theme_boost-drawers-blocks` | Naming convention, verify in DevTools |
| Content max width | `#page.drawers .main-inner` | Verify against specific version |

### Real-Site Verified Dark Theme Selectors (2026-02-23)

These selectors were verified by applying the CFA Dark Lime preset to a live MoodleCloud instance. Without overrides, all default to white backgrounds or invisible text on dark themes.

#### Course Content Page

| Selector | Issue | Fix |
|---|---|---|
| `.activity-item`, `.activity-basis`, `.activity-info` | White background on activity rows | `background-color: transparent` |
| `.course-content .section`, `.course-section` | White section containers | `background-color: transparent` |
| `#region-main`, `#page-content`, `.course-content` | White main content wrapper | `background-color: pageBg` |
| `.dimmed`, `.isrestricted`, `.ishidden` | "Hidden from students" banners -- invisible text | `background: rgba(255,255,255,0.05)`, `color: mutedText` |
| `.completioninfo`, `.activity-completion` | White completion status area | `background: transparent`, `color: bodyText` |
| `.sectionname a`, `.course-content h3.sectionname` | Section header text invisible | `color: headingText` |
| `.activityiconcontainer` | Icon backgrounds black/invisible | Explicit purpose-colour background per class |
| `.badge.bg-secondary`, `.text-dark` | "Hidden from students" badge unreadable | `bg: cardBorder`, `color: bodyText` |
| `.activity-navigation .btn` | White buttons invisible on dark bg | `background: bodyText` |
| `.activity-navigation .btn .icon` | White arrow icons invisible on dark bg | `color: #404041` |

#### My Courses / Course Cards

| Selector | Issue | Fix |
|---|---|---|
| `.dashboard-card-deck .dashboard-card .card-body` | White card body | `background-color: cardBg` |
| `.dashboard-card-deck .dashboard-card .card-footer` | White card footer (progress area) | `background-color: cardBg` |
| `.block_myoverview .card`, `.card-body`, `.card-footer` | My courses block cards | `background-color: cardBg` |
| `.categoryname`, `.categoryname.text-truncate` | Invisible category label | `color: mutedText` |
| `.dashboard-card-footer`, `.course-info-container` | White progress area | `background-color: cardBg` |
| `.progress-text`, `.progress .text`, `.progress .small` | Invisible progress percentage text | `color: mutedText` -- check for ALL themes, not just dark |

#### Site Administration

| Selector | Issue | Fix |
|---|---|---|
| `.secondary-navigation .nav-tabs .nav-link:hover` | White hover bg makes text invisible | `background: secondaryNavActive`, `color: autoTextForHex()`, `font-weight: 700` |
| `.adminlink`, `.admintree`, `#adminsettings` | White admin tree rows | `background-color: transparent` |
| `.generalbox`, `.well`, `.alert-info` | White content boxes | `background-color: cardBg` |

#### Key Takeaway

Moodle Boost has **many nested containers** that each set their own `background-color: #fff`. The `$body-bg` variable alone does NOT cascade to all of them. Each must be individually overridden in Block 2. When testing dark themes, always check:
1. Dashboard page (cards, progress, calendar)
2. Course content page (activity list, sections, hidden items)
3. My courses page (card grid, category labels)
4. Site administration (tabs, tree, admin panels)
5. Login page (card, inputs, links)

### How to Verify Selectors

1. Open the real CFA Moodle site in Chrome
2. Right-click an element > Inspect
3. Confirm the selector exists in the DOM
4. Check Moodle version at `Site admin > Notifications`
5. If Moodle 5.x, check for Bootstrap 5 class name changes (`.ml-*` > `.ms-*`, etc.)

---

## 4. Dark Theme Detection & Auto-Overrides

### `isDarkBg()` Detection

The SCSS generator auto-detects dark themes by computing the relative luminance of `pageBg`:

```typescript
function isDarkBg(hex: string): boolean {
  // sRGB to linear conversion
  const lum = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return lum < 0.179;
}
```

**Threshold: 0.179** (W3C relative luminance midpoint).

### `autoTextForHex()` Utility

```typescript
// Returns '#FFFFFF' for dark backgrounds, '#404041' for light backgrounds
function autoTextForHex(bgHex: string): string {
  return isDarkBg(bgHex) ? '#FFFFFF' : '#404041';
}
```

Used in SCSS output for token-driven text colours that adapt to their background (nav hover text, button text, etc.).

### What `isDarkBg(pageBg) === true` Triggers

**In Block 1 (variables):**
- `$body-color` -- primary text colour
- `$input-color` / `$input-bg` / `$input-border-color` -- form controls
- `$table-color` -- table text
- `$dropdown-bg` / `$dropdown-color` / `$dropdown-link-color` / `$dropdown-border-color` -- dropdowns

**In Block 2 (CSS rules) -- comprehensive overrides for:**
- Page wrapper containers (`#page`, `#page-wrapper`, `#topofscroll`, `.main-inner`, `#region-main-box`)
- Secondary navigation background
- Breadcrumb area (falls back to `pageBg` if breadcrumbBg is `transparent`)
- Card text (`.card`, `.card-body`, `.card-title`, `.card-text`, `.card-footer`)
- Moodle blocks (timeline, recently accessed courses, overview, calendar)
- Muted/secondary text (`.text-muted`, `.text-secondary`, `small`, `.dimmed_text`)
- Progress bars (dark track background)
- Dashboard card footers and course info containers
- Activity completion and availability info
- Course section headers and hidden sections
- Comment areas
- Form controls (inputs, selects, textareas) with placeholder styling
- Form labels, tables (including calendar grid)
- All dropdown menus (site-wide)
- Secondary nav tab text
- Breadcrumb text and separators
- Course content area, activity items, sections
- Secondary/outline buttons
- Login page text (if loginBg is also dark)
- Popovers, tooltips, list-group items
- Badge overrides (`.bg-secondary`, `.text-dark`)
- Activity icon container backgrounds (per purpose)

---

## 5. Required Tokens for Dark Presets

When `pageBg` luminance < 0.179, **all** of the following tokens must be explicitly set. Missing any will cause readability or visual issues.

### Text Colours

| Token | Purpose | Typical Dark Value |
|---|---|---|
| `bodyText` | Primary body text | `#F0EEEE` or `#FFFFFF` |
| `headingText` | h1-h6 headings | `#FFFFFF` |
| `mutedText` | Helper labels, timestamps, categories | `#A0A0A1` (mid-grey) |

### Card Containers

| Token | Purpose | Typical Dark Value |
|---|---|---|
| `cardBg` | Card background, also used for inputs/dropdowns in dark mode | `#2D2D2E` |
| `cardBorder` | Card borders, progress track, table borders | `#555556` |

### Top Navigation

| Token | Purpose | Typical Dark Value |
|---|---|---|
| `navbarBg` | Navbar background | `#1D2125` |
| `navbarText` | Navbar text, icons, links | `#F0EEEE` |

### Footer

| Token | Purpose | Typical Dark Value |
|---|---|---|
| `footerBg` | Footer background | `#1D2125` |
| `footerText` | Footer text | `#F0EEEE` |
| `footerLink` | Footer link colour (WCAG-checked against footerBg) | `#BAF73C` or `#F0EEEE` |

### Side Drawers

| Token | Purpose | Typical Dark Value |
|---|---|---|
| `drawerBg` | Drawer background | `#1D2125` |
| `drawerText` | Drawer text and link colour | `#F0EEEE` |
| `drawerBorder` | Drawer border colour | `#404041` |

### Login Page

| Token | Purpose | Typical Dark Value |
|---|---|---|
| `loginBg` | Login page background | `#1D2125` |
| `loginCardBg` | Login card/form container | `#2D2D2E` |
| `loginBtnBg` | Login button background | Accent colour |
| `loginBtnText` | Login button text (set via luminance of loginBtnBg) | `#1D2125` or `#FFFFFF` |
| `loginHeading` | Login page heading colour | Accent colour |
| `signupBtnBg` | Signup button on login page | `#555556` or accent |

### Course Navigation

| Token | Purpose | Typical Dark Value |
|---|---|---|
| `secondaryNavActive` | Active tab underline and hover bg colour | Accent colour |
| `secondaryNavText` | All tab link text (non-active) | `#F0EEEE` |

### Other

| Token | Purpose | Typical Dark Value |
|---|---|---|
| `breadcrumbBg` | Breadcrumb area background; set explicitly, not `transparent` | `#333334` or same as `pageBg` |
| `progressFill` | Progress bar fill colour | Accent colour |

---

## 6. WCAG Contrast Rules

### Minimum Ratios

| Context | Minimum Ratio | Standard |
|---|---|---|
| Normal text (< 18px) on background | **4.5:1** | WCAG AA |
| Large text (18px+ or 14px+ bold) on background | **3:1** | WCAG AA |
| Enhanced / AAA target | **7:1** | WCAG AAA |

### CFA Palette Contrast Hazards

| Colour | On White (#FFFFFF) | On Charcoal (#404041) | On Near Black (#1D2125) | Notes |
|---|---|---|---|---|
| Orange `#F27927` | ~2.9:1 FAIL | ~2.8:1 FAIL | ~3.7:1 BORDERLINE | **Contrast dead zone** -- fails on both light and dark for normal text |
| Lime Green `#BAF73C` | ~1.28:1 FAIL | ~8.0:1 PASS | ~10.6:1 PASS | Excellent on dark, catastrophic on white |
| Sky Blue `#00BFFF` | ~2.5:1 FAIL | ~3.5:1 BORDERLINE | ~4.7:1 PASS | Marginal; avoid for body text |
| Teal `#336E7B` | ~4.7:1 PASS | ~1.8:1 FAIL | ~2.3:1 FAIL | Good on white, bad on dark |
| Purple `#B500B5` | ~4.5:1 PASS | ~1.7:1 FAIL | ~2.2:1 FAIL | Borderline on white, fails on dark |

### `autoTextColour()` Utility

```typescript
// Returns '#404041' (Charcoal) for light backgrounds, '#FFFFFF' for dark backgrounds
export function autoTextColour(bgHex: string): string {
  return lum > 0.179 ? '#404041' : '#FFFFFF';
}
```

Use this for any token where text colour depends on its background (navbarText, footerText, drawerText, loginBtnText, etc.).

### `BLOCKED_COLOURS`

The following colours are blocked from being used as link or text colour on white backgrounds:

```typescript
export const BLOCKED_COLOURS = ['#F27927', '#00BFFF'] as const;
```

---

## 7. Activity Icon Colours

Moodle 4.x uses purpose-based icon backgrounds -- white monochrome SVG icons on coloured circles. Customised via the `$activity-icon-colors` SCSS map in Block 1.

| Purpose | Default | Activities |
|---|---|---|
| `administration` | `#5d63f6` | Admin tools |
| `assessment` | `#11a676` | Quiz, Assignment |
| `collaboration` | `#eb66a2` | Wiki, Database, Glossary |
| `communication` | `#f7634d` | Forum, Chat |
| `content` | `#399be2` | Page, URL, File, Book |
| `interface` | `#a378ff` | Label, LTI |

**Tokens:** `actIconAdmin`, `actIconAssessment`, `actIconCollaboration`, `actIconCommunication`, `actIconContent`, `actIconInterface`

**Rules:**
- Only output the map when at least one colour differs from defaults
- **Always include all 6 values** in the map -- partial maps break SCSS compilation
- For dark themes, consider using lighter/brighter icon colours for visibility
- For brand-aligned presets, map the primary brand colour to `content` (most common) or `assessment`

**Example SCSS output (Block 1):**
```scss
$activity-icon-colors: (
    "administration": #BAF73C,
    "assessment": #BAF73C,
    "collaboration": #B500B5,
    "communication": #F27927,
    "content": #336E7B,
    "interface": #A378FF
);
```

**Dark theme note:** Activity icon containers (`.activityiconcontainer`) also need explicit background-color overrides in Block 2 for dark themes, as the default rendering can make them invisible. The generator handles this automatically per purpose class.

---

## 8. Preset Template Checklist

Follow this checklist when creating any new `PresetTemplate` in `lib/tokens.ts`.

### Step 1: Define Colour Palette

- [ ] Choose a primary brand colour (`brandPrimary`)
- [ ] Choose accent colour(s) for interactive elements
- [ ] Choose background colours (`pageBg`, `navbarBg`, `footerBg`)
- [ ] Choose text colours appropriate for each background

### Step 2: Determine Light vs Dark

- [ ] Check `pageBg` luminance: compute relative luminance or use `isDarkBg()`
- [ ] If luminance < 0.179 --> **dark theme**, proceed to Step 3
- [ ] If luminance >= 0.179 --> light theme, skip to Step 4

### Step 3: Set ALL Required Dark Tokens

- [ ] `bodyText` -- readable on `pageBg` (4.5:1 minimum)
- [ ] `headingText` -- readable on `pageBg`
- [ ] `mutedText` -- lighter than bodyText but still readable (4.5:1 on pageBg)
- [ ] `cardBg` -- distinct from `pageBg` but still dark
- [ ] `cardBorder` -- visible against both `cardBg` and `pageBg`
- [ ] `navbarBg` + `navbarText`
- [ ] `footerBg` + `footerText` + `footerLink`
- [ ] `drawerBg` + `drawerText` + `drawerBorder`
- [ ] `loginBg` + `loginCardBg` + `loginBtnBg` + `loginBtnText` + `loginHeading`
- [ ] `secondaryNavActive` + `secondaryNavText`
- [ ] `breadcrumbBg` (set explicitly, do not leave as `transparent`)
- [ ] `progressFill`
- [ ] `signupBtnBg`

### Step 4: Verify WCAG Contrast for Every Text/Background Pair

- [ ] `bodyText` on `pageBg` >= 4.5:1
- [ ] `headingText` on `pageBg` >= 4.5:1
- [ ] `mutedText` on `pageBg` >= 4.5:1
- [ ] `bodyText` on `cardBg` >= 4.5:1
- [ ] `navbarText` on `navbarBg` >= 4.5:1
- [ ] `footerText` on `footerBg` >= 4.5:1
- [ ] `footerLink` on `footerBg` >= 4.5:1
- [ ] `drawerText` on `drawerBg` >= 4.5:1
- [ ] `btnPrimaryText` on `btnPrimaryBg` >= 4.5:1
- [ ] `loginBtnText` on `loginBtnBg` >= 4.5:1
- [ ] `linkColour` on `pageBg` >= 4.5:1 (or `cardBg` if links appear in cards)
- [ ] CFA Orange (`#F27927`) is NOT used as text on any background (contrast dead zone)

### Step 5: Set Context-Sensitive Text Colours

- [ ] `navbarText` = `autoTextColour(navbarBg)`
- [ ] `footerText` = `autoTextColour(footerBg)`
- [ ] `drawerText` = `autoTextColour(drawerBg)`
- [ ] `loginBtnText` = `autoTextColour(loginBtnBg)`
- [ ] `btnPrimaryText` = `autoTextColour(btnPrimaryBg)`

### Step 6: Verify BRAND_LINKED_KEYS Behaviour

Tokens in `BRAND_LINKED_KEYS` auto-update when `brandPrimary` changes. If your preset sets a different value for any of these, it will be treated as a manual override and will NOT auto-update:

```
btnPrimaryBg, linkColour, navActiveUnderline, secondaryNavActive,
progressFill, focusRing, loginBtnBg, footerLink
```

Tokens NOT in this list must be set independently: `loginBg`, `info`, `navbarBg`, `footerBg`, `drawerBg`, `signupBtnBg`.

### Step 6b: Set Activity Icon Colours (Optional)

See Section 7 above. Only needed if the preset wants non-default icon colours.

### Step 7: Test

- [ ] Load preset in the sandbox preview -- check all three pages (dashboard, course, login)
- [ ] Run the contrast audit panel -- zero failures
- [ ] Export SCSS and verify Block 1 + Block 2 output looks correct
- [ ] If possible, paste into a real Moodle Cloud instance and purge caches

---

## 9. Common Mistakes to Avoid

### Missing `$body-color` in Block 1

If `bodyText` is changed from default but `$body-color` is missing from Block 1, all body text defaults to Bootstrap's `#212529` (near-black). On a dark `pageBg`, this makes text **invisible**.

**Fix:** The generator already handles this. Ensure your preset sets `bodyText`.

### Missing Page Wrapper Overrides

Without overrides for `#page`, `#page-wrapper`, `#topofscroll`, `.main-inner`, and `#region-main-box`, white gaps appear between navbar, content area, and footer on dark themes.

**Fix:** The generator auto-includes these when `isDarkBg()` is true. Ensure `pageBg` is set to the dark value.

### Hardcoded Colours in Preview Components

Never use hardcoded hex values like `#e9ecef`, `#1d2125`, or `#ced4da` in preview components. These break when the theme changes between light and dark modes.

**Fix:** All preview components must use `var(--cfa-*)` CSS custom properties.

### `loginBg` and `info` Are NOT Linked to `brandPrimary`

These tokens are NOT in `BRAND_LINKED_KEYS` and must be set independently in every preset.

### Footer Link WCAG Failure

`#F27927` (CFA Orange) fails WCAG on dark `#404041` footer background (~2.8:1 ratio). Use `#F0EEEE` or `#BAF73C` instead.

### Breadcrumb Transparency on Dark Backgrounds

Default `breadcrumbBg` is `transparent`. The generator resolves this to `pageBg` automatically, but for presets, explicitly set `breadcrumbBg` to a visible dark value.

---

## 10. Bootstrap 5 Migration Warning (Moodle 5.x)

- **SCSS variables still work** -- `$primary`, `$body-bg`, etc. are unchanged
- **Utility classes change** -- `.ml-*` > `.ms-*`, `.mr-*` > `.me-*`, `.float-left` > `.float-start`
- **Some component markup changes** -- card, modal, dropdown HTML structure may differ
- **Backward compat layer exists** until Moodle 6.0

The SCSS variables in Block 1 are safe. The CSS selectors in Block 2 may need updating.

---

## 11. Cache Purging

- Saving Boost theme settings via the admin UI triggers `theme_reset_all_caches` automatically
- Manual purge at `Site admin > Development > Purge all caches` as fallback
- Browser cache may also need clearing (Ctrl+Shift+R)
- The sandbox export includes a reminder to purge caches

---

## 12. Risk: Malformed SCSS

Bad SCSS in the Raw SCSS fields can **break the entire site's styling**. The site becomes unusable until the admin reverts the SCSS and purges caches. This is exactly WHY the sandbox tool exists -- to preview safely before applying.

---

## Quick Reference: PresetTemplate Interface

```typescript
export interface PresetTemplate {
  id: string;           // kebab-case identifier
  name: string;         // Display name
  description: string;  // One-line description
  recommended?: boolean; // Show recommended badge
  overrides: Partial<ThemeTokens>; // Only non-default values
}
```

Presets use `Partial<ThemeTokens>` -- only include tokens that differ from `DEFAULT_TOKENS` (Moodle Boost defaults). The Moodle Default preset has an empty `overrides: {}` object.

---

## Source Files

| File | Purpose |
|---|---|
| `lib/tokens.ts` | Token interface, defaults, presets, `autoTextColour()`, `BRAND_LINKED_KEYS` |
| `lib/scss-generator.ts` | `generateScss()` function, `isDarkBg()`, all Block 1/Block 2 logic |
| `components/controls/ControlsPanel.tsx` | UI controls panel for all theme tokens |
