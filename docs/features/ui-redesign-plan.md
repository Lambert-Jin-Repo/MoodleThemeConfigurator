# UI Redesign Plan: Moodle Theme Configurator

## Context

Users report two critical usability problems:

1. **Preset Lock Trap:** Selecting a preset locks all controls (`opacity-50`, `pointer-events-none`). The only escape is a tiny `text-xs` "Customise current preset" link or scrolling to a dashed "Custom" tile buried at the bottom of 8 preset cards. Users think the app is broken.

2. **Tedious Color Editing:** 30+ tokens spread across 12 accordion sections. Each color requires: scroll to accordion > expand > find picker > click swatch > use native browser picker. No overview, no batch editing, no way to see all theme colors at a glance.

**Goal:** Make the preset-to-custom workflow seamless, make color editing fast and interactive, and bring the tool to industry standard (Shopify Theme Editor, Squarespace, Realtime Colors patterns).

---

## Implementation Order

```
Step 1: Store Changes (foundation for everything)
Step 2: Remove Lock Mechanism + Preset Dropdown (P0 — fixes core confusion)
Step 3: Linked Token Indicators (P1 — small, enables visibility)
Step 4: Quick Palette Overview Strip (P1 — biggest efficiency gain)
Step 5: Click-to-Edit in Preview (P1 — highest delight factor)
Step 6: Visual Preset Mini-Previews (P2 — polish)
Step 7: Batch Color Import (P3 — power user feature)
```

### Dependency Graph

```
Step 1 (Store Changes) ──[MUST BE FIRST]
    |
    ├── Step 2 (Remove Lock + Preset Dropdown)
    |       |
    |       └── Step 6 (Visual Preset Cards) ──[enhances Step 2's dropdown]
    |
    ├── Step 3 (Linked Token Indicators) ──[independent]
    |
    ├── Step 4 (Quick Palette Strip) ──[depends on Step 2 for layout; builds scroll infrastructure]
    |       |
    |       └── Step 5 (Click-to-Edit) ──[depends on Step 4's scroll infrastructure]
    |
    └── Step 7 (Batch Import) ──[fully independent, can be last]
```

---

## Step 1: Store Changes

**File:** `store/theme-store.ts`

### New State Fields

```typescript
presetBaseline: ThemeTokens | null;     // Snapshot when preset applied — for "(Modified)" detection
scrollToSectionRequest: string | null;  // Command bus for click-to-edit → accordion scroll
```

### New Actions

```typescript
requestScrollToSection: (id: string) => void;   // Sets scrollToSectionRequest
clearScrollRequest: () => void;                   // Clears after consumption
batchSetTokens: (updates: Partial<ThemeTokens>) => void;  // Single undo point for batch import
```

### Modified Actions

**`applyPreset(presetId)`** — Change to always keep controls editable:
- Set `isCustomMode: true` (always editable now)
- Set `presetBaseline: { ...mergedTokens }` (snapshot for modified detection)
- Keep existing token merge logic unchanged

**`setToken(key, value)`** — Remove these lines from the return:
- ~~`isCustomMode: true`~~
- ~~`activePresetId: null`~~
- Keep `activePresetId` so dropdown shows which preset was the starting point
- Keep all auto-compute logic (navbarText, footerText, drawerText)

**`setBrandPrimary(value)`** — Same: remove `isCustomMode: true, activePresetId: null` from return. Keep all propagation logic.

**`reset()`** — Add `presetBaseline: null` to the reset.

### Persistence

- Add `presetBaseline` to `partialize` (persisted)
- Do NOT persist `scrollToSectionRequest` (transient command)
- Do NOT add new fields to temporal `partialize` (avoid polluting undo history)

### Helper Function (pure, used by components)

```typescript
// In lib/tokens.ts or inline in components
function isModifiedFromPreset(tokens: ThemeTokens, baseline: ThemeTokens | null): boolean {
  if (!baseline) return false;
  return Object.keys(baseline).some(
    (k) => tokens[k as keyof ThemeTokens] !== baseline[k as keyof ThemeTokens]
  );
}
```

