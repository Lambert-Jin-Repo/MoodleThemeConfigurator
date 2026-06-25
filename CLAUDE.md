# CFA Brand Sandbox — Project Instructions

> **Any Claude agent working on this project MUST read this file first and follow all rules below.**

## What This Project Is

A client-side web app that lets non-technical CFA admins preview Moodle theme colour/layout changes on a realistic replica, check WCAG accessibility, and export ready-to-paste SCSS for Moodle Cloud.

**Core workflow:** Pick colours → See live preview → Check contrast → Copy SCSS → Paste into Moodle → Done.

## Critical Files

| File | Role |
|---|---|
| `UNIFIED-SPEC.md` | **Source of truth** — the full build specification. Read this FIRST for any implementation work. |
| `docs/cfa-brand-reference.md` | CFA brand palette, typography, logo system |
| `docs/moodle-cloud-constraints.md` | **Moodle theming reference** — platform limits, SCSS fields, verified selectors, dark theme support, preset checklist, activity icons |
| `docs/implementation-plan.md` | 14-step build plan with dependency graph |
| `docs/references/` | Screenshots, mockups, superseded docs (visual reference only) |

## Tech Stack

- **Framework:** Next.js 14+ (App Router), React 18+, TypeScript
- **Styling:** Tailwind CSS (tool UI) + CSS Custom Properties (preview)
- **State:** Zustand + zundo (undo/redo middleware)
- **Colour Picker:** react-colorful
- **Icons:** lucide-react
- **Hosting:** Vercel (static export, `output: 'export'`)
- **Persistence:** localStorage only — NO backend, NO database, NO auth

## Architecture Rules (MANDATORY)

1. **Client-side only.** No API routes, no server components that fetch data, no Supabase, no auth.
2. **CSS Custom Properties drive the preview.** `MoodleShell` converts Zustand tokens to `--cfa-*` CSS variables. ALL preview child components use `var(--cfa-*)` — NEVER hardcode colours in preview components.
3. **Brand propagation is critical.** When `brandPrimary` changes, linked tokens auto-update UNLESS manually overridden. See `BRAND_LINKED_KEYS` in `lib/tokens.ts`.
4. **Two-block SCSS export.** Block 1 = SCSS variable declarations for "Raw initial SCSS". Block 2 = CSS rule overrides for "Raw SCSS".
5. **Smart export.** Only include sections that differ from Moodle defaults. Omitted sections get comments.
6. **Defaults = Moodle Boost**, NOT CFA brand. Brand primary starts at `#0f6cbf`.

## Enforcement (MANDATORY — NO EXCEPTIONS)

These rules exist because agents have previously rationalized skipping them. **Do not rationalize.**

1. **Worktree-first for all features.** ANY feature work (no matter how small) MUST start by invoking `superpowers:using-git-worktrees` BEFORE writing any code. If you find yourself thinking "this is too small for a worktree" — that is the signal to use a worktree.
2. **Never modify files on `main`.** If you are on `main` and about to edit a source file, STOP. Create a feature branch or worktree first.
3. **Follow all skill phases.** If the `/feature` skill is invoked, every phase (DISCOVER → SPECIFY → BUILD → VERIFY → SHIP) must be completed in order. No skipping.
4. **No code before spec approval.** When using the `/feature` pipeline, do NOT write implementation code until the feature spec MD is written and the user has approved it.

**If you violate any of these rules, STOP immediately, tell the user what happened, and ask how to proceed.**

## Git Workflow (MANDATORY)

All agents MUST follow this workflow. No exceptions.

### Branching
- **NEVER commit directly to `main` or `master`.** Always use feature branches.
- Branch naming: `<type>/<short-description>`
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- Examples: `feat/dashboard-page`, `fix/contrast-ratio`, `docs/readme-update`
- Use `/create-branch` skill to create branches correctly.

### Committing
- **ALWAYS run `/safe-commit` before creating commits.** This runs:
  1. `npm run build` — must pass
  2. `npm run lint` — must pass
  3. Secret scan — must find nothing
  4. Then creates a conventional commit
- Commit format: `<type>(<scope>): <description>`
- Examples: `feat(preview): add dashboard page replica`, `fix(audit): correct contrast ratio calculation`
- NEVER commit `.env` files, API keys, tokens, passwords, or credentials.

