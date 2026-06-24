# Moodle Cloud Constraints & Theming Reference

> Research-verified as of February 2026; audited against Moodle 5.0 source 2026-05-14 — see `docs/audits/moodle-5x-audit-2026-05-14.md`.
> The CFA site is hosted on Moodle Cloud (Standard plan).
> MoodleCloud auto-upgrades; likely running **Moodle 5.1.x** with **Bootstrap 5.3** as of Feb 2026.

## What Moodle Cloud Allows

### Theme Settings

| Setting | Admin Path | Accepts |
|---|---|---|
| Brand colour | `Site admin → Appearance → Themes → Boost → General settings → Brand colour` | Single hex value (maps to `$primary`) |
| Background image | `Site admin → Appearance → Themes → Boost → General settings → Background image` | File upload (image; no enforced format/dimension restrictions in `settings.php`) |
| Login page background image | `Site admin → Appearance → Themes → Boost → General settings → Login page background image` | File upload (image; no enforced restrictions) |
| Theme preset | `Site admin → Appearance → Themes → Boost → General settings → Theme preset` | Default, Plain, or custom uploaded `.scss` preset (up to 20 via Preset files) |
| Raw initial SCSS | `Site admin → Appearance → Themes → Boost → Advanced settings → Raw initial SCSS` | SCSS variable declarations |
| Raw SCSS | `Site admin → Appearance → Themes → Boost → Advanced settings → Raw SCSS` | CSS/SCSS rule overrides |
| Full logo | `Site admin → Appearance → Logos → Logo` | File upload |
| Compact logo | `Site admin → Appearance → Logos → Compact logo` | File upload (key: `logocompact`; no enforced dimensions) |
| Favicon | `Site admin → Appearance → Logos → Favicon` | File upload |
| Site name | `Site admin → Front page → Front page settings → Full site name` | Text |
| Custom menu items | `Site admin → Appearance → Advanced theme settings → Custom menu items` | Text (`Label\|URL\|Tooltip` — 3 pipe-separated parts) |
| Additional HTML | `Site admin → Appearance → Additional HTML` | HTML/CSS/JS injection |
| Purge caches | `Site admin → Development → Purge caches` | Button click |

