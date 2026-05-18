"use client";

import React from "react";
import { 
  Edit2, 
  Trash2, 
  Package,
  Star,
  MoreVertical
} from "lucide-react";
import { ProductListResponse } from "@/services/adminService";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ProductTableProps {
  readonly products: ProductListResponse[];
  readonly isLoading: boolean;
  readonly onDelete: (id: number) => void;
  readonly onEdit: (id: number) => void;
}

export function ProductTable({ 
  products, 
  isLoading, 
  onDelete,
  onEdit
}: ProductTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE": return "success";
      case "INACTIVE": return "secondary";
      case "OUT_OF_STOCK": return "error";
      default: return "default";
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-container/50 border-b-2 border-outline-variant">
            <TableHead className="font-lexend font-bold uppercase tracking-widest text-[11px] text-on-surface-variant">Product</TableHead>
            <TableHead className="font-lexend font-bold uppercase tracking-widest text-[11px] text-on-surface-variant">SKU</TableHead>
            <TableHead className="font-lexend font-bold uppercase tracking-widest text-[11px] text-on-surface-variant">Category / Brand</TableHead>
            <TableHead className="font-lexend font-bold uppercase tracking-widest text-[11px] text-on-surface-variant">Price</TableHead>
            <TableHead className="font-lexend font-bold uppercase tracking-widest text-[11px] text-on-surface-variant">Stock</TableHead>
            <TableHead className="font-lexend font-bold uppercase tracking-widest text-[11px] text-on-surface-variant">Status</TableHead>
            <TableHead className="text-right font-lexend font-bold uppercase tracking-widest text-[11px] text-on-surface-variant">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <TableCell key={j}><Skeleton className="h-10 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-on-surface-variant italic font-inter">
                No products found in the catalog.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id} className="group hover:bg-primary/[0.03] transition-all duration-300 border-b border-outline-variant/30">
                <TableCell>
                  <div className="flex items-center gap-4 min-w-[240px]">
                    {product.imageUrl ? (
                      <div className="relative group/img">
                        <img src={product.imageUrl} alt="" className="w-14 h-14 rounded-xl border border-outline-variant object-cover bg-white shadow-sm transition-transform group-hover/img:scale-110" />
                        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover/img:opacity-100 rounded-xl transition-opacity" />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center text-primary border border-outline-variant">
                        <Package size={24} />
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="font-lexend font-extrabold text-sm text-on-surface truncate tracking-tight group-hover:text-primary transition-colors">
                        {product.name}
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[9px] font-bold tracking-widest uppercase py-0 px-1.5 border-outline-variant">
                          {product.gender}
                        </Badge>
                        <div className="flex items-center gap-0.5 text-secondary font-bold text-[10px]">
                          <Star size={10} fill="currentColor" />
                          {product.averageRating.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-[11px] font-bold text-on-surface-variant tracking-tighter">
                  {product.sku}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{product.categoryName}</span>
                    <span className="text-[11px] font-black text-primary italic uppercase tracking-tighter">{product.brandName}</span>
                  </div>
                </TableCell>
                <TableCell className="font-lexend font-bold text-on-surface text-sm">
                  ${product.basePrice.toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1.5 w-24">
                    <div className="h-1.5 bg-surface-container rounded-full overflow-hidden shadow-inner border border-outline-variant/20">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          product.totalStock > 20 ? "bg-primary" : product.totalStock > 0 ? "bg-secondary" : "bg-error"
                        )} 
                        style={{ width: `${Math.min(100, (product.totalStock / 50) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant flex justify-between">
                      <span>Stock</span>
                      <span className={cn(
                        product.totalStock === 0 ? "text-error" : "text-on-surface"
                      )}>{product.totalStock}</span>
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={getStatusVariant(product.status)}
                    className="font-lexend font-bold text-[9px] tracking-widest uppercase px-2 py-0.5"
                  >
                    {product.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg border-outline-variant hover:border-primary hover:text-primary transition-all"
                      onClick={() => onEdit(product.id)}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 rounded-lg border-outline-variant hover:border-error hover:text-error transition-all"
                      onClick={() => onDelete(product.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg border-outline-variant">
                      <MoreVertical size={14} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
