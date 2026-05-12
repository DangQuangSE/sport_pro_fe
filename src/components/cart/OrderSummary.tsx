'use client';

import Link from 'next/link';

export interface OrderSummaryProps {
  dict: any;
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
  lang: string;
}

export function OrderSummary({
  dict,
  subtotal,
  shipping,
  tax,
  total,
  lang,
}: OrderSummaryProps) {
  return (
    <div className="bg-surface-container-lowest border-2 border-on-surface p-8 shadow-[8px_8px_0px_0px_rgba(0,88,188,0.1)] rounded-xl">
      <h2 className="font-headline-lg text-headline-lg uppercase italic mb-8">
        {dict.cart.orderSummary}
      </h2>
      
      <div className="flex flex-col gap-4 border-b-2 border-surface-container pb-8">
        <div className="flex justify-between items-center font-label-lg uppercase">
          <span className="text-on-surface-variant">{dict.cart.subtotal}</span>
          <span className="font-headline-sm">{subtotal}</span>
        </div>
        <div className="flex justify-between items-center font-label-lg uppercase">
          <span className="text-on-surface-variant">{dict.cart.estimatedShipping}</span>
          <span className="font-headline-sm text-primary">{shipping}</span>
        </div>
        <div className="flex justify-between items-center font-label-lg uppercase">
          <span className="text-on-surface-variant">{dict.cart.salesTax}</span>
          <span className="font-headline-sm">{tax}</span>
        </div>
      </div>
      
      <div className="py-8">
        <div className="flex justify-between items-baseline mb-8">
          <span className="font-headline-lg text-headline-lg uppercase italic">
            {dict.cart.total}
          </span>
          <span className="font-display-lg text-display-lg text-primary">
            {total}
          </span>
        </div>
        
        {/* Promo Code */}
        <div className="mb-8">
          <label className="font-label-md text-on-surface-variant uppercase mb-2 block">
            {dict.cart.promoCode}
          </label>
          <div className="flex gap-2">
            <input 
              className="flex-1 border-outline-variant focus:border-primary-container focus:ring-0 uppercase font-label-lg px-4 py-2 rounded-lg bg-surface" 
              placeholder={dict.cart.enterCode} 
              type="text"
            />
            <button className="bg-on-surface text-white px-8 py-2 font-label-lg hover:bg-primary transition-all uppercase rounded-lg">
              {dict.cart.apply}
            </button>
          </div>
        </div>
        
        {/* Checkout CTA */}
        <Link 
          href={`/${lang}/checkout`}
          className="w-full bg-secondary-container text-white py-4 rounded-xl font-headline-sm uppercase tracking-widest hover:bg-secondary active:scale-95 transform transition-all shadow-lg flex items-center justify-center gap-4 text-center"
        >
          {dict.cart.proceedToCheckout}
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
      
      {/* Trust Badges */}
      <div className="pt-8 border-t border-surface-container grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-outline">
          <span className="material-symbols-outlined text-lg">verified_user</span>
          <span className="font-label-sm uppercase">{dict.cart.securePay}</span>
        </div>
        <div className="flex items-center gap-2 text-outline">
          <span className="material-symbols-outlined text-lg">local_shipping</span>
          <span className="font-label-sm uppercase">{dict.cart.expressShip}</span>
        </div>
      </div>
    </div>
  );
}
