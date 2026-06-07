---
name: ck:plan
description: Plan a feature or system before implementation. Use when the user says "plan this", "I want to build X", "how do I implement Y", or when /ck:brainstorm produces a spec.md. Always run before /ck:cook. Modes (pick one): --fast (simple, single-file), --hard (research + red-team + validate). Composable flags (combine with any mode): --no-test, --tdd — propagate into the cook pipeline.
user-invocable: true
---

# ck:plan — Structured Planning Pipeline

---

### Step 0 — Scope Challenge

Before spawning any agents, detect mode and challenge scope:

```
# Scope Challenge:
#   Exists?     → [does this feature already exist in the codebase?]
#   Minimum?    → [smallest impl that satisfies requirements]
#   Complexity? → [Fast | Hard] — reasons: multi-file? unfamiliar? security?
#
# Mode: [Fast | Hard]
# Test:  [default | --no-test | --tdd]
```

Mode auto-detection (override with explicit flag):
- **Fast** — single-file change, familiar pattern, ≤ 2 components
- **Hard** — multi-file, unfamiliar domain, security-sensitive, or ≥ 3 phases

If scope is too large: suggest splitting and **wait for user confirmation**.

If **Hard** and novel/ambiguous with no brainstorm report: "No brainstorm found. Run `/ck:brainstorm` first? [Y/n]" — if Yes, stop; if No, proceed.

If a spec file path is provided or `plans/{slug}/spec.md` exists adjacent to any plan: run a **Spec Quality Check** inline:

```
# Spec Quality Check:
#   [NEEDS CLARIFICATION] remaining? → CRITICAL — resolve before continuing
#   Success criteria measurable?     → HIGH if vague adjectives (fast, scalable, reliable)
#   User stories P1/P2/P3?           → HIGH if missing
#   Acceptance criteria testable?    → MEDIUM if vague ("works correctly")
#
# Verdict: [PASS | WARN (list) | BLOCK (list)]
```

- **BLOCK**: surface findings, resolve before proceeding
- **WARN**: list findings, user acknowledges — then proceed
- **PASS**: continue normally

---

### Step 1 — Research (Hard only)

Spawn **2 `researcher` agents in parallel**:
- **Instance A** — role: `Primary` — recommended approach and best practices
- **Instance B** — role: `Alternative` — alternative approach and tradeoffs

```
// Researcher A (Primary): [approach] → [verdict]
// Researcher B (Alternative): [approach] → [verdict]
```

---

### Step 1.5 — Architecture Gate (runs before planner)

Before spawning the planner, validate the proposed approach against the project's Clean Architecture rules. Output this block:

```
# Architecture Gate:
#   Layer mapping:
#     domain/     → [RefCounted classes only — no Node, no autoload imports]
#     services/   → [mock + real API — imports domain only]
#     autoloads/  → [Singleton managers — imports domain + services]
#     scenes/     → [Nodes/Controls — imports autoloads + domain]
#
#   Dependency arrows: scenes → autoloads → services → domain; domain imports nothing above it.
#   Violations? → [list any file that crosses a boundary, or "none"]
#
#   Anti-pattern flags:
#     extends Node in domain/ files?                     → [YES/NO]
#     get_tree() / $child / get_node() in domain/?       → [YES/NO]
#     print() in any file?                               → [YES/NO]
#     Direct Manager→View call (not via signal)?         → [YES/NO]
#     yield (deprecated)?                                → [YES/NO]
#     Autoload imported from domain/ or services/?       → [YES/NO]
#
#   Verdict: [PASS | BLOCK (list violations)]
```

**BLOCK rules:**
- `extends Node` (or any Node subclass) in `domain/` → BLOCK; use `extends RefCounted`.
- `get_tree()`, `$child`, or `get_node()` inside `domain/` → BLOCK; domain must be pure data.
- `print()` anywhere → BLOCK; use `push_warning()` or `push_error()`.
- Manager calling a View method directly → BLOCK; emit a signal instead.
- `yield` keyword → BLOCK; use `await`.

