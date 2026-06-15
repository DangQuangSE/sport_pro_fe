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
  Ruler,
  Printer,
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  MessageSquare,
  ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { BRAND_CONFIG } from "@/constants/brand";

const sidebarGroups = [
  {
    type: "single",
    icon: LayoutDashboard,
    labelKey: "admin.sidebar.dashboard",
    defaultLabel: "Dashboard",
    href: "/admin",
  },
  {
    type: "dropdown",
    icon: Package,
    labelKey: "admin.sidebar.groups.catalog",
    defaultLabel: "Catalog & Inventory",
    subItems: [
      { icon: Package, labelKey: "admin.sidebar.products", defaultLabel: "Products", href: "/admin/products" },
      { icon: Tag, labelKey: "admin.sidebar.categories", defaultLabel: "Categories", href: "/admin/categories" },
      { icon: Hash, labelKey: "admin.sidebar.brands", defaultLabel: "Brands", href: "/admin/brands" },
      { icon: Palette, labelKey: "admin.sidebar.colors", defaultLabel: "Colors", href: "/admin/colors" },
      { icon: Ruler, labelKey: "admin.sidebar.sizes", defaultLabel: "Sizes", href: "/admin/sizes" },
    ]
  },
  {
    type: "dropdown",
    icon: ShoppingCart,
    labelKey: "admin.sidebar.groups.operations",
    defaultLabel: "Sales & Operations",
    subItems: [
      { icon: ShoppingCart, labelKey: "admin.sidebar.orders", defaultLabel: "Orders", href: "/admin/orders" },
      { icon: MessageSquare, labelKey: "admin.sidebar.reviews", defaultLabel: "Reviews", href: "/admin/reviews" },
      { icon: Users, labelKey: "admin.sidebar.users", defaultLabel: "Users", href: "/admin/users" },
    ]
  },
  {
    type: "dropdown",
    icon: Settings,
    labelKey: "admin.sidebar.groups.settings",
    defaultLabel: "Settings & Control",
    subItems: [
      { icon: Printer, labelKey: "admin.sidebar.printing", defaultLabel: "Printing Config", href: "/admin/printing" },
      { icon: BarChart3, labelKey: "admin.sidebar.analytics", defaultLabel: "Analytics", href: "/admin/analytics" },
      { icon: Settings, labelKey: "admin.sidebar.publicConfigs", defaultLabel: "System Configs", href: "/admin/public-configs" },
    ]
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthContext();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [expandedGroups, setExpandedGroups] = React.useState<Record<string, boolean>>({});
  const { t } = useTranslation();

  const locale = pathname.split("/")[1] || "en";

  // Auto expand group containing active sub-item on path change
  React.useEffect(() => {
    const initialExpanded: Record<string, boolean> = {};
    sidebarGroups.forEach((group) => {
      if (group.type === "dropdown" && group.subItems) {
        const hasActiveChild = group.subItems.some((sub) =>
          pathname.startsWith(`/${locale}${sub.href}`)
        );
        if (hasActiveChild) {
          initialExpanded[group.labelKey] = true;
        }
      }
    });
    setExpandedGroups((prev) => ({ ...prev, ...initialExpanded }));
  }, [pathname, locale]);

  return (
    <aside 
      className={cn(
        "flex flex-col bg-surface border-r border-outline-variant transition-all duration-300 ease-in-out h-screen sticky top-0 z-20",
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
        {sidebarGroups.map((group) => {
          if (group.type === "single") {
            const fullHref = `/${locale}${group.href}`;
            const isActive = group.href === "/admin" 
              ? pathname === fullHref 
              : pathname.startsWith(fullHref);
            
            return (
              <Link
                key={group.href}
                href={fullHref}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative",
                  isActive 
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/20" 
                    : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"
                )}
              >
                <group.icon size={20} className={cn("transition-transform duration-300", isActive ? "scale-110" : "group-hover:scale-110")} />
                {!isCollapsed && <span className="font-bold text-sm tracking-wide uppercase">{t(group.labelKey) || group.defaultLabel}</span>}
                
                {isActive && !isCollapsed && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-on-primary animate-pulse" />
                )}
              </Link>
            );
          }

          // Dropdown Group
          const hasActiveChild = group.subItems?.some((sub) => {
            const subFullHref = `/${locale}${sub.href}`;
            return pathname.startsWith(subFullHref);
          });
          const isExpanded = !!expandedGroups[group.labelKey] && !isCollapsed;

          const toggleGroup = () => {
            if (isCollapsed) {
              setIsCollapsed(false);
              setExpandedGroups((prev) => ({ ...prev, [group.labelKey]: true }));
            } else {
              setExpandedGroups((prev) => ({ ...prev, [group.labelKey]: !prev[group.labelKey] }));
            }
          };

          return (
            <div key={group.labelKey} className="space-y-1">
              <button
                onClick={toggleGroup}
                className={cn(
                  "flex items-center gap-4 w-full px-4 py-3.5 rounded-2xl transition-all group/btn text-left",
                  hasActiveChild && !isExpanded
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-on-surface-variant hover:bg-surface-variant/50 hover:text-on-surface"
                )}
              >
                {group.icon && (
                  <group.icon 
                    size={20} 
                    className={cn(
                      "transition-transform duration-300 shrink-0", 
                      hasActiveChild ? "text-primary scale-110" : "group-hover/btn:scale-110"
                    )} 
                  />
                )}
                {!isCollapsed && (
                  <>
                    <span className="font-bold text-sm tracking-wide uppercase flex-grow">
                      {t(group.labelKey) || group.defaultLabel}
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={cn(
                        "transition-transform duration-300 text-on-surface-variant/70 group-hover/btn:text-on-surface shrink-0",
                        isExpanded && "rotate-180"
                      )} 
                    />
                  </>
                )}
              </button>

              {/* Collapsible Sub Items */}
              {isExpanded && group.subItems && (
                <div className="pl-6 ml-6 border-l border-outline-variant/60 space-y-1.5 mt-1.5 animate-in fade-in duration-300">
                  {group.subItems.map((sub) => {
                    const subFullHref = `/${locale}${sub.href}`;
                    const isSubActive = pathname.startsWith(subFullHref);

                    return (
                      <Link
                        key={sub.href}
                        href={subFullHref}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group relative text-xs",
                          isSubActive
                            ? "bg-primary text-on-primary font-bold shadow-md shadow-primary/10"
                            : "text-on-surface-variant/80 hover:bg-surface-variant/30 hover:text-on-surface"
                        )}
                      >
                        <sub.icon 
                          size={16} 
                          className={cn(
                            "transition-transform duration-300 shrink-0", 
                            isSubActive ? "scale-110" : "group-hover:scale-110"
                          )} 
                        />
                        <span className="font-bold tracking-wide uppercase">
                          {t(sub.labelKey) || sub.defaultLabel}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
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
