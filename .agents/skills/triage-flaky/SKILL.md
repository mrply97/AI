---
name: triage-flaky
description: Use when a test is intermittently failing or you need to triage/quarantine flaky tests. Triggers on "flaky test", "triage flaky", "quarantine flaky test", "test fails intermittently". Reproduces with a 50x rerun harness, classifies flaky vs real regression, and quarantines with a ticket.
---

# Triage Flaky Test — Autonomous Loop

Purpose: turn an intermittently-failing CI test into a confident verdict — quarantine-with-ticket or fix-PR — backed by a 50x reproduction harness, never re-triaging the same test twice.

## Workflow

1. **Read memory.** Open `loops/B-flaky-test-hunter/state/flaky-state.md`. If the suspect is already in `## Quarantined`, stop (do not re-triage). If it is in `## Watching`, note the prior failure-rate trend — a rising rate means the test is getting worse. _Checkpoint: you know whether this is new, watched, or already-quarantined._
2. **Pull the suspect + CI history.** Via the CI MCP connector, fetch the failing run, the test name, and the last N runs' pass/fail history and logs. Identify the exact test node id (e.g. `path::test_name`). _Checkpoint: you have a concrete test id and its recent pass/fail pattern._
3. **Spin a throwaway reproduction worktree.** Create an isolated worktree off the base branch — NEVER on anyone's feature branch. This is disposable; it exists only to run the harness. _Checkpoint: clean worktree at the suspect commit, nothing else touched._
4. **Dispatch flaky-maker.** In the repro worktree, the maker reruns the suspect test **50 times**, computes the failure rate (failures / 50), classifies flaky-vs-real-regression, and drafts either the `@flaky` quarantine tag or a fix. _Checkpoint: maker returns raw counts, the failure rate, a classification, and a draft action._
5. **Dispatch flaky-checker (ADVERSARIAL, different model).** The checker assumes the maker is wrong: it tries to prove the "flaky" label actually hides a real intermittent bug, independently re-checks the failure-rate stats, and returns an explicit CONFIRM/REJECT verdict with a confidence figure and evidence. _Checkpoint: verdict at >=95% confidence, or loop back to step 4 with more runs / a tighter hypothesis._
6. **Act on the verdict.**
   - **Flaky (confirmed):** commit the `@flaky` quarantine tag to the test via GitHub, open a Linear ticket on the "Flaky tests" board with the failure rate and harness output. QUARANTINE, do not delete, when below the regression threshold. _Checkpoint: tag committed AND ticket opened._
   - **Real regression:** open a fix PR; the stop condition requires it to be green. _Checkpoint: fix PR opened and CI green._
7. **Update memory.** Append to `flaky-state.md`: move the test to `## Quarantined` (date | test | failure rate | ticket) or update its `## Watching` trend. Post a one-line summary to Slack. _Checkpoint: state file reflects this triage so the test is never re-triaged blindly._

## Stop condition

Suspect classified at **>=95% confidence** AND either **quarantined-with-ticket** OR **fix-PR-opened-and-green**. The 50-run reproduction harness is the backpressure: a strong, machine-checkable signal that gates every verdict.

## The six blocks in this loop

- **Automation/cadence:** fires after each CI run (Codex Automation) or via a CI-failure hook + `/loop 1h /triage-flaky` draining the suspect queue.
- **Worktrees:** a throwaway repro worktree where the suspect is rerun 50x in isolation.
- **Skill:** this `triage-flaky` rerun-and-quarantine protocol.
- **Connectors (MCP):** CI API (history + logs), GitHub (commit the tag), Linear (raise the ticket), Slack (notify).
- **Sub-agents:** flaky-maker (reproduce + classify) and flaky-checker (adversarial verify, different model).
- **Memory:** Linear "Flaky tests" board + `flaky-state.md` — rates over time, already-quarantined tests, worsening detection.

## Anti-rationalisation

| Excuse | Rebuttal |
| --- | --- |
| "It failed once, just quarantine it." | Classification needs >=95% confidence from the 50x harness; one failure is not a rate. |
| "Tests pass now, so it's fine." | The checker must rule out a real intermittent bug mislabelled as flaky; passing now is not a verdict. |
| "We triaged something like this before, skip it." | Only skip if `flaky-state.md` shows THIS exact test already quarantined; otherwise run the harness — and check if its rate is rising. |