### What Does NOT Change
- `lib/scss-generator.ts` — operates on `tokens` only
- `components/export/ExportModal.tsx` — operates on `tokens` only
- `components/audit/AuditPanel.tsx` — reads `tokens` only
- Undo/redo (zundo) — partializes on `tokens`, unaffected

---

## Step 2: Remove Lock Mechanism + Preset Dropdown (P0)

### Problem Solved
Users can't find how to unlock controls after selecting a preset.

### Solution
Replace the radio-group preset list with a compact dropdown. Controls are always editable — no lock mechanism in the UI.

### Files Modified

**`components/controls/ControlsPanel.tsx`** (largest change):
1. Delete: `const locked = !isCustomMode`, `const switchToCustom = ...`
2. Delete: "Customise current preset" link (lines 32-39)
3. Delete: All ~40 occurrences of `disabled={locked}` on ColourPicker, SliderControl, SelectControl, GradientToggle, ImageUploadControl
4. Replace `<AccordionSection title="Presets">` block with `<PresetDropdown />`
5. Move Brand Colour to be `defaultOpen` (first accordion after dropdown)

New layout structure:
```
┌─────────────────────────────┐
│ Theme Controls              │
├─────────────────────────────┤
│ Start From: [Dropdown ▼]    │  ← PresetDropdown
│ (Modified) indicator        │
├─────────────────────────────┤
│ [Quick Palette strip]       │  ← Step 4
├─────────────────────────────┤
│ ▶ Brand Colour (open)       │
│ ▶ Logo                      │
│ ▶ Navbar                    │
│ ▶ ... (all always editable) │
└─────────────────────────────┘
```

**New file: `components/controls/PresetDropdown.tsx`**:
- Compact button showing: current preset name + 3-color mini swatch (navbar/button/footer) + chevron
- If no preset active: shows "Select a preset..."
- "(Modified)" badge appears when `isModifiedFromPreset()` returns true
- Click opens a positioned dropdown panel with all 8 presets
- Each preset item: name + description + 3-color swatch + recommended badge
- Selecting a preset calls `applyPreset(id)` and closes dropdown
- Click-outside closes dropdown (reuse pattern from ColourPicker popover)
- Uses lucide-react `ChevronDown`, `Star` icons

**`components/controls/ColourPicker.tsx`**:
- Keep `disabled` prop in interface (default `false`), but no longer passed as `locked`
- The `opacity-50 pointer-events-none` class still works if `disabled` is explicitly `true` for edge cases

**`components/controls/GradientToggle.tsx`**:
- Same: `disabled` prop kept but no longer passed from ControlsPanel

**Delete: `components/controls/PresetSelector.tsx`** — fully replaced by PresetDropdown

### Why Not Tabs? (Gemini's Approach Rejected)

Gemini 3.1 Pro proposed a "Presets | Customise" tab architecture. Problems:
- Creates tabs-within-tabs on mobile (bottom tab bar already has Controls/Preview/Audit)
- Still requires a mode switch — just replaces "click tiny link" with "click different tab"
- Breaks the auto-switch-to-custom behavior that's currently smart
- The dropdown approach has zero layout impact on any breakpoint

### Verification
- [ ] Select any preset — all pickers/sliders remain interactive
- [ ] Change a color after selecting preset — "(Modified)" badge appears
- [ ] Select different preset — tokens update, "(Modified)" disappears
- [ ] Export still produces correct SCSS
- [ ] Undo/redo works across preset switches
- [ ] localStorage persistence: reload preserves preset + modifications

---

## Step 3: Linked Token Indicators (P1)

### Problem Solved
Users don't understand that changing Brand Primary propagates to 9+ other tokens. They edit buttons/links separately without realizing the link exists.

### Solution
Show chain-link / broken-link icons on brand-linked tokens.

### New File: `components/controls/LinkedIndicator.tsx`

```typescript
interface LinkedIndicatorProps {
  tokenKey: keyof ThemeTokens;
  currentValue: string;
  brandPrimary: string;
  onResetToBrand: () => void;
}
```

