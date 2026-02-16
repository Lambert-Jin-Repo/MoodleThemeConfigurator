---
name: Safe Push
description: Pre-push validation — full checks before pushing to remote
disable-model-invocation: true
---

# Safe Push

Run full validation before pushing to the remote repository. This skill MUST be used before every push.

## Pre-Push Checks (all must pass)

### 1. Branch Protection Check
```bash
git branch --show-current
```
- If current branch is `main` or `master`, STOP immediately.
- Tell the user: "You are on a protected branch. Create a feature branch first with `/create-branch`."

### 2. Build Check
```bash
npm run build
```
- If build fails, report errors with file/line and STOP.

### 3. Lint Check
```bash
npm run lint
```
- If lint fails, report errors and STOP.

### 4. Secret Scan (Full History)
Scan all commits since branching from main:
```bash
git log main..HEAD --diff-filter=A --name-only
git diff main..HEAD
```
Check for:
- Patterns: `API_KEY`, `SECRET`, `TOKEN`, `PASSWORD`, `PRIVATE_KEY`, `ACCESS_KEY`
- File types: `.env`, `.env.local`, `credentials.json`, `*.pem`
- URLs with embedded credentials
- Long base64-encoded strings

If any secrets found, report commit + file + line and STOP.

### 5. Remote Sync Check
```bash
git fetch origin
git status
```
- If the branch is behind the remote, warn the user and suggest pulling first.

## Push

If all checks pass:
```bash
git push -u origin <current-branch>
```

## After Pushing

- Suggest creating a PR if one doesn't exist
- Remind: "Use `/review-pr` to review before merging"

## Rules

- NEVER push directly to `main` or `master`
- NEVER use `--force` or `--force-with-lease` unless the user explicitly requests it
- NEVER skip any of the validation steps
- Always push with `-u` to set upstream tracking
