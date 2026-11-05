"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

const languages = [{ code: "en", label: "EN" }, { code: "vi", label: "VI" }] as const;

export default function LanguageToggle() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, locale } = useTranslation();
  const [pending, startTransition] = useTransition();

  function switchLanguage(next: "en" | "vi") {
    if (next === locale || pending) return;
    const segments = pathname.split("/");
    segments[1] = next;
    const destination = segments.join("/") + window.location.search + window.location.hash;
    startTransition(() => router.push(destination, { scroll: false }));
  }

  return (
    <div role="group" aria-label={t("home.nav.language")} aria-busy={pending}
      className="relative isolate grid h-8 w-[88px] shrink-0 grid-cols-2 rounded-full border border-black/[0.05] bg-surface-container-low p-1">
      <span aria-hidden="true"
        className="pointer-events-none absolute bottom-1 left-1 top-1 w-[calc((100%_-_8px)/2)] rounded-full bg-primary shadow-sm motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-out"
        style={{ transform: locale === "vi" ? "translateX(100%)" : "translateX(0)" }} />
      {languages.map(language => (
        <button type="button" key={language.code} lang={language.code}
          aria-pressed={locale === language.code} disabled={pending}
          onClick={() => switchLanguage(language.code)}
          className={cn("relative z-10 rounded-full text-[10px] font-bold tracking-widest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait",
            locale === language.code ? "text-white" : "text-on-surface-variant hover:text-on-surface")}>
          {language.label}
        </button>
      ))}
    </div>
  );
}
