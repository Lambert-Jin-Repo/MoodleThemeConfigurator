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
| `docs/moodle-cloud-constraints.md` | What Moodle Cloud allows/restricts, verified selectors, SCSS field details |
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

## Code Conventions

- TypeScript strict mode
- Tailwind for tool UI, CSS custom properties for preview
- Component files: PascalCase (`MoodleNavbar.tsx`)
- Lib files: kebab-case (`scss-generator.ts`)
- All preview colours: `var(--cfa-*)` — never hardcoded
- All interactive elements: `aria-label` + keyboard support
- Icons: `lucide-react`
- Colour pickers: `react-colorful`
