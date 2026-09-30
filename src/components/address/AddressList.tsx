"use client";

import React from "react";
import { Loader2, MapPin } from "lucide-react";
import { AddressResponse } from "@/services/addressService";
import { AddressListItem } from "./AddressListItem";
import { useTranslation } from "@/hooks/useTranslation";

interface AddressListProps {
  readonly addresses: AddressResponse[];
  readonly isLoading: boolean;
  readonly onEdit: (address: AddressResponse) => void;
  readonly onDelete: (address: AddressResponse) => void;
  readonly onSetDefault: (address: AddressResponse) => void;
}

export function AddressList({ addresses, isLoading, onEdit, onDelete, onSetDefault }: AddressListProps) {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-on-surface-variant">
        <Loader2 size={32} className="animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest">{t("profile.addresses.loading")}</p>
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 py-16 text-on-surface-variant border border-dashed border-outline-variant rounded-[2rem]">
        <MapPin size={28} className="text-outline" />
        <p className="text-sm font-medium">{t("profile.addresses.noAddresses")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {addresses.map((address) => (
        <AddressListItem
          key={address.id}
          address={address}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
        />
      ))}
    </div>
  );
}
