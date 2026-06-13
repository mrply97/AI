---
name: demo-loop
description: Use to run a zero-dependency sandbox loop that proves the loop machinery works end to end. Triggers on "run the demo loop", "test the loop", "quick loop test", "demo loop", "make the sandbox tests pass". Fixes intentionally-broken code until `python -m unittest` passes — no GitHub/CI/MCP needed.
---

# Demo Loop — Zero-Dependency Sandbox

A self-contained loop for watching the machinery converge. It fixes the three
intentional bugs in `loops/E-demo-sandbox/sandbox/calc.py` until the tests pass.
**No connectors, no worktrees** — just the local filesystem and Python's stdlib
`unittest`. This is the irreducible core of a loop: automation + skill +
maker/checker + memory + a verifiable stop condition.

## Stop condition

`python -m unittest test_calc` (run inside `loops/E-demo-sandbox/sandbox/`) exits **0**.
That exit code is the whole backpressure signal — RED means keep going, GREEN means stop.

## Workflow

1. **Read memory** — open `loops/E-demo-sandbox/state/demo-state.md` to see prior runs and any already-known fixes.
2. **Get the RED signal** — dispatch the **demo-checker** sub-agent to run `python -m unittest test_calc -v` in the sandbox dir and report the failing tests + assertion messages. (If already GREEN, stop — nothing to do.)
3. **Fix** — dispatch the **demo-maker** sub-agent with the failure output. It edits ONLY `sandbox/calc.py` to fix the bugs (never the test file).
4. **Re-check** — dispatch **demo-checker** again. If GREEN → go to step 5. If still RED → return to step 3. Cap at **5 attempts**; if still RED after 5, stop and report what's stuck (do not thrash).
5. **Update memory** — append the run (date, result, attempts) and the fixed symbols to `demo-state.md`.

## The six blocks in this loop (and the two it drops on purpose)

- **Automation** — run once with `/demo-loop` (Claude) / `$demo-loop` (Codex), or on a cadence with `/loop 10m /demo-loop` to watch it idle GREEN then react after a `reset`.
- **Skill** — this file (the workflow + stop condition).
- **Sub-agents** — `demo-maker` (edits code) vs `demo-checker` (runs tests, no edit). The maker never grades its own work.
- **Memory** — `state/demo-state.md`.
- **Worktrees** — ➖ dropped: a single agent fixes one file, so there is no collision to isolate.
- **Connectors** — ➖ dropped: everything is local; this loop deliberately touches no external tool. (Real loops add connectors here — that is the only difference between this and Loop A/B/C/D.)

## Anti-rationalisation

| Excuse | Rebuttal |
|---|---|
| "I can see the bug, I'll just fix it without running the tests." | The RED→GREEN exit code IS the loop. Run the checker first and last, or you have no proof and no stop signal. |
| "I'll edit the test so it passes." | Never edit `test_calc.py`. The test is the spec; fix `calc.py`. |
| "It passed once, we're done forever." | Memory records the run; a `reset` re-breaks it. The loop must re-derive GREEN from the current RED, not from last time. |

## Reset (to run again)

`pwsh loops/E-demo-sandbox/reset.ps1` (Windows) or `bash loops/E-demo-sandbox/reset.sh` restores the broken state.
