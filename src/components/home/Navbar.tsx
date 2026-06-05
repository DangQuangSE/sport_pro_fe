"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, User, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import LanguageToggle from "@/components/ui/LanguageToggle";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { productService } from "@/services/productService";
import { motion, AnimatePresence } from "framer-motion";
import MembershipBadge from "@/components/ui/MembershipBadge";

// ─── Component ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordionOpen, setMobileAccordionOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  
  const { t, locale } = useTranslation();
  const { isLoggedIn, logout, user } = useAuth();
  const { cart } = useCart();
  const router = useRouter();
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const cartCount = cart?.items?.length ?? 0;

  // Load categories on mount
  useEffect(() => {
    productService.getCategoryTree()
      .then((res) => {
        if (res && res.data) {
          setCategories(res.data);
        }
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
      });
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50",
        "bg-white/90 backdrop-blur-md",
        "border-b border-black/[0.05]",
        "shadow-[0_2px_15px_-3px_rgba(0,0,0,0.04),0_4px_20px_-2px_rgba(0,0,0,0.02)]"
      )}
    >
      <div className="flex justify-between items-center px-4 sm:px-8 h-20 w-full max-w-[1280px] mx-auto">
        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-black italic tracking-tighter text-on-background flex items-center gap-0.5"
        >
          SPORT<span className="text-primary">PRO</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8 relative h-full" ref={dropdownRef}>
          {/* Shop All Gear link */}
          <Link
            href={`/${locale}/products`}
            className="text-[12px] font-semibold uppercase tracking-[0.08em] text-on-surface hover:text-primary transition-colors"
          >
            {t("home.nav.shop")}
          </Link>

          {/* Categories Dropdown Trigger */}
          <div 
            className="relative flex items-center h-full"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <button
              suppressHydrationWarning
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={cn(
                "text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors flex items-center gap-1.5 py-2 cursor-pointer outline-none focus:outline-none h-full",
                dropdownOpen ? "text-primary" : "text-on-surface hover:text-primary"
              )}
            >
              {t("home.nav.categories")}
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", dropdownOpen && "rotate-180")} />
            </button>

            {/* Premium Animated Dropdown — Vertical Layout */}
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  className={cn(
                    "absolute top-full left-0 mt-1 z-50",
                    "min-w-[240px] bg-white/95 backdrop-blur-md border border-outline-variant shadow-2xl rounded-xl py-2",
                    "flex flex-col"
                  )}
                >
                  {categories.length === 0 ? (
                    <div className="text-center py-6 px-4 text-on-surface-variant text-sm">
                      Đang tải danh mục...
                    </div>
                  ) : (
                    categories.map((category, idx) => (
                      <div key={category.id}>
                        {idx > 0 && <div className="mx-3 border-t border-outline-variant/40" />}
                        <Link
                          href={`/${locale}/products?category=${category.slug}`}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2.5 font-bold text-[13px] uppercase tracking-wider text-on-surface hover:text-primary hover:bg-primary/5 transition-all"
                        >
                          {category.name}
                        </Link>
                        {category.children && category.children.length > 0 && (
                          <div className="flex flex-col">
                            {category.children.map((child: any) => (
                              <Link
                                key={child.id}
                                href={`/${locale}/products?category=${child.slug}`}
                                onClick={() => setDropdownOpen(false)}
                                className="px-4 pl-7 py-2 text-[12px] font-medium text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all"
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sale Promotion link */}
          <Link
            href={`/${locale}/products?sale=true`}
            className="text-[12px] font-semibold uppercase tracking-[0.08em] text-on-surface hover:text-primary transition-colors"
          >
            {t("home.nav.sale")}
          </Link>

          {/* Admin link */}
          {isLoggedIn && user?.role === "ADMIN" && (
            <Link
              href={`/${locale}/admin`}
              className="text-[12px] font-bold uppercase tracking-[0.08em] text-primary hover:text-primary/80 transition-colors"
            >
              {t("home.nav.admin")}
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 sm:gap-5">
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
              suppressHydrationWarning
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
            suppressHydrationWarning
            aria-label="Search"
            className="text-on-surface hover:text-primary transition-colors lg:hidden"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* User Auth Actions */}
          {isLoggedIn ? (
            <button
              suppressHydrationWarning
              onClick={logout}
              className="hidden md:block text-[12px] font-bold uppercase tracking-wider text-on-surface hover:text-primary transition-colors cursor-pointer"
            >
              {t("auth.signOutButton")}
            </button>
          ) : (
            <Link
              href={`/${locale}/login`}
              className="hidden md:block text-[12px] font-bold uppercase tracking-wider text-on-surface hover:text-primary transition-colors"
            >
              {t("auth.signInButton")}
            </Link>
          )}

          {/* User Profile / Login Link */}
          <div className="hidden sm:flex items-center gap-2">
            {isLoggedIn && user && (
              <Link href={`/${locale}/profile`} className="hidden md:inline-flex shrink-0">
                <MembershipBadge tier={user.tier} size="sm" showLabel={true} />
              </Link>
            )}
            <Link
              href={isLoggedIn ? `/${locale}/profile` : `/${locale}/login`}
              aria-label={t("home.nav.account") || "Account"}
              className="text-on-surface hover:text-primary transition-colors flex items-center"
            >
              <User className="w-5 h-5" />
            </Link>
          </div>

          {/* Cart */}
          <Link
            href={`/${locale}/cart`}
            suppressHydrationWarning
            aria-label={t("home.nav.cart")?.replace("{count}", String(cartCount)) || `Cart — ${cartCount} items`}
            className="text-on-surface hover:text-primary transition-colors relative cursor-pointer block"
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
          </Link>

          {/* Mobile menu toggle */}
          <button
            suppressHydrationWarning
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden text-on-surface hover:text-primary transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Language Switcher */}
          <div className="hidden md:block ml-2 border-l border-outline-variant pl-4">
            <LanguageToggle />
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-outline-variant px-4 sm:px-8 py-6 flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          {/* Shop All Gear link */}
          <Link
            href={`/${locale}/products`}
            onClick={() => setMobileOpen(false)}
            className="text-sm font-bold uppercase tracking-widest text-on-surface hover:text-primary py-2 transition-colors block"
          >
            {t("home.nav.shop")}
          </Link>

          {/* Categories Accordion */}
          <div className="space-y-2">
            <button
              suppressHydrationWarning
              onClick={() => setMobileAccordionOpen(!mobileAccordionOpen)}
              className="w-full flex justify-between items-center text-sm font-bold uppercase tracking-widest text-on-surface py-2 outline-none focus:outline-none cursor-pointer"
            >
              <span>{t("home.nav.categories")}</span>
              <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", mobileAccordionOpen && "rotate-180")} />
            </button>

            {/* Dynamic Mobile Categories */}
            {mobileAccordionOpen && (
              <div className="pl-4 border-l border-outline-variant space-y-4 py-2">
                {categories.length === 0 ? (
                  <div className="text-xs text-on-surface-variant">Đang tải danh mục...</div>
                ) : (
                  categories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <Link
                        href={`/${locale}/products?category=${category.slug}`}
                        onClick={() => setMobileOpen(false)}
                        className="text-xs font-bold uppercase tracking-wider text-on-surface block"
                      >
                        {category.name}
                      </Link>
                      {category.children && category.children.length > 0 && (
                        <div className="pl-3 space-y-2 border-l border-outline-variant/60">
                          {category.children.map((child: any) => (
                            <Link
                              key={child.id}
                              href={`/${locale}/products?category=${child.slug}`}
                              onClick={() => setMobileOpen(false)}
                              className="text-xs font-medium text-on-surface-variant block"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Static Sale tab */}
          <Link
            href={`/${locale}/products?sale=true`}
            onClick={() => setMobileOpen(false)}
            className="text-sm font-bold uppercase tracking-widest text-on-surface hover:text-primary py-2 transition-colors block"
          >
            {t("home.nav.sale")}
          </Link>

          {/* Admin link */}
          {isLoggedIn && user?.role === "ADMIN" && (
            <Link
              href={`/${locale}/admin`}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-bold uppercase tracking-widest text-primary hover:text-primary/80 py-2 transition-colors block"
            >
              {t("home.nav.admin")}
            </Link>
          )}

          <div className="border-t border-outline-variant mt-4 pt-4 flex flex-col gap-4">
            {isLoggedIn && user && (
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Membership Status</span>
                <MembershipBadge tier={user.tier} size="sm" showLabel={true} />
              </div>
            )}
            {isLoggedIn && (
              <Link
                href={`/${locale}/profile`}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-on-surface hover:text-primary py-2 transition-colors block"
              >
                {t("home.nav.account")}
              </Link>
            )}
            <div className="flex items-center justify-between px-1 py-2 border-t border-outline-variant/40">
              <span className="text-sm font-bold uppercase tracking-widest text-on-surface">
                {t("home.nav.language")}
              </span>
              <LanguageToggle />
            </div>
            {isLoggedIn ? (
              <button
                suppressHydrationWarning
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="text-sm font-bold uppercase tracking-widest text-on-surface hover:text-primary text-left transition-colors cursor-pointer border-t border-outline-variant/40 pt-4"
              >
                {t("auth.signOutButton")}
              </button>
            ) : (
              <Link
                href={`/${locale}/login`}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-on-surface hover:text-primary transition-colors border-t border-outline-variant/40 pt-4"
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
