# Brainstorm: Refactor Product Form Pages — Loose Coupling

**Date:** 2026-06-07

## Ideas Explored

- **Option A — Hook + 3 step components**: Single custom hook holds all state, each step is 1 file. Simple but hook stays large and reuse between create/edit is partial.
- **Option B — Hook + granular sub-components with local state**: MatrixBuilder, BulkApplyBar, VariantRow each own their own UI state → truly self-contained and reusable across both pages. Hook is lean. Chosen.
- **Option C — React Context**: Avoids prop drilling but adds boilerplate, doesn't help reuse across pages, overkill for this scale. Dismissed.

## User's Direction

All three goals simultaneously: shorter files, reusability between create and edit pages, logic separated from UI. Edit page is also 793 lines with the same stepper/variant pattern — refactor both at the same time.

## Architecture Decided

```
src/lib/sku.ts                           ← pure utils (viToSlug, generateSku)
src/types/product.ts                     ← ProductVariantDraft, BasicInfo types

src/components/admin/products/shared/    ← reused by BOTH create & edit
  MatrixBuilder.tsx                      ← local state, emits onGenerate(variants[])
  BulkApplyBar.tsx                       ← local state, emits onApply(field, value)
  VariantRow.tsx                         ← pure presentational
  VariantTable.tsx                       ← table header + rows

src/components/admin/products/create/   ← create-specific wiring
  BasicInfoStep.tsx
  VariantsStep.tsx
  ImagesStep.tsx
  ProductStepper.tsx

src/hooks/admin/
  useNewProduct.ts                       ← create page: step, variants[], images[], basicInfo, API calls
  useEditProduct.ts                      ← edit page: same shape, different API calls

app/[lang]/admin/products/new/page.tsx   ← ~40 lines
app/[lang]/admin/products/[id]/page.tsx  ← ~40 lines (also refactored)
```

## Key Design Decisions

- `MatrixBuilder` owns `selectedColors`, `selectedSizes`, `bulkPrice`, etc. as local state — parent never touches it
- `BulkApplyBar` owns its input values locally — emits on Apply click
- Each component calls `useTranslation()` directly — no prop-drilling of `pf`
- `ProductVariantDraft` type in shared `src/types/product.ts`
- Both hooks return the same interface shape → easy to swap

## Open Questions

- Edit page has `editingVariantId` / inline-edit mode — does `VariantRow` need an edit mode prop, or does edit page handle this separately?
- Should `ProductStepper` be truly shared (used by both pages) or just for create?

## Risks

1. Edit page has more complex variant state (inline editing) — VariantRow props may need to be more flexible than create's simple onChange
2. Scope creep: refactoring both pages at once is ~1600 lines total; need phased approach to avoid breaking changes
3. `useTranslation` hook is client-side async — components may flash empty strings on first render (already present, not new risk)
