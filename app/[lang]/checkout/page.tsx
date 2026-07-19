"use client";

import React from "react";
import Link from "next/link";
import { QrCode, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCheckout } from "@/hooks/useCheckout";

import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { CheckoutFooter } from "@/components/checkout/CheckoutFooter";
import { OrderSuccessPage } from "@/components/checkout/OrderSuccessPage";
import { CartItemsList } from "@/components/checkout/CartItemsList";
import { CheckoutAddressPicker } from "@/components/checkout/CheckoutAddressPicker";
import { PaymentMethodCard } from "@/components/checkout/PaymentMethodCard";
import { OrderOverviewCard } from "@/components/checkout/OrderOverviewCard";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function CheckoutPage() {
  const {
    cart,
    isCartEmpty,
    updateQuantity,
    removeFromCart,
    email, setEmail,
    addresses,
    isLoadingAddresses,
    selectedAddressId,
    selectAddress,
    isAddingNewAddress,
    startAddingNewAddress,
    cancelAddingNewAddress,
    submitNewAddress,
    isSubmittingNewAddress,
    couponCode,
    setCouponCode,
    discountAmount,
    isApplyingCoupon,
    handleApplyCoupon,
    handleClearCoupon,
    isSubmitting,
    errorMsg,
    successOrder,
    handlePlaceOrder,
    customDesign,
    handleRemoveDesign,
    estimatedCost,
    standardDelivery,
    expectedTax,
    printingCost,
    totalPayment,
    t,
    locale,
  } = useCheckout();

  // Show success receipt when order is placed
  if (successOrder) {
    return <OrderSuccessPage successOrder={successOrder} locale={locale} t={t} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f9f9fe] font-sans antialiased text-[#1a1c1f]">
      {/* 1. Secure Header */}
      <CheckoutHeader
        locale={locale}
        backHref={`/${locale}/cart`}
        backLabel={t("checkout.backToCart")}
        securityLabel={t("checkout.security")}
      />

      {/* 2. Main Two-Column Layout */}
      <main className="flex-grow max-w-[1280px] mx-auto w-full px-4 sm:px-8 py-16 animate-in fade-in duration-700">
        <Breadcrumbs 
          items={[
            { label: t("checkout.shoppingCart") || "Cart", href: "/cart" },
            { label: t("checkout.title") || "Checkout" }
          ]} 
        />
        
        <div className="mt-8">
        {isCartEmpty ? (
          /* Empty Cart State */
          <div className="bg-white border border-[#e2e2e7] rounded-[2rem] shadow-[0_4px_12px_rgba(0,0,0,0.05)] p-20 flex flex-col items-center text-center gap-6 max-w-xl mx-auto my-12">
            <div className="w-20 h-20 rounded-full bg-[#f9f9fe] flex items-center justify-center text-[#717786]">
              <QrCode size={40} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold uppercase tracking-tight">
                {t("checkout.emptyCart")}
              </h3>
            </div>
            <Button
              asChild
              className="h-14 px-10 rounded-xl bg-primary hover:bg-primary/90 font-lexend font-black uppercase tracking-widest text-xs text-white"
            >
              <Link href={`/${locale}/products`}>Shop Products</Link>
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handlePlaceOrder}
            className="flex flex-col lg:flex-row gap-8 items-start"
          >
            {/* Left Column: Form & Payment */}
            <div className="flex-grow w-full lg:w-[calc(100%-440px)] space-y-8 text-left">
              {/* Error Banner */}
              {errorMsg && (
                <div className="bg-error/5 border border-error/20 rounded-xl p-4 flex items-center gap-3 text-error text-xs font-bold animate-pulse">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Card A: Shopping Cart */}
              <CartItemsList
                items={cart!.items}
                t={t}
                onUpdateQuantity={updateQuantity}
                onRemoveFromCart={removeFromCart}
                customDesign={customDesign}
                printingCost={printingCost}
                onRemoveDesign={handleRemoveDesign}
                locale={locale}
              />

              {/* Card B: Delivery Information */}
              <CheckoutAddressPicker
                email={email}
                onEmailChange={setEmail}
                addresses={addresses}
                isLoadingAddresses={isLoadingAddresses}
                selectedAddressId={selectedAddressId}
                onSelectAddress={selectAddress}
                isAddingNewAddress={isAddingNewAddress}
                onStartAddNew={startAddingNewAddress}
                onCancelAddNew={cancelAddingNewAddress}
                onSubmitNewAddress={submitNewAddress}
                isSubmittingNewAddress={isSubmittingNewAddress}
                t={t}
              />

              {/* Card C: Payment Methods */}
              <PaymentMethodCard totalPayment={totalPayment} t={t} />
            </div>

            {/* Right Column: Order Overview (Sticky) */}
            <OrderOverviewCard
              cart={cart!}
              customDesign={customDesign}
              printingCost={printingCost}
              estimatedCost={estimatedCost}
              standardDelivery={standardDelivery}
              expectedTax={expectedTax}
              totalPayment={totalPayment}
              isSubmitting={isSubmitting || isLoadingAddresses}
              locale={locale}
              t={t}
              couponCode={couponCode}
              onCouponCodeChange={setCouponCode}
              discountAmount={discountAmount}
              isApplyingCoupon={isApplyingCoupon}
              onApplyCoupon={handleApplyCoupon}
              onClearCoupon={handleClearCoupon}
            />
          </form>
        )}
        </div>
      </main>

      {/* 3. Footer */}
      <CheckoutFooter t={t} />
    </div>
  );
}
