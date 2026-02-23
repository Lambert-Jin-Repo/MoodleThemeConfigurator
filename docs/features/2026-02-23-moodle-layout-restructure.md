# Feature: Moodle Layout Restructure
Date: 2026-02-23
Status: shipped
Branch: feat/moodle-layout-restructure

## Problem
The current preview pages (Dashboard, Course, Login) do not match real MoodleCloud screenshots. Structural elements are wrong: Dashboard has progress bars and timeline activities instead of "Recently accessed courses" + Calendar; Course page has generic content instead of real CFA course structure; Login page layout differs significantly from real Moodle login.

## Moodle Constraints
- All layout changes are CSS/structural only — no SCSS generator changes needed
- Existing `--cfa-*` CSS custom properties remain the colour control mechanism
- Real Moodle Boost uses stacked card layout for Dashboard blocks (not a right sidebar)
- Course page has collapsible sections with "Collapse all", not flat activity lists
- Login page has no heading text — CFA logo serves as the header
- Verified selectors in `docs/moodle-cloud-constraints.md` remain unchanged

## Design
Restructure all three preview pages to match real MoodleCloud screenshots exactly, using CFA-specific content. Remove BlocksDrawer references from MoodleShell. Keep all existing colour control features and CSS custom properties intact.

## Tasks

### Task 1: Rewrite DashboardPage.tsx
- **Files:** `components/preview/DashboardPage.tsx`
- **Depends on:** none
- **Acceptance:**
  - Heading is "Dashboard" (h2, bold) — no "Welcome back!" greeting
  - "Recently accessed courses" section with 2 course cards side by side:
    - Card 1: Dark image placeholder with "Centre for Accessibility AUSTRALIA" text, title "Web Accessibility Compliance S..." as link, "Category 1" below
    - Card 2: Grey/person image placeholder, title "Starting with Moodle" as link, "Category 1" below
    - Cards have NO progress bars, NO buttons — just image + title + category
  - "Timeline" section: filter bar with "Next 7 days" dropdown, "Sort by dates" dropdown, search input; empty state icon + "No activities require action" message
  - "Calendar" section: "All courses" dropdown + "New event" button (primary); month navigation (← January | February 2026 | March →); full 7-column day grid (Sun-Sat) with day numbers; today highlighted with `--cfa-btn-primary-bg` circle
  - All sections are white cards with borders, stacked vertically, centred at max-width ~830px
  - NO right sidebar / BlocksDrawer
  - All colours use `var(--cfa-*)` CSS custom properties
  - Existing CSS classes preserved: `highlight-text`, `moodle-link`, `moodle-card`, `moodle-btn-primary`, `moodle-btn-secondary`

