"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";
import { publicConfigService } from "@/services/publicConfigService";

function validContactUrl(value?: string): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.toString()
      : undefined;
  } catch {
    return undefined;
  }
}

export function ZaloFloatingButton() {
  const pathname = usePathname();
  const [zaloLink, setZaloLink] = useState(() =>
    validContactUrl(process.env.NEXT_PUBLIC_ZALO_LINK)
  );

  useEffect(() => {
    if (pathname?.includes("/admin")) {
      return;
    }

    let isMounted = true;
    publicConfigService.getConfigsMap().then((configs) => {
      const configuredLink = validContactUrl(configs.zalo_link);
      if (isMounted && configuredLink) {
        setZaloLink(configuredLink);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  if (pathname?.includes("/admin") || !zaloLink) {
    return null;
  }

  return (
    <a
      href={zaloLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-[44px] right-6 md:bottom-[52px] md:right-8 z-50 flex items-center justify-center group"
      aria-label="Contact via Zalo"
    >
      {/* Dynamic pulsing/flashing outer rings */}
      <span className="absolute inline-flex h-16 w-16 md:h-20 md:w-20 animate-ping rounded-full bg-blue-500 opacity-60"></span>
      <span className="absolute inline-flex h-14 w-14 md:h-18 md:w-18 animate-pulse rounded-full bg-blue-400 opacity-40"></span>

      {/* Main button element with premium shadows and hover animations */}
      <div className="relative flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-white shadow-2xl border border-blue-100 hover:scale-110 hover:rotate-6 transition-all duration-300 ease-out active:scale-95">
        <Image
          src="/zalo-icon.png"
          alt="Zalo Contact"
          width={44}
          height={44}
          className="w-9 h-9 md:w-11 md:h-11 object-contain transition-transform group-hover:scale-105"
        />
      </div>

      {/* Premium tooltip popup on hover (only visible on desktop md+) */}
      <span className="absolute right-16 md:right-18 hidden md:block scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300 origin-right bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-2 rounded-xl whitespace-nowrap shadow-lg border border-white/10 pointer-events-none">
        Chat Zalo với chúng tôi
      </span>
    </a>
  );
}
