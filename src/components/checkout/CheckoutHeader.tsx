"use client";

import React from "react";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";
import { BRAND_CONFIG } from "@/constants/brand";

interface CheckoutHeaderProps {
  locale: string;
  backHref: string;
  backLabel: string;
  securityLabel: string;
}

export function CheckoutHeader({
  locale,
  backHref,
  backLabel,
  securityLabel,
}: CheckoutHeaderProps) {
  return (
    <header className="border-b border-[#e2e2e7] bg-white h-20 flex items-center justify-between px-8 md:px-16">
      <div className="flex items-center gap-10">
        <Link
          href={`/${locale}`}
          className="flex items-center hover:opacity-90 transition-opacity"
        >
          <img
            src={BRAND_CONFIG.logo}
            alt={BRAND_CONFIG.alt}
            className="h-12 w-auto object-contain"
          />
        </Link>
        <div className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#414755] border-l border-[#c1c6d7] pl-8">
          <Lock size={14} className="text-[#717786]" />
          <span>{securityLabel}</span>
        </div>
      </div>
      <Link
        href={backHref}
        className="text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2"
      >
        <ArrowLeft size={14} />
        {backLabel}
      </Link>
    </header>
  );
}
