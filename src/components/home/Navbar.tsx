"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, User, ShoppingCart, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────
interface NavbarProps {
  cartCount?: number;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navbar({ cartCount = 3 }: Readonly<NavbarProps>) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t, locale } = useTranslation();
  const { isLoggedIn, logout } = useAuth();
  const router = useRouter();

  const NAV_LINKS = [
    { id: "men", label: t("home.nav.men"), href: "#", active: true },
    { id: "women", label: t("home.nav.women"), href: "#" },
    { id: "running", label: t("home.nav.running"), href: "#" },
    { id: "training", label: t("home.nav.training"), href: "#" },
    { id: "sale", label: t("home.nav.sale"), href: "#" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50",
        "bg-white/90 backdrop-blur-md",
        "border-b border-black/[0.05]",
        "shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04),0_4px_20px_-2px_rgba(0,0,0,0.02)]"
      )}
    >
      <div className="flex justify-between items-center px-8 h-20 w-full max-w-[1280px] mx-auto">
        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-black italic tracking-tighter text-on-background flex items-center gap-0.5"
        >
          SPORT<span className="text-primary">PRO</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              className={cn(
                "text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors",
                link.active
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-on-surface hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-5">
          {/* Search Pill — Desktop */}
          <div
            className={cn(
              "hidden lg:flex items-center gap-2",
              "bg-surface-container rounded-full px-4 py-2",
              "border border-outline-variant",
              "focus-within:border-primary transition-colors"
            )}
          >
            <Search className="text-on-surface-variant w-4 h-4 shrink-0" />
            <input
              type="text"
              placeholder={t("home.nav.searchPlaceholder")}
              className={cn(
                "bg-transparent border-none focus:ring-0 outline-none",
                "text-sm w-28 focus:w-44 transition-all duration-300",
                "text-on-surface placeholder:text-on-surface-variant"
              )}
            />
          </div>

          {/* Search icon — Mobile */}
          <button
            aria-label="Search"
            className="text-on-surface hover:text-primary transition-colors lg:hidden"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User Auth Actions */}
          {isLoggedIn ? (
            <button
              onClick={logout}
              className="text-[12px] font-bold uppercase tracking-wider text-on-surface hover:text-primary transition-colors"
            >
              {t("auth.signOutButton")}
            </button>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="text-[12px] font-bold uppercase tracking-wider text-on-surface hover:text-primary transition-colors"
            >
              {t("auth.signInButton")}
            </Link>
          )}

          <button
            aria-label="Account"
            className="text-on-surface hover:text-primary transition-colors"
          >
            <User className="w-5 h-5" />
          </button>

          {/* Cart */}
          <button
            aria-label={`Cart — ${cartCount} items`}
            className="text-on-surface hover:text-primary transition-colors relative"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span
                className={cn(
                  "absolute -top-1.5 -right-1.5",
                  "bg-secondary-container text-[10px] font-bold",
                  "w-[18px] h-[18px] rounded-full",
                  "flex items-center justify-center text-white"
                )}
              >
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden text-on-surface hover:text-primary transition-colors"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Language Switcher */}
          <div className="hidden sm:block ml-2 border-l border-outline-variant pl-4">
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-outline-variant px-8 py-6 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "text-sm font-semibold uppercase tracking-widest transition-colors",
                link.active ? "text-primary" : "text-on-surface hover:text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="border-t border-outline-variant mt-4 pt-4 flex flex-col gap-4">
            {isLoggedIn ? (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-sm font-bold uppercase tracking-widest text-on-surface hover:text-primary text-left transition-colors"
              >
                {t("auth.signOutButton")}
              </button>
            ) : (
              <Link
                href={`/${locale}/login`}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-on-surface hover:text-primary transition-colors"
              >
                {t("auth.signInButton")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
