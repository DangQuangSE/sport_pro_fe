"use client";

import React, { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Coupon, CouponRequest, DiscountType, UserTier } from "@/services/couponService";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CouponFormModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSubmit: (data: CouponRequest) => Promise<void>;
  readonly initialData: Coupon | null;
  readonly isSubmitting: boolean;
}

const SELECT_CLASS =
  "flex h-10 w-full rounded-md border border-outline-variant bg-surface-variant/20 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-all";

const EMPTY_FORM: CouponRequest = {
  code: "",
  discountType: DiscountType.PERCENTAGE,
  discountValue: 0,
  minOrderAmount: null,
  maxDiscountAmount: null,
  requiredTier: null,
  startDate: null,
  endDate: null,
  usageLimit: null,
  maxUsagePerUser: null,
  isActive: true
};

// Backend LocalDateTime strings ("2026-07-19T10:00:00") need truncating to the
// "YYYY-MM-DDTHH:mm" shape <input type="datetime-local"> expects, and back.
function toDatetimeLocal(value: string | null): string {
  return value ? value.slice(0, 16) : "";
}

function fromDatetimeLocal(value: string): string | null {
  return value ? value : null;
}

export function CouponFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting
}: CouponFormModalProps) {
  const [formData, setFormData] = useState<CouponRequest>(EMPTY_FORM);

  useEffect(() => {
    if (initialData) {
      setFormData({
        code: initialData.code,
        discountType: initialData.discountType,
        discountValue: initialData.discountValue,
        minOrderAmount: initialData.minOrderAmount,
        maxDiscountAmount: initialData.maxDiscountAmount,
        requiredTier: initialData.requiredTier,
        startDate: initialData.startDate,
        endDate: initialData.endDate,
        usageLimit: initialData.usageLimit,
        maxUsagePerUser: initialData.maxUsagePerUser,
        isActive: initialData.isActive
      });
    } else {
      setFormData(EMPTY_FORM);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Coupon" : "Create Coupon"}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
            {isSubmitting && <Loader2 size={16} className="animate-spin" />}
            {initialData ? "Save Changes" : "Create Coupon"}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="coupon-code">Code</Label>
          <Input
            id="coupon-code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            disabled={!!initialData}
            required
            placeholder="e.g. SALE50"
            className="bg-surface-variant/20 border-outline-variant focus:border-primary transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="coupon-discount-type">Discount Type</Label>
            <select
              id="coupon-discount-type"
              className={SELECT_CLASS}
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value as DiscountType })}
            >
              <option value={DiscountType.PERCENTAGE}>Percentage (%)</option>
              <option value={DiscountType.FIXED_AMOUNT}>Fixed Amount (đ)</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="coupon-discount-value">
              Discount Value {formData.discountType === DiscountType.PERCENTAGE ? "(%)" : "(đ)"}
            </Label>
            <Input
              id="coupon-discount-value"
              type="number"
              min={0}
              value={formData.discountValue}
              onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
              required
              className="bg-surface-variant/20 border-outline-variant focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="coupon-min-order">Min Order Amount (đ)</Label>
            <Input
              id="coupon-min-order"
              type="number"
              min={0}
              value={formData.minOrderAmount ?? ""}
              onChange={(e) =>
                setFormData({ ...formData, minOrderAmount: e.target.value ? Number(e.target.value) : null })
              }
              className="bg-surface-variant/20 border-outline-variant focus:border-primary transition-all"
            />
          </div>
          {formData.discountType === DiscountType.PERCENTAGE && (
            <div className="space-y-2">
              <Label htmlFor="coupon-max-discount">Max Discount Amount (đ)</Label>
              <Input
                id="coupon-max-discount"
                type="number"
                min={0}
                value={formData.maxDiscountAmount ?? ""}
                onChange={(e) =>
                  setFormData({ ...formData, maxDiscountAmount: e.target.value ? Number(e.target.value) : null })
                }
                className="bg-surface-variant/20 border-outline-variant focus:border-primary transition-all"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="coupon-usage-limit">Total Usage Limit</Label>
            <Input
              id="coupon-usage-limit"
              type="number"
              min={0}
              value={formData.usageLimit ?? ""}
              placeholder="Unlimited"
              onChange={(e) =>
                setFormData({ ...formData, usageLimit: e.target.value ? Number(e.target.value) : null })
              }
              className="bg-surface-variant/20 border-outline-variant focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coupon-max-per-user">Max Usage Per User</Label>
            <Input
              id="coupon-max-per-user"
              type="number"
              min={0}
              value={formData.maxUsagePerUser ?? ""}
              placeholder="Unlimited"
              onChange={(e) =>
                setFormData({ ...formData, maxUsagePerUser: e.target.value ? Number(e.target.value) : null })
              }
              className="bg-surface-variant/20 border-outline-variant focus:border-primary transition-all"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="coupon-required-tier">Required Membership Tier</Label>
          <select
            id="coupon-required-tier"
            className={SELECT_CLASS}
            value={formData.requiredTier ?? ""}
            onChange={(e) =>
              setFormData({ ...formData, requiredTier: e.target.value ? (e.target.value as UserTier) : null })
            }
          >
            <option value="">None</option>
            <option value={UserTier.BRONZE}>Bronze</option>
            <option value={UserTier.SILVER}>Silver</option>
            <option value={UserTier.GOLD}>Gold</option>
            <option value={UserTier.PLATINUM}>Platinum</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="coupon-start-date">Start Date</Label>
            <Input
              id="coupon-start-date"
              type="datetime-local"
              value={toDatetimeLocal(formData.startDate)}
              onChange={(e) => setFormData({ ...formData, startDate: fromDatetimeLocal(e.target.value) })}
              className="bg-surface-variant/20 border-outline-variant focus:border-primary transition-all"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="coupon-end-date">End Date</Label>
            <Input
              id="coupon-end-date"
              type="datetime-local"
              value={toDatetimeLocal(formData.endDate)}
              onChange={(e) => setFormData({ ...formData, endDate: fromDatetimeLocal(e.target.value) })}
              className="bg-surface-variant/20 border-outline-variant focus:border-primary transition-all"
            />
          </div>
        </div>

        {initialData && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-variant/30 border border-outline-variant/50 transition-all hover:bg-surface-variant/50">
            <input
              type="checkbox"
              id="coupon-is-active"
              className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary transition-all cursor-pointer"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            />
            <Label htmlFor="coupon-is-active" className="cursor-pointer text-sm font-medium">
              Active
            </Label>
          </div>
        )}
      </form>
    </Modal>
  );
}
