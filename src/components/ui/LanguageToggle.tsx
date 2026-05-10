"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// ─── LanguageToggle ──────────────────────────────────────────────────────────
// Principle: Pill toggle with spring physics for premium interaction feel.

export default function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();

  // Extract locale from pathname (e.g., /en/products -> en)
  const segments = pathname.split("/");
  const currentLocale = segments[1] || "en";

  const switchLanguage = (newLocale: string) => {
    if (newLocale === currentLocale) return;
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const languages = [
    { code: "en", label: "EN" },
    { code: "vi", label: "VI" },
  ];

  return (
    <div className="flex items-center gap-1 bg-surface-container-low p-1 rounded-full border border-black/[0.05] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
      {languages.map((lang) => {
        const isActive = currentLocale === lang.code;
        return (
          <button
            key={lang.code}
            onClick={() => switchLanguage(lang.code)}
            className={cn(
              "relative px-3 py-1 rounded-full text-[10px] font-bold tracking-widest transition-colors z-10",
              isActive
                ? "text-white"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-locale"
                className="absolute inset-0 bg-primary rounded-full -z-10 shadow-[0_4px_12px_rgba(0,88,188,0.25)]"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
