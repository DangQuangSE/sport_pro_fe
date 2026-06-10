"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  Plus, 
  Trash2, 
  ArrowLeft, 
  Save, 
  Loader2, 
  Ruler, 
  Settings, 
  HelpCircle,
  ChevronRight,
  ListOrdered
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { useTranslation } from "@/hooks/useTranslation";
import { useSizes } from "@/hooks/admin/useSizes";
import { SizeGroup, SizeOption } from "@/services/adminService";
import { toast } from "sonner";

export default function AdminSizesPage() {
  const router = useRouter();
  const { t } = useTranslation();
  
  const { 
    sizeGroups, 
    isLoading, 
    isSubmitting, 
    createSizeGroup, 
    updateSizeGroup, 
    deleteSizeGroup 
  } = useSizes();

  // Selected Size Group for detail editor
  const [selectedGroup, setSelectedGroup] = useState<SizeGroup | null>(null);

  // Group Details Form State (name, description, options)
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [sizeOptions, setSizeOptions] = useState<SizeOption[]>([]);

  // Modal State for deleting group
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<SizeGroup | null>(null);

  // Trigger when a group is selected from list
  const handleSelectGroup = (group: SizeGroup) => {
    setSelectedGroup(group);
    setGroupName(group.name);
    setGroupDescription(group.description || "");
    // Copy options and sort by displayOrder
    const sortedOptions = [...group.sizes].sort((a, b) => a.displayOrder - b.displayOrder);
    setSizeOptions(sortedOptions);
  };

  // Trigger to initialize a new group creation
  const handleInitNewGroup = () => {
    setSelectedGroup({ id: 0, name: "", description: "", sizes: [] });
    setGroupName("");
    setGroupDescription("");
    setSizeOptions([
      { name: "S", displayOrder: 1 },
      { name: "M", displayOrder: 2 },
      { name: "L", displayOrder: 3 },
      { name: "XL", displayOrder: 4 }
    ]);
  };

  // Add a size row to options list
  const handleAddSizeOption = () => {
    const nextOrder = sizeOptions.length > 0 
      ? Math.max(...sizeOptions.map(o => o.displayOrder)) + 1 
      : 1;
    setSizeOptions([...sizeOptions, { name: "", displayOrder: nextOrder }]);
  };

  // Remove a size row from options list
  const handleRemoveSizeOption = (index: number) => {
    setSizeOptions(sizeOptions.filter((_, i) => i !== index));
  };

  // Update a single option field (name or order)
  const handleUpdateOption = (index: number, field: keyof SizeOption, value: any) => {
    const updated = [...sizeOptions];
    updated[index] = { ...updated[index], [field]: value };
    setSizeOptions(updated);
  };

  // Save changes (create or update size group)
  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast.error(t("admin.sizes.nameRequired"));
      return;
    }

    // Filter empty options
    const finalOptions = sizeOptions
      .filter(o => o.name.trim() !== "")
      .map(o => ({ ...o, name: o.name.trim() }));

    if (finalOptions.length === 0) {
      toast.error(t("admin.sizes.minOneSize"));
      return;
    }

    const payload = {
      name: groupName.trim(),
      description: groupDescription.trim(),
      sizes: finalOptions
    };

    let result;
    if (selectedGroup && selectedGroup.id !== 0) {
      result = await updateSizeGroup(selectedGroup.id, payload);
    } else {
      result = await createSizeGroup(payload);
    }

    if (result.success) {
      toast.success(
        selectedGroup && selectedGroup.id !== 0 
          ? t("admin.sizes.updateSuccess")
          : t("admin.sizes.createSuccess")
      );
      setSelectedGroup(null);
    } else {
      toast.error(result.error || "Save failed");
    }
  };

  const handleDeleteTrigger = (group: SizeGroup, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid selecting group when clicking delete
    setGroupToDelete(group);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!groupToDelete) return;
    const result = await deleteSizeGroup(groupToDelete.id);
    if (result.success) {
      setDeleteConfirmOpen(false);
      setGroupToDelete(null);
      if (selectedGroup && selectedGroup.id === groupToDelete.id) {
        setSelectedGroup(null);
      }
      toast.success(t("admin.sizes.deleteSuccess"));
    } else {
      toast.error(result.error || "Delete failed");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6 animate-in fade-in duration-300">
        <div className="relative flex items-center justify-center">
          <Loader2 size={48} className="animate-spin text-primary relative z-10" />
          <div className="absolute w-12 h-12 rounded-full border-4 border-primary/20 animate-ping" />
        </div>
        <p className="text-on-surface-variant font-mono font-medium text-sm tracking-wider uppercase">
          {t("admin.sizes.loading")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 px-4 sm:px-6 animate-in fade-in duration-500">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-outline-variant pb-6">
        <div className="flex items-center gap-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-12 w-12 rounded-2xl border-outline-variant hover:border-primary hover:text-primary transition-all duration-300 shadow-sm"
            onClick={() => router.back()}
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h2 className="text-3xl sm:text-4xl font-black italic tracking-tighter text-on-surface uppercase leading-none flex items-center gap-3">
              <Ruler className="text-primary h-8 w-8" />
              {t("admin.sizes.title")}
            </h2>
            <p className="text-on-surface-variant font-medium text-sm mt-1.5 leading-relaxed">
              {t("admin.sizes.subtitle")}
            </p>
          </div>
        </div>
        
        <Button 
          onClick={handleInitNewGroup}
          className="h-12 px-6 rounded-xl font-black uppercase tracking-widest text-[10px] bg-primary text-on-primary hover:bg-primary/95 transition-all duration-300 shadow-lg shadow-primary/20 gap-2"
        >
          <Plus size={16} />
          {t("admin.sizes.create")}
        </Button>
      </div>

      {/* Grid Layout: Master-Detail */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Column: Size Group List (Master) */}
        <div className="md:col-span-5 space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-on-surface-variant opacity-60">
            {t("admin.sizes.list")}
          </h3>
          
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {sizeGroups.length === 0 ? (
              <div className="text-center py-12 bg-surface rounded-[2rem] border-2 border-dashed border-outline-variant text-on-surface-variant font-medium italic">
                <HelpCircle size={36} className="mx-auto text-outline-variant mb-2 animate-bounce" />
                {t("admin.sizes.empty")}
              </div>
            ) : (
              sizeGroups.map((group) => {
                const isSelected = selectedGroup?.id === group.id;
                return (
                  <div
                    key={group.id}
                    onClick={() => handleSelectGroup(group)}
                    className={`group cursor-pointer p-5 rounded-3xl border-2 transition-all duration-300 flex items-center justify-between shadow-sm relative overflow-hidden ${
                      isSelected
                        ? "bg-surface border-primary shadow-md"
                        : "bg-surface-container/20 border-outline-variant/60 hover:border-primary/40 hover:bg-surface-variant/15"
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />
                    )}
                    
                    <div className="space-y-1 pr-4 min-w-0">
                      <h4 className="font-lexend font-bold text-on-surface text-base truncate">
                        {group.name}
                      </h4>
                      <p className="text-xs text-on-surface-variant font-medium line-clamp-1">
                        {group.description || t("admin.sizes.noDescription")}
                      </p>
                      
                      {/* Swatches preview */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        {group.sizes.map((s) => (
                          <span 
                            key={s.id || s.name} 
                            className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg border border-outline-variant text-[10px] font-bold font-mono bg-surface shadow-sm"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-xl hover:border-error hover:text-error transition-all duration-200 opacity-0 group-hover:opacity-100"
                        onClick={(e) => handleDeleteTrigger(group, e)}
                        title={t("admin.sizes.delete")}
                      >
                        <Trash2 size={14} />
                      </Button>
                      <ChevronRight size={18} className="text-on-surface-variant opacity-60 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Size Editor (Detail) */}
        <div className="md:col-span-7">
          <AnimatePresence mode="wait">
            {!selectedGroup ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="h-[400px] rounded-[2.5rem] border-2 border-dashed border-outline-variant flex flex-col items-center justify-center text-center p-8 text-on-surface-variant bg-surface-container-lowest/10"
              >
                <Settings size={48} className="text-outline-variant mb-4 animate-spin-slow" />
                <h4 className="font-lexend font-bold text-lg text-on-surface mb-1">
                  {t("admin.sizes.configurator")}
                </h4>
                <p className="text-sm font-medium max-w-sm">
                  {t("admin.sizes.configuratorHint")}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="editor"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-surface rounded-[2.5rem] border-2 border-outline-variant shadow-xl p-8 sm:p-10 space-y-6"
              >
                <div className="flex justify-between items-center border-b border-outline-variant pb-4">
                  <div>
                    <h3 className="font-lexend font-black uppercase text-base text-primary tracking-wide">
                      {selectedGroup.id === 0 
                        ? t("admin.sizes.newGroup")
                        : t("admin.sizes.editGroup")}
                    </h3>
                    {selectedGroup.id !== 0 && (
                      <p className="text-xs font-mono font-bold text-on-surface-variant opacity-50 mt-0.5">
                        ID: #{selectedGroup.id}
                      </p>
                    )}
                  </div>
                  <Button 
                    variant="ghost" 
                    className="font-bold text-xs" 
                    onClick={() => setSelectedGroup(null)}
                  >
                    {t("admin.sizes.close")}
                  </Button>
                </div>

                <form onSubmit={handleSaveChanges} className="space-y-6">
                  
                  {/* Name Input */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                      {t("admin.sizes.nameLabel")} <span className="text-error">*</span>
                    </Label>
                    <Input 
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="h-12 rounded-xl border-outline-variant/60 focus:border-primary font-bold text-base"
                      placeholder={t("admin.sizes.namePlaceholder")}
                      required
                    />
                  </div>

                  {/* Description Input */}
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
                      {t("admin.sizes.descriptionLabel")}
                    </Label>
                    <Input 
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      className="h-12 rounded-xl border-outline-variant/60 focus:border-primary font-medium"
                      placeholder={t("admin.sizes.descriptionPlaceholder")}
                    />
                  </div>

                  {/* Size Options Grid */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant flex items-center gap-1">
                        <ListOrdered size={12} />
                        {t("admin.sizes.optionsLabel")}
                      </Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="rounded-lg h-8 px-3 gap-1 border-primary text-primary hover:bg-primary/5 font-bold uppercase tracking-widest text-[9px]"
                        onClick={handleAddSizeOption}
                      >
                        <Plus size={12} />
                        {t("admin.sizes.addSize")}
                      </Button>
                    </div>

                    <div className="border border-outline-variant/50 rounded-2xl overflow-hidden bg-surface-variant/5">
                      {sizeOptions.length === 0 ? (
                        <p className="text-center py-8 text-xs font-semibold text-on-surface-variant italic">
                          {t("admin.sizes.noSizes")}
                        </p>
                      ) : (
                        <div className="divide-y divide-outline-variant/60 max-h-[300px] overflow-y-auto p-4 space-y-2">
                          {sizeOptions.map((option, index) => (
                            <div key={index} className="flex gap-4 items-center">
                              {/* Option Name Input */}
                              <div className="flex-grow space-y-1">
                                <Input
                                  value={option.name}
                                  onChange={(e) => handleUpdateOption(index, "name", e.target.value)}
                                  className="h-10 rounded-xl border-outline-variant/60 focus:border-primary font-bold font-mono uppercase text-center"
                                  placeholder={t("admin.sizes.sizePlaceholder")}
                                  required
                                />
                              </div>

                              {/* Display Order Input */}
                              <div className="w-24 space-y-1">
                                <Input
                                  type="number"
                                  value={option.displayOrder}
                                  onChange={(e) => handleUpdateOption(index, "displayOrder", Number(e.target.value))}
                                  className="h-10 rounded-xl border-outline-variant/60 focus:border-primary text-center font-bold"
                                  placeholder="Order"
                                  title="Display sorting order"
                                />
                              </div>

                              {/* Remove Button */}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 text-on-surface-variant hover:text-error rounded-lg"
                                onClick={() => handleRemoveSizeOption(index)}
                              >
                                <Trash2 size={15} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end pt-4 border-t border-outline-variant gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-xl font-bold h-11 border-outline-variant hover:bg-surface-variant/40"
                      onClick={() => setSelectedGroup(null)}
                      disabled={isSubmitting}
                    >
                      {t("admin.sizes.cancel")}
                    </Button>
                    <Button
                      type="submit"
                      className="rounded-xl font-bold h-11 bg-primary text-on-primary hover:bg-primary/95 shadow-md gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                      {t("admin.sizes.save")}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        title={t("admin.sizes.deleteConfirmTitle")}
        footer={
          <>
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmOpen(false)}
              className="rounded-xl font-bold h-11 border-outline-variant"
              disabled={isSubmitting}
            >
              {t("admin.sizes.cancel")}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmDelete}
              className="rounded-xl font-bold h-11 shadow-md gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              {t("admin.sizes.deleteConfirm")}
            </Button>
          </>
        }
      >
        <p className="text-on-surface-variant font-medium text-sm leading-relaxed">
          {t("admin.sizes.deleteConfirmMessage").replace("{name}", groupToDelete?.name ?? "")}
        </p>
      </Modal>
    </div>
  );
}
