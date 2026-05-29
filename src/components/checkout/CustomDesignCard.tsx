"use client";

import React from "react";
import Link from "next/link";
import { Wrench } from "lucide-react";

interface CustomDesignInfo {
  printingPrice: number;
  materialName: string;
  designImageUrl: string;
  textsCount: number;
  imagesCount: number;
}

interface CustomDesignCardProps {
  customDesign: CustomDesignInfo;
  printingCost: number;
  locale: string;
  onRemoveDesign: () => void;
}

export function CustomDesignCard({
  customDesign,
  printingCost,
  locale,
  onRemoveDesign,
}: CustomDesignCardProps) {
  return (
    <div className="bg-white border border-[#e2e2e7] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] p-8 space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-[#e2e2e7]">
        <div className="flex items-center gap-2">
          <Wrench className="text-primary" size={18} />
          <h3
            className="text-lg font-black uppercase tracking-tight text-[#1a1c1f]"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            Chi tiết thiết kế in ấn của bạn
          </h3>
        </div>
        <div className="flex gap-4 items-center">
          <Link
            href={`/${locale}/customizer`}
            className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
          >
            Chỉnh sửa thiết kế
          </Link>
          <span className="text-[#e2e2e7] text-xs">|</span>
          <button
            type="button"
            onClick={onRemoveDesign}
            className="text-[10px] font-black uppercase tracking-widest text-error hover:underline cursor-pointer"
          >
            Xóa thiết kế
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 items-center">
        {/* Design Preview Image */}
        <div className="w-24 h-24 bg-[#F2F2F7] rounded-xl flex items-center justify-center p-2 relative overflow-hidden border border-[#e2e2e7] shrink-0 shadow-inner">
          <img
            src={customDesign.designImageUrl}
            className="w-full h-full object-contain"
            alt="Your Custom Jersey Design"
          />
        </div>

        {/* Breakdown Specifications */}
        <div className="flex-grow w-full space-y-2 text-xs font-semibold text-[#414755] text-left">
          <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
            Thông số in ấn
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 bg-[#f9f9fe] p-4 rounded-xl border border-[#e2e2e7]">
            <span className="text-[#717786]">Chất liệu tuyển chọn:</span>
            <span className="text-[#1a1c1f] font-bold uppercase">
              {customDesign.materialName}
            </span>

            <span className="text-[#717786]">Số lớp chữ in thêm:</span>
            <span className="text-[#1a1c1f] font-bold">
              {customDesign.textsCount} lớp
            </span>

            <span className="text-[#717786]">Số logo tải lên:</span>
            <span className="text-[#1a1c1f] font-bold">
              {customDesign.imagesCount} ảnh
            </span>

            <span className="text-[#717786]">Tổng cộng chi phí in:</span>
            <span className="text-primary font-black italic">
              +${printingCost.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
