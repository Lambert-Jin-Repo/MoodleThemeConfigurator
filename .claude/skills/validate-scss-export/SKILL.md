---
name: Validate SCSS Export
description: Check SCSS output is valid for Moodle Cloud
disable-model-invocation: true
---

# Validate SCSS Export

Verify that the generated SCSS export is correct and will work when pasted into Moodle Cloud.

## Steps

1. Read the SCSS generator: `lib/scss-generator.ts`
2. Read the Moodle constraints: `docs/moodle-cloud-constraints.md`
3. Read the token defaults: `lib/tokens.ts`

## Block 1 Validation (Raw initial SCSS — Variables)

Check that the generated output:
- [ ] Contains only SCSS variable declarations (`$variable: value;`)
- [ ] Uses correct Bootstrap variable names:
  - `$primary` (NOT `$brand-primary`)
  - `$link-color` (NOT `$link-colour`)
  - `$body-bg`, `$body-color`
  - `$font-family-sans-serif`
  - `$font-size-base` (must be in rem: value/16 + "rem")
  - `$line-height-base`
  - `$card-bg`, `$card-border-color`, `$border-color`
  - `$success`, `$warning`, `$danger`, `$info`
  - `$input-focus-border-color`
  - `$breadcrumb-bg: transparent`
- [ ] Only includes variables that DIFFER from Moodle defaults
- [ ] Has a header comment with timestamp and paste instructions
- [ ] Does NOT contain CSS rules, selectors, or nesting (those belong in Block 2)

## Block 2 Validation (Raw SCSS — Rule Overrides)

Check that the generated output:
- [ ] Uses verified selectors from `docs/moodle-cloud-constraints.md`
- [ ] Navbar overrides use `!important` (required due to `.bg-white` class)
- [ ] Login page selectors use `body#page-login-index` prefix
- [ ] Login button targets `#loginbtn`
- [ ] Secondary nav uses `.secondary-navigation .nav-tabs .nav-link.active`
- [ ] Footer uses `#page-footer`
- [ ] Only includes sections where values differ from defaults
- [ ] Omitted sections have explanatory comments (e.g., "/* Navbar omitted — using Moodle default */")
- [ ] Ends with "AFTER PASTING: Purge all caches!" comment
- [ ] Button section is omitted if btnPrimaryBg === brandPrimary (since $primary handles it)

## Smart Export Logic

- [ ] If navbarBg === '#FFFFFF' → navbar section omitted with comment
- [ ] If btnPrimaryBg === brandPrimary → button section omitted with comment
- [ ] If loginBg === '#e8eaed' → login bg override omitted
- [ ] If all footer values are defaults → footer section omitted
- [ ] Font size correctly converted: e.g., 14px → `0.875rem`, 16px → `1rem`

## Integration Check

- [ ] "Copy All" button copies both blocks with clear labels
- [ ] "Copy Block 1" copies only variables
- [ ] "Copy Block 2" copies only overrides
- [ ] "Download .scss" saves a file containing both blocks
- [ ] Toast notification appears on copy

## Common Mistakes to Watch For

- Using `$link-colour` (British spelling) instead of `$link-color` (Bootstrap uses American)
- Using `$brand-primary` instead of `$primary` (Bootstrap 4+ uses `$primary`)
- Forgetting `!important` on navbar background override
- Including font-size in px instead of rem in the SCSS variables
- Including the button section when it's redundant (brandPrimary already handles it)
