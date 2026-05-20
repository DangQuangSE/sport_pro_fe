"use client";

import React from "react";
import { 
  Edit2, 
  Trash2, 
  Briefcase
} from "lucide-react";
import { Brand } from "@/services/adminService";
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

interface BrandTableProps {
  readonly brands: Brand[];
  readonly isLoading: boolean;
  readonly onEdit: (brand: Brand) => void;
  readonly onDelete: (id: number) => void;
}

export function BrandTable({ 
  brands, 
  isLoading, 
  onEdit, 
  onDelete 
}: BrandTableProps) {
  return (
    <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-variant/30">
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Brand Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : brands.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-on-surface-variant italic">
                No brands found.
              </TableCell>
            </TableRow>
          ) : (
            brands.map((brand) => (
              <TableRow key={brand.id} className="group hover:bg-surface-variant/20 transition-colors">
                <TableCell className="font-mono text-xs text-on-surface-variant">
                  #{brand.id}
                </TableCell>
                <TableCell className="font-medium text-on-surface">
                  <div className="flex items-center gap-3">
                    {brand.imageUrl ? (
                      <img src={brand.imageUrl} alt="" className="w-10 h-10 rounded border border-outline-variant object-contain bg-white p-1" />
                    ) : (
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                        <Briefcase size={16} />
                      </div>
                    )}
                    {brand.name}
                  </div>
                </TableCell>
                <TableCell className="text-on-surface-variant text-xs font-mono">
                  {brand.slug}
                </TableCell>
                <TableCell>
                  <span className="text-xs font-medium px-2 py-1 bg-surface-variant rounded">
                    {brand.displayOrder}
                  </span>
                </TableCell>
                <TableCell>
                  {(() => {
                    const isActive = brand.active ?? brand.isActive;
                    return (
                      <Badge variant={isActive ? "success" : "secondary"}>
                        {isActive ? "Active" : "Inactive"}
                      </Badge>
                    );
                  })()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all"
                      onClick={() => onEdit(brand)}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 text-on-surface-variant hover:text-error hover:border-error/50 transition-all"
                      onClick={() => onDelete(brand.id)}
                    >
                      <Trash2 size={14} />
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
