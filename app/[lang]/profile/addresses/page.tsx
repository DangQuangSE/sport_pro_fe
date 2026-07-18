"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAddresses } from "@/hooks/useAddresses";
import { AddressList } from "@/components/address/AddressList";
import { AddressFormModal } from "@/components/address/AddressFormModal";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { AddressRequest, AddressResponse } from "@/services/addressService";

export default function AddressBookPage() {
  const { t, locale } = useTranslation();
  const router = useRouter();
  const { isLoggedIn, isLoading: isLoadingAuth } = useAuthContext();
  const {
    addresses,
    isLoading,
    isSubmitting,
    createAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
  } = useAddresses();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressResponse | null>(null);

  React.useEffect(() => {
    if (!isLoadingAuth && !isLoggedIn) {
      router.push(`/${locale}/login`);
    }
  }, [isLoadingAuth, isLoggedIn, locale, router]);

  if (isLoadingAuth) {
    return (
      <div className="flex flex-col min-h-screen bg-surface">
        <Navbar />
        <main className="flex-grow flex items-center justify-center pt-32 pb-20">
          <Loader2 size={40} className="animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  const handleOpenCreate = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (address: AddressResponse) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: AddressRequest) => {
    const result = editingAddress
      ? await updateAddress(editingAddress.id, data)
      : await createAddress(data);

    if (result.success) {
      setIsModalOpen(false);
      toast.success(
        editingAddress
          ? t("profile.addresses.updateSuccess")
          : t("profile.addresses.createSuccess")
      );
    } else {
      toast.error((result.error as Error)?.message || t("profile.addresses.genericError"));
    }
  };

  const handleDelete = async (address: AddressResponse) => {
    if (window.confirm(t("profile.addresses.deleteConfirm"))) {
      const result = await deleteAddress(address.id);
      if (result.success) {
        toast.success(t("profile.addresses.deleteSuccess"));
      } else {
        toast.error((result.error as Error)?.message || t("profile.addresses.genericError"));
      }
    }
  };

  const handleSetDefault = async (address: AddressResponse) => {
    const result = await setDefaultAddress(address.id);
    if (result.success) {
      toast.success(t("profile.addresses.setDefaultSuccess"));
    } else {
      toast.error((result.error as Error)?.message || t("profile.addresses.genericError"));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-32 pb-20 px-4 sm:px-8 max-w-[1000px] mx-auto w-full animate-in fade-in duration-700">
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: t("profile.title") || "Profile", href: "/profile" },
              { label: t("profile.addresses.title") || "Addresses" }
            ]}
          />
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-outline-variant pb-8 mb-12">
          <div className="space-y-2">
            <h1 className="text-[40px] font-black italic tracking-tighter text-on-surface uppercase leading-none" style={{ fontFamily: "var(--font-lexend)" }}>
              {t("profile.addresses.title")}
            </h1>
            <p className="text-on-surface-variant font-medium text-sm">{t("profile.addresses.subtitle")}</p>
          </div>
          <Button
            className="gap-2 h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px]"
            onClick={handleOpenCreate}
          >
            <Plus size={14} />
            {t("profile.addresses.addNew")}
          </Button>
        </div>

        <AddressList
          addresses={addresses}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onSetDefault={handleSetDefault}
        />
      </main>

      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingAddress}
        isSubmitting={isSubmitting}
      />

      <Footer />
    </div>
  );
}
