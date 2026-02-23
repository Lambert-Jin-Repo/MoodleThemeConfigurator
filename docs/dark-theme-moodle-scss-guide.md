# Dark Theme & Moodle SCSS Reference Guide

> For agents creating preset templates. Read this before building any dark-mode preset.

---

## 1. How the SCSS Generator Works

The SCSS generator (`lib/scss-generator.ts`) produces three output blocks that map directly to Moodle Cloud Boost theme settings.

### Block 0: Brand Colour

A single hex value pasted into **Site admin > Appearance > Themes > Boost > General settings > Brand colour**.

Maps to `$brand-primary` internally. This is the `tokens.brandPrimary` value.

### Block 1: Raw Initial SCSS (Bootstrap $variables)

Pasted into **Site admin > Appearance > Themes > Boost > Advanced settings > Raw initial SCSS**.

These variables are injected **before** Bootstrap `!default` declarations, so they override Bootstrap defaults. Compilation order:

```
1. theme_boost_get_pre_scss()    <-- Brand colour -> $brand-primary
2. Raw initial SCSS field        <-- YOUR VARIABLES (Block 1)
3. Bootstrap _variables.scss     <-- Uses !default, so your values win
4. Moodle's own SCSS files
5. Raw SCSS field                <-- YOUR OVERRIDES (Block 2)
```

Block 1 contains SCSS variables like `$primary`, `$body-bg`, `$body-color`, `$card-bg`, `$font-size-base`, `$btn-border-radius`, etc.

### Block 2: Raw SCSS (CSS rule overrides)

Pasted into **Site admin > Appearance > Themes > Boost > Advanced settings > Raw SCSS**.

Compiled **after** all other Moodle SCSS. Contains CSS/SCSS rules for things that cannot be controlled via variables alone (navbar background, login page, footer, drawers, etc.).

### Dark Background Detection: `isDarkBg()`

The generator auto-detects dark themes by computing the relative luminance of `pageBg`:

```typescript
function isDarkBg(hex: string): boolean {
  // ... sRGB to linear conversion ...
  const lum = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return lum < 0.179;
}
```

**Threshold: 0.179** (W3C relative luminance midpoint).

When `isDarkBg(pageBg)` returns `true`, the generator automatically adds:

**In Block 1 (variables):**
- `$input-color` / `$input-bg` / `$input-border-color` -- form controls
- `$table-color` -- table text
- `$dropdown-bg` / `$dropdown-color` / `$dropdown-link-color` / `$dropdown-border-color` -- dropdowns

**In Block 2 (CSS rules) -- comprehensive overrides for:**
- Page wrapper containers (`#page`, `#page-wrapper`, `#topofscroll`, `.main-inner`, `#region-main-box`) -- prevents white gaps
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
- Form labels
- Tables (including calendar grid)
- All dropdown menus (site-wide, not just navbar)
- Secondary nav tab text (if non-default)
- Breadcrumb text and separators
- Course content area
- Secondary/outline buttons
- Login page text (if loginBg is also dark)
- Popovers and tooltips
- List-group items (drawers, course index)

---

## 2. Required Tokens for Dark Presets

When `pageBg` luminance < 0.179, **all** of the following tokens must be explicitly set. Missing any of them will cause readability or visual issues.

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
| `cardBorder` | Card borders, also used for progress track, table borders | `#555556` |

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

### Course Navigation

| Token | Purpose | Typical Dark Value |
|---|---|---|
| `secondaryNavActive` | Active tab underline and text colour | Accent colour |
| `secondaryNavText` | All tab link text (non-active) | `#F0EEEE` |

### Other

| Token | Purpose | Typical Dark Value |
|---|---|---|
| `breadcrumbBg` | Breadcrumb area background; set to match `pageBg` if transparent | `#333334` or same as `pageBg` |
| `progressFill` | Progress bar fill colour | Accent colour |
| `signupBtnBg` | Signup button on login page | `#555556` or accent |

### Reference: CFA Dark Lime Preset (complete dark token set)

See the `cfa-dark-lime` preset in `lib/tokens.ts` for a fully working example. It sets all tokens listed above.

---

## 3. WCAG Contrast Rules

### Minimum Ratios

| Context | Minimum Ratio | Standard |
|---|---|---|
| Normal text (< 18px) on background | **4.5:1** | WCAG AA |
| Large text (18px+ or 14px+ bold) on background | **3:1** | WCAG AA |
| Enhanced / AAA target | **7:1** | WCAG AAA |

### CFA Palette Contrast Hazards

