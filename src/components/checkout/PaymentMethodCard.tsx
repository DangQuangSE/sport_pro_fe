"use client";

import React from "react";
import { CreditCard, QrCode } from "lucide-react";

interface PaymentMethodCardProps {
  totalPayment: number;
  t: (key: string) => string;
}

export function PaymentMethodCard({ totalPayment, t }: PaymentMethodCardProps) {
  return (
    <div className="bg-white border border-[#e2e2e7] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] p-8">
      <div className="flex items-center gap-3 pb-6 border-b border-[#e2e2e7]">
        <QrCode className="text-[#0058bc]" size={20} />
        <h3
          className="text-lg font-black uppercase tracking-tight text-[#1a1c1f]"
          style={{ fontFamily: "var(--font-lexend)" }}
        >
          {t("checkout.paymentMethods")}
        </h3>
      </div>

      <div className="mt-6">
        {/* PayOS is the single online payment method for checkout. */}
        <div className="border-2 border-primary bg-primary/[0.02] p-8 rounded-3xl text-left flex flex-col md:flex-row gap-8 items-center">
          {/* Hidden radio for semantics */}
          <div className="hidden">
            <input type="radio" checked readOnly className="text-primary focus:ring-primary" />
          </div>

          {/* PayOS brand and QR hint */}
          <div className="w-[140px] h-[140px] bg-white border border-[#e2e2e7] rounded-2xl flex items-center justify-center p-2 shrink-0 shadow-sm relative group overflow-hidden">
            <div className="flex flex-col items-center gap-3 text-primary">
              <QrCode size={62} strokeWidth={1.4} />
              <span className="text-xl font-black tracking-tight">PayOS</span>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-2 text-sm text-[#414755] font-semibold">
            <p className="text-xs font-black uppercase tracking-widest text-[#0058bc] pb-1">
              PayOS
            </p>
            <p>
              <CreditCard size={15} className="inline mr-2 text-primary" />
              {t("checkout.payosDescription") || "Thanh toán nhanh qua QR hoặc thẻ ngân hàng"}
            </p>
            <p>
              {t("checkout.payosRedirect") || "Sau khi xác nhận, bạn sẽ được chuyển đến trang thanh toán PayOS."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
