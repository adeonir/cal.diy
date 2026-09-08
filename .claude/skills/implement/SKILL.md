---
name: implement
description: 'Third step of the research to plan to implement chain for cal.diy. Executes the steps in plans/{feature}/plan.md, running the lint, type-check and test gates, and ends at a commit on a feature branch, recording progress in plans/{feature}/implementation.md. Use this whenever an approach is already decided and the work is to build it, such as "implement the plan", "vamos codar isso", "execute step 3", "build what we planned", or when someone picks up work a previous session left unfinished. Use it after plan, because it reads the file plan produces.'
---

# Implement

Execute a plan that has already been decided, and stop at a commit. Progress is recorded in `plans/{feature}/implementation.md`, so that a session that ends halfway can be picked up by the next one.

Opening the pull request is not part of this skill.

## Step 1 — Read the plan

Read `plans/{slug}/plan.md` in full, and `plans/{slug}/implementation.md` if it exists — that file says which steps already landed, so you continue rather than redo.

If `plan.md` does not exist, stop and say so, then run the `plan` skill first. Implementing without it means deciding the approach while writing it, which is the thing the chain exists to prevent.

Bring the plan's own concerns forward: the steps in order, the tests it decided on, the acceptance check, and the pull request split when the work has one. Deliver only the part the plan assigned to this run.

## Step 2 — Create the branch

Branch before the first edit, from a `main` that matches the remote:

```bash
git checkout main && git pull origin main
git log --oneline origin/main..main
git checkout -b <type>/<slug>
```

The middle command has to print nothing. `git pull` reporting "up to date" only means there was nothing to fetch; it says nothing about local commits sitting on top of the remote. Branch off a `main` that is ahead and every one of those commits rides along into the pull request, because the pull request compares against `origin/main` rather than your local branch. If it prints anything, stop and ask what to do with those commits first.

Use the commit types for the prefix: `feat/`, `fix/`, `refactor/`, `chore/`, `docs/`, `test/`.

## Step 3 — Work the steps in order

Take one step from the plan at a time, in the order the plan set. Keep the code working at the end of each one.

While implementing:

- Match the shape of the prior art the research found: imports, where types live, error handling, test placement.
- When the neighbouring code and the linter disagree, the linter wins. Files predate rule changes, so a stale neighbour hands you a shape that fails the gate you still have to pass. Run Biome on the file you are imitating before treating it as the convention.
- Add comments only for a magic number, non-obvious business logic, or a function whose name does not explain it.
- Write the tests the plan decided on, next to the existing tests for that package.
- Stay inside the plan's scope. Note an adjacent problem in the summary and leave it alone; fixing it here buries it in a diff nobody expected it in.
- Update `implementation.md` as each step lands, not at the end. That file is the only thing a later session has.

When the code contradicts the plan — the file map was wrong, a constraint was missed — stop and say so rather than quietly improvising. Record what changed in `implementation.md`, and go back to the `plan` skill if the approach itself no longer holds.

## Step 4 — Run the gates

```bash
yarn lint
yarn type-check
yarn test
```

Scope each command to the packages you touched when the repository-wide run is too slow, but never skip a gate.

A gate can be red before you touch anything, and on a repository this size `yarn type-check` usually is. A red gate is not evidence on its own; what matters is whether your change made it worse. When a gate fails, get the baseline:

```bash
git stash --include-untracked        # or commit on the branch first
git checkout main
<the same gate command> > baseline.txt 2>&1
git checkout -
git stash pop                        # only if you stashed
<the same gate command> > branch.txt 2>&1
diff baseline.txt branch.txt
```

Committing on the branch first is the safer of the two, because a forgotten `git stash pop` leaves the work you are measuring out of the branch you are measuring. If you do stash, pop before running the second command, or you will compare `main` against `main`.

Compare the outputs, not the error counts. Line numbers shifting by exactly the number of lines you added is your change moving existing errors, not causing them. Fix everything the diff attributes to you, and for the rest say in the summary that the gate is red on `main` too, with the comparison that shows it.

Then run the plan's acceptance check by hand. A green suite proves the code does what the tests say, not what the plan asked for.

## Step 5 — Commit

Stage the source changes together with `plans/{slug}/`, so that the reasoning arrives in the same history as the code.

Commit with conventional commits: `type(scope): subject`, imperative and lower case. Keep the subject alone unless a reader holding the diff would still act wrongly without more — then add one sentence naming the problem the changed lines do not show, or the constraint that bound the solution. Never add tool attribution or co-author trailers.

Write the message from the diff. Any claim you cannot trace to a hunk comes out.

## Step 6 — Update implementation.md and report

Use this structure:

```markdown
# Implementation: {feature}

## Status
not-started | in-progress | done

## Completed
- [x] Step 1 — what landed, and the commit

## In progress
The step being worked on.

## Next steps
What the following session picks up.

## Deviations from the plan
Where the code and the plan parted ways, and why.

## Session notes
### {date}
Done, and next.
```

Report the branch, the commit, what the gates said, and what is left. Say that the pull request is the next move and has not been made.
