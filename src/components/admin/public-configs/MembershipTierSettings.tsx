"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Pencil, Plus, RefreshCcw, ToggleLeft, ToggleRight, Trash2 } from "lucide-react";
import { adminService, MembershipTierAdmin, MembershipTierRequest } from "@/services/adminService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ApiError } from "@/lib/api-client";
import { useTranslation } from "@/hooks/useTranslation";

const emptyTier: MembershipTierRequest = {
  code: "",
  displayNames: { vi: "", en: "" },
  descriptions: { vi: "", en: "" },
  threshold: 0,
  sortOrder: 0,
  discountPercentage: 0,
  freeShipping: false,
  benefits: {},
  active: true,
};

export function MembershipTierSettings() {
  const { t } = useTranslation();
  const [tiers, setTiers] = useState<MembershipTierAdmin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<MembershipTierAdmin | null>(null);
  const [draft, setDraft] = useState<MembershipTierRequest>(emptyTier);

  const load = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await adminService.getMembershipTiers();
      setTiers(response.data);
    } catch (error: any) {
      toast.error(error.message || t("admin.membershipTiers.messages.loadError"));
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => {
    setEditing(null);
    setDraft({ ...emptyTier, displayNames: { vi: "", en: "" }, descriptions: { vi: "", en: "" } });
    setIsModalOpen(true);
  };

  const openEdit = (tier: MembershipTierAdmin) => {
    setEditing(tier);
    setDraft({
      code: tier.code,
      displayNames: tier.displayNames || { vi: "", en: "" },
      descriptions: tier.descriptions || { vi: "", en: "" },
      threshold: tier.threshold,
      sortOrder: tier.sortOrder,
      discountPercentage: tier.discountPercentage,
      freeShipping: tier.freeShipping,
      benefits: tier.benefits || {},
      active: tier.active,
      expectedVersion: tier.version,
    });
    setIsModalOpen(true);
  };

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      if (editing) {
        await adminService.updateMembershipTier(editing.code, draft);
      } else {
        await adminService.createMembershipTier(draft);
      }
      setEditing(null);
      setIsModalOpen(false);
      await load();
      toast.success(t("admin.membershipTiers.messages.saveSuccess"));
    } catch (error: any) {
      toast.error(error instanceof ApiError && error.status === 409
        ? t("admin.membershipTiers.messages.conflict")
        : error.message || t("admin.membershipTiers.messages.saveError"));
      await load();
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async (tier: MembershipTierAdmin) => {
    try {
      await adminService.setMembershipTierActive(tier.code, !tier.active, tier.version);
      await load();
    } catch (error: any) {
      toast.error(error instanceof ApiError && error.status === 409
        ? t("admin.membershipTiers.messages.conflict")
        : error.message || t("admin.membershipTiers.messages.toggleError"));
      await load();
    }
  };

  const deleteTier = async (tier: MembershipTierAdmin) => {
    if (!window.confirm(t("admin.membershipTiers.messages.deleteConfirm").replace("{code}", tier.code))) return;
    try {
      await adminService.deleteMembershipTier(tier.code, tier.version);
      await load();
      toast.success(t("admin.membershipTiers.messages.deleteSuccess"));
    } catch (error: any) {
      toast.error(error instanceof ApiError && error.status === 409
        ? t("admin.membershipTiers.messages.deleteConflict")
        : error.message || t("admin.membershipTiers.messages.deleteError"));
      await load();
    }
  };

  const setNumber = (field: "threshold" | "sortOrder" | "discountPercentage", value: string) => {
    setDraft((current) => ({ ...current, [field]: Number(value) }));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider">{t("admin.membershipTiers.title")}</h3>
          <p className="text-xs text-on-surface-variant">{t("admin.membershipTiers.description")}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load} disabled={isLoading} className="gap-2"><RefreshCcw size={14} /> {t("admin.membershipTiers.reload")}</Button>
          <Button onClick={openCreate} className="gap-2"><Plus size={14} /> {t("admin.membershipTiers.add")}</Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-outline-variant bg-surface">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-variant/30 uppercase tracking-wider">
            <tr>
              <th className="p-4">{t("admin.membershipTiers.columns.code")}</th>
              <th className="p-4">{t("admin.membershipTiers.columns.threshold")}</th>
              <th className="p-4">{t("admin.membershipTiers.columns.discount")}</th>
              <th className="p-4">{t("admin.membershipTiers.columns.freeShipping")}</th>
              <th className="p-4">{t("admin.membershipTiers.columns.sortOrder")}</th>
              <th className="p-4">{t("admin.membershipTiers.columns.version")}</th>
              <th className="p-4 text-right">{t("admin.membershipTiers.columns.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={7} className="p-8 text-center"><Loader2 className="mx-auto animate-spin" /></td></tr> : tiers.map((tier) => (
              <tr key={tier.code} className="border-t border-outline-variant/60">
                <td className="p-4 font-black">
                  {tier.code}
                  <span className={`ml-2 rounded-full px-2 py-1 text-[10px] ${tier.active ? "bg-success/10 text-success" : "bg-surface-variant text-on-surface-variant"}`}>
                    {tier.active ? t("admin.membershipTiers.active.on") : t("admin.membershipTiers.active.off")}
                  </span>
                </td>
                <td className="p-4 font-mono">{tier.threshold.toLocaleString("vi-VN")}</td>
                <td className="p-4 font-mono">{tier.discountPercentage}%</td>
                <td className="p-4">{tier.freeShipping ? t("admin.membershipTiers.active.yes") : t("admin.membershipTiers.active.no")}</td>
                <td className="p-4">{tier.sortOrder}</td>
                <td className="p-4 text-on-surface-variant">v{tier.version}</td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(tier)}><Pencil size={13} /></Button>
                    <Button variant="outline" size="sm" onClick={() => toggleActive(tier)}>{tier.active ? <ToggleRight size={15} /> : <ToggleLeft size={15} />}</Button>
                    <Button variant="outline" size="sm" onClick={() => deleteTier(tier)}><Trash2 size={13} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => { setEditing(null); setIsModalOpen(false); }}
        title={editing ? t("admin.membershipTiers.modal.edit").replace("{code}", editing.code) : t("admin.membershipTiers.modal.create")}
      >
        <form onSubmit={save} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1"><Label>{t("admin.membershipTiers.fields.code")}</Label><Input value={draft.code || ""} disabled={!!editing} required onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })} /></div>
            <div className="space-y-1"><Label>{t("admin.membershipTiers.fields.sortOrder")}</Label><Input type="number" value={draft.sortOrder} required onChange={(e) => setNumber("sortOrder", e.target.value)} /></div>
            <div className="space-y-1"><Label>{t("admin.membershipTiers.fields.threshold")}</Label><Input type="number" min="0" value={draft.threshold} required onChange={(e) => setNumber("threshold", e.target.value)} /></div>
            <div className="space-y-1"><Label>{t("admin.membershipTiers.fields.discount")}</Label><Input type="number" min="0" max="100" step="0.01" value={draft.discountPercentage} required onChange={(e) => setNumber("discountPercentage", e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1"><Label>{t("admin.membershipTiers.fields.nameVi")}</Label><Input value={draft.displayNames.vi || ""} onChange={(e) => setDraft({ ...draft, displayNames: { ...draft.displayNames, vi: e.target.value } })} /></div>
            <div className="space-y-1"><Label>{t("admin.membershipTiers.fields.nameEn")}</Label><Input value={draft.displayNames.en || ""} onChange={(e) => setDraft({ ...draft, displayNames: { ...draft.displayNames, en: e.target.value } })} /></div>
          </div>
          <label className="flex items-center gap-2 text-xs font-bold"><input type="checkbox" checked={draft.freeShipping} onChange={(e) => setDraft({ ...draft, freeShipping: e.target.checked })} /> {t("admin.membershipTiers.fields.freeShipping")}</label>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => { setEditing(null); setIsModalOpen(false); }}>{t("admin.membershipTiers.buttons.cancel")}</Button>
            <Button type="submit" disabled={isSaving}>{isSaving && <Loader2 size={14} className="mr-2 animate-spin" />} {t("admin.membershipTiers.buttons.save")}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
