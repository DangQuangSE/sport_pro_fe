"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/contexts/CartContext";
import { useTranslation } from "@/hooks/useTranslation";
import { orderService, PaymentMethod } from "@/services/orderService";
import { addressService } from "@/services/addressService";
import { cartService } from "@/services/cartService";
import { apiClient, ApiResponse } from "@/lib/api-client";
import { toast } from "sonner";

export interface CustomDesignInfo {
  printingPrice: number;
  materialName: string;
  designImageUrl: string;
  textsCount: number;
  imagesCount: number;
  customDesignId?: number;
}

export function useCheckout() {
  const { cart: rawCart, refreshCart, updateQuantity, removeFromCart } = useCart();
  const { t, locale } = useTranslation();
  const router = useRouter();
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

  const checkoutItems = rawCart 
    ? (selectedIds ? rawCart.items.filter(item => selectedIds.includes(item.id)) : rawCart.items)
    : [];

  const estimatedCost = checkoutItems.reduce((acc, item) => acc + (item.salePrice * item.quantity), 0);

  const checkoutCart = rawCart ? {
    ...rawCart,
    items: checkoutItems,
    totalAmount: estimatedCost
  } : null;

  // Delivery states
  const [email, setEmail] = useState("athlete@example.com");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");

  // Flow states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  // Custom design state
  const [customDesign, setCustomDesign] = useState<CustomDesignInfo | null>(null);

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

  // Remove custom design from cart
  const handleRemoveDesign = async () => {
    if (!rawCart) return;
    const customizedItem = rawCart.items.find(
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

  // Load default address to pre-fill
  useEffect(() => {
    const fetchDefaultAddress = async () => {
      try {
        const res = await addressService.getMyAddresses();
        const addressList = res.data;
        if (addressList && addressList.length > 0) {
          const defaultAddr =
            addressList.find((a) => a.isDefault) || addressList[0];
          setFirstName(
            defaultAddr.receiverName.split(" ").slice(1).join(" ") ||
              defaultAddr.receiverName
          );
          setLastName(defaultAddr.receiverName.split(" ")[0] || "");
          setPhoneNumber(defaultAddr.phoneNumber);
          setStreetAddress(
            `${defaultAddr.detailAddress}, ${defaultAddr.ward}, ${defaultAddr.district}, ${defaultAddr.province}`
          );
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

    if (checkoutItems.length === 0) {
      setErrorMsg(t("checkout.noCartItems"));
      return;
    }

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !phoneNumber.trim() ||
      !streetAddress.trim()
    ) {
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
        paymentMethod: PaymentMethod.BANK_TRANSFER,
        cartItemIds: checkoutItems.map((item) => item.id),
      };

      const orderRes = await orderService.placeOrder(orderPayload);
      setSuccessOrder(orderRes.data);
      await refreshCart();
    } catch (err: any) {
      console.error("Order failed", err);
      setErrorMsg(
        err.message || "Something went wrong during checkout. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Computed values
  const isCartEmpty = checkoutItems.length === 0;
  const standardDelivery = 15;
  const expectedTax = 24;
  const customizedItem = checkoutItems.find(
    (item) => item.isCustomizable === true || item.customizable === true
  );
  const printingCost =
    customizedItem && customDesign ? customDesign.printingPrice : 0;
  const totalPayment =
    estimatedCost > 0
      ? estimatedCost + standardDelivery + expectedTax + printingCost
      : 0;

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
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phoneNumber,
    setPhoneNumber,
    streetAddress,
    setStreetAddress,
    // Flow
    isSubmitting,
    errorMsg,
    successOrder,
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
