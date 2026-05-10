"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { HERO_SHOE_IMAGE, HERO_INLINE_IMAGE } from "@/data/homeData";
import { Truck, BadgeCheck, RefreshCw } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

// ─── Trust Indicator sub-component ───────────────────────────────────────────
interface TrustItemProps {
  icon: React.ReactNode;
  label: string;
}

function TrustItem({ icon, label }: Readonly<TrustItemProps>) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-outline">{icon}</span>
      <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-on-surface-variant">
        {label}
      </span>
    </div>
  );
}

// ─── HeroSection ─────────────────────────────────────────────────────────────
export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section
      className={cn(
        "max-w-[1280px] mx-auto px-8",
        "py-16 lg:py-24",
        "grid grid-cols-1 lg:grid-cols-12 gap-8",
        "items-center min-h-[calc(100dvh-80px)]"
      )}
    >
      {/* Left — Text Content */}
      <div className="lg:col-span-7 flex flex-col items-start gap-8">
        {/* Overline badge */}
        <div
          className={cn(
            "inline-flex items-center gap-2",
            "bg-surface-container rounded-full px-3 py-1.5",
            "border border-outline-variant"
          )}
        >
          <span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-primary">
            {t("home.hero.overline")}
          </span>
        </div>

        {/* Headline with inline image punctuation */}
        <h1
          className={cn(
            "font-black italic tracking-tight text-on-background leading-[1.05]",
            "text-[44px] lg:text-[64px]"
          )}
          style={{ fontFamily: "var(--font-lexend)" }}
        >
          {t("home.hero.title")}
          <span
            className={cn(
              "inline-block align-middle mx-3",
              "w-[60px] h-[36px] lg:w-[80px] lg:h-[44px]",
              "rounded-full overflow-hidden",
              "border-2 border-outline-variant shadow-sm",
              "-rotate-6"
            )}
          >
            <Image
              src={HERO_INLINE_IMAGE}
              alt="Close-up of athletic running shoe mesh texture"
              width={80}
              height={44}
              className="w-full h-full object-cover"
            />
          </span>
          <br />
          {t("home.hero.titlePunctuation")}
        </h1>

        {/* Body Copy */}
        <p className="text-[18px] leading-[1.6] text-on-surface-variant max-w-[540px]">
          {t("home.hero.subtitle")}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button
            className={cn(
              "bg-secondary-container text-white",
              "font-semibold text-[12px] uppercase tracking-[0.05em]",
              "px-8 py-4 rounded-full",
              "transition-all duration-200 active:scale-[0.98]",
              "shadow-[0_4px_12px_rgba(254,148,0,0.3)]",
              "hover:bg-secondary"
            )}
          >
            {t("home.hero.ctaPrimary")}
          </button>
          <button
            className={cn(
              "bg-transparent text-primary border-2 border-primary",
              "font-semibold text-[12px] uppercase tracking-[0.05em]",
              "px-8 py-4 rounded-full",
              "transition-all duration-200 active:scale-[0.98]",
              "hover:bg-primary/5"
            )}
          >
            {t("home.hero.ctaSecondary")}
          </button>
        </div>

        {/* Trust Indicators */}
        <div
          className={cn(
            "flex flex-wrap items-center gap-6",
            "pt-6 border-t border-surface-variant w-full"
          )}
        >
          <TrustItem icon={<Truck className="w-4 h-4" />} label={t("home.hero.trust.shipping")} />
          <TrustItem icon={<BadgeCheck className="w-4 h-4" />} label={t("home.hero.trust.authentic")} />
          <TrustItem icon={<RefreshCw className="w-4 h-4" />} label={t("home.hero.trust.returns")} />
        </div>
      </div>

      {/* Right — Hero Product Image */}
      <div className="lg:col-span-5 relative mt-8 lg:mt-0 flex items-center justify-center">
        {/* Ambient glow blob */}
        <div className="absolute -top-10 -right-10 w-[110%] h-[110%] bg-surface-container rounded-full opacity-40 blur-3xl -z-10 pointer-events-none" />

        <div
          className={cn(
            "relative bg-surface-container-lowest rounded-xl p-8",
            "border border-black/[0.03]",
            "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08),0_10px_20px_-5px_rgba(0,0,0,0.02)]",
            "lg:rotate-3 lg:hover:rotate-0 transition-transform duration-500 ease-out",
            "w-full max-w-[440px]"
          )}
        >
          {/* New Drop Badge */}
          <div
            className={cn(
              "absolute -top-4 -left-4 z-20",
              "bg-secondary-container text-white",
              "text-[10px] font-bold uppercase tracking-[0.08em]",
              "px-4 py-1.5 rounded-full shadow-md",
              "-rotate-12"
            )}
          >
            {t("home.hero.badge")}
          </div>

          <Image
            src={HERO_SHOE_IMAGE}
            alt="High-performance neon green and black running shoe — studio shot"
            width={440}
            height={440}
            priority
            className="w-full h-auto object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)]"
          />
        </div>
      </div>
    </section>
  );
}
