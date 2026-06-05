"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Calendar,
  CreditCard,
  Truck,
  Package,
  ChevronRight,
  Loader2,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCcw
} from "lucide-react";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { orderService, OrderResponse, OrderStatus } from "@/services/orderService";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthContext } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export default function OrderHistoryPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const { isLoggedIn, isLoading: isLoadingAuth } = useAuthContext();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await orderService.getUserOrders({ size: 50 });
      setOrders(res.data.content || []);
    } catch (err) {
      console.error("Failed to fetch user orders", err);
      setError(t("profile.orders.error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoadingAuth) {
      if (isLoggedIn) {
        fetchOrders();
      } else {
        router.push(`/${locale}/login`);
      }
    }
  }, [isLoadingAuth, isLoggedIn, locale, router]);

  if (isLoadingAuth) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32 pb-20">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-primary" />
            <p className="font-lexend font-bold uppercase tracking-widest text-xs text-on-surface-variant">Syncing athlete session...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return <Clock size={16} className="text-warning" />;
      case OrderStatus.CONFIRMED:
        return <CheckCircle size={16} className="text-info" />;
      case OrderStatus.SHIPPED:
        return <Truck size={16} className="text-primary" />;
      case OrderStatus.DELIVERED:
        return <CheckCircle size={16} className="text-success" />;
      case OrderStatus.CANCELLED:
        return <XCircle size={16} className="text-error" />;
      default:
        return <Clock size={16} className="text-on-surface-variant" />;
    }
  };

  const getStatusBadgeClass = (status: OrderStatus) => {
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

  // Filter local items
  const filteredOrders = selectedFilter === "ALL" 
    ? orders 
    : orders.filter(o => o.status === selectedFilter);

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-32 pb-20 px-4 sm:px-8 max-w-[1000px] mx-auto w-full animate-in fade-in duration-700">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Breadcrumbs 
            items={[
              { label: t("profile.title") || "Profile", href: "/profile" },
              { label: t("profile.orders.title") || "Orders" }
            ]} 
          />
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-outline-variant pb-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-[40px] font-black italic tracking-tighter text-on-surface uppercase leading-none" style={{ fontFamily: 'var(--font-lexend)' }}>
              {t("profile.orders.title")}
            </h1>
            <p className="text-on-surface-variant font-medium text-sm">{t("profile.orders.subtitle")}</p>
          </div>
          <button 
            onClick={fetchOrders}
            className="self-start md:self-auto p-3 rounded-xl border border-outline-variant hover:bg-surface-container/50 text-on-surface transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest"
          >
            <RefreshCcw size={14} />
            Reload
          </button>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-outline-variant/60 pb-6">
          {["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={cn(
                "px-5 py-2.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all",
                selectedFilter === filter 
                  ? "bg-primary text-surface border-primary" 
                  : "bg-transparent text-on-surface-variant border-outline-variant hover:border-on-surface-variant/40"
              )}
            >
              {filter === "ALL" ? t("profile.orders.all") : t(`profile.orders.${filter.toLowerCase()}`)}
            </button>
          ))}
        </div>

        {/* Order Listing Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-on-surface-variant">
            <Loader2 size={36} className="animate-spin text-primary" />
            <p className="text-xs font-bold uppercase tracking-widest italic">{t("profile.orders.loading")}</p>
          </div>
        ) : error ? (
          <div className="bg-error/5 border border-error/20 rounded-2xl p-8 flex flex-col items-center text-center gap-4 my-8">
            <AlertCircle size={40} className="text-error" />
            <p className="text-sm font-bold text-error">{error}</p>
            <button 
              onClick={fetchOrders}
              className="h-12 px-6 rounded-xl bg-error text-on-error text-xs font-black uppercase tracking-widest hover:bg-error/90"
            >
              Try Again
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-surface-container/30 border-2 border-dashed border-outline-variant rounded-3xl p-16 flex flex-col items-center text-center gap-6 my-8">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
              <ShoppingBag size={28} strokeWidth={1.5} />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant italic">
              {t("profile.orders.noOrders")}
            </p>
            <Button asChild className="h-12 px-8 rounded-xl bg-primary hover:bg-primary/90 text-xs font-black uppercase tracking-widest text-surface">
              <Link href={`/${locale}/products`}>{t("profile.orders.shopNow")}</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
            {filteredOrders.map((order) => (
              <div 
                key={order.id}
                className="bg-surface border border-outline-variant hover:border-on-surface-variant/30 hover:shadow-xl hover:shadow-primary/[0.02] rounded-3xl p-8 transition-all space-y-6 text-left"
              >
                {/* Upper Meta */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant/60 pb-5">
                  <div className="space-y-1">
                    <p className="text-xs font-black uppercase tracking-widest text-on-surface-variant">
                      {t("profile.orders.orderId")} <span className="text-primary italic">#SP-{order.id}</span>
                    </p>
                    <div className="flex items-center gap-6 text-[10px] font-bold text-on-surface-variant/70">
                      <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(order.createdAt).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1.5"><CreditCard size={12} /> {order.paymentMethod}</span>
                    </div>
                  </div>

                  <div className={cn(
                    "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border self-start md:self-auto",
                    getStatusBadgeClass(order.status)
                  )}>
                    {getStatusIcon(order.status)}
                    <span>{order.status}</span>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="space-y-4">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-lg bg-surface-container border border-outline-variant shrink-0 overflow-hidden relative">
                        <img 
                          src={item.designImageUrl || "/placeholder-product.png"} 
                          className="w-full h-full object-contain p-1"
                          alt={item.productName} 
                        />
                      </div>
                      <div className="flex-grow text-left space-y-0.5 overflow-hidden">
                        <p className="text-xs font-bold uppercase truncate text-on-surface">{item.productName}</p>
                        <p className="text-[10px] font-semibold text-on-surface-variant/80">
                          SIZE: {item.size} | COLOR: {item.color} | QTY: {item.quantity}
                        </p>
                      </div>
                      <span className="text-xs font-black italic text-on-surface shrink-0">
                        ${(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Lower totals */}
                <div className="flex justify-between items-center border-t border-outline-variant/60 pt-5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                    {order.items?.length || 0} {t("profile.orders.itemsCount")}
                  </span>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-0.5">{t("profile.orders.total")}</p>
                      <p className="text-lg font-black italic tracking-tighter text-on-surface">${order.totalAmount?.toLocaleString()}</p>
                    </div>
                    
                    <Button asChild variant="outline" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-outline-variant hover:bg-surface-container/50">
                      <Link href={`/${locale}/profile/orders/${order.id}`}>
                        {t("profile.orders.viewDetail")}
                        <ChevronRight size={14} />
                      </Link>
                    </Button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
