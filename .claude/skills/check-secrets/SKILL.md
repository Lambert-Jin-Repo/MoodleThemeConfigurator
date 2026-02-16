---
name: Check Secrets
description: Scan for leaked credentials in staged changes
---

# Check Secrets

Scan staged changes and the repository for accidentally committed secrets.

## What to Scan

### Staged Changes
```bash
git diff --cached
```

### Tracked Files (optional deep scan)
```bash
git ls-files
```

## Patterns to Detect

### Environment Variables & Keys
- `API_KEY`, `APIKEY`, `api_key`
- `SECRET`, `SECRET_KEY`, `secret_key`
- `TOKEN`, `ACCESS_TOKEN`, `auth_token`
- `PASSWORD`, `PASSWD`, `passwd`
- `PRIVATE_KEY`, `private_key`
- `ACCESS_KEY`, `access_key`
- `AWS_`, `AZURE_`, `GCP_`, `GOOGLE_`

### Sensitive File Types
- `.env`, `.env.local`, `.env.production`, `.env.*.local`
- `credentials.json`, `service-account.json`
- `*.pem`, `*.key`, `*.p12`, `*.pfx`
- `id_rsa`, `id_ed25519`

### Embedded Credentials
- URLs with credentials: `://username:password@host`
- Connection strings: `mongodb://`, `postgres://`, `mysql://` with embedded passwords

### Encoded Secrets
- Long base64-encoded strings (40+ characters, pattern: `[A-Za-z0-9+/=]{40,}`)
- Hex-encoded strings that look like keys (64+ hex chars)

## .gitignore Verification

Check that `.gitignore` includes these entries:
- `.env`
- `.env.local`
- `.env.*.local`
- `*.pem`
- `credentials.json`

If any are missing, report and suggest adding them.

## Output Format

### If secrets found:
```
SECRET DETECTED:
  File: path/to/file.ts
  Line: 42
  Pattern: API_KEY
  Content: const API_KEY = "sk-..."  (truncated)

ACTION REQUIRED: Unstage the file with `git reset HEAD <file>` and remove the secret.
```

### If no secrets found:
```
No secrets detected in staged changes.
.gitignore includes all required entries.
```

## Notes

- This project is client-side only with NO backend, so there should be ZERO secrets in the codebase
- If secrets are found, it's always an error — there is no legitimate reason for secrets in this project
- False positives may occur with CSS colour hex values or test fixtures — use judgement