### Pushing
- **ALWAYS run `/safe-push` before pushing.** This validates:
  1. Not on a protected branch (main/master)
  2. Build passes
  3. Lint passes
  4. No secrets in any commits
  5. Branch is up to date
- After pushing, create a PR for review.

### Pull Requests
- Use `/review-pr` to review PRs before merging.
- PRs must pass build + lint checks.
- Flag any hardcoded colours in preview components.
- Flag any missing `aria-label` on interactive elements.

## Security Rules (MANDATORY)

- **NEVER commit secrets.** No API keys, tokens, passwords, .env files, *.pem files, credentials.json.
- **Run `/check-secrets`** before any commit if in doubt.
- The `.gitignore` MUST include: `.env`, `.env.local`, `.env.*.local`, `*.pem`, `credentials.json`.
- If you accidentally stage a secret, unstage it immediately: `git reset HEAD <file>`.

## Available Skills

### Project Skills
| Skill | Purpose | When to Use |
|---|---|---|
| `/build-component [name]` | Generate component following project patterns | Building any new component |
| `/check-theme-accuracy` | Verify preview matches Moodle screenshots | After building/modifying preview pages |
| `/validate-scss-export` | Check SCSS output is valid for Moodle Cloud | After modifying SCSS generator |
| `/brand-audit` | WCAG contrast + CFA brand compliance | After changing default colours or audit logic |
| `/continue-build` | Resume from current implementation step | Starting a new session or continuing work |

### Workflow Skills
| Skill | Purpose | When to Use |
|---|---|---|
| `/safe-commit` | Build + lint + secret scan + conventional commit | **Every time before committing** |
| `/safe-push` | Full validation before pushing to remote | **Every time before pushing** |
| `/create-branch [type/name]` | Create feature branch with naming convention | Starting new work |
| `/check-secrets` | Scan for leaked credentials in staged changes | Before commits, when unsure |
| `/verify-build` | Run `npm run build` and confirm zero errors | After making code changes |
| `/review-pr [number]` | Review a pull request with project-specific checks | Reviewing PRs |

## CFA Brand Palette

| Name | Hex | Usage |
|---|---|---|
| Charcoal | `#404041` | Primary text, dark backgrounds, toolbar |
| Light Grey | `#F0EEEE` | Subtle backgrounds |
| Orange | `#F27927` | Primary accent, CTAs, export button |
| Purple | `#B500B5` | Secondary accent |
| Sky Blue | `#00BFFF` | Links, interactive elements |
| Teal | `#336E7B` | Brand primary for Moodle theme |
| Lime Green | `#BAF73C` | Highlights, success states |
| Red | `#F64747` | Alerts, errors, logo "ACCESSIBILITY" text |

## Moodle Cloud Constraints

- **Boost theme only** — cannot install custom themes
- **Two SCSS fields:** "Raw initial SCSS" (variables) + "Raw SCSS" (overrides)
- **$primary propagates** to buttons, links, focus rings, progress bars automatically
- **Must purge caches** after SCSS changes

## Key Verified Selectors

| Target | Selector | Notes |
|---|---|---|
| Navbar | `.navbar.fixed-top` | Needs `!important` |
| Login body | `body#page-login-index` | Stable ID |
| Login button | `#loginbtn` | Verified |
| Course tabs | `.secondary-navigation .nav-tabs .nav-link.active` | Moodle 4.x+ |
| Footer | `#page-footer` | Verified |

## Dark Theme SCSS Generator Rules (MANDATORY)

When adding or modifying dark theme overrides in `lib/scss-generator.ts`, every colour MUST be classified into one of these categories. **NEVER hardcode hex values** — always use token references or Moodle defaults.

### Colour Classification System

| Category | When to use | Token/Value | Example |
|---|---|---|---|
| **Dynamic** | Interactive elements that should follow the main theme colour | `${tokens.linkColour}`, `${tokens.infoIconColour}` | Link icons, toggle bg, hover states |
| **Semantic** | Alert/status colours that keep their meaning | `${tokens.error}`, `${tokens.warning}`, `${tokens.success}` | `.text-danger` icons, `.text-warning` icons |
| **Fixed dark** | Dark text on always-light backgrounds (`.bg-white`, dialogs, light buttons) | `${d.bodyText}` (`#1d2125`) | White container text, completion icons, filter labels |
| **Fixed white** | White text/elements on always-dark backgrounds | `#FFFFFF` | `.btn-outline-primary` text, activity icon filter |
| **Computed** | Auto-contrast text based on background brightness | `autoTextForHex(tokens.xxx)` | Button text on dynamic bg |
| **Static muted** | Secondary/metadata text, same across all dark themes | `${tokens.mutedText}` | File sizes, timestamps, category labels |
| **Image-based** | Icons rendered as CSS background-image, not FontAwesome | `filter: invert(1)` or `brightness(0) invert(1)` | Folder icon, group mode icon, activity icons |

