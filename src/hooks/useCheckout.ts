"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "@/hooks/useTranslation";
import { orderService, PaymentMethod } from "@/services/orderService";
import { addressService, AddressRequest, AddressResponse } from "@/services/addressService";
import { cartService } from "@/services/cartService";
import { pricingService, PricingBreakdown } from "@/services/pricingService";
import { apiClient, ApiResponse } from "@/lib/api-client";
import { isValidPhoneNumber } from "@/lib/validators";
import { toast } from "sonner";

export interface CustomDesignInfo {
  printingPrice: number;
  materialName: string;
  designImageUrl: string;
  textsCount: number;
  imagesCount: number;
  customDesignId?: number;
  materialBasePrice: number;
  logoUnitPrice: number;
}

export function useCheckout() {
  const { cart: rawCart, refreshCart, updateQuantity, removeFromCart } = useCart();
  const { t, locale } = useTranslation();
  const [selectedIds, setSelectedIds] = useState<number[] | null>(null);

  useEffect(() => {
    refreshCart();
    const saved = localStorage.getItem("sport_pro_checkout_selected_ids");
    if (saved) {
      try {
        setSelectedIds(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse selected checkout IDs", e);
      }
    }
  }, [refreshCart]);

  const checkoutItems = useMemo(
    () => rawCart
      ? (selectedIds ? rawCart.items.filter(item => selectedIds.includes(item.id)) : rawCart.items)
      : [],
    [rawCart, selectedIds]
  );

  const checkoutItemIds = useMemo(() => checkoutItems.map((item) => item.id), [checkoutItems]);
  const checkoutItemIdsKey = checkoutItemIds.join(",");

  // Delivery states
  const [email, setEmail] = useState("athlete@example.com");
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [isSubmittingNewAddress, setIsSubmittingNewAddress] = useState(false);
  // An address entered at checkout with "save for later" unchecked — used only
  // for this order's snapshot, never persisted to the address book.
  const [draftAddress, setDraftAddress] = useState<AddressRequest | null>(null);

  // Coupon states
  const [couponCode, setCouponCode] = useState("");
  const [quote, setQuote] = useState<PricingBreakdown | null>(null);
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteRevision, setQuoteRevision] = useState(0);

  // Flow states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Custom design state
  const [customDesign, setCustomDesign] = useState<CustomDesignInfo | null>(null);

  const activeAddress = draftAddress ?? addresses.find((a) => a.id === selectedAddressId);
  const shippingAddressContext = activeAddress
    ? `${activeAddress.detailAddress}, ${activeAddress.ward}, ${activeAddress.district}, ${activeAddress.province}`
    : undefined;

  // Monetary values always come from the backend quote. The request contains
  // checkout context only; prices, discounts, tax and shipping are recalculated
  // against current database state by the API.
  useEffect(() => {
    let cancelled = false;

    if (!rawCart || checkoutItemIds.length === 0) {
      setQuote(null);
      setQuoteError(null);
      setIsQuoteLoading(false);
      return;
    }

    setIsQuoteLoading(true);
    setQuoteError(null);

    pricingService.getCheckoutQuote({
      cartItemIds: checkoutItemIds,
      couponCode: couponCode.trim() || undefined,
      shippingAddress: shippingAddressContext,
    })
      .then((response) => {
        if (!cancelled) setQuote(response.data);
      })
      .catch((error: any) => {
        if (!cancelled) {
          setQuote(null);
          setQuoteError(error.message || t("checkout.messages.quoteError"));
        }
      })
      .finally(() => {
        if (!cancelled) setIsQuoteLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [rawCart, checkoutItemIds, checkoutItemIdsKey, couponCode, shippingAddressContext, quoteRevision]);

  const checkoutCart = rawCart ? {
    ...rawCart,
    items: checkoutItems,
    totalAmount: quote?.totalAmount ?? 0,
  } : null;

  // Fetch custom design details when cart changes
  useEffect(() => {
    if (!rawCart) return;

    const customizedItem = rawCart.items.find(
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
            materialBasePrice: res.data.materialBasePrice,
            logoUnitPrice: res.data.logoUnitPrice,
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
  }, [rawCart]);

  const printingCost = quote?.printingAmount ?? 0;

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setQuoteRevision((revision) => revision + 1);
  };

  const handleClearCoupon = () => {
    setCouponCode("");
  };

  // Remove custom design from cart
  const handleRemoveDesign = async () => {
    if (!rawCart) return;
    const customizedItem = rawCart.items.find(
      (item) => item.customDesignId !== null && item.customDesignId !== undefined
    );
    if (!customizedItem) return;

    const toastId = toast.loading(
      t("checkout.messages.removeDesignLoading")
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
        t("checkout.messages.removeDesignSuccess"),
        { id: toastId }
      );
    } catch (err: any) {
      console.error("Failed to remove design", err);
      toast.error(
        err.message ||
          t("checkout.messages.removeDesignError"),
        { id: toastId }
      );
    }
  };

  // Load saved addresses and auto-select the default one
  const fetchAddresses = async () => {
    setIsLoadingAddresses(true);
    try {
      const res = await addressService.getMyAddresses();
      setAddresses(res.data);
      return res.data;
    } catch (err) {
      console.error("Failed to load user addresses", err);
      return [];
    } finally {
      setIsLoadingAddresses(false);
    }
  };

  useEffect(() => {
    fetchAddresses().then((list) => {
      const defaultAddr = list.find((a) => a.isDefault) || list[0];
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
    });
  }, []);

  const selectAddress = useCallback((id: number) => {
    setSelectedAddressId(id);
    setDraftAddress(null);
    setIsAddingNewAddress(false);
  }, []);

  const startAddingNewAddress = useCallback(() => setIsAddingNewAddress(true), []);
  const cancelAddingNewAddress = useCallback(() => setIsAddingNewAddress(false), []);

  const submitNewAddress = useCallback(async (data: AddressRequest, saveForLater: boolean) => {
    if (saveForLater) {
      setIsSubmittingNewAddress(true);
      try {
        const res = await addressService.createAddress(data);
        await fetchAddresses();
        setSelectedAddressId(res.data.id);
        setDraftAddress(null);
      } catch (err: any) {
        toast.error(err.message || t("profile.addresses.genericError"));
        return;
      } finally {
        setIsSubmittingNewAddress(false);
      }
    } else {
      setDraftAddress(data);
      setSelectedAddressId(null);
    }
    setIsAddingNewAddress(false);
  }, [t]);

  // Builds the immutable shippingAddress TEXT snapshot sent to the order —
  // Order never references UserAddress live, so later edits/deletes to the
  // address book cannot change a placed order's shipping address.
  const buildShippingAddressSnapshot = (
    address: { receiverName: string; detailAddress: string; ward: string; district: string; province: string },
    emailValue: string
  ) => {
    return `${address.receiverName} - ${address.detailAddress}, ${address.ward}, ${address.district}, ${address.province} (Email: ${emailValue})`;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (checkoutItems.length === 0) {
      setErrorMsg(t("checkout.noCartItems"));
      return;
    }

    const activeAddress = draftAddress ?? addresses.find((a) => a.id === selectedAddressId);

    if (!email.trim() || !activeAddress) {
      setErrorMsg(t("checkout.fieldsError"));
      return;
    }

    if (!isValidPhoneNumber(activeAddress.phoneNumber)) {
      setErrorMsg(t("checkout.phoneError"));
      return;
    }

    if (isQuoteLoading || !quote) {
      setErrorMsg(quoteError || t("checkout.messages.quotePending"));
      return;
    }

    setIsSubmitting(true);

    try {
      const finalShippingAddress = buildShippingAddressSnapshot(activeAddress, email.trim());

      const orderPayload = {
        shippingAddress: finalShippingAddress,
        phoneNumber: activeAddress.phoneNumber.trim(),
        paymentMethod: PaymentMethod.PAYOS,
        cartItemIds: checkoutItems.map((item) => item.id),
        couponCode: couponCode.trim() || undefined,
      };

      const orderRes = await orderService.placeOrder(orderPayload);
      await refreshCart();

      const paymentRes = await orderService.createPayOsPayment(orderRes.data.id);
      if (!paymentRes.data.checkoutUrl) {
        throw new Error(t("checkout.messages.paymentUrlMissing"));
      }

      // Let PayOS handle the payment UI. Its returnUrl brings the customer
      // back to /checkout/payment-result after the payment attempt.
      window.location.assign(paymentRes.data.checkoutUrl);
    } catch (err: any) {
      console.error("Order failed", err);
      setErrorMsg(
        err.message || t("checkout.messages.checkoutFailed")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Computed values
  const isCartEmpty = checkoutItems.length === 0;
  const estimatedCost = quote?.subtotalAmount ?? 0;
  const standardDelivery = quote?.shippingAmount ?? 0;
  const expectedTax = quote?.taxAmount ?? 0;
  const totalPayment = quote?.totalAmount ?? 0;
  const discountAmount = quote?.couponDiscountAmount ?? 0;

  return {
    // Cart
    cart: checkoutCart,
    checkoutItems,
    isCartEmpty,
    updateQuantity,
    removeFromCart,
    // Delivery form fields
    email,
    setEmail,
    addresses,
    isLoadingAddresses,
    selectedAddressId,
    selectAddress,
    isAddingNewAddress,
    startAddingNewAddress,
    cancelAddingNewAddress,
    submitNewAddress,
    isSubmittingNewAddress,
    // Coupon
    couponCode,
    setCouponCode,
    discountAmount,
    isApplyingCoupon: false,
    handleApplyCoupon,
    handleClearCoupon,
    quote,
    isQuoteLoading,
    quoteError,
    // Flow
    isSubmitting,
    errorMsg,
    handlePlaceOrder,
    // Custom design
    customDesign,
    handleRemoveDesign,
    // Computed financials
    estimatedCost,
    standardDelivery,
    expectedTax,
    printingCost,
    totalPayment,
    // Translation
    t,
    locale,
  };
}
