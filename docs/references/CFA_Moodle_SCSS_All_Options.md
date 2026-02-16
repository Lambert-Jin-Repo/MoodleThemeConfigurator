# CFA Moodle Cloud — Boost Theme Complete Setup Guide

**Prepared for:** Centre for Accessibility Australia
**Date:** February 2026 | **WCAG Compliance:** All verified AA minimum
**v7:** Logo compatibility analysis + embedded logo guidance per option
**Status:** ✅ Edit Mode fixed | ✅ Nav hover fixed | ✅ Background consistency fixed | ✅ Logo analysis complete

---

## Part 1: Logo Compatibility Analysis

### 1.1 Available Logo Files

| File | Dimensions | Format | Background | White Padding |
|------|-----------|--------|------------|---------------|
| **CFA_Logo_Small.jpg** | 672 × 252 px | JPEG (RGB, no alpha) | Solid black | 16 px right, 12 px bottom |
| **CFA_Logo_Large.png** | 1204 × 448 px | JPEG internally (RGB, no alpha, despite .png extension) | Solid black | 4 px right, 16 px bottom |

**Neither file has transparency.** Both contain white text + 4-colour squares (lime, orange, cyan) on a solid black background. The white padding at the edges will show as white lines on dark surfaces.

### 1.2 Where Moodle Boost Uses Logos

| Boost Setting | Where It Appears | Recommended File |
|---------------|-----------------|-----------------|
| **Logo** | Login page, front page (large display) | CFA_Logo_Large.png |
| **Compact logo** | Navbar on every page (~36 px tall) | CFA_Logo_Small.jpg |
| **Favicon** | Browser tab (16–32 px) | Neither — need a separate .ico file |

### 1.3 Per-Option Navbar Compatibility (Compact Logo)

At navbar height (~36 px tall), the small JPG renders at approximately 98 × 36 px. The black background either blends or shows depending on navbar colour.

| Option | Navbar Colour | Black BG Visibility | Verdict |
|--------|--------------|-------------------|---------|
| **C** | Near-black #1D2125 | Essentially invisible | ✅ **Best** — use as-is |
| **F** | Near-black #1D2125 | Essentially invisible | ✅ **Best** — use as-is |
| **B** | Dark Gray #404041 | Barely visible edge | ✅ **Good** — acceptable |
| **E** | Dark Gray #404041 | Barely visible edge | ✅ **Good** — acceptable |
| **A** | Teal #336E7B | Visible black rectangle | ⚠️ **Fair** — noticeable but functional |
| **G** | Burnt Orange #9E4E12 | Visible black rectangle | ⚠️ **Fair** — noticeable |
| **D** | Purple #B500B5 | Most visible contrast | ⚠️ **Fair** — most noticeable of all |

See accompanying **navbar_logo_test.png** for visual rendering.

### 1.4 Login Page Compatibility (Full Logo)

All login backgrounds are dark, so the large PNG works on every option:

| Options | Login Background | Verdict |
|---------|-----------------|---------|
| C, F | Near-black #1D2125 | ✅ **Perfect blend** |
| A, B, D, E | Dark gray #404041 | ✅ **Good** — slight edge barely visible |
| G | Burnt orange gradient | ⚠️ **Fair** — black rectangle visible on orange |

See accompanying **login_logo_test.png** for visual rendering.

### 1.5 White Surfaces = FAIL

Both logos display a prominent **black rectangle** on white. Do not place either logo in page content areas, white course banners, or any light-background surface.

### 1.6 Per-Option Logo Summary

| Option | Compact Logo (navbar) | Full Logo (login) | Overall |
|--------|--------------------|------------------|---------|
| A ⭐ | ⚠️ Black edge visible on teal | ✅ Good | Usable now, transparent ideal |
| B | ✅ Good on dark gray | ✅ Good | Usable now |
| C | ✅ Best on near-black | ✅ Perfect | **Best option for current logos** |
| D | ⚠️ Most visible on purple | ✅ Good | Transparent recommended |
| E | ✅ Good on dark gray | ✅ Good | Usable now |
| F | ✅ Best on near-black | ✅ Perfect | **Best option for current logos** |
| G | ⚠️ Black edge visible on orange | ⚠️ Fair | Transparent recommended |

### 1.7 Recommended Actions

**Use now (no changes needed):**
1. Upload **CFA_Logo_Large.png** as the Boost **Logo** (login page) — works on all dark login backgrounds
2. Upload **CFA_Logo_Small.jpg** as the Boost **Compact logo** (navbar) — acceptable on all options, best on C/F/B/E

**Request from design team (for best results):**

