"use client";

import React from "react";
import { 
  Eye, 
  Truck, 
  Clock, 
  CheckCircle2, 
  XCircle,
  MoreVertical
} from "lucide-react";
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
import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";

interface OrderTableProps {
  readonly orders: any[];
  readonly isLoading: boolean;
  readonly onUpdateStatus: (id: number, status: string) => void;
  readonly onViewDetails: (id: number) => void;
}

export function OrderTable({ 
  orders, 
  isLoading, 
  onUpdateStatus, 
  onViewDetails 
}: OrderTableProps) {
  const { t } = useTranslation();

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING": 
        return { variant: "secondary" as const, icon: Clock, label: t("admin.orders.statuses.pending"), class: "text-amber-600 bg-amber-50 border-amber-200" };
      case "CONFIRMED": 
        return { variant: "default" as const, icon: CheckCircle2, label: t("admin.orders.statuses.confirmed"), class: "text-blue-600 bg-blue-50 border-blue-200" };
      case "PROCESSING": 
        return { variant: "secondary" as const, icon: Clock, label: t("admin.orders.statuses.processing"), class: "text-slate-600 bg-slate-50 border-slate-200" };
      case "SHIPPED":
      case "SHIPPING": 
        return { variant: "default" as const, icon: Truck, label: t("admin.orders.statuses.shipped"), class: "text-indigo-600 bg-indigo-50 border-indigo-200" };
      case "DELIVERED": 
        return { variant: "success" as const, icon: CheckCircle2, label: t("admin.orders.statuses.delivered"), class: "text-green-600 bg-green-50 border-green-200" };
      case "CANCELLED": 
        return { variant: "error" as const, icon: XCircle, label: t("admin.orders.statuses.cancelled"), class: "text-red-600 bg-red-50 border-red-200" };
      case "RETURN_REQUESTED": 
        return { variant: "secondary" as const, icon: Clock, label: t("admin.orders.statuses.return_requested"), class: "text-purple-600 bg-purple-50 border-purple-200" };
      case "RETURNED": 
        return { variant: "secondary" as const, icon: CheckCircle2, label: t("admin.orders.statuses.returned"), class: "text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200" };
      case "REFUNDED": 
        return { variant: "success" as const, icon: CheckCircle2, label: t("admin.orders.statuses.refunded"), class: "text-pink-600 bg-pink-50 border-pink-200" };
      default: 
        return { variant: "outline" as const, icon: Clock, label: status, class: "" };
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-variant/30">
            <TableHead className="w-[120px]">{t("admin.orders.table.orderId")}</TableHead>
            <TableHead>{t("admin.orders.table.customerContact")}</TableHead>
            <TableHead>{t("admin.orders.table.date")}</TableHead>
            <TableHead>{t("admin.orders.table.totalAmount")}</TableHead>
            <TableHead>{t("admin.orders.table.payment")}</TableHead>
            <TableHead>{t("admin.orders.table.status")}</TableHead>
            <TableHead className="text-right">{t("admin.orders.table.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((_, j) => (
                  <TableCell key={j}><Skeleton className="h-10 w-full" /></TableCell>
                ))}
              </TableRow>
            ))
          ) : orders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-32 text-center text-on-surface-variant italic">
                {t("admin.orders.table.noOrders")}
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => {
              const status = getStatusConfig(order.status);
              
              return (
                <TableRow key={order.id} className="group hover:bg-surface-variant/20 transition-colors">
                  <TableCell className="font-mono text-xs font-bold text-primary">
                    #ORD-{order.id.toString().padStart(6, '0')}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-on-surface">{order.phoneNumber}</span>
                      <span className="text-[10px] text-on-surface-variant truncate max-w-[150px]">
                        {order.shippingAddress}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-on-surface-variant text-xs">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell className="font-black text-on-surface">
                    ${order.totalAmount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-tighter">
                      {order.paymentMethod}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="relative inline-block w-full min-w-[130px]">
                      <select
                        value={order.status}
                        onChange={(e) => onUpdateStatus(order.id, e.target.value)}
                        className={cn(
                          "appearance-none outline-none cursor-pointer pr-8 pl-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all w-full select-none",
                          status.class
                        )}
                      >
                        <option value="PENDING">{t("admin.orders.statuses.pending")}</option>
                        <option value="CONFIRMED">{t("admin.orders.statuses.confirmed")}</option>
                        <option value="PROCESSING">{t("admin.orders.statuses.processing")}</option>
                        <option value="SHIPPED">{t("admin.orders.statuses.shipped")}</option>
                        <option value="DELIVERED">{t("admin.orders.statuses.delivered")}</option>
                        <option value="CANCELLED">{t("admin.orders.statuses.cancelled")}</option>
                        <option value="RETURN_REQUESTED">{t("admin.orders.statuses.return_requested")}</option>
                        <option value="RETURNED">{t("admin.orders.statuses.returned")}</option>
                        <option value="REFUNDED">{t("admin.orders.statuses.refunded")}</option>
                      </select>
                      <div className={cn(
                        "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[8px] font-black leading-none",
                        status.class.split(" ")[0]
                      )}>
                        ▼
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-8 gap-1.5 text-[11px] font-bold uppercase tracking-wider rounded-lg"
                        onClick={() => onViewDetails(order.id)}
                      >
                        <Eye size={14} />
                        {t("admin.orders.table.details")}
                      </Button>
                      <Button variant="outline" size="icon" className="h-8 w-8 text-on-surface-variant">
                        <MoreVertical size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