### Task 2: Rewrite CourseCard.tsx
- **Files:** `components/preview/CourseCard.tsx`
- **Depends on:** none
- **Acceptance:**
  - Props: `title`, `category`, `imageType` ('accessibility' | 'moodle')
  - Accessibility card: dark navy gradient (#1a1a4e) background with "Centre for Accessibili" text overlay
  - Moodle card: grey/blue placeholder with generic image indicator
  - Title is a link (`moodle-link` class) below the image
  - Category text in `--cfa-muted-text` below title
  - NO progress bar, NO buttons, NO percentage
  - Card uses `moodle-card` class for hover effects
  - Card height ~160px for image, compact padding below

### Task 3: Rewrite CourseDrawer.tsx
- **Files:** `components/preview/CourseDrawer.tsx`
- **Depends on:** none
- **Acceptance:**
  - Header: X close button (left) + three-dot menu icon (right)
  - Full CFA course index structure matching screenshot:
    - **General** section (expanded with ▼): Welcome, Introductions, ○ Reflections, ○ General Discussion, Aims & Objectives, Graduate Qualities
    - **○ Teleconference recordings** (with completion circle): Resources, Contacts, Acknowledgements, Evaluation, News forum
    - **Modules** section (expanded with ▼): Modules, Module 1-6 (truncated with ellipsis)
    - **○ Level A quick tips** (standalone with completion circle)
    - **Assessments** section (expanded with ▼): Key Dates, ○ Assignment 1, ○ Assignment 1 Project Analy... 🔒, Assignment One Mark Sheet (..., ○ Assignment 2
  - Items ~13px, truncated with ellipsis for long names
  - Completion circles (○) on incomplete items
  - Lock icon (🔒) on restricted items
  - All text uses `var(--cfa-drawer-text)`, background `var(--cfa-drawer-bg)`
  - `moodle-drawer` and `moodle-drawer-item` classes preserved

### Task 4: Rewrite CoursePage.tsx + SecondaryNav.tsx
- **Files:** `components/preview/CoursePage.tsx`, `components/preview/SecondaryNav.tsx`
- **Depends on:** Task 3 (uses new CourseDrawer)
- **Acceptance:**
  - **SecondaryNav**: 6 tabs — Course (active) | Settings | Participants | Grades | Activities | More ▾
  - **CoursePage title**: "Web Accessibility Compliance SC" (h2, bold)
  - **Content sections** in white card container:
    - "General" section header with ▼ collapse chevron + "Collapse all" link on right
    - Activity rows matching screenshot: Welcome (Page icon), Introductions (Forum icon + group icon right), Reflections (Forum + "To do" dropdown), General Discussion (Forum + "To do" dropdown), Aims & Objectives (Page icon), Graduate Qualities (Page icon)
    - Hidden section: grey "Hidden from students" badge (with eye-off icon) + "Teleconference recordings" text + "Mark as done" button on right
    - Below hidden section: Resources, Contacts, Acknowledgements, Evaluation (with "Hidden from students" sub-badge), News forum
  - "Modules" section header starting below (with ▼ chevron)
  - NO "Mark all as complete" or "Download resources" buttons
  - NO right sidebar
  - Activity icons use Moodle 4.x purpose-based colours (teal for pages, teal for forums)
  - All colours use CSS custom properties

### Task 5: Rewrite LoginPage.tsx
- **Files:** `components/preview/LoginPage.tsx`
- **Depends on:** none
- **Acceptance:**
  - Background: same gradient/solid/image logic as current (preserved)
  - Centred white card with rounded corners + shadow
  - **CFA Logo** at top (using existing CfaLogo component, `variant="login"`)
  - NO "Log in" heading — logo serves as header
  - Username input with "admin" as placeholder/value
  - Password input with "Password" placeholder
  - **"Log in" button**: small, LEFT-aligned (not full-width), primary colour, ~100px wide
  - **"Lost password?"** link below button
  - **Horizontal divider** (1px solid #dee2e6)
  - **"Is this your first time here?"** heading (bold, ~18px)
  - Body text: "For full access to this site, you first need to create an account."
  - **"Create new account"** button: grey (#6c757d bg), white text, outlined style
  - **Footer section** below second divider: "English (United States) (en_us)" dropdown + "Cookies notice" pill button + "Cookie Settings" link
  - All colours use CSS custom properties

### Task 6: Update MoodleShell.tsx
- **Files:** `components/preview/MoodleShell.tsx`
- **Depends on:** Tasks 1-5 (all page components must be updated)
- **Acceptance:**
  - Remove `.moodle-btn-outline` hover styles (replaced by `.moodle-btn-secondary` which already exists)
  - Update `SECTION_HIGHLIGHT_MAP` 'buttons' entry to reference `.moodle-btn-secondary` instead of `.moodle-btn-outline`
  - Add `.moodle-btn-secondary` hover styles if not already present: `background: #ced4da` default, `#b8bfc6` on hover, text `#1d2125`
  - Verify no references to BlocksDrawer remain
  - All existing hover styles, highlight system, and CSS variable generation unchanged

## Verification
- `npm run build` — zero errors
- `npm run lint` — zero warnings/errors
- Visual comparison: Dashboard matches screenshot (stacked cards, calendar, no sidebar)
- Visual comparison: Course page matches screenshot (full drawer, collapsible sections, hidden items)
- Visual comparison: Login page matches screenshot (logo header, small left button, signup section, footer)
- All existing colour controls still work (change brand primary, verify propagation across all 3 pages)
- Hover effects work on all interactive elements
- Section highlighting still works when clicking accordion sections in controls panel
