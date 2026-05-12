import { getDictionary } from '@/dictionaries';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import Link from 'next/link';

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);

  // Mock data for cart items
  const cartItems = [
    {
      id: 'cart-1',
      name: 'AERO-KNIT PRO X1',
      category: 'GIÀY DÉP',
      price: '$185.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBTSPqFlndLnzWKZyqb_V36_gfsAG6Wz43Lpb4c-ddfkcXHdG5rvpJUEBDRQlZk66DLI3K2WPhfh_E-eYjeMIjDh-v42oKxDjfPrnVZRPSXwkSCTHueLR_7V8pt_298v-s-XK5Hxles54ZctuZ1AWH3o3oL-2vaG6cA1HjAtQqSWzE_zRihg3oNN7ZSeFlZt5I0O6LpLsHwGXdxr46ec3Ppvsg_w6yHtlZLAlefR2-S5tcleVr0DVm5RafUKICYR0eSRDU0iVdsGkc',
      color: 'Đỏ hồng ngoại',
      size: 'M 10.5',
      quantity: 1,
    },
    {
      id: 'cart-2',
      name: 'CORE COMPRESSION TEE',
      category: 'QUẦN ÁO',
      price: '$90.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmToZp5_UCjxxLKZ_7o0HQqIr9NVNQcXtGgTVApNpOGAlJRljvzjPAew4PaAnjR8a4Ks5NXlteGt6A42mx0Hn7okPs3g07yZFYex_wYZq-DIlD5qmsgRt1WFDBp3v4WPNPSdg3qsapPYbUqQ7rmWXqDejkJLeL3d0pvVLq645TFcNL351qXgjeRB3WR5A6zHTBBzXyTlMIS-J0cJkBuYKkCGqOyi0cLdFUzL2q8euo0kkThu5IBHykHRqUpxdwoC8tvHf9AaZGUls',
      color: 'Đen tàng hình',
      size: 'L',
      quantity: 2,
    }
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
      {/* Transactional Navbar */}
      <header className="bg-white/90 backdrop-blur-md fixed top-0 w-full z-50 border-b-2 border-zinc-200 shadow-[0_4px_12px_rgba(0,0,0,0.05)] h-20 flex justify-between items-center px-8">
        <div className="text-2xl font-black italic tracking-tighter text-zinc-900">
          <Link href={`/${lang}`}>SPORT PRO</Link>
        </div>
        <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md uppercase">
          <span className="material-symbols-outlined text-lg">lock</span>
          {dict.checkout.title}
        </div>
      </header>

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-8 pt-28 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Cart & Checkout Forms */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Review Cart Section */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-end border-b border-surface-variant pb-4 mb-4">
              <h2 className="font-headline-md text-headline-md text-on-surface uppercase">{dict.checkout.cartReview}</h2>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase">{cartItems.length} {dict.checkout.items}</span>
            </div>
            <div className="flex flex-col gap-4">
              {cartItems.map((item) => (
                <div key={item.id} className="group">
                  <div className="flex gap-4 py-2">
                    <div className="w-24 h-32 bg-surface-container flex-shrink-0 rounded-lg overflow-hidden">
                      <img alt={item.name} className="w-full h-full object-cover" src={item.image} />
                    </div>
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="font-label-sm text-label-sm text-on-surface-variant uppercase mb-1">{item.category}</div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface leading-tight">{item.name}</h3>
                        <div className="font-body-sm text-body-sm text-on-surface-variant mt-1">Size: {item.size} / {dict.cart.color}: {item.color}</div>
                      </div>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center border border-outline-variant rounded-lg bg-surface-bright overflow-hidden">
                          <button className="px-2 py-1 text-on-surface-variant hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">remove</span>
                          </button>
                          <span className="font-label-md text-label-md w-8 text-center">{item.quantity}</span>
                          <button className="px-2 py-1 text-on-surface-variant hover:text-primary transition-colors">
                            <span className="material-symbols-outlined text-sm">add</span>
                          </button>
                        </div>
                        <button className="font-label-sm text-label-sm text-tertiary uppercase underline decoration-outline-variant underline-offset-4 hover:text-error transition-colors">{dict.checkout.remove}</button>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-headline-sm text-headline-sm text-on-surface">{item.price}</div>
                    </div>
                  </div>
                  <hr className="border-surface-variant mt-4 last:hidden" />
                </div>
              ))}
            </div>
          </section>

          {/* Shipping Information */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2 border-b border-surface-variant pb-4 mb-4">
              <span className="material-symbols-outlined text-primary text-xl">local_shipping</span>
              <h2 className="font-headline-md text-headline-md text-on-surface uppercase">{dict.checkout.shippingInfo}</h2>
            </div>
            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-label-md text-label-md text-on-surface uppercase mb-1">{dict.checkout.email}</label>
                <input className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" placeholder="athlete@example.com" type="email" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface uppercase mb-1">{dict.checkout.firstName}</label>
                <input className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" placeholder={dict.checkout.firstName} type="text" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface uppercase mb-1">{dict.checkout.lastName}</label>
                <input className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" placeholder={dict.checkout.lastName} type="text" />
              </div>
              <div className="md:col-span-2">
                <label className="block font-label-md text-label-md text-on-surface uppercase mb-1">{dict.checkout.address}</label>
                <input className="w-full bg-surface-bright border border-outline-variant rounded-lg p-3 font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary transition-colors outline-none" placeholder="123 Performance Way" type="text" />
              </div>
            </form>
          </section>

          {/* Payment Method */}
          <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2 border-b border-surface-variant pb-4 mb-4">
              <span className="material-symbols-outlined text-primary text-xl">qr_code_scanner</span>
              <h2 className="font-headline-md text-headline-md text-on-surface uppercase">{dict.checkout.paymentMethod}</h2>
            </div>
            <div className="flex flex-col gap-4">
              <label className="flex items-start gap-4 p-6 border-2 border-primary rounded-xl bg-surface-bright cursor-pointer">
                <input checked readOnly className="mt-1 w-4 h-4 text-primary focus:ring-primary border-outline" name="payment" type="radio" />
                <div className="flex-grow">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-headline-sm text-headline-sm text-on-surface uppercase">{dict.checkout.qrPayment}</span>
                  </div>
                  <div className="flex flex-col md:flex-row gap-6 mt-4">
                    <div className="w-40 h-40 bg-surface-container-highest rounded-lg flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                      <span className="material-symbols-outlined text-6xl text-outline">qr_code_2</span>
                    </div>
                    <div className="flex flex-col gap-2 justify-center font-body-md text-body-md text-on-surface">
                      <div><span className="text-on-surface-variant">{dict.checkout.bank}:</span> <strong>Vietcombank</strong></div>
                      <div><span className="text-on-surface-variant">{dict.checkout.accountNumber}:</span> <strong>1234567890</strong></div>
                      <div><span className="text-on-surface-variant">{dict.checkout.accountHolder}:</span> <strong>CONG TY SPORT PRO</strong></div>
                      <div><span className="text-on-surface-variant">{dict.checkout.transferContent}:</span> <strong>[Order ID]</strong></div>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-4 relative">
          <div className="sticky top-28 bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.05)] flex flex-col gap-4">
            <h2 className="font-headline-md text-headline-md text-on-surface border-b border-surface-variant pb-2 uppercase">{dict.checkout.orderSummary}</h2>
            <div className="flex flex-col gap-2 font-body-md text-body-md text-on-surface-variant mt-2">
              <div className="flex justify-between">
                <span>{dict.cart.subtotal} (3 {dict.checkout.items})</span>
                <span className="font-bold text-on-surface">$275.00</span>
              </div>
              <div className="flex justify-between">
                <span>{dict.cart.estimatedShipping}</span>
                <span className="font-bold text-on-surface">$15.00</span>
              </div>
              <div className="flex justify-between">
                <span>{dict.cart.salesTax}</span>
                <span className="font-bold text-on-surface">$24.00</span>
              </div>
            </div>
            <hr className="border-surface-variant my-2" />
            <div className="flex justify-between items-end mb-4">
              <span className="font-headline-sm text-headline-sm text-on-surface uppercase">{dict.cart.total}</span>
              <span className="font-display-lg text-display-lg text-on-surface tracking-tighter leading-none">$314.00</span>
            </div>
            
            {/* Customization CTA */}
            <Link href={`/${lang}/customizer`} className="w-full bg-primary-container text-on-primary-container font-headline-sm text-headline-sm uppercase py-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-primary hover:text-on-primary transition-colors duration-200 active:scale-[0.98] flex justify-center items-center gap-2 mb-2 border border-primary text-center">
              <span className="material-symbols-outlined">design_services</span>
              {dict.checkout.customizationCTA}
            </Link>

            {/* Primary CTA - Safety Orange */}
            <button className="w-full bg-secondary-container text-white font-headline-sm text-headline-sm uppercase py-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:bg-secondary transition-colors duration-200 active:scale-[0.98] flex justify-center items-center gap-2">
              <span className="material-symbols-outlined fill">check_circle</span>
              {dict.checkout.confirmOrder}
            </button>
            <div className="font-label-sm text-label-sm text-center text-tertiary mt-2">
              {dict.checkout.checkoutNote}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