Logic:
- Check if `tokenKey` is in `BRAND_LINKED_KEYS` (from `lib/tokens.ts`)
- If linked AND value matches brandPrimary: show `Link2` icon (lucide) in gray + "Linked to Brand" tooltip
- If linked AND value differs: show `Unlink` icon in amber + "Reset to brand" button
- If not linked: render nothing

### Files Modified

**`components/controls/ColourPicker.tsx`**:
- Add `linkedToBrand?: boolean` prop
- When `linkedToBrand` is true and `tokenKey` is provided, render `<LinkedIndicator>` next to the label
- LinkedIndicator reads `brandPrimary` from store via `useThemeStore`

**`components/controls/ControlsPanel.tsx`**:
- Add `linkedToBrand` prop to these 9 ColourPickers (matching `BRAND_LINKED_KEYS`):
  - `btnPrimaryBg`, `linkColour`, `navActiveUnderline`, `secondaryNavActive`, `progressFill`, `focusRing`, `loginBtnBg`, `info`, `footerLink`
- Also add to `navbarBg` and `editModeOnColour` (linked via `setBrandPrimary` special logic, not in BRAND_LINKED_KEYS array)
- Ensure `tokenKey` prop is set on all of these

### Existing Utilities Reused
- `BRAND_LINKED_KEYS` from `lib/tokens.ts`
- `Link2`, `Unlink` from `lucide-react`

### Verification
- [ ] Select "CFA Teal Professional" — linked tokens show chain-link icon
- [ ] Change `btnPrimaryBg` to a different color — icon becomes broken-link + "Reset" button
- [ ] Click "Reset to brand" — token reverts, chain-link restores
- [ ] Change Brand Primary — all linked (non-overridden) tokens update, overridden ones stay

---

## Step 4: Quick Palette Overview Strip (P1)

### Problem Solved
Users must dig through 12 accordion sections to find the right color picker. No way to see all theme colors at a glance.

### Solution
A visual 4x2 grid of the 8 most important color swatches at the top of the controls panel, each clickable to expand an inline picker.

### New File: `components/controls/QuickPalette.tsx`

8 key swatches:

| Swatch | Token Key | Store Action | Section ID |
|--------|-----------|-------------|------------|
| Brand | `brandPrimary` | `setBrandPrimary` | `brand-colour` |
| Navbar | `navbarBg` | `setToken` | `navbar` |
| Buttons | `btnPrimaryBg` | `setToken` | `buttons` |
| Footer | `footerBg` | `setToken` | `footer` |
| Links | `linkColour` | `setToken` | `links-&-focus` |
| Login BG | `loginBg` | `setToken` | `login-page` |
| Text | `bodyText` | `setToken` | `typography` |
| Accent | `sectionAccent` | `setToken` | `content-area` |

Behavior:
- Grid of 8 circular swatches (28x28) with label text below each
- Clicking a swatch: (1) expands inline picker below the grid, (2) sets `activeControlSection` → triggers highlight in preview, (3) scrolls accordion to matching section via `requestScrollToSection`
- Only one swatch expanded at a time
- Expanded picker contains: `HexColorPicker` (react-colorful) + CFA palette swatches + hex input
- Render only the active picker (not all 8) for performance
- Brand swatch calls `setBrandPrimary`, others call `setToken`

### AccordionSection Refactoring

**File:** `components/controls/AccordionSection.tsx`

Required for both QuickPalette and Click-to-Edit (Step 5):

1. Wrap with `forwardRef`
2. Add `useImperativeHandle` exposing:
   ```typescript
   export interface AccordionSectionHandle {
     open: () => void;
     scrollIntoView: () => void;
   }
   ```
3. Add `sectionId?: string` prop (defaults to kebab-case of title)
4. Add a `containerRef` for `scrollIntoView({ behavior: 'smooth', block: 'nearest' })`

### ControlsPanel Integration

