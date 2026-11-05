"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  ChevronRight,
  Home
} from "lucide-react";
import { usePublicConfigs } from "@/hooks/admin/usePublicConfigs";
import { PublicConfigTable } from "@/components/admin/public-configs/PublicConfigTable";
import { PublicConfigFormModal } from "@/components/admin/public-configs/PublicConfigFormModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PublicConfig } from "@/services/adminService";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { toast } from "sonner";
import { MembershipTierSettings } from "@/components/admin/public-configs/MembershipTierSettings";
import { OrderIntakeSettings, ORDER_INTAKE_SETTING } from "@/components/admin/public-configs/OrderIntakeSettings";

export default function PublicConfigsPage() {
  const { t, locale } = useTranslation();
  const { 
    configs, 
    isLoading, 
    isSubmitting, 
    createConfig, 
    updateConfig, 
    deleteConfig 
  } = usePublicConfigs();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<PublicConfig | null>(null);
  const [activeTab, setActiveTab] = useState<"commerce" | "membership" | "checkout" | "content">("commerce");

  const handleOpenCreate = () => {
    setEditingConfig(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (config: PublicConfig) => {
    setEditingConfig(config);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    const result = editingConfig 
      ? await updateConfig(editingConfig.configKey, data)
      : await createConfig(data);
    
    if (result.success) {
      setIsModalOpen(false);
      toast.success(editingConfig ? t("admin.publicConfigs.messages.updateSuccess") : t("admin.publicConfigs.messages.createSuccess"));
    } else {
      toast.error((result.error as string) || t("admin.publicConfigs.messages.error"));
    }
  };

  const handleDelete = async (key: string) => {
    if (window.confirm(t("admin.publicConfigs.messages.deleteConfirm").replace("{key}", key))) {
      const result = await deleteConfig(key);
      if (result.success) {
        toast.success(t("admin.publicConfigs.messages.deleteSuccess"));
      } else {
        toast.error((result.error as string) || t("admin.publicConfigs.messages.error"));
      }
    }
  };

  const filteredConfigs = configs.filter(config => config.configKey !== ORDER_INTAKE_SETTING).filter(config =>
    config.configKey.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (config.configValue && config.configValue.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (config.description && config.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 ">
      {/* Breadcrumbs & Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-outline-variant pb-6">
        <div className="flex flex-col gap-1 flex-shrink-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            <Link href={`/${locale}/admin`} className="hover:text-primary transition-colors flex items-center gap-1">
              <Home size={10} />
              {t("home.nav.admin")}
            </Link>
            <ChevronRight size={10} />
            <span className="text-on-surface">{t("admin.publicConfigs.title")}</span>
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter text-on-surface uppercase leading-none">
            {t("admin.publicConfigs.title")}
          </h2>
        </div>

        {/* Search bar & Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-[280px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={16} />
            <Input 
              placeholder={t("admin.publicConfigs.searchPlaceholder")} 
              className="pl-10 h-10 rounded-xl bg-surface-container-highest/30 border-outline-variant focus:bg-surface focus:border-primary transition-all font-inter text-xs shadow-inner" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            className="gap-1.5 h-10 px-5 rounded-xl shadow-md hover:shadow-lg transition-all bg-secondary hover:bg-secondary/90 text-on-secondary font-lexend font-bold uppercase tracking-widest text-[10px] w-full sm:w-auto flex-shrink-0"
            onClick={handleOpenCreate}
          >
            <Plus size={14} />
            {t("admin.publicConfigs.addConfig")}
          </Button>
        </div>
      </div>

      <OrderIntakeSettings
        config={configs.find(config => config.configKey === ORDER_INTAKE_SETTING)}
        loading={isLoading}
        submitting={isSubmitting}
        onUpdate={updateConfig}
      />

      <div className="flex flex-wrap gap-2 rounded-2xl border border-outline-variant bg-surface p-2">
        {([
          ["commerce", t("admin.publicConfigs.tabs.commerce")],
          ["membership", t("admin.publicConfigs.tabs.membership")],
          ["checkout", t("admin.publicConfigs.tabs.checkout")],
          ["content", t("admin.publicConfigs.tabs.content")],
        ] as const).map(([key, label]) => (
          <button key={key} type="button" onClick={() => setActiveTab(key)} className={`rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-colors ${activeTab === key ? "bg-primary text-white" : "text-on-surface-variant hover:bg-surface-variant/40"}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === "membership" ? (
        <MembershipTierSettings />
      ) : (
        <div className="space-y-6">
          <PublicConfigTable
            configs={filteredConfigs.filter((config) => {
              const category = (config.category || "CONTENT").toLowerCase();
              if (activeTab === "commerce") return category === "commerce" || /shipping|tax|coupon|printing|currency|order/.test(config.configKey.toLowerCase());
              if (activeTab === "checkout") return category.includes("checkout") || /checkout|payment|quote|policy|threshold|free_shipping/.test(config.configKey.toLowerCase());
              return category === "content" || category === "website content" || config.scope === "PUBLIC";
            })}
            isLoading={isLoading}
            onEdit={handleOpenEdit}
            onDelete={handleDelete}
          />
        </div>
      )}

      <PublicConfigFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingConfig}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
