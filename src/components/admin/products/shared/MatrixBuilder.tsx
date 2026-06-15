"use client";

import { useState, useEffect } from "react";
import { Wand2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { Color, SizeGroup } from "@/services/adminService";
import { ProductVariantDraft } from "@/types/product";

type Props = {
  colors: Color[];
  buildSku: (colorId: string | number, size: string) => string;
  existingSkus: Set<string>;
  onGenerate: (variants: ProductVariantDraft[]) => void;
  sizeGroupId?: string;
  sizeGroups?: SizeGroup[];
};

export function MatrixBuilder({ colors, buildSku, existingSkus, onGenerate, sizeGroupId, sizeGroups }: Props) {
  const { t, locale } = useTranslation();
  const pf = (key: string) => t(`admin.productForm.${key}`);

  const [selectedColors, setSelectedColors] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sizeInput, setSizeInput] = useState("");
  const [bulkOriginalPrice, setBulkOriginalPrice] = useState(0);
  const [bulkSalePrice, setBulkSalePrice] = useState<number | null>(null);
  const [bulkStock, setBulkStock] = useState(20);
  const [currentSizeGroupId, setCurrentSizeGroupId] = useState("");

  useEffect(() => {
    const targetGroupId = currentSizeGroupId || sizeGroupId;
    if (targetGroupId && sizeGroups) {
      const group = sizeGroups.find(g => String(g.id) === String(targetGroupId));
      if (group) {
        setSelectedSizes(group.sizes.map(s => s.name.toUpperCase()));
      }
    }
  }, [currentSizeGroupId, sizeGroupId, sizeGroups]);

  const toggleColor = (id: number) =>
    setSelectedColors(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const addSize = () => {
    const val = sizeInput.trim().toUpperCase();
    if (val && !selectedSizes.includes(val)) setSelectedSizes(p => [...p, val]);
    setSizeInput("");
  };

  const handleGenerate = () => {
    const newVariants: ProductVariantDraft[] = [];
    for (const colorId of selectedColors) {
      for (const size of selectedSizes) {
        const sku = buildSku(colorId, size);
        if (existingSkus.has(sku)) continue;
        newVariants.push({ sku, size, colorId: String(colorId), originalPrice: bulkOriginalPrice, salePrice: bulkSalePrice, stockQuantity: bulkStock, status: "ACTIVE" });
      }
    }
    if (newVariants.length === 0) { toast.info(pf("matrixDuplicate")); return; }
    onGenerate(newVariants);
    toast.success(pf("matrixSuccess").replace("{count}", String(newVariants.length)));
  };

  const count = selectedColors.length * selectedSizes.length;

  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/5 p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Wand2 size={18} className="text-primary" />
        <h3 className="font-bold text-base">{pf("matrixBuilder")}</h3>
        <span className="ml-auto text-xs text-on-surface-variant">
          {pf("colorsCount").replace("{count}", String(selectedColors.length))} × {pf("sizesCount").replace("{count}", String(selectedSizes.length))}
          {count > 0 && <span className="ml-1 font-bold text-primary">= {count} variants</span>}
        </span>
      </div>

      <div className="space-y-2">
        <Label className="text-[10px] uppercase font-bold">{pf("matrixColors")}</Label>
        <div className="flex flex-wrap gap-2">
          {colors.map(c => {
            const active = selectedColors.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                title={pf("removeColorTitle").replace("{color}", c.name)}
                onClick={() => toggleColor(c.id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all",
                  active ? "border-primary bg-primary text-on-primary shadow-sm" : "border-outline-variant bg-surface hover:border-primary/60 text-on-surface"
                )}
              >
                <span className="w-3 h-3 rounded-full border border-black/10 flex-shrink-0" style={{ backgroundColor: c.hexCode }} />
                {c.name}
                {active && <X size={10} className="ml-0.5 opacity-70" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-[10px] uppercase font-bold">{pf("matrixSizes")}</Label>
          {sizeGroups && sizeGroups.length > 0 && (
            <select
              aria-label="Nhóm size"
              className="h-8 rounded-md border border-outline-variant bg-surface px-2 text-xs font-bold outline-none focus:border-primary transition-all"
              value={currentSizeGroupId || sizeGroupId || ""}
              onChange={e => {
                const sgId = e.target.value;
                setCurrentSizeGroupId(sgId);
              }}
            >
              <option value="">{locale === "vi" ? "-- Áp dụng nhóm size --" : "-- Apply size preset --"}</option>
              {sizeGroups.map(sg => (
                <option key={sg.id} value={sg.id}>{sg.name}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {selectedSizes.map(s => (
            <span key={s} className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-secondary text-on-secondary text-xs font-bold">
              {s}
              <button
                type="button"
                title={pf("deleteSizeTitle").replace("{size}", s)}
                onClick={() => setSelectedSizes(p => p.filter(x => x !== s))}
                className="ml-0.5 hover:text-error/80"
              >
                <X size={10} />
              </button>
            </span>
          ))}
          <div className="flex items-center gap-1.5">
            <Input
              placeholder={pf("matrixSizePlaceholder")}
              value={sizeInput}
              onChange={e => setSizeInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSize(); } }}
              className="h-8 w-32 text-xs"
            />
            <Button type="button" size="sm" variant="outline" onClick={addSize} className="h-8 text-xs px-2">
              {pf("matrixAddSize")}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="text-[10px] uppercase">{pf("matrixDefaultPrice")}</Label>
          <Input type="number" value={bulkOriginalPrice} onChange={e => setBulkOriginalPrice(Number(e.target.value))} className="h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] uppercase">{pf("matrixDefaultSalePrice")}</Label>
          <Input type="number" placeholder={pf("matrixNoDiscount")} value={bulkSalePrice ?? ""} onChange={e => setBulkSalePrice(e.target.value === "" ? null : Number(e.target.value))} className="h-9 text-sm" />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] uppercase">{pf("matrixDefaultStock")}</Label>
          <Input type="number" value={bulkStock} onChange={e => setBulkStock(Number(e.target.value))} className="h-9 text-sm" />
        </div>
      </div>

      <Button type="button" onClick={handleGenerate} disabled={selectedColors.length === 0 || selectedSizes.length === 0} className="gap-2">
        <Wand2 size={16} />
        {pf("matrixGenerate").replace("{count}", String(count || ""))}
      </Button>
    </div>
  );
}
