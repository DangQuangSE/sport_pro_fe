"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Calendar,
  CreditCard,
  Truck,
  Package,
  ChevronLeft,
  Loader2,
  CheckCircle,
  XCircle,
  MapPin,
  Clock,
  ShieldAlert,
  ShoppingBag
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { orderService, OrderResponse, OrderStatus } from "@/services/orderService";
import { useTranslation } from "@/hooks/useTranslation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OrderDetailPage() {
  const { id } = useParams() as { id: string };
  const { t, locale } = useTranslation();
  const router = useRouter();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchOrderDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await orderService.getOrderDetails(Number(id));
        setOrder(res.data);
      } catch (err) {
        console.error("Failed to fetch order detail", err);
        setError(t("profile.orders.errorDetail"));
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock size={20} className="text-warning animate-pulse" />;
      case OrderStatus.CONFIRMED:
        return <CheckCircle size={20} className="text-info" />;
      case OrderStatus.SHIPPED:
        return <Truck size={20} className="text-primary" />;
      case OrderStatus.DELIVERED:
        return <CheckCircle size={20} className="text-success" />;
      case OrderStatus.CANCELLED:
        return <XCircle size={20} className="text-error" />;
      default:
        return <Clock size={20} className="text-on-surface-variant" />;
    }
  };

  const getStatusColorClass = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return "text-warning bg-warning/5 border-warning/20";
      case OrderStatus.CONFIRMED:
        return "text-info bg-info/5 border-info/20";
      case OrderStatus.SHIPPED:
        return "text-primary bg-primary/5 border-primary/20";
      case OrderStatus.DELIVERED:
        return "text-success bg-success/5 border-success/20";
      case OrderStatus.CANCELLED:
        return "text-error bg-error/5 border-error/20";
      default:
        return "text-on-surface-variant bg-surface-variant border-outline-variant";
    }
  };

  // Helper to split custom prefix receiver from shippingAddress string if formatted like: "Receiver Name - Address details..."
  const parseAddress = (fullAddr: string) => {
    if (!fullAddr) return { receiver: "N/A", address: "N/A" };
    const parts = fullAddr.split(" - ");
    if (parts.length > 1) {
      return {
        receiver: parts[0],
        address: parts.slice(1).join(" - ")
      };
    }
    return {
      receiver: "N/A",
      address: fullAddr
    };
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <Navbar />
        <main className="flex-grow pt-32 pb-20 px-8 flex flex-col items-center justify-center gap-4 text-on-surface-variant">
          <Loader2 size={36} className="animate-spin text-primary" />
          <p className="text-xs font-bold uppercase tracking-widest italic">{t("profile.orders.loadingDetail")}</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <Navbar />
        <main className="flex-grow pt-32 pb-20 px-8 max-w-lg mx-auto w-full flex flex-col items-center justify-center text-center gap-6">
          <ShieldAlert size={56} className="text-error" />
          <div className="space-y-2">
            <h3 className="text-xl font-bold uppercase tracking-tight">{t("profile.orders.notFound")}</h3>
            <p className="text-xs text-on-surface-variant font-medium">{error || "Something went wrong"}</p>
          </div>
          <Button asChild className="h-12 px-6 rounded-xl bg-primary text-surface font-black uppercase tracking-widest text-xs">
            <Link href={`/${locale}/profile/orders`}>{t("profile.orders.backToList")}</Link>
          </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const { receiver, address } = parseAddress(order.shippingAddress);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />

      <main className="flex-grow pt-32 pb-20 px-8 max-w-[1000px] mx-auto w-full animate-in fade-in duration-700">
        
        {/* Back Link */}
        <Link 
          href={`/${locale}/profile/orders`} 
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mb-10"
        >
          <ChevronLeft size={16} />
          {t("profile.orders.backToList")}
        </Link>

        {/* Title Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-outline-variant pb-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-[36px] font-black italic tracking-tighter text-on-surface uppercase leading-none" style={{ fontFamily: 'var(--font-lexend)' }}>
              {t("profile.orders.detailTitle")} <span className="text-primary">#SP-{order.id}</span>
            </h1>
            <div className="flex items-center gap-6 text-[10px] font-bold text-on-surface-variant/70">
              <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}</span>
              <span className="flex items-center gap-1.5"><CreditCard size={12} /> {order.paymentMethod}</span>
            </div>
          </div>

          <div className={cn(
            "flex items-center gap-2 text-xs font-black uppercase tracking-widest px-4 py-2.5 rounded-full border self-start md:self-auto",
            getStatusColorClass(order.status)
          )}>
            {getStatusIcon(order.status)}
            <span>{order.status}</span>
          </div>
        </div>

        {/* Layout details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 text-left">
          
          {/* Left / Center: Details & Items */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Shipping Card */}
            <div className="bg-surface-container/20 border border-outline-variant/60 rounded-3xl p-8 space-y-6">
              <h3 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                {t("profile.orders.shippingAddress")}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-semibold text-on-surface-variant">
                <div className="space-y-1">
                  <span className="text-on-surface-variant/55 uppercase text-[9px] tracking-widest font-black block mb-1">
                    {t("profile.orders.receiver")}
                  </span>
                  <span className="text-sm font-black text-on-surface uppercase">{receiver}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-on-surface-variant/55 uppercase text-[9px] tracking-widest font-black block mb-1">
                    {t("profile.orders.phone")}
                  </span>
                  <span className="text-sm font-black text-on-surface">{order.phoneNumber}</span>
                </div>
                <div className="sm:col-span-2 space-y-1">
                  <span className="text-on-surface-variant/55 uppercase text-[9px] tracking-widest font-black block mb-1">
                    {t("profile.orders.shippingAddress")}
                  </span>
                  <span className="text-xs text-on-surface-variant leading-relaxed">{address}</span>
                </div>
              </div>
            </div>

            {/* Itemized List */}
            <div className="space-y-6">
              <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <Package size={18} className="text-primary" />
                {t("profile.orders.items")}
              </h3>

              <div className="border border-outline-variant rounded-3xl overflow-hidden divide-y divide-outline-variant bg-surface">
                {order.items?.map((item) => (
                  <div key={item.id} className="p-6 flex gap-6 items-center">
                    <div className="w-16 h-16 rounded-xl bg-surface-container border border-outline-variant shrink-0 overflow-hidden relative">
                      <img 
                        src={item.designImageUrl || "/placeholder-product.png"} 
                        className="w-full h-full object-contain p-1"
                        alt={item.productName} 
                      />
                    </div>
                    <div className="flex-grow text-left space-y-1 overflow-hidden">
                      <p className="text-sm font-black uppercase truncate text-on-surface">{item.productName}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] font-bold text-on-surface-variant/80">
                        <span>SIZE: <span className="text-on-surface">{item.size}</span></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                        <span>COLOR: <span className="text-on-surface">{item.color}</span></span>
                        <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
                        <span>QTY: <span className="text-on-surface">{item.quantity}</span></span>
                      </div>
                    </div>
                    <div className="text-right shrink-0 space-y-0.5">
                      <p className="text-xs font-semibold text-on-surface-variant/70">${item.price.toLocaleString()} each</p>
                      <p className="text-sm font-black italic text-on-surface">${(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right: Summary Invoice */}
          <div className="space-y-8">
            <div className="bg-surface-container/20 border border-outline-variant/60 rounded-3xl p-8 space-y-6">
              <h3 className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                <ShoppingBag size={18} className="text-primary" />
                {t("profile.orders.summary")}
              </h3>

              <div className="space-y-4 text-xs font-semibold text-on-surface-variant">
                <div className="flex justify-between">
                  <span>{t("profile.orders.subtotal")}</span>
                  <span className="text-on-surface">${order.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("profile.orders.shipping")}</span>
                  <span className="text-primary uppercase font-bold italic text-[10px]">{t("profile.orders.shippingFree")}</span>
                </div>
                <div className="flex justify-between border-t border-outline-variant/60 pt-4 text-sm font-black text-on-surface uppercase">
                  <span>{t("profile.orders.totalAmount")}</span>
                  <span className="text-lg text-primary italic font-black">${order.totalAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