| Colour | On White (#FFFFFF) | On Charcoal (#404041) | On Near Black (#1D2125) | Notes |
|---|---|---|---|---|
| Orange `#F27927` | ~2.9:1 FAIL | ~2.8:1 FAIL | ~3.7:1 BORDERLINE | **Contrast dead zone** -- fails on both light and dark backgrounds for normal text |
| Lime Green `#BAF73C` | ~1.28:1 FAIL | ~8.0:1 PASS | ~10.6:1 PASS | Excellent on dark, catastrophic on white |
| Sky Blue `#00BFFF` | ~2.5:1 FAIL | ~3.5:1 BORDERLINE | ~4.7:1 PASS | Marginal; avoid for body text |
| Teal `#336E7B` | ~4.7:1 PASS | ~1.8:1 FAIL | ~2.3:1 FAIL | Good on white, bad on dark |
| Purple `#B500B5` | ~4.5:1 PASS | ~1.7:1 FAIL | ~2.2:1 FAIL | Borderline on white, fails on dark |

### `autoTextColour()` Utility

```typescript
// Returns '#404041' (Charcoal) for light backgrounds, '#FFFFFF' for dark backgrounds
export function autoTextColour(bgHex: string): string {
  // ... sRGB luminance calculation ...
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

## 4. Common Mistakes to Avoid

### Missing `$body-color` in Block 1

If `bodyText` is changed from default but `$body-color` is missing from Block 1, all body text defaults to Bootstrap's `#212529` (near-black). On a dark `pageBg`, this makes text invisible.

**Fix:** The generator already handles this -- `if (tokens.bodyText !== d.bodyText) vars.push('$body-color: ...')`. Ensure your preset sets `bodyText`.

### Missing Page Wrapper Overrides

Without overrides for `#page`, `#page-wrapper`, `#topofscroll`, `.main-inner`, and `#region-main-box`, white gaps appear between navbar, content area, and footer on dark themes.

**Fix:** The generator auto-includes these when `isDarkBg()` is true. Ensure `pageBg` is set to the dark value (not left at default `#FFFFFF`).

### Hardcoded Colours in Preview Components

Never use hardcoded hex values like `#e9ecef`, `#1d2125`, or `#ced4da` in preview components. These break when the theme changes between light and dark modes.

**Fix:** All preview components must use `var(--cfa-*)` CSS custom properties. The `tokenToCssVar()` utility converts camelCase token keys to `--cfa-kebab-case`.

### `loginBg` and `info` Are NOT Linked to `brandPrimary`

The `BRAND_LINKED_KEYS` array controls which tokens auto-update when `brandPrimary` changes:

```typescript
export const BRAND_LINKED_KEYS: (keyof ThemeTokens)[] = [
  'btnPrimaryBg',
  'linkColour',
  'navActiveUnderline',
  'secondaryNavActive',
  'progressFill',
  'focusRing',
  'loginBtnBg',
  'footerLink',
];
```

Notable absences: `loginBg`, `info`, `navbarBg`, `footerBg`, `drawerBg`. These must be set independently in every preset.

### Footer Link WCAG Failure

`#F27927` (CFA Orange) fails WCAG on dark `#404041` footer background (~2.8:1 ratio). Use `#F0EEEE` (Light Grey) or `#BAF73C` (Lime Green on very dark footers) instead.

### Breadcrumb Transparency on Dark Backgrounds

Default `breadcrumbBg` is `transparent`. On dark themes, the generator automatically resolves this to `pageBg`:

```typescript
rules.push(`.breadcrumb { background-color: ${
  tokens.breadcrumbBg === 'transparent' ? tokens.pageBg : tokens.breadcrumbBg
} !important; }`);
```

However, for presets, explicitly set `breadcrumbBg` to a visible dark value rather than relying on the fallback.

---

## 5. Moodle Cloud Constraints Summary

### Platform Limits

- **Boost theme only** -- cannot install custom or third-party themes
- **Two SCSS fields:** Raw initial SCSS (variables) + Raw SCSS (overrides)
- **No file system access** -- no FTP, SSH, PHP, or template modifications
- **Auto-upgraded** -- Moodle version is managed by Moodle Cloud

### `$primary` Propagation

Setting `$primary` (or Brand colour) automatically cascades to:
- `.btn-primary` background and border
- Link colours (unless `$link-color` is separately set)
- `.form-control:focus` border colour
- `.progress-bar` fills
- Active navigation states
- Checkbox/radio accent colours
- Dropdown active item backgrounds
- Focus ring colours
- Badge backgrounds

### Cache Purging

After any SCSS change: **Site admin > Development > Purge all caches**. Also clear browser cache (Ctrl+Shift+R).

### Key Verified Selectors

| Target | Selector | Notes |
|---|---|---|
| Navbar | `.navbar.fixed-top` | Has `.bg-white` -- needs `!important` |
| Login page body | `body#page-login-index` | Stable Moodle body ID |
| Login button | `#loginbtn` | Verified stable ID |
| Course tabs (active) | `.secondary-navigation .nav-tabs .nav-link.active` | Moodle 4.x+ |
| Footer | `#page-footer` | Verified stable ID |
| Dashboard body | `body#page-my-index` | Convention-based |
| Drawers | `.drawer` | Generic drawer class, Moodle 4.x |
| Right-hand drawer | `[data-region="right-hand-drawer"]` | Data attribute selector |

### Bootstrap 5 Migration (Moodle 5.x)

- SCSS variables in Block 1 remain unchanged and safe
- CSS selectors in Block 2 may need updating for Bootstrap 5 class name changes (`.ml-*` to `.ms-*`, `.mr-*` to `.me-*`, `.float-left` to `.float-start`)
- A backward compatibility layer exists until Moodle 6.0

---

## 6. Preset Template Checklist

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

### Step 7: Test

- [ ] Load preset in the sandbox preview -- check all three pages (dashboard, course, login)
- [ ] Run the contrast audit panel -- zero failures
- [ ] Export SCSS and verify Block 1 + Block 2 output looks correct
- [ ] If possible, paste into a real Moodle Cloud instance and purge caches

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
| `docs/moodle-cloud-constraints.md` | Moodle Cloud platform limits, verified selectors, compilation order |
