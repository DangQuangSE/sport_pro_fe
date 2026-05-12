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

  // Mock data for cart items
  const cartItems = [
    {
      id: 'cart-1',
      name: 'IGNITE X-SERIES 2.0',
      category: 'PRO RUNNING',
      price: '$180.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAlx3khE9iwM6qm56IZBvreL1GzEfOw43zn-fjMifdWLLAck5nSHFFNuDExM4Wb2m8QHXgXIuke2XiMHsG3KAy6z3QzulnmAS-hJFCKb6BuyKtSt7mjk8n_HTONmd35mMReb24l4GRUogOsOsLGpAC_7PwmNZd8Po1V77ZeXogyRK6l7QI8x_RabpNUBqvOeQJ8XxFY-IU6GLni_0QVET7KHSCJmhJua_rD1IHEPSWGrIJdjYsQyiBn6HQUZTIQNYXWjNQMMla_qUo',
      color: 'Electric Blue',
      size: '10.5 US',
      initialQuantity: 1,
    },
    {
      id: 'cart-2',
      name: 'APEX COMPRESSION TIGHTS',
      category: 'TRAINING GEAR',
      price: '$140.00',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOX0XCMdaSxagxoyRBtLy_03H3dGYWoIeV_KUnY4UFbctOC4bl2afAynnZVhImW-C_s3T5dXnvkaMRvy-dO3elwGcBNNNS2xkwWNshKb2c1uiSGxF8kAk7QReo4hkLIVIa8e1b_vNza0b1EkdKJ0d7CRV-nvIBkT7_XCWTvbTRcVNCxcNWckmm4QiWOLT55OHEGYxtCR6Ss8Z7ZPkpS67N58CutkghhDPQYhUndN9czgX2NxHhyMk6GEPPYfebBdGAcxsEDRQKXbI',
      color: 'Stealth Black',
      size: 'Medium',
      initialQuantity: 2,
    }
  ];

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
              subtotal="$320.00"
              shipping={dict.cart.free}
              tax="$25.60"
              total="$345.60"
              lang={lang}
            />
          </div>
        </div>

        {/* Recommendation Section */}
        <section className="mt-24">
          <h2 className="font-headline-lg text-headline-lg uppercase italic mb-8">
            {dict.cart.completeYourLook}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="group cursor-pointer">
              <div className="aspect-[4/5] bg-surface-container-high mb-4 overflow-hidden relative rounded-xl">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuATEiWdQmbZdeS4AY5l7S_alUcTpRA-BsDU-eXNC4SnZXzQg97jWL2nOlzLY0CoL0ts3oUJsjclrRVorPbBJ4cg364RiBFsJJLAmIcDxZz1-i2hdPUnEg5rYJ7cRmKqI9r5is-Zbk2VxFuL2h9iNMsaiTUKypGuGXnphCRKsqdnE6howitm9WwVPoQDBobE2qTZgL8vMuj-vC_-p17Zd0x9hIGCCq9cl7VBbhZknPoxRsAjDKnOuScBbD4Csc5XnXcysGQkV0aEswA"
                  alt="Elite Performance Socks"
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-secondary text-white px-4 py-1 font-label-sm uppercase rounded-lg">
                    {dict.cart.bestSeller}
                  </span>
                </div>
              </div>
              <span className="font-label-sm text-on-surface-variant uppercase">Accessories</span>
              <h4 className="font-headline-sm uppercase mt-2 group-hover:text-primary transition-colors">Elite Performance Socks</h4>
              <p className="font-headline-sm text-primary mt-1">$18.00</p>
            </div>
            
            <div className="group cursor-pointer">
              <div className="aspect-[4/5] bg-surface-container-high mb-4 overflow-hidden relative rounded-xl">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPSX-Le1DcPwEJkLzgf5HTEItkZm4mRDQU-9PaxCU20Hi8HwAKCHmFw3l4EWZQxbzT1qd5PShqUwG2pk7C0soxybrkShsKKSHzTd6imqsJQO0Fg6D5fQgTlS3Evx6FMGcJcej2iXdWT9NxVrIuC2Pej3CT-djT2TWIaOchA9TpeXOY3jPU1-jHzUzWxG6pz8RfYkP3CzrY7gdbeiLgUOzW4ES3_G2V5cg9LaA_eM2cuWto3ly7n32yLCyL-6DFg2Rkb25nRVpFsdQ"
                  alt="Hydro-Fuel Bottle 1L"
                />
              </div>
              <span className="font-label-sm text-on-surface-variant uppercase">Training</span>
              <h4 className="font-headline-sm uppercase mt-2 group-hover:text-primary transition-colors">Hydro-Fuel Bottle 1L</h4>
              <p className="font-headline-sm text-primary mt-1">$45.00</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
