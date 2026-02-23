# Moodle Cloud Constraints & Theming Reference

> Research-verified as of February 2026. The CFA site is hosted on Moodle Cloud (Standard plan).

## What Moodle Cloud Allows

### Theme Settings

| Setting | Admin Path | Accepts |
|---|---|---|
| Brand colour | `Site admin → Appearance → Themes → Boost → General settings → Brand colour` | Single hex value |
| Background image | `Site admin → Appearance → Themes → Boost → General settings → Background image` | File upload (JPG/PNG, 1920x1080, <150dpi) |
| Login background image | `Site admin → Appearance → Themes → Boost → General settings → Login background image` | File upload |
| Theme preset | `Site admin → Appearance → Themes → Boost → General settings → Theme preset` | Default or Plain |
| Raw initial SCSS | `Site admin → Appearance → Themes → Boost → Advanced settings → Raw initial SCSS` | SCSS variable declarations |
| Raw SCSS | `Site admin → Appearance → Themes → Boost → Advanced settings → Raw SCSS` | CSS/SCSS rule overrides |
| Full logo | `Site admin → Appearance → Logos → Logo` | File upload |
| Compact logo (navbar) | `Site admin → Appearance → Logos → Small logo` | File upload (100x100) |
| Favicon | `Site admin → Appearance → Logos → Favicon` | File upload |
| Site name | `Site admin → General → Site home settings → Full site name` | Text |
| Custom menu items | `Site admin → Appearance → Advanced theme settings → Custom menu items` | Text (Link\|URL format) |
| Additional HTML | `Site admin → Appearance → Additional HTML` | HTML/CSS/JS injection |
| Purge caches | `Site admin → Development → Purge all caches` | Button click |

### What Moodle Cloud CANNOT Do
- Install custom or third-party themes (Boost only)
- Install plugins from the Moodle Plugin Directory
- Access file system (no FTP/SSH)
- Modify PHP, Mustache templates, or theme files
- Control Moodle version or upgrade timing (auto-upgraded)
- Override settings marked "Defined in config.php"
- Switch to Classic theme (removed from current plans)

## How Moodle SCSS Compilation Works

### Compilation Order
```
1. theme_boost_get_pre_scss()    ← Brand colour → $brand-primary variable
2. Raw initial SCSS field        ← YOUR VARIABLES ($primary, $body-bg, etc.)
3. Bootstrap 4/5 _variables.scss ← Uses !default, so your values win
4. Moodle's own SCSS files       ← theme/boost/scss/**
5. Raw SCSS field                ← YOUR OVERRIDES (CSS rules)
```

### Raw Initial SCSS (Block 1 — Variables)
- Injected BEFORE all other SCSS
- This is where SCSS variable overrides go
- Variables use `!default` in Bootstrap, so declaring them here overrides the defaults
- Example:
  ```scss
  $primary: #336E7B;
  $link-color: #336E7B;
  $body-bg: #f5f5f5;
  $font-size-base: 0.875rem;
  ```

### Raw SCSS (Block 2 — Rule Overrides)
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

This is WHY the sandbox must replicate this cascading behaviour — it's the single most impactful setting.

## Verified CSS Selectors

Tested against Moodle 4.x Boost theme. Some may need updating for Moodle 5.x.

### High Confidence (Verified in docs/forums/source)

| Target | Selector | Notes |
|---|---|---|
| Navbar background | `.navbar.fixed-top` | Has `.bg-white` class — needs `!important` |
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
| FontAwesome icons | `.icon, .fa` | Inherit parent color; need explicit override on dark themes |
| Card icons (action menus) | `.card .icon, .card .fa, .dashboard-card .fa` | Need `bodyText` color on dark themes (opposite of global icon rule); auto-adapts via `isDarkBg()` |
| Section toggle wrapper | `.ftoggler` | Contains `.collapsed-icon.icon-no-margin` with icon inside |
| Inner icon wrapper | `.collapsed-icon.icon-no-margin` | Sits on light background even in dark themes |
| Module prev/next nav | `.btn-previous, .btn-next` | `btn btn-link` style; icons need dark color on light wrapper |

