"use client";

import { ChangeEvent } from "react";
import { Plus, Trash2, Upload, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

type Props = {
  images: any[];
  isSubmitting: boolean;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete: (id: number) => void;
  onBack: () => void;
  onComplete: () => void;
};

export function EditImagesStep({ images, isSubmitting, onUpload, onDelete, onBack, onComplete }: Props) {
  const { t } = useTranslation();

  return (
    <div className="p-10 space-y-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-black italic uppercase tracking-tighter">Visual Assets</h3>
          <p className="text-xs font-medium text-on-surface-variant uppercase tracking-widest">High-fidelity product imagery and branding</p>
        </div>
        <div className="relative">
          <input type="file" id="image-upload-edit" multiple accept="image/*" className="hidden" onChange={onUpload} />
          <Button asChild className="gap-2 h-12 px-6 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-bold uppercase tracking-widest text-[10px] cursor-pointer">
            <label htmlFor="image-upload-edit">
              <Upload size={16} />Upload Assets
            </label>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {images.map(img => (
          <div key={img.id} className="group relative aspect-square rounded-[1.5rem] border-2 border-outline-variant overflow-hidden bg-surface-container shadow-sm hover:border-primary/50 transition-all">
            <img src={img.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button variant="destructive" size="icon" className="rounded-xl h-10 w-10 shadow-xl" onClick={() => onDelete(img.id)} disabled={isSubmitting}>
                <Trash2 size={18} />
              </Button>
            </div>
            {img.isThumbnail && (
              <div className="absolute top-3 left-3">
                <Badge className="bg-primary text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-lg border-none">Main Asset</Badge>
              </div>
            )}
          </div>
        ))}
        <label htmlFor="image-upload-edit" className="aspect-square rounded-[1.5rem] border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-3 text-on-surface-variant hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary transition-all">
            <Plus size={24} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest">Add Asset</span>
        </label>
      </div>

      <div className="flex justify-between pt-10 border-t border-outline-variant">
        <Button variant="outline" onClick={onBack} className="rounded-xl font-bold h-12 px-8">{t("admin.productForm.back")}</Button>
        <Button onClick={onComplete} disabled={isSubmitting} className="h-14 px-12 rounded-2xl bg-secondary hover:bg-secondary/90 text-on-secondary font-lexend font-black uppercase tracking-widest text-xs shadow-lg shadow-secondary/20">
          {t("admin.productForm.completeSync")}
          <CheckCircle2 size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
}
