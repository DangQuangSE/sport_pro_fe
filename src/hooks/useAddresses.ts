"use client";

import { useState, useCallback, useEffect } from "react";
import { addressService, AddressRequest, AddressResponse } from "@/services/addressService";

export function useAddresses() {
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAddresses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await addressService.getMyAddresses();
      setAddresses(response.data);
    } catch (error) {
      console.error("Failed to fetch addresses", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAddresses();
  }, [fetchAddresses]);

  const createAddress = async (data: AddressRequest) => {
    setIsSubmitting(true);
    try {
      const response = await addressService.createAddress(data);
      await fetchAddresses();
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateAddress = async (id: number, data: AddressRequest) => {
    setIsSubmitting(true);
    try {
      const response = await addressService.updateAddress(id, data);
      await fetchAddresses();
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteAddress = async (id: number) => {
    try {
      await addressService.deleteAddress(id);
      await fetchAddresses();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const setDefaultAddress = async (id: number) => {
    try {
      await addressService.setDefaultAddress(id);
      await fetchAddresses();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  return {
    addresses,
    isLoading,
    isSubmitting,
    fetchAddresses,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  };
}
