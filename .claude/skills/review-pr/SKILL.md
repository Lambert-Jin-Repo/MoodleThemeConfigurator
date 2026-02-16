---
name: Review PR
description: Review a pull request with project-specific checks
argument-hint: "[pr-number]"
disable-model-invocation: true
---

# Review PR

Review a pull request against project standards and produce a structured summary.

## Steps

### 1. Fetch PR Information
```bash
gh pr view <number>
gh pr diff <number>
```

### 2. Understand the Changes
- List all files changed
- Summarise the purpose of the PR in 1-2 sentences
- Identify which implementation step(s) from `docs/implementation-plan.md` this relates to

### 3. Run Automated Checks
```bash
gh pr checkout <number>
npm run build
npm run lint
```
Report pass/fail for each.

### 4. Project-Specific Checks

#### Preview Components (components/preview/*)
- [ ] All colours use `var(--cfa-*)` CSS custom properties
- [ ] No hardcoded colour values (hex, rgb, hsl)
- [ ] No direct Zustand store imports (styling via CSS variables only)
- [ ] Visual accuracy matches Moodle screenshots

#### Control Components (components/controls/*)
- [ ] All interactive elements have `aria-label`
- [ ] Keyboard accessibility (Tab, Enter, arrow keys where relevant)
- [ ] Moodle admin path tooltip present

#### SCSS Export (lib/scss-generator.ts)
- [ ] Uses correct Bootstrap variable names (American spelling)
- [ ] Two-block output (variables + overrides)
- [ ] Smart export logic (omits defaults)
- [ ] Verified Moodle selectors used

#### General
- [ ] No `.env` files or secrets in the diff
- [ ] TypeScript strict mode respected (no `any` types, no `@ts-ignore`)
- [ ] No `console.log` left in production code
- [ ] Component files use PascalCase, lib files use kebab-case

### 5. Produce Review Summary

```markdown
## PR Review: #<number> — <title>

### Summary
<1-2 sentence description of what this PR does>

### Automated Checks
- Build: PASS/FAIL
- Lint: PASS/FAIL

### Code Review
- [ ] No hardcoded colours in preview components
- [ ] Accessibility: aria-labels present
- [ ] No secrets or .env files
- [ ] Naming conventions followed
- [ ] TypeScript strict compliance

### Issues Found
<list any problems, or "None">

### Recommendation
APPROVE / REQUEST CHANGES / <reason>
```

## Rules

- Always run build and lint — do not skip
- Check EVERY changed file, not just a sample
- Be specific about issues: include file paths and line numbers
- Do not approve PRs with build or lint failures
