"use client";

import React, { useState } from "react";
import { Truck, Loader2, Plus, Check } from "lucide-react";
import { AddressRequest, AddressResponse } from "@/services/addressService";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { AddressForm } from "@/components/address/AddressForm";
import { cn } from "@/lib/utils";

interface CheckoutAddressPickerProps {
  readonly email: string;
  readonly onEmailChange: (v: string) => void;
  readonly addresses: AddressResponse[];
  readonly isLoadingAddresses: boolean;
  readonly selectedAddressId: number | null;
  readonly onSelectAddress: (id: number) => void;
  readonly isAddingNewAddress: boolean;
  readonly onStartAddNew: () => void;
  readonly onCancelAddNew: () => void;
  readonly onSubmitNewAddress: (data: AddressRequest, saveForLater: boolean) => Promise<void>;
  readonly isSubmittingNewAddress: boolean;
  readonly t: (key: string) => string;
}

const NEW_ADDRESS_FORM_ID = "checkout-new-address-form";

export function CheckoutAddressPicker({
  email,
  onEmailChange,
  addresses,
  isLoadingAddresses,
  selectedAddressId,
  onSelectAddress,
  isAddingNewAddress,
  onStartAddNew,
  onCancelAddNew,
  onSubmitNewAddress,
  isSubmittingNewAddress,
  t
}: CheckoutAddressPickerProps) {
  const [saveForLater, setSaveForLater] = useState(true);

  const handleSubmitNewAddress = async (data: AddressRequest) => {
    await onSubmitNewAddress(data, saveForLater);
  };

  return (
    <div className="bg-white border border-[#e2e2e7] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-[24px] p-8">
      <div className="flex items-center gap-3 pb-6 border-b border-[#e2e2e7]">
        <Truck className="text-[#0058bc]" size={20} />
        <h3
          className="text-lg font-black uppercase tracking-tight text-[#1a1c1f]"
          style={{ fontFamily: "var(--font-lexend)" }}
        >
          {t("checkout.deliveryInfo")}
        </h3>
      </div>

      <div className="space-y-2 mt-6">
        <label className="text-[9px] font-black uppercase tracking-widest text-[#414755]">
          {t("checkout.emailAddress")}
          <span className="ml-1 text-error" aria-hidden="true">*</span>
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="athlete@example.com"
          className="w-full h-12 px-4 rounded-xl border border-[#c1c6d7] bg-[#f9f9fe] text-xs font-semibold focus:border-primary outline-none transition-colors"
        />
      </div>

      <div className="mt-6 space-y-3">
        {isLoadingAddresses ? (
          <div className="flex items-center justify-center gap-2 py-10 text-on-surface-variant">
            <Loader2 size={20} className="animate-spin text-primary" />
            <span className="text-xs font-bold uppercase tracking-widest">
              {t("profile.addresses.loading")}
            </span>
          </div>
        ) : (
          addresses.map((address) => {
            const isSelected = address.id === selectedAddressId;
            return (
              <button
                type="button"
                key={address.id}
                onClick={() => onSelectAddress(address.id)}
                className={cn(
                  "w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3",
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-[#e2e2e7] hover:border-primary/40"
                )}
              >
                <div
                  className={cn(
                    "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0",
                    isSelected ? "border-primary bg-primary" : "border-[#c1c6d7]"
                  )}
                >
                  {isSelected && <Check size={12} className="text-white" />}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-black uppercase text-[#1a1c1f]">
                    {address.receiverName} · {address.phoneNumber}
                  </p>
                  <p className="text-xs text-[#717786]">
                    {address.detailAddress}, {address.ward}, {address.district}, {address.province}
                  </p>
                </div>
              </button>
            );
          })
        )}

        {!isLoadingAddresses && addresses.length === 0 && (
          <p className="text-xs text-[#717786] font-medium py-2">
            {t("profile.addresses.noAddresses")}
          </p>
        )}

        <Button
          type="button"
          variant="outline"
          className="gap-2 h-11 px-5 rounded-xl font-bold uppercase tracking-widest text-[10px]"
          onClick={onStartAddNew}
        >
          <Plus size={14} />
          {t("profile.addresses.addNew")}
        </Button>
      </div>

      <Modal
        isOpen={isAddingNewAddress}
        onClose={onCancelAddNew}
        title={t("profile.addresses.createTitle")}
        footer={
          <>
            <Button variant="outline" onClick={onCancelAddNew} disabled={isSubmittingNewAddress}>
              {t("profile.addresses.cancel")}
            </Button>
            <Button
              type="submit"
              form={NEW_ADDRESS_FORM_ID}
              disabled={isSubmittingNewAddress}
              className="gap-2"
            >
              {isSubmittingNewAddress && <Loader2 size={16} className="animate-spin" />}
              {t("profile.addresses.save")}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <AddressForm
            formId={NEW_ADDRESS_FORM_ID}
            onSubmit={handleSubmitNewAddress}
            isLoading={isSubmittingNewAddress}
          />
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-variant/30 border border-outline-variant/50">
            <input
              type="checkbox"
              id="checkout-save-for-later"
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
              checked={saveForLater}
              onChange={(e) => setSaveForLater(e.target.checked)}
              disabled={isSubmittingNewAddress}
            />
            <Label htmlFor="checkout-save-for-later" className="cursor-pointer text-sm font-medium">
              {t("checkout.saveAddressForLater")}
            </Label>
          </div>
        </div>
      </Modal>
    </div>
  );
}
