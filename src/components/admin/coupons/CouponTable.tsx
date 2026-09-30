"use client";

import React from "react";
import { Ticket, Power, PowerOff, Loader2 } from "lucide-react";
import { AdminActionButtons } from "@/components/admin/shared/AdminActionButtons";
import { Coupon, DiscountType } from "@/services/couponService";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface CouponTableProps {
  readonly coupons: Coupon[];
  readonly isLoading: boolean;
  readonly onEdit: (coupon: Coupon) => void;
  readonly onDelete: (id: number) => void;
  readonly onToggleActive: (coupon: Coupon) => void;
  readonly togglingIds: Set<number>;
}

function formatDiscount(coupon: Coupon): string {
  return coupon.discountType === DiscountType.PERCENTAGE
    ? `${coupon.discountValue}%`
    : `${coupon.discountValue.toLocaleString("vi-VN")}đ`;
}

function formatCurrency(value: number | null): string {
  return value && value > 0 ? `${value.toLocaleString("vi-VN")}đ` : "—";
}

export function CouponTable({ coupons, isLoading, onEdit, onDelete, onToggleActive, togglingIds }: CouponTableProps) {
  return (
    <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-variant/30">
            <TableHead>Code</TableHead>
            <TableHead>Discount</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Total Discount Given</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <TableCell key={j}><Skeleton className="h-6 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-32 text-center text-on-surface-variant italic">
                No coupons found.
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => (
              <TableRow key={coupon.id} className="group hover:bg-surface-variant/20 transition-colors">
                <TableCell className="font-medium text-on-surface">
                  <div className="flex items-center gap-2">
                    <Ticket size={14} className="text-primary" />
                    <span className="font-mono">{coupon.code}</span>
                  </div>
                </TableCell>
                <TableCell className="text-xs font-semibold">{formatDiscount(coupon)}</TableCell>
                <TableCell className="text-xs text-on-surface-variant">
                  {coupon.usedCount} / {coupon.usageLimit ?? "∞"}
                </TableCell>
                <TableCell className="text-xs text-on-surface-variant">
                  {formatCurrency(coupon.totalDiscountGiven)}
                </TableCell>
                <TableCell>
                  <Badge variant={coupon.isActive ? "success" : "secondary"}>
                    {coupon.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-lg"
                      onClick={() => onToggleActive(coupon)}
                      disabled={togglingIds.has(coupon.id)}
                      title={coupon.isActive ? "Deactivate" : "Activate"}
                    >
                      {togglingIds.has(coupon.id) ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : coupon.isActive ? (
                        <PowerOff size={14} />
                      ) : (
                        <Power size={14} />
                      )}
                    </Button>
                    <AdminActionButtons
                      onEdit={() => onEdit(coupon)}
                      onDelete={() => onDelete(coupon.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
