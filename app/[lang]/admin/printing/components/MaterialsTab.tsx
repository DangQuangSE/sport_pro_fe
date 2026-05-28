"use client";

import React from "react";
import { Layers, CheckCircle, XCircle, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PrintingMaterial } from "@/services/adminService";

interface MaterialsTabProps {
  readonly materials: PrintingMaterial[];
  readonly viewMode: "grid" | "table";
  readonly onEdit: (mat: PrintingMaterial) => void;
  readonly onDelete: (id: number) => void;
  readonly formatCurrency: (amount: number) => string;
  readonly containerVariants: any;
  readonly itemVariants: any;
}

export default function MaterialsTab({
  materials,
  viewMode,
  onEdit,
  onDelete,
  formatCurrency,
  containerVariants,
  itemVariants
}: MaterialsTabProps) {
  if (materials.length === 0) {
    return (
      <div className="text-center py-24 bg-surface rounded-[2rem] border-2 border-dashed border-outline-variant text-on-surface-variant font-medium italic">
        <Layers size={48} className="mx-auto text-outline-variant mb-4 animate-bounce" />
        No printing materials configured. Click "Add Material" to define one.
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        {materials.map((mat) => {
          const isActive = mat.isActive !== undefined ? mat.isActive : mat.active;
          return (
            <motion.div
              key={mat.id}
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
              className="relative bg-surface rounded-[2rem] border-2 border-outline-variant p-6 flex flex-col justify-between transition-all group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="space-y-4 relative z-10">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] font-black text-on-surface-variant opacity-40">
                    ID: #{mat.id}
                  </span>
                  <span className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isActive 
                      ? "bg-success/5 text-success border-success/20" 
                      : "bg-error/5 text-error border-error/20"
                  }`}>
                    {isActive ? <CheckCircle size={10} /> : <XCircle size={10} />}
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-lexend font-black text-on-surface text-xl uppercase tracking-tight">
                    {mat.name}
                  </h3>
                  <p className="text-on-surface-variant font-medium text-xs line-clamp-3 min-h-[48px] leading-relaxed">
                    {mat.description || "Không có mô tả chất liệu."}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-outline-variant/60 flex items-center justify-between relative z-10">
                <div>
                  <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Base Price</p>
                  <p className="font-lexend font-black text-primary text-lg italic">
                    {formatCurrency(mat.basePrice)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl hover:border-primary hover:text-primary transition-all duration-200"
                    onClick={() => onEdit(mat)}
                  >
                    <Edit2 size={15} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-10 w-10 rounded-xl hover:border-error hover:text-error transition-all duration-200"
                    onClick={() => onDelete(mat.id)}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  }

  return (
    <div className="bg-surface rounded-[2rem] border-2 border-outline-variant shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-variant/30">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">ID</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Tên chất liệu</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Mô tả chi tiết</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Đơn giá gốc</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Trạng thái</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant font-medium">
            {materials.map((mat) => {
              const isActive = mat.isActive !== undefined ? mat.isActive : mat.active;
              return (
                <tr key={mat.id} className="hover:bg-surface-variant/10 transition-colors group">
                  <td className="px-8 py-5 font-mono text-sm text-on-surface font-semibold">#{mat.id}</td>
                  <td className="px-8 py-5 font-lexend font-bold text-on-surface text-base capitalize">{mat.name}</td>
                  <td className="px-8 py-5 text-on-surface-variant text-xs max-w-xs truncate">{mat.description || "N/A"}</td>
                  <td className="px-8 py-5 font-mono font-bold text-primary tracking-wide">{formatCurrency(mat.basePrice)}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      isActive ? "bg-success/5 text-success border-success/20" : "bg-error/5 text-error border-error/20"
                    }`}>
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10 rounded-xl hover:border-primary hover:text-primary transition-all"
                        onClick={() => onEdit(mat)}
                      >
                        <Edit2 size={15} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-10 w-10 rounded-xl hover:border-error hover:text-error transition-all"
                        onClick={() => onDelete(mat.id)}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
