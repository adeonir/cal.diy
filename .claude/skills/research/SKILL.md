---
name: research
description: 'First step of the research to plan to implement chain for cal.diy. Investigates the codebase before any code is written: finds where the behavior lives today, which files a change would touch, what constrains it, and what is still unknown, then writes the findings to plans/{feature}/research.md for the plan skill to consume. Use this whenever someone asks how something works here, where a feature lives, what it would take to change it, or hands over a task without saying how to build it, such as "how does booking rescheduling work", "onde fica a lógica de X", "what would it take to add Y", or "investigate before we build this". Use it before plan and before implement, because both read the file it produces.'
---

# Research

Find out how the thing already works before anyone decides what to change. The output is one file, `plans/{feature}/research.md`, written for the `plan` skill and for a person who was not in this session.

Write no application code in this phase. The moment you start editing source files you stop investigating and start committing to an approach that has not been chosen yet.

## Step 1 — Name the feature

Pick a kebab-case slug from the task: `booking-reschedule-window`, `event-type-qr-code`. The `plan` and `implement` skills reuse this slug, so it has to describe the change rather than the session.

Create `plans/{slug}/` and confirm the slug with the user before writing into it. A slug renamed later strands the other two files.

If `plans/{slug}/research.md` already exists, read it and extend it instead of overwriting. Say what you added.

## Step 2 — Frame the question

State in one or two sentences what the research has to answer. Everything you read is in service of that question; without it, investigation drifts into a tour of the repository.

## Step 3 — Investigate

Work from the general to the specific:

- **Entry points** — the route, the page, the tRPC procedure, the job. Where does a request touching this behavior arrive.
- **The path it takes** — which handler, which service, which repository, which Prisma model. Follow it, do not guess it.
- **Prior art** — code that already solves something close. Two or three files whose shape a change should copy. Note whether Biome is clean on them, because a stale neighbor is a trap for whoever implements.
- **Constraints** — schema shape, permissions in `PERMISSIONS.md`, feature flags, app-store boundaries, API v1 and v2 surfaces, i18n keys, embed and platform consumers.
- **Existing tests** — what covers this today and where those tests live.
- **What already exists** — check whether the repo, an app-store app, or a dependency already does part of this. Finding it after the plan is written wastes the plan.

Prefer Serena's symbol tools over grep when they are available: `find_symbol`, `find_referencing_symbols` and `get_symbols_overview` answer "who calls this" precisely, where a text search returns noise.

Cite what you found as `path/to/file.ts:123`. A finding without a location cannot be checked by the next reader.

## Step 4 — Write plans/{slug}/research.md

Use this structure:

```markdown
# Research: {feature}

## Question
What this research had to answer.

## How it works today
The current behavior and the path through the code, with file:line citations.

## Files a change would touch
| File | Why |
|---|---|

## Prior art
Files whose shape a change should copy, and why.

## Constraints
Schema, permissions, flags, API surfaces, i18n, consumers.

## Existing tests
What covers this today, and where.

## Options
Each viable approach, with its cost and what it rules out. Do not pick one; that is the plan skill's job.

## Open questions
What is still unknown, and who can answer it.
```

Keep `Options` honest. Listing one option and calling it a choice hands the plan a decision that was never made.

## Handing off

Report the slug and the path. Say what the research settled and what it left open, then say the next step is the `plan` skill, which reads this file.

Do not create the branch, and do not start implementing. The plan comes first.
