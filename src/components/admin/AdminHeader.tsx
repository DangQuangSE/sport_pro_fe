'use client';

import { usePathname } from 'next/navigation';

export interface AdminHeaderProps {
  dict: any;
}

export function AdminHeader({ dict }: AdminHeaderProps) {
  const pathname = usePathname();
  
  // Logic to determine the current title based on pathname
  let pageTitle = dict.admin.sidebar.dashboard;
  if (pathname.includes('/products')) pageTitle = dict.admin.sidebar.products;
  if (pathname.includes('/categories')) pageTitle = dict.admin.sidebar.categories;
  if (pathname.includes('/brands')) pageTitle = dict.admin.sidebar.brands;
  if (pathname.includes('/users')) pageTitle = dict.admin.sidebar.users;
  if (pathname.includes('/settings')) pageTitle = dict.admin.sidebar.settings;

  // Simple date format for demo
  const today = new Date().toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="h-20 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-8 z-10 flex-shrink-0">
      <div className="flex items-center gap-6">
        <h1 className="font-headline-lg text-headline-lg text-on-surface m-0">
          {pageTitle}
        </h1>
        {/* Date Range Picker Mock */}
        <button className="hidden md:flex items-center gap-2 px-4 py-2 border border-outline-variant rounded-full text-on-surface-variant hover:bg-surface-container transition-colors font-label-md text-label-md">
          <span className="material-symbols-outlined text-[18px]">calendar_today</span>
          {dict.admin.header.today} {today}
          <span className="material-symbols-outlined text-[18px]">expand_more</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        {/* Global Search */}
        <div className="relative hidden lg:block w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input 
            className="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-full focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary font-body-sm text-body-sm text-on-surface placeholder:text-outline transition-all" 
            placeholder={dict.admin.header.searchPlaceholder}
            type="text"
          />
        </div>

        {/* Notifications */}
        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors relative text-on-surface-variant">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-secondary-container rounded-full border-2 border-surface-container-lowest"></span>
        </button>
      </div>
    </header>
  );
}
