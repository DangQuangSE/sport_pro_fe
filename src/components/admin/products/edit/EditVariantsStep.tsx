"use client";

import { Plus, Save, X, Edit2, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Color } from "@/services/adminService";
import { useTranslation } from "@/hooks/useTranslation";

type Props = {
  variants: any[];
  colors: Color[];
  buildSku: (colorId: string | number, size: string) => string;
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
  // Bulk generation props
  sizeGroups: any[];
  isBulkAdding: boolean;
  setIsBulkAdding: (open: boolean) => void;
  bulkConfig: any;
  setBulkConfig: (config: any) => void;
  bulkPreviewVariants: any[];
  setBulkPreviewVariants: (variants: any[]) => void;
  onGenerateBulkPreview: () => void;
  onConfirmBulkAdd: () => void;
  onBack: () => void;
  onNext: () => void;
};

export function EditVariantsStep({ 
  variants, 
  colors, 
  buildSku, 
  editingVariantId, 
  editingVariantData, 
  onEditingDataChange, 
  isAddingVariant, 
  newVariant, 
  onNewVariantChange, 
  onStartEdit, 
  onSaveEdit, 
  onCancelEdit, 
  onDelete, 
  onOpenAdd, 
  onCloseAdd, 
  onConfirmAdd,
  sizeGroups,
  isBulkAdding,
  setIsBulkAdding,
  bulkConfig,
  setBulkConfig,
  bulkPreviewVariants,
  setBulkPreviewVariants,
  onGenerateBulkPreview,
  onConfirmBulkAdd,
  onBack,
  onNext 
}: Props) {
  const { t, locale } = useTranslation();

  const colorSelectCls = "flex h-11 flex-grow rounded-xl border-2 border-outline-variant bg-surface px-3 font-bold text-sm outline-none focus:border-primary transition-all";

  return (
    <div className="p-10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-black italic uppercase tracking-tighter">{t("admin.productForm.variantInventory")}</h3>
          <p className="text-xs font-medium text-on-surface-variant uppercase tracking-widest">{t("admin.productForm.manageVariants")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 h-12 px-6 rounded-xl border-secondary text-secondary hover:bg-secondary/5 font-bold uppercase tracking-widest text-[10px]" onClick={() => setIsBulkAdding(true)}>
            <Plus size={16} />{locale === "vi" ? "Tạo Nhanh Biến Thể" : "Bulk Generate"}
          </Button>
          <Button variant="outline" className="gap-2 h-12 px-6 rounded-xl border-primary text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-[10px]" onClick={onOpenAdd}>
            <Plus size={16} />{t("admin.productForm.injectVariant")}
          </Button>
        </div>
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
              <div className="flex items-center gap-1.5">
                <Input value={newVariant.sku} onChange={e => onNewVariantChange({ ...newVariant, sku: e.target.value })} className="rounded-xl" />
                <button
                  type="button"
                  title={t("admin.productForm.regenSku")}
                  className="flex-shrink-0 text-primary hover:text-primary/70 transition-colors"
                  onClick={() => onNewVariantChange({ ...newVariant, sku: buildSku(newVariant.colorId, newVariant.size) })}
                >
                  <RefreshCw size={15} />
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.size")}</Label>
              <Input value={newVariant.size} onChange={e => onNewVariantChange({ ...newVariant, size: e.target.value })} className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.color")}</Label>
              <div className="flex items-center gap-2">
                <select aria-label={t("admin.productForm.color")} value={newVariant.colorId} onChange={e => onNewVariantChange({ ...newVariant, colorId: e.target.value })} className={colorSelectCls}>
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

      <div className="grid grid-cols-1 gap-4">
        {variants.map(v => (
          <div key={v.id} className="group p-6 bg-surface-container/30 rounded-3xl border border-outline-variant hover:bg-surface-container/50 hover:border-primary/30 transition-all">
            {editingVariantId === v.id ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.sku")}</Label>
                  <div className="flex items-center gap-1.5">
                    <Input value={editingVariantData.sku} onChange={e => onEditingDataChange({ ...editingVariantData, sku: e.target.value })} className="rounded-xl h-11 font-mono font-bold" />
                    <button
                      type="button"
                      title={t("admin.productForm.regenSku")}
                      className="flex-shrink-0 text-primary hover:text-primary/70 transition-colors"
                      onClick={() => onEditingDataChange({ ...editingVariantData, sku: buildSku(editingVariantData.colorId, editingVariantData.size) })}
                    >
                      <RefreshCw size={15} />
                    </button>
                  </div>
                </div>
                <div className="space-y-2 md:col-span-1">
                  <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.size")}</Label>
                  <Input value={editingVariantData.size} onChange={e => onEditingDataChange({ ...editingVariantData, size: e.target.value })} className="rounded-xl h-11 font-bold text-center" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-[10px] font-black uppercase opacity-60">{t("admin.productForm.color")}</Label>
                  <div className="flex items-center gap-2">
                    <select aria-label={t("admin.productForm.color")} value={editingVariantData.colorId} onChange={e => onEditingDataChange({ ...editingVariantData, colorId: e.target.value })} className={colorSelectCls}>
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

      <div className="flex justify-between pt-8 border-t border-outline-variant">
        <Button variant="outline" onClick={onBack} className="rounded-xl font-bold">{t("admin.productForm.back")}</Button>
        <Button onClick={onNext} className="rounded-xl font-bold bg-secondary hover:bg-secondary/90 text-on-secondary">{t("admin.productForm.nextAssets")}</Button>
      </div>

      {/* Bulk Variant Creation Modal */}
      <Modal
        isOpen={isBulkAdding}
        onClose={() => {
          setIsBulkAdding(false);
          setBulkPreviewVariants([]);
        }}
        title={locale === "vi" ? "Tạo Nhanh Biến Thể Hàng Loạt" : "Bulk Generate Product Variants"}
        footer={
          <>
            <Button 
              variant="outline" 
              className="rounded-xl font-bold h-11"
              onClick={() => {
                setIsBulkAdding(false);
                setBulkPreviewVariants([]);
              }}
            >
              {locale === "vi" ? "Hủy" : "Cancel"}
            </Button>
            <Button 
              className="rounded-xl font-bold h-11 bg-primary text-on-primary hover:bg-primary/95 shadow-md"
              onClick={onConfirmBulkAdd}
              disabled={bulkPreviewVariants.length === 0}
            >
              {locale === "vi" ? "Xác nhận & Lưu" : "Confirm & Save"}
            </Button>
          </>
        }
      >
        <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-1">
          {/* Step 1: Select Preset Size Group */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase opacity-60 tracking-wider">
              {locale === "vi" ? "1. Chọn Nhóm Size" : "1. Select Preset Size Group"}
            </Label>
            <select
              className="flex h-11 w-full rounded-xl border-2 border-outline-variant bg-surface px-3 font-bold text-sm outline-none focus:border-primary transition-all"
              value={bulkConfig.sizeGroupId}
              onChange={e => {
                const sgId = e.target.value;
                const sg = sizeGroups.find(g => String(g.id) === String(sgId));
                setBulkConfig({
                  ...bulkConfig,
                  sizeGroupId: sgId,
                  selectedSizes: sg ? sg.sizes.map(s => s.name) : []
                });
              }}
            >
              <option value="">{locale === "vi" ? "-- Chọn nhóm size --" : "-- Select size preset group --"}</option>
              {sizeGroups.map(sg => <option key={sg.id} value={sg.id}>{sg.name}</option>)}
            </select>
          </div>

          {/* Step 2: Show size checkboxes if sizeGroup is selected */}
          {bulkConfig.sizeGroupId && (
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase opacity-60 tracking-wider">
                {locale === "vi" ? "2. Tùy Chọn Kích Thước (Sizes)" : "2. Fine-tune Selected Sizes"}
              </Label>
              <div className="flex flex-wrap gap-2.5 p-4 bg-surface-variant/15 rounded-2xl border border-outline-variant/60">
                {sizeGroups.find(g => String(g.id) === String(bulkConfig.sizeGroupId))?.sizes.map(s => {
                  const isChecked = bulkConfig.selectedSizes.includes(s.name);
                  return (
                    <label 
                      key={s.id || s.name} 
                      className={`flex items-center gap-2 font-mono font-bold text-xs px-3.5 py-2 rounded-xl border cursor-pointer transition-colors shadow-sm select-none ${
                        isChecked 
                          ? "bg-primary/5 border-primary text-primary" 
                          : "bg-surface border-outline-variant hover:border-primary/40 text-on-surface-variant"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                        onChange={e => {
                          const nextSizes = e.target.checked
                            ? [...bulkConfig.selectedSizes, s.name]
                            : bulkConfig.selectedSizes.filter(sz => sz !== s.name);
                          setBulkConfig({ ...bulkConfig, selectedSizes: nextSizes });
                        }}
                      />
                      {s.name}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 3: Choose Colors */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase opacity-60 tracking-wider">
              {locale === "vi" ? "3. Chọn Màu Sắc (Colors)" : "3. Select Colors"}
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-4 bg-surface-variant/15 rounded-2xl border border-outline-variant/60 max-h-[160px] overflow-y-auto">
              {colors.map(c => {
                const isChecked = bulkConfig.selectedColors.includes(c.id);
                return (
                  <label 
                    key={c.id} 
                    className={`flex items-center gap-2 font-bold text-xs px-3 py-2 rounded-xl border cursor-pointer transition-colors shadow-sm select-none ${
                      isChecked 
                        ? "bg-primary/5 border-primary text-primary" 
                        : "bg-surface border-outline-variant hover:border-primary/40 text-on-surface-variant"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4"
                      onChange={e => {
                        const nextColors = e.target.checked
                          ? [...bulkConfig.selectedColors, c.id]
                          : bulkConfig.selectedColors.filter(cid => cid !== c.id);
                        setBulkConfig({ ...bulkConfig, selectedColors: nextColors });
                      }}
                    />
                    <span className="w-3.5 h-3.5 rounded-full border border-outline-variant/40 flex-shrink-0" style={{ backgroundColor: c.hexCode }} />
                    <span className="truncate">{c.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Step 4: Base Pricing & Stock */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase opacity-60 tracking-wider">
              {locale === "vi" ? "4. Thông Số Biến Thể Mặc Định" : "4. Default Specifications"}
            </Label>
            <div className="grid grid-cols-3 gap-4 p-4 bg-surface-variant/15 rounded-2xl border border-outline-variant/60">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase opacity-60">{locale === "vi" ? "Giá Gốc" : "Orig. Price"}</Label>
                <Input
                  type="number"
                  value={bulkConfig.originalPrice || ""}
                  onChange={e => setBulkConfig({ ...bulkConfig, originalPrice: Number(e.target.value) })}
                  className="rounded-xl h-10 font-bold"
                  placeholder="e.g. 199000"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase opacity-60">{locale === "vi" ? "Giá Bán" : "Sale Price"}</Label>
                <Input
                  type="number"
                  value={bulkConfig.salePrice || ""}
                  onChange={e => setBulkConfig({ ...bulkConfig, salePrice: e.target.value === "" ? null : Number(e.target.value) })}
                  className="rounded-xl h-10 font-bold"
                  placeholder="e.g. 139000"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-bold uppercase opacity-60">{locale === "vi" ? "Tồn Kho" : "Stock Quantity"}</Label>
                <Input
                  type="number"
                  value={bulkConfig.stockQuantity || ""}
                  onChange={e => setBulkConfig({ ...bulkConfig, stockQuantity: Number(e.target.value) })}
                  className="rounded-xl h-10 font-bold"
                  placeholder="e.g. 20"
                />
              </div>
            </div>
          </div>

          {/* Generate Action Button */}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              className="bg-secondary text-on-secondary hover:bg-secondary/90 font-bold px-6 rounded-xl text-xs h-10"
              onClick={onGenerateBulkPreview}
            >
              {locale === "vi" ? "Xem Trước Tổ Hợp" : "Preview Combinations"}
            </Button>
          </div>

          {/* Step 5: Cartesian product preview table */}
          {bulkPreviewVariants.length > 0 && (
            <div className="space-y-3">
              <Label className="text-[10px] font-black uppercase opacity-60 tracking-wider">
                {locale === "vi" ? "5. Điều Chỉnh Tổ Hợp Xem Trước" : "5. Modify Generated Preview List"} ({bulkPreviewVariants.length} {locale === "vi" ? "Tổ hợp" : "items"})
              </Label>
              <div className="border border-outline-variant/60 rounded-2xl overflow-hidden max-h-[260px] overflow-y-auto bg-surface-variant/5">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface-variant/30 border-b border-outline-variant text-[10px] uppercase font-black tracking-wider text-on-surface-variant opacity-75">
                      <th className="p-3 w-52">SKU</th>
                      <th className="p-3">{locale === "vi" ? "Thuộc Tính" : "Attributes"}</th>
                      <th className="p-3 w-28">{locale === "vi" ? "Giá Gốc" : "Orig. Price"}</th>
                      <th className="p-3 w-28">{locale === "vi" ? "Giá Bán" : "Sale Price"}</th>
                      <th className="p-3 w-20">{locale === "vi" ? "Kho" : "Stock"}</th>
                      <th className="p-3 text-right"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/60 font-medium">
                    {bulkPreviewVariants.map((v, index) => (
                      <tr key={index} className="hover:bg-surface-variant/10">
                        <td className="p-2.5">
                          <Input
                            value={v.sku}
                            onChange={e => {
                              const updated = [...bulkPreviewVariants];
                              updated[index] = { ...updated[index], sku: e.target.value };
                              setBulkPreviewVariants(updated);
                            }}
                            className="h-8 rounded-lg font-mono font-bold w-full text-xs"
                          />
                        </td>
                        <td className="p-2.5 flex items-center gap-1.5 py-4">
                          <Badge variant="outline" className="font-bold border-outline-variant font-mono text-[10px]">{v.size}</Badge>
                          <Badge variant="outline" className="font-bold border-outline-variant gap-1.5 pl-1.5 text-[10px]">
                            <span className="w-2.5 h-2.5 rounded-full border border-outline-variant/30 flex-shrink-0" style={{ backgroundColor: v.colorHex }} />
                            {v.colorName}
                          </Badge>
                        </td>
                        <td className="p-2.5">
                          <Input
                            type="number"
                            value={v.originalPrice}
                            onChange={e => {
                              const updated = [...bulkPreviewVariants];
                              updated[index] = { ...updated[index], originalPrice: Number(e.target.value) };
                              setBulkPreviewVariants(updated);
                            }}
                            className="h-8 rounded-lg font-bold text-xs"
                          />
                        </td>
                        <td className="p-2.5">
                          <Input
                            type="number"
                            value={v.salePrice === null ? "" : v.salePrice}
                            onChange={e => {
                              const updated = [...bulkPreviewVariants];
                              updated[index] = { ...updated[index], salePrice: e.target.value === "" ? null : Number(e.target.value) };
                              setBulkPreviewVariants(updated);
                            }}
                            className="h-8 rounded-lg font-bold text-xs"
                            placeholder="Giá sale"
                          />
                        </td>
                        <td className="p-2.5">
                          <Input
                            type="number"
                            value={v.stockQuantity}
                            onChange={e => {
                              const updated = [...bulkPreviewVariants];
                              updated[index] = { ...updated[index], stockQuantity: Number(e.target.value) };
                              setBulkPreviewVariants(updated);
                            }}
                            className="h-8 rounded-lg font-bold text-xs"
                          />
                        </td>
                        <td className="p-2.5 text-right">
                          <button
                            type="button"
                            className="text-on-surface-variant hover:text-error transition-colors p-1"
                            onClick={() => {
                              setBulkPreviewVariants(bulkPreviewVariants.filter((_, i) => i !== index));
                            }}
                          >
                            <X size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
