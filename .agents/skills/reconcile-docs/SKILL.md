---
name: reconcile-docs
description: Use when documentation is stale or drifting from the code — to reconcile docs with the current source. Triggers on "reconcile docs", "docs are stale", "update docs to match code", "doc drift", "fix outdated documentation". Rewrites affected pages and verifies every example runs.
---
# Reconcile Docs — Autonomous Loop

Keep `/docs` in lockstep with the source by reconciling only what changed since the last run, then proving every example still runs.

## Start here
This is the **lowest-risk loop to adopt first**. Backpressure is cheap and trustworthy: runnable examples, a link checker, and an API-signature-matches-source check. Start with this loop before any other.

## Workflow
1. **Read memory.** Open `loops/D-docs-drift/state/docs-state.md` and read the last-reconciled SHA per page plus any known-stale/deferred pages. *Checkpoint: you now have a per-page baseline.*
2. **Get the diff.** Use the GitHub connector to fetch the code diff since each page's last-reconciled SHA (not the whole history). *Checkpoint: you have the delta, not the world.*
3. **Map changed code → affected pages.** Apply the doc-page → code-module map (below) to turn changed modules into the set of doc pages they invalidate. *Checkpoint: an explicit list of affected pages; if empty, stop.*
4. **Open a worktree.** Create/enter a `wt/docs` worktree so doc edits never collide with live feature branches. *Checkpoint: edits are isolated.*
5. **Dispatch docs-maker.** Hand it the diff + affected-page list. It rewrites the affected pages and their code examples (changed signatures, removed flags, renamed APIs). *Checkpoint: pages rewritten in `wt/docs`.*
6. **Dispatch docs-checker (different model).** It EXECUTES every doc code example and diffs each documented API/signature against the ACTUAL current source. *Checkpoint: PASS, or a list of failing examples/signatures to fix — loop back to step 5.*
7. **Run the link checker.** Verify no broken internal/external links and that the docs-site build succeeds. *Checkpoint: zero broken links, green build.*
8. **Open a docs PR.** Push `wt/docs` and open a PR; post a summary to Slack. *Checkpoint: PR open.*
9. **Update memory.** Write the new last-reconciled SHA per reconciled page into `docs-state.md`; move any genuinely-deferred page into the known-stale table with a reason + ticket. *Checkpoint: next run processes only the new delta.*

## Stop condition
ALL changed-since-last-run pages are reconciled AND every doc code example runs AND no broken links AND every documented API signature matches source. Only then is the loop done.

## The six blocks in this loop
- **Automation/cadence:** on merge-to-main (hook) + weekly sweep via `/loop 7d /reconcile-docs`.
- **Worktrees:** `wt/docs` so doc edits never collide with feature branches.
- **Skill:** this `reconcile-docs` skill — the doc-page → code-module map, the rule that examples in `/docs` must be RUNNABLE, and the style guide.
- **Connectors (MCP):** GitHub (diff since last run), docs-site build, link-checker, Slack.
- **Sub-agents:** docs-maker (rewrites) + docs-checker (a DIFFERENT model that executes examples and diffs API vs source).
- **Memory:** `loops/D-docs-drift/state/docs-state.md` — last-reconciled SHA per page + deferred pages, so each run processes only the delta.

## Doc-page → code-module map (maintain this)
| Doc page | Code module(s) |
| --- | --- |
| docs/getting-started.md | src/cli/, src/index.* |
| docs/api/*.md | src/api/ (one page per public module) |
| docs/configuration.md | src/config/, flags & env parsing |

## Anti-rationalisation
| Excuse | Rebuttal |
| --- | --- |
| "The prose reads fine, ship it." | The checker must EXECUTE every code example and confirm the API signatures match source — readable prose is not a passing test. |
| "Nothing changed in docs/." | Drift comes from CODE changes; diff the CODE, not the docs. |
| "I'll just eyeball the examples." | Eyeballing is not execution. Run them; an example that doesn't run is a bug. |
| "The link was fine last week." | Run the link checker every time; links rot silently. |
| "Close enough to the old signature." | A changed signature is drift by definition; match source exactly or it's a FAIL. |
| "I'll reconcile everything from scratch." | Process only the delta since the per-page SHA; full rewrites are slow and untrustworthy. |
