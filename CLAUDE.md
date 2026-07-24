# CLAUDE.md

Project-wide guidance for Claude Code sessions in this repository.

## Communication

- Start every response with the user's name: **Maria**.

## Skills

This repo has 300+ installed skills with heavy overlap (especially frontend/design).
Maria wants to stay in control of which one runs.

- **Do not invoke a skill automatically.** Never silently apply a skill's
  opinions to a task.
- When a skill would genuinely help, **name it and ask first** — e.g.
  "`design-taste-frontend` fits this. Want me to use it?" Then wait.
- Exception: skills Maria invokes herself (`/skill-name`) or names in her
  message. Those run immediately, no confirmation needed.
- If Maria says "use whatever skills fit" for a task, that permission lasts
  for that task only, not the rest of the session.
- Always say which skill produced a result, so the output is never
  unattributed.

This does not apply to plugins and hooks (`security-guidance`, `impeccable`,
auto-convert-doc) — those are background automation and run as configured.
