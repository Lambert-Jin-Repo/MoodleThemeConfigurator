# CFA Brand Reference

> Extracted from `CFA Brand Style Guide.pdf`. This file is the machine-readable brand reference for building the sandbox.

## Colour Palette

```
┌─────────────┬───────────┬─────────────────┬────────────────────────────────────┐
│ Name        │ Hex       │ PMS             │ Usage                              │
├─────────────┼───────────┼─────────────────┼────────────────────────────────────┤
│ Charcoal    │ #404041   │ Cool Gray 11 C  │ Primary text, dark backgrounds     │
│ Light Grey  │ #F0EEEE   │ Cool Gray 1 C   │ Subtle backgrounds, light banners  │
│ Orange      │ #F27927   │ 151 C           │ Primary accent, CTAs               │
│ Purple      │ #B500B5   │ 253 C           │ Secondary accent                   │
│ Sky Blue    │ #00BFFF   │ 306 C           │ Links, interactive elements        │
│ Teal        │ #336E7B   │ 5473 C          │ Brand primary for Moodle           │
│ Lime Green  │ #BAF73C   │ 389 C           │ Highlights, success                │
│ Red         │ #F64747   │ 1787 C          │ Alerts, errors, logo accent        │
└─────────────┴───────────┴─────────────────┴────────────────────────────────────┘
```

### Additional Utility Colours (for the sandbox tool UI and swatches)
- White: `#FFFFFF`
- Near Black: `#1d2125`
- Moodle Default Blue: `#0f6cbf`

### WCAG Contrast on White (#FFFFFF)

| Colour | Ratio vs White | AA Normal (4.5:1) | AA Large (3:1) |
|---|---|---|---|
| Charcoal #404041 | 9.68:1 | PASS | PASS |
| Orange #F27927 | 2.86:1 | FAIL | FAIL |
| Purple #B500B5 | 4.56:1 | PASS | PASS |
| Sky Blue #00BFFF | 2.35:1 | FAIL | FAIL |
| Teal #336E7B | 5.35:1 | PASS | PASS |
| Lime Green #BAF73C | 1.42:1 | FAIL | FAIL |
| Red #F64747 | 3.58:1 | FAIL | PASS |

**Important:** Orange, Sky Blue, and Lime Green FAIL contrast on white. Use them only for decorative elements, icons, or text on dark backgrounds — never as small body text on white.

### WCAG Contrast on Charcoal (#404041)

| Colour | Ratio vs Charcoal | AA Normal | AA Large |
|---|---|---|---|
| White #FFFFFF | 9.68:1 | PASS | PASS |
| Light Grey #F0EEEE | 8.03:1 | PASS | PASS |
| Orange #F27927 | 3.38:1 | FAIL | PASS |
| Sky Blue #00BFFF | 4.12:1 | FAIL | PASS |
| Lime Green #BAF73C | 6.83:1 | PASS | PASS |

## Typography

- **Brand font:** Source Sans Pro
  - Bold: headings, emphasis
  - Regular: body text
- **Google Fonts import:** `Source+Sans+Pro:wght@400;600;700`
- **Moodle Boost default stack:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- **In the sandbox:** "Source Sans Pro" should be offered as a font option. When applied via the "Apply CFA Brand" preset, set `$font-family-sans-serif: "Source Sans Pro", sans-serif;`

## Logo System

### Standard Logo (light background)
- "CENTRE FOR" in Charcoal `#404041` (uppercase, bold)
- "ACCESSIBILITY" in Red `#F64747` (uppercase, bold)
- Stacked vertically, no icon

### Logo on Dark Background
Multiple colour variations exist:
- "CENTRE FOR" in White, "ACCESSIBILITY" in Red `#F64747`
- "CENTRE FOR" in White, "ACCESSIBILITY" in Orange `#F27927`
- "CENTRE FOR" in White, "ACCESSIBILITY" in Sky Blue `#00BFFF`
- "CENTRE FOR" in White, "ACCESSIBILITY" in Lime Green `#BAF73C`
- "CENTRE FOR" in White, "ACCESSIBILITY" in Teal `#336E7B`
- "CENTRE FOR" in White, "ACCESSIBILITY" in Purple `#B500B5`

### Logo + Byeline
- Logo as above + vertical divider + "Celebrating an inclusive world" in regular weight

### Moodle Navbar Logo (from screenshot)
- Small red square icon (~16x16px)
- "Centre for" (line 1, regular weight)
- "Accessibility" (line 2, bold)
- "AUSTRALIA" (line 3, small, red `#F64747`)
- All text in `var(--cfa-navbar-text)` except "AUSTRALIA" which stays red

## Layout Elements

### Decorative Motif
A multi-colour square mosaic/pixel pattern using the full brand palette. Used as:
- Corner decoration on banners
- Edge decoration on business cards and event materials
- Each square is a solid brand colour, arranged in a scattered grid pattern

### Banner Patterns
**Light banner:**
- Background: Light Grey `#F0EEEE`
- Text: Charcoal `#404041`
- Accent keywords: in a brand colour (e.g., Purple, Teal, Orange)
- Mosaic decoration on right edge

**Dark banner:**
- Background: Charcoal `#404041`
- Text: White `#FFFFFF`
- Accent keywords: in a bright brand colour (Lime Green, Sky Blue, Orange)
- Mosaic decoration on right edge

### Content Hierarchy (from Layout Element Hierarchy page)
- Large bold heading with accent-coloured keyword
- Three-column body text layout below
- Section subheadings in a brand colour (bold)
- Body text in Charcoal on light background

## CFA Brand Preset Values (for "Apply CFA Brand" button)

When the user clicks "Apply CFA Brand", set these tokens:
```typescript
const CFA_BRAND_PRESET: Partial<ThemeTokens> = {
  brandPrimary: '#336E7B',     // Teal
  bodyText: '#404041',          // Charcoal
  headingText: '#404041',       // Charcoal
  navbarBg: '#FFFFFF',          // White navbar (matches current CFA site)
  navbarText: '#404041',        // Charcoal nav text
  fontFamily: '"Source Sans Pro", sans-serif',
  signupBtnBg: '#404041',      // Charcoal signup button
  // All brandPrimary-linked tokens cascade automatically:
  // btnPrimaryBg, linkColour, navActiveUnderline, secondaryNavActive,
  // progressFill, focusRing, loginBtnBg, info, footerLink
};
```