### What Moodle Cloud CANNOT Do
- Install custom or third-party themes (Boost only — verified at [docs.moodle.org/501/en/Themes](https://docs.moodle.org/501/en/Themes): "Moodle sites (with the exception of MoodleCloud sites) come with two Standard themes called Boost and Classic")
- Install plugins from the Moodle Plugin Directory (verified at [moodle.com/solutions/moodlecloud](https://moodle.com/solutions/moodlecloud/): "we don't allow the installation of plugins")
- Access file system (no FTP/SSH) — *inferred from SaaS architecture; no public citation*
- Modify PHP, Mustache templates, or theme files — *inferred from no-FS + no-plugin policy*
- Control Moodle version or upgrade timing (auto-upgraded) — *widely reported but no docs.moodle.org citation located*
- Override settings marked "Defined in config.php" (architectural; standard Moodle behaviour)
- Switch to Classic theme (excepted from MoodleCloud per docs.moodle.org/501/en/Themes)

## How Moodle SCSS Compilation Works

### Compilation Order

Verified against `theme/boost/lib.php` (MOODLE_500_STABLE):

```
1. theme_boost_get_pre_scss()    ← emits `$primary: <brandcolor>;` THEN appends the
                                    Raw initial SCSS field (`$theme->settings->scsspre`)
                                    — both injected BEFORE the preset.
2. Preset SCSS                   ← default.scss / plain.scss / uploaded preset.
                                    Bootstrap variables and Moodle's own SCSS
                                    (theme/boost/scss/**) are intermixed via
                                    @import inside the preset, not two discrete steps.
3. theme_boost_get_extra_scss()  ← prepends Raw SCSS field (`$theme->settings->scss`)
                                    BEFORE login-background CSS.
```

Notes:
- Brand colour field maps to `$primary` (not `$brand-primary` — corrected 2026-05-14).
- Raw initial SCSS lives INSIDE `theme_boost_get_pre_scss()`; it is not a separate stage.
- Bootstrap variables carry `!default`, so any variable set in Raw initial SCSS wins.

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
Setting `$primary` (or the Brand colour field, which maps to `$primary`) automatically affects:
- `.btn-primary` background and border (via Bootstrap `$theme-colors` map)
- Link colours (when `$link-color` is unset — Bootstrap derives `$link-color: $primary !default`; Moodle's `default.scss` does not set it)
- `.form-control:focus` border colour (via `$input-focus-border-color`)
- Progress bar fills (`.progress-bar`)
- Active navigation states (theme-colors map; pagination + list-group active)
- Checkbox/radio accent colours (`$form-check-input-checked-bg-color`)
- Dropdown active item backgrounds (`$dropdown-link-active-bg`)
- Focus ring colours (`$focus-ring-color`)
- `.badge.bg-primary` / `.text-bg-primary` (only the primary-coloured badges, not all)
- `.link-primary`, `.bg-primary` utilities
- `--bs-primary` / `--bs-primary-rgb` CSS custom properties for transparency derivations

This is WHY the sandbox must replicate this cascading behaviour — it's the single most impactful setting.

## Verified SCSS Variables (Moodle 5.0+ / Bootstrap 5.3)

### Core Colour Variables (from `preset/default.scss`)

| Variable | Default | Notes |
|---|---|---|
| `$primary` / `$blue` | `#0f6cbf` | Unchanged from Moodle 4.x |
| `$secondary` / `$gray-400` | `#ced4da` | Bootstrap 5.3 default IS `$gray-600`; Moodle aliases `$secondary` to `$gray-400` |
| `$success` / `$green` | `#357a32` | Moodle-specific |
| `$info` / `$cyan` | `#008196` | **NOT same as `$primary`** |
| `$warning` / `$yellow` | `#f0ad4e` | Moodle aliases `$warning` to `$yellow` (`$orange` is separate at `#ff7518`) |
| `$danger` / `$red` | `#ca3120` | Moodle-specific |

### Layout & Typography Variables

| Variable | Default | Notes |
|---|---|---|
| `$body-bg` | `#FFFFFF` | Bootstrap default (`$white`); not redeclared in Moodle preset |
| `$body-color` | `#1d2125` | Moodle declares `$gray-900: #1d2125`; Bootstrap 5.3 default `$body-color: $gray-900` propagates this |
| `$font-size-base` | `0.9375rem` | Moodle override (BS default is `1rem`) |
| `$line-height-base` | `1.5` | Bootstrap default; not redeclared in Moodle preset |
| `$font-family-sans-serif` | System stack | Moodle does NOT bundle any web fonts |
| `$border-radius` | `.5rem` (8px) | Moodle override (BS default is `.375rem`) |

> `$headings-font-weight` is NOT overridden in `theme/boost/scss/preset/default.scss`. Bootstrap 5.3's default `500` applies unless explicitly set elsewhere.

### Bootstrap 5.3 CSS Custom Property Chain

In Moodle 5.0+, several variables derive from CSS custom properties:

| Variable | Now References | Impact |
|---|---|---|
| `$card-bg` | `var(--bs-body-bg)` | Setting `$body-bg` cascades to cards |
| `$dropdown-bg` | `var(--bs-body-bg)` | Setting `$body-bg` cascades to dropdowns |
| `$input-bg` | `var(--bs-body-bg)` | Setting `$body-bg` cascades to inputs |
| `$input-color` | `var(--bs-body-color)` | Setting `$body-color` cascades to inputs |
| `$btn-border-radius` | `var(--bs-border-radius)` | Setting `$border-radius` cascades |

### Activity Icon Variables (Moodle 5.0+)

Verified in `theme/boost/scss/moodle/variables.scss:44-49` (MOODLE_500_STABLE):

| Variable | Default | Category |
|---|---|---|
| `$activity-icon-administration-bg` | `#da58ef` | Admin tools |
| `$activity-icon-assessment-bg` | `#f90086` | Quizzes, assignments |
| `$activity-icon-collaboration-bg` | `#5b40ff` | Wikis, databases |
| `$activity-icon-communication-bg` | `#eb6200` | Forums, messaging |
| `$activity-icon-content-bg` | `#0099ad` | Pages, files, URLs |
| `$activity-icon-interactivecontent-bg` | `#8d3d1b` | H5P, SCORM |

> The `$activity-icon-colors` SCSS map (variables.scss:52-63) still exists in Moodle 5.0 and stores the same hex colours as a map (used for `@each` iteration in `icons.scss`). It is NOT a CSS-filter map — values are hex. Override either the individual `$activity-icon-*-bg` vars or the map keys.

## Verified CSS Selectors

Tested against Moodle 5.0+ Boost theme. All confirmed to survive Bootstrap 5 migration.

### High Confidence (Verified in docs/forums/source)

| Target | Selector | Notes |
|---|---|---|
| Navbar background | `.navbar.fixed-top` | **Moodle 5.0+ uses `.bg-body`** (Bootstrap 5.3 token-based bg); Moodle 4.x used `.bg-white`. SCSS overrides should target both for cross-version safety. Needs `!important`. |
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
| Module prev/next nav (generic) | `.activity_navigation .btn-link` | In Moodle 5.0+ `course/templates/activity_navigation.mustache` uses plain `.btn.btn-link` — NOT `.btn-previous`/`.btn-next`. Icons need dark color on light wrapper. |
| Book chapter nav buttons | `.path-mod-book .btn-previous, .path-mod-book .btn-next` | Floating prev/next chapter buttons. Moodle ships them with `#dee2e6` light-grey bg (from core `mod/book/styles.css`, no SCSS variable available) — invisible on dark page bg. Default state: bg = `infoIconColour` (lime green on dark presets), chevron = `d.bodyText` (black). Hover: bg = `#FFFFFF` (white), chevron = `d.bodyText` (black). Chevron rule must target `.icon`, `.fa`, AND `svg` and set both `color` and `fill` because Moodle 4.5+ renders the chevron as inline SVG, not FontAwesome — `color` alone misses it |
| Group mode icon | `.groupmode-information img.icon` | Verified in `course/format/templates/local/content/cm/groupmode.mustache` (MOODLE_500_STABLE). Renders as `<img>` not FontAwesome; needs `filter: invert(1)` on dark themes. (Was `.activity-groupmode-info` in earlier Moodle versions — does not exist in 5.0.) |
| Help/info icons | `.icon.text-info, .fa.text-info` | Bootstrap `text-info` has `!important`; generic `.icon` rule loses specificity fight. Needs targeted override with `infoIconColour` token |
| Danger icons | `.icon.text-danger, .fa.text-danger` | Same issue as `.text-info`; needs override with `error` token |
| Warning icons | `.icon.text-warning, .fa.text-warning` | Same pattern; uses `warning` token |
| Success icons | `.icon.text-success, .fa.text-success` | Same pattern; uses `success` token |
| Link button icons | `.btn-link .icon, .btn-link .fa` | Calendar picker, etc.; uses `linkColour` token |
| File manager folder | `.fp-path-folder` | Background-image icon; needs `filter: invert(1)` with double-invert on child `a` to preserve link text |
| File manager toolbar | `.filemanager-toolbar .icon, .filemanager-toolbar .fa` | Uses `linkColour` token |
| Link action icons | `a .icon, a .fa, a [class*="fa-"]` | Plain FA icons inside links on dark bg; uses `linkColour` token (dynamic). Placed before `.bg-white` rule so white containers override |
| Outline-primary button | `.btn-outline-primary` | Default: white text/border. Hover: `linkColour` bg (dynamic). Moodle uses this for "Manage courses" etc. |
| Section toggle arrow | `.icons-collapse-expand` | Default: `linkColour` bg + dark arrow. Hover: dark bg. Expanded: white bg + dark arrow |
| Activity icon shape | `.activityiconcontainer .activityicon` | Icon image needs `filter: brightness(0) invert(1)` to show white on coloured bg. Do NOT filter the container — breaks Moodle's SVG filter |
| Completion button icons | `.btn-subtle-success .fa`, `.btn-subtle-warning .fa` | Light-bg buttons inside course content; force `d.bodyText` dark icon |
| Resource link details | `.resourcelinkdetails`, `.activity-altcontent`, `.activity-dates` | Metadata text uses Moodle `color: #555`; needs `mutedText` token override |
| Status badges | `.badge.bg-success`, `.badge.bg-info`, `.badge.bg-warning` | Force `d.bodyText` dark text on colored bg for readability |
| Filter controls | `.bg-white .form-select`, `.bg-white .btn`, `[data-filterregion]` | Multiple elements inside `.bg-white` filter panel; need final-cascade dark text + specific button/join text overrides |
| Course card progress | `.course-card .card-footer .progress-text span` | Must come AFTER `.bg-white span` override to win cascade; card footer bg also needs `cardBg` override |
| Toggle switches | `.form-check-input:checked` / `:not(:checked)` | Checked: `linkColour` bg + black SVG circle. Unchecked: white bg. Circle override via `background-image` SVG |
| Messaging drawer sidebar | `.message-app`, `.message-app .view-overview-body *` | Background: `drawerBg`. Text: `bodyText`. Links/icons: `linkColour`. Muted: `mutedText`. Do NOT include `.message-app .body-container` in white-bg rule — it's too broad |
| Search form icon | `.simplesearchform .btn-submit .icon` | Force `d.bodyText` dark — sits on white input background |
| Footer popover | `#page-footer`, `#page-footer *` | Footer has `.bg-white` class but popover has dark bg. Must use ID selector to beat `.bg-white` specificity. Uses `footerText`/`footerLink` tokens |
| Notifications popover | `.popover-region-notifications .popover-region-container`, `.popover-region-notifications .content-item-container`, `.popover-region-notifications .content-item-container:hover *` | Bell-icon dropdown. Moodle renders it as `aria-modal="true"` portalled OUTSIDE `.navbar`, so `.navbar .popover-region-container` does NOT match. Boost ships it as hardcoded `#fff` card with `#f4f4f4` unread rows and `$primary` hover — invisible on dark presets. Use `drawerBg` for container/footer, `bodyText` for text, `linkColour` for hover bg with `autoTextForHex(linkColour)` text. Hover text must use descendant `*` selector — the global `a:hover { color: linkHover }` rule beats inherited colour on the anchor inside. NOT a Bootstrap `.popover` — do not target `.popover` |
| White-bg containers | `.bg-white`, `.moodle-dialogue-bd`, `.fp-select`, `.yui3-datatable`, `.yui3-widget-bd` | Retain white bg on dark themes; force `d.bodyText` (`#1d2125`) for text, preserve `linkColour` for links |
| Message conversation | `.message-app .body-container` | White bg inside messaging; force dark text |

### Medium Confidence (Convention-based, verify per version)

| Target | Selector | Notes |
|---|---|---|
| Dashboard page | `body#page-my-index` | Body ID from `/my/index.php` |
| Dashboard cards | `.card.dashboard-card` | May vary between versions |
| Course drawers | `.drawer` | Generic drawer class in Moodle 4.x+ |
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

**Why this matters:** On dark themes, `$body-color` is set to a light value (e.g. `#F0EEEE`) so text is visible on the dark page background. However, several wrapper elements — `.ftoggler`, `.collapsed-icon.icon-no-margin`, `.path-mod-book .btn-previous`, `.path-mod-book .btn-next`, `.activity_navigation .btn-link` — keep their default light backgrounds. Icons inside these wrappers inherit the light `$body-color` and become invisible (light icon on light wrapper).

**The fix:** In Block 2 (Raw SCSS), set `.icon, .fa` to the Moodle default dark text color (`#1d2125`) so icons remain visible on light wrapper backgrounds. Hover states for interactive wrappers (`.ftoggler`, secondary nav, breadcrumb, book-scoped `.btn-previous`/`.btn-next`, `.activity_navigation .btn-link`) use `linkColour` for accent. Drawer icons are handled separately via the `drawerText` token.

**Key principle:** `$body-color` in Block 1 handles most text but does NOT fix icons that sit on light-background wrappers.

### Bootstrap Text-Utility Icon Overrides

Icons with Bootstrap semantic classes (`.text-info`, `.text-danger`, `.text-warning`, `.text-success`) get clobbered by the generic `.icon, .fa { color: #1d2125 }` rule because it has equal specificity and comes later in the cascade. These need **targeted overrides** in Block 2 using higher-specificity selectors (e.g., `.icon.text-info`) with token-based dynamic colours:

| Icon class | Token used | Example elements |
|---|---|---|
| `.icon.text-info` | `infoIconColour` (linked to `info`) | Help icons (`fa-circle-question`) |
| `.icon.text-danger` | `error` | Required field indicators (`fa-circle-exclamation`) |
| `.icon.text-warning` | `warning` | Warning indicators |
| `.icon.text-success` | `success` | Completion indicators |

### Non-FontAwesome Dark Icon Patterns

Some Moodle icons are image-based (CSS `background-image`), not FontAwesome. CSS `color` doesn't work on these — use `filter: invert(1)` instead. If the image container also contains text children, use the **double-invert trick**: invert the parent (fixes icon), counter-invert the child `a`/text element (restores readability), then apply `color` token to the child.

Known image-based icons: `.fp-path-folder` (file manager), `.groupmode-information img.icon` (group mode, Moodle 5.0+).

## Dark Theme: Body Background Image Cascade

When a user uploads a body background image at *Site admin → Boost → Background image*, or a login background image at *Site admin → Boost → Login background image*, the dark-theme generator must NOT paint the full-viewport wrappers or `#page-content` — those elements would cover the uploaded image.

The site image is painted by Boost on `body`. The login image is painted by Boost on `body.pagelayout-login #page`. Different elements, but both can be hidden by an opaque ancestor or descendant in the dark-theme SCSS.

The generator emits these rules unconditionally in dark mode:

| Selectors | Behaviour | Why |
|---|---|---|
| `#page, #page-wrapper, #topofscroll, .pagelayout-standard #page.drawers` | **never painted** | Would cover `body`'s background image. Body still shows `pageBg` via `$body-bg` in Block 1, so no white gaps when no image is set. |
| `.main-inner, #region-main-box` | painted with `pageBg` | Inner panels that sit behind cards — safe to paint, never cover any background image. |
| `.course-content, #region-main` | painted with `pageBg` + `bodyText` | Inner content panels — same logic. |
| `#page-content` | **never painted** | Full-viewport child of `#page`; would cover the login background image painted on `#page`. |
| `body#page-login-index` (login bg fill) | painted with `loginBg` when `loginBgImage` is empty; **omitted** when `loginBgImage` is set | Lets a custom login colour apply when no image is uploaded; gets out of the way when one is. |

**Why no conditional on `tokens.backgroundImage`:** the Sandbox can't observe what's uploaded directly to Moodle. Earlier attempts to branch on the Sandbox-side image token forced users to upload to two places (Sandbox + Moodle). The unconditional approach above avoids that — `$body-bg` from Block 1 cascades through transparent wrappers in the no-image case, producing the same visual result as painting the wrappers explicitly.

**Optional darkening overlay:** if the image is too busy and content readability suffers, add this to Raw SCSS:

```scss
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: -1;
  pointer-events: none;
}
```

## Bootstrap 4 → 5 Migration (Moodle 4.x → 5.0)

Moodle 5.0 jumped from Bootstrap 4 to **Bootstrap 5.3**. Most "what changed" items below actually changed in Bootstrap 5.0, but are listed here because Moodle adopted the entire 5.x line in a single upgrade.

### What Still Works
- **All SCSS variables** — `$primary`, `$body-bg`, `$font-size-base`, etc. unchanged
- **Core selectors** — `.navbar.fixed-top`, `#page-footer`, `body#page-login-index`, `.card`, `.breadcrumb`, `.drawer`
- **`!default` mechanism** — Raw initial SCSS overrides still win

### What Changed in Bootstrap 5.0 (relevant when moving from Moodle 4.x to 5.0)
- **Utility classes** — `.ml-*` → `.ms-*`, `.mr-*` → `.me-*`, `.float-left` → `.float-start`
- **Data attributes** — `data-toggle` → `data-bs-toggle`, `data-target` → `data-bs-target`
- **Grid breakpoints** — `xxl` breakpoint added
- **CSS custom properties** — Components started using `var(--bs-*)` internally
- **Font Awesome 6.x** in Moodle 5.0 (exact patch version not pinned here — check `theme/boost/thirdpartylibs.xml` for current site). `.fa` still works; adds solid/regular/brands families.

### What Changed in Bootstrap 5.3 specifically
- **Color modes** — `data-bs-theme="light|dark"` attribute system; `.navbar-light` / `.navbar-dark` deprecated in favour of color modes
- **`.text-muted` deprecated** in favour of `.text-body-secondary`
- **Deprecated colour helpers** — `.dropdown-menu-dark`, `.btn-close-white`, `.carousel-dark`
- **New helpers** — `.icon-link`, `.focus-ring`
- **Expanded `var(--bs-*)` coverage** on form controls and color-mode-aware components
- **`$enable-shadows` remains `false`** by default (not changed in 5.3)

### Backward Compatibility
- **BS4 compat layer (`theme/boost/scss/moodle/bs4-compat.scss`)** ships BS4→BS5 shims (`.ml-*`, `.mr-*`, `.media`, `.form-group`, `.float-left`, `.badge-*`, `.card-deck`, etc.), marked `@include deprecated-styles()`.
- **Silent data-attribute replacement** — Moodle 5.0 release item *"Create a compatibility helper for Bootstrap v4 > v5 data-attributes"* handles old `data-toggle` automatically.
- Removal milestone not firmly stated by Moodle; watch release notes.

## Cache Purging

- Saving Boost theme settings via the admin UI triggers `theme_reset_all_caches` automatically (callback wired in `settings.php` for each `admin_setting_configstoredfile` / colour-picker).
- Manual purge at `Site admin → Development → Purge caches` as fallback.
- **Background image / login background image uploads** also require a purge — same theme file-area cache as logo upload.
- Browser cache may also need clearing (Ctrl+Shift+R), especially with `themedesignermode` on.
- The sandbox export includes a reminder to purge caches.

## Risk: Malformed SCSS

Bad SCSS in the Raw SCSS fields **breaks the entire site's styling**. Since Moodle 3.2, the SCSS compiler **rejects the whole compile** on syntax error — it does NOT silently comment out the offending line. The result: no theme CSS is served, the site falls back to unstyled output, and the error is written to the webserver error log (not surfaced in the Moodle UI).

**Recovery** is manual:
1. Re-enter the admin SCSS field and revert to known-good content, OR
2. If the bad SCSS prevents login, edit `mdl_config_plugins` directly: clear the `theme_boost.scsspre` or `theme_boost.scss` row.
3. Purge caches (`Site admin → Development → Purge caches`).

This is exactly WHY the sandbox tool exists — to preview safely before applying.
