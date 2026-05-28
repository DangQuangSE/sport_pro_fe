"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartService, CartResponse, CartItemRequest } from "@/services/cartService";
import { useAuth } from "@/hooks/useAuth";

interface CartContextType {
  cart: CartResponse | null;
  isLoading: boolean;
  addToCart: (request: CartItemRequest) => Promise<void>;
  updateQuantity: (variantId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = useAuth();

  const refreshCart = useCallback(async () => {
    if (!isLoggedIn) {
      setCart(null);
      return;
    }
    setIsLoading(true);
    try {
      const response = await cartService.getMyCart();
      setCart(response.data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addToCart = async (request: CartItemRequest) => {
    try {
      const response = await cartService.addOrUpdateItem(request);
      setCart(response.data);
    } catch (error) {
      console.error("Failed to add to cart", error);
      throw error;
    }
  };

  const updateQuantity = async (variantId: number, quantity: number) => {
    try {
      const response = await cartService.addOrUpdateItem({ variantId, quantity, isReplace: true });
      setCart(response.data);
    } catch (error) {
      console.error("Failed to update quantity", error);
      throw error;
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      await cartService.removeItem(itemId);
      await refreshCart();
    } catch (error) {
      console.error("Failed to remove item", error);
      throw error;
    }
  };

  return (
    <CartContext.Provider value={{ cart, isLoading, addToCart, updateQuantity, removeFromCart, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
