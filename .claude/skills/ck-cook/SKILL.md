---
name: ck:cook
description: Implement a planned feature phase by phase. Use when the user says "cook this", "implement it", "let's build", "start coding", or passes a plan.md path. Spec-aware — auto-loads spec.md alongside plan for SDD+TDD. Modes (pick one): --fast (skip test/review), --hard (mandatory human approval). Composable flags (combine with any mode): --no-test (skip tester), --tdd (write failing tests before implementing).
user-invocable: true
---

# ck:cook — Structured Implementation Pipeline

Modes — mutually exclusive, pick one (default = Standard):
- **Standard** — test + review, auto-approve if score ≥ 9.5 with 0 CRITICAL
- **`--fast`** — skip tester and code-reviewer; git-manager only in Step 5
- **`--hard`** — mandatory test + mandatory review, no auto-approve

Composable flags — combine with any mode:
- **`--no-test`** — skip tester; go directly to Step 3.S → Step 4
- **`--tdd`** — write failing tests first, then implement until they pass

---

### Step 0 — Plan Check

When no plan path provided:
1. Search `plans/` for any `plan.md` → ask: "Found `{path}`. Use this? [Y/n]"
2. If none found → ask: "No plan found. Continue anyway? [y/N]" — if No, suggest `/ck:plan`

After resolving plan path: check for `spec.md` in the same directory. If found, load it — activates **spec-driven mode** for Steps 1 and 2.

---

### Step 1 — Load Plan / Detect Mode

Report what will be cooked:

```
Plan: {Feature Name}
Status: {status from plan.md}
Mode: {Standard | Fast | Hard}
Test:  {default | --no-test | --tdd}
Spec:  {plans/{slug}/spec.md — N P1 stories, N success criteria | none}
Phases remaining:
  [ ] Phase 1: ...
  [ ] Phase 2: ...
```

If spec loaded + `--tdd` not set:
`Spec detected. Consider --tdd: acceptance criteria in spec.md are ready-made test anchors.`

If `## Session Notes` exists in plan.md: output resume state and continue from where it left off.

When no plan file provided: read the feature request, ask 2–3 clarifying questions, proceed once clear.

---

### Step 2 — Implement

For each `phase-XX-*.md` in order:

1. Read phase file — understand requirements, architecture, steps, success criteria
2. Implement following codebase conventions
3. Verify success criteria for the phase
4. **If spec loaded**: `P1 coverage: {N}/{total} stories addressed this phase`
5. Write (overwrite) `## Session Notes` in plan.md, then mark phase complete `- [x] Phase N: {name}`
6. Report what was done

**Session Notes template** (overwrite, never append):

```markdown
## Session Notes
<!-- Updated by cook automatically — do not edit manually -->

**Last active:** {YYYY-MM-DD HH:MM}
**Phase in progress:** {phase-XX-name}
**Status:** {one-line status}

### Decisions made this session
{bullet list of non-obvious decisions, or "(none)"}

### Next immediate action
{what cook will do next}
```

**Review Gate** — after each phase:
- **Standard / `--hard`**: pause and wait for user approval
- **`--fast`**: continue automatically

Stop if: success criterion unverifiable, unexpected blocker, or phase needs user decisions not in the plan.

---

### Step 3 — Test (tester sub-agent)

**`--fast`** / **`--no-test`**: skip → Step 3.S.

**[Build Gate]**: verify compilation before tests. On failure: `[GATE FAIL] Build gate: compilation errors — fix before testing.`

**Default**: spawn **`tester`** → writes tests, runs full suite (100% pass required) → on failure: spawn **`debugger`** → fix → re-test.

**Remediation cycles**: each of cycles 1–3 must use a different approach than previous. Cycle 4: STOP.

```
[ESCALATION] Test remediation exhausted
File:    {path/to/failing_test}
Error:   {exact error message}
Cycles:  {approach 1} | {approach 2} | {approach 3}
Action:  Awaiting user guidance
```

**`--tdd`**: invert per phase:
1. `tester` writes failing tests (red) — from `### Tests to Write First` or spec acceptance criteria
2. Confirm red before implementing
3. Implement until green, full suite passes

---

### Step 3.S — Auto-Simplify

Check if `SIMPLIFY_TRIGGERED` in context (emitted by `code-simplifier` hook).

If triggered: invoke `simplify` skill on files edited this phase → delete simplify tracker → proceed to Step 4.
If not triggered: skip silently.

Thresholds (`.ck.json` → `simplify.threshold`): `totalLoc` 400, `fileCount` 8, `singleFileLoc` 200.

---

### Step 4 — Code Review

**`--fast`**: skip → Step 5.

**[Test Gate]**: all tests must pass (or `--no-test` set).

Spawn **`code-reviewer`**: correctness, security, regressions, quality → APPROVED / WARNING / BLOCK.
- **Standard**: auto-approve if score ≥ 9.5 with 0 CRITICAL
- **`--hard`**: no auto-approve — human must approve before Step 5
- Fix/re-review up to 3 cycles (different approach each), then escalate

---

### Step 5 — Finalize (MANDATORY)

**[Approval Gate]**: code-reviewer APPROVED required (or `--fast` bypass).

**`project-manager`** (skip `--fast`): mark phases `[x]`, update plan status.

**`docs-manager`** (skip `--fast`): update docs, README, API contracts.

**If spec loaded**: output before git-manager:
```
# Spec Coverage
P1 stories:        {N}/{total} covered
Success criteria:  {N}/{total} verifiable
Uncovered P1:      {list any, or "none"}
```

**`git-manager`** (always): conventional commits → ask to push.

---

## Agents

| Agent / Skill     | Step | Modes |
|-------------------|------|-------|
| `tester`          | 3    | Standard, `--hard` (skip for `--fast`, `--no-test`) |
| `debugger`        | 3    | When tests fail |
| `simplify` skill  | 3.S  | All (hook-driven) |
| `code-reviewer`   | 4    | Standard, `--hard` (skip for `--fast`) |
| `project-manager` | 5    | Standard, `--hard` (skip for `--fast`) |
| `docs-manager`    | 5    | Standard, `--hard` (skip for `--fast`) |
| `git-manager`     | 5    | Always (mandatory) |
