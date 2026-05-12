import { ReactNode } from 'react';
import { getDictionary } from '@/dictionaries';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';

export default async function AdminLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);

  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md flex h-screen overflow-hidden antialiased">
      <AdminSidebar dict={dict} lang={lang} />
      
      <main className="flex-1 flex flex-col min-w-0 bg-surface">
        <AdminHeader dict={dict} />
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {children}
        </div>
      </main>
    </div>
  );
}
