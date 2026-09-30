"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Clock3, Loader2 } from "lucide-react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useTranslation } from "@/hooks/useTranslation";
import { orderService, OrderResponse } from "@/services/orderService";
import { OrderSuccessPage } from "@/components/checkout/OrderSuccessPage";

interface PaymentResultClientProps {
  code?: string;
  status?: string;
  cancel?: string;
  orderCode?: string;
}

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export default function PaymentResultClient({
  code,
  status,
  cancel,
  orderCode,
}: PaymentResultClientProps) {
  const { t, locale } = useTranslation();
  const { isLoggedIn, isLoading: isLoadingAuth } = useAuthContext();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(false);

  const isCancelled = cancel === "true" || status === "CANCELLED";
  const paymentReportedSuccessful = !isCancelled && (code === "00" || status === "PAID");
  const parsedOrderCode = orderCode && /^\d+$/.test(orderCode) ? Number(orderCode) : null;

  useEffect(() => {
    if (isLoadingAuth || !isLoggedIn || !parsedOrderCode || !paymentReportedSuccessful) {
      return;
    }

    let cancelled = false;
    const loadOrder = async () => {
      setIsLoadingOrder(true);
      try {
        // Webhooks can arrive just after the browser return. A short retry
        // window makes the receipt reflect CONFIRMED without trusting the URL.
        for (let attempt = 0; attempt < 5; attempt += 1) {
          const response = await orderService.getOrderDetails(parsedOrderCode);
          if (cancelled) return;
          setOrder(response.data);
          if (response.data.status !== "PENDING" || attempt === 4) return;
          await wait(1200);
        }
      } catch (error) {
        console.error("Failed to load PayOS order result", error);
      } finally {
        if (!cancelled) setIsLoadingOrder(false);
      }
    };

    loadOrder();
    return () => {
      cancelled = true;
    };
  }, [isLoadingAuth, isLoggedIn, parsedOrderCode, paymentReportedSuccessful]);

  if (order?.status === "CONFIRMED" || order?.status === "PROCESSING" || order?.status === "SHIPPED" || order?.status === "DELIVERED") {
    return <OrderSuccessPage successOrder={order} locale={locale} t={t} />;
  }

  const text = locale === "vi"
    ? {
        successTitle: "Đã nhận kết quả thanh toán",
        successDescription: "PayOS đã trả kết quả thành công. Đơn hàng đang được xác nhận trên hệ thống.",
        pendingTitle: "Đang xác nhận thanh toán",
        pendingDescription: "Đơn hàng đã được tạo. Hệ thống đang chờ PayOS gửi xác nhận cuối cùng.",
        cancelledTitle: "Thanh toán chưa hoàn tất",
        cancelledDescription: "Bạn đã hủy hoặc chưa hoàn tất thanh toán PayOS. Đơn hàng vẫn đang chờ thanh toán.",
        signIn: "Đăng nhập để xem đơn hàng",
        viewOrders: "Xem đơn hàng",
        shop: "Tiếp tục mua sắm",
      }
    : {
        successTitle: "Payment result received",
        successDescription: "PayOS reported a successful payment. The order is being confirmed on the server.",
        pendingTitle: "Payment confirmation pending",
        pendingDescription: "Your order was created and is waiting for PayOS's final webhook confirmation.",
        cancelledTitle: "Payment not completed",
        cancelledDescription: "The PayOS payment was cancelled or not completed. The order is still waiting for payment.",
        signIn: "Sign in to view your order",
        viewOrders: "View orders",
        shop: "Continue shopping",
      };

  const title = isCancelled
    ? text.cancelledTitle
    : paymentReportedSuccessful
      ? (order?.status === "PENDING" || isLoadingOrder ? text.pendingTitle : text.successTitle)
      : text.pendingTitle;
  const description = isCancelled
    ? text.cancelledDescription
    : paymentReportedSuccessful
      ? (order?.status === "PENDING" || isLoadingOrder ? text.pendingDescription : text.successDescription)
      : text.pendingDescription;
  const Icon = isCancelled ? AlertCircle : paymentReportedSuccessful ? CheckCircle2 : Clock3;
  const iconClass = isCancelled ? "text-warning bg-warning/10" : paymentReportedSuccessful ? "text-success bg-success/10" : "text-primary bg-primary/10";

  return (
    <main className="min-h-screen bg-[#f9f9fe] flex items-center justify-center px-6 py-16">
      <section className="max-w-xl w-full bg-white border border-[#e2e2e7] shadow-[0_8px_30px_rgba(0,0,0,0.06)] rounded-[2rem] p-10 text-center space-y-8">
        <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${iconClass}`}>
          {isLoadingOrder ? <Loader2 size={52} className="animate-spin" /> : <Icon size={52} strokeWidth={1.5} />}
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-[#1a1c1f]" style={{ fontFamily: "var(--font-lexend)" }}>
            {title}
          </h1>
          <p className="text-[#414755] font-semibold text-sm leading-relaxed">{description}</p>
          {parsedOrderCode && <p className="text-xs font-black uppercase tracking-widest text-[#717786]">#{parsedOrderCode}</p>}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {isLoggedIn ? (
            <Link href={`/${locale}/profile/orders`} className="flex-1 h-14 rounded-xl bg-primary hover:bg-primary/90 text-xs font-black uppercase tracking-widest text-white flex items-center justify-center">
              {text.viewOrders}
            </Link>
          ) : (
            <Link href={`/${locale}/login`} className="flex-1 h-14 rounded-xl bg-primary hover:bg-primary/90 text-xs font-black uppercase tracking-widest text-white flex items-center justify-center">
              {text.signIn}
            </Link>
          )}
          <Link href={`/${locale}/products`} className="flex-1 h-14 rounded-xl border border-[#e2e2e7] hover:bg-[#f9f9fe] text-xs font-black uppercase tracking-widest flex items-center justify-center">
            {text.shop}
          </Link>
        </div>
      </section>
    </main>
  );
}
