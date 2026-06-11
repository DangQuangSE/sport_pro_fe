"use client";

import React from "react";
import { Type } from "lucide-react";
import { AdminActionButtons } from "@/components/admin/shared/AdminActionButtons";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Font {
  id: number;
  name: string;
  displayName: string;
}

interface FontsTabProps {
  readonly fonts: Font[];
  readonly viewMode: "grid" | "table";
  readonly onEdit: (font: Font) => void;
  readonly onDelete: (id: number) => void;
  readonly containerVariants: any;
  readonly itemVariants: any;
}

export default function FontsTab({
  fonts,
  viewMode,
  onEdit,
  onDelete,
  containerVariants,
  itemVariants
}: FontsTabProps) {
  if (fonts.length === 0) {
    return (
      <div className="text-center py-24 bg-surface rounded-[2rem] border-2 border-dashed border-outline-variant text-on-surface-variant font-medium italic">
        <Type size={48} className="mx-auto text-outline-variant mb-4 animate-bounce" />
        No sports fonts configured. Click "Add Font Family" to register one.
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
        {fonts.map((f) => (
          <motion.div
            key={f.id}
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05)" }}
            className="relative bg-surface rounded-[2rem] border-2 border-outline-variant p-6 flex flex-col justify-between transition-all group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="space-y-3 relative z-10">
              <span className="font-mono text-[10px] font-black text-on-surface-variant opacity-40">
                ID: #{f.id}
              </span>
              <div>
                <h3 className="font-lexend font-black text-on-surface text-lg truncate">
                  {f.displayName}
                </h3>
                <p className="text-[10px] font-mono font-bold text-primary mt-0.5">
                  Font-family: {f.name}
                </p>
              </div>

              {/* Font Preview Area */}
              <div className="bg-[#f9f9fe] border border-outline-variant/60 rounded-xl p-3 text-center my-3 min-h-[50px] flex items-center justify-center">
                <span style={{ fontFamily: f.name }} className="text-xl font-bold truncate">
                  SPORT PRO 10
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-outline-variant/60 relative z-10">
              <AdminActionButtons
                onEdit={() => onEdit(f)}
                onDelete={() => onDelete(f.id)}
                className="justify-end"
              />
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
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Tên hiển thị</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Mã Font Family</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60">Xem trước</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-on-surface-variant opacity-60 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant font-medium">
            {fonts.map((f) => (
              <tr key={f.id} className="hover:bg-surface-variant/10 transition-colors group">
                <td className="px-8 py-5 font-mono text-sm text-on-surface font-semibold">#{f.id}</td>
                <td className="px-8 py-5 font-lexend font-bold text-on-surface text-base">{f.displayName}</td>
                <td className="px-8 py-5 font-mono text-primary text-xs">{f.name}</td>
                <td className="px-8 py-5">
                  <span style={{ fontFamily: f.name }} className="text-base font-bold">SPORT PRO 10</span>
                </td>
                <td className="px-8 py-5 text-right">
                  <AdminActionButtons
                    onEdit={() => onEdit(f)}
                    onDelete={() => onDelete(f.id)}
                    className="justify-end"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
