---
name: parallel-sandbox
description: Use to run the parallel-worktree demo loop — multiple makers fix different modules concurrently, each in its own git worktree, then an integrator merges and runs the full suite. Triggers on "parallel loop test", "run the parallel sandbox", "worktree loop demo", "parallel worktree loop". Zero external dependencies; demonstrates worktrees as a load-bearing block.
---

# Parallel Sandbox — Worktree Loop

The sibling of `demo-loop`, but **parallel**: it fixes three independent modules
(`calc.py`, `strings.py`, `dates.py`) at the same time, each in its **own git
worktree on its own branch**, then merges and runs the full suite. This is where
**worktrees become load-bearing** — three makers edit code concurrently, and
worktrees are what stop them colliding. Still **no connectors** (fully local).

The partition is **one module per worktree** on purpose: the branches touch
disjoint files, so the merge is conflict-free. (Splitting one shared file across
worktrees would trade collision-during-work for conflict-at-merge — don't.)

## Stop condition

After merging all branches, the **full** suite passes:
`python -m unittest discover -p "test_*.py"` (run in `loops/E2-parallel-sandbox/sandbox/`) exits **0**.
Each worktree also has a local gate: its own module test must pass before its branch is eligible to merge.

## Workflow

1. **Read memory** — `loops/E2-parallel-sandbox/state/parallel-state.md` (the module→branch map and prior runs).
2. **Fan out (one worktree per module)** — for `calc`, `strings`, `dates`, create an isolated checkout and dispatch **parallel-module-maker** into each *concurrently* (in Claude Code use `isolation: worktree` sub-agents or `git worktree add -b fix/<module> <path>`; in Codex use background worktrees). Each maker is scoped to ONE module and runs only `python -m unittest test_<module>` as its local gate.
3. **Integrate** — dispatch **parallel-integrator** to merge `fix/calc`, `fix/strings`, `fix/dates` back (expect zero conflicts — disjoint files) and run the FULL suite as the gate.
4. **Converge** — if the full suite is GREEN → clean up the worktrees (`git worktree remove`), update `parallel-state.md`, done. If a module is RED → re-dispatch only that module's maker. Cap at **3 rounds**; otherwise stop and report what's stuck.

## The six blocks in this loop

- **Automation** — `/parallel-sandbox` / `$parallel-sandbox`, or `/loop 15m /parallel-sandbox`.
- **Worktrees** — ✅ **load-bearing here**: one per module so three concurrent makers don't collide. (This is the block `demo-loop` drops; E2 adds it because it is parallel.)
- **Skill** — this file.
- **Sub-agents** — three `parallel-module-maker` instances (one per worktree) + one `parallel-integrator` (merges + full-suite gate, no edit tool).
- **Memory** — `state/parallel-state.md`.
- **Connectors** — ➖ dropped: fully local, no external tool.

## Prove the plumbing without an agent

`python loops/E2-parallel-sandbox/verify_pipeline.py` runs the whole worktree→fix→merge→full-suite dance deterministically in a throwaway repo (it never touches your tree) and asserts convergence. Use it to confirm the mechanism before trusting the agent loop.

## Anti-rationalisation

| Excuse | Rebuttal |
|---|---|
| "Just fix all three in one checkout — simpler." | Then you're not testing worktrees, and you lose the parallel-isolation property the loop exists to demonstrate. |
| "Split the three bugs across worktrees even if they're in one file." | Disjoint files merge clean; shared-file splits create merge conflicts. Partition along the merge boundary (one module per worktree). |
| "A module passed its own test, we're done." | The local test is a pre-merge gate; the real stop condition is the FULL suite after integration. |

## Reset (to run again)

`pwsh loops/E2-parallel-sandbox/reset.ps1` (Windows) or `bash loops/E2-parallel-sandbox/reset.sh`.
