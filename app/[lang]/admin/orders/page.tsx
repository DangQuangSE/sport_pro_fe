"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Filter,
  ArrowUpDown,
  ChevronRight,
  Home,
  Download
} from "lucide-react";
import { useOrders } from "@/hooks/admin/useOrders";
import { OrderTable } from "@/components/admin/orders/OrderTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function AdminOrdersPage() {
  const { t, locale } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { 
    orders, 
    isLoading, 
    totalElements, 
    fetchOrders, 
    updateOrderStatus 
  } = useOrders();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [page, setPage] = useState(0);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(0);
    }, 400);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    fetchOrders({ 
      page: page,
      size: 10,
      search: debouncedSearch || undefined,
      status: selectedStatus || undefined
    });
  }, [page, debouncedSearch, selectedStatus, fetchOrders]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const result = await updateOrderStatus(id, status);
      if (result.success) {
        toast.success(`Order #ORD-${id.toString().padStart(6, '0')} status updated to ${status}`);
      } else {
        toast.error("Failed to update order status");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    }
  };

  const onViewDetails = (id: number) => {
    router.push(`/${locale}/admin/orders/${id}`);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Breadcrumbs & Actions Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-outline-variant pb-6">
        <div className="flex flex-col gap-1 flex-shrink-0">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
            <Link href={`/${locale}/admin`} className="hover:text-primary transition-colors flex items-center gap-1">
              <Home size={10} />
              Admin
            </Link>
            <ChevronRight size={10} />
            <span className="text-on-surface">Orders</span>
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter text-on-surface uppercase leading-none">
            Order <span className="text-primary">Fulfillment</span>
          </h2>
        </div>

        {/* Search, Filter, Sort and Export Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search bar */}
          <div className="relative w-full sm:w-[260px] group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors" size={16} />
            <Input 
              placeholder="Search by Order ID or phone..." 
              className="pl-10 h-10 rounded-xl bg-surface-container-highest/30 border-outline-variant focus:bg-surface focus:border-primary transition-all font-inter text-xs shadow-inner" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {/* Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto flex-shrink-0">
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(0);
                }}
                className="h-10 px-4 pr-10 rounded-xl border border-outline-variant bg-surface text-xs font-bold uppercase tracking-wider focus:border-primary outline-none cursor-pointer appearance-none min-w-[150px] w-full sm:w-auto"
              >
                <option value="">All Statuses</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="SHIPPED">Shipped</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
                <option value="RETURN_REQUESTED">Return Requested</option>
                <option value="RETURNED">Returned</option>
                <option value="REFUNDED">Refunded</option>
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant font-bold text-[9px]">
                ▼
              </div>
            </div>
            <Button variant="outline" className="gap-1.5 h-10 rounded-xl border-outline-variant hover:border-primary transition-all text-xs font-bold w-full sm:w-auto px-3">
              <ArrowUpDown size={14} />
              Sort
            </Button>
            <Button 
              variant="outline" 
              className="gap-1.5 h-10 px-4 rounded-xl border-outline-variant hover:border-primary transition-all text-xs font-bold w-full sm:w-auto flex-shrink-0"
            >
              <Download size={14} />
              Export Reports
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">

        {/* Table Area */}
        <OrderTable 
          orders={orders}
          isLoading={isLoading}
          onUpdateStatus={handleUpdateStatus}
          onViewDetails={onViewDetails}
        />

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
          <p className="text-sm text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">{orders.length}</span> of <span className="font-bold text-on-surface">{totalElements}</span> processed orders
          </p>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-10 rounded-xl px-4"
              disabled={page === 0}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.max(1, Math.ceil(totalElements / 10)) }).map((_, i) => (
                <Button
                  key={i}
                  variant={page === i ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "w-10 h-10 rounded-xl",
                    page === i ? "shadow-md shadow-primary/20" : ""
                  )}
                  onClick={() => setPage(i)}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button 
              variant="outline" 
              size="sm"
              className="h-10 rounded-xl px-4"
              disabled={(page + 1) * 10 >= totalElements}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
