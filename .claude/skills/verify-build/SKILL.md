---
name: Verify Build
description: Run npm run build and confirm zero errors
---

# Verify Build

Run a full production build and verify it completes without errors.

## Steps

### 1. Run Build
```bash
npm run build
```

### 2. Check Exit Code
- Exit code 0 = success
- Non-zero = failure — report all errors with file paths and line numbers

### 3. Verify Output Directory
Check that the `out/` directory was created (static export):
```bash
ls out/
```

### 4. Sanity Check Output
Verify key pages exist in the build output:
- `out/index.html` — main app page
- Check for any 404 or missing asset warnings in build output

### 5. Report Results

**On success:**
```
Build passed.
Output: out/ directory created
Pages: [list of output files]
No errors or warnings.
```

**On failure:**
```
Build FAILED.

Errors:
  [file:line] — [error message]
  [file:line] — [error message]

Fix these errors before committing.
```

## Common Build Issues

- **Type errors:** Missing types, incorrect generics — check `lib/tokens.ts` type definitions
- **Import errors:** Wrong paths, missing exports — check barrel files
- **CSS variable typos:** `var(--cfa-navbarBg)` vs `var(--cfa-navbar-bg)` — check `MoodleShell.tsx`
- **Static export issues:** Using server-only features — this must be 100% client-side
- **Next.js config:** Ensure `output: 'export'` is set in `next.config.js`
