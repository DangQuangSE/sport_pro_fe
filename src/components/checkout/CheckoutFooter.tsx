"use client";

import React from "react";

interface CheckoutFooterProps {
  t: (key: string) => string;
}

export function CheckoutFooter({ t }: CheckoutFooterProps) {
  return (
    <footer className="border-t border-[#e2e2e7] bg-white py-16 px-8 md:px-16 text-left">
      <div className="max-w-[1280px] mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-12">
          <span
            className="text-sm font-black italic tracking-tighter uppercase leading-none"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            SPORT<br />
            <span className="text-primary">PRO</span>
          </span>

          <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] font-black uppercase tracking-widest text-[#717786]">
            <a href="#" className="hover:text-primary transition-colors">
              {t("checkout.security")}
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              {t("checkout.clause")}
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              {t("checkout.returnsExchanges")}
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              {t("checkout.contact")}
            </a>
          </div>
        </div>

        <p className="text-[10px] font-black uppercase tracking-widest text-[#717786]">
          {t("checkout.copyright")}
        </p>
      </div>
    </footer>
  );
}
