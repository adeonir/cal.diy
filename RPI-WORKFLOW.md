# Research, Plan, Implement Workflow

Three chained skills that carry a change from "I don't know how this works" to a commit on a branch. Each one writes a file, and the next one reads it.

```text
research  →  plans/{feature}/research.md
plan      →  plans/{feature}/plan.md
implement →  plans/{feature}/implementation.md  +  a commit
```

The chain is **opt-in**. Ask for a step by name ("research how rescheduling works", "plan this", "implement the plan"), or ask for the whole thing and it runs in order.

## When to use it

Use it when a change needs investigating before it can be decided, and deciding before it can be built. That covers most work that is not a one-line fix.

Skip it for a typo, a copy change, or anything where the approach is obvious and the file is already known. Running three phases on a two-line change costs more than the change.

This is not the same thing as `SPEC-WORKFLOW.md`. That workflow documents a feature under design in `specs/`, with a design document that outlives the work. This one is a working chain for a single change, and its artifacts describe one piece of work from investigation to commit. A large feature can use both: the spec for what is being built, the chain for each piece of it.

## The artifacts

Everything for one change lives in `plans/{feature}/`, where `{feature}` is a kebab-case slug describing the change, not the session. The `research` skill picks the slug; the other two reuse it.

| File | Written by | Carries |
|---|---|---|
| `research.md` | `research` | How it works today, the files a change touches, prior art, constraints, existing tests, the options, and what is still open |
| `plan.md` | `plan` | The chosen approach and what it costs, the decisions, the ordered steps, the tests, the acceptance check, the pull request split |
| `implementation.md` | `implement` | Status, what landed, what is next, where the code and the plan parted ways |

They are committed with the code, so the reasoning behind a change arrives in the same history as the change.

Keep them at `plans/` in the repository root. `.gitignore` excludes `.claude/plans/`, so the same files placed there are never committed and disappear the moment the reasoning is needed.

The templates for these files live in the skills themselves, at `.claude/skills/{research,plan,implement}/SKILL.md`. Those files are the source of truth; this document describes the flow, not the format.

## What each step will not do

The boundaries are the point of splitting the work into three.

- `research` writes no application code. Editing source while investigating commits you to an approach nobody chose.
- `plan` writes no application code. A plan defended by code already written is a justification.
- `implement` opens no pull request. It stops at a commit on a branch.

## Picking up unfinished work

`implementation.md` is what a later session reads to continue. It says which steps landed and which is next, which is why `implement` updates it as each step lands rather than at the end.

Point a new session at `plans/{feature}/` and it can carry on without the conversation that produced it.

## When the plan turns out to be wrong

The code sometimes contradicts the plan: the file map was off, a constraint was missed. `implement` stops and says so instead of improvising, records the deviation in `implementation.md`, and goes back to `plan` when the approach itself no longer holds.

A deviation recorded is a plan that stays useful. A deviation absorbed silently makes every later reader trust a document that no longer describes the code.
