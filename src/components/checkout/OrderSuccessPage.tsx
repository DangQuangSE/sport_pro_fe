"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderSuccessPageProps {
  successOrder: {
    id: number;
    shippingAddress: string;
    phoneNumber: string;
    paymentMethod: string;
    totalAmount?: number;
  };
  locale: string;
  t: (key: string) => string;
}

export function OrderSuccessPage({ successOrder, locale, t }: OrderSuccessPageProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9fe] font-sans antialiased text-[#1a1c1f]">
      {/* Simple Secure Header */}
      <header className="border-b border-[#e2e2e7] bg-white h-20 flex items-center justify-between px-8 md:px-16">
        <div className="flex items-center gap-10">
          <span
            className="text-xl font-black italic tracking-tighter uppercase leading-none"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            SPORT<br />
            <span className="text-primary">PRO</span>
          </span>
          <div className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#414755] border-l border-[#c1c6d7] pl-8">
            <Lock size={14} className="text-[#717786]" />
            <span>{t("checkout.security")}</span>
          </div>
        </div>
        <Link
          href={`/${locale}/products`}
          className="text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2"
        >
          <ArrowLeft size={14} />
          {t("checkout.continueShopping")}
        </Link>
      </header>

      <main className="flex-grow flex items-center justify-center px-8 py-20">
        <div className="max-w-xl w-full bg-white border border-[#e2e2e7] shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-[2rem] p-10 space-y-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-[80px]" />

          <div className="w-24 h-24 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto relative animate-bounce mt-4">
            <CheckCircle2 size={56} strokeWidth={1.5} />
          </div>

          <div className="space-y-3">
            <h2
              className="text-3xl font-black italic uppercase tracking-tighter text-[#1a1c1f]"
              style={{ fontFamily: "var(--font-lexend)" }}
            >
              {t("checkout.successTitle")}
            </h2>
            <p className="text-[#414755] font-semibold text-sm max-w-sm mx-auto leading-relaxed">
              {t("checkout.successDesc")}
            </p>
          </div>

          {/* Receipt Summary Card */}
          <div className="bg-[#f9f9fe] p-6 rounded-2xl border border-[#e2e2e7] text-left space-y-4">
            <div className="flex justify-between border-b border-[#e2e2e7] pb-3 text-xs uppercase tracking-widest font-black text-[#414755]">
              <span>{t("checkout.orderId")}</span>
              <span className="text-primary italic">#SP-{successOrder.id}</span>
            </div>
            <div className="space-y-2 text-xs font-semibold text-[#414755]">
              <p>
                <span className="text-[#414755]/60 uppercase block text-[10px] tracking-widest font-black mb-0.5">
                  Shipping Address
                </span>
                <span className="text-[#1a1c1f]">{successOrder.shippingAddress}</span>
              </p>
              <p>
                <span className="text-[#414755]/60 uppercase block text-[10px] tracking-widest font-black mb-0.5">
                  Phone Number
                </span>
                <span className="text-[#1a1c1f]">{successOrder.phoneNumber}</span>
              </p>
              <p>
                <span className="text-[#414755]/60 uppercase block text-[10px] tracking-widest font-black mb-0.5">
                  Payment Method
                </span>
                <span className="text-[#1a1c1f] uppercase italic font-bold">
                  {successOrder.paymentMethod}
                </span>
              </p>
            </div>
            <div className="flex justify-between border-t border-[#e2e2e7] pt-4 text-sm font-black uppercase text-[#1a1c1f]">
              <span>{t("checkout.total")}</span>
              <span className="text-lg text-primary italic font-black">
                ${successOrder.totalAmount?.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              asChild
              className="flex-1 h-14 rounded-xl bg-primary hover:bg-primary/90 text-xs font-black uppercase tracking-widest text-white"
            >
              <Link href={`/${locale}/products`}>{t("checkout.continueShopping")}</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 h-14 rounded-xl border-[#e2e2e7] hover:bg-[#f9f9fe] text-xs font-black uppercase tracking-widest"
            >
              <Link href={`/${locale}/profile/orders`}>{t("checkout.viewOrders")}</Link>
            </Button>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-[#e2e2e7] bg-white py-12 px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-10">
          <span
            className="text-sm font-black italic tracking-tighter uppercase leading-none"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            SPORT<br />PRO
          </span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-widest text-[#717786]">
          {t("checkout.copyright")}
        </p>
      </footer>
    </div>
  );
}