### Medium Confidence (Convention-based, verify per version)

| Target | Selector | Notes |
|---|---|---|
| Dashboard page | `body#page-my-index` | Body ID from `/my/index.php` |
| Dashboard cards | `.card.dashboard-card` | May vary between versions |
| Course drawers | `.drawer` | Generic drawer class in Moodle 4.x |
| Course index drawer | `#theme_boost-drawers-courseindex` | Naming convention, verify in DevTools |
| Block drawer | `#theme_boost-drawers-blocks` | Naming convention, verify in DevTools |
| Content max width | `#page.drawers .main-inner` | Verify against specific version |
| Trial banner | `.block_moodlecloudtrial.block.no-header.card` | MoodleCloud-only proprietary block; inner `.card-body` needs `background-color` override on dark themes; needs `!important` |
| Course content section icons | `.card, .card-body` (within course content) | Section icons under course contents use `.card` containers; generic `.card` `background-color: cardBg` fix resolves white bg on dark themes |

### How to Verify Selectors
1. Open the real CFA Moodle site in Chrome
2. Right-click an element → Inspect
3. Confirm the selector exists in the DOM
4. Check Moodle version at `Site admin → Notifications`
5. If Moodle 5.x, check for Bootstrap 5 class name changes (`.ml-*` → `.ms-*`, etc.)

## Dark Theme: FontAwesome Icon Visibility

FontAwesome icons (`.icon`, `.fa`) on dark themes need the **DEFAULT dark text color (`#1d2125`)**, not the light `bodyText`, because their wrapper elements retain light backgrounds.

**Why this matters:** On dark themes, `$body-color` is set to a light value (e.g. `#F0EEEE`) so text is visible on the dark page background. However, several wrapper elements — `.ftoggler`, `.collapsed-icon.icon-no-margin`, `.btn-previous`, `.btn-next` — keep their default light backgrounds. Icons inside these wrappers inherit the light `$body-color` and become invisible (light icon on light wrapper).

**The fix:** In Block 2 (Raw SCSS), set `.icon, .fa` to the Moodle default dark text color (`#1d2125`) so icons remain visible on light wrapper backgrounds. Hover states for interactive wrappers (`.ftoggler`, secondary nav, breadcrumb, `.btn-previous`, `.btn-next`) use `linkColour` for accent. Drawer icons are handled separately via the `drawerText` token.

**Key principle:** `$body-color` in Block 1 handles most text but does NOT fix icons that sit on light-background wrappers.

## Bootstrap 5 Migration Warning

Moodle 5.0+ migrates from Bootstrap 4 to Bootstrap 5:
- **SCSS variables still work** — `$primary`, `$body-bg`, etc. are unchanged
- **Utility classes change** — `.ml-*` → `.ms-*`, `.mr-*` → `.me-*`, `.float-left` → `.float-start`
- **Some component markup changes** — card, modal, dropdown HTML structure may differ
- **Backward compat layer exists** until Moodle 6.0

The SCSS variables in Block 1 (Raw initial SCSS) are safe. The CSS selectors in Block 2 (Raw SCSS) may need updating — particularly any that rely on Bootstrap utility classes.

## Cache Purging

- Saving Boost theme settings via the admin UI triggers `theme_reset_all_caches` automatically
- Manual purge at `Site admin → Development → Purge all caches` as fallback
- Browser cache may also need clearing (Ctrl+Shift+R)
- The sandbox export includes a reminder to purge caches

## Risk: Malformed SCSS

Bad SCSS in the Raw SCSS fields can **break the entire site's styling**. The site becomes unusable until the admin reverts the SCSS and purges caches. This is exactly WHY the sandbox tool exists — to preview safely before applying.
