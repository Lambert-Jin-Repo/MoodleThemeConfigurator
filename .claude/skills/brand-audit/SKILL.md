---
name: Brand Audit
description: WCAG contrast and CFA brand compliance checks
disable-model-invocation: true
---

# Brand Audit

Run accessibility and brand compliance checks against the current theme configuration.

## Steps

1. Read `lib/accessibility.ts` for the contrast calculation functions
2. Read `lib/tokens.ts` for current defaults and CFA palette
3. Read `docs/cfa-brand-reference.md` for brand rules

## WCAG Contrast Checks

Verify that these 10 colour pairs meet WCAG 2.2 AA (4.5:1 for normal text, 3:1 for large text):

| # | Pair Name | Foreground Token | Background Token | Min Ratio |
|---|---|---|---|---|
| 1 | Navbar Text | navbarText | navbarBg | 4.5:1 |
| 2 | Button Text | btnPrimaryText | btnPrimaryBg | 4.5:1 |
| 3 | Body Text | bodyText | pageBg | 4.5:1 |
| 4 | Link on Page | linkColour | pageBg | 4.5:1 |
| 5 | Link on Card | linkColour | cardBg | 4.5:1 |
| 6 | Login Heading | loginHeading | loginCardBg | 4.5:1 |
| 7 | Login Button | loginBtnText | loginBtnBg | 4.5:1 |
| 8 | Muted on Page | mutedText | pageBg | 4.5:1 |
| 9 | Muted on Card | mutedText | cardBg | 4.5:1 |
| 10 | Heading on Page | headingText | pageBg | 3:1 (large) |

For each pair, calculate the contrast ratio and report PASS or FAIL.

## CFA Brand Compliance

Check if current token values use CFA brand colours:

**CFA Palette:** #404041, #F0EEEE, #F27927, #B500B5, #00BFFF, #336E7B, #BAF73C, #F64747

- [ ] brandPrimary is a CFA colour (expected: #336E7B Teal)
- [ ] bodyText uses Charcoal #404041
- [ ] headingText uses Charcoal #404041 or near-black
- [ ] fontFamily includes "Source Sans Pro"

Flag any tokens using off-brand colours.

## Known CFA Palette Accessibility Issues

These CFA colours FAIL contrast on white backgrounds:
- Orange #F27927 (2.86:1) — use only on dark bg or as decoration
- Sky Blue #00BFFF (2.35:1) — use only on dark bg or as decoration
- Lime Green #BAF73C (1.42:1) — use only on dark bg or as decoration
- Red #F64747 (3.58:1) — fails AA normal, passes AA large only

Safe CFA colours for text on white:
- Charcoal #404041 (9.68:1) — excellent
- Purple #B500B5 (4.56:1) — passes AA
- Teal #336E7B (5.35:1) — passes AA

## Suggestion Algorithm Check

If the suggestion algorithm is implemented in `lib/accessibility.ts`, verify:
- [ ] It checks CFA palette colours first (brand-compliant suggestions preferred)
- [ ] If no CFA colour passes, it darkens/lightens the original until 4.5:1 reached
- [ ] Suggested colours are visually close to the original (not arbitrary)
- [ ] "Apply" action correctly updates the store token
