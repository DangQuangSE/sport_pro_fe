"use client";

import React from "react";
import { 
  Edit2, 
  Trash2, 
  FolderTree
} from "lucide-react";
import { Category } from "@/services/adminService";
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

interface CategoryTableProps {
  readonly categories: Category[];
  readonly isLoading: boolean;
  readonly onEdit: (category: Category) => void;
  readonly onDelete: (id: number) => void;
}

export function CategoryTable({ 
  categories, 
  isLoading, 
  onEdit, 
  onDelete 
}: CategoryTableProps) {
  return (
    <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-variant/30">
            <TableHead className="w-[80px]">ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Order</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : categories.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-on-surface-variant italic">
                No categories found.
              </TableCell>
            </TableRow>
          ) : (
            categories.map((category) => (
              <TableRow key={category.id} className="group hover:bg-surface-variant/20 transition-colors">
                <TableCell className="font-mono text-xs text-on-surface-variant">
                  #{category.id}
                </TableCell>
                <TableCell className="font-medium text-on-surface">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <FolderTree size={14} />
                    </div>
                    {category.name}
                  </div>
                </TableCell>
                <TableCell className="text-on-surface-variant text-xs font-mono">
                  {category.slug}
                </TableCell>
                <TableCell className="text-on-surface-variant">
                  {category.parentId ? (
                    <Badge variant="secondary" className="font-normal text-[10px]">
                      ID: {category.parentId}
                    </Badge>
                  ) : (
                    <span className="text-[10px] italic opacity-50 uppercase tracking-tighter">Root</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-xs font-medium px-2 py-1 bg-surface-variant rounded">
                    {category.displayOrder}
                  </span>
                </TableCell>
                <TableCell>
                  {(() => {
                    const isActive = category.active ?? category.isActive;
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
                      onClick={() => onEdit(category)}
                    >
                      <Edit2 size={14} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 text-on-surface-variant hover:text-error hover:border-error/50 transition-all"
                      onClick={() => onDelete(category.id)}
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
