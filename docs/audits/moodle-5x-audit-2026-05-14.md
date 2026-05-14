# Moodle 5.x Documentation Audit — 2026-05-14

> Comprehensive audit of `docs/moodle-cloud-constraints.md` against authoritative Moodle 5.0 sources.
> **Conducted:** 2026-05-14 via 4 parallel Opus 4.7 research agents.
> **Sources verified:** `github.com/moodle/moodle@MOODLE_500_STABLE`, `docs.moodle.org/501`, Bootstrap 5.3 migration notes, `moodle.com/solutions/moodlecloud/`.

## Method

Local doc split into 4 logical sections; each delegated to an independent agent for cross-checking. Each agent fetched the live Boost theme source, lang files, official docs, and Bootstrap 5.3 reference. Verdicts: ✓ Confirmed / ✗ Wrong / ⚠ Partial / ? Unverifiable.

## Summary

| Category | Count |
|---|---|
| 🔴 Critical (code-impacting) | 4 |
| 🟡 Doc inaccuracies | 18 |
| 🟢 Confirmed correct | ~25 |
| ⚪ Unverifiable from public sources | 4 |

---

## 🔴 Critical findings — code-impacting

### C1. Navbar background class changed `.bg-white` → `.bg-body` in Moodle 5.0

**Source:** `theme/boost/templates/navbar.mustache` (MOODLE_500_STABLE) — element renders as `navbar fixed-top bg-body navbar-expand` (Bootstrap 5.3 token-based background).

**Why it matters:** The constraints doc previously stated the navbar carries `.bg-white`. That mental model is wrong for Moodle 5.0+.

**Fix applied:** Doc note corrected in `docs/moodle-cloud-constraints.md`. No code change needed — `lib/scss-generator.ts:141` already targets `.navbar.fixed-top { background-color: ... !important; }` without a class dependency, so the override wins regardless of `.bg-white` or `.bg-body`.

### C2. Brand colour maps to `$primary`, not `$brand-primary`

**Source:** `theme/boost/lib.php:109` in `theme_boost_get_pre_scss()` emits `$primary: <brandcolor>;`.

**Why it matters:** The mental model in our doc is wrong. The code already uses `$primary` so generated SCSS is fine — but the explanation misleads anyone reading the doc.

**Fix applied:** Replaced `$brand-primary` references with `$primary` in `docs/moodle-cloud-constraints.md`.

### C3. `.btn-previous` / `.btn-next` is book-specific, not generic activity navigation

**Source:** `course/templates/activity_navigation.mustache` uses plain `.btn.btn-link`. `.btn-previous` / `.btn-next` are only valid scoped to `.path-mod-book` (confirmed in `mod/book/styles.css`).

**Why it matters:** Our generic "Module prev/next nav" rules in `lib/scss-generator.ts:352-364` targeted unscoped `.btn-previous`/`.btn-next` — silently dead on Moodle 5.0 generic activities (only worked for the book module). Books are also covered by the more specific `.path-mod-book` block at line 369+, so books were not affected.

**Fix applied:** Added `.activity_navigation .btn-link` to the icon and hover rules in `lib/scss-generator.ts:352-364`. The legacy `.btn-previous`/`.btn-next` selectors retained for Moodle 4.x compatibility. The book-scoped block (`.path-mod-book ...`) remains as-is.

### C4. `.activity-groupmode-info img.icon` does not exist in Moodle 5.0

**Source:** `course/format/templates/local/content/cm/groupmode.mustache` uses `.groupmode-information` and `.groupmode-icon-info`.

**Why it matters:** The constraints doc listed only the old selector.

**Fix applied:** Doc updated to use `.groupmode-information`. No code change needed — `lib/scss-generator.ts:525-528` already emits a 3-way selector covering `.activity-groupmode-info img.icon`, `.groupmode-information img.icon`, AND `[data-region="groupmode-information"] img.icon` for cross-version safety.

---

## 🟡 Doc inaccuracies — corrected

### Theme settings table

| Doc line | Was | Now (corrected) |
|---|---|---|
| Background image format | `JPG/PNG, 1920x1080, <150dpi` | `File upload (image; no enforced format/dimension restrictions)` |
| Login field label | `Login background image` | `Login page background image` |
| Theme preset values | `Default or Plain` | `Default, Plain, or custom uploaded .scss preset` |
| Compact logo field | `"Small logo"` + `100x100` | `"Compact logo"` (key: `logocompact`); no enforced dimensions |
| Site name path | `Site admin → General → Site home settings` | `Site admin → Front page → Front page settings → Full site name` |
| Custom menu format | `Text (Link\|URL format)` | `Text (Label\|URL\|Tooltip — 3 pipe-separated parts)` |
| Purge caches label | `Purge all caches` | `Purge caches` |

### SCSS pipeline (lines 35–82)

- Step 1: `Brand colour → $brand-primary variable` → **`Brand colour → $primary variable`**.
- Compilation order clarified: `theme_boost_get_pre_scss()` emits `$primary` AND Raw initial SCSS together → preset (Bootstrap vars + Moodle imports interleaved, not two discrete steps) → `theme_boost_get_extra_scss()` prepends Raw SCSS before login-bg CSS.

### Variables (lines 83–134)

