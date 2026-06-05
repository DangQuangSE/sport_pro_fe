"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const { locale } = useTranslation();

  return (
    <div className="flex flex-wrap items-center gap-2 text-[10px] font-lexend font-black uppercase tracking-widest text-on-surface-variant">
      <Link href={`/${locale}`} className="hover:text-primary transition-colors">
        {locale === "vi" ? "Trang chủ" : "Home"}
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight size={10} className="text-outline-variant shrink-0" />
          {item.href ? (
            <Link href={`/${locale}${item.href}`} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-on-surface truncate max-w-[150px] sm:max-w-none">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
