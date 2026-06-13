---
name: draft-postmortem
description: Use after an incident/outage to draft a blameless postmortem with a verified root-cause hypothesis. Triggers on "draft a postmortem", "incident writeup", "root cause analysis", "RCA", "what caused the outage". Investigates read-only, red-teams the cause, and requires human sign-off before publishing.
---
# Draft Postmortem — Human-Gated Loop

Turn an incident alert into a blameless postmortem draft with a root-cause hypothesis that has survived adversarial red-teaming — then STOP and wait for a human to sign off before anything is published.

## This loop requires human sign-off
> **Causal claims are not machine-verifiable.** "This deploy caused the outage" is not a unit test — a green build cannot prove a cause, and a hypothesis that *fits* the logs is not a hypothesis that has been *proven*. This loop therefore drafts a postmortem and red-teams the cause, but it **NEVER publishes on its own**. A human MUST review and approve the draft before it is published. This is the honest design for a loop whose backpressure is soft: when the machine cannot close the loop, a human gate does.

## Workflow
1. **Load memory — recurring causes.** Read `loops/C-incident-postmortem/state/incidents-state.md`. Note any cause that has recurred (e.g. "3rd time this quarter: connection-pool exhaustion") — a recurring pattern is a strong prior for the new incident. *Checkpoint: list any prior incidents with a related signature.*
2. **Identify the deployed-at-incident SHA.** From the alert/incident tool + GitHub recent-deploys, determine the commit SHA that was *deployed and running when the incident began* (git-bisect territory). *Checkpoint: record the SHA, the deploy time, and the incident start time.*
3. **Open a READ-ONLY investigation worktree.** Check out that SHA into an investigation worktree. Analysis must not mutate anything — no edits to source, no fixes, no commits. *Checkpoint: confirm the worktree is at the incident SHA and is read-only.*
4. **Dispatch incident-investigator (maker).** Have it correlate logs, deploys, and metrics; build a precise timeline; and draft a root-cause hypothesis + a blameless postmortem. *Checkpoint: a timeline with timestamps + a stated root-cause hypothesis with the evidence behind it.*
5. **Dispatch incident-redteam (checker, DIFFERENT model).** Have it attack the hypothesis: hunt the logs for evidence that CONTRADICTS the stated cause, and propose at least one plausible alternative cause. *Checkpoint: a verdict — "contradicted" or "not contradicted" — with evidence.*
6. **Loop back or mark ready.** If the redteam found contradicting evidence, return to step 4 to revise the hypothesis with the new evidence. If the redteam can find NO contradicting evidence, mark the draft **"ready for human review"**. *Checkpoint: the verdict that gated this decision.*
7. **Post the draft and STOP for sign-off.** Write the draft to Google Docs and post it to the incident Slack channel, explicitly flagged as a DRAFT awaiting human approval. **Do not publish. Stop here.** *Checkpoint: the Docs link + Slack message, and an explicit "awaiting human sign-off" state.*
8. **On human approval, record memory.** Only after a human approves, record the incident → cause mapping in `incidents-state.md` (and update the recurring-cause count if it matches a prior). *Checkpoint: the row written to the state file.*

## Stop condition
**SOFT + human-gated.** Stop when (a) the redteam can find NO contradicting evidence in the logs for the root-cause hypothesis, AND (b) a HUMAN signs off on the draft before publish. Condition (a) alone is never sufficient — causal claims are not unit-testable, so the human gate in (b) is mandatory and this loop must NEVER auto-publish.

## The six blocks in this loop
- **Automation/cadence** — ALERT-triggered, not a clock. Codex: an Automation invoked by the incident hook. Claude Code: a lifecycle hook on the incident webhook that spawns the loop. There is no fixed interval.
- **Worktrees** — a READ-ONLY investigation worktree at the SHA deployed when the incident began (git-bisect territory); analysis can't mutate anything.
- **Skill** — this `draft-postmortem` skill: the postmortem template, blameless-writing rules, the trace-pulling routine, and the timeline-construction steps.
- **Connectors (MCP)** — observability/logs (Datadog/Grafana), GitHub (recent deploys, `git blame`, bisect), PagerDuty/incident tool, Google Docs (write the draft), Slack (post to the incident channel).
- **Sub-agents** — `incident-investigator` (maker) correlates logs + deploys + metrics, builds the timeline, drafts the root-cause hypothesis + postmortem; `incident-redteam` (checker, DIFFERENT model) red-teams the causal claim — what evidence CONTRADICTS this cause, what is a plausible alternative.
- **Memory** — the postmortem doc + `loops/C-incident-postmortem/state/incidents-state.md` linking incidents → causes, so recurring causes surface.

## Anti-rationalisation
| Excuse | Rebuttal |
| --- | --- |
| "The hypothesis fits the logs, just publish it." | A fit is not a proof. The redteam must FAIL to contradict the cause AND a human must sign off — fitting the observed logs is necessary, not sufficient. |
| "Tests would catch a wrong cause, so we can auto-publish." | Causation is not unit-testable — there is no green build for "X caused the outage". That is precisely why this loop is human-gated and never auto-publishes. |
| "The redteam found no contradiction, so we're done." | Not contradicted ≠ approved. No-contradiction only makes the draft *ready for human review*; the human gate is still mandatory before publish. |
| "It's clearly the deploy that did it — skip the redteam." | The most obvious deploy is the easiest false positive. Skipping the adversarial check is how a wrong, blame-shaped cause gets published. |
| "Let me just note who broke it." | Postmortems are blameless: name the contributing change and the systemic gap, never the person. |