- Add `accordionRefs` registry: `useRef<Record<string, AccordionSectionHandle | null>>({})`
- Attach refs to each AccordionSection via callback ref pattern
- Add `useEffect` watching `scrollToSectionRequest` from store:
  ```
  When scrollToSectionRequest changes → find matching ref → call open() + scrollIntoView() → clearScrollRequest()
  ```
- Render `<QuickPalette />` between PresetDropdown and first accordion

### Verification
- [ ] 8 swatches render with correct current colors
- [ ] Click "Navbar" swatch → inline picker opens, navbar highlights in preview
- [ ] Change color via quick palette → preview updates immediately
- [ ] Click different swatch → previous picker closes, new one opens
- [ ] Brand swatch propagates to linked tokens
- [ ] Grid fits within 280px tablet controls panel and full-width mobile

---

## Step 5: Click-to-Edit in Preview (P1)

### Problem Solved
Users see a footer they want to change but must mentally map it to the right accordion section, then scroll to find it.

### Solution
Click any element in the preview → controls panel auto-scrolls to and opens the corresponding accordion section.

### Add `data-section` Attributes to Preview Components

| File | Element | Attribute |
|------|---------|-----------|
| `components/preview/MoodleNavbar.tsx` | `<nav>` | `data-section="navbar"` |
| `components/preview/MoodleNavbar.tsx` | `.edit-mode-area` div | `data-section="edit-mode-toggle"` |
| `components/preview/MoodleFooter.tsx` | `<footer>` | `data-section="footer"` |
| `components/preview/DashboardPage.tsx` | `.highlight-text` elements | `data-section="typography"` |
| `components/preview/DashboardPage.tsx` | `.moodle-alert` elements | `data-section="alerts-&-progress"` |
| `components/preview/CoursePage.tsx` | `.highlight-text` elements | `data-section="typography"` |
| `components/preview/CourseCard.tsx` | `.moodle-card` wrapper | `data-section="content-area"` |
| `components/preview/CourseCard.tsx` | `.moodle-btn-primary/outline` | `data-section="buttons"` |
| `components/preview/ActivityRow.tsx` | `.moodle-link` elements | `data-section="links-&-focus"` |
| `components/preview/MoodleBreadcrumb.tsx` | breadcrumb container | `data-section="content-area"` |
| `components/preview/CourseDrawer.tsx` | `.moodle-drawer` aside | `data-section="drawers"` |
| `components/preview/LoginPage.tsx` | `.login-area` card | `data-section="login-page"` |

### Event Delegation in MoodleShell

**File:** `components/preview/MoodleShell.tsx`

Add click handler on `.moodle-preview` container:
```
1. Walk up from e.target using closest('[data-section]')
2. Get sectionId from data-section attribute
3. Call setActiveControlSection(sectionId) → triggers highlight animation
4. Call requestScrollToSection(sectionId) → accordion opens + scrolls
5. On mobile: call setMobileTab('controls') → switches to controls tab
```

**No coordinate math needed** — `closest()` works correctly regardless of CSS `transform: scale()` because it operates on DOM elements, not coordinates.

### Hover States

Add CSS in MoodleShell's dynamic `<style>` block:
```css
.moodle-preview [data-section] {
  cursor: pointer;
  transition: outline 0.15s ease;
}
.moodle-preview [data-section]:hover {
  outline: 2px dashed rgba(242, 121, 39, 0.4);
  outline-offset: 2px;
}
```

### Nested Element Priority
When `data-section` elements are nested (e.g., a button inside a card), `closest()` finds the innermost match first. This is correct: clicking a button should navigate to "buttons", not "content-area".

### Verification
- [ ] Hover over navbar → dashed orange outline, pointer cursor
- [ ] Click navbar → controls panel scrolls to "Navbar" accordion, opens it, pulse animates
- [ ] Click course card → scrolls to "Content Area"
- [ ] Click login button → scrolls to "Login Page" (auto-switches preview to login page)
- [ ] Mobile: click preview element → switches to Controls tab, scrolls to section
- [ ] Works at all zoom levels (75%, 100%, 125%)

---

## Step 6: Visual Preset Mini-Previews (P2)

