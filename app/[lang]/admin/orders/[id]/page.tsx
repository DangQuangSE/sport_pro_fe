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
  ShoppingBag,
  User,
  Mail,
  Phone,
  RefreshCcw,
  Edit2
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminOrderDetailPage() {
  const { id } = useParams() as { id: string };
  const params = useParams();
  const locale = params?.lang as string || "en";
  const router = useRouter();

  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getOrderDetails(Number(id));
      setOrder(res.data);
    } catch (err: any) {
      console.error("Failed to fetch admin order details", err);
      setError("Failed to retrieve order details or order does not exist.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;
    try {
      setIsUpdatingStatus(true);
      await adminService.updateOrderStatus(order.id, newStatus);
      toast.success(`Order status successfully updated to ${newStatus}`);
      // Refresh order data
      const updatedRes = await adminService.getOrderDetails(order.id);
      setOrder(updatedRes.data);
    } catch (err: any) {
      console.error("Failed to update status", err);
      toast.error(err.message || "Failed to update order status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PENDING":
        return <Clock size={16} className="text-amber-600" />;
      case "CONFIRMED":
        return <CheckCircle size={16} className="text-blue-600" />;
      case "SHIPPING":
      case "SHIPPED":
        return <Truck size={16} className="text-indigo-600" />;
      case "DELIVERED":
        return <CheckCircle size={16} className="text-green-600" />;
      case "CANCELLED":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <Clock size={16} className="text-slate-600" />;
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "PENDING":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "CONFIRMED":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "SHIPPING":
      case "SHIPPED":
        return "text-indigo-600 bg-indigo-50 border-indigo-200";
      case "DELIVERED":
        return "text-green-600 bg-green-50 border-green-200";
      case "CANCELLED":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-slate-600 bg-slate-50 border-slate-200";
    }
  };

  // Parses address formatted like "Receiver Name - Address Details (Email: ...)"
  const parseAddress = (fullAddr: string) => {
    if (!fullAddr) return { receiver: "N/A", address: "N/A", extraEmail: "" };
    
    // Extract Email if present
    let extraEmail = "";
    const emailMatch = fullAddr.match(/\(Email:\s*([^)]+)\)/i);
    if (emailMatch) {
      extraEmail = emailMatch[1];
      fullAddr = fullAddr.replace(/\(Email:\s*[^)]+\)/i, "").trim();
    }

    const parts = fullAddr.split(" - ");
    if (parts.length > 1) {
      return {
        receiver: parts[0].trim(),
        address: parts.slice(1).join(" - ").trim(),
        extraEmail
      };
    }
    return {
      receiver: "N/A",
      address: fullAddr.trim(),
      extraEmail
    };
  };

  if (isLoading) {
    return (
      <div className="space-y-8 py-20 flex flex-col items-center justify-center text-on-surface-variant">
        <Loader2 size={36} className="animate-spin text-primary" />
        <p className="text-xs font-black uppercase tracking-widest italic">Retrieving secure order file...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-lg mx-auto w-full py-20 flex flex-col items-center justify-center text-center gap-6">
        <ShieldAlert size={56} className="text-error" />
        <div className="space-y-2">
          <h3 className="text-xl font-bold uppercase tracking-tight text-on-surface">Order Not Found</h3>
          <p className="text-xs text-on-surface-variant font-medium">{error || "Something went wrong"}</p>
        </div>
        <Button asChild className="h-12 px-6 rounded-xl bg-primary text-surface font-black uppercase tracking-widest text-xs">
          <Link href={`/${locale}/admin/orders`}>Back to Orders List</Link>
        </Button>
      </div>
    );
  }

  const { receiver, address, extraEmail } = parseAddress(order.shippingAddress);
  
  // Financial specs matching storefront checkout calculations
  const estimatedCost = order.totalAmount ? order.totalAmount - 39 : 0;
  const standardDelivery = 15;
  const expectedTax = 24;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-left">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-medium text-on-surface-variant uppercase tracking-widest">
        <Link href={`/${locale}/admin`} className="hover:text-primary transition-colors flex items-center gap-1">
          Admin
        </Link>
        <span className="text-[14px] leading-none">›</span>
        <Link href={`/${locale}/admin/orders`} className="hover:text-primary transition-colors">
          Orders
        </Link>
        <span className="text-[14px] leading-none">›</span>
        <span className="text-on-surface font-black">#ORD-{order.id.toString().padStart(6, '0')}</span>
      </div>

      {/* Title block with actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-outline-variant pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Link href={`/${locale}/admin/orders`} className="p-2 border border-outline-variant rounded-xl hover:bg-surface-variant/30 text-on-surface transition-colors shrink-0">
              <ChevronLeft size={16} />
            </Link>
            <h2 className="text-3xl font-black italic tracking-tighter text-on-surface uppercase font-lexend">
              Order Details <span className="text-primary italic">#SP-{order.id}</span>
            </h2>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-bold text-on-surface-variant/70 pl-12">
            <span className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(order.createdAt).toLocaleString()}</span>
            <span className="flex items-center gap-1.5"><CreditCard size={12} /> {order.paymentMethod}</span>
          </div>
        </div>

        <button 
          onClick={fetchOrderDetail}
          className="self-start md:self-auto p-3 rounded-xl border border-outline-variant hover:bg-surface-container/50 text-on-surface transition-colors flex items-center gap-2 text-xs font-black uppercase tracking-widest"
        >
          <RefreshCcw size={14} />
          Refresh
        </button>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (span 2) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Section: Status Update panel */}
          <div className="bg-surface border border-outline-variant shadow-sm rounded-3xl p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-on-surface flex items-center gap-2">
              <Package size={18} className="text-primary" />
              Fulfillment Status
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-surface-container/30 border border-outline-variant/60">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">Current Status</span>
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest",
                  getStatusBadgeClass(order.status)
                )}>
                  {getStatusIcon(order.status)}
                  <span>{order.status}</span>
                </div>
              </div>

              <div className="space-y-2 min-w-[220px]">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">Update Status</label>
                <div className="relative">
                  <select
                    disabled={isUpdatingStatus}
                    value={order.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface text-xs font-bold uppercase tracking-widest appearance-none outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="PENDING">PENDING</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="SHIPPING">SHIPPING</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                  <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant font-bold text-xs">
                    ▼
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Ordered Items panel */}
          <div className="bg-surface border border-outline-variant shadow-sm rounded-3xl p-8">
            <h3 className="text-sm font-black uppercase tracking-wider text-on-surface flex items-center gap-2 pb-6 border-b border-outline-variant/60 mb-6">
              <ShoppingBag size={18} className="text-primary" />
              Ordered Items ({order.items?.length || 0} products)
            </h3>

            <div className="divide-y divide-outline-variant/60">
              {order.items?.map((item: any) => (
                <div key={item.id} className="py-6 flex gap-6 items-center first:pt-0 last:pb-0">
                  <div className="w-16 h-16 bg-surface-container rounded-xl flex items-center justify-center p-2 border border-outline-variant shrink-0 overflow-hidden relative">
                    <img 
                      src={item.designImageUrl || "/placeholder-product.png"} 
                      className="w-full h-full object-contain"
                      alt={item.productName} 
                    />
                  </div>
                  
                  <div className="flex-grow space-y-1 overflow-hidden">
                    <p className="text-xs font-black uppercase truncate text-on-surface" style={{ fontFamily: 'var(--font-lexend)' }}>
                      {item.productName}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-on-surface-variant/80">
                      <span>Size: <strong className="text-on-surface font-black">{item.size}</strong></span>
                      <span>Color: <strong className="text-on-surface font-black">{item.color}</strong></span>
                      <span>Qty: <strong className="text-primary font-black">{item.quantity}</strong></span>
                    </div>

                    {item.designImageUrl && (
                      <a 
                        href={item.designImageUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary hover:underline pt-1"
                      >
                        View Print Layout Image
                      </a>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-on-surface-variant">${item.salePrice.toLocaleString()} each</p>
                    <p className="text-sm font-black italic text-primary" style={{ fontFamily: 'var(--font-lexend)' }}>
                      ${(item.salePrice * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (span 1) */}
        <div className="space-y-8">
          
          {/* Customer File Card */}
          <div className="bg-surface border border-outline-variant shadow-sm rounded-3xl p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-on-surface flex items-center gap-2">
              <User size={18} className="text-primary" />
              Customer File
            </h3>

            <div className="space-y-5 text-xs font-semibold text-on-surface-variant">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary text-sm font-black shrink-0 uppercase border border-primary/10">
                  {receiver ? receiver.charAt(0) : "A"}
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 block mb-0.5">Name</span>
                  <span className="text-sm font-black text-on-surface uppercase">{receiver}</span>
                </div>
              </div>

              <div className="border-t border-outline-variant/60 pt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-on-surface-variant/70 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 block">Email Record</span>
                    <span className="text-xs font-bold text-on-surface select-all">{extraEmail || "No registered email"}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-on-surface-variant/70 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 block">Contact Phone</span>
                    <span className="text-xs font-bold text-on-surface select-all">{order.phoneNumber}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-on-surface-variant/70 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 block">Shipping Destination</span>
                    <span className="text-xs font-bold text-on-surface leading-relaxed">{address}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Billing Overview Card */}
          <div className="bg-surface border border-outline-variant shadow-sm rounded-3xl p-8 space-y-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-on-surface flex items-center gap-2">
              <CreditCard size={18} className="text-primary" />
              Billing & Specs
            </h3>

            <div className="space-y-4 text-xs font-semibold text-on-surface-variant">
              <div className="flex justify-between items-center">
                <span>Estimated Subtotal</span>
                <span className="text-on-surface">${estimatedCost.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>Standard Handling Fee</span>
                <span className="text-on-surface">${standardDelivery.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Expected Tax spec</span>
                <span className="text-on-surface">${expectedTax.toLocaleString()}</span>
              </div>

              <div className="pt-5 border-t border-outline-variant/60 flex justify-between items-center">
                <span className="text-sm font-black uppercase text-on-surface tracking-tight">Total Fulfillment Value</span>
                <span className="text-xl font-black italic tracking-tighter text-primary" style={{ fontFamily: 'var(--font-lexend)' }}>
                  ${order.totalAmount?.toLocaleString()}
                </span>
              </div>

              <div className="bg-surface-container/50 border border-outline-variant/60 rounded-xl p-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span>Method</span>
                <span className="text-primary italic">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