### Cascade Order (Critical)

The SCSS generator dark mode section has a strict cascade order. Later rules override earlier ones when `!important` and specificity are equal:

1. **General dark theme rules** — light text for dark backgrounds (`${tokens.bodyText}`)
2. **Messaging drawer sidebar** — light text for sidebar (`${tokens.bodyText}`)
3. **White-bg container overrides** — dark text for `.bg-white`, dialogs, YUI3 (`${d.bodyText}`) — beats layer 1 & 2
4. **Filter/form-specific overrides** — dark text for filter panel elements outside `.bg-white` DOM
5. **`.bg-white` final overrides** — highest-specificity dark text for forms/buttons inside white containers
6. **Exceptions** — course card progress text, etc. that must beat `.bg-white span` — placed at very end

### Key Dark Theme Tokens

| Token | Default | Dark Presets | Linked to |
|---|---|---|---|
| `infoIconColour` | `#0f6cbf` | `#BAF73C` (lime green) | `brandPrimary` via `BRAND_LINKED_KEYS` + `linkColour` via `setToken` |
| `error` | `#ca3120` | `#F64747` (CFA Red) | Independent (semantic) |
| `info` | `#008196` | `#00BFFF` (CFA Sky Blue on dark-lime) | Independent (semantic, NOT `linkedToBrand`) |
| `mutedText` | `#6a737b` | `#A0A0A1` | Independent |
| `drawerBg` | `#FFFFFF` | `#1D2125` | Independent |

### When fixing dark theme display issues (`/moodle-issue` skill)

1. Identify: is the element on a dark bg or inside a white container?
2. Classify: should the colour be dynamic (follows main theme), fixed, semantic, or muted?
3. Check: is it FontAwesome (use `color`) or image-based (use `filter`)?
4. Place: add the rule at the correct cascade layer (see above)
5. Verify: does it work on ALL dark presets, not just the one being tested?
6. Document: update `docs/moodle-cloud-constraints.md` and `docs/PROJECT-TRACKER.md`

### Current Status (2026-06-25)

