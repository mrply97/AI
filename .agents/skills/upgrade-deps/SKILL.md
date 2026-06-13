---
name: upgrade-deps
description: Use when upgrading dependencies, bumping packages, or patching security vulnerabilities. Triggers on "upgrade dependencies", "bump deps", "security upgrade", "patch vulnerabilities", "update packages". Runs an autonomous maker/checker upgrade loop that opens PRs per upgrade class.
---
# Upgrade Dependencies — Autonomous Loop

Keep dependencies current and secure by running an autonomous maker/checker loop that opens one PR per upgrade class (patch/minor/major), self-corrects on failure, and remembers what it deferred and why.

## Workflow
1. **Load memory.** Read `loops/A-nightly-deps/state/deps-state.md`. Honour the "Deferred (do not re-attempt)" table — never re-bump a package whose deferral reasoning still holds. *Evidence: list which pinned/deferred packages you are skipping and the ticket.*
2. **Enumerate.** List outdated deps (`npm outdated` / `pip list --outdated`) and active advisories (GitHub Security Advisories MCP, `npm audit` / `pip-audit`). *Evidence: a table of package, current → latest, severity.*
3. **Split into upgrade classes.** Group into three worktrees so a failing major never blocks safe patches: `wt/patch`, `wt/minor`, `wt/major`. *Evidence: which packages landed in which worktree.*
4. **For each worktree — make.** Dispatch `deps-maker` (fast) to bump versions and fix breaking changes within that worktree only, reading changelogs. *Evidence: the diff + changelog notes per package.*
5. **For each worktree — check.** Dispatch `deps-checker` (strong, security-focused) to run the FULL test suite + typecheck + `npm audit`/`pip-audit` and read changelogs for BEHAVIOURAL changes a green build hides. *Evidence: explicit PASS/FAIL verdict with logs.*
6. **Green → PR.** On PASS, open a GitHub PR for that upgrade class (GitHub MCP) and post a digest line to Slack. *Evidence: PR URL.*
7. **Red → self-correct.** On FAIL, the maker self-corrects up to 3 attempts (backpressure = the audit + suite it sees DURING the fix). After 3, file the group to the Triage inbox for a human. *Evidence: attempt count + triage item.*
8. **Update memory.** Append upgraded packages to "## Upgraded"; append anything newly deferred (with reason + ticket) to "## Deferred". *Evidence: the rows written.*
9. **Exit.** Stop when every class is either PR'd or triaged and memory is updated.

## Stop condition
Build + full test suite + typecheck are green AND no high/critical advisories remain — for each upgrade class. Maker self-corrects up to 3 attempts; otherwise the group is filed to the Triage inbox for a human.

## The six blocks in this loop
- **Automation/cadence** — Codex Automation `nightly-deps` at 02:00 daily on a background worktree → Triage inbox; or Claude Code scheduled GitHub Action / overnight `/loop 1d /upgrade-deps`.
- **Worktrees** — `wt/patch`, `wt/minor`, `wt/major`; a failing major never blocks safe patch PRs.
- **Skill** — this `upgrade-deps` skill: package manager, changelog routine, and the pinned-with-reason list (intent-debt insurance).
- **Connectors (MCP)** — GitHub (open PRs), GitHub Security Advisories / `npm audit` / `pip-audit`, Slack (digest).
- **Sub-agents** — `deps-maker` (fast) bumps + fixes; `deps-checker` (strong, high reasoning) audits + tests + reads changelogs.
- **Memory** — `loops/A-nightly-deps/state/deps-state.md`: bumped, deferred, and WHY.

## Anti-rationalisation
| Excuse | Rebuttal |
| --- | --- |
| "The build is green so it's safe to merge." | A green build hides behavioural changes; the checker MUST read changelogs for behaviour shifts, not just trust the suite. |
| "This major bump is annoying — let me just defer it again." | Re-deferring is only valid if the deferral reasoning in deps-state.md still holds; otherwise attempt the fix or file fresh triage. |
| "One audit warning is low severity, skip it." | The stop condition is no HIGH/CRITICAL advisories; record low/medium in state but do not silently drop high/critical. |
