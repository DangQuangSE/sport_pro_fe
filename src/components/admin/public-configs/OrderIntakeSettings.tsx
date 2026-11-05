"use client";

import { LoadingButton } from "@/components/ui/loading-button";
import { useTranslation } from "@/hooks/useTranslation";
import type { PublicConfig, PublicConfigUpdateRequest } from "@/services/adminService";
import { toast } from "sonner";
import { ORDER_INTAKE_CHANGED_EVENT } from "@/contexts/OrderIntakeContext";

export const ORDER_INTAKE_SETTING = "checkout.orders.paused";

type Props = {
  config?: PublicConfig;
  loading: boolean;
  submitting: boolean;
  onUpdate: (key: string, data: PublicConfigUpdateRequest) => Promise<{ success: boolean; error?: string }>;
};

export function OrderIntakeSettings({ config, loading, submitting, onUpdate }: Props) {
  const { t } = useTranslation();
  const valid = config?.active === true && config.scope === "INTERNAL" && config.configType === "BOOLEAN"
    && /^(true|false)$/i.test(config.configValue);
  const paused = !valid || config?.configValue.toLowerCase() !== "false";

  async function toggle() {
    if (!config || !valid || config.version === undefined) return;
    if (paused && !window.confirm(t("adminOrderIntake.resumeConfirm"))) return;
    const result = await onUpdate(ORDER_INTAKE_SETTING, {
      configValue: paused ? "false" : "true",
      expectedVersion: config.version,
    });
    if (result.success) {
      window.dispatchEvent(new Event(ORDER_INTAKE_CHANGED_EVENT));
      toast.success(t("adminOrderIntake.saved"));
    } else toast.error(result.error || t("admin.publicConfigs.messages.error"));
  }

  return (
    <section className="rounded-2xl border border-outline-variant bg-surface p-5 space-y-3">
      <h3 className="font-bold text-on-surface">{t("adminOrderIntake.title")}</h3>
      <p className="text-sm text-on-surface-variant">{t("adminOrderIntake.description")}</p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p role="status" className={paused ? "font-semibold text-amber-700" : "font-semibold text-green-700"}>
          {t(loading ? "adminOrderIntake.loading" : paused ? "adminOrderIntake.paused" : "adminOrderIntake.open")}
        </p>
        <LoadingButton loading={submitting} type="button" disabled={loading || submitting || !valid || config?.version === undefined} onClick={toggle}>
          {t(paused ? "adminOrderIntake.resume" : "adminOrderIntake.pause")}
        </LoadingButton>
      </div>
      {!loading && !valid && <p role="alert" className="text-sm text-error">{t("adminOrderIntake.unconfigured")}</p>}
      <p className="text-xs text-on-surface-variant">{t("adminOrderIntake.inventoryNote")}</p>
    </section>
  );
}
