"use client";

import { useState } from "react";
import { ChevronsDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";

type ApplyField = "originalPrice" | "salePrice" | "stockQuantity";

type Props = {
  onApply: (field: ApplyField, value: number) => void;
};

export function BulkApplyBar({ onApply }: Props) {
  const { t } = useTranslation();
  const pf = (key: string) => t(`admin.productForm.${key}`);

  const [price, setPrice] = useState<number | null>(null);
  const [sale, setSale] = useState<number | null>(null);
  const [stock, setStock] = useState<number | null>(null);

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-outline-variant bg-surface-variant/20 text-xs">
      <span className="font-bold uppercase text-on-surface-variant flex-shrink-0">
        <ChevronsDownUp size={12} className="inline mr-1" />
        {pf("bulkApplyLabel")}
      </span>
      <div className="flex items-center gap-1.5">
        <Input type="number" placeholder={pf("bulkPricePlaceholder")} value={price ?? ""} onChange={e => setPrice(e.target.value === "" ? null : Number(e.target.value))} className="h-7 w-24 text-xs" />
        <Button type="button" size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => price !== null && onApply("originalPrice", price)}>
          {pf("bulkApplyPrice")}
        </Button>
      </div>
      <div className="flex items-center gap-1.5">
        <Input type="number" placeholder={pf("bulkSalePlaceholder")} value={sale ?? ""} onChange={e => setSale(e.target.value === "" ? null : Number(e.target.value))} className="h-7 w-24 text-xs" />
        <Button type="button" size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => sale !== null && onApply("salePrice", sale)}>
          {pf("bulkApplySale")}
        </Button>
      </div>
      <div className="flex items-center gap-1.5">
        <Input type="number" placeholder={pf("bulkStockPlaceholder")} value={stock ?? ""} onChange={e => setStock(e.target.value === "" ? null : Number(e.target.value))} className="h-7 w-20 text-xs" />
        <Button type="button" size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => stock !== null && onApply("stockQuantity", stock)}>
          {pf("bulkApplyStock")}
        </Button>
      </div>
    </div>
  );
}
