"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Hash, 
  Palette,
  Printer,
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { BRAND_CONFIG } from "@/constants/brand";

const sidebarItems = [
  { icon: LayoutDashboard, labelKey: "admin.sidebar.dashboard", defaultLabel: "Dashboard", href: "/admin" },
  { icon: Package, labelKey: "admin.sidebar.products", defaultLabel: "Products", href: "/admin/products" },
  { icon: Tag, labelKey: "admin.sidebar.categories", defaultLabel: "Categories", href: "/admin/categories" },
  { icon: Hash, labelKey: "admin.sidebar.brands", defaultLabel: "Brands", href: "/admin/brands" },
  { icon: Palette, labelKey: "admin.sidebar.colors", defaultLabel: "Colors", href: "/admin/colors" },
  { icon: Printer, labelKey: "admin.sidebar.printing", defaultLabel: "Printing", href: "/admin/printing" },
  { icon: ShoppingCart, labelKey: "admin.sidebar.orders", defaultLabel: "Orders", href: "/admin/orders" },
  { icon: MessageSquare, labelKey: "admin.sidebar.reviews", defaultLabel: "Reviews", href: "/admin/reviews" },
  { icon: Users, labelKey: "admin.sidebar.users", defaultLabel: "Users", href: "/admin/users" },
  { icon: BarChart3, labelKey: "admin.sidebar.analytics", defaultLabel: "Analytics", href: "/admin/analytics" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthContext();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { t } = useTranslation();

  const locale = pathname.split("/")[1] || "en";

  return (
    <aside 
      className={cn(
        "flex flex-col bg-surface border-r border-outline-variant transition-all duration-300 ease-in-out h-screen sticky top-0",
        isCollapsed ? "w-20" : "w-72"
      )}
    >
      {/* Logo Area */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-outline-variant">
        {!isCollapsed && (
          <Link href={`/${locale}`} className="flex items-center hover:opacity-80 transition-all">
            <img
              src={BRAND_CONFIG.logo}
              alt={BRAND_CONFIG.alt}
              className="h-9 w-auto object-contain"
            />
          </Link>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-xl hover:bg-surface-variant text-on-surface-variant transition-all"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-grow py-8 px-4 space-y-2 overflow-y-auto">
        {sidebarItems.map((item) => {
          const fullHref = `/${locale}${item.href}`;
          const isActive = item.href === "/admin" 
            ? pathname === fullHref 
            : pathname.startsWith(fullHref);
          
          return (
            <Link
              key={item.href}
              href={fullHref}
              className={cn(
                "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative",
                isActive 
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                  : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"
              )}
            >
              <item.icon size={20} className={cn("transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
              {!isCollapsed && <span className="font-bold text-sm tracking-wide uppercase">{t(item.labelKey) || item.defaultLabel}</span>}
              
              {isActive && !isCollapsed && (
                <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-on-primary animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-outline-variant">
        <button 
          onClick={() => logout()}
          className={cn(
            "flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl transition-all",
            "text-error hover:bg-error/10 hover:shadow-inner"
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="font-bold text-sm tracking-wide uppercase">{t("admin.sidebar.logout") || "Logout"}</span>}
        </button>
      </div>
    </aside>
  );
}