### Problem Solved
Preset names don't convey what the theme looks like. Users must try each one to see.

### Solution
Show miniature color previews in the preset dropdown cards.

### Modifications to PresetDropdown (from Step 2)

Change the dropdown panel from a simple list to a 2-column grid of cards:

Each card shows:
```
┌─────────────────┐
│ ███████████████ │  ← navbarBg (3px tall)
│                 │
│    [██████]     │  ← btnPrimaryBg button shape
│                 │
│ ███████████████ │  ← footerBg (3px tall)
├─────────────────┤
│ Name         ★  │
└─────────────────┘
```

- Uses `DEFAULT_TOKENS` merged with `preset.overrides` for colors
- Active preset has `border-gray-800` highlight
- Recommended preset shows `Star` icon
- Grid: `grid-cols-1 md:grid-cols-2 gap-2`
- Max height with scroll: `max-h-80 overflow-y-auto`

### Verification
- [ ] Dropdown shows miniature previews with correct colors per preset
- [ ] "CFA High Contrast AAA" shows star badge
- [ ] Active preset highlighted
- [ ] Selecting a card applies preset and closes dropdown
- [ ] Grid fits within 280px tablet panel (switches to 1 column)

---

## Step 7: Batch Color Import (P3)

### Problem Solved
Users with a brand guide must enter 5-6 hex codes one by one across different accordion sections.

### Why Not Gemini's `generateSmartTheme`?

