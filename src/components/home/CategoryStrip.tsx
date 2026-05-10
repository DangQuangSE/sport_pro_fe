"use client";

import Link from "next/link";
import {
  Footprints,
  Dumbbell,
  Circle,
  Trophy,
  Mountain,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/data/homeData";
import { useTranslation } from "@/hooks/useTranslation";

// ─── Icon map ─────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ReactNode> = {
  Footprints: <Footprints className="w-4 h-4" />,
  Dumbbell: <Dumbbell className="w-4 h-4" />,
  Circle: <Circle className="w-4 h-4" />,
  Trophy: <Trophy className="w-4 h-4" />,
  Mountain: <Mountain className="w-4 h-4" />,
  Tag: <Tag className="w-4 h-4" />,
};

// ─── CategoryStrip ────────────────────────────────────────────────────────────
export default function CategoryStrip() {
  const { t } = useTranslation();

  const categories = CATEGORIES.map((cat) => ({
    ...cat,
    label: t(`home.categories.${cat.label.toLowerCase()}`),
  }));

  return (
    <section className="border-y border-surface-variant bg-surface-container-lowest py-5 overflow-x-auto">
      {/* hide-scrollbar via CSS in globals */}
      <div className="flex items-center gap-3 px-8 max-w-[1280px] mx-auto min-w-max">
        {categories.map((cat) => (
          <Link
            key={cat.icon}
            href={cat.href}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-full",
              "text-[12px] font-semibold uppercase tracking-[0.05em]",
              "transition-all duration-200",
              cat.active
                ? "bg-on-surface text-white shadow-[0_4px_12px_rgba(0,0,0,0.15)]"
                : "bg-surface-container text-on-surface border border-outline-variant hover:bg-surface-variant"
            )}
          >
            {ICON_MAP[cat.icon]}
            {cat.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
