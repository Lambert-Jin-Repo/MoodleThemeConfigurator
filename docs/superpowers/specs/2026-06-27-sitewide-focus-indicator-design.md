# Site-wide Focus / Click Indicator — Design Spec

**Date:** 2026-06-27
**Branch:** `worktree-feat-sitewide-focus-indicator` (off `main` @ 18efa04)
**Feature #:** 158 (next in the dark-theme/visual series)
**Status:** Design — awaiting user approval before implementation plan.

---

## 1. Goal

Give the exported Moodle theme **one consistent keyboard + mouse focus indicator across the whole site** — links, navbar items, content links, form fields, tabs, dropdowns, buttons — matching the CFA official website (centreforaccessibility.org.au). Today the effect exists only on the login page (#157); everywhere else falls back to Moodle/Bootstrap defaults (plus #143, which only fixes focused content-link *text* colour on dark themes).

This is a **design-system feature**, not a per-page bug fix: it replaces and consolidates the fragmented focus handling already in the generator into one coherent, WCAG-compliant system emitted for **all presets**.

---

## 2. Visual target & colours (validated against `docs/cfa-brand-reference.md`)

On `:focus` (Tab) **or** `:active`/click, an interactive element shows up to three layers:

| Layer | Value | Brand source | Applies to |
|---|---|---|---|
| **Box** (background) | `#8ADDF9` | light tint of CFA Sky Blue `#00BFFF` | links, nav-links, tabs, dropdown items |
| **Box text** | `#1d2125` | CFA Near-Black | (same — text on the box) |
| **Adaptive dashed ring** | `3px dashed`, `outline-offset: 3px`, colour = **white `#FFFFFF` on dark surfaces / near-black `#1d2125` on light surfaces** | White / Near-Black | **every** focusable element |

All four colours are **fixed, brand-sanctioned values** (the same documented "fixed-value exception" class as the existing `#FFFFFF` / `#1d2125` / `#8ADDF9` usages) — **no new tokens**. Lime `#BAF73C` (CFA Lime Green) remains the link **hover** accent and is untouched by this feature.

**Contrast (WCAG):**
- Box text `#1d2125` on `#8ADDF9` ≈ **14:1** (AAA).
- White ring on Charcoal `#404041` = **9.68:1**; on `#2B2B2C` higher — both ≥ 3:1.
- Near-black `#1d2125` ring on white ≈ **16:1** — ≥ 3:1.

---

## 3. Trigger — `:focus` + `:active` (NOT `:focus-visible` alone)

The indicator must appear on **both** keyboard focus **and** mouse click, so we trigger on `:focus, :focus-visible, :active, .focus` (mirroring the already-verified #143/#157 trigger set; `.focus` is the class Bootstrap/Moodle JS toggles on some components). `:focus-visible` alone is keyboard-only and would not fire on a mouse click — which would break the "tap or mouse-clicked" requirement.

**Consequence (intended):** after a mouse click the element stays `:focus`ed until blur, so its box/ring persists — exactly the official-site behaviour (e.g. a clicked "Access Awards" nav item stays boxed).

---

## 4. Element classification

### 4a. BOX + dark text + ring  (text-level interactive controls)

```
.aalink, a:not([class]), .arrow_link, .activityinstance > a,   // Moodle "Rule A" content links
#page-footer a:not([class]),                                    // footer content links (id-scoped)
.navbar .primary-navigation .nav-link,                          // primary-nav items (navbar-scoped, see note)
.nav-tabs .nav-link,                                            // tabs (covers .secondary-navigation tabs)
.dropdown-item                                                  // menu items
```

**Why these and only these:** Moodle Boost's own "Rule A" already paints a light box behind `.aalink` / `a:not([class])` / `.arrow_link` / `.activityinstance > a` on focus, so recolouring that box sky-blue is consistent with Moodle's native behaviour (no new card-tinting). Nav-links, tabs and dropdown items are small inline controls (no card-tint risk) and match the official "Access Awards" nav box. Child icons inside a boxed element are forced to `#1d2125` so a lime/orange glyph doesn't sit illegibly on the sky-blue box.

**Specificity note (navbar):** primary navbar nav-links carry a hover/focus self-paint at `(0,3,0)+!important` (`navHoverBg` at L172, `navHoverText` at L495). The box on them is therefore authored navbar-scoped — `.navbar .primary-navigation .nav-link:focus …` `(0,4,0)+!important` placed later — so the sky-blue box wins on focus/click while the navbar's own `:hover` overlay is left intact. Tabs and dropdown items have lower-specificity self-paints handled the same way.

### 4b. Ring ONLY  (keep own background; no box)

Everything else focusable, most importantly:

- **All buttons** — `.btn`, `button`, `[role="button"]` (per user decision). Preserves brand `.btn-primary` fill, the quiz-nav **traffic-light state** buttons (`.qnbutton`, WCAG 1.4.1), the destructive red preflight **Cancel**, and the permanent #152 `a.btn-primary:focus` rule — all keep their meaning and just get the dashed ring.
- **Form fields** — `input`, `textarea`, `select`, `.form-control`, `.form-select` (best practice: don't repaint a field you're typing in; avoids clashing with dark-theme input backgrounds).
- **Checkboxes / radios** — `input[type=checkbox/radio]`, `.form-check-input`, and **critically** the `appearance:none` custom quiz radios (#133) — a box would *fill the disc* and break the redraw.
- **Card / row-wrapping links** — `.list-group-item`, `.coursebox`/`.course-summaryitem`/`.dashboard-card`/`.block_myoverview .card` whole-tile links, `#region-main .maincalendar .calendarmonth .clickable` day-cells — ring avoids tinting a whole card/row sky-blue.

---

## 5. Adaptive ring colour — per-surface, computed from token brightness

Pure CSS cannot detect the background behind an element, **but the generator emits per-preset SCSS and already knows every surface's colour.** A focused element's ring colour is derived from the brightness of *the surface it sits on*, not from the global `darkMode` flag.

> **Critical finding from the audit:** `darkMode = isDarkBg(pageBg)` is insufficient. Surfaces are token-driven and can be dark on a *light-bg* preset — e.g. **CFA Dark Chrome** has a charcoal navbar with `darkMode = false`, so a focused navbar link there needs a **white** ring even though the page is light. Conversely, dark presets contain many hardcoded-**white** islands (`.bg-white`, modals, dialogs, white inputs, the quiz timer, the chart backdrop) that need a **near-black** ring.

Add a tiny generator helper:

```ts
const dashFor = (hex: string) => isDarkBg(hex) ? '#FFFFFF' : '#1d2125';
```

**Emission (late in Block 2, outside `if(darkMode)`, unconditional base):**

1. **Box rule** (4a selectors) — `background-color:#8ADDF9 !important; color:#1d2125 !important; box-shadow:none !important;` + child-icon `color:#1d2125`.
2. **Base ring** (4a + 4b selectors) — `outline:3px dashed ${dashFor(tokens.pageBg)} !important; outline-offset:3px !important;`.
3. **Per-surface ring-colour overrides** — emitted **only when `dashFor(surface) !== dashFor(pageBg)`** (smart export), using a descendant `:focus`/`:active` selector so anything focused on that surface adopts its ring:
   - `.navbar :focus, .navbar :active { outline-color: ${dashFor(navbarBg)} !important; }`
   - `#page-footer :focus, #page-footer :active { outline-color: ${dashFor(footerBg)} !important; }`
   - `[data-region="right-hand-drawer"] :focus, .drawer :focus { outline-color: ${dashFor(drawerBg)} !important; }`
4. **Dark-theme light islands** (emitted only when `darkMode`) — near-black ring on the genuinely-white surfaces:
   - `.bg-white :focus, .modal-content :focus, .moodle-dialogue-wrap :focus, .moodle-dialogue-bd :focus { outline-color:#1d2125 !important; }`
   - (Caveat: `.bg-white` is **not** uniformly light on dark themes — `.card.course-card .card-footer.bg-white` and `.message-app .bg-white` are re-darkened. The island override targets the genuinely-white selectors; remaining edge cases are caught during real-site verification, the project's normal iterative loop.)

**Specificity:** descendant overrides like `.navbar :focus` (0,2,0)+`!important`, placed after the base, beat the base `a:focus` (0,1,1) by specificity and tie-break `.btn:focus` (0,2,0) by source order.

---

## 6. Consolidation & reconciliation (what changes in `lib/scss-generator.ts`)

| Existing code | Lines (approx) | Action |
|---|---|---|
| `*:focus-visible { outline: …px solid focusRing }` (old ring, conditional, keyboard-only) | L217–225 | **DELETE** — superseded by the adaptive dashed ring. |
| `a:hover, a:focus { color: linkHover !important }` (the #1 conflict — forces lime/orange focus text on every link) | L476–480 | **REWORK** → drop `:focus`, keep `a:hover { … }`. The focus system now owns all focus text. |
| #143 content-link focus fix (`.aalink:focus … { color:#1d2125 }`, dark-only) | L2282–2311 | **ABSORB + PROMOTE** — its selectors + `#1d2125` text become part of the global **box** rule (now with `#8ADDF9` bg), emitted **unconditionally** (also fixes light CFA presets, which had the same bug). |
| Login #157 focus (link box + button ring, `#page-login-index`-scoped, gated `isDarkBg(loginBg)`) | L1010–1042 | **UPDATE** to match the global look (see §7). |
| `a.btn-primary:hover, a.btn-primary:focus { color: btnPrimaryText }` (permanent #152) | L247–249 | **KEEP** — buttons are ring-only, so no conflict. |
| `focusRing` / `focusRingWidth` tokens + control-panel inputs | tokens.ts / UI | **KEEP tokens** (stop emitting the old ring). The UI control becomes inert; retiring/repurposing it is a **noted follow-up**, out of scope here to avoid touching all 8 presets + the control panel now. |

Other self-painting focus states identified by the audit (`.btn-primary:focus-visible` bg, navbar `.nav-link:hover/:focus` bg, dark `.dropdown-item:focus` translucent bg, secondary-nav tab `:focus` bg, `.btn-outline-primary:focus` bg, notification-row `a:focus{transparent}`) are **left as-is**: buttons/tabs are ring-only (their self-paint stays), and the box on nav-links/dropdown-items is authored with sufficient specificity + later source order to win where we *do* box. Anything that doesn't resolve cleanly is caught in real-site testing.

---

## 7. Login page (#157) — keep scoped, restyle to match

Login **must** keep its `body#page-login-index`-scoped focus rules: login's resting rules force links white at `(1,1,2)+!important`, which a global `a:focus` `(0,2,1)` box can never beat. So login owns its focus, updated to match the global system:

- **Login links** (`.login-form-forgotpassword a`, `.login-signup a`, `.login-instructions a:not(.btn)`): box `#8ADDF9` + text `#1d2125` (already present) **+ white dashed ring** (new).
- **Login buttons** (`.btn`): dashed ring, colour changed **`#8ADDF9` → `#FFFFFF`** (white) to match the global dark-page ring. Stays ring-only (consistent with the global button decision).
- **Catch-all** (so login inputs etc. also get the correct ring on the dark login page): `body#page-login-index :focus, body#page-login-index :active { outline-color:#FFFFFF !important; }` `(1,1,0)`.
- Hover (lime `infoIconColour`) unchanged. Still gated `isDarkBg(loginBg)`.

The global rules need no explicit `:not(#page-login-index)` exclusion — login's id-scoped `(1,x,x)` rules naturally win over the global `(0,x,x)` rules for every property they set, and the global ring correctly handles login inputs on light-login themes.

---

## 8. Scope

- **Emit on all 10 presets** (light + dark, **including** pristine Moodle Default) — the base box + ring block is **unconditional**; per-surface overrides are conditional on brightness difference (smart export). The exported SCSS is only ever pasted onto a CFA-themed site, and site-wide consistency is the whole point.
- Adaptive ring is correct on both light and dark presets because it is computed per-surface from `isDarkBg(actualToken)`.

---

## 9. WCAG compliance

| Criterion | How met |
|---|---|
| 2.4.7 Focus Visible (A) | Every focusable element shows a box and/or 3px ring on `:focus`. |
| 2.4.11 Focus Appearance (AA, 2.2) | ≥ 2px perimeter (3px dashed) + a large state change (box bg and/or ring); contrast ≥ 3:1 both states. |
| 1.4.11 Non-text Contrast (AA) | Adaptive ring guarantees ≥ 3:1 vs the surface behind it (white-on-dark / near-black-on-light). |
| 1.4.1 Use of Color (A) | State/destructive buttons are ring-only → traffic-light & red-Cancel meaning preserved. |
| Text contrast | Box text `#1d2125` on `#8ADDF9` ≈ 14:1 (AAA). |

---

## 10. Files changed

- `lib/scss-generator.ts` — the feature (new focus block; delete old ring; rework L478; absorb #143; update login #157; add `dashFor` helper).
- `docs/moodle-cloud-constraints.md` — new "Site-wide Focus Indicator" section + selector rows.
- `docs/PROJECT-TRACKER.md` — #158 entry.
- A memory file at ship time (`project_sitewide_focus_indicator.md`) + `MEMORY.md` pointer.
- **No** new tokens, presets, or control-panel changes.

---

## 11. Verification

1. **Generator harness** across all 10 presets — merge `PRESET_TEMPLATES[i].overrides` (NOT `.tokens`), run `generateScss`, assert: every preset emits the unconditional box + base ring; the base ring colour = `dashFor(pageBg)`; per-surface overrides emit iff brightness differs; Dark Lime / Dark Ember / a synthetic custom-dark emit their own values; light presets emit no island overrides; the old `*:focus-visible` ring is gone.
2. `npm run build` + `npm run lint` clean; secret scan.
3. **Real-site (Moodle Cloud)** — `npm run dev` (port 3000), copy Block 2, test **Tab and mouse click** on: login (links, buttons, inputs), dashboard (card titles, blocks), a course page (`.aalink`, activity links), the **navbar** (→ white ring) and a **dropdown**, a **quiz** (nav state buttons stay coloured + ringed; radios ring not boxed), a **secondary-nav tab**, a **footer** link (→ white ring), and a **white modal/dialog** on a dark theme (→ near-black ring). Verify boxed-link child icons read on the box.

---

## 12. Risks / open items (resolved during real-site testing)

- **Card-tinting:** mitigated by boxing only Rule-A links + nav/tabs/dropdowns; card/row-wrapping links are ring-only. Confirm on dashboard + course-listing.
- **`.bg-white` not uniformly light on dark themes:** island ring override scoped to genuinely-white selectors; patch any stragglers found on the real site.
- **id-scoped link contexts** (grade tables, question-preview controls) may need their own scoped focus rule to beat `#id !important` resting colours — discover & patch per the project's normal iterative loop.
- **Generic YUI dialogs** (file-picker, activity-chooser) stay white on dark → near-black ring via the island rule; move-dialog (#142) and preflight (#154) are darkened → white ring via their dark surface.

---

## 13. Out of scope (follow-ups)

- Retiring or repurposing the now-inert `focusRing` / `focusRingWidth` UI control (would touch all 8 presets + the control panel).
- Changing global link **hover** behaviour (this feature is focus/click only).
- The Course-participation report and any other not-yet-themed surfaces.
