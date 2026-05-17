"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Truck,
  QrCode,
  Wrench,
  CheckCircle2,
  Minus,
  Plus,
  ArrowLeft,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { orderService, PaymentMethod } from "@/services/orderService";
import { addressService, AddressResponse, AddressType } from "@/services/addressService";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

export default function CheckoutPage() {
  const { cart, refreshCart, updateQuantity, removeFromCart } = useCart();
  const { t, locale } = useTranslation();
  const router = useRouter();

  // Delivery states matching Stitch perfectly
  const [email, setEmail] = useState("athlete@example.com");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");

  // Flow states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  // Load default address to pre-fill if available (elite feature)
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const res = await addressService.getMyAddresses();
        const addressList = res.data;
        if (addressList && addressList.length > 0) {
          const defaultAddr = addressList.find(a => a.isDefault) || addressList[0];
          setFirstName(defaultAddr.receiverName.split(" ").slice(1).join(" ") || defaultAddr.receiverName);
          setLastName(defaultAddr.receiverName.split(" ")[0] || "");
          setPhoneNumber(defaultAddr.phoneNumber);
          setStreetAddress(`${defaultAddr.detailAddress}, ${defaultAddr.ward}, ${defaultAddr.district}, ${defaultAddr.province}`);
        }
      } catch (err) {
        console.error("Failed to load user addresses", err);
      }
    };
    fetchDefaultAddress();
  }, []);

  const validatePhone = (phone: string) => {
    const regex = /^(0|\+84)[0-9]{9,10}$/;
    return regex.test(phone.trim());
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!cart || cart.items.length === 0) {
      setErrorMsg(t("checkout.noCartItems"));
      return;
    }

    if (!firstName.trim() || !lastName.trim() || !phoneNumber.trim() || !streetAddress.trim()) {
      setErrorMsg(t("checkout.fieldsError"));
      return;
    }

    if (!validatePhone(phoneNumber)) {
      setErrorMsg(t("checkout.phoneError"));
      return;
    }

    setIsSubmitting(true);

    try {
      const receiverName = `${lastName.trim()} ${firstName.trim()}`;
      const finalShippingAddress = `${receiverName} - ${streetAddress.trim()} (Email: ${email.trim()})`;

      const orderPayload = {
        shippingAddress: finalShippingAddress,
        phoneNumber: phoneNumber.trim(),
        paymentMethod: PaymentMethod.BANK_TRANSFER, // Matches "TRANSFER MONEY VIA QR CODE"
        cartItemIds: cart.items.map(item => item.id)
      };

      const orderRes = await orderService.placeOrder(orderPayload);
      setSuccessOrder(orderRes.data);
      
      // Clean up the cart state on successful order
      await refreshCart();
    } catch (err: any) {
      console.error("Order failed", err);
      setErrorMsg(err.message || "Something went wrong during checkout. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // If order is completed successfully, render the gorgeous receipt panel
  if (successOrder) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f9f9fe] font-sans antialiased text-[#1a1c1f]">
        
        {/* Simple Secure Header */}
        <header className="border-b border-[#e2e2e7] bg-white h-20 flex items-center justify-between px-8 md:px-16">
          <div className="flex items-center gap-10">
            <span className="text-xl font-black italic tracking-tighter uppercase leading-none" style={{ fontFamily: 'var(--font-lexend)' }}>
              SPORT<br/><span className="text-primary">PRO</span>
            </span>
            <div className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#414755] border-l border-[#c1c6d7] pl-8">
              <Lock size={14} className="text-[#717786]" />
              <span>{t("checkout.security")}</span>
            </div>
          </div>
          <Link href={`/${locale}/products`} className="text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
            <ArrowLeft size={14} />
            {t("checkout.continueShopping")}
          </Link>
        </header>

        <main className="flex-grow flex items-center justify-center px-8 py-20">
          <div className="max-w-xl w-full bg-white border border-[#e2e2e7] shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-[2rem] p-10 space-y-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-primary/5 rounded-full blur-[80px]" />
            
            <div className="w-24 h-24 rounded-full bg-success/10 text-success flex items-center justify-center mx-auto relative animate-bounce mt-4">
              <CheckCircle2 size={56} strokeWidth={1.5} />
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter text-[#1a1c1f]" style={{ fontFamily: 'var(--font-lexend)' }}>
                {t("checkout.successTitle")}
              </h2>
              <p className="text-[#414755] font-semibold text-sm max-w-sm mx-auto leading-relaxed">
                {t("checkout.successDesc")}
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-[#f9f9fe] p-6 rounded-2xl border border-[#e2e2e7] text-left space-y-4">
              <div className="flex justify-between border-b border-[#e2e2e7] pb-3 text-xs uppercase tracking-widest font-black text-[#414755]">
                <span>{t("checkout.orderId")}</span>
                <span className="text-primary italic">#SP-{successOrder.id}</span>
              </div>
              <div className="space-y-2 text-xs font-semibold text-[#414755]">
                <p><span className="text-[#414755]/60 uppercase block text-[10px] tracking-widest font-black mb-0.5">Shipping Address</span> <span className="text-[#1a1c1f]">{successOrder.shippingAddress}</span></p>
                <p><span className="text-[#414755]/60 uppercase block text-[10px] tracking-widest font-black mb-0.5">Phone Number</span> <span className="text-[#1a1c1f]">{successOrder.phoneNumber}</span></p>
                <p><span className="text-[#414755]/60 uppercase block text-[10px] tracking-widest font-black mb-0.5">Payment Method</span> <span className="text-[#1a1c1f] uppercase italic font-bold">{successOrder.paymentMethod}</span></p>
              </div>
              <div className="flex justify-between border-t border-[#e2e2e7] pt-4 text-sm font-black uppercase text-[#1a1c1f]">
                <span>{t("checkout.total")}</span>
                <span className="text-lg text-primary italic font-black">${successOrder.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild className="flex-1 h-14 rounded-xl bg-primary hover:bg-primary/90 text-xs font-black uppercase tracking-widest text-white">
                <Link href={`/${locale}/products`}>{t("checkout.continueShopping")}</Link>
              </Button>
              <Button asChild variant="outline" className="flex-1 h-14 rounded-xl border-[#e2e2e7] hover:bg-[#f9f9fe] text-xs font-black uppercase tracking-widest">
                <Link href={`/${locale}/profile/orders`}>{t("checkout.viewOrders")}</Link>
              </Button>
            </div>
          </div>
        </main>
        
        {/* Simple Footer */}
        <footer className="border-t border-[#e2e2e7] bg-white py-12 px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-10">
            <span className="text-sm font-black italic tracking-tighter uppercase leading-none" style={{ fontFamily: 'var(--font-lexend)' }}>
              SPORT<br/>PRO
            </span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest text-[#717786]">
            {t("checkout.copyright")}
          </p>
        </footer>
      </div>
    );
  }

  const isCartEmpty = !cart || cart.items.length === 0;

  // Dynamically calculate order overview matching Stitch
  const estimatedCost = cart ? cart.totalAmount : 0;
  const standardDelivery = 15;
  const expectedTax = 24;
  const totalPayment = estimatedCost > 0 ? estimatedCost + standardDelivery + expectedTax : 0;

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9fe] font-sans antialiased text-[#1a1c1f]">
      
      {/* 1. Simple Secure Header */}
      <header className="border-b border-[#e2e2e7] bg-white h-20 flex items-center justify-between px-8 md:px-16">
        <div className="flex items-center gap-10">
          <span className="text-xl font-black italic tracking-tighter uppercase leading-none" style={{ fontFamily: 'var(--font-lexend)' }}>
            SPORT<br/><span className="text-primary">PRO</span>
          </span>
          <div className="hidden sm:flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[#414755] border-l border-[#c1c6d7] pl-8">
            <Lock size={14} className="text-[#717786]" />
            <span>{t("checkout.security")}</span>
          </div>
        </div>
        <Link href={`/${locale}/cart`} className="text-xs font-black uppercase tracking-widest text-primary hover:underline flex items-center gap-2">
          <ArrowLeft size={14} />
          {t("checkout.backToCart")}
        </Link>
      </header>

      {/* 2. Main Two-Column Layout */}
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-8 py-16 animate-in fade-in duration-700">
        {isCartEmpty ? (
          <div className="bg-white border border-[#e2e2e7] rounded-[2rem] shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-20 flex flex-col items-center text-center gap-6 max-w-xl mx-auto my-12">
            <div className="w-20 h-20 rounded-full bg-[#f9f9fe] flex items-center justify-center text-[#717786]">
              <QrCode size={40} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold uppercase tracking-tight">{t("checkout.emptyCart")}</h3>
            </div>
            <Button asChild className="h-14 px-10 rounded-xl bg-primary hover:bg-primary/90 font-lexend font-black uppercase tracking-widest text-xs text-white">
              <Link href={`/${locale}/products`}>Shop Products</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Column: Form & Payment */}
            <div className="flex-grow w-full lg:w-[calc(100%-440px)] space-y-8 text-left">
              
              {errorMsg && (
                <div className="bg-error/5 border border-error/20 rounded-xl p-4 flex items-center gap-3 text-error text-xs font-bold animate-pulse">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* CARD A: SHOPPING CART */}
              <div className="bg-white border border-[#e2e2e7] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] p-8">
                <div className="flex justify-between items-center pb-6 border-b border-[#e2e2e7]">
                  <h3 className="text-lg font-black uppercase tracking-tight text-[#1a1c1f]" style={{ fontFamily: 'var(--font-lexend)' }}>
                    {t("checkout.shoppingCart")}
                  </h3>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#717786]">
                    {cart.items.reduce((sum, item) => sum + item.quantity, 0)} {t("checkout.productsCount")}
                  </span>
                </div>

                {/* Cart Items List */}
                <div className="divide-y divide-[#e2e2e7] mt-6">
                  {cart.items.map((item) => (
                    <div key={item.id} className="py-6 flex gap-6 items-center first:pt-0 last:pb-0">
                      <div className="w-20 h-20 bg-[#F2F2F7] rounded-xl flex items-center justify-center p-2 relative overflow-hidden border border-[#e2e2e7] shrink-0">
                        <img 
                          src={item.designImageUrl || "/placeholder-product.png"} 
                          className="w-full h-full object-contain"
                          alt={item.productName} 
                        />
                      </div>
                      
                      <div className="flex-grow text-left space-y-1 overflow-hidden">
                        <span className="text-[9px] font-black uppercase tracking-widest text-[#717786] block">
                          {item.productName.toLowerCase().includes("tee") || item.productName.toLowerCase().includes("shirt") ? "CLOTHES" : "SHOES"}
                        </span>
                        <p className="text-sm font-black uppercase truncate text-[#1a1c1f]" style={{ fontFamily: 'var(--font-lexend)' }}>
                          {item.productName}
                        </p>
                        <p className="text-[10px] font-bold text-[#717786]">
                          Size: {item.size} / Color: {item.color}
                        </p>

                        {/* Quantity and Erase Panel */}
                        <div className="flex items-center gap-4 pt-2">
                          <div className="flex items-center border border-[#c1c6d7] rounded-full h-8 px-2 bg-white">
                            <button
                              type="button"
                              onClick={() => item.quantity > 1 && updateQuantity(item.variantId, item.quantity - 1)}
                              className="w-6 h-6 flex items-center justify-center text-[#717786] hover:text-[#1a1c1f] transition-colors"
                            >
                              <Minus size={10} />
                            </button>
                            <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                              className="w-6 h-6 flex items-center justify-center text-[#717786] hover:text-[#1a1c1f] transition-colors"
                            >
                              <Plus size={10} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-[10px] font-black uppercase tracking-widest text-[#717786] hover:text-error transition-colors"
                          >
                            ERASE
                          </button>
                        </div>
                      </div>

                      <span className="text-base font-black italic text-[#1a1c1f] shrink-0" style={{ fontFamily: 'var(--font-lexend)' }}>
                        ${(item.salePrice * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD B: DELIVERY INFORMATION */}
              <div className="bg-white border border-[#e2e2e7] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] p-8">
                <div className="flex items-center gap-3 pb-6 border-b border-[#e2e2e7]">
                  <Truck className="text-[#0058bc]" size={20} />
                  <h3 className="text-lg font-black uppercase tracking-tight text-[#1a1c1f]" style={{ fontFamily: 'var(--font-lexend)' }}>
                    {t("checkout.deliveryInfo")}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {/* Email row (Full width on md) */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#414755]">
                      {t("checkout.emailAddress")}
                    </label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="athlete@example.com"
                      className="w-full h-12 px-4 rounded-xl border border-[#c1c6d7] bg-[#f9f9fe] text-xs font-semibold focus:border-primary outline-none transition-colors"
                    />
                  </div>

                  {/* Name and Surname */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#414755]">
                      {t("checkout.firstName")}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="John"
                      className="w-full h-12 px-4 rounded-xl border border-[#c1c6d7] bg-[#f9f9fe] text-xs font-semibold focus:border-primary outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#414755]">
                      {t("checkout.lastName")}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="w-full h-12 px-4 rounded-xl border border-[#c1c6d7] bg-[#f9f9fe] text-xs font-semibold focus:border-primary outline-none transition-colors"
                    />
                  </div>

                  {/* Phone Row */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#414755]">
                      {t("checkout.phoneNumber")} *
                    </label>
                    <input 
                      type="text" 
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0987654321"
                      className="w-full h-12 px-4 rounded-xl border border-[#c1c6d7] bg-[#f9f9fe] text-xs font-semibold focus:border-primary outline-none transition-colors"
                    />
                  </div>

                  {/* Street Address */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-[9px] font-black uppercase tracking-widest text-[#414755]">
                      {t("checkout.streetAddress")}
                    </label>
                    <input 
                      type="text" 
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="123 Performance Way"
                      className="w-full h-12 px-4 rounded-xl border border-[#c1c6d7] bg-[#f9f9fe] text-xs font-semibold focus:border-primary outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* CARD C: PAYMENT METHODS */}
              <div className="bg-white border border-[#e2e2e7] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] p-8">
                <div className="flex items-center gap-3 pb-6 border-b border-[#e2e2e7]">
                  <QrCode className="text-[#0058bc]" size={20} />
                  <h3 className="text-lg font-black uppercase tracking-tight text-[#1a1c1f]" style={{ fontFamily: 'var(--font-lexend)' }}>
                    {t("checkout.paymentMethods")}
                  </h3>
                </div>

                <div className="mt-6">
                  {/* Unified Selected Option: QR Transfer */}
                  <div className="border-2 border-primary bg-primary/[0.02] p-8 rounded-3xl text-left flex flex-col md:flex-row gap-8 items-center">
                    
                    {/* Visual checked indicator */}
                    <div className="hidden">
                      <input type="radio" checked readOnly className="text-primary focus:ring-primary" />
                    </div>

                    {/* QR Code Placeholder Box */}
                    <div className="w-[140px] h-[140px] bg-white border border-[#e2e2e7] rounded-2xl flex items-center justify-center p-2 shrink-0 shadow-sm relative group overflow-hidden">
                      <img 
                        src={`https://img.vietqr.io/image/vietcombank-1234567890-compact.png?amount=${totalPayment}&addInfo=SPORTPRO`}
                        className="w-full h-full object-contain"
                        alt="Vietcombank QR Code"
                      />
                    </div>

                    {/* Transaction Details */}
                    <div className="space-y-2 text-sm text-[#414755] font-semibold">
                      <p className="text-xs font-black uppercase tracking-widest text-[#0058bc] pb-1">
                        {t("checkout.transferQr")}
                      </p>
                      <p>Bank: <strong className="text-[#1a1c1f]">Vietcombank</strong></p>
                      <p>Account number: <strong className="text-[#1a1c1f]">1234567890</strong></p>
                      <p>Account holder: <strong className="text-[#1a1c1f]">CONG TY SPORT PRO</strong></p>
                      <p>CK Content: <strong className="text-[#1a1c1f] uppercase">[Order ID]</strong></p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Overview (Sticky) */}
            <div className="w-full lg:w-[380px] shrink-0">
              <div className="sticky top-32 space-y-8">
                
                {/* CARD D: ORDER OVERVIEW */}
                <div className="bg-white border border-[#e2e2e7] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] p-8 space-y-8 text-left">
                  <h3 className="text-lg font-black uppercase tracking-tight text-[#1a1c1f]" style={{ fontFamily: 'var(--font-lexend)' }}>
                    {t("checkout.orderOverview")}
                  </h3>

                  {/* Estimated calculation rows */}
                  <div className="space-y-4 text-xs font-semibold text-[#414755]">
                    <div className="flex justify-between items-center">
                      <span>{t("checkout.estimated")} ({cart.items.reduce((sum, item) => sum + item.quantity, 0)} products)</span>
                      <span className="text-[#1a1c1f]">${estimatedCost.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>{t("checkout.standardDelivery")}</span>
                      <span className="text-[#1a1c1f]">${standardDelivery.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>{t("checkout.expectedTax")}</span>
                      <span className="text-[#1a1c1f]">${expectedTax.toLocaleString()}</span>
                    </div>

                    <div className="pt-6 border-t border-[#e2e2e7] flex justify-between items-center">
                      <span className="text-sm font-black uppercase text-[#1a1c1f] tracking-tight">{t("checkout.total")}</span>
                      <span className="text-2xl font-black italic tracking-tighter text-[#1a1c1f]" style={{ fontFamily: 'var(--font-lexend)' }}>
                        ${totalPayment.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Buttons Action Segment */}
                  <div className="space-y-3 pt-4">
                    {/* Wrench button */}
                    <button
                      type="button"
                      className="w-full h-14 bg-primary hover:bg-[#004493] text-white font-black uppercase text-[10px] tracking-widest rounded-xl flex items-center justify-center gap-2.5 transition-colors shadow-lg shadow-primary/10"
                    >
                      <Wrench size={14} />
                      <span>{t("checkout.customizeButton")}</span>
                    </button>

                    {/* Primary Confirmation button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-14 bg-[#fe9400] hover:bg-[#e08200] text-white font-black uppercase text-[10px] tracking-widest rounded-xl flex items-center justify-center gap-2.5 transition-colors shadow-lg shadow-[#fe9400]/10 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <CheckCircle2 size={16} />
                      )}
                      <span>{isSubmitting ? t("checkout.processing") : t("checkout.confirmButton")}</span>
                    </button>
                  </div>

                  {/* Standard Trust Notice */}
                  <p className="text-[10px] text-[#717786] font-semibold leading-relaxed text-center pt-2">
                    {t("checkout.notice")}
                  </p>
                </div>

              </div>
            </div>

          </form>
        )}
      </main>

      {/* 3. High-Aspect Professional Footer */}
      <footer className="border-t border-[#e2e2e7] bg-white py-16 px-8 md:px-16 text-left">
        <div className="max-w-[1280px] mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-8">
          
          <div className="flex items-center gap-12">
            <span className="text-sm font-black italic tracking-tighter uppercase leading-none" style={{ fontFamily: 'var(--font-lexend)' }}>
              SPORT<br/><span className="text-primary">PRO</span>
            </span>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-[10px] font-black uppercase tracking-widest text-[#717786]">
              <a href="#" className="hover:text-primary transition-colors">{t("checkout.security")}</a>
              <a href="#" className="hover:text-primary transition-colors">{t("checkout.clause")}</a>
              <a href="#" className="hover:text-primary transition-colors">{t("checkout.returnsExchanges")}</a>
              <a href="#" className="hover:text-primary transition-colors">{t("checkout.contact")}</a>
            </div>
          </div>

          <p className="text-[10px] font-black uppercase tracking-widest text-[#717786]">
            {t("checkout.copyright")}
          </p>
        </div>
      </footer>

    </div>
  );
}
