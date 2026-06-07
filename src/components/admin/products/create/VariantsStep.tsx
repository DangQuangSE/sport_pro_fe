"use client";

import { Loader2, Plus, RefreshCw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { Color } from "@/services/adminService";
import { ProductVariantDraft } from "@/types/product";
import { MatrixBuilder } from "../shared/MatrixBuilder";
import { BulkApplyBar } from "../shared/BulkApplyBar";

type Props = {
  variants: ProductVariantDraft[];
  colors: Color[];
  existingSkus: Set<string>;
  buildSku: (colorId: string | number, size: string) => string;
  isSubmitting: boolean;
  onAppend: (variants: ProductVariantDraft[]) => void;
  onUpdate: (idx: number, updated: ProductVariantDraft) => void;
  onDelete: (idx: number) => void;
  onBulkApply: (field: "originalPrice" | "salePrice" | "stockQuantity", value: number) => void;
  onAddManual: () => void;
  onBack: () => void;
  onSave: () => void;
};

export function VariantsStep({ variants, colors, existingSkus, buildSku, isSubmitting, onAppend, onUpdate, onDelete, onBulkApply, onAddManual, onBack, onSave }: Props) {
  const { t } = useTranslation();
  const pf = (key: string) => t(`admin.productForm.${key}`);

  return (
    <div className="p-8 space-y-6">
      <MatrixBuilder colors={colors} buildSku={buildSku} existingSkus={existingSkus} onGenerate={onAppend} />

      {variants.length > 0 && <BulkApplyBar onApply={onBulkApply} />}

      {variants.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-outline-variant rounded-2xl text-on-surface-variant italic">
          {pf("noVariantsHint")}
        </div>
      ) : (
        <div className="space-y-1">
          <div className="hidden md:grid grid-cols-[2fr_1fr_1.5fr_1.5fr_1.5fr_1fr_80px_40px] gap-2 px-4 pb-1 text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">
            <span>{pf("sku")}</span><span>{pf("size")}</span><span>{pf("color")}</span>
            <span>{pf("originalPrice")}</span><span>{pf("salePrice")}</span><span>{pf("stock")}</span>
            <span>{pf("status")}</span><span />
          </div>
          {variants.map((v, idx) => {
            const colorObj = colors.find(c => String(c.id) === String(v.colorId));
            return (
              <div key={idx} className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1.5fr_1.5fr_1.5fr_1fr_80px_40px] gap-2 items-center px-4 py-3 rounded-xl border border-outline-variant bg-surface hover:bg-surface-variant/20 transition-colors">
                <div className="col-span-2 md:col-span-1 flex items-center gap-1">
                  <Input value={v.sku} placeholder="Auto-generated" className="h-8 text-xs font-mono" onChange={e => onUpdate(idx, { ...v, sku: e.target.value })} />
                  <button type="button" title={pf("regenSku")} className="flex-shrink-0 text-primary hover:text-primary/70" onClick={() => onUpdate(idx, { ...v, sku: buildSku(v.colorId, v.size) })}>
                    <RefreshCw size={13} />
                  </button>
                </div>
                <Input placeholder="M, 42…" value={v.size} className="h-8 text-xs" onChange={e => onUpdate(idx, { ...v, size: e.target.value, sku: buildSku(v.colorId, e.target.value) })} />
                <div className="flex items-center gap-1.5">
                  <select value={v.colorId} onChange={e => onUpdate(idx, { ...v, colorId: e.target.value, sku: buildSku(e.target.value, v.size) })} className="h-8 flex-1 rounded-md border border-input bg-background px-2 text-xs outline-none focus:border-primary">
                    <option value="">Chọn màu</option>
                    {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  {colorObj && <span className="w-5 h-5 rounded-full border border-black/10 flex-shrink-0" style={{ backgroundColor: colorObj.hexCode }} />}
                </div>
                <Input type="number" value={v.originalPrice} className="h-8 text-xs" onChange={e => onUpdate(idx, { ...v, originalPrice: Number(e.target.value) })} />
                <Input type="number" placeholder="—" value={v.salePrice ?? ""} className="h-8 text-xs" onChange={e => onUpdate(idx, { ...v, salePrice: e.target.value === "" ? null : Number(e.target.value) })} />
                <Input type="number" value={v.stockQuantity} className="h-8 text-xs" onChange={e => onUpdate(idx, { ...v, stockQuantity: Number(e.target.value) })} />
                <button
                  type="button"
                  onClick={() => onUpdate(idx, { ...v, status: v.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" })}
                  className={cn(
                    "h-7 px-2 rounded-full text-[10px] font-bold border transition-all",
                    v.status === "ACTIVE" ? "bg-success/15 border-success/40 text-success" : "bg-surface-variant border-outline-variant text-on-surface-variant"
                  )}
                >
                  {v.status === "ACTIVE" ? pf("statusActive") : pf("statusInactive")}
                </button>
                <button type="button" title={pf("deleteVariantTitle")} onClick={() => onDelete(idx)} className="text-on-surface-variant hover:text-error transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 border-t border-outline-variant">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBack}>Back</Button>
          <Button type="button" variant="ghost" size="sm" onClick={onAddManual} className="gap-1.5 text-xs">
            <Plus size={14} />{pf("addManual")}
          </Button>
        </div>
        <Button onClick={onSave} disabled={isSubmitting || variants.length === 0} className="gap-2">
          {isSubmitting && <Loader2 size={18} className="animate-spin" />}
          Next: Upload Images
        </Button>
      </div>
    </div>
  );
}
