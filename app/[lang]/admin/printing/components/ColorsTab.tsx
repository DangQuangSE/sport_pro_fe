"use client";

import React from "react";
import { Printer, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Color } from "@/services/adminService";

interface ColorsTabProps {
  readonly colors: Color[];
  readonly viewMode: "grid" | "table";
  readonly onEdit: (color: Color) => void;
  readonly onDelete: (id: number) => void;
  readonly containerVariants: any;
  readonly itemVariants: any;
}

export default function ColorsTab({
  colors,
  viewMode,
  onEdit,
  onDelete,
  containerVariants,
  itemVariants
}: ColorsTabProps) {
  if (colors.length === 0) {
    return (
      <div className="text-center py-24 bg-surface rounded-[2rem] border-2 border-dashed border-outline-variant text-on-surface-variant font-medium italic">
        <Printer size={48} className="mx-auto text-outline-variant mb-4 animate-bounce" />
        No custom colors defined yet. Click "Add Color Swatch" to create one.
      </div>
    );
  }

  if (viewMode === "grid") {
    return (
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
      >
        {colors.map((color) => (
          <motion.div
            key={color.id}
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
            className="relative bg-surface rounded-[2rem] border-2 border-outline-variant p-6 flex flex-col items-center text-center transition-all group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <span className="absolute top-4 left-5 font-mono text-[10px] font-black text-on-surface-variant opacity-40">
              ID: #{color.id}
            </span>

            <div 
              className="w-16 h-16 rounded-full border-4 border-surface shadow-md my-3 flex-shrink-0 relative overflow-hidden"
              style={{ backgroundColor: color.hexCode }}
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10" />
            </div>

            <div className="space-y-1 w-full">
              <h3 className="font-lexend font-bold text-on-surface text-sm truncate px-1" title={color.name}>
                {color.name}
              </h3>
              <p className="font-mono font-bold text-primary tracking-wide text-xs">
                {color.hexCode.toUpperCase()}
              </p>
            </div>

            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-lg hover:border-primary hover:text-primary"
                onClick={() => onEdit(color)}
              >
                <Edit2 size={13} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-lg hover:border-error hover:text-error"
                onClick={() => onDelete(color.id)}
              >
                <Trash2 size={13} />
              </Button>
            </div>
          </motion.div>
        ))}
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
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Tên màu sắc</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Mã màu HEX</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Xem trước</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant font-medium">
            {colors.map((color) => (
              <tr key={color.id} className="hover:bg-surface-variant/10 transition-colors group">
                <td className="px-8 py-5 font-mono text-sm text-on-surface font-semibold">#{color.id}</td>
                <td className="px-8 py-5 font-lexend font-bold text-on-surface text-base">{color.name}</td>
                <td className="px-8 py-5 font-mono font-bold text-primary tracking-wide">{color.hexCode.toUpperCase()}</td>
                <td className="px-8 py-5">
                  <div 
                    className="w-7 h-7 rounded-full border border-outline-variant/60 shadow-inner"
                    style={{ backgroundColor: color.hexCode }}
                  />
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl hover:border-primary"
                      onClick={() => onEdit(color)}
                    >
                      <Edit2 size={15} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl hover:border-error"
                      onClick={() => onDelete(color.id)}
                    >
                      <Trash2 size={15} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
