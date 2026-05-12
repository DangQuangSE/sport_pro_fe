import { getDictionary } from '@/dictionaries';
import Link from 'next/link';

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const dict = await getDictionary(lang as any);

  return (
    <div className="bg-background text-on-background min-h-screen font-body-md antialiased selection:bg-primary selection:text-on-primary">
      {/* Admin Top Header */}
      <header className="bg-surface-container-lowest border-b border-outline-variant h-20 flex items-center px-8 sticky top-0 z-40 shadow-sm">
        <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link className="flex items-center text-on-surface-variant hover:text-primary transition-colors font-label-md uppercase tracking-wider" href={`/${lang}/admin/orders`}>
              <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span>
              {dict.admin.orderDetails.title}
            </Link>
            <div className="h-6 w-px bg-outline-variant mx-4"></div>
            <h1 className="font-headline-sm text-headline-sm text-on-surface">{dict.admin.orderDetails.orderId} #{id || '---'}</h1>
            <span className="ml-4 bg-secondary-container text-white font-label-sm text-label-sm px-3 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] fill">pending</span>
              {dict.admin.orderDetails.updateStatus}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-body-sm text-body-sm text-on-surface-variant">{dict.admin.orderDetails.orderDate}: --/--/----</span>
            <button className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="max-w-[1280px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT COLUMN: Product & Design Specifics */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Admin Actions Bar */}
            <div className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm flex flex-wrap gap-4 justify-end items-center">
              <div className="mr-auto font-label-md text-label-md text-on-surface uppercase tracking-widest">{dict.admin.orderDetails.actions}</div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline text-on-surface font-label-md text-label-md uppercase tracking-widest hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[18px]">download</span>
                {dict.admin.orderDetails.exportDesign}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline text-on-surface font-label-md text-label-md uppercase tracking-widest hover:bg-surface-container transition-colors">
                <span className="material-symbols-outlined text-[18px]">sync_alt</span>
                {dict.admin.orderDetails.updateStatus}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white font-label-md text-label-md uppercase tracking-widest hover:bg-primary-container transition-colors shadow-md shadow-primary/20">
                <span className="material-symbols-outlined text-[18px]">precision_manufacturing</span>
                {dict.admin.orderDetails.startProduction}
              </button>
            </div>

            {/* Empty State or Content to be loaded */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm p-12 flex flex-col items-center justify-center text-center">
              <span className="material-symbols-outlined text-6xl text-outline mb-4">inventory_2</span>
              <p className="font-headline-sm text-on-surface">{dict.admin.orderDetails.requestedProducts} sẽ hiển thị tại đây</p>
              <p className="font-body-sm text-on-surface-variant mt-2">Dữ liệu đơn hàng đang được kết nối...</p>
            </div>
          </div>

          {/* RIGHT COLUMN: Customer & Payment */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Customer Info Card Placeholder */}
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden opacity-50">
              <div className="p-4 border-b border-outline-variant bg-surface-container-low">
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 uppercase tracking-tight">
                  <span className="material-symbols-outlined">person</span>
                  {dict.admin.orderDetails.customer}
                </h2>
              </div>
              <div className="p-6">
                <p className="font-body-sm text-on-surface-variant">Thông tin khách hàng sẽ hiển thị tại đây</p>
              </div>
            </section>

            {/* Payment Summary Card Placeholder */}
            <section className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden opacity-50">
              <div className="p-4 border-b border-outline-variant bg-surface-container-low">
                <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2 uppercase tracking-tight">
                  <span className="material-symbols-outlined">payments</span>
                  {dict.admin.orderDetails.payment}
                </h2>
              </div>
              <div className="p-6">
                <p className="font-body-sm text-on-surface-variant">Thông tin thanh toán sẽ hiển thị tại đây</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
