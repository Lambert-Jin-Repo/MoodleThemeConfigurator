---
name: Create Branch
description: Create feature branch with naming convention
argument-hint: "[type/description]"
disable-model-invocation: true
---

# Create Branch

Create a new feature branch following the project's naming convention.

## Branch Naming Format

`<type>/<short-description>`

**Types:**
| Type | When |
|---|---|
| `feat` | New feature or component |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `refactor` | Code restructure |
| `test` | Test additions |
| `chore` | Tooling, config, dependencies |

**Rules for description:**
- Use lowercase kebab-case
- Keep it short (2-4 words max)
- Be descriptive: `feat/dashboard-page` not `feat/new-stuff`

**Examples:**
- `feat/dashboard-page`
- `feat/scss-export`
- `fix/contrast-ratio`
- `fix/navbar-colour`
- `docs/readme-update`
- `refactor/token-types`
- `chore/update-deps`

## Steps

1. Ensure working directory is clean:
```bash
git status
```
- If there are uncommitted changes, warn the user and suggest committing or stashing first.

2. Switch to main and pull latest:
```bash
git checkout main
git pull origin main
```

3. Create and switch to new branch:
```bash
git checkout -b <type>/<description>
```

4. Confirm:
- Report the new branch name
- Remind: "When done, use `/safe-commit` to commit and `/safe-push` to push"

## Rules

- NEVER create branches from a dirty working directory without warning
- ALWAYS branch from latest `main`
- ALWAYS use the `type/description` naming convention
- Branch names must be lowercase with hyphens only (no spaces, underscores, or uppercase)
