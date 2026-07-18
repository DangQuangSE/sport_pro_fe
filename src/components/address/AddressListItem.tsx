"use client";

import React from "react";
import { Pencil, Trash2, Star } from "lucide-react";
import { AddressResponse } from "@/services/addressService";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

interface AddressListItemProps {
  readonly address: AddressResponse;
  readonly onEdit: (address: AddressResponse) => void;
  readonly onDelete: (address: AddressResponse) => void;
  readonly onSetDefault: (address: AddressResponse) => void;
}

export function AddressListItem({ address, onEdit, onDelete, onSetDefault }: AddressListItemProps) {
  const { t } = useTranslation();

  return (
    <div className="relative bg-surface-container/30 border border-outline-variant rounded-[2rem] p-6 space-y-4">
      {address.isDefault && (
        <span className="absolute top-5 right-5 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-[9px] font-black uppercase tracking-widest">
          <Star size={12} className="fill-primary" />
          {t("profile.addresses.default")}
        </span>
      )}

      <div className="space-y-1 pr-24">
        <p className="text-sm font-black uppercase tracking-wide text-on-surface">
          {address.receiverName}
        </p>
        <p className="text-xs text-on-surface-variant font-medium">{address.phoneNumber}</p>
      </div>

      <p className="text-xs text-on-surface-variant leading-relaxed">
        {address.detailAddress}, {address.ward}, {address.district}, {address.province}
      </p>

      <div className="flex items-center gap-2 pt-2 border-t border-outline-variant/50">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-[10px]"
          onClick={() => onEdit(address)}
        >
          <Pencil size={12} />
          {t("profile.addresses.edit")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-[10px] text-error hover:text-error"
          onClick={() => onDelete(address)}
        >
          <Trash2 size={12} />
          {t("profile.addresses.delete")}
        </Button>
        {!address.isDefault && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-[10px] ml-auto"
            onClick={() => onSetDefault(address)}
          >
            <Star size={12} />
            {t("profile.addresses.setDefault")}
          </Button>
        )}
      </div>
    </div>
  );
}
