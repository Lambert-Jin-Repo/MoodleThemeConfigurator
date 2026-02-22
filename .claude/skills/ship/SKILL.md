---
name: ship
description: Use when feature work is complete and ready to commit and push — runs branch protection, secret scanning, build and lint validation, conventional commit, and push
---

# Ship

Consolidated git workflow. Replaces `/create-branch`, `/safe-commit`, `/safe-push`, `/check-secrets`.

All steps are mandatory. Failure at any step = STOP.

---

## 1. Branch Check

```bash
git branch --show-current
```

- If on `main` or `master` → create feature branch first:
  ```bash
  git checkout main && git pull origin main
  git checkout -b <type>/<description>
  ```
- Branch naming: `<type>/<short-description>` (lowercase kebab-case only)
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`

---

## 2. Build Check

```bash
npm run build
```

If build fails → report errors with file paths and line numbers → **STOP.**

---

## 3. Lint Check

```bash
npm run lint
```

If lint fails → report errors → **STOP.**

---

## 4. Stage Files

Stage changed files (prefer specific files over `git add .`):
```bash
git add <specific-files>
```

If nothing to stage (working tree clean, all changes already committed) → skip to step 6 (Push).

Show what will be committed:
```bash
git diff --cached --stat
```

---

## 5. Secret Scan

Scan **staged files** AND **full commit history** since branching from main:

```bash
git diff --cached
git diff main..HEAD
git log main..HEAD --diff-filter=A --name-only
```

**Why after staging:** Scanning after `git add` ensures unstaged changes (the most common case for standalone `/ship`) are included in the scan.

**Patterns to detect:**
- Keywords: `API_KEY`, `SECRET`, `TOKEN`, `PASSWORD`, `PRIVATE_KEY`, `ACCESS_KEY`
- Files: `.env`, `.env.local`, `credentials.json`, `*.pem`
- URLs with embedded credentials: `://user:pass@`
- Base64 strings 40+ characters, hex strings 64+ characters

If any secrets found → `git reset HEAD <file>` to unstage → report file + line → **STOP. Do not commit.**

This project is client-side only. ZERO secrets should exist.

---

## 6. Commit

Create conventional commit:

**Format:** `<type>(<scope>): <description>`

| Type | When |
|---|---|
| `feat` | New feature or component |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (not CSS) |
| `refactor` | Code restructure, no behaviour change |
| `test` | Adding or updating tests |
| `chore` | Build config, dependencies, tooling |

**Scope:** area of codebase (e.g. `preview`, `controls`, `audit`, `export`, `store`, `tokens`, `scss`)

Rules:
- Imperative mood: "add" not "added"
- Under 72 characters
- NEVER commit `.env`, API keys, tokens, passwords

---

## 7. Push

```bash
git fetch origin
git status
```

- If behind remote → warn and suggest pulling first
- If up to date:
  ```bash
  git push -u origin <current-branch>
  ```

---

## 8. After Push

- Suggest creating a PR: "Use `/review-pr` to review before merging"
- Report the branch name and remote URL

---

## Rules

- NEVER push to `main` or `master`
- NEVER use `--force` unless user explicitly requests it
- NEVER skip any step
- NEVER commit secrets — this is a client-side project with zero backend
- Always push with `-u` to set upstream tracking
