---
name: plan
description: 'Second step of the research to plan to implement chain for cal.diy. Turns the findings in plans/{feature}/research.md into a decided approach and an ordered list of steps, written to plans/{feature}/plan.md for the implement skill to execute. Use this whenever a change has been investigated but not decided, or when someone asks how to approach a change, which option to take, what the steps are, or how to split work, such as "how should we build this", "qual a melhor abordagem", "plan the migration", or "break this into steps". Use it after research and before implement, because it reads the first file and produces the one implement follows.'
---

# Plan

Choose the approach and write down the steps, so that implementing becomes execution rather than a second round of decisions. The output is one file, `plans/{feature}/plan.md`.

Write no application code in this phase. A plan defended by code already written is not a plan, it is a justification.

## Step 1 — Read the research

Read `plans/{slug}/research.md` in full. It carries the file map, the constraints, the prior art and the options this plan has to choose between.

If the file does not exist, stop and say so, then run the `research` skill first. Planning without it means inventing a file map from memory, and a plan built on a wrong map sends the implementation into the wrong files.

If it exists but its `Open questions` section is not empty, resolve those questions before choosing. Ask the user the ones only they can answer, one question per sentence, and investigate the rest yourself. Record every answer in the plan; an unresolved question becomes a decision made silently during implementation.

## Step 2 — Choose the approach

Take the options the research listed and pick one. Say what the choice costs and what it rules out — a plan that presents its choice as free hides the tradeoff from the reviewer.

Where the choice is between real alternatives with lasting consequences, write it as a decision record inside the plan: context, options, decision, consequences.

## Step 3 — Size the work

Estimate against the repository's own limit: a pull request stays under 500 changed lines and under 10 code files, covering one concern.

If the change fits, plan one pull request. If it does not, split it and order the parts by dependency: schema and migration first, then data access and business logic, then the interface. Say which part the next implementation run delivers. A plan that ignores the split produces a change nobody can review.

## Step 4 — Write the steps

Each step names what changes and how you know it worked. Order them so that each one leaves the code in a working state — a failure then points at the step you just did, instead of at everything at once.

Decide the tests here, not during implementation: unit, end to end, or a manual check for a change too small to be worth a test. Say which, and say what the test proves.

## Step 5 — Write plans/{slug}/plan.md

Use this structure:

```markdown
# Plan: {feature}

## Approach
The chosen option in two or three sentences, and what it costs.

## Decisions
### {decision title}
Context, options, decision, consequences. One block per real choice.

## Scope
In scope, and explicitly out of scope.

## Steps
| # | Change | Done when |
|---|---|---|

## Tests
What is tested, at which level, and what each test proves.

## Acceptance check
What a person does to see the change work, and what they should see.

## Pull requests
One row per pull request when the work is split, in dependency order.

## Risks
What could go wrong, and what would catch it.
```

Show the plan to the user and get their approval before handing it to `implement`. A plan is cheap to change and expensive to undo once it is code.

## Handing off

Report the path and the number of steps. Say what the plan decided and what it deliberately left out, then say the next step is the `implement` skill, which reads this file.

Do not create the branch. The `implement` skill owns that, because it owns the commit.
