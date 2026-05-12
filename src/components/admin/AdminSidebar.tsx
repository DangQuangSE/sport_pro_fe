'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export interface AdminSidebarProps {
  dict: any;
  lang: string;
}

export function AdminSidebar({ dict, lang }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      title: dict.admin.sidebar.dashboard,
      href: `/${lang}/admin/dashboard`,
      icon: 'dashboard',
    },
    {
      title: dict.admin.sidebar.products,
      href: `/${lang}/admin/products`,
      icon: 'inventory_2',
    },
    {
      title: dict.admin.sidebar.categories,
      href: `/${lang}/admin/categories`,
      icon: 'category',
    },
    {
      title: dict.admin.sidebar.brands,
      href: `/${lang}/admin/brands`,
      icon: 'sell',
    },
    {
      title: dict.admin.sidebar.users,
      href: `/${lang}/admin/users`,
      icon: 'group',
    },
  ];

  const systemItems = [
    {
      title: dict.admin.sidebar.settings,
      href: `/${lang}/admin/settings`,
      icon: 'settings',
    },
  ];

  return (
    <aside className="w-[280px] bg-surface-container-lowest border-r border-outline-variant flex flex-col z-20 flex-shrink-0">
      {/* Brand */}
      <div className="h-20 flex items-center px-8 border-b border-outline-variant">
        <span className="font-display-xl text-display-xl text-on-surface italic tracking-tighter text-2xl">
          SPORT PRO
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-4 px-4 py-3 rounded-lg font-label-lg text-label-lg transition-colors',
                isActive
                  ? 'bg-primary-fixed text-on-primary-fixed'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              )}
            >
              <span className={cn('material-symbols-outlined', isActive && 'fill')}>
                {item.icon}
              </span>
              {item.title}
            </Link>
          );
        })}

        <div className="pt-8 pb-2 px-4">
          <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest">
            {dict.admin.sidebar.system}
          </span>
        </div>

        {systemItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-4 px-4 py-3 rounded-lg font-label-lg text-label-lg transition-colors',
                isActive
                  ? 'bg-primary-fixed text-on-primary-fixed'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              )}
            >
              <span className={cn('material-symbols-outlined', isActive && 'fill')}>
                {item.icon}
              </span>
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-outline-variant">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-container cursor-pointer transition-colors">
          <div className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center font-headline-sm text-headline-sm">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-label-md text-label-md text-on-surface truncate">Admin User</p>
            <p className="font-label-sm text-label-sm text-outline truncate">Administrator</p>
          </div>
          <span className="material-symbols-outlined text-outline">more_vert</span>
        </div>
      </div>
    </aside>
  );
}