**Phase slice order** — phases must flow: `domain → services → autoloads → scenes`. Flag and split any phase that mixes multiple layers unless the change is trivially small (≤ 5 lines across layers).

On PASS (or after BLOCK is resolved): proceed to Step 2.

---

### Step 2 — Plan Creation

Spawn the **`planner` agent** with: feature description + mode + research reports + test flag + spec file path (if any) + **Architecture Gate output**.

- **`--tdd`**: planner adds `### Tests to Write First` to each phase, derived from spec acceptance criteria
- **`--no-test`**: planner notes `testing: skipped` in each phase header
- **Spec provided**: planner maps each phase to the P1/P2/P3 stories it covers
- **Each phase file must include** a `## Layer` line listing which Clean Architecture layer(s) it touches, and a `## Files` table with each file's layer label.

Agent writes:
```
plans/{slug}/
  plan.md
  phase-01-{name}.md
  phase-02-{name}.md
  ...
```

---

### Step 3 — Red-Team Review (Hard only)

Spawn **`plan-reviewer`** with paths to all plan files (+ spec.md if present).

Adjudicate each finding:
- `ACCEPTED` → edit the relevant plan file immediately
- `NOTED` → append to Risks section of plan.md
- `REJECTED` → document reason

If `plan-reviewer` returns `BLOCK`: revise the flagged phase and re-run before proceeding.

---

### Step 4 — Validation + Handoff

Ask 3–5 targeted questions about the plan's riskiest points. **Wait for user answers.**

Hydrate tasks via TodoWrite, then recommend `--tdd` if spec.md exists and it's not already set.

Output the exact cook command:

```
Ready to cook:
/ck:cook [--fast | --hard] [--no-test | --tdd] plans/{slug}/plan.md
```

---

---

### Step 5 — Godot Editor Guide (if applicable)

After `/ck:cook` completes: if the feature requires any **Godot Editor configuration** (creating nodes, assigning resources, painting tiles, setting Inspector fields, wiring signals), create:

```
docs/{slug}/godot_implement.md
```

**Write entirely in Vietnamese.** Target audience: người mới dùng Godot, chưa quen với Editor workflow. Use numbered steps with exact menu paths and field names.

Include these sections (adapt to what was actually implemented):

**1. Mở Scene và kiểm tra cấu trúc Node**
- Scene nào cần mở (đường dẫn `res://...`)
- Scene tree trông như thế nào — liệt kê từng node và vai trò của nó

**2. Gán Script và Resource**
- Node nào cần gán script (drag từ FileSystem hoặc click biểu tượng script)
- Resource nào cần tạo hoặc gán (TileSet, SpriteFrames, Material, ...) — chỉ rõ cách tạo qua menu `Inspector > [empty] > New ...`

**3. Cài đặt Inspector**
- Từng trường `@export` hoặc property cần set — tên chính xác, giá trị đúng, lý do

**4. Wiring Signals (nếu có)**
- Node phát signal → Node nhận signal
- Cách kết nối: tab Node → Signals → Connect, hoặc qua code (ghi rõ nếu đã wire qua code)

**5. Thiết lập TileSet / TileMapLayer (nếu có)**
- Tạo TileSet mới: chọn TileMapLayer → Inspector → TileSet → New TileSet
- Thêm atlas source: chọn texture PNG → đặt tile size
- Thêm Physics Layer: Project Settings → ... (nếu cần collision)
- Vẽ tiles: tab TileMap ở bottom panel → chọn tile → paint lên viewport

**6. Smoke Test Checklist**
- Danh sách checkbox kiểm tra nhanh sau khi setup xong (chạy scene, thử từng tính năng chính)

**7. Lỗi thường gặp**
- Bảng: Triệu chứng | Nguyên nhân | Cách fix — tập trung vào lỗi phổ biến với người mới

**Skip Step 5** if the feature touches only `domain/` or `services/` with zero Editor interaction (e.g., pure RefCounted entity, mock service).

---

## Agents

| Agent           | Step | Modes |
|-----------------|------|-------|
| `researcher`    | 1    | Hard (×2 parallel) |
| `planner`       | 2    | All |
| `plan-reviewer` | 3    | Hard |
