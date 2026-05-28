"use client";

import React from "react";
import { DollarSign, Type, ImageIcon, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PrintingPriceConfig } from "@/services/adminService";

interface PricesTabProps {
  readonly priceConfigs: PrintingPriceConfig[];
  readonly viewMode: "grid" | "table";
  readonly onEdit: (cfg: PrintingPriceConfig) => void;
  readonly onDelete: (id: number) => void;
  readonly formatCurrency: (amount: number) => string;
  readonly containerVariants: any;
  readonly itemVariants: any;
}

export default function PricesTab({
  priceConfigs,
  viewMode,
  onEdit,
  onDelete,
  formatCurrency,
  containerVariants,
  itemVariants
}: PricesTabProps) {
  if (priceConfigs.length === 0) {
    return (
      <div className="text-center py-24 bg-surface rounded-[2rem] border-2 border-dashed border-outline-variant text-on-surface-variant font-medium italic">
        <DollarSign size={48} className="mx-auto text-outline-variant mb-4 animate-bounce" />
        No element price configurations defined. Click "Add Price Config" to create one.
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
        {priceConfigs.map((cfg) => (
          <motion.div
            key={cfg.id}
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
            className="relative bg-surface rounded-[2rem] border-2 border-outline-variant p-6 flex flex-col justify-between transition-all group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="space-y-4 relative z-10">
              <div className="flex justify-between items-start">
                <span className="font-mono text-[10px] font-black text-on-surface-variant opacity-40">
                  ID: #{cfg.id}
                </span>
                
                {/* Type Icon Badge */}
                <span className={`flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                  cfg.type === "TEXT"
                    ? "bg-primary/5 text-primary border-primary/20"
                    : "bg-secondary/5 text-secondary border-secondary/20"
                }`}>
                  {cfg.type === "TEXT" ? <Type size={11} /> : <ImageIcon size={11} />}
                  {cfg.type}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-lexend font-black text-on-surface text-lg uppercase tracking-tight flex items-center gap-2">
                  Cấu hình {cfg.type === "TEXT" ? "Dòng chữ" : "Logo / Hình ảnh"}
                </h3>
                <p className="text-on-surface-variant font-medium text-xs line-clamp-3 min-h-[48px] leading-relaxed">
                  {cfg.description || "Đơn giá in cộng thêm khi tùy chỉnh thiết kế áo."}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-outline-variant/60 flex items-center justify-between relative z-10">
              <div>
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">Unit Price</p>
                <p className="font-lexend font-black text-primary text-lg italic">
                  {formatCurrency(cfg.unitPrice)}
                </p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-xl hover:border-primary hover:text-primary transition-all duration-200"
                  onClick={() => onEdit(cfg)}
                >
                  <Edit2 size={15} />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-10 w-10 rounded-xl hover:border-error hover:text-error transition-all duration-200"
                  onClick={() => onDelete(cfg.id)}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
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
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Loại phần tử</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Mô tả</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Đơn giá cộng thêm</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant font-medium">
            {priceConfigs.map((cfg) => (
              <tr key={cfg.id} className="hover:bg-surface-variant/10 transition-colors group">
                <td className="px-8 py-5 font-mono text-sm text-on-surface font-semibold">#{cfg.id}</td>
                <td className="px-8 py-5">
                  <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                    cfg.type === "TEXT" ? "bg-primary/5 text-primary border-primary/20" : "bg-secondary/5 text-secondary border-secondary/20"
                  }`}>
                    {cfg.type === "TEXT" ? <Type size={11} /> : <ImageIcon size={11} />}
                    {cfg.type}
                  </span>
                </td>
                <td className="px-8 py-5 text-on-surface-variant text-xs">{cfg.description || "N/A"}</td>
                <td className="px-8 py-5 font-mono font-bold text-primary tracking-wide">{formatCurrency(cfg.unitPrice)}</td>
                <td className="px-8 py-5 text-right">
                  <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl hover:border-primary hover:text-primary transition-all"
                      onClick={() => onEdit(cfg)}
                    >
                      <Edit2 size={15} />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl hover:border-error hover:text-error transition-all"
                      onClick={() => onDelete(cfg.id)}
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
