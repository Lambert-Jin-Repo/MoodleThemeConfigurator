---
name: Safe Commit
description: Pre-commit validation — build, lint, secret scan, then conventional commit
disable-model-invocation: true
---

# Safe Commit

Run pre-commit checks and create a conventional commit. This skill MUST be used before every commit.

## Pre-Commit Checks (all must pass)

### 1. Build Check
```bash
npm run build
```
- If build fails, report errors with file/line and STOP. Do not commit.

### 2. Lint Check
```bash
npm run lint
```
- If lint fails, report errors and STOP. Do not commit.

### 3. Secret Scan
Scan all staged files (`git diff --cached`) for:
- Patterns: `API_KEY`, `SECRET`, `TOKEN`, `PASSWORD`, `PRIVATE_KEY`, `ACCESS_KEY`
- File types: `.env`, `.env.local`, `credentials.json`, `*.pem`
- URLs with embedded credentials: `://user:pass@`
- Long base64-encoded strings (40+ chars, potential encoded secrets)

If any secrets found, report file + line number and STOP. Do not commit.

### 4. Show Staged Changes Summary
```bash
git diff --cached --stat
```
Show the user what will be committed.

## Create Commit

If all checks pass, create a conventional commit:

**Format:** `<type>(<scope>): <description>`

**Types:**
| Type | When |
|---|---|
| `feat` | New feature or component |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, whitespace (not CSS changes) |
| `refactor` | Code restructure, no behaviour change |
| `test` | Adding or updating tests |
| `chore` | Build config, dependencies, tooling |

**Scope:** The area of the codebase (e.g., `preview`, `controls`, `audit`, `export`, `store`, `tokens`, `scss`)

**Examples:**
- `feat(preview): add dashboard page replica`
- `fix(audit): correct contrast ratio calculation`
- `chore(deps): update react-colorful to v5.7`
- `refactor(store): simplify brand propagation logic`

## Rules

- NEVER commit `.env` files, API keys, tokens, passwords, or credentials
- NEVER skip the build or lint check
- Always use conventional commit format
- Keep the description concise (under 72 characters)
- Use imperative mood: "add" not "added", "fix" not "fixed"
