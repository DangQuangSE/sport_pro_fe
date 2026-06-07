"use client";

import { ChangeEvent } from "react";
import { Image as ImageIcon, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
  images: any[];
  isSubmitting: boolean;
  onUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete: (id: number) => void;
  onBack: () => void;
  onFinish: () => void;
};

export function ImagesStep({ images, isSubmitting, onUpload, onDelete, onBack, onFinish }: Props) {
  return (
    <div className="p-8 space-y-8 flex flex-col items-center justify-center text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
        <ImageIcon size={40} />
      </div>
      <div>
        <h3 className="text-xl font-bold">Upload Product Images</h3>
        <p className="text-on-surface-variant max-w-sm mx-auto text-xs font-medium uppercase tracking-wider">
          Select high-quality images to showcase your product.
        </p>
      </div>

      <div className="w-full max-w-md">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-outline-variant rounded-2xl cursor-pointer hover:bg-surface-variant/30 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Plus className="text-on-surface-variant mb-2" size={24} />
            <p className="text-sm text-on-surface-variant">Click to select files</p>
          </div>
          <input type="file" className="hidden" multiple accept="image/*" onChange={onUpload} disabled={isSubmitting} />
        </label>
      </div>

      {images.length > 0 && (
        <div className="w-full max-w-2xl mt-6">
          <h4 className="font-bold text-xs uppercase tracking-widest text-on-surface-variant mb-4 text-left">Uploaded Assets ({images.length})</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map(img => (
              <div key={img.id} className="group relative aspect-square rounded-2xl border-2 border-outline-variant overflow-hidden bg-surface-container shadow-sm hover:border-primary/50 transition-all">
                <img src={img.imageUrl} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button variant="destructive" size="icon" className="rounded-xl h-8 w-8 shadow-xl" onClick={() => onDelete(img.id)} disabled={isSubmitting}>
                    <Trash2 size={14} />
                  </Button>
                </div>
                {img.isThumbnail && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-primary text-[6px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border-none">Main</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {isSubmitting && (
        <div className="flex items-center gap-2 text-primary font-medium text-sm">
          <Loader2 size={16} className="animate-spin" />
          Processing assets, please wait...
        </div>
      )}

      <div className="flex justify-between w-full pt-8 border-t border-outline-variant mt-8">
        <Button variant="outline" onClick={onBack} className="rounded-xl font-bold">Back</Button>
        <Button onClick={onFinish} disabled={isSubmitting} className="rounded-xl font-bold bg-primary text-on-primary hover:bg-primary/90 px-8">
          {images.length > 0 ? "Finish & Complete" : "Skip & Finish"}
        </Button>
      </div>
    </div>
  );
}
