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
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING": 
        return { variant: "secondary" as const, icon: Clock, label: "Pending", class: "text-amber-600 bg-amber-50 border-amber-200" };
      case "CONFIRMED": 
        return { variant: "default" as const, icon: CheckCircle2, label: "Confirmed", class: "text-blue-600 bg-blue-50 border-blue-200" };
      case "SHIPPING": 
        return { variant: "default" as const, icon: Truck, label: "Shipping", class: "text-indigo-600 bg-indigo-50 border-indigo-200" };
      case "DELIVERED": 
        return { variant: "success" as const, icon: CheckCircle2, label: "Delivered", class: "text-green-600 bg-green-50 border-green-200" };
      case "CANCELLED": 
        return { variant: "error" as const, icon: XCircle, label: "Cancelled", class: "text-red-600 bg-red-50 border-red-200" };
      default: 
        return { variant: "outline" as const, icon: Clock, label: status, class: "" };
    }
  };

  return (
    <div className="bg-surface rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface-variant/30">
            <TableHead className="w-[120px]">Order ID</TableHead>
            <TableHead>Customer / Contact</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
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
                No orders found in the system.
              </TableCell>
            </TableRow>
          ) : (
            orders.map((order) => {
              const status = getStatusConfig(order.status);
              const StatusIcon = status.icon;
              
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
                    <div className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all",
                      status.class
                    )}>
                      <StatusIcon size={12} />
                      {status.label}
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
                        Details
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
