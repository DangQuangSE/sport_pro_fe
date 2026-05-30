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
  Edit2,
  Download
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

export default function AdminOrderDetailPage() {
  const { id } = useParams() as { id: string };
  const params = useParams();
  const locale = params?.lang as string || "en";
  const router = useRouter();
  const { t } = useTranslation();

  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Printing customization modal states
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [selectedDesign, setSelectedDesign] = useState<any | null>(null);
  const [isDesignLoading, setIsDesignLoading] = useState(false);

  const handleViewCustomDesign = async (designId: number) => {
    setIsDesignModalOpen(true);
    setIsDesignLoading(true);
    setSelectedDesign(null);
    try {
      const res = await adminService.getCustomDesignDetails(designId);
      setSelectedDesign(res.data);
    } catch (err: any) {
      console.error("Failed to fetch custom design details", err);
      toast.error(
        locale === "vi"
          ? "Không thể tải thông tin thiết kế in ấn."
          : "Failed to retrieve custom printing details."
      );
      setIsDesignModalOpen(false);
    } finally {
      setIsDesignLoading(false);
    }
  };

  const handleDownloadLogo = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename || "logo.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success(t("admin.orders.detail.downloadLogoSuccess"));
    } catch (error) {
      console.error("Failed to download logo", error);
      toast.error(t("admin.orders.detail.downloadLogoError"));
      // Fallback: Open in a new tab
      window.open(url, "_blank");
    }
  };

  const fetchOrderDetail = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await adminService.getOrderDetails(Number(id));
      setOrder(res.data);
    } catch (err: any) {
      console.error("Failed to fetch admin order details", err);
      setError(
        locale === "vi" 
          ? "Không thể tải chi tiết đơn hàng hoặc đơn hàng không tồn tại." 
          : "Failed to retrieve order details or order does not exist."
      );
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
      toast.success(
        locale === "vi" 
          ? `Cập nhật trạng thái đơn hàng thành ${newStatus} thành công` 
          : `Order status successfully updated to ${newStatus}`
      );
      // Refresh order data
      const updatedRes = await adminService.getOrderDetails(order.id);
      setOrder(updatedRes.data);
    } catch (err: any) {
      console.error("Failed to update status", err);
      toast.error(err.message || (locale === "vi" ? "Cập nhật trạng thái đơn hàng thất bại." : "Failed to update order status."));
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
      case "PROCESSING":
        return <Clock size={16} className="text-slate-600" />;
      case "SHIPPING":
      case "SHIPPED":
        return <Truck size={16} className="text-indigo-600" />;
      case "DELIVERED":
        return <CheckCircle size={16} className="text-green-600" />;
      case "CANCELLED":
        return <XCircle size={16} className="text-red-600" />;
      case "RETURN_REQUESTED":
        return <Clock size={16} className="text-purple-600" />;
      case "RETURNED":
        return <CheckCircle size={16} className="text-fuchsia-600" />;
      case "REFUNDED":
        return <CheckCircle size={16} className="text-pink-600" />;
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
      case "PROCESSING":
        return "text-slate-600 bg-slate-50 border-slate-200";
      case "SHIPPING":
      case "SHIPPED":
        return "text-indigo-600 bg-indigo-50 border-indigo-200";
      case "DELIVERED":
        return "text-green-600 bg-green-50 border-green-200";
      case "CANCELLED":
        return "text-red-600 bg-red-50 border-red-200";
      case "RETURN_REQUESTED":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "RETURNED":
        return "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200";
      case "REFUNDED":
        return "text-pink-600 bg-pink-50 border-pink-200";
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
        <p className="text-xs font-black uppercase tracking-widest italic">{t("admin.orders.detail.loading")}</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-lg mx-auto w-full py-20 flex flex-col items-center justify-center text-center gap-6">
        <ShieldAlert size={56} className="text-error" />
        <div className="space-y-2">
          <h3 className="text-xl font-bold uppercase tracking-tight text-on-surface">{t("admin.orders.detail.notFound")}</h3>
          <p className="text-xs text-on-surface-variant font-medium">{error || "Something went wrong"}</p>
        </div>
        <Button asChild className="h-12 px-6 rounded-xl bg-primary text-surface font-black uppercase tracking-widest text-xs">
          <Link href={`/${locale}/admin/orders`}>{t("admin.orders.detail.backToList")}</Link>
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
          {t("admin.orders.detail.breadcrumbs.admin")}
        </Link>
        <span className="text-[14px] leading-none">›</span>
        <Link href={`/${locale}/admin/orders`} className="hover:text-primary transition-colors">
          {t("admin.orders.detail.breadcrumbs.orders")}
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
              {t("admin.orders.detail.title")} <span className="text-primary italic">#SP-{order.id}</span>
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
          {t("admin.orders.detail.refresh")}
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
              {t("admin.orders.detail.fulfillmentStatus")}
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-2xl bg-surface-container/30 border border-outline-variant/60">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">{t("admin.orders.detail.currentStatus")}</span>
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest",
                  getStatusBadgeClass(order.status)
                )}>
                  {getStatusIcon(order.status)}
                  <span>{t(`admin.orders.statuses.${order.status.toLowerCase()}`)}</span>
                </div>
              </div>

              <div className="space-y-2 min-w-[220px]">
                <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block">{t("admin.orders.detail.updateStatus")}</label>
                <div className="relative">
                  <select
                    disabled={isUpdatingStatus}
                    value={order.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full h-11 px-4 rounded-xl border border-outline-variant bg-surface text-xs font-bold uppercase tracking-widest appearance-none outline-none focus:border-primary transition-colors cursor-pointer"
                  >
                    <option value="PENDING">{t("admin.orders.statuses.pending").toUpperCase()}</option>
                    <option value="CONFIRMED">{t("admin.orders.statuses.confirmed").toUpperCase()}</option>
                    <option value="PROCESSING">{t("admin.orders.statuses.processing").toUpperCase()}</option>
                    <option value="SHIPPED">{t("admin.orders.statuses.shipped").toUpperCase()}</option>
                    <option value="DELIVERED">{t("admin.orders.statuses.delivered").toUpperCase()}</option>
                    <option value="CANCELLED">{t("admin.orders.statuses.cancelled").toUpperCase()}</option>
                    <option value="RETURN_REQUESTED">{t("admin.orders.statuses.return_requested").toUpperCase()}</option>
                    <option value="RETURNED">{t("admin.orders.statuses.returned").toUpperCase()}</option>
                    <option value="REFUNDED">{t("admin.orders.statuses.refunded").toUpperCase()}</option>
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
              {t("admin.orders.detail.orderedItems")} ({order.items?.length || 0} {t("admin.orders.detail.productsCount")})
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
                      <span>{t("admin.orders.detail.size")}: <strong className="text-on-surface font-black">{item.size}</strong></span>
                      <span>{t("admin.orders.detail.color")}: <strong className="text-on-surface font-black">{item.color}</strong></span>
                      <span>{t("admin.orders.detail.qty")}: <strong className="text-primary font-black">{item.quantity}</strong></span>
                    </div>

                    {item.customDesignId ? (
                      <button 
                        onClick={() => handleViewCustomDesign(Number(item.customDesignId))}
                        className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary hover:underline pt-1 cursor-pointer text-left"
                      >
                        {t("admin.orders.detail.viewDesign")}
                      </button>
                    ) : item.designImageUrl ? (
                      <a 
                        href={item.designImageUrl} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary hover:underline pt-1"
                      >
                        {locale === "vi" ? "Xem ảnh sản phẩm" : "View Product Image"}
                      </a>
                    ) : null}
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-xs font-black text-on-surface-variant">${(item.price ?? item.salePrice ?? 0).toLocaleString()} {t("admin.orders.detail.each")}</p>
                    <p className="text-sm font-black italic text-primary" style={{ fontFamily: 'var(--font-lexend)' }}>
                      ${((item.price ?? item.salePrice ?? 0) * item.quantity).toLocaleString()}
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
              {t("admin.orders.detail.customerFile")}
            </h3>

            <div className="space-y-5 text-xs font-semibold text-on-surface-variant">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary text-sm font-black shrink-0 uppercase border border-primary/10">
                  {receiver ? receiver.charAt(0) : "A"}
                </div>
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 block mb-0.5">{t("admin.orders.detail.name")}</span>
                  <span className="text-sm font-black text-on-surface uppercase">{receiver}</span>
                </div>
              </div>

              <div className="border-t border-outline-variant/60 pt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-on-surface-variant/70 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 block">{t("admin.orders.detail.emailRecord")}</span>
                    <span className="text-xs font-bold text-on-surface select-all">{extraEmail || t("admin.orders.detail.noEmail")}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-on-surface-variant/70 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 block">{t("admin.orders.detail.contactPhone")}</span>
                    <span className="text-xs font-bold text-on-surface select-all">{order.phoneNumber}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-on-surface-variant/70 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/60 block">{t("admin.orders.detail.shippingDestination")}</span>
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
              {t("admin.orders.detail.billingSpecs")}
            </h3>

            <div className="space-y-4 text-xs font-semibold text-on-surface-variant">
              <div className="flex justify-between items-center">
                <span>{t("admin.orders.detail.estimatedSubtotal")}</span>
                <span className="text-on-surface">${estimatedCost.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span>{t("admin.orders.detail.standardHandlingFee")}</span>
                <span className="text-on-surface">${standardDelivery.toLocaleString()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>{t("admin.orders.detail.expectedTax")}</span>
                <span className="text-on-surface">${expectedTax.toLocaleString()}</span>
              </div>

              <div className="pt-5 border-t border-outline-variant/60 flex justify-between items-center">
                <span className="text-sm font-black uppercase text-on-surface tracking-tight">{t("admin.orders.detail.totalFulfillmentValue")}</span>
                <span className="text-xl font-black italic tracking-tighter text-primary" style={{ fontFamily: 'var(--font-lexend)' }}>
                  ${order.totalAmount?.toLocaleString()}
                </span>
              </div>

              <div className="bg-surface-container/50 border border-outline-variant/60 rounded-xl p-4 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span>{t("admin.orders.detail.method")}</span>
                <span className="text-primary italic">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Custom Printing Design Modal */}
      <Modal
        isOpen={isDesignModalOpen}
        onClose={() => setIsDesignModalOpen(false)}
        title={t("admin.orders.detail.designModalTitle")}
        className="max-w-2xl text-on-surface"
      >
        {isDesignLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant gap-4">
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="text-[10px] font-black uppercase tracking-widest italic">
              {t("admin.orders.detail.loadingDetails")}
            </p>
          </div>
        ) : selectedDesign ? (() => {
          let metadata: any = null;
          try {
            if (selectedDesign.designMetadata) {
              metadata = JSON.parse(selectedDesign.designMetadata);
            }
          } catch (e) {
            console.error("Failed to parse design metadata", e);
          }
 
          const texts = metadata?.texts || [];
          const images = metadata?.images || [];
 
          return (
            <div className="space-y-6 text-left">
              {/* Mockup image */}
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase tracking-widest text-on-surface-variant/70 block">
                  {t("admin.orders.detail.mockupLayout")}
                </span>
                <div className="relative w-full h-72 bg-surface-container rounded-2xl flex items-center justify-center p-4 border border-outline-variant overflow-hidden bg-slate-100">
                  <img
                    src={selectedDesign.designImageUrl}
                    alt="Custom Print Mockup"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
 
              {/* General specs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-surface-container/50 border border-outline-variant/60">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-on-surface-variant/80 uppercase block">
                    {t("admin.orders.detail.material")}
                  </span>
                  <span className="text-xs font-black text-primary uppercase">
                    {selectedDesign.printingMaterialName}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-on-surface-variant/80 uppercase block">
                    {t("admin.orders.detail.textsCount")}
                  </span>
                  <span className="text-xs font-black text-on-surface">
                    {selectedDesign.numTextLines}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-on-surface-variant/80 uppercase block">
                    {t("admin.orders.detail.imagesCount")}
                  </span>
                  <span className="text-xs font-black text-on-surface">
                    {selectedDesign.numImages}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-on-surface-variant/80 uppercase block">
                    {t("admin.orders.detail.price")}
                  </span>
                  <span className="text-xs font-black text-success">
                    {locale === "vi"
                      ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(selectedDesign.totalPrintingPrice)
                      : `$${selectedDesign.totalPrintingPrice}`}
                  </span>
                </div>
              </div>
 
              {/* Custom Elements details */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-on-surface border-b border-outline-variant pb-2">
                  {t("admin.orders.detail.customElementsSpecs")}
                </h4>
 
                {/* Text Layers */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                    🔤 {t("admin.orders.detail.customTextLayers")} ({texts.length})
                  </span>
                  {texts.length > 0 ? (
                    <div className="divide-y divide-outline-variant/50 border border-outline-variant/60 rounded-xl overflow-hidden bg-surface">
                      {texts.map((t: any, idx: number) => (
                        <div key={t.id || idx} className="p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-1">
                            <p className="font-bold text-on-surface">
                              &ldquo;<span className="font-black italic text-primary">{t.text}</span>&rdquo;
                            </p>
                            <div className="flex items-center gap-3 text-[10px] text-on-surface-variant">
                              <span>Font: <strong className="text-on-surface">{t.font || "Default"}</strong></span>
                              <span>Size: <strong className="text-on-surface">{t.fontSize || 20}px</strong></span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-[10px] shrink-0 font-mono">
                            <div className="flex items-center gap-1.5 bg-surface-container p-1 rounded-lg border border-outline-variant">
                              <span 
                                className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm" 
                                style={{ backgroundColor: t.color || "#000" }} 
                              />
                              <span className="text-[9px] font-bold uppercase">{t.color || "#000"}</span>
                            </div>
                            <span className="text-on-surface-variant font-bold">X: {Math.round(t.x || 0)}, Y: {Math.round(t.y || 0)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-on-surface-variant/70 italic pl-4">
                      {t("admin.orders.detail.noCustomText")}
                    </p>
                  )}
                </div>
 
                {/* Image Layers */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-on-surface-variant flex items-center gap-1.5">
                    🖼️ {t("admin.orders.detail.customLogoLayers")} ({images.length})
                  </span>
                  {images.length > 0 ? (
                    <div className="divide-y divide-outline-variant/50 border border-outline-variant/60 rounded-xl overflow-hidden bg-surface">
                      {images.map((img: any, idx: number) => (
                        <div key={img.id || idx} className="p-3 text-xs flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 bg-surface-container rounded-lg border border-outline-variant shrink-0 flex items-center justify-center p-1 overflow-hidden">
                              <img
                                src={img.src}
                                alt={img.name || "Custom Logo"}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <p className="font-bold text-on-surface truncate max-w-[180px] sm:max-w-[280px]">
                                {img.name || `Logo_${idx + 1}`}
                              </p>
                              <p className="text-[9px] text-on-surface-variant font-medium">
                                W: {Math.round(img.width || 0)}px &bull; H: {Math.round(img.height || 0)}px
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <span className="text-[10px] text-on-surface-variant font-mono font-bold">
                              X: {Math.round(img.x || 0)}, Y: {Math.round(img.y || 0)}
                            </span>
                            <button
                              onClick={() => handleDownloadLogo(img.src, img.name || `logo_${idx + 1}.png`)}
                              title={t("admin.orders.detail.downloadLogoTooltip")}
                              className="p-1.5 rounded-lg border border-outline-variant hover:bg-primary/10 hover:border-primary text-on-surface-variant hover:text-primary transition-all duration-200 cursor-pointer"
                            >
                              <Download size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-on-surface-variant/70 italic pl-4">
                      {t("admin.orders.detail.noCustomLogo")}
                    </p>
                  )}
                </div>
              </div>
 
              {/* Action buttons */}
              <div className="pt-4 flex justify-end gap-3 border-t border-outline-variant">
                <Button 
                  onClick={() => setIsDesignModalOpen(false)}
                  className="rounded-xl px-5 py-2 font-black uppercase tracking-widest text-xs h-10 border border-outline-variant bg-surface text-on-surface hover:bg-surface-variant/30"
                >
                  {t("admin.orders.detail.close")}
                </Button>
                <a
                  href={selectedDesign.designImageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center bg-primary text-surface rounded-xl px-5 py-2 font-black uppercase tracking-widest text-xs h-10 hover:bg-primary-dark transition-colors shadow-sm"
                >
                  {t("admin.orders.detail.openOriginal")}
                </a>
              </div>
            </div>
          );
        })() : (
          <p className="text-center py-6 text-xs text-on-surface-variant">
            {t("admin.orders.detail.noDesignData")}
          </p>
        )}
      </Modal>
    </div>
  );
}
