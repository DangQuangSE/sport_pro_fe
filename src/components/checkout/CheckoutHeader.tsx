"use client";

import React from "react";
import Link from "next/link";
import { Lock, ArrowLeft } from "lucide-react";

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
        <span
          className="text-xl font-black italic tracking-tighter uppercase leading-none"
          style={{ fontFamily: "var(--font-lexend)" }}
        >
          SPORT<br />
          <span className="text-primary">PRO</span>
        </span>
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
