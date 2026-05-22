"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Hash, 
  ShoppingCart, 
  Users, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/contexts/AuthContext";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
  { icon: Package, label: "Products", href: "/admin/products" },
  { icon: Tag, label: "Categories", href: "/admin/categories" },
  { icon: Hash, label: "Brands", href: "/admin/brands" },
  { icon: ShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: Users, label: "Users", href: "/admin/users" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuthContext();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

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
          <Link href={`/${locale}`} className="text-xl font-black italic tracking-tighter text-on-surface uppercase hover:opacity-80 transition-all">
            SPORT <span className="text-primary">PRO</span>
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
              {!isCollapsed && <span className="font-bold text-sm tracking-wide uppercase">{item.label}</span>}
              
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
          {!isCollapsed && <span className="font-bold text-sm tracking-wide uppercase">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