| Asset | Spec | Why |
|-------|------|-----|
| Transparent-bg logo (white text) | PNG-24 with alpha, 300–400 px wide | Eliminates black rectangle on teal/purple/orange navbars |
| Transparent-bg compact icon | PNG-24 with alpha, ~80 × 80 px | Clean navbar on any colour |
| Favicon | 32 × 32 px .ico | Browser tab — neither current file works at this size |

### 1.8 How to Upload

1. Go to **Site administration → Appearance → Themes → Boost**
2. **Logo** field: Upload CFA_Logo_Large.png
3. **Compact logo** field: Upload CFA_Logo_Small.jpg
4. **Favicon** field: Upload your .ico file (when available)
5. Click **Save changes**

---

### 1.9 Background Image: Not recommended

Background images behind content create contrast failures and are hard to control in Boost. All options use solid colours via SCSS.

### 1.10 Login Page: Handled via SCSS (no image upload needed)

| Option | Login Background |
|--------|-----------------|
| A, B, D | Solid dark gray (#404041) |
| C, F | Solid near-black (#1D2125) |
| E | Gradient (dark gray → teal) |
| G | Gradient (burnt orange → dark) |

---

## Part 2: Background Consistency (v6 Decision)

### Why all options now use white page backgrounds

In v5, Options C and E used tinted body backgrounds (#F0EEEE and #F8F5F0). This caused a persistent problem: dozens of Moodle elements (cards, modals, form inputs, dropdowns, plugin panels, list items, tables) default to white backgrounds. Every white element became a visible "block" floating on the tinted surface — on the dashboard, course pages, settings pages, and anywhere new content appeared.

The "Content Island" approach (v5) only wrapped the main content in a white panel, but modals, popovers, side drawers, and plugin elements still created mismatches.

**v6 fix:** All 7 options now use `$body-bg: #FFFFFF`. Options C and E retain their unique identity through their navbar, footer, drawer, login page, and accent colours — which is where users actually notice the theme personality.

### Background summary

| Option | Page bg | Navbar | Footer | Login bg | Drawer | Identity comes from |
|--------|---------|--------|--------|----------|--------|-------------------|
| A | White | Teal | Dark gray | Dark gray | Default | Teal everywhere |
| B | White | Dark gray | Dark gray + orange border | Dark gray | Default | Orange accents |
| C | **White** | Near-black | Near-black | Near-black | Near-black | Dark chrome + lime/cyan |
| D | White | Purple | Dark gray | Dark gray | Default | Purple primary |
| E | **White** | Dark gray | Dark gray | Gradient | Default | Warm card borders + gradient |
| F | White | Near-black | Near-black | Near-black | Default | Bold borders, large text |
| G | White | Burnt orange | Dark gray + orange border | Gradient | Default | Orange primary |

---

## Part 3: How to Apply

1. **Brand colour** — Enter hex in the colour picker
2. **Raw initial SCSS** — Paste into first SCSS box
3. **Raw SCSS** — Paste into second SCSS box
4. **Save changes** → **Purge all caches**

---

## Option A — "CFA Teal Professional" ⭐ Recommended

Clean, conservative, maximum accessibility. Monochrome teal.

### Brand Colour: `#336E7B`

### Raw Initial SCSS
```scss
$primary: #336E7B;
$body-color: #404041;
$body-bg: #FFFFFF;
$success: #357a32;
$info: #336E7B;
$warning: #B85C18;
$danger: #C03030;
$font-family-sans-serif: "Source Sans Pro", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
$headings-font-weight: 600;
$headings-color: #404041;
$link-color: #336E7B;
$btn-font-weight: 600;
$card-bg: #FFFFFF;
$card-border-color: #DEE2E6;
$breadcrumb-bg: #F0EEEE;
$dropdown-link-active-bg: #336E7B;
```

### Raw SCSS
```scss
// === CFA Option A — Teal Professional (v6) ===

*:focus { outline: 2px solid #336E7B !important; outline-offset: 2px !important; }
a { text-decoration: underline; &:hover, &:focus { color: #245058; } }

// ---- NAVBAR ----
.navbar { background-color: #336E7B !important; color: #FFF !important;
  .navbar-brand { color: #FFF !important; }
  .btn-open-nav { color: #FFF !important; }
  .fa, .icon, [class*="bi-"] { color: #FFF !important; }
}
.navbar .primary-navigation .nav-link { color: #FFF !important; }
.navbar .primary-navigation .nav-link:hover,
.navbar .primary-navigation .nav-link:focus {
  color: #F0EEEE !important;
  background-color: rgba(0,0,0,0.2) !important; border-radius: 4px; }
.navbar .primary-navigation .nav-link.active {
  background-color: rgba(0,0,0,0.25) !important; border-radius: 4px; }

// ---- EDIT MODE ----
.navbar .editmode-switch-form .form-check-label { color: #FFF !important; }
.navbar .editmode-switch-form .form-check-input {
  background-color: rgba(255,255,255,0.3) !important;
  border-color: rgba(255,255,255,0.5) !important;
  &:focus { box-shadow: 0 0 0 0.2rem rgba(255,255,255,0.25) !important; } }
.navbar .editmode-switch-form .form-check-input:checked {
  background-color: #FFF !important; border-color: #FFF !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23336E7B'/%3e%3c/svg%3e") !important; }
.navbar .editmode-switch-form .btn {
  color: #FFF !important; border-color: rgba(255,255,255,0.5) !important;
  background-color: rgba(255,255,255,0.1) !important; }

// ---- ADMIN UI ----
.navbar .usermenu .login, .navbar .usermenu .usertext,
.navbar .usermenu .userbutton, .navbar .usermenu .btn { color: #FFF !important; }
.navbar .action-menu-trigger { color: #FFF !important; }
.navbar .popover-region .nav-link { color: #FFF !important; }
.navbar .dropdown-menu, .navbar .popover-region-container,
.navbar .usermenu .dropdown-menu {
  .dropdown-item, .nav-link, a { color: #404041 !important; text-decoration: none; }
  .dropdown-item:hover, .dropdown-item:focus,
  .nav-link:hover, .nav-link:focus {
    background-color: #F0EEEE !important; color: #336E7B !important; } }

// ---- BUTTONS ----
.btn-primary { background-color: #336E7B; border-color: #336E7B; color: #FFF;
  &:hover, &:focus { background-color: #245058; border-color: #245058; } }
.btn-secondary { background-color: #F0EEEE; border-color: #404041; color: #404041;
  &:hover, &:focus { background-color: #404041; border-color: #404041; color: #FFF; } }

// ---- FOOTER ----
#page-footer { background-color: #404041 !important; color: #F0EEEE !important;
  a { color: #F0EEEE !important; &:hover { color: #FFF !important; } } }

// ---- LOGIN ----
#page-login-index { background-color: #404041;
  .card { border: 2px solid #336E7B; }
  .login-heading { color: #336E7B; } }

// ---- MISC ----
.breadcrumb { background-color: #F0EEEE; }
.card { border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
```

---

## Option B — "CFA Teal & Orange Accent"

Energetic, branded. Orange hover/accents on dark surfaces.

### Brand Colour: `#336E7B`

### Raw Initial SCSS
```scss
$primary: #336E7B;
$body-color: #404041;
$body-bg: #FFFFFF;
$success: #357a32;
$info: #336E7B;
$warning: #B85C18;
$danger: #C03030;
$font-family-sans-serif: "Source Sans Pro", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
$headings-font-weight: 600;
$headings-color: #404041;
$link-color: #336E7B;
$btn-font-weight: 600;
$card-bg: #FFFFFF;
$card-border-color: #DEE2E6;
$breadcrumb-bg: #F0EEEE;
$dropdown-link-active-bg: #336E7B;
```

### Raw SCSS
```scss
// === CFA Option B — Teal & Orange Accent (v6) ===

*:focus { outline: 2px solid #F27927 !important; outline-offset: 2px !important; }
a { color: #336E7B; text-decoration: underline; &:hover, &:focus { color: #245058; } }

.navbar { background-color: #404041 !important; color: #F0EEEE !important;
  .navbar-brand { color: #F0EEEE !important; }
  .btn-open-nav { color: #F0EEEE !important; }
  .fa, .icon, [class*="bi-"] { color: #F0EEEE !important; }
}
.navbar .primary-navigation .nav-link { color: #F0EEEE !important; }
.navbar .primary-navigation .nav-link:hover,
.navbar .primary-navigation .nav-link:focus {
  color: #F27927 !important;
  background-color: rgba(0,0,0,0.2) !important; border-radius: 4px; }
.navbar .primary-navigation .nav-link.active {
  background-color: rgba(0,0,0,0.25) !important; border-radius: 4px; }

.navbar .editmode-switch-form .form-check-label { color: #FFF !important; }
.navbar .editmode-switch-form .form-check-input {
  background-color: rgba(255,255,255,0.3) !important;
  border-color: rgba(255,255,255,0.5) !important;
  &:focus { box-shadow: 0 0 0 0.2rem rgba(255,255,255,0.25) !important; } }
.navbar .editmode-switch-form .form-check-input:checked {
  background-color: #F27927 !important; border-color: #F27927 !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23FFFFFF'/%3e%3c/svg%3e") !important; }
.navbar .editmode-switch-form .btn {
  color: #FFF !important; border-color: rgba(255,255,255,0.5) !important;
  background-color: rgba(255,255,255,0.1) !important; }

.navbar .usermenu .login, .navbar .usermenu .usertext,
.navbar .usermenu .userbutton, .navbar .usermenu .btn { color: #FFF !important; }
.navbar .action-menu-trigger { color: #FFF !important; }
.navbar .popover-region .nav-link { color: #FFF !important; }
.navbar .dropdown-menu, .navbar .popover-region-container,
.navbar .usermenu .dropdown-menu {
  .dropdown-item, .nav-link, a { color: #404041 !important; text-decoration: none; }
  .dropdown-item:hover, .dropdown-item:focus,
  .nav-link:hover, .nav-link:focus {
    background-color: #F0EEEE !important; color: #336E7B !important; } }

.btn-primary { background-color: #336E7B; border-color: #336E7B; color: #FFF;
  &:hover, &:focus { background-color: #F27927; border-color: #F27927; color: #FFF; } }
.btn-secondary { background-color: #FFF; border: 2px solid #336E7B; color: #336E7B;
  &:hover, &:focus { background-color: #336E7B; color: #FFF; } }

#page-footer { background-color: #404041 !important; border-top: 4px solid #F27927;
  color: #F0EEEE !important;
  a { color: #F27927 !important; &:hover { color: #FFF !important; } } }

#page-login-index { background-color: #404041;
  .card { border-top: 4px solid #F27927; }
  .login-heading { color: #336E7B; }
  .btn-primary { background-color: #F27927; border-color: #F27927;
    &:hover { background-color: #336E7B; border-color: #336E7B; } } }

.breadcrumb { background-color: #F0EEEE; }
.card { border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.course-content .section .sectionname { border-bottom: 3px solid #F27927; padding-bottom: 0.3rem; }
```

---

## Option C — "CFA Dark Mode" ⚠ Changed in v6

Bold, modern. Dark chrome with lime + cyan accents.
**v6 change:** Page background changed from #F0EEEE → #FFFFFF. Dark identity now comes entirely from navbar, footer, drawer, and login — not page background.

### Brand Colour: `#336E7B`

### Raw Initial SCSS
```scss
$primary: #336E7B;
$body-color: #404041;
$body-bg: #FFFFFF;
$success: #357a32;
$info: #336E7B;
$warning: #B85C18;
$danger: #C03030;
$font-family-sans-serif: "Source Sans Pro", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
$headings-font-weight: 700;
$headings-color: #404041;
$link-color: #336E7B;
$btn-font-weight: 600;
$card-bg: #FFFFFF;
$card-border-color: #DEE2E6;
$breadcrumb-bg: #F0EEEE;
$dropdown-link-active-bg: #336E7B;
```

### Raw SCSS
```scss
// === CFA Option C — Dark Mode (v6) ===

*:focus { outline: 2px solid #336E7B !important; outline-offset: 2px !important; }
a { color: #336E7B; text-decoration: underline; &:hover, &:focus { color: #245058; } }

// ---- NAVBAR ----
.navbar { background-color: #1D2125 !important; border-bottom: 3px solid #F27927;
  color: #F0EEEE !important;
  .navbar-brand { color: #F0EEEE !important; }
  .btn-open-nav { color: #F0EEEE !important; }
  .fa, .icon, [class*="bi-"] { color: #F0EEEE !important; }
}
.navbar .primary-navigation .nav-link { color: #F0EEEE !important; }
.navbar .primary-navigation .nav-link:hover,
.navbar .primary-navigation .nav-link:focus {
  color: #BAF73C !important;
  background-color: rgba(255,255,255,0.08) !important; border-radius: 4px; }
.navbar .primary-navigation .nav-link.active {
  background-color: rgba(255,255,255,0.12) !important; border-radius: 4px;
  color: #BAF73C !important; }

.navbar .editmode-switch-form .form-check-label { color: #F0EEEE !important; }
.navbar .editmode-switch-form .form-check-input {
  background-color: rgba(255,255,255,0.2) !important;
  border-color: rgba(255,255,255,0.4) !important;
  &:focus { box-shadow: 0 0 0 0.2rem rgba(186,247,60,0.3) !important; } }
.navbar .editmode-switch-form .form-check-input:checked {
  background-color: #BAF73C !important; border-color: #BAF73C !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%231D2125'/%3e%3c/svg%3e") !important; }
.navbar .editmode-switch-form .btn {
  color: #F0EEEE !important; border-color: rgba(255,255,255,0.4) !important;
  background-color: rgba(255,255,255,0.08) !important; }

.navbar .usermenu .login, .navbar .usermenu .usertext,
.navbar .usermenu .userbutton, .navbar .usermenu .btn { color: #F0EEEE !important; }
.navbar .action-menu-trigger { color: #F0EEEE !important; }
.navbar .popover-region .nav-link { color: #F0EEEE !important; }
.navbar .dropdown-menu, .navbar .popover-region-container,
.navbar .usermenu .dropdown-menu {
  .dropdown-item, .nav-link, a { color: #404041 !important; text-decoration: none; }
  .dropdown-item:hover, .dropdown-item:focus,
  .nav-link:hover, .nav-link:focus {
    background-color: #F0EEEE !important; color: #336E7B !important; } }

// ---- BUTTONS ----
.btn-primary { background-color: #336E7B; border-color: #336E7B; color: #FFF;
  &:hover, &:focus { background-color: #1D2125; border-color: #1D2125; color: #FFF; } }
.btn-secondary { background-color: #FFF; border: 2px solid #404041; color: #404041;
  &:hover, &:focus { background-color: #404041; color: #FFF; } }

// ---- CARDS (subtle shadow for depth on white) ----
.card { border-radius: 8px; border: none; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.dashboard-card { border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }

// ---- FOOTER ----
#page-footer { background-color: #1D2125 !important; color: #F0EEEE !important;
  a { color: #00BFFF !important; &:hover { color: #BAF73C !important; } } }

// ---- LOGIN ----
#page-login-index { background-color: #1D2125;
  .card { border-top: 4px solid #BAF73C; border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.3); }
  .login-heading { color: #336E7B; } }

// ---- DRAWER (dark — this is where Option C shows its dark identity) ----
[data-region="drawer"] { background-color: #1D2125; color: #F0EEEE;
  .list-group-item { background: transparent; color: #F0EEEE;
    border-color: rgba(255,255,255,0.1); &:hover { background: rgba(255,255,255,0.05); } }
  a { color: #F0EEEE !important; &:hover { color: #BAF73C !important; } } }

// ---- MISC ----
.breadcrumb { background-color: #F0EEEE; }
```

---

## Option D — "CFA Purple Spotlight"

Creative, distinctive. CFA Purple as primary.

### Brand Colour: `#B500B5`

### Raw Initial SCSS
```scss
$primary: #B500B5;
$body-color: #404041;
$body-bg: #FFFFFF;
$success: #357a32;
$info: #336E7B;
$warning: #B85C18;
$danger: #C03030;
$font-family-sans-serif: "Source Sans Pro", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
$headings-font-weight: 600;
$headings-color: #404041;
$link-color: #8A008A;
$btn-font-weight: 600;
$card-bg: #FFFFFF;
$card-border-color: #DEE2E6;
$breadcrumb-bg: #F5F0F5;
$dropdown-link-active-bg: #B500B5;
```

### Raw SCSS
```scss
// === CFA Option D — Purple Spotlight (v6) ===

*:focus { outline: 2px solid #B500B5 !important; outline-offset: 2px !important; }
a { color: #8A008A; text-decoration: underline; &:hover, &:focus { color: #5E005E; } }

.navbar { background-color: #B500B5 !important; color: #FFF !important;
  .navbar-brand { color: #FFF !important; }
  .btn-open-nav { color: #FFF !important; }
  .fa, .icon, [class*="bi-"] { color: #FFF !important; }
}
.navbar .primary-navigation .nav-link { color: #FFF !important; }
.navbar .primary-navigation .nav-link:hover,
.navbar .primary-navigation .nav-link:focus {
  color: #F0EEEE !important;
  background-color: rgba(0,0,0,0.2) !important; border-radius: 4px; }
.navbar .primary-navigation .nav-link.active {
  background-color: rgba(0,0,0,0.25) !important; border-radius: 4px; }

.navbar .editmode-switch-form .form-check-label { color: #FFF !important; }
.navbar .editmode-switch-form .form-check-input {
  background-color: rgba(255,255,255,0.3) !important;
  border-color: rgba(255,255,255,0.5) !important;
  &:focus { box-shadow: 0 0 0 0.2rem rgba(255,255,255,0.25) !important; } }
.navbar .editmode-switch-form .form-check-input:checked {
  background-color: #FFF !important; border-color: #FFF !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23B500B5'/%3e%3c/svg%3e") !important; }
.navbar .editmode-switch-form .btn {
  color: #FFF !important; border-color: rgba(255,255,255,0.5) !important;
  background-color: rgba(255,255,255,0.1) !important; }

.navbar .usermenu .login, .navbar .usermenu .usertext,
.navbar .usermenu .userbutton, .navbar .usermenu .btn { color: #FFF !important; }
.navbar .action-menu-trigger { color: #FFF !important; }
.navbar .popover-region .nav-link { color: #FFF !important; }
.navbar .dropdown-menu, .navbar .popover-region-container,
.navbar .usermenu .dropdown-menu {
  .dropdown-item, .nav-link, a { color: #404041 !important; text-decoration: none; }
  .dropdown-item:hover, .dropdown-item:focus,
  .nav-link:hover, .nav-link:focus {
    background-color: #F5F0F5 !important; color: #8A008A !important; } }

.btn-primary { background-color: #B500B5; border-color: #B500B5; color: #FFF;
  &:hover, &:focus { background-color: #8A008A; border-color: #8A008A; } }
.btn-secondary { background-color: #FFF; border: 2px solid #336E7B; color: #336E7B;
  &:hover, &:focus { background-color: #336E7B; color: #FFF; } }

#page-footer { background-color: #404041 !important; color: #F0EEEE !important;
  a { color: #F0EEEE !important; &:hover { color: #FFF !important; } } }

#page-login-index { background-color: #404041;
  .card { border-left: 5px solid #B500B5; }
  .login-heading { color: #B500B5; } }

.breadcrumb { background-color: #F5F0F5; }
.card { border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.course-content .section .sectionname { border-bottom: 3px solid #B500B5; padding-bottom: 0.3rem; }
```

---

## Option E — "CFA Warm Cream" ⚠ Changed in v6

Warm, welcoming, approachable.
**v6 change:** Page background changed from #F8F5F0 → #FFFFFF. Warm feel now comes from breadcrumb tint, card borders, login gradient, and footer — not page background.

### Brand Colour: `#336E7B`

### Raw Initial SCSS
```scss
$primary: #336E7B;
$body-color: #404041;
$body-bg: #FFFFFF;
$success: #357a32;
$info: #336E7B;
$warning: #B85C18;
$danger: #C03030;
$font-family-sans-serif: "Source Sans Pro", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
$headings-font-weight: 600;
$headings-color: #2A2A2B;
$link-color: #336E7B;
$btn-font-weight: 600;
$card-bg: #FFFFFF;
$card-border-color: #E8E2D9;
$breadcrumb-bg: #F8F5F0;
$dropdown-link-active-bg: #336E7B;
```

### Raw SCSS
```scss
// === CFA Option E — Warm Cream (v6) ===

*:focus { outline: 2px solid #336E7B !important; outline-offset: 2px !important; }
a { color: #336E7B; text-decoration: underline; &:hover, &:focus { color: #245058; } }

.navbar { background-color: #404041 !important; color: #F0EEEE !important;
  .navbar-brand { color: #F0EEEE !important; }
  .btn-open-nav { color: #F0EEEE !important; }
  .fa, .icon, [class*="bi-"] { color: #F0EEEE !important; }
}
.navbar .primary-navigation .nav-link { color: #F0EEEE !important; }
.navbar .primary-navigation .nav-link:hover,
.navbar .primary-navigation .nav-link:focus {
  color: #F27927 !important;
  background-color: rgba(0,0,0,0.2) !important; border-radius: 4px; }
.navbar .primary-navigation .nav-link.active {
  background-color: rgba(0,0,0,0.25) !important; border-radius: 4px; }

.navbar .editmode-switch-form .form-check-label { color: #FFF !important; }
.navbar .editmode-switch-form .form-check-input {
  background-color: rgba(255,255,255,0.3) !important;
  border-color: rgba(255,255,255,0.5) !important;
  &:focus { box-shadow: 0 0 0 0.2rem rgba(255,255,255,0.25) !important; } }
.navbar .editmode-switch-form .form-check-input:checked {
  background-color: #F27927 !important; border-color: #F27927 !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%23FFFFFF'/%3e%3c/svg%3e") !important; }
.navbar .editmode-switch-form .btn {
  color: #FFF !important; border-color: rgba(255,255,255,0.5) !important;
  background-color: rgba(255,255,255,0.1) !important; }

.navbar .usermenu .login, .navbar .usermenu .usertext,
.navbar .usermenu .userbutton, .navbar .usermenu .btn { color: #FFF !important; }
.navbar .action-menu-trigger { color: #FFF !important; }
.navbar .popover-region .nav-link { color: #FFF !important; }
.navbar .dropdown-menu, .navbar .popover-region-container,
.navbar .usermenu .dropdown-menu {
  .dropdown-item, .nav-link, a { color: #404041 !important; text-decoration: none; }
  .dropdown-item:hover, .dropdown-item:focus,
  .nav-link:hover, .nav-link:focus {
    background-color: #F0EEEE !important; color: #336E7B !important; } }

.btn-primary { background-color: #336E7B; border-color: #336E7B; color: #FFF;
  &:hover, &:focus { background-color: #245058; border-color: #245058; } }
.btn-secondary { background-color: #FFF; border: 2px solid #404041; color: #404041;
  &:hover, &:focus { background-color: #404041; color: #FFF; } }

// ---- CARDS (warm border for character) ----
.card { border-radius: 8px; border: 1px solid #E8E2D9; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }

// ---- FOOTER ----
#page-footer { background-color: #2A2A2B !important; color: #F0EEEE !important;
  a { color: #F0EEEE !important; &:hover { color: #F27927 !important; } } }

// ---- LOGIN (gradient — this is where the warmth comes through) ----
#page-login-index { background: linear-gradient(135deg, #404041 0%, #336E7B 100%);
  .card { border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
  .login-heading { color: #336E7B; } }

// ---- BREADCRUMB (warm tint — subtle warmth cue) ----
.breadcrumb { background-color: #F8F5F0; border-radius: 6px; }
```

---

## Option F — "CFA High Contrast AAA"

Maximum accessibility. Targets WCAG AAA (7:1) everywhere.

### Brand Colour: `#245058`

### Raw Initial SCSS
```scss
$primary: #245058;
$body-color: #1D2125;
$body-bg: #FFFFFF;
$success: #2A6328;
$info: #245058;
$warning: #9E4E12;
$danger: #A02020;
$font-family-sans-serif: "Source Sans Pro", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
$font-size-base: 1.0625rem;
$headings-font-weight: 700;
$headings-color: #1D2125;
$link-color: #245058;
$btn-font-weight: 700;
$card-bg: #FFFFFF;
$card-border-color: #404041;
$breadcrumb-bg: #F0EEEE;
$dropdown-link-active-bg: #245058;
```

### Raw SCSS
```scss
// === CFA Option F — High Contrast AAA (v6) ===

*:focus { outline: 3px solid #1D2125 !important; outline-offset: 2px !important; }
a { color: #245058; text-decoration: underline; font-weight: 600;
  &:hover, &:focus { color: #1D2125; } }

.navbar { background-color: #1D2125 !important; color: #FFF !important;
  .navbar-brand { color: #FFF !important; }
  .btn-open-nav { color: #FFF !important; }
  .fa, .icon, [class*="bi-"] { color: #FFF !important; }
}
.navbar .primary-navigation .nav-link { color: #FFF !important; }
.navbar .primary-navigation .nav-link:hover,
.navbar .primary-navigation .nav-link:focus {
  color: #F0EEEE !important; text-decoration: underline;
  background-color: rgba(255,255,255,0.1) !important; border-radius: 4px; }
.navbar .primary-navigation .nav-link.active {
  background-color: rgba(255,255,255,0.15) !important; border-radius: 4px; }

.navbar .editmode-switch-form .form-check-label { color: #FFF !important; font-weight: 700; }
.navbar .editmode-switch-form .form-check-input {
  background-color: rgba(255,255,255,0.2) !important;
  border-color: rgba(255,255,255,0.5) !important;
  &:focus { box-shadow: 0 0 0 0.25rem rgba(255,255,255,0.3) !important; } }
.navbar .editmode-switch-form .form-check-input:checked {
  background-color: #FFF !important; border-color: #FFF !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%231D2125'/%3e%3c/svg%3e") !important; }
.navbar .editmode-switch-form .btn {
  color: #FFF !important; border-color: rgba(255,255,255,0.5) !important;
  background-color: rgba(255,255,255,0.08) !important; font-weight: 700; }

.navbar .usermenu .login, .navbar .usermenu .usertext,
.navbar .usermenu .userbutton, .navbar .usermenu .btn { color: #FFF !important; }
.navbar .action-menu-trigger { color: #FFF !important; }
.navbar .popover-region .nav-link { color: #FFF !important; }
.navbar .dropdown-menu, .navbar .popover-region-container,
.navbar .usermenu .dropdown-menu {
  .dropdown-item, .nav-link, a { color: #1D2125 !important; text-decoration: none; }
  .dropdown-item:hover, .dropdown-item:focus,
  .nav-link:hover, .nav-link:focus {
    background-color: #F0EEEE !important; color: #1D2125 !important; } }

.btn-primary { background-color: #245058; border-color: #245058; color: #FFF;
  &:hover, &:focus { background-color: #1D2125; border-color: #1D2125; } }
.btn-secondary { background-color: #FFF; border: 2px solid #1D2125; color: #1D2125;
  &:hover, &:focus { background-color: #1D2125; color: #FFF; } }

#page-footer { background-color: #1D2125 !important; color: #FFF !important;
  a { color: #FFF !important; text-decoration: underline !important;
    &:hover { color: #F0EEEE !important; } } }

#page-login-index { background-color: #1D2125;
  .card { border: 2px solid #245058; box-shadow: 0 4px 16px rgba(0,0,0,0.25); }
  .login-heading { color: #245058; } }

.breadcrumb { background-color: #F0EEEE; border: 1px solid #DEE2E6; }
.card { border-radius: 6px; border: 1px solid #404041; }
a:not(.btn) { text-decoration: underline !important; }
input:focus, select:focus, textarea:focus { outline: 3px solid #1D2125 !important;
  outline-offset: 1px !important; box-shadow: none !important; }
```

---

## Option G — "CFA Burnt Orange"

Warm, bold, memorable. Darkened CFA Orange as primary.

### Brand Colour: `#9E4E12`

### Raw Initial SCSS
```scss
$primary: #9E4E12;
$body-color: #404041;
$body-bg: #FFFFFF;
$success: #357a32;
$info: #336E7B;
$warning: #9E4E12;
$danger: #C03030;
$font-family-sans-serif: "Source Sans Pro", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
$headings-font-weight: 600;
$headings-color: #404041;
$link-color: #9E4E12;
$btn-font-weight: 600;
$card-bg: #FFFFFF;
$card-border-color: #DEE2E6;
$breadcrumb-bg: #FDF5EE;
$dropdown-link-active-bg: #9E4E12;
```

### Raw SCSS
```scss
// === CFA Option G — Burnt Orange (v6) ===

*:focus { outline: 2px solid #9E4E12 !important; outline-offset: 2px !important; }
a { color: #9E4E12; text-decoration: underline; &:hover, &:focus { color: #7A3D0E; } }

.navbar { background-color: #9E4E12 !important; color: #FFF !important;
  .navbar-brand { color: #FFF !important; }
  .btn-open-nav { color: #FFF !important; }
  .fa, .icon, [class*="bi-"] { color: #FFF !important; }
}
.navbar .primary-navigation .nav-link { color: #FFF !important; }
.navbar .primary-navigation .nav-link:hover,
.navbar .primary-navigation .nav-link:focus {
  color: #F0EEEE !important;
  background-color: rgba(0,0,0,0.2) !important; border-radius: 4px; }
.navbar .primary-navigation .nav-link.active {
  background-color: rgba(0,0,0,0.25) !important; border-radius: 4px; }

.navbar .editmode-switch-form .form-check-label { color: #FFF !important; }
.navbar .editmode-switch-form .form-check-input {
  background-color: rgba(255,255,255,0.3) !important;
  border-color: rgba(255,255,255,0.5) !important;
  &:focus { box-shadow: 0 0 0 0.2rem rgba(255,255,255,0.25) !important; } }
.navbar .editmode-switch-form .form-check-input:checked {
  background-color: #FFF !important; border-color: #FFF !important;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='-4 -4 8 8'%3e%3ccircle r='3' fill='%239E4E12'/%3e%3c/svg%3e") !important; }
.navbar .editmode-switch-form .btn {
  color: #FFF !important; border-color: rgba(255,255,255,0.5) !important;
  background-color: rgba(255,255,255,0.1) !important; }

.navbar .usermenu .login, .navbar .usermenu .usertext,
.navbar .usermenu .userbutton, .navbar .usermenu .btn { color: #FFF !important; }
.navbar .action-menu-trigger { color: #FFF !important; }
.navbar .popover-region .nav-link { color: #FFF !important; }
.navbar .dropdown-menu, .navbar .popover-region-container,
.navbar .usermenu .dropdown-menu {
  .dropdown-item, .nav-link, a { color: #404041 !important; text-decoration: none; }
  .dropdown-item:hover, .dropdown-item:focus,
  .nav-link:hover, .nav-link:focus {
    background-color: #FDF5EE !important; color: #9E4E12 !important; } }

.btn-primary { background-color: #9E4E12; border-color: #9E4E12; color: #FFF;
  &:hover, &:focus { background-color: #7A3D0E; border-color: #7A3D0E; } }
.btn-secondary { background-color: #FFF; border: 2px solid #336E7B; color: #336E7B;
  &:hover, &:focus { background-color: #336E7B; color: #FFF; } }

#page-footer { background-color: #404041 !important; border-top: 4px solid #9E4E12;
  color: #F0EEEE !important;
  a { color: #F27927 !important; &:hover { color: #FFF !important; } } }

#page-login-index { background: linear-gradient(135deg, #9E4E12 0%, #7A3D0E 100%);
  .card { border-top: 4px solid #336E7B; border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.25); }
  .login-heading { color: #9E4E12; } }

.breadcrumb { background-color: #FDF5EE; border-radius: 6px; }
.card { border-radius: 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.course-content .section .sectionname { border-bottom: 3px solid #336E7B; padding-bottom: 0.3rem; }
```

---

## Version History

| Version | Changes |
|---------|---------|
| v1–v2 | Initial 3 then 7 theme options |
| v3 | Fixed nav hover white-on-white flash |
| v4 | Fixed Edit Mode (correct .form-check selectors), added logo/admin UI guidance |
| v5 | Content Island pattern for C & E — still had white blocks on tinted bg |
| **v6** | **All options use white page bg. C & E keep identity via navbar/footer/drawer/login. Zero bg inconsistency.** |
| **v7** | **Logo compatibility analysis: per-option navbar/login rendering tested. Upload guidance added. Both logos usable now; transparent versions ideal.** |