- **Branches:** `worktree-fix+dark-theme-quiz-edit-contrast` (quiz-edit #113–116) and `worktree-fix+dark-theme-bg-image-overlay` (background image #117). The latter has the former merged in for combined testing, so both fixes coexist there.
- **Issue fixed this session:** Dark themes rendered text invisible on the quiz "Questions" edit page (`#page-mod-quiz-edit`, `mod/quiz/edit.php`). Moodle's quiz stylesheet hardcodes the slot/section/question-bank containers LIGHT (`#fafafa .content`, `#e6e6e6 li.activity`, `#fff` question bank, `#fdfdfe` inplaceeditable) with NO `.bg-white` class, so existing white-bg overrides never matched and the broad dark-text rules repainted the text light → invisible (Shuffle label, section heading, question rows). User-verified fixed (#113, #114).
- **Categories covered:** **Fixed dark** on hardcoded-light containers that lack `.bg-white` (new sub-case — uses light-theme default tokens `d.bodyText`/`d.linkColour`, NOT dark-preset `tokens.*`); plus an **Exception** (cascade tail) re-lighting the nested `.dropdown-menu` "Add" popover to `tokens.bodyText` so the open menu (dark `cardBg`) is not dark-on-dark.
- **Implementation:** ID-anchored to `#page-mod-quiz-edit`, colour-only (never background), appended at the very end of the `if (darkMode)` block. Tier 1 forces `d.bodyText` text + `d.linkColour` links on the light containers; Tier 2 dropdown rule uses specificity (1,5,2) to beat the Tier 1 blue-link rule (1,4,3). Gated by `darkMode = isDarkBg(tokens.pageBg)` so it emits for ALL dark presets (Dark Lime, Dark Ember, any custom dark bg) and stays OFF for the 8 light presets. NO new token, NO preset edits, NO control-panel/quick-palette change.
- **#115 / #116 (fixed this session):** inline editing `<input>` now renders as a white field; the "Add a new question" / "from question bank" modal now uses `.bg-white`-style dark text on white (with white inputs, blue links and preserved primary buttons). Both page-scoped to `#page-mod-quiz-edit`.
- **Background image on dark themes (#117, fixed this session, separate branch):** the pre-existing page-wrapper rule (`#page, #page-wrapper, … { background-color: ${tokens.pageBg} !important }`, in the `if (darkMode)` block) covered Moodle's `body`-level background image. Fixed by gating on `tokens.backgroundImage`: when an image is set, `body` keeps `pageBg` as a fallback and the structural wrappers (`#page` family, `.secondary-navigation`, `.breadcrumb`, `.course-content`/`#region-main`/`#page-content`) go `transparent`; cards/nav/drawer/footer stay opaque. No image → unchanged (no white gaps); mobile <768px → solid dark via body fallback; light themes untouched. User-verified. See `project_dark_theme_bg_image.md` (memory) and the new "Dark Theme: Background Images" section in the constraints doc.
- **Files modified:** `lib/scss-generator.ts`, `CLAUDE.md`, `docs/moodle-cloud-constraints.md` (selector rows + Background Images section), `docs/PROJECT-TRACKER.md`, `.eslintrc.json` (`root: true`). Memory notes: `project_dark_theme_quiz_edit.md`, `project_dark_theme_bg_image.md` (outside repo).
- **Question bank + question preview contrast (#118–121, this session, branch `worktree-fix+dark-theme-qbank-table`):** (#118) `#page-question-edit .question-bank-table` given a dark Bootstrap-table surface (redefine `--bs-table-bg/color/border`) so light/lime text reads; (#119) the column move/resize action-handle icons + three-dot menu glyphs — kept dark by the generic `.icon,.fa { color:${d.bodyText} }` rule — re-lit to `tokens.bodyText`, scoped to `.question-bank-table` with `:not([class*="text-"])` to spare semantic icons; (#120) the "Show question text in the question list?" `.input-group-text` label forced to `d.bodyText` (fixed-dark on the light Bootstrap chip); (#121) the question preview `.que .info` panel forced to `d.bodyText` and the ghost-outline preview control buttons given a solid `cardBg` surface — both preview body ids hedged (`#page-question-preview` + `#page-question-bank-previewquestion-preview`). All appended after the quiz-edit block inside `if (darkMode)`; NO new tokens. Generator-verified on Dark Lime + Dark Ember (light presets emit nothing). User-verified. Committed on this branch.
- **Quiz view + quiz preview contrast (#122–124, this session, same branch):** Per the user's explicit instruction these use a **dark surface + light/lime text** (NOT dark-text-on-light like the question-preview fix). (#122) `#page-mod-quiz-view .quizreviewsummary td.cell`/`th.cell` (hardcoded `#fafafa`) → `cardBg` bg + `bodyText` text + `cardBorder` border, links `linkColour`; (#123) `[id^="page-mod-quiz-"] .que .info` (covers attempt/preview/review/summary in one prefix-anchored rule; quiz-edit has no `.que .info`) → `cardBg` surface, descendant text `bodyText`, links `linkColour`, pale-blue `.formulation` left untouched; (#124) the Flag-state icon — a raw `<img class="questionflagimage" src=".../i/...">` PIX image that `color` can't touch — lit with TWO `src`-keyed `filter`s: UNFLAGGED → `brightness(0) invert(1)` (white, matches the FontAwesome Edit-question pen); FLAGGED (Moodle's `i/flagged` renders **black** here, not red) → a filter chain tinting it red (≈ CFA Red `#F64747`), via `[src*="flagged"]:not([src*="unflagged"])`. (#125) the multichoice "Clear my choice" link (`.que .qtype_multichoice_clearchoice`) — invisible as the dark lime/orange link colour on Moodle's pale-blue `.formulation` — forced to **fixed CFA Purple `#B500B5`** (AA on light-blue, like the `#FFFFFF`/`#1d2125` fixed values) + bold on hover. #124b/#125 use fixed brand/semantic values (a filter can't follow `error`; the clear-choice must read on the fixed pale-blue box), the same documented exception as the existing `#FFFFFF`/`#dee2e6`/`#1d2125`. All user-verified. NO new tokens. Generator-verified on Dark Lime + Dark Ember; light presets emit none.
- **Gradebook setup contrast (#126–127, this session, branch `worktree-fix+dark-theme-gradebook-setup-contrast`):** Grades → Gradebook setup (`grade/edit/tree/index.php`). Moodle's `grade.scss` unconditionally hardcodes the `setup-grades` table LIGHT (wrapper + header/total cells `$gray-100 #f8f9fa`, category/item rows `$grade-table-td-bg #fff`), so the dark theme's light text washed out. (#126) Per the user's **dark surface + light/lime text** instruction (like quiz-view #122): `.path-grade-edit-tree .gradetree-wrapper` + `#grade_edit_tree_table` cells → `cardBg` + `bodyText` + `cardBorder` (also redefine `--bs-table-bg`/`-color`/`-border-color`); links `linkColour`; Weights `+`/three-dot icons re-lit to `bodyText` (`:not([class*="text-"])`); muted metadata `mutedText`. (#127) the `.badge.bg-light.text-dark` status pills ("Natural", "Exclude empty grades") kept a light bg while their text was forced light → light-on-light; given a dark `cardBorder` chip + `bodyText` (matches the global `.badge.bg-secondary` treatment). **Anchoring gotcha (now documented):** the first attempt anchored on body id `#page-grade-edit-tree` and matched NOTHING — `grade/edit/tree/index.php` is an `/index.php` page whose body id KEEPS the suffix (`page-grade-edit-tree-index`; Moodle does not strip `/index` from the pagetype, verified vs 4.4/4.5/5.0 source). Re-anchored on the table's own stable id `#grade_edit_tree_table` (hardcoded `grade/edit/tree/lib.php`) + the `.path-grade-edit-tree` body class (which IS present — the path loop drops only the last segment). NO new tokens, NO preset/control changes. Generator-verified on Dark Lime + Dark Ember (light presets emit none). User-verified. See memories `project_dark_theme_gradebook_setup.md` + `reference_moodle_index_page_body_id.md`.
- **Quiz timer contrast (#128, this session, same branch):** The "Time left H:MM:SS" countdown during a timed quiz attempt (`mod/quiz`). Boost's `modules.scss` paints `#quiz-timer-wrapper #quiz-timer` a FIXED white box (`#fff` bg + `1px solid #ca3120` red border, no dark variant), so the dark theme kept the white bg but the timer text inherited the light `$body-color` → light-on-white invisible. Per the user's request — **keep the white bg, dark text** — fixed-dark `d.bodyText` (`#1d2125`, ~16:1), colour only (bg/border untouched). Anchored on the timer's own stable ids `#quiz-timer-wrapper #quiz-timer` (hardcoded 4.4–5.x, verified vs source), NOT the body id, so one rule covers attempt + summary + preview. `:not([class*="timeleft"])` preserves Moodle's last-100s low-time warning ramp (JS adds `.timeleft0–16` with their own bg + AA text). NO new tokens, NO preset/control changes. Generator-verified (light presets emit none); user-verified on Moodle Cloud. Memory: `project_dark_theme_quiz_timer.md`.
- **Quiz "Time limit" dialog Cancel button (#129, this session, branch `worktree-fix+quiz-cancel-button-red`):** Clicking *Attempt/Preview quiz* on a TIMED quiz opens a YUI dialogue (`mod_quiz/preflightcheck.js` → `M.core.dialogue`, extraClass `.mod_quiz_preflight_popup`) that JS **portals to `<body>`**. The dialog is white; the standard mform Cancel (`input#id_cancel.btn-secondary[name="cancel"]`, from `lib/form/cancel.php`) was painted light-grey by the global dark `.btn-secondary { color:#F0EEEE }` → invisible on white. The cancel markers (`#id_cancel`/`[data-cancel]`/`.btn-cancel`) are **site-wide on every mform**, so scoped to the dialog's unique `.mod_quiz_preflight_popup` class (stable since 3.1), never global. Per the user's request (red/warning) → **solid `d.error` `#ca3120` bg + white text + border** (white-on-#ca3120 = 5.29:1 WCAG AA; deliberately NOT `tokens.error` #F64747 = 3.55:1, AA-fail). `d.error` because the modal is a fixed-white surface (same fixed-dark logic as the timer/#116). Hover/focus stay solid red (+ `filter:brightness(0.92)`). Green "Start attempt" untouched. NO new tokens, NO preset/control changes. Generator-verified (light presets emit none); user-verified. Memory: `project_dark_theme_quiz_cancel_button.md`.
- **Quiz review summary + nav-button colours (#130–131, this session, same branch):** (#130) the attempt-summary table (`.quizreviewsummary`: Status/Started/Completed/Duration/Grade) was invisible on the **review** page — the #122 fix was anchored `#page-mod-quiz-view` only, so `review.php`/`summary.php` got nothing. Per the user's choice (consistency over the literal "dark text" ask) **re-anchored #122 to the quiz body-id PREFIX `[id^="page-mod-quiz-"] .quizreviewsummary td.cell/th.cell`** → one rule now gives view + review + summary the same dark `cardBg` surface + `bodyText` + `linkColour`. `.quizreviewsummary` is unique to this table. (#131) the "Quiz navigation" question buttons (`#mod_quiz_navblock .qnbutton`): the number is a **bare text node** pushed near-white by our dark rules → unreadable on Moodle's state-coloured trafficlight strip. User asked for a designed combo → **solid per-state fills + fixed-dark number `d.bodyText` #1d2125** (AA on all: lime 12.7, red #F64747 4.56, amber 8.3, grey 6.2): correct→`success`, incorrect→`error`, partiallycorrect→`warning`, notanswered→`mutedText` (grey, distinct from incorrect). Fill button **and** `.trafficlight` (override only `background-color` → the ✓/✗ glyph image survives, WCAG 1.4.1); base/answersaved → white + dark number. Scoped `.path-mod-quiz #mod_quiz_navblock`. NO new tokens, NO preset/control changes. Generator-verified on Dark Lime + Dark Ember (light presets emit none); user-verified. Memory: `project_dark_theme_quiz_review_nav.md`.
- **Quiz question body `.que .formulation` (#132, this session, same branch):** Moodle styles the question body from Bootstrap `$info` via `shift-color()` → a pale-blue box (`bg #ccf2ff`, `text #002633`). On dark themes this pale-blue island clashed with the already-dark `.que .info` sidebar, and the per-option ✓/✗ feedback icons (FontAwesome `.text-success`/`.text-danger` → recoloured to the dark-preset lime/red tokens by the generic `.icon.text-*` rules) were nearly invisible/indistinguishable on it (lime ✓ ≈ 1.1:1 — the user's actual complaint). User first asked for white; I recommended **dark surface** instead (and they agreed) because: it's consistent with the already-dark `.que .info` sidebar (one cohesive dark question card vs a dark sidebar + white body), no white glare, and it gives the green/red **maximum** separation (lime ✓ vs red ✗ differ in hue AND luminance on dark, vs near-identical luminance when both are darkened on white). Fix: `.que .formulation` → `cardBg` + `bodyText` + `cardBorder`; text containers (`.qtext`/`.ablock`/`.answer`/`.specificfeedback`/`.rightanswer`/`legend`) forced `bodyText`; in-question links + the reverted "Clear my choice" control (was fixed Purple #B500B5, now `linkColour`) follow the dark link colour. The ✓/✗ icons are **left untouched** — they keep their lime/red via their own `.text-*` `!important` rules and now read vividly (lime ≈11.7:1, red ≈4.7:1, amber partial ≈8:1, all pass). Global `.que .formulation` (consistent everywhere a question renders). NO icon override needed (unlike the white option, which would've needed darkened icons and still left the amber sub-AA). NO new tokens, NO preset/control changes. Generator-verified; user-verified. Memory: `project_dark_theme_quiz_formulation.md`.

## Code Conventions

- TypeScript strict mode
- Tailwind for tool UI, CSS custom properties for preview
- Component files: PascalCase (`MoodleNavbar.tsx`)
- Lib files: kebab-case (`scss-generator.ts`)
- All preview colours: `var(--cfa-*)` — never hardcoded
- All SCSS generator colours: `${tokens.xxx}` or `${d.xxx}` — never hardcoded hex
- All interactive elements: `aria-label` + keyboard support
- Icons: `lucide-react`
- Colour pickers: `react-colorful`
