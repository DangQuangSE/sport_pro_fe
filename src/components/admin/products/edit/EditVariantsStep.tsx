"use client";

import { Plus, Save, X, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Color } from "@/services/adminService";
import { useTranslation } from "@/hooks/useTranslation";

type Props = {
  variants: any[];
  colors: Color[];
  editingVariantId: number | null;
  editingVariantData: any;
  onEditingDataChange: (data: any) => void;
  isAddingVariant: boolean;
  newVariant: any;
  onNewVariantChange: (data: any) => void;
  onStartEdit: (v: any) => void;
  onSaveEdit: (id: number) => void;
  onCancelEdit: () => void;
  onDelete: (id: number) => void;
  onOpenAdd: () => void;
  onCloseAdd: () => void;
  onConfirmAdd: () => void;
  onBack: () => void;
  onNext: () => void;
};

export function EditVariantsStep({ variants, colors, editingVariantId, editingVariantData, onEditingDataChange, isAddingVariant, newVariant, onNewVariantChange, onStartEdit, onSaveEdit, onCancelEdit, onDelete, onOpenAdd, onCloseAdd, onConfirmAdd, onBack, onNext }: Props) {
  const { t } = useTranslation();

  const colorSelectCls = "flex h-11 flex-grow rounded-xl border-2 border-outline-variant bg-surface px-3 font-bold text-sm outline-none focus:border-primary transition-all";

  return (
    <div className="p-10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-black italic uppercase tracking-tighter">{t("admin.productForm.variantInventory")}</h3>
          <p className="text-xs font-medium text-on-surface-variant uppercase tracking-widest">{t("admin.productForm.manageVariants")}</p>
        </div>
        <Button variant="outline" className="gap-2 h-12 px-6 rounded-xl border-primary text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-[10px]" onClick={onOpenAdd}>
          <Plus size={16} />{t("admin.productForm.injectVariant")}
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {variants.map(v => (
          <div key={v.id} className="group p-6 bg-surface-container/30 rounded-3xl border border-outline-variant hover:bg-surface-container/50 hover:border-primary/30 transition-all">
            {editingVariantId === v.id ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.sku")}</Label>
                  <Input value={editingVariantData.sku} onChange={e => onEditingDataChange({ ...editingVariantData, sku: e.target.value })} className="rounded-xl h-11 font-mono font-bold" />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.size")}</Label>
                  <Input value={editingVariantData.size} onChange={e => onEditingDataChange({ ...editingVariantData, size: e.target.value })} className="rounded-xl h-11 font-bold text-center" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.color")}</Label>
                  <div className="flex items-center gap-2">
                    <select value={editingVariantData.colorId} onChange={e => onEditingDataChange({ ...editingVariantData, colorId: e.target.value })} className={colorSelectCls}>
                      <option value="">{t("admin.productForm.selectColor")}</option>
                      {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    {editingVariantData.colorId && (
                      <div className="w-8 h-8 rounded-full border border-outline-variant flex-shrink-0 shadow-sm" style={{ backgroundColor: colors.find(c => String(c.id) === String(editingVariantData.colorId))?.hexCode || "#000000" }} />
                    )}
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.originalPrice")}</Label>
                  <Input type="number" value={editingVariantData.originalPrice} onChange={e => onEditingDataChange({ ...editingVariantData, originalPrice: Number(e.target.value) })} className="rounded-xl h-11 font-bold" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.salePrice")}</Label>
                  <Input type="number" placeholder={t("admin.productForm.noDiscount")} value={editingVariantData.salePrice ?? ""} onChange={e => onEditingDataChange({ ...editingVariantData, salePrice: e.target.value === "" ? null : Number(e.target.value) })} className="rounded-xl h-11 font-bold" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.stock")}</Label>
                  <Input type="number" value={editingVariantData.stockQuantity} onChange={e => onEditingDataChange({ ...editingVariantData, stockQuantity: Number(e.target.value) })} className="rounded-xl h-11 font-bold" />
                </div>
                <div className="flex items-center justify-end gap-1.5 md:col-span-1 pb-[2px]">
                  <Button size="icon" type="button" className="h-10 w-10 rounded-xl bg-primary flex-shrink-0" onClick={() => onSaveEdit(v.id)}><Save size={16} /></Button>
                  <Button variant="outline" size="icon" type="button" className="h-10 w-10 rounded-xl flex-shrink-0" onClick={onCancelEdit}><X size={16} /></Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap md:flex-nowrap items-center gap-6">
                <div className="flex-grow grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-on-surface-variant opacity-60">SKU</Label>
                    <p className="font-mono font-bold text-sm">{v.sku}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-on-surface-variant opacity-60">Attributes</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-bold border-outline-variant">{v.size}</Badge>
                      <Badge variant="outline" className="font-bold border-outline-variant gap-1.5 pl-1.5">
                        <span className="w-3.5 h-3.5 rounded-full border border-outline-variant/30 flex-shrink-0" style={{ backgroundColor: v.colorHex || "#000000" }} />
                        {v.colorName}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-on-surface-variant opacity-60">Price</Label>
                    <div className="flex flex-col">
                      {v.salePrice && v.originalPrice > v.salePrice ? (
                        <><span className="font-lexend font-black text-primary">{v.salePrice.toLocaleString()} đ</span><span className="text-[10px] line-through text-on-surface-variant/40">{v.originalPrice.toLocaleString()} đ</span></>
                      ) : (
                        <span className="font-lexend font-black text-on-surface">{v.originalPrice.toLocaleString()} đ</span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-on-surface-variant opacity-60">Stock</Label>
                    <Badge variant={v.stockQuantity > 10 ? "default" : "destructive"} className="font-black text-[10px]">{v.stockQuantity} UNITS</Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl hover:border-primary hover:text-primary transition-all" onClick={() => onStartEdit(v)}><Edit2 size={16} /></Button>
                  <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl hover:border-error hover:text-error transition-all" onClick={() => onDelete(v.id)}><Trash2 size={16} /></Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {isAddingVariant && (
        <div className="p-8 bg-surface-container-highest/20 rounded-[2rem] border-2 border-dashed border-primary/30 animate-in slide-in-from-top-4 duration-300">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-black uppercase tracking-widest text-xs text-primary italic">{t("admin.productForm.newVariantConfig")}</h4>
            <Button variant="ghost" size="icon" onClick={onCloseAdd}><X size={20} /></Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 items-end">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">SKU</Label>
              <Input value={newVariant.sku} onChange={e => onNewVariantChange({ ...newVariant, sku: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.size")}</Label>
              <Input value={newVariant.size} onChange={e => onNewVariantChange({ ...newVariant, size: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.color")}</Label>
              <div className="flex items-center gap-2">
                <select value={newVariant.colorId} onChange={e => onNewVariantChange({ ...newVariant, colorId: e.target.value })} className={colorSelectCls}>
                  <option value="">{t("admin.productForm.selectColor")}</option>
                  {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {newVariant.colorId && (
                  <div className="w-8 h-8 rounded-full border border-outline-variant flex-shrink-0" style={{ backgroundColor: colors.find(c => String(c.id) === String(newVariant.colorId))?.hexCode || "#000000" }} />
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">Orig. Price</Label>
              <Input type="number" value={newVariant.originalPrice} onChange={e => onNewVariantChange({ ...newVariant, originalPrice: Number(e.target.value) })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">Sale Price</Label>
              <Input type="number" placeholder="No discount" value={newVariant.salePrice ?? ""} onChange={e => onNewVariantChange({ ...newVariant, salePrice: e.target.value === "" ? null : Number(e.target.value) })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">Stock</Label>
              <Input type="number" value={newVariant.stockQuantity} onChange={e => onNewVariantChange({ ...newVariant, stockQuantity: Number(e.target.value) })} className="rounded-xl" />
            </div>
          </div>
          <div className="flex justify-end mt-6">
            <Button onClick={onConfirmAdd} className="bg-primary hover:bg-primary/90 rounded-xl font-bold uppercase tracking-widest text-[10px] h-11 px-8">
              {t("admin.productForm.confirmSaveVariant")}
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-8 border-t border-outline-variant">
        <Button variant="outline" onClick={onBack} className="rounded-xl font-bold">{t("admin.productForm.back")}</Button>
        <Button onClick={onNext} className="rounded-xl font-bold bg-secondary hover:bg-secondary/90 text-on-secondary">{t("admin.productForm.nextAssets")}</Button>
      </div>
    </div>
  );
}
