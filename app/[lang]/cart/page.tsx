"use client";

import React from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Trash2, 
  Minus, 
  Plus, 
  ArrowRight, 
  ChevronLeft,
  Loader2,
  PackageCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeFromCart } = useCart();
  const { t, locale } = useTranslation();

  if (isLoading && !cart) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-primary" />
            <p className="font-lexend font-bold uppercase tracking-widest text-xs text-on-surface-variant">Syncing your gear...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-8 max-w-[1280px] mx-auto w-full animate-in fade-in duration-700">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Left: Items List */}
          <div className="flex-grow space-y-10">
            <div className="space-y-2">
              <h1 className="text-[48px] font-black tracking-tighter text-on-surface uppercase leading-none" style={{ fontFamily: 'var(--font-lexend)' }}>
                Your Bag <span className="text-on-surface-variant/40 ml-4">({cart?.totalItems ?? 0})</span>
              </h1>
            </div>

            {isEmpty ? (
              <div className="bg-surface-container/30 border-2 border-dashed border-outline-variant rounded-2xl p-20 flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <ShoppingBag size={40} strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold uppercase tracking-tight">Your bag is empty</h3>
                  <p className="text-on-surface-variant max-w-xs mx-auto text-sm font-medium">
                    Once you find something you like, it will show up here.
                  </p>
                </div>
                <Button asChild className="h-14 px-10 rounded-xl bg-primary hover:bg-primary/90 font-lexend font-black uppercase tracking-widest text-xs">
                  <Link href={`/${locale}/products`}>Shop New Arrivals</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex flex-col md:flex-row gap-6 p-6 border-b border-outline-variant last:border-0"
                  >
                    {/* Product Image */}
                    <div className="relative w-full md:w-32 aspect-square rounded-xl bg-surface-container overflow-hidden shrink-0">
                      <img 
                        src={item.designImageUrl || "/placeholder-product.png"} 
                        alt={item.productName} 
                        className="w-full h-full object-contain p-2" 
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase tracking-widest text-primary">Performance Gear</p>
                          <Link 
                            href={`/${locale}/product/${item.productSlug}`}
                            className="text-lg font-bold uppercase tracking-tight hover:text-primary transition-colors block"
                          >
                            {item.productName}
                          </Link>
                          <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1">
                            <p className="text-xs text-on-surface-variant font-medium">
                              Color: <span className="text-on-surface font-bold uppercase">{item.color}</span>
                            </p>
                            <p className="text-xs text-on-surface-variant font-medium">
                              Size: <span className="text-on-surface font-bold">{item.size}</span>
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-black italic tracking-tighter">${item.salePrice.toLocaleString()}</p>
                      </div>

                      <div className="flex items-center justify-between mt-6">
                        {/* Quantity Control */}
                        <div className="flex items-center gap-4 border border-outline-variant rounded-xl px-2 h-10">
                          <button 
                            className="p-1 hover:text-primary disabled:opacity-30"
                            onClick={() => updateQuantity(item.variantId, Math.max(0, item.quantity - 1))}
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-4 text-center text-xs font-black">{item.quantity}</span>
                          <button 
                            className="p-1 hover:text-primary"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button 
                          className="text-on-surface-variant hover:text-error flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 size={14} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right: Summary Sidebar */}
          {!isEmpty && (
            <div className="w-full lg:w-[420px] shrink-0">
              <div className="sticky top-32 space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tight">Summary</h3>
                  
                  {/* Promo Code */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Do you have a Promo Code?</p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="ENTER CODE"
                        className="flex-grow h-12 px-4 rounded-xl border border-outline-variant bg-transparent text-xs font-bold uppercase tracking-widest focus:border-primary outline-none"
                      />
                      <Button variant="outline" className="h-12 px-6 rounded-xl border-on-surface bg-on-surface text-surface hover:bg-on-surface/90 text-[10px] font-black uppercase tracking-widest">
                        Apply
                      </Button>
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="space-y-4 pt-4 border-t border-outline-variant">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-on-surface-variant">Subtotal</span>
                      <span className="font-bold">${cart.totalAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-on-surface-variant">Estimated Shipping & Handling</span>
                      <span className="font-bold">Free</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-on-surface-variant">Estimated Tax</span>
                      <span className="font-bold">—</span>
                    </div>
                    
                    <div className="pt-4 border-t border-on-surface space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-black uppercase tracking-tight">Total</span>
                        <span className="text-2xl font-black italic tracking-tighter">${cart.totalAmount.toLocaleString()}</span>
                      </div>
                    </div>

                    <Button 
                      asChild 
                      className="w-full h-16 rounded-xl bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90 font-lexend font-black uppercase tracking-widest text-xs gap-3 mt-4 shadow-xl shadow-secondary-container/20"
                    >
                      <Link href={`/${locale}/checkout`}>
                        Proceed to Checkout
                        <ArrowRight size={18} />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-8 pt-4 border-t border-outline-variant opacity-50">
                  <div className="flex flex-col items-center gap-1">
                    <PackageCheck size={20} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Secure Pay</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ShoppingBag size={20} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Express Ship</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Complete Your Look Section */}
        {!isEmpty && (
          <div className="mt-32 space-y-12">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-center">Complete Your Look</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group space-y-4">
                  <div className="aspect-[4/5] bg-surface-container rounded-2xl overflow-hidden relative">
                    <img 
                      src={`https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&q=80`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt="Recommended product"
                    />
                    <div className="absolute top-4 left-4 bg-on-surface text-surface text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-sm">
                      Best Seller
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Training Gear</p>
                    <h4 className="font-bold uppercase tracking-tight group-hover:text-primary transition-colors">Elite Performance Tee</h4>
                    <p className="font-black italic text-sm">$45.00</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
