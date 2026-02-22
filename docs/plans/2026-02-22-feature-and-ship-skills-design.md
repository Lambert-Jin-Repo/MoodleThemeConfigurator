# Design: `/feature` and `/ship` Skills

**Date:** 2026-02-22
**Status:** Approved

---

## Problem

The project has 11 standalone skills but no orchestration. Agents repeat process mistakes (skipping branches, forgetting commits, not using parallel agents). The PROJECT-TRACKER documents these failures repeatedly. A single `/feature` command should enforce the full pipeline: brainstorm → spec → build → verify → ship → record.

Additionally, 4 git workflow skills (`create-branch`, `safe-commit`, `safe-push`, `check-secrets`) overlap significantly and should be consolidated into a single `/ship` gate.

## Design Decisions

| Decision | Rationale |
|---|---|
| Thin orchestrator (Approach A) | `/feature` sequences superpowers skills rather than duplicating their logic. Gets free updates as superpowers evolves. |
| Consolidate git skills into `/ship` | `safe-commit` and `safe-push` both run build, lint, and secret scan. `create-branch` is just the first step of shipping. One skill eliminates redundancy. |
| Feature MD as contract | The spec file at `docs/features/` is the handoff between brainstorming and parallel agents. Each task maps to one agent, lists specific files to prevent collisions. |
| Conditional verify gates | Not every feature needs every validation skill. Auto-detect from the feature MD's file list which gates to run. |
| Moodle docs fetched only when relevant | Context7 MCP queries add latency. Only fetch when feature touches theme/SCSS/selectors/Moodle UI. |
| PROJECT-TRACKER update as final step | Closes the loop. Every feature session gets a paper trail without manual bookkeeping. |

## New Skills

### `/feature <idea>` — Full Pipeline Orchestrator

```
Phase 1: DISCOVER
  ├─ Read UNIFIED-SPEC.md + moodle-cloud-constraints.md
  ├─ If Moodle-relevant → fetch Context7 Moodle docs
  └─ Invoke superpowers:brainstorming

Phase 2: SPECIFY
  ├─ Export docs/features/YYYY-MM-DD-<name>.md
  ├─ Task breakdown for parallel agents
  └─ User approves feature MD

Phase 3: BUILD
  ├─ Invoke superpowers:using-git-worktrees
  └─ Invoke superpowers:subagent-driven-development

Phase 4: VERIFY
  ├─ Always: /verify-build
  ├─ Preview components → /check-theme-accuracy + /brand-audit
  ├─ SCSS generator → /validate-scss-export
  └─ Colour tokens → /brand-audit

Phase 5: SHIP
  ├─ Invoke /ship
  └─ Update PROJECT-TRACKER.md
```

### `/ship` — Consolidated Git Workflow

Replaces: `/create-branch`, `/safe-commit`, `/safe-push`, `/check-secrets`

```
1. Branch check (ensure feature branch, create if needed)
2. Secret scan (staged + full history)
3. Build check (npm run build)
4. Lint check (npm run lint)
5. Conventional commit
6. Push with -u
7. Suggest PR creation
```

## Skills Kept Standalone

| Skill | Reason |
|---|---|
| `/brand-audit` | Invoked as verify gate + usable independently |
| `/check-theme-accuracy` | Invoked as verify gate + usable independently |
| `/validate-scss-export` | Invoked as verify gate + usable independently |
| `/verify-build` | Invoked as verify gate + usable independently |
| `/build-component` | Guidance for agents during BUILD phase |
| `/continue-build` | Diagnostics for resuming work |
| `/review-pr` | PR review after shipping |

## Skills Replaced

| Old Skill | Replaced By | Notes |
|---|---|---|
| `/create-branch` | `/ship` step 1 | Branch creation is first step of shipping |
| `/safe-commit` | `/ship` step 5 | Commit with all pre-checks |
| `/safe-push` | `/ship` step 6 | Push with validation |
| `/check-secrets` | `/ship` step 2 | Secret scanning is a ship gate |

## Feature MD Template

```markdown
# Feature: <Name>
Date: YYYY-MM-DD
Status: draft | approved | in-progress | shipped
Branch: feat/<name>

## Problem
<1-2 sentences>

## Moodle Constraints
<If relevant. Omit if not.>

## Design
<Approved design from brainstorming>

## Tasks

### Task 1: <title>
- **Files:** specific files to create/modify
- **Depends on:** none | Task N
- **Acceptance:** what "done" looks like

### Task 2: <title>
...

## Verification
<End-to-end checks after all tasks complete>
```

## CLAUDE.md Updates Required

Update the Available Skills table in CLAUDE.md:
- Add `/feature` and `/ship`
- Remove `/create-branch`, `/safe-commit`, `/safe-push`, `/check-secrets`
- Update git workflow instructions to reference `/ship`
