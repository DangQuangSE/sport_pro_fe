"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { publicConfigService } from "@/services/publicConfigService";

export function ZaloFloatingButton() {
  const pathname = usePathname();
  const [zaloLink, setZaloLink] = useState(
    process.env.NEXT_PUBLIC_ZALO_LINK
  );

  useEffect(() => {
    if (pathname?.includes("/admin")) {
      return;
    }

    let isMounted = true;
    publicConfigService.getConfigByKey("zalo_link").then((data) => {
      if (isMounted && data?.configValue) {
        setZaloLink(data.configValue);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  if (pathname?.includes("/admin")) {
    return null;
  }

  return (
    <a
      href={zaloLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center group"
      aria-label="Contact via Zalo"
    >
      {/* Dynamic pulsing/flashing outer rings */}
      <span className="absolute inline-flex h-16 w-16 animate-ping rounded-full bg-blue-500 opacity-60"></span>
      <span className="absolute inline-flex h-14 w-14 animate-pulse rounded-full bg-blue-400 opacity-40"></span>

      {/* Main button element with premium shadows and hover animations */}
      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-2xl border border-blue-100 hover:scale-110 hover:rotate-6 transition-all duration-300 ease-out active:scale-95">
        <Image
          src="/zalo-icon.png"
          alt="Zalo Contact"
          width={36}
          height={36}
          className="object-contain transition-transform group-hover:scale-105"
        />
      </div>

      {/* Premium tooltip popup on hover */}
      <span className="absolute right-16 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300 origin-right bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-2 rounded-xl whitespace-nowrap shadow-lg border border-white/10 pointer-events-none">
        Chat Zalo với chúng tôi
      </span>
    </a>
  );
}
