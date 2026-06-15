"use client";

import React, { useState, useEffect } from "react";
import { Loader2, Image as ImageIcon, Paintbrush } from "lucide-react";
import { PublicConfig } from "@/services/adminService";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "@/hooks/useTranslation";

interface PublicConfigFormModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: any) => Promise<void>;
  readonly initialData: PublicConfig | null;
  readonly isSubmitting: boolean;
}

export function PublicConfigFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting
}: PublicConfigFormModalProps) {
  const { t } = useTranslation();
  const [configKey, setConfigKey] = useState("");
  const [configType, setConfigType] = useState<"TEXT" | "IMAGE" | "COLOR" | "NUMBER" | "BOOLEAN">("TEXT");
  const [configValue, setConfigValue] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setConfigKey(initialData.configKey || "");
      setConfigType(initialData.configType || "TEXT");
      setConfigValue(initialData.configValue || "");
      setDescription(initialData.description || "");
    } else {
      setConfigKey("");
      setConfigType("TEXT");
      setConfigValue("");
      setDescription("");
    }
  }, [initialData, isOpen]);

  // Sync default value if changing type during creation
  useEffect(() => {
    if (!initialData) {
      if (configType === "BOOLEAN") {
        setConfigValue("true");
      } else if (configType === "NUMBER") {
        setConfigValue("0");
      } else if (configType === "COLOR") {
        setConfigValue("#3b82f6"); // Default primary blue
      } else {
        setConfigValue("");
      }
    }
  }, [configType, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (initialData) {
      await onSubmit({ configValue, description });
    } else {
      await onSubmit({ configKey, configType, configValue, description });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? t("admin.publicConfigs.form.editTitle").replace("{key}", initialData.configKey) : t("admin.publicConfigs.form.addTitle")}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t("admin.publicConfigs.form.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {initialData ? t("admin.publicConfigs.form.save") : t("admin.publicConfigs.form.create")}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Config Key: Only editable during creation */}
        <div className="space-y-2">
          <Label htmlFor="config-key" className="font-bold text-xs uppercase tracking-wider">{t("admin.publicConfigs.form.keyLabel")}</Label>
          <Input 
            id="config-key" 
            placeholder={t("admin.publicConfigs.form.keyPlaceholder")} 
            value={configKey}
            onChange={(e) => setConfigKey(e.target.value.toLowerCase().replace(/[^a-z0-9_.-]/g, ""))}
            required
            disabled={!!initialData}
            className="bg-surface-variant/20 border-outline-variant focus:border-primary transition-all font-mono font-bold"
          />
          {!initialData && (
            <p className="text-[10px] text-on-surface-variant/70 italic">
              {t("admin.publicConfigs.form.keyHint")}
            </p>
          )}
        </div>

        {/* Config Type: Only editable during creation */}
        <div className="space-y-2">
          <Label htmlFor="config-type" className="font-bold text-xs uppercase tracking-wider">{t("admin.publicConfigs.form.typeLabel")}</Label>
          <select
            id="config-type"
            value={configType}
            onChange={(e) => setConfigType(e.target.value as any)}
            disabled={!!initialData}
            className="flex h-10 w-full rounded-xl border border-outline-variant bg-surface-variant/20 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-semibold"
          >
            <option value="TEXT">{t("admin.publicConfigs.form.types.text")}</option>
            <option value="IMAGE">{t("admin.publicConfigs.form.types.image")}</option>
            <option value="COLOR">{t("admin.publicConfigs.form.types.color")}</option>
            <option value="NUMBER">{t("admin.publicConfigs.form.types.number")}</option>
            <option value="BOOLEAN">{t("admin.publicConfigs.form.types.boolean")}</option>
          </select>
        </div>

        {/* Config Value: Inputs rendered dynamically based on Config Type */}
        <div className="space-y-2 border-t border-outline-variant/30 pt-4">
          <Label htmlFor="config-value" className="font-bold text-xs uppercase tracking-wider">{t("admin.publicConfigs.form.valueLabel")}</Label>
          
          {configType === "BOOLEAN" && (
            <select
              id="config-value"
              value={configValue}
              onChange={(e) => setConfigValue(e.target.value)}
              className="flex h-10 w-full rounded-xl border border-outline-variant bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all font-mono"
            >
              <option value="true">{t("admin.publicConfigs.form.booleanOptions.true")}</option>
              <option value="false">{t("admin.publicConfigs.form.booleanOptions.false")}</option>
            </select>
          )}

          {configType === "COLOR" && (
            <div className="flex gap-3 items-center">
              <div className="relative flex-grow">
                <Input 
                  id="config-value" 
                  placeholder="#ff0000" 
                  value={configValue}
                  onChange={(e) => setConfigValue(e.target.value)}
                  required
                  className="bg-white border-outline-variant pl-10 font-mono"
                />
                <Paintbrush size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline" />
              </div>
              <input 
                type="color" 
                value={configValue.startsWith("#") && configValue.length === 7 ? configValue : "#3b82f6"}
                onChange={(e) => setConfigValue(e.target.value)}
                className="w-10 h-10 rounded-xl border border-outline-variant p-0 cursor-pointer overflow-hidden shrink-0"
              />
              <div 
                className="w-10 h-10 rounded-xl border border-outline-variant shadow-inner shrink-0"
                style={{ backgroundColor: configValue }}
              />
            </div>
          )}

          {configType === "IMAGE" && (
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <Input 
                  id="config-value" 
                  placeholder="https://..." 
                  value={configValue}
                  onChange={(e) => setConfigValue(e.target.value)}
                  required
                  className="bg-white border-outline-variant flex-grow"
                />
                <div className="w-10 h-10 border border-outline-variant rounded-xl flex items-center justify-center bg-white overflow-hidden shadow-inner shrink-0">
                  {configValue ? (
                    <img src={configValue} className="w-full h-full object-contain p-1" alt="Preview" />
                  ) : (
                    <ImageIcon size={16} className="text-outline" />
                  )}
                </div>
              </div>
              {configValue && (
                <p className="text-[10px] text-on-surface-variant truncate">
                  {t("admin.publicConfigs.form.imagePreview").replace("{url}", configValue)}
                </p>
              )}
            </div>
          )}

          {configType === "NUMBER" && (
            <Input 
              id="config-value" 
              type="number"
              step="any"
              placeholder="0" 
              value={configValue}
              onChange={(e) => setConfigValue(e.target.value)}
              required
              className="bg-white border-outline-variant font-mono"
            />
          )}

          {configType === "TEXT" && (
            <textarea
              id="config-value"
              placeholder="..."
              value={configValue}
              onChange={(e) => setConfigValue(e.target.value)}
              rows={4}
              required
              className="flex w-full rounded-xl border border-outline-variant bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all font-inter"
            />
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="config-desc" className="font-bold text-xs uppercase tracking-wider">{t("admin.publicConfigs.form.descLabel")}</Label>
          <Input 
            id="config-desc" 
            placeholder={t("admin.publicConfigs.form.descPlaceholder")} 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-white border-outline-variant"
          />
        </div>
      </form>
    </Modal>
  );
}
