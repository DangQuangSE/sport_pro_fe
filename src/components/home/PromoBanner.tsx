"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { PROMO_BANNER_IMAGE } from "@/data/homeData";
import { useTranslation } from "@/hooks/useTranslation";

// ─── PromoBanner ─────────────────────────────────────────────────────────────
export default function PromoBanner() {
  const { t } = useTranslation();

  return (
    <section className="max-w-[1280px] mx-auto px-8 mb-24">
      <div
        className={cn(
          "bg-on-surface rounded-2xl overflow-hidden relative min-h-[400px]",
          "flex items-center p-8 md:p-16 border border-white/10",
          "shadow-2xl"
        )}
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src={PROMO_BANNER_IMAGE}
            alt="Abstract motion blur of runners on a track at night — high energy urban athletic vibe"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-[520px]">
          <span
            className={cn(
              "text-[12px] font-semibold uppercase tracking-[0.2em] mb-4 block",
              "text-secondary-fixed"
            )}
          >
            {t("home.promo.overline")}
          </span>
          <h2
            className="text-[36px] lg:text-[48px] font-bold leading-[1.1] text-white mb-6"
            style={{ fontFamily: "var(--font-lexend)" }}
          >
            {t("home.promo.title")}
          </h2>
          <p className="text-[18px] leading-[1.6] text-surface-container-low mb-8">
            {t("home.promo.subtitle")}
          </p>
          <button
            suppressHydrationWarning
            className={cn(
              "bg-transparent border-2 border-primary-fixed text-primary-fixed",
              "hover:bg-primary-fixed hover:text-on-primary-fixed",
              "font-semibold text-[12px] uppercase tracking-[0.05em]",
              "px-8 py-3 rounded-full transition-all duration-300"
            )}
          >
            {t("home.promo.cta")}
          </button>
        </div>
      </div>
    </section>
  );
}
