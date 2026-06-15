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
  PackageCheck,
  Wrench
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { useCart } from "@/contexts/CartContext";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { apiClient, ApiResponse } from "@/lib/api-client";
import { cartService } from "@/services/cartService";

export default function CartPage() {
  const { cart, isLoading, updateQuantity, removeFromCart, refreshCart } = useCart();
  const { t, locale } = useTranslation();
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const [customDesign, setCustomDesign] = React.useState<any | null>(null);

  const isItemUnavailable = React.useCallback((item: any) => {
    return (
      item.isDeleted === true ||
      item.isActive === false ||
      (item.stockQuantity !== undefined && item.stockQuantity === 0) ||
      (item.stockQuantity !== undefined && item.quantity > item.stockQuantity)
    );
  }, []);

  const getItemStatusNote = React.useCallback((item: any) => {
    if (item.isDeleted) {
      return t("checkout.errors.productDeleted");
    }
    if (item.isActive === false) {
      return t("checkout.errors.productInactive");
    }
    if (item.stockQuantity === 0) {
      return t("checkout.errors.outOfStock");
    }
    if (item.stockQuantity !== undefined && item.quantity > item.stockQuantity) {
      return t("checkout.errors.insufficientStock").replace("{stock}", String(item.stockQuantity));
    }
    return null;
  }, [t]);

  React.useEffect(() => {
    if (!cart) return;

    const customizedItem = cart.items.find(
      (item) => item.customDesignId !== null && item.customDesignId !== undefined
    );

    if (customizedItem && customizedItem.customDesignId) {
      const fetchDesignDetails = async () => {
        try {
          const res = await apiClient.get<ApiResponse<any>>(
            `/custom-designs/${customizedItem.customDesignId}`
          );
          setCustomDesign({
            printingPrice: res.data.totalPrintingPrice,
            materialName: res.data.printingMaterialName,
            designImageUrl: res.data.designImageUrl,
            textsCount: res.data.numTextLines,
            imagesCount: res.data.numImages,
            customDesignId: customizedItem.customDesignId,
          });
        } catch (e) {
          console.error(
            "Failed to fetch custom design from backend, falling back to local storage",
            e
          );
          const savedDesign = localStorage.getItem("sport_pro_custom_design");
          if (savedDesign) {
            try {
              setCustomDesign(JSON.parse(savedDesign));
            } catch (err) {
              console.error("Failed to parse local design", err);
            }
          }
        }
      };
      fetchDesignDetails();
    } else {
      setCustomDesign(null);
    }
  }, [cart]);

  const handleRemoveDesign = async () => {
    if (!cart) return;
    const customizedItem = cart.items.find(
      (item) => item.customDesignId !== null && item.customDesignId !== undefined
    );
    if (!customizedItem) return;

    const toastId = toast.loading(
      locale === "vi"
        ? "Đang xóa thiết kế khỏi giỏ hàng..."
        : "Removing design from cart..."
    );
    try {
      await cartService.addOrUpdateItem({
        variantId: customizedItem.variantId,
        quantity: customizedItem.quantity,
        customDesignId: undefined,
        isReplace: true,
      });

      localStorage.removeItem("sport_pro_custom_design");
      setCustomDesign(null);
      await refreshCart();

      toast.success(
        locale === "vi"
          ? "Đã xóa thiết kế in ấn khỏi giỏ hàng!"
          : "Custom design removed from cart successfully!",
        { id: toastId }
      );
    } catch (err: any) {
      console.error("Failed to remove design", err);
      toast.error(
        err.message ||
          (locale === "vi" ? "Xóa thiết kế thất bại." : "Failed to remove design."),
        { id: toastId }
      );
    }
  };

  const selectedItems = cart ? cart.items.filter(item => selectedIds.includes(item.id)) : [];
  const baseSubtotal = selectedItems.reduce((sum, item) => sum + (item.salePrice * item.quantity), 0);
  const printingCost = selectedItems.reduce((sum, item) => {
    if (item.customDesignId && item.printingPrice) {
      return sum + (item.printingPrice * item.quantity);
    }
    return sum;
  }, 0);
  const subtotal = baseSubtotal + printingCost;

  // Sync selectedIds with cart items to remove any deleted or unavailable items
  React.useEffect(() => {
    if (cart && cart.items) {
      const availableIds = cart.items.filter(item => !isItemUnavailable(item)).map(item => item.id);
      setSelectedIds(prev => prev.filter(id => availableIds.includes(id)));
    }
  }, [cart, isItemUnavailable]);

  const handleUpdateQuantity = async (variantId: number, newQty: number) => {
    try {
      await updateQuantity(variantId, newQty);
    } catch (err: any) {
      toast.error(err.message || (locale === "vi" ? "Cập nhật số lượng thất bại" : "Failed to update quantity"));
    }
  };

  const handleRemoveFromCart = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
      toast.success(locale === "vi" ? "Đã xóa sản phẩm khỏi giỏ hàng." : "Item removed from bag.");
    } catch (err: any) {
      toast.error(err.message || (locale === "vi" ? "Xóa sản phẩm thất bại" : "Failed to remove item"));
    }
  };

  if (isLoading && !cart) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 size={48} className="animate-spin text-primary" />
            <p className="font-lexend font-bold uppercase tracking-widest text-xs text-on-surface-variant">
              {locale === "vi" ? "Đang đồng bộ giỏ hàng..." : "Syncing your gear..."}
            </p>
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

      <main className="flex-grow pt-24 sm:pt-32 pb-20 px-4 sm:px-8 max-w-[1280px] mx-auto w-full animate-in fade-in duration-700">
        <Breadcrumbs items={[{ label: locale === "vi" ? "Giỏ hàng" : "Your Bag" }]} />
        <div className="flex flex-col lg:flex-row gap-16 mt-8">
          {/* Left: Items List */}
          <div className="flex-grow space-y-10">
            <div className="space-y-2">
              <h1 className="text-[48px] font-black tracking-tighter text-on-surface uppercase leading-none" style={{ fontFamily: 'var(--font-lexend)' }}>
                {locale === "vi" ? "Giỏ Hàng" : "Your Bag"}{" "}
                <span className="text-on-surface-variant/40 ml-4">({cart?.items?.length ?? 0})</span>
              </h1>
            </div>

            {isEmpty ? (
              <div className="bg-surface-container/30 border-2 border-dashed border-outline-variant rounded-2xl p-20 flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <ShoppingBag size={40} strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold uppercase tracking-tight">
                    {locale === "vi" ? "Giỏ hàng của bạn đang trống" : "Your bag is empty"}
                  </h3>
                  <p className="text-on-surface-variant max-w-xs mx-auto text-sm font-medium">
                    {locale === "vi" ? "Khi bạn tìm thấy sản phẩm yêu thích, chúng sẽ xuất hiện ở đây." : "Once you find something you like, it will show up here."}
                  </p>
                </div>
                <Button asChild className="h-14 px-10 rounded-xl bg-primary hover:bg-primary/90 font-lexend font-black uppercase tracking-widest text-xs">
                  <Link href={`/${locale}/products`}>
                    {locale === "vi" ? "Mua sắm BST Mới" : "Shop New Arrivals"}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Select All Bar */}
                <div className="flex items-center justify-between p-4 bg-surface-container-highest/20 border border-outline-variant/60 rounded-2xl">
                  <label className={cn(
                    "flex items-center gap-3 select-none font-bold text-xs uppercase tracking-wider text-on-surface-variant",
                    cart.items.filter(item => !isItemUnavailable(item)).length === 0 ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                  )}>
                    <input 
                      type="checkbox"
                      disabled={cart.items.filter(item => !isItemUnavailable(item)).length === 0}
                      checked={cart.items.filter(item => !isItemUnavailable(item)).length > 0 && selectedIds.length === cart.items.filter(item => !isItemUnavailable(item)).length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedIds(cart.items.filter(item => !isItemUnavailable(item)).map(item => item.id));
                        } else {
                          setSelectedIds([]);
                        }
                      }}
                      className="w-5 h-5 rounded-lg border-2 border-outline-variant text-primary focus:ring-primary accent-primary cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-30"
                    />
                    {locale === "vi" ? "Chọn tất cả" : "Select All"} ({selectedIds.length}/{cart.items.length})
                  </label>
                  {selectedIds.length > 0 && (
                    <button 
                      onClick={() => setSelectedIds([])}
                      className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant hover:text-error transition-colors cursor-pointer"
                    >
                      {locale === "vi" ? "Bỏ chọn tất cả" : "Deselect All"}
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {cart.items.map((item) => {
                    const hasDesign = !!item.customDesignId && !!customDesign;
                    return (
                      <div 
                        key={item.id} 
                        className={cn(
                          "flex flex-col gap-4 py-6 border-b border-outline-variant last:border-0 relative text-left animate-in fade-in duration-500",
                          isItemUnavailable(item) && "opacity-60 grayscale-[40%] contrast-[90%]"
                        )}
                      >
                        {/* Product Row */}
                        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                          {/* Checkbox */}
                          <div className="flex items-center self-stretch md:self-auto py-2">
                            <input 
                              type="checkbox"
                              disabled={isItemUnavailable(item)}
                              checked={selectedIds.includes(item.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedIds([...selectedIds, item.id]);
                                } else {
                                  setSelectedIds(selectedIds.filter(id => id !== item.id));
                                }
                              }}
                              className="w-5 h-5 rounded-lg border-2 border-outline-variant text-primary focus:ring-primary accent-primary cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                            />
                          </div>

                          {/* Product Image */}
                          <div className="relative w-full md:w-32 aspect-square rounded-xl bg-surface-container overflow-hidden shrink-0 border border-outline-variant/60">
                            <img 
                              src={item.productImageUrl || item.designImageUrl || "/placeholder-product.png"} 
                              alt={item.productName} 
                              className="w-full h-full object-contain p-2" 
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-grow flex flex-col justify-between py-1">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                                  {locale === "vi" ? "Trang bị hiệu năng" : "Performance Gear"}
                                </p>
                                <Link 
                                  href={`/${locale}/product/${item.productSlug}`}
                                  className="text-lg font-bold uppercase tracking-tight hover:text-primary transition-colors block"
                                >
                                  {item.productName}
                                </Link>
                                <div className="flex flex-wrap gap-x-6 gap-y-1 pt-1">
                                  <p className="text-xs text-on-surface-variant font-medium">
                                    {t("product.details.color") || "Color"}: <span className="text-on-surface font-bold uppercase">{item.color}</span>
                                  </p>
                                  <p className="text-xs text-on-surface-variant font-medium">
                                    {locale === "vi" ? "Kích cỡ" : "Size"}: <span className="text-on-surface font-bold">{item.size}</span>
                                  </p>
                                </div>
                                {getItemStatusNote(item) && (
                                  <div className="mt-2 text-[10px] font-bold text-error bg-error/10 border border-error/20 px-2.5 py-1.5 rounded-lg inline-block uppercase tracking-wider">
                                    {getItemStatusNote(item)}
                                  </div>
                                )}
                                {item.customDesignId && item.printingPrice && (
                                  <div className="inline-flex items-center gap-1.5 bg-primary/5 text-primary text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded border border-primary/20 mt-1">
                                    <Wrench size={10} />
                                    <span>
                                      {locale === "vi" ? "In tùy chọn" : "Custom In"}: +{(item.printingPrice).toLocaleString('vi-VN')} ₫
                                    </span>
                                  </div>
                                )}
                              </div>
                              <p className="text-lg font-black italic tracking-tighter">
                                {`${item.salePrice.toLocaleString('vi-VN')} ₫`}
                              </p>
                            </div>

                            <div className="flex items-center justify-between mt-6">
                              {/* Quantity Control */}
                              <div className={cn(
                                "flex items-center gap-4 border border-outline-variant rounded-xl px-2 h-10 bg-white",
                                (item.isDeleted || item.isActive === false || item.stockQuantity === 0) && "opacity-40 pointer-events-none"
                              )}>
                                <button 
                                  className="p-1 hover:text-primary disabled:opacity-30"
                                  onClick={() => handleUpdateQuantity(item.variantId, Math.max(0, item.quantity - 1))}
                                  disabled={item.quantity <= 1 || item.isDeleted || item.isActive === false || item.stockQuantity === 0}
                                >
                                  <Minus size={14} />
                                </button>
                                <span className="w-4 text-center text-xs font-black">{item.quantity}</span>
                                <button 
                                  className="p-1 hover:text-primary disabled:opacity-30"
                                  onClick={() => handleUpdateQuantity(item.variantId, item.quantity + 1)}
                                  disabled={item.isDeleted || item.isActive === false || item.stockQuantity === 0 || item.quantity >= (item.stockQuantity ?? 0)}
                                >
                                  <Plus size={14} />
                                </button>
                              </div>

                              <button 
                                className="text-on-surface-variant hover:text-error flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-colors"
                                onClick={() => handleRemoveFromCart(item.id)}
                              >
                                <Trash2 size={14} />
                                {locale === "vi" ? "Xóa" : "Remove"}
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Nested Custom Design details if applicable */}
                        {hasDesign && (
                          <div className="ml-4 md:ml-[180px] bg-[#f9f9fe] border border-primary/10 rounded-2xl p-5 space-y-4 relative text-left border-dashed">
                            {/* Decorative connector line linking product to printing details */}
                            <div className="absolute -left-6 top-8 w-6 h-px border-t border-dashed border-[#c1c6d7] hidden md:block" />
                            
                            <div className="flex justify-between items-center pb-3 border-b border-[#e2e2e7]">
                              <div className="flex items-center gap-2">
                                <Wrench className="text-primary" size={14} />
                                <h4
                                  className="text-[11px] font-black uppercase tracking-wider text-[#1a1c1f]"
                                  style={{ fontFamily: "var(--font-lexend)" }}
                                >
                                  {locale === "vi" ? "Chi tiết thiết kế in ấn của sản phẩm" : "Custom design specifications"}
                                </h4>
                              </div>
                              <div className="flex gap-3 items-center">
                                <Link
                                  href={`/${locale}/customizer`}
                                  className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline"
                                >
                                  {locale === "vi" ? "Chỉnh sửa thiết kế" : "Edit design"}
                                </Link>
                                <span className="text-[#e2e2e7] text-xs">|</span>
                                <button
                                  type="button"
                                  onClick={handleRemoveDesign}
                                  className="text-[9px] font-black uppercase tracking-widest text-error hover:underline cursor-pointer"
                                >
                                  {locale === "vi" ? "Xóa thiết kế" : "Delete design"}
                                </button>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-5 items-center">
                              {/* Design Preview Image */}
                              <div className="w-16 h-16 bg-[#F2F2F7] rounded-xl flex items-center justify-center p-1.5 relative overflow-hidden border border-[#e2e2e7] shrink-0 shadow-inner">
                                <img
                                  src={customDesign.designImageUrl}
                                  className="w-full h-full object-contain"
                                  alt="Your Custom Jersey Design"
                                />
                              </div>

                              {/* Breakdown Specifications */}
                              <div className="flex-grow w-full space-y-1 text-[11px] font-semibold text-[#414755] text-left">
                                <div className="grid grid-cols-2 gap-x-4 gap-y-1 bg-white p-3.5 rounded-xl border border-[#e2e2e7]">
                                  <span className="text-[#717786]">{locale === "vi" ? "Chất liệu tuyển chọn:" : "Material:"}</span>
                                  <span className="text-[#1a1c1f] font-bold uppercase text-right text-xs">
                                    {customDesign.materialName}
                                  </span>

                                  <span className="text-[#717786]">{locale === "vi" ? "Số lớp chữ in thêm:" : "Text layers:"}</span>
                                  <span className="text-[#1a1c1f] font-bold text-right">
                                    {customDesign.textsCount} {locale === "vi" ? "lớp" : "layers"}
                                  </span>

                                  <span className="text-[#717786]">{locale === "vi" ? "Số logo tải lên:" : "Uploaded logos:"}</span>
                                  <span className="text-[#1a1c1f] font-bold text-right">
                                    {customDesign.imagesCount} {locale === "vi" ? "ảnh" : "images"}
                                  </span>

                                  <span className="text-[#717786]">{locale === "vi" ? "Tổng cộng chi phí in:" : "Total printing cost:"}</span>
                                  <span className="text-primary font-black italic text-right text-xs">
                                    +{(customDesign.printingPrice * item.quantity).toLocaleString('vi-VN')} ₫
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
          </div>

          {/* Right: Summary Sidebar */}
          {!isEmpty && (
            <div className="w-full lg:w-[420px] shrink-0">
              <div className="sticky top-32 space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xl font-black uppercase tracking-tight">{t("checkout.orderSummary") || "Summary"}</h3>
                  
                  {/* Promo Code */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                      {locale === "vi" ? "Bạn có mã khuyến mãi?" : "Do you have a Promo Code?"}
                    </p>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder={locale === "vi" ? "NHẬP MÃ KHUYẾN MÃI" : "ENTER CODE"}
                        className="flex-grow h-12 px-4 rounded-xl border border-outline-variant bg-transparent text-xs font-bold uppercase tracking-widest focus:border-primary outline-none"
                      />
                      <Button variant="outline" className="h-12 px-6 rounded-xl border-on-surface bg-on-surface text-surface hover:bg-on-surface/90 text-[10px] font-black uppercase tracking-widest">
                        {t("checkout.apply") || "Apply"}
                      </Button>
                    </div>
                  </div>

                  {/* Calculations */}
                  <div className="space-y-4 pt-4 border-t border-outline-variant">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-on-surface-variant">{t("checkout.subtotal") || "Subtotal"}</span>
                      <span className="font-bold">
                        {`${subtotal.toLocaleString('vi-VN')} ₫`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-on-surface-variant">{t("checkout.shipping") || "Estimated Shipping & Handling"}</span>
                      <span className="font-bold">{t("checkout.shippingFree") || "Free"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-on-surface-variant">{t("checkout.expectedTax") || "Estimated Tax"}</span>
                      <span className="font-bold">—</span>
                    </div>
                    
                    <div className="pt-4 border-t border-on-surface space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-base font-black uppercase tracking-tight">{t("checkout.total") || "Total"}</span>
                        <span className="text-2xl font-black italic tracking-tighter">
                          {`${subtotal.toLocaleString('vi-VN')} ₫`}
                        </span>
                      </div>
                    </div>

                    <Button 
                      asChild 
                      className={cn(
                        "w-full h-16 rounded-xl bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90 font-lexend font-black uppercase tracking-widest text-xs gap-3 mt-4 shadow-xl shadow-secondary-container/20",
                        selectedIds.length === 0 && "opacity-50 cursor-not-allowed pointer-events-none"
                      )}
                    >
                      <Link 
                        href={`/${locale}/checkout`}
                        onClick={(e) => {
                          if (selectedIds.length === 0) {
                            e.preventDefault();
                            toast.error(locale === "vi" ? "Vui lòng chọn ít nhất một sản phẩm để thanh toán." : "Please select at least one item to checkout.");
                            return;
                          }
                          localStorage.setItem("sport_pro_checkout_selected_ids", JSON.stringify(selectedIds));
                        }}
                      >
                        {locale === "vi" ? "Tiến hành Thanh toán" : "Proceed to Checkout"}
                        <ArrowRight size={18} />
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Trust badges */}
                <div className="flex items-center justify-center gap-8 pt-4 border-t border-outline-variant opacity-50">
                  <div className="flex flex-col items-center gap-1">
                    <PackageCheck size={20} />
                    <span className="text-[8px] font-black uppercase tracking-widest">
                      {locale === "vi" ? "Thanh toán Bảo mật" : "Secure Pay"}
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <ShoppingBag size={20} />
                    <span className="text-[8px] font-black uppercase tracking-widest">
                      {locale === "vi" ? "Giao hàng Nhanh" : "Express Ship"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>


      </main>

      <Footer />
    </div>
  );
}