Gemini proposed a new `generateSmartTheme(baseHex)` store action. This already exists — it's called `setBrandPrimary()`. It propagates to 9 linked tokens via `BRAND_LINKED_KEYS`, auto-computes hover/text colors via `darkenHex` and `autoTextColour`. Adding a duplicate action under a new name solves nothing. The real problem is that users don't see the propagation happening (fixed by Step 3's linked indicators) and can't input multiple brand colors at once (fixed by this batch import).

### New File: `components/controls/BatchImportModal.tsx`

```typescript
interface BatchImportModalProps {
  open: boolean;
  onClose: () => void;
}
```

**UI Flow:**
1. Textarea for pasting hex values (supports `#RRGGBB`, `RRGGBB`, comma/newline separated)
2. Parse button extracts valid hex patterns via regex `/(?:#|0x)?([0-9A-Fa-f]{6})/g`
3. Preview table: color swatch | hex | auto-assigned token | reassign dropdown
4. "Apply" button calls `batchSetTokens()` (single undo point)
5. "Cancel" closes modal

**Auto-assignment algorithm** (uses existing `relativeLuminance` and `hexToHsl` from `lib/accessibility.ts`):
- Sort by luminance: darkest → `navbarBg`, `footerBg`
- Lightest → `loginCardBg`, `cardBg`
- Most saturated of remaining → `brandPrimary` (triggers `setBrandPrimary` propagation)
- Next most saturated → `sectionAccent`

### Integration
- Add "Import Colors" button in ControlsPanel header (next to PresetDropdown)
- Uses `batchSetTokens` from store for single undo point

### Verification
- [ ] Paste "404041, F27927, 336E7B, F0EEEE" → parses 4 colors
- [ ] Auto-assignment: darkest → navbar, lightest → card bg, saturated → brand
- [ ] Reassign via dropdown works
- [ ] Apply updates all tokens, preview reflects changes
- [ ] Single undo reverts all batch changes

---

## Files Summary

### New Files (4)

| File | Step |
|------|------|
| `components/controls/PresetDropdown.tsx` | 2, 6 |
| `components/controls/LinkedIndicator.tsx` | 3 |
| `components/controls/QuickPalette.tsx` | 4 |
| `components/controls/BatchImportModal.tsx` | 7 |

### Modified Files (14)

| File | Steps |
|------|-------|
| `store/theme-store.ts` | 1, 7 |
| `components/controls/ControlsPanel.tsx` | 2, 3, 4, 7 |
| `components/controls/AccordionSection.tsx` | 4 |
| `components/controls/ColourPicker.tsx` | 2, 3 |
| `components/controls/GradientToggle.tsx` | 2 |
| `components/preview/MoodleShell.tsx` | 5 |
| `components/preview/MoodleNavbar.tsx` | 5 |
| `components/preview/MoodleFooter.tsx` | 5 |
| `components/preview/DashboardPage.tsx` | 5 |
| `components/preview/CoursePage.tsx` | 5 |
| `components/preview/CourseCard.tsx` | 5 |
| `components/preview/ActivityRow.tsx` | 5 |
| `components/preview/MoodleBreadcrumb.tsx` | 5 |
| `components/preview/LoginPage.tsx` | 5 |

### Deleted Files (1)

| File | Reason |
|------|--------|
| `components/controls/PresetSelector.tsx` | Replaced by PresetDropdown |

---

## What Does NOT Change

- `lib/scss-generator.ts` — operates on `tokens` only
- `lib/tokens.ts` — all constants/types reused as-is
- `lib/accessibility.ts` — all utilities reused as-is
- `components/export/ExportModal.tsx` — reads `tokens` only
- `components/audit/AuditPanel.tsx` — reads `tokens` only
- `components/ResponsiveLayout.tsx` — layout structure unchanged
- `components/MobileTabBar.tsx` — unchanged
- `components/Toolbar.tsx` — unchanged
- `components/SaveLoadModal.tsx` — unchanged

---

## Key Design Decisions

### Why Dropdown Instead of Tabs?
Gemini 3.1 Pro proposed "Presets | Customise" tabs. This creates:
- Tabs-within-tabs on mobile (bottom bar already has Controls/Preview/Audit)
- Still requires mode discovery (different tab = different mode)
- Breaks current auto-switch-to-custom behavior

The dropdown has zero layout impact, fits any width, and makes presets a "starting point" rather than a "mode."

### Why No `generateSmartTheme`?
`setBrandPrimary()` already does this. It propagates to 9 tokens, auto-computes hover and text colors. Duplicating the logic under a new name adds maintenance burden without UX benefit. The real fix is making the propagation visible (Step 3) and making bulk input possible (Step 7).

### Why Command Bus for Cross-Panel Communication?
Click-to-edit (preview panel) needs to scroll the controls panel (sibling). React context can't bridge siblings without lifting to a common parent. A `scrollToSectionRequest` field in Zustand acts as a clean command bus: preview sets it, controls consumes it and clears it. No DOM coupling.

### Why Ref-Based Accordion Control?
Store-driven open state would couple accordion state to Zustand (unnecessary global state). `forwardRef` + `useImperativeHandle` keeps accordion state local while allowing programmatic open/scroll from the parent. This is idiomatic React.

---

## Verification Plan (End-to-End)

After all steps:
1. `npm run build` — zero errors
2. `npm run lint` — zero warnings
3. Fresh load (clear localStorage): app renders with Moodle defaults, all controls editable
4. Select preset → change color → "(Modified)" badge → select different preset → badge gone
5. Quick Palette: change Brand → 9 linked tokens update → broken-link icons on manual overrides
6. Click navbar in preview → controls scroll to Navbar section
7. Mobile: click footer in preview → switches to Controls tab, scrolls to Footer
8. Batch import 4 colors → auto-assigned → Apply → single undo reverts all
9. Export SCSS → paste into Moodle → verify output matches
10. Undo/redo works across all interaction paths

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Undo/redo regression | Temporal middleware partializes on `tokens` only — unchanged by new store fields |
| Export regression | SCSS generator reads `tokens` only — zero changes to export pipeline |
| Mobile layout breaks | No layout structure changes; dropdown/quick palette use standard Tailwind responsive classes |
| Nested data-section clicks | `closest()` finds innermost match first — correct behavior (button > card) |
| Accordion scroll timing | Use `requestAnimationFrame` delay for accordion render before `scrollIntoView` |
| Batch import undo granularity | `batchSetTokens` creates single undo point instead of N individual setToken calls |
| Performance (8 pickers) | QuickPalette renders only the active/expanded picker, not all 8 |
