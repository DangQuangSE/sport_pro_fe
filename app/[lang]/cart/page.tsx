import { getDictionary } from '@/dictionaries';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { CartItem } from '@/components/cart/CartItem';
import { OrderSummary } from '@/components/cart/OrderSummary';
import Link from 'next/link';

export default async function CartPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang as any);

  // Real data will be fetched or passed from state management
  const cartItems: any[] = [];

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen pt-20">
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-6 lg:px-8 py-12 lg:py-16">
        {/* Cart Header */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-display-lg text-display-lg uppercase italic tracking-tighter">
              {dict.cart.title}
            </h1>
            <p className="text-on-surface-variant font-label-lg uppercase mt-2">
              {cartItems.length} {dict.cart.itemsInGearList}
            </p>
          </div>
          <Link 
            href={`/${lang}/products`}
            className="font-label-lg text-primary underline underline-offset-4 hover:text-secondary transition-colors uppercase"
          >
            {dict.cart.continueShopping}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {cartItems.map(item => (
              <CartItem 
                key={item.id}
                {...item}
                dict={dict}
              />
            ))}
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-4 sticky top-28">
            <OrderSummary 
              dict={dict}
              subtotal="$0.00"
              shipping={dict.cart.free}
              tax="$0.00"
              total="$0.00"
              lang={lang}
            />
          </div>
        </div>

        {/* Recommendation Section can be added here with real data */}
      </main>

      <Footer />
    </div>
  );
}
