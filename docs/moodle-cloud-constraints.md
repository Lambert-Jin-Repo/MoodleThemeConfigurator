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
| Quiz edit page (light containers) | `#page-mod-quiz-edit ul.slots li.section .content`, `#page-mod-quiz-edit .section-heading`, `#page-mod-quiz-edit ul.slots li.activity`, `#page-mod-quiz-edit .instancemaxmarkcontainer`, `#page-mod-quiz-edit div.questionbank .categoryquestionscontainer` | The quiz module's OWN stylesheet (`mod/quiz/styles.css`, verified identical in MOODLE_405_STABLE and main/5.x — path moved to `public/mod/quiz/styles.css` in 5.x) hardcodes these containers LIGHT (`#fafafa`/`#e6e6e6`/`#fff`/`#fdfdfe`) with NO `.bg-white` class, so the white-bg rules above never match them. In dark presets the broad `.card`/`.section .fa`/page-wrapper text rules repaint the text light → invisible (e.g. the "Shuffle" label on `#fafafa .content`). Force `d.bodyText` (`#1d2125`) for text + `d.linkColour` (`#0f6cbf`) for links — light-theme defaults, accessible on light bg ("Fixed dark"). ID-anchored to `#page-mod-quiz-edit` and **colour-only** (never `background`), so nothing outside this page/these containers is touched. Backgrounds stay light by design (Moodle paints them). Needs `!important`. Not theme-specific — emits for ANY dark `pageBg` |
| Quiz edit page (nested dark popover) | `#page-mod-quiz-edit … .content .dropdown-menu .dropdown-item`, `… .section-heading .dropdown-menu …`, `… li.activity .dropdown-menu …` | EXCEPTION to the row above. The "Add" action menu (and question/section action menus) are `.dropdown-menu` popovers that sit INSIDE the light containers in the DOM but keep their own DARK bg (`cardBg`, set by the site-wide `.dropdown-menu` dark rule + `$dropdown-bg`). The fixed-dark rule would force dark-on-dark inside the open menu. Re-assert `tokens.bodyText` (light) anchored through each container root + `.dropdown-menu` so it beats the fixed-dark rules; the deeper `.dropdown-menu .dropdown-item` selector (specificity `(1,5,2)`) also beats the blue-link rule `(1,4,3)` for the `<a>` menu items. Only the OPEN menu flips to light — the toggle stays dark on its light container (it is not inside `.dropdown-menu`) |
| Quiz edit page (inline-edit input) | `#page-mod-quiz-edit .inplaceeditable input`, `… .inplaceeditable .form-control`, `… .inplaceeditable .form-select` | When editing a mark (`.instancemaxmarkcontainer`) or a question/section name, Moodle swaps in an `<input class="form-control">` that the global dark form rule paints dark-bg; the quiz-edit catch-all then forces its text dark → dark-on-dark while typing. Restore a white field: `background:#FFFFFF`, `color:` `d.bodyText` (`#1d2125`), `border-color:#dee2e6`. Page-scoped to `#page-mod-quiz-edit .inplaceeditable` only — the page's other inputs (e.g. Maximum grade) are untouched |
| Quiz edit page (Add-question modal) | `#page-mod-quiz-edit .modal-content` (+ `*`, `.form-control`/`input`, `a:not(.btn)`, `.btn-primary`) | The "Add → a new question" / "from question bank" chooser is a Bootstrap modal portalled to `<body>` (still under `#page-mod-quiz-edit`) with a white `.modal-content` that no dark rule darkens → light-on-white. Mirror the `.bg-white` treatment, page-scoped: dark text (`d.bodyText`), white inputs, blue links (`d.linkColour`), and primary buttons kept on-brand (`tokens.btnPrimaryText`/`tokens.btnPrimaryBg`). ID-anchored, so other pages' modals are unaffected |
| Question bank table (dark surface) | `#page-question-edit .question-bank-table` (+ `th`/`td`, `.header`/`thead th`, `a:not(.btn)`, `.icon`/`.fa`) | The standalone Question bank (`question/edit.php`) renders the list as a Bootstrap `table.question-bank-table`; Bootstrap paints cells from `--bs-table-bg` (resolves to the light `--bs-body-bg`) so the dark theme's light/lime text was unreadable on a light table. Redefine `--bs-table-bg/color/border-color` → `cardBg`/`bodyText`/`cardBorder` (+ `!important` cell colour); headers `headingText`, links `linkColour`. Then **re-light the column move/resize action handles + three-dot menu glyphs** (`.icon`/`.fa`), which the generic `.icon, .fa { color: ${d.bodyText} }` rule keeps dark-on-dark on the now-dark header — scope to `.question-bank-table` and use `:not([class*="text-"])` to preserve semantic (`.text-success`/`.text-danger`) status icons. Double-anchored to `#page-question-edit` + `.question-bank-table`. Dark presets only |
| Question bank "show question text" label | `#page-question-edit .input-group .input-group-text` | The "Show question text in the question list?" toolbar label is a Bootstrap `label.input-group-text` (light-grey `--bs-tertiary-bg` chip) that sits OUTSIDE `.question-bank-table`, so the table-surface rule can't reach it and the broad light-text rule leaves it faint on the grey chip. Force `d.bodyText` (`#1d2125`) — fixed-dark on the light chip; colour only, `!important` |
| Question preview page (`.que .info` + controls) | `#page-question-preview` **and** `#page-question-bank-previewquestion-preview` → `.que .info` (+ `.state`/`.grade`/`h3.no`/`span.qno`); `#previewcontrols .btn-secondary`/`.btn-outline-secondary` | Question preview (`question/preview.php`). Moodle 4.0+ moved preview into the `qbank_previewquestion` plugin → body id `page-question-bank-previewquestion-preview`, so BOTH the legacy and plugin ids are anchored (a non-matching id no-ops). Moodle hardcodes `.que .info` LIGHT (`$gray-100`, no `.bg-white`) so the `#page-content` light-text rule lights its number/state/grade → faint. Force `d.bodyText` (fixed-dark, colour only). The preview control buttons render as transparent ghost outlines via the global dark `.btn-secondary` rule → give them a solid dark `cardBg` surface (+ `cardBorder`/`bodyText`); `.btn-primary` ("Submit and finish") left on-brand. Dark presets only |
| Quiz view attempts table (dark surface) | `#page-mod-quiz-view .quizreviewsummary td.cell`/`th.cell` (+ `a:not(.btn)`) | "Your attempts" summary on `mod/quiz/view.php`. The quiz module stylesheet hardcodes `table.quizreviewsummary td.cell` LIGHT (`background:#fafafa`, no `.bg-white`) → the dark theme's light text (Status "In progress", the Started date) is invisible. **Unlike** the quiz-edit / question-preview fixes (dark text on light), the user wanted a true **dark surface**: cells → `cardBg` bg + `bodyText` text + `cardBorder` border; links `linkColour`. ID-anchored; `(1,2,2)`+`!important` beats Moodle's `(0,2,2)`. Dark presets only |
| Quiz `.que .info` panel (dark surface) | `[id^="page-mod-quiz-"] .que .info` (+ `.info *`, `.info a:not(.btn)`, `.info .questionflagimage[src*="unflagged"]`, `.info .questionflagimage[src*="flagged"]:not([src*="unflagged"])`) | The question status column on `mod/quiz` attempt/preview/review/summary pages. Moodle hardcodes `.que .info` LIGHT (`$gray-100`) → number / "Not yet answered" / "Marked out of" / Flag / Edit links invisible. Give it a **dark surface** (`cardBg` bg + `cardBorder`) with `bodyText` text and `linkColour` links. The Flag state icon is a raw `<img class="questionflagimage" src=".../i/...">` (PIX image, NOT FontAwesome) so `color:` can't recolour it — use TWO `filter`s keyed on `src`: UNFLAGGED (`i/unflagged`) → `brightness(0) invert(1)` (white, matches the Edit-question pen); FLAGGED (`i/flagged`, which renders **black** on Moodle Cloud, not red) → a filter chain tinting it red (≈ CFA Red `#F64747`; an `<img>` filter can't follow the `error` token, so it approximates). `[src*="flagged"]:not([src*="unflagged"])` matches the flagged src only ("unflagged" also contains "flagged"). Anchored to the quiz body-id **prefix** so one rule covers all quiz question pages (quiz-edit has no `.que .info`). The pale-blue `.formulation` body is intentionally untouched. Dark presets only |
| Multichoice "Clear my choice" link | `.que .qtype_multichoice_clearchoice` (+ `a`/`button`/`[role="button"]`, `:hover`) | After a radio option is selected, Moodle reveals a "Clear my choice" link inside the pale-blue `.formulation` box that Moodle keeps LIGHT — so the dark theme's lime/orange link colour is near-invisible on it. Force a **fixed CFA brand accent — Purple `#B500B5`** (high contrast, ~4.6:1 / WCAG AA on the light-blue box; a fixed value like `#FFFFFF`/`#1d2125` because it must NOT follow the dark link token). Bold (`font-weight:700`) on hover. Element-scoped to the clear-choice control only; covers `<a>`/`<button>`/`[role=button]` across versions. Dark presets only |
| Gradebook setup table (dark surface) | `#grade_edit_tree_table` (table id) — `th`/`td`/`tr th`, `th *`/`td *`, `a:not(.btn)`, `.icon`/`.fa:not([class*="text-"])`, `.text-muted`/`.dimmed_text`/`small`, `.badge.bg-light`; plus `.path-grade-edit-tree .gradetree-wrapper` for the frame | Gradebook setup (`grade/edit/tree/index.php`). Moodle's `grade.scss` UNCONDITIONALLY hardcodes the `setup-grades` table LIGHT — wrapper + header/total cells `$gray-100` (`#f8f9fa`), category/item rows `$grade-table-td-bg` (`#fff`) — with no dark variant, so the dark theme's light text washes out. Like quiz-view (#122) the user wanted a **dark surface**: wrapper + cells → `cardBg` + `bodyText` + `cardBorder` (redefine `--bs-table-bg`/`-color`/`-border-color` on the table too); links `linkColour`; the Weights `+`/three-dot action icons re-lit to `bodyText` (`:not([class*="text-"])` spares semantic icons); muted metadata `mutedText`. The `.badge.bg-light.text-dark` status pills ("Natural", "Exclude empty grades") kept a light bg while their text was forced light → light-on-light; given a dark `cardBorder` chip + `bodyText`. Dark presets only |

> **⚠ `/index.php` body-id gotcha:** Moodle builds the body **id** from the *pagetype* and does **NOT** strip a trailing `/index` (`moodle_page::initialise_default_pagetype()`, `lib/pagelib.php`; verified identical across Moodle 4.4 / 4.5 / 5.0). So `grade/edit/tree/index.php` → pagetype `grade-edit-tree-index` → body id **`#page-grade-edit-tree-index`**, NOT `#page-grade-edit-tree` (which matches nothing — the cause of a failed first attempt on this page). The body **class** list DOES drop the last segment (`initialise_standard_body_classes()` loop runs `i < count`), so `.path-grade-edit-tree` IS present. **Lesson:** for `/index.php` pages prefer a stable element id in the DOM (here `#grade_edit_tree_table`, hardcoded in `grade/edit/tree/lib.php`) or the `.path-…` body class — never assume `#page-<path>` without the `-index` suffix.

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

## Dark Theme: Background Images

Moodle Boost applies the **"Background image"** admin setting (Site admin → Appearance → Themes → Boost → Background image) to the bare **`body`** element, **desktop-only**, via `theme_boost_get_extra_scss()` (`public/theme/boost/lib.php`, Moodle 5.x):

```css
@media (min-width: 768px) {
  body { background-image: url('...'); background-size: cover; }
}
```

(The separate **login** background image targets `body.pagelayout-login #page .login-layout-left` — a different setting and code path.) In stock Boost, `#page` and the inner content wrappers are **transparent**, so the body image shows through the whole content column.

**The conflict:** the generator's dark theme paints the structural page wrappers solid to avoid white gaps — `#page, #page-wrapper, #topofscroll, .main-inner, #region-main-box, .pagelayout-standard #page.drawers` (+ `.secondary-navigation`, `.breadcrumb`, `.course-content, #region-main, #page-content`) all get `background-color: pageBg !important`. These opaque layers sit **on top of** `body` and hide the image — only the right margin (outside the wrappers) shows it.

**The fix** (gated on `tokens.backgroundImage`, inside `if (darkMode)`):

| When | Behaviour |
|---|---|
| Background image **set** | `body { background-color: pageBg !important }` fallback + the structural wrappers → `background-color: transparent !important` so the body image shows through. Cards/blocks/navbar/drawer/footer/dropdowns/forms stay **opaque** for readability. |
| **No** image | Wrappers stay opaque `pageBg` — byte-identical to before (no white gaps). |
| **Light** theme | Rules are inside `if (darkMode)` — never emitted. |

**Key facts:**
- The body image and the dark fallback colour are **different CSS properties on the same `body`** — `background-color: pageBg !important` does **not** erase Boost's `background-image`; they coexist (image paints over the colour).
- **Mobile <768px:** Boost omits the image, so the `body` dark colour is essential as the fallback (never white). Do **not** set `background-color: transparent` on `body`.
- **Requirement:** the admin must set the image in the tool's **"Background Images"** control so `tokens.backgroundImage` is truthy and the gated SCSS engages. The actual image file is still uploaded via Boost's setting (the tool emits only a reminder comment, never the `url()`).
- **Readability:** content not inside an opaque card (breadcrumb text, section headings, bare paragraphs) now sits over the image — fine over a dark/sparse image (e.g. the CFA charcoal-with-squares brand background), but a busy/bright image could drop contrast; keep `#region-main`/`#page-content` as a translucent scrim if a future image needs it.

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
