"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

// ─── Footer ──────────────────────────────────────────────────────────────────
export default function Footer() {
  const { t } = useTranslation();

  const FOOTER_COLUMNS = [
    {
      id: "shop",
      heading: t("home.footer.columns.shop"),
      links: [
        { id: "men", label: t("home.footer.links.menApparel"), href: "#" },
        { id: "women", label: t("home.footer.links.womenApparel"), href: "#" },
        { id: "footwear", label: t("home.footer.links.footwear"), href: "#" },
        { id: "accessories", label: t("home.footer.links.accessories"), href: "#" },
        { id: "sale", label: t("home.footer.links.sale"), href: "#" },
      ],
    },
    {
      id: "support",
      heading: t("home.footer.columns.support"),
      links: [
        { id: "contact", label: t("home.footer.links.contact"), href: "#" },
        { id: "returns", label: t("home.footer.links.returns"), href: "#" },
        { id: "tracking", label: t("home.footer.links.orderTracking"), href: "#" },
        { id: "size", label: t("home.footer.links.sizeGuide"), href: "#" },
        { id: "faq", label: t("home.footer.links.faq"), href: "#" },
      ],
    },
    {
      id: "legal",
      heading: t("home.footer.columns.legal"),
      links: [
        { id: "privacy", label: t("home.footer.links.privacy"), href: "#" },
        { id: "terms", label: t("home.footer.links.terms"), href: "#" },
        { id: "careers", label: t("home.footer.links.careers"), href: "#" },
      ],
    },
  ];

  return (
    <footer
      className={cn(
        "w-full py-16 px-4 sm:px-8 mt-auto",
        "bg-surface-container-low border-t-4 border-surface-variant"
      )}
    >
      <div className="max-w-[1280px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
        {/* Brand Column */}
        <div className="col-span-2 md:col-span-1 flex flex-col gap-5">
          <Link
            href="/"
            className="text-xl font-black italic tracking-tighter text-on-background flex items-center gap-0.5"
          >
            SPORT<span className="text-primary">PRO</span>
          </Link>
          <p className="text-[14px] leading-[1.6] text-on-surface-variant">
            {t("home.footer.description")}
          </p>
        </div>

        {/* Links Columns */}
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.id} className="col-span-1">
            <h4
              className="text-[14px] font-bold uppercase tracking-[0.05em] text-on-background mb-4 md:mb-6"
              style={{ fontFamily: "var(--font-lexend)" }}
            >
              {col.heading}
            </h4>
            <ul className="space-y-3 md:space-y-4">
              {col.links.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.href}
                    className={cn(
                      "text-[14px] text-on-surface-variant transition-colors",
                      "hover:text-primary",
                      link.label === "Sale" && "text-secondary font-semibold"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1280px] mx-auto mt-16 pt-8 border-t border-outline-variant text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-outline">
          {t("home.footer.copyright")}
        </p>
      </div>
    </footer>
  );
}
