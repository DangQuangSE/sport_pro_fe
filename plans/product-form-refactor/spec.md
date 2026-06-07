# Spec: Product Form Refactor — Loose Coupling

## Problem Statement

`new/page.tsx` (820 lines) and `[id]/page.tsx` (793 lines) each mix utilities, state, business logic, and JSX in a single file. Hard to navigate, impossible to reuse, and logic is untestable in isolation.

## Goals

1. Each file ≤ 150 lines
2. `MatrixBuilder`, `BulkApplyBar`, `VariantRow`, `VariantTable` reusable in both create and edit pages
3. Business logic (API calls, state transitions) lives in hooks — zero API calls in component files

## Success Criteria

- `page.tsx` (both create and edit) ≤ 50 lines
- `MatrixBuilder.tsx` ≤ 120 lines, zero imports from page-level state
- No existing functionality broken (create flow, edit flow, SKU gen, bulk apply, status toggle)
- Both pages pass TypeScript build with zero new errors

---

## User Stories

### P1 — Must have

**US-01**: As a dev, I can open `new/page.tsx` and immediately see the full create flow in ~40 lines without scrolling through 800 lines of JSX.

**US-02**: As a dev, I can add `<MatrixBuilder />` to the edit page with the same props interface — no copy-paste of logic.

**US-03**: As a dev, I can update `VariantRow` UI once and it affects both create and edit pages.

**US-04**: As a dev, `useNewProduct` hook contains all API calls for create flow; components import zero `adminService` directly.

### P2 — Should have

**US-05**: As a dev, `useEditProduct` hook mirrors the same return shape as `useNewProduct` so step components are interchangeable.

**US-06**: `ProductStepper` is a standalone component used by both pages.

### P3 — Nice to have

**US-07**: `src/types/product.ts` has all shared types (`ProductVariantDraft`, `BasicInfo`) so IDE autocomplete works across files.

---

## File Structure

```
src/
  lib/
    sku.ts                              ← viToSlug, generateSku (pure, no React)

  types/
    product.ts                         ← ProductVariantDraft, BasicInfo, Step

  hooks/admin/
    useNewProduct.ts                   ← create: step, variants, images, basicInfo, API handlers
    useEditProduct.ts                  ← edit: same shape, edit-specific API calls

  components/admin/products/
    shared/
      MatrixBuilder.tsx                ← local state (colors, sizes, bulkPrice), emits onGenerate
      BulkApplyBar.tsx                 ← local state (input values), emits onApply
      VariantRow.tsx                   ← pure presentational, onChange/onDelete callbacks
      VariantTable.tsx                 ← renders header + VariantRow list
      ProductStepper.tsx               ← step indicator, used by both pages

    create/
      BasicInfoStep.tsx                ← form, calls onSubmit prop
      VariantsStep.tsx                 ← orchestrates MatrixBuilder + BulkApplyBar + VariantTable
      ImagesStep.tsx                   ← upload grid

app/[lang]/admin/products/
  new/page.tsx                         ← useNewProduct() + render 3 steps (~40 lines)
  [id]/page.tsx                        ← useEditProduct() + render 3 steps (~40 lines)
```

---

## Component Contracts

### `MatrixBuilder`
```typescript
type Props = {
  colors: Color[]
  buildSku: (colorId: string | number, size: string) => string
  existingSkus: Set<string>
  onGenerate: (variants: ProductVariantDraft[]) => void
}
```
- Owns: `selectedColors`, `selectedSizes`, `sizeInput`, `bulkOriginalPrice`, `bulkSalePrice`, `bulkStock`
- Calls `useTranslation()` internally

### `BulkApplyBar`
```typescript
type Props = {
  onApply: (field: "originalPrice" | "salePrice" | "stockQuantity", value: number) => void
}
```
- Owns: `applyAllPrice`, `applyAllSalePrice`, `applyAllStock`

### `VariantRow`
```typescript
type Props = {
  variant: ProductVariantDraft
  colors: Color[]
  buildSku: (colorId: string | number, size: string) => string
  onChange: (updated: ProductVariantDraft) => void
  onDelete: () => void
}
```

### `useNewProduct` return shape
```typescript
{
  activeStep: Step; setActiveStep: (s: Step) => void
  createdProductId: number | null
  isSubmitting: boolean
  basicInfo: BasicInfo; setBasicInfo: (patch: Partial<BasicInfo>) => void
  variants: ProductVariantDraft[]; setVariants: Dispatch<...>
  images: any[]
  colors: Color[]; categories: Category[]; brands: Brand[]
  buildSku: (colorId: string | number, size: string) => string
  handleCreateBasic: (e: FormEvent) => Promise<void>
  handleSaveVariants: () => Promise<void>
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>
  handleDeleteImage: (id: number) => Promise<void>
}
```

---

## Acceptance Criteria

- [ ] `new/page.tsx` ≤ 50 lines, zero inline JSX blocks > 5 lines
- [ ] `[id]/page.tsx` ≤ 50 lines, zero inline JSX blocks > 5 lines
- [ ] `MatrixBuilder` has zero direct `adminService` or `useState` from parent
- [ ] `VariantRow` has zero direct API calls
- [ ] TypeScript build passes: `npx tsc --noEmit`
- [ ] All existing features work: create flow, edit flow, SKU auto-gen, bulk apply, status toggle, image upload

---

## Out of Scope

- Rewriting edit page's inline-edit variant mode (keep as-is, just extract to components)
- Adding new features during refactor
- Unit tests (separate ticket)

## Open Questions for Planning

1. Edit page has `editingVariantId` / inline edit mode — `VariantRow` needs an `isEditing` + `onSave` prop variant, or keep edit page's own row component?
2. Should `ProductStepper` accept `isDone` logic via props or compute internally?
