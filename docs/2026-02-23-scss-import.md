# Feature: SCSS Import / Restore

Date: 2026-02-23
Status: shipped
Branch: feat/scss-import

## Problem

Users who previously exported SCSS from this tool have no way to re-import it. If they want to restore a theme from exported SCSS (e.g., shared by a colleague or saved from a previous session), they must manually re-create every setting. This feature adds the reverse path: SCSS text → parsed ThemeTokens → live preview.

## Design

### Parser (`lib/scss-parser.ts`)

A regex-based parser that extracts ThemeTokens from SCSS text. Handles both blocks in a single input string.

**Block 1 — SCSS variables:** Match `$variable-name: value;` patterns. Mapping table (exact reverse of `scss-generator.ts`):

| SCSS Variable | Token Key | Value Type |
|---|---|---|
| `$primary` | `brandPrimary` | hex colour |
| `$link-color` | `linkColour` | hex colour |
| `$body-bg` | `pageBg` | hex colour |
| `$card-bg` | `cardBg` | hex colour |
| `$font-size-base` | `bodyFontSize` | number (rem) |
| `$line-height-base` | `lineHeight` | number |
| `$success` | `success` | hex colour |
| `$warning` | `warning` | hex colour |
| `$danger` | `error` | hex colour |
| `$info` | `info` | hex colour |
| `$btn-border-radius` | `btnRadius` | number (px) |
| `$input-border-radius` | `loginInputRadius` | number (px) |
| `$font-family-sans-serif` | `fontFamily` | string |

**Block 2 — CSS rule selectors:** Match known selectors and extract property values:

| Selector | Property | Token Key |
|---|---|---|
| `.navbar.fixed-top` | `background-color` | `navbarBg` |
| `.navbar .primary-navigation .nav-link` | `color` | `navbarText` |
| `.navbar .primary-navigation .nav-link.active` | `border-bottom` (colour) | `navActiveUnderline` |
| `.btn-primary` | `background-color` | `btnPrimaryBg` |
| `.btn-primary` | `color` | `btnPrimaryText` |
| `.btn-primary:hover` | `background-color` | `btnPrimaryHover` |
| `body#page-login-index` | `background-color` or `background` (gradient) | `loginBg` + `loginGradientEnabled` + `loginGradientEnd` |
| `body#page-login-index .card` / `.login-container` | `background-color` | `loginCardBg` |
| `#loginbtn` | `background-color` | `loginBtnBg` |
| `#loginbtn` | `color` | `loginBtnText` |
| `#page-footer` | `background-color` | `footerBg` |
| `#page-footer` | `color` | `footerText` |
| `#page-footer a` | `color` | `footerLink` |
| `.secondary-navigation .nav-tabs .nav-link.active` | `border-bottom-color` | `secondaryNavActive` |
| `h1, h2, h3` | `color` | `headingText` |
| `body` | `color` | `bodyText` |
| `*:focus` | `outline` (colour) | `focusRing` |
| `.progress-bar` | `background-color` | `progressFill` |
| `.drawer` | `background-color` | `drawerBg` |
| `.drawer` | `color` | `drawerText` |

**Return type:** `Partial<ThemeTokens>` — only includes tokens that were actually found in the input.

### UI (`components/export/ImportTab.tsx`)

Inside the existing ExportModal, add a tab-based layout:
- **Tab: "Export"** — current export content (steps 1-5, download)
- **Tab: "Import"** — new import interface

Import tab contents:
1. **Text area** (12 rows, monospace) — placeholder: "Paste your SCSS code here (both blocks accepted)..."
2. **File upload** — drag-and-drop zone or button, accepts `.scss`, `.txt`, `.css`
3. **Parse button** — parses input, shows results
4. **Results preview** — card listing detected tokens grouped by category (Brand, Navbar, Buttons, etc.) with colour swatches for hex values, showing count "N tokens detected"
5. **Apply button** — applies tokens via `setBrandPrimary()` (if brand found) + `batchSetTokens()`, closes modal, shows toast

### Integration

- `ExportModal.tsx` gains a tab bar ("Export" | "Import") at the top
- Import state is local to ImportTab (no store changes needed)
- Brand primary is applied via `setBrandPrimary()` to trigger propagation, then remaining tokens via `batchSetTokens()`
- Toast message: "Theme restored — N settings applied"

## Tasks

### Task 1: SCSS Parser

- **Files:** `lib/scss-parser.ts` (create)
- **Depends on:** none
- **Acceptance:** Calling `parseScssToTokens(generateScss(tokens).block1 + '\n' + generateScss(tokens).block2)` with any ThemeTokens returns a `Partial<ThemeTokens>` containing all exported token values that differ from defaults. Round-trip fidelity for all variable types (hex, rem, px, font-family string).

### Task 2: Import Tab UI + ExportModal Integration

- **Files:** `components/export/ImportTab.tsx` (create), `components/export/ExportModal.tsx` (modify)
- **Depends on:** Task 1
- **Acceptance:** ExportModal shows "Export" and "Import" tabs. Import tab allows pasting SCSS or uploading a file. Clicking "Apply" applies parsed tokens to the store and the preview updates. All interactive elements have `aria-label`. Focus trap works across both tabs.

## Verification

1. Export SCSS from a non-default theme → import it back → all changed tokens restored correctly
2. Upload a `.txt` file exported via the Download button → tokens restored
3. Partial SCSS (only block 1 or only block 2) → only those tokens applied, others unchanged
4. Empty/invalid input → graceful error message, no crash
5. Build passes (`npm run build`)
6. Lint passes (`npm run lint`)
