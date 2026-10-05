"use client";

import React, { useState, useEffect } from "react";
import { AddressRequest, AddressResponse } from "@/services/addressService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";
import { isValidPhoneNumber } from "@/lib/validators";

interface AddressFormProps {
  readonly formId: string;
  readonly initialData?: AddressResponse | null;
  readonly onSubmit: (data: AddressRequest) => void | Promise<void>;
  readonly isLoading?: boolean;
}

const INPUT_CLASS = "bg-surface-variant/20 border-outline-variant focus:border-primary transition-all";

const EMPTY_FORM: AddressRequest = {
  receiverName: "",
  phoneNumber: "",
  province: "",
  district: "",
  ward: "",
  detailAddress: "",
  isDefault: false
};

function RequiredFieldLabel({
  htmlFor,
  children
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <Label htmlFor={htmlFor}>
      {children}
      <span className="ml-1 text-error" aria-hidden="true">*</span>
    </Label>
  );
}

export function AddressForm({ formId, initialData, onSubmit, isLoading }: AddressFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<AddressRequest>(EMPTY_FORM);
  const [phoneError, setPhoneError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        receiverName: initialData.receiverName,
        phoneNumber: initialData.phoneNumber,
        province: initialData.province,
        district: initialData.district,
        ward: initialData.ward,
        detailAddress: initialData.detailAddress,
        isDefault: initialData.isDefault
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidPhoneNumber(formData.phoneNumber)) {
      setPhoneError(t("profile.addresses.phoneError"));
      return;
    }
    setPhoneError(null);
    onSubmit(formData);
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <RequiredFieldLabel htmlFor="address-receiver-name">
          {t("profile.addresses.receiverName")}
        </RequiredFieldLabel>
        <Input
          id="address-receiver-name"
          value={formData.receiverName}
          onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
          required
          disabled={isLoading}
          className={INPUT_CLASS}
        />
      </div>

      <div className="space-y-2">
        <RequiredFieldLabel htmlFor="address-phone">
          {t("profile.addresses.phoneNumber")}
        </RequiredFieldLabel>
        <Input
          id="address-phone"
          value={formData.phoneNumber}
          onChange={(e) => {
            setFormData({ ...formData, phoneNumber: e.target.value });
            if (phoneError) setPhoneError(null);
          }}
          required
          disabled={isLoading}
          className={INPUT_CLASS}
        />
        {phoneError && <p className="text-xs font-medium text-error">{phoneError}</p>}
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <RequiredFieldLabel htmlFor="address-province">
            {t("profile.addresses.province")}
          </RequiredFieldLabel>
          <Input
            id="address-province"
            value={formData.province}
            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
            required
            disabled={isLoading}
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-2">
          <RequiredFieldLabel htmlFor="address-district">
            {t("profile.addresses.district")}
          </RequiredFieldLabel>
          <Input
            id="address-district"
            value={formData.district}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            required
            disabled={isLoading}
            className={INPUT_CLASS}
          />
        </div>

        <div className="space-y-2">
          <RequiredFieldLabel htmlFor="address-ward">
            {t("profile.addresses.ward")}
          </RequiredFieldLabel>
          <Input
            id="address-ward"
            value={formData.ward}
            onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
            required
            disabled={isLoading}
            className={INPUT_CLASS}
          />
        </div>
      </div>

      <div className="space-y-2">
        <RequiredFieldLabel htmlFor="address-detail">
          {t("profile.addresses.detailAddress")}
        </RequiredFieldLabel>
        <Input
          id="address-detail"
          value={formData.detailAddress}
          onChange={(e) => setFormData({ ...formData, detailAddress: e.target.value })}
          required
          disabled={isLoading}
          className={INPUT_CLASS}
        />
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-variant/30 border border-outline-variant/50 transition-all hover:bg-surface-variant/50">
        <input
          type="checkbox"
          id="address-is-default"
          className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer"
          checked={formData.isDefault}
          onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
          disabled={isLoading}
        />
        <Label htmlFor="address-is-default" className="cursor-pointer text-sm font-medium">
          {t("profile.addresses.setAsDefault")}
        </Label>
      </div>
    </form>
  );
}