| Variable | Was | Now |
|---|---|---|
| `$warning` alias | `$orange` (`#f0ad4e`) | `$yellow` (`#f0ad4e`). `$orange` is separate (`#ff7518`). |
| `$body-color` alias | `$gray-900` (Moodle declared) | `$gray-900: #1d2125` declared in Moodle; Bootstrap 5.3 default `$body-color: $gray-900` propagates. |
| `$headings-font-weight: 700` | Listed as Moodle override | Removed — not declared in `preset/default.scss`; Bootstrap 5.3 default `500` applies. |
| Activity icon map | "Used CSS filter values" | `$activity-icon-colors` map still exists at `theme/boost/scss/moodle/variables.scss:52-63` storing hex colours (not filters). |

### Bootstrap migration (lines 231–250)

- **Section relabelled** from "Bootstrap 5.3 Migration" to "Bootstrap 4 → 5 Migration (Moodle 4.x → 5.0)" — because `.ml-*`/`.ms-*`, `.mr-*`/`.me-*`, `.float-left`/`.float-start`, `data-toggle`/`data-bs-toggle` all changed in Bootstrap 5.0, not 5.3.
- **Genuine 5.3-specific items added** in a separate subsection: color modes (`data-bs-theme="light|dark"`), `.text-muted` → `.text-body-secondary`, deprecation of `.navbar-dark` / `.dropdown-menu-dark` / `.btn-close-white` / `.carousel-dark`, `.icon-link` and `.focus-ring` helpers, expanded `var(--bs-*)` on form controls.
- **Compat file name corrected** from `bs5-compat.scss` to `bs4-compat.scss`.
- **FontAwesome version** softened from `6.7.2` to `6.x` (specific patch not verified in `thirdpartylibs.xml`).

### Cache purging

- Added explicit note: Background image upload requires the same theme file-area cache purge as logo upload.
- Clarified that SCSS compile errors are logged to the webserver error log, not surfaced in the Moodle UI.

### Risk: Malformed SCSS

- Removed any implication that Moodle "comments out the problematic line".
- Clarified: Moodle rejects the entire SCSS compile, serves no theme CSS, recovery is **manual revert via admin UI** or DB edit of `mdl_config_plugins` (`theme_boost.scsspre` / `theme_boost.scss`).

---

## 🟢 Confirmed correct

- `body#page-login-index`, `#loginbtn`, `.login-container`, `.login-heading`, `.login-form` — verified in `lib/templates/loginform.mustache`.
- `.secondary-navigation .nav-tabs .nav-link.active` — verified via `theme/boost/templates/columns2.mustache` + `lib/templates/tabtree.mustache`.
- `#page-footer` (still has `.bg-white`) — verified in `theme/boost/templates/footer.mustache`.
- `.activityiconcontainer .activityicon` — verified in `course/templates/activity_icon.mustache`.
- `.message-app` (messaging drawer) — verified in `message/templates/message_drawer.mustache`.
- `.fp-path-folder` — verified (legacy YUI-era markup, stable).
- All 5 Bootstrap 5.3 CSS-custom-property chain entries (`$card-bg → var(--bs-body-bg)`, `$dropdown-bg`, `$input-bg`, `$input-color`, `$btn-border-radius`) — verified line-by-line in BS 5.3.3 `_variables.scss`.
- Default colour values for `$primary` (`#0f6cbf`), `$success` (`#357a32`), `$info` (`#008196`), `$danger` (`#ca3120`), `$secondary` (`#ced4da`) — all match `theme/boost/scss/preset/default.scss`.
- `$font-size-base` (`0.9375rem`), `$border-radius` (`.5rem`) — match Moodle override values.
- All 6 individual activity-icon bg vars — values match `theme/boost/scss/moodle/variables.scss:44-49`.
- "Boost only on Cloud" — `docs.moodle.org/501/en/Themes` explicitly excepts MoodleCloud.
- "Cannot install plugins on MoodleCloud" — confirmed at `moodle.com/solutions/moodlecloud/` ("we don't allow the installation of plugins").
- Cache purge required for SCSS / brand colour / logo / preset changes.

---

## ⚪ Unverifiable from public sources (kept with inferred note)

- "Cannot access file system (FTP/SSH)" — consistent with SaaS model; no direct citation.
- "Cannot modify PHP / Mustache / theme files" — implied by no-FS + no-plugin policy; no explicit citation.
- "Auto-upgraded" — widely reported, no `docs.moodle.org/501` citation located.
- `.block_moodlecloudtrial` selector — proprietary MoodleCloud markup, not in core repo. (Doc already flags this correctly.)

---

## Key authoritative sources

- [Boost theme settings.php (MOODLE_500_STABLE)](https://github.com/moodle/moodle/blob/MOODLE_500_STABLE/theme/boost/settings.php)
- [Boost lib.php — get_pre_scss / get_main_scss_content / get_extra_scss](https://github.com/moodle/moodle/blob/MOODLE_500_STABLE/theme/boost/lib.php)
- [Boost default preset](https://github.com/moodle/moodle/blob/MOODLE_500_STABLE/theme/boost/scss/preset/default.scss)
- [Boost SCSS moodle/variables.scss](https://github.com/moodle/moodle/blob/MOODLE_500_STABLE/theme/boost/scss/moodle/variables.scss)
- [Boost navbar.mustache](https://github.com/moodle/moodle/blob/MOODLE_500_STABLE/theme/boost/templates/navbar.mustache)
- [Bootstrap 5.3 migration guide](https://getbootstrap.com/docs/5.3/migration/)
- [Bootstrap 5.3 customize options](https://getbootstrap.com/docs/5.3/customize/options/)
- [Moodle 5.0 release notes](https://moodledev.io/general/releases/500)
- [Moodle Themes page (501)](https://docs.moodle.org/501/en/Themes)
- [MoodleCloud plans](https://moodle.com/solutions/moodlecloud/)
