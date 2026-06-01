"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Award, Shield, Sparkles, Crown } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export interface MembershipBadgeProps {
  tier: string;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
  className?: string;
}

const TIER_CONFIGS = {
  BRONZE: {
    bg: "from-amber-700/20 to-amber-900/30",
    border: "border-amber-700/50",
    text: "text-amber-500",
    glow: "shadow-amber-500/10",
    gradient: "from-amber-600 to-amber-800",
    icon: Award,
    key: "bronze"
  },
  SILVER: {
    bg: "from-slate-400/20 to-slate-600/30",
    border: "border-slate-500/50",
    text: "text-slate-400",
    glow: "shadow-slate-400/10",
    gradient: "from-slate-400 to-slate-600",
    icon: Shield,
    key: "silver"
  },
  GOLD: {
    bg: "from-yellow-500/20 to-amber-600/30",
    border: "border-yellow-500/40",
    text: "text-yellow-500",
    glow: "shadow-yellow-500/20",
    gradient: "from-yellow-400 to-amber-500",
    icon: Sparkles,
    key: "gold"
  },
  PLATINUM: {
    bg: "from-cyan-400/20 to-blue-600/30",
    border: "border-cyan-500/40",
    text: "text-cyan-400",
    glow: "shadow-cyan-400/20",
    gradient: "from-cyan-400 to-blue-600",
    icon: Crown,
    key: "platinum"
  }
};

export default function MembershipBadge({
  tier,
  size = "md",
  showLabel = true,
  className
}: Readonly<MembershipBadgeProps>) {
  const { t } = useTranslation();
  const normalizedTier = (tier || "BRONZE").toUpperCase() as keyof typeof TIER_CONFIGS;
  const config = TIER_CONFIGS[normalizedTier] || TIER_CONFIGS.BRONZE;
  const IconComponent = config.icon;

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[9px] gap-1",
    md: "px-3 py-1 text-[10px] gap-1.5",
    lg: "px-4 py-2 text-[12px] gap-2 rounded-2xl"
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4.5 h-4.5"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center font-black uppercase tracking-[0.1em] italic",
        "rounded-full border backdrop-blur-md shadow-sm transition-all duration-300",
        "bg-gradient-to-r",
        config.bg,
        config.border,
        config.text,
        config.glow,
        "hover:shadow-md hover:scale-[1.03]",
        sizeClasses[size],
        className
      )}
      title={`${t("profile.membership.currentTier")}: ${t(`profile.membership.${config.key}` as any)}`}
    >
      <IconComponent className={cn("animate-pulse shrink-0", iconSizes[size])} />
      {showLabel && (
        <span style={{ fontFamily: "var(--font-lexend)" }}>
          {t(`profile.membership.${config.key}` as any)}
        </span>
      )}
    </div>
  );
}
