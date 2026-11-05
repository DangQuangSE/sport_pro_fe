"use client";

import { useParams } from "next/navigation";
import { useCallback } from "react";
import en from "@/dictionaries/en.json";
import vi from "@/dictionaries/vi.json";

const dictionaries = { en, vi };

export function useTranslation() {
  const params = useParams();
  const locale: "en" | "vi" = params.lang === "vi" ? "vi" : "en";
  const dictionary = dictionaries[locale];
  const t = useCallback((key: string): string => {
    let value: unknown = dictionary;
    for (const segment of key.split(".")) {
      if (!value || typeof value !== "object" || !(segment in value)) return key;
      value = (value as Record<string, unknown>)[segment];
    }
    return typeof value === "string" ? value : key;
  }, [dictionary]);
  return { t, locale };
}
