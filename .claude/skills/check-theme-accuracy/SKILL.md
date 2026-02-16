---
name: Check Theme Accuracy
description: Verify preview matches Moodle screenshots
disable-model-invocation: true
---

# Check Theme Accuracy

Verify that the Moodle preview replica accurately represents the real CFA Moodle site.

## Steps

1. Read the Moodle screenshots for visual reference:
   - `docs/references/Moodle Site Sample Page/Moodle Home Page Sample.png` — Dashboard
   - `docs/references/Moodle Site Sample Page/Moodle Course Page Sample.png` — Course Page
   - `docs/references/Moodle Site Sample Page/Moodle Login Page Sample.png` — Login Page

2. Read the current preview components:
   - `components/preview/DashboardPage.tsx`
   - `components/preview/CoursePage.tsx`
   - `components/preview/LoginPage.tsx`
   - `components/preview/MoodleNavbar.tsx`
   - `components/preview/CourseDrawer.tsx`

3. For each page, check:

### Dashboard
- [ ] Navbar: white bg, CFA logo (red square + stacked text + "AUSTRALIA"), nav links, right-side icons
- [ ] "Dashboard" heading with "Hi, Scott!" and wave emoji
- [ ] Trial banner with blue left border, "Upgrade" pill button
- [ ] Course overview section inside white card wrapper
- [ ] Two course cards side by side: correct image headers, titles as links, categories, progress bars
- [ ] All colours from CSS variables (no hardcoded values)

### Course Page
- [ ] Left drawer: ~160px, correct section structure (General, Teleconference recordings, Modules, etc.)
- [ ] Secondary nav tabs: Course (active with underline), Settings (blue), Participants, Grades, Activities, More
- [ ] Activity rows: teal icon squares, activity name links, "To do" dropdowns
- [ ] "Hidden from students" banner row
- [ ] Course title "Web Accessibility Compliance SC"

### Login Page
- [ ] No navbar
- [ ] Centred card on grey background
- [ ] "Log in to CFA Learning Portal" heading (NOT "CGA")
- [ ] Pill-shaped inputs (24px border-radius)
- [ ] Compact left-aligned "Log in" button (6px radius)
- [ ] "Create new account" dark button
- [ ] Footer: language selector, cookies notice, cookie settings

4. Check brand propagation:
- [ ] Change brandPrimary in store → all linked tokens update
- [ ] Course titles, buttons, active tabs, progress fills, login button all reflect new colour
- [ ] Manually overridden tokens are NOT affected by brand change

5. Report any discrepancies with specific component file paths and line numbers.
