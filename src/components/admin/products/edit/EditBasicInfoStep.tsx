"use client";

import { FormEvent } from "react";
import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Category, Brand } from "@/services/adminService";
import { BasicInfo } from "@/types/product";
import { useTranslation } from "@/hooks/useTranslation";

type Props = {
  basicInfo: BasicInfo;
  onChange: (patch: Partial<BasicInfo>) => void;
  categories: Category[];
  brands: Brand[];
  isSubmitting: boolean;
  onSubmit: (e: FormEvent) => void;
};

const selectCls = "flex h-14 w-full rounded-2xl border-2 border-outline-variant bg-surface px-4 font-bold text-sm outline-none focus:border-primary transition-all";

export function EditBasicInfoStep({ basicInfo, onChange, categories, brands, isSubmitting, onSubmit }: Props) {
  const { locale, t } = useTranslation();

  return (
    <form onSubmit={onSubmit} className="p-10 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3 md:col-span-2">
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t("admin.productForm.productName")}</Label>
          <Input className="h-14 rounded-2xl bg-surface-container-highest/30 border-outline-variant focus:border-primary font-lexend font-bold text-lg shadow-inner" value={basicInfo.name} onChange={e => onChange({ name: e.target.value })} required />
        </div>
        <div className="space-y-3 md:col-span-2">
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t("admin.productForm.description")}</Label>
          <textarea className="flex min-h-[160px] w-full rounded-2xl border-2 border-outline-variant bg-surface-container-highest/20 px-4 py-3 text-sm font-medium focus:border-primary transition-all outline-none" value={basicInfo.description} onChange={e => onChange({ description: e.target.value })} />
        </div>
        <div className="space-y-3">
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t("admin.productForm.category")}</Label>
          <select className={selectCls} value={basicInfo.categoryId} onChange={e => onChange({ categoryId: e.target.value })} required>
            <option value="">{t("admin.productForm.selectCategory")}</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="space-y-3">
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t("admin.productForm.brand")}</Label>
          <select className={selectCls} value={basicInfo.brandId} onChange={e => onChange({ brandId: e.target.value })} required>
            <option value="">{t("admin.productForm.selectBrand")}</option>
            {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>
        <div className="space-y-3">
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t("admin.productForm.gender")}</Label>
          <select className={selectCls} value={basicInfo.gender} onChange={e => onChange({ gender: e.target.value })} required>
            <option value="MALE">{locale === "vi" ? "Nam" : "Male"}</option>
            <option value="FEMALE">{locale === "vi" ? "Nữ" : "Female"}</option>
            <option value="UNISEX">Unisex</option>
          </select>
        </div>
        <div className="space-y-3">
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t("admin.productForm.status")}</Label>
          <select className={selectCls} value={basicInfo.status} onChange={e => onChange({ status: e.target.value })} required>
            <option value="ACTIVE">{locale === "vi" ? "Hoạt động (Hiện trên Store)" : "Active (On Store)"}</option>
            <option value="INACTIVE">{locale === "vi" ? "Tạm ẩn (Không hiện)" : "Inactive (Hidden)"}</option>
          </select>
        </div>
        <div className="space-y-3 md:col-span-2">
          <Label className="text-xs font-black uppercase tracking-widest text-on-surface-variant">{t("admin.productForm.isFeatured")}</Label>
          <select className={selectCls} value={basicInfo.isFeatured ? "true" : "false"} onChange={e => onChange({ isFeatured: e.target.value === "true" })} required>
            <option value="false">{locale === "vi" ? "Sản phẩm thông thường" : "Standard Product"}</option>
            <option value="true">{locale === "vi" ? "★ Nổi bật Tuần này" : "★ Featured in Home Carousel"}</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end pt-6 border-t border-outline-variant">
        <Button type="submit" disabled={isSubmitting} className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-on-primary font-lexend font-black uppercase tracking-widest text-xs gap-3 shadow-lg shadow-primary/20">
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {t("admin.productForm.updateCoreSpecs")}
        </Button>
      </div>
    </form>
  );
}
