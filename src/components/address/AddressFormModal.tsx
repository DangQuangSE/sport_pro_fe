"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { AddressRequest, AddressResponse } from "@/services/addressService";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AddressForm } from "./AddressForm";
import { useTranslation } from "@/hooks/useTranslation";

interface AddressFormModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: AddressRequest) => Promise<void>;
  readonly initialData: AddressResponse | null;
  readonly isSubmitting: boolean;
}

const FORM_ID = "address-form-modal";

export function AddressFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting
}: AddressFormModalProps) {
  const { t } = useTranslation();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t("profile.addresses.editTitle") : t("profile.addresses.createTitle")}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t("profile.addresses.cancel")}
          </Button>
          <Button type="submit" form={FORM_ID} disabled={isSubmitting} className="gap-2">
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {t("profile.addresses.save")}
          </Button>
        </>
      }
    >
      <AddressForm formId={FORM_ID} initialData={initialData} onSubmit={onSubmit} isLoading={isSubmitting} />
    </Modal>
  );
}
