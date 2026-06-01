"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  BarChart3, 
  Loader2,
  Package,
  Layers,
  ShoppingBag,
  TrendingUp,
  Activity
} from "lucide-react";
import { adminService, TopProductResponse, TrendingDesignResponse } from "@/services/adminService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function AdminAnalyticsPage() {
  const params = useParams();
  const locale = params?.lang as string || "en";

  const [isLoading, setIsLoading] = useState(true);
  const [topProducts, setTopProducts] = useState<TopProductResponse[]>([]);
  const [trendingDesigns, setTrendingDesigns] = useState<TrendingDesignResponse[]>([]);
  const [orderStats, setOrderStats] = useState<any>(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        setIsLoading(true);
        const endDateStr = new Date().toISOString().split("T")[0];
        const startDateStr = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

        const [productsRes, designsRes, statsRes] = await Promise.all([
          adminService.getTopSellingProducts(5).catch(() => ({ data: [] })),
          adminService.getTrendingDesigns(5).catch(() => ({ data: [] })),
          adminService.getOrderStatistics(startDateStr, endDateStr).catch(() => ({ data: null }))
        ]);

        setTopProducts(productsRes.data || []);
        setTrendingDesigns(designsRes.data || []);
        setOrderStats(statsRes.data);
      } catch (err) {
        console.error("Failed to load admin analytics reports", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadAnalytics();
  }, []);

  const getStatusLabel = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING": return "Chờ duyệt";
      case "CONFIRMED": return "Đã xác nhận";
      case "SHIPPED": return "Đang giao";
      case "DELIVERED": return "Thành công";
      case "CANCELLED": return "Đã hủy";
      default: return status;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return <Badge className="bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-none uppercase font-bold text-[9px] tracking-wider px-2 py-0.5">Chờ duyệt</Badge>;
      case "CONFIRMED":
        return <Badge className="bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-none uppercase font-bold text-[9px] tracking-wider px-2 py-0.5">Đã xác nhận</Badge>;
      case "SHIPPED":
        return <Badge className="bg-purple-500/10 text-purple-500 border border-purple-500/20 shadow-none uppercase font-bold text-[9px] tracking-wider px-2 py-0.5">Đang giao</Badge>;
      case "DELIVERED":
        return <Badge className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-none uppercase font-bold text-[9px] tracking-wider px-2 py-0.5">Thành công</Badge>;
      case "CANCELLED":
        return <Badge className="bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-none uppercase font-bold text-[9px] tracking-wider px-2 py-0.5">Đã hủy</Badge>;
      default:
        return <Badge className="bg-slate-500/10 text-slate-500 border border-slate-500/20 shadow-none uppercase font-bold text-[9px] tracking-wider px-2 py-0.5">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-on-surface-variant">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest italic animate-pulse">Processing System Audit...</p>
      </div>
    );
  }

  const statusCounts = orderStats?.statusCounts || {};

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-2 font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.15em]">
        <Link href={`/${locale}/admin`} className="hover:text-primary transition-colors flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          ADMIN
        </Link>
        <span className="text-[12px] leading-none">›</span>
        <span className="text-on-surface">ANALYTICS</span>
      </div>

      <h2 className="text-5xl font-black italic tracking-tighter text-on-surface uppercase leading-none mb-8 font-lexend" style={{ fontFamily: "var(--font-lexend)" }}>
        Analytics <span className="text-primary">System</span>
      </h2>

      {/* Grid reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top selling products list widget */}
        <div className="bg-surface p-8 rounded-[2rem] border-2 border-outline-variant flex flex-col shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <Package size={20} className="text-primary" />
            <h3 className="font-lexend font-black text-on-surface uppercase tracking-widest text-sm italic">Top Selling Products</h3>
          </div>
          
          <div className="flex-grow">
            {topProducts.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant/60 text-xs font-bold uppercase tracking-wider">No sales records logged yet.</div>
            ) : (
              <Table>
                <TableHeader className="bg-surface-container/30">
                  <TableRow className="border-b border-outline-variant/60">
                    <TableHead className="font-bold text-[9px] uppercase tracking-widest pl-4 text-on-surface py-3">Product Name</TableHead>
                    <TableHead className="font-bold text-[9px] uppercase tracking-widest pr-4 text-right text-on-surface py-3">Units Sold</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topProducts.map((p, idx) => (
                    <TableRow key={p.productId || idx} className="border-b border-outline-variant/40 hover:bg-surface-container/10">
                      <TableCell className="font-bold text-xs pl-4 py-3.5 text-on-surface">{p.productName}</TableCell>
                      <TableCell className="font-bold font-mono text-xs pr-4 text-right py-3.5 text-primary">
                        {p.totalQuantitySold}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Trending custom designs widget */}
        <div className="bg-surface p-8 rounded-[2rem] border-2 border-outline-variant flex flex-col shadow-sm">
          <div className="flex items-center gap-2.5 mb-6">
            <Layers size={20} className="text-primary" />
            <h3 className="font-lexend font-black text-on-surface uppercase tracking-widest text-sm italic">Trending Custom Designs</h3>
          </div>
          
          <div className="flex-grow">
            {trendingDesigns.length === 0 ? (
              <div className="text-center py-12 text-on-surface-variant/60 text-xs font-bold uppercase tracking-wider">No custom designs created yet.</div>
            ) : (
              <Table>
                <TableHeader className="bg-surface-container/30">
                  <TableRow className="border-b border-outline-variant/60">
                    <TableHead className="font-bold text-[9px] uppercase tracking-widest pl-4 text-on-surface py-3">Design Mockup</TableHead>
                    <TableHead className="font-bold text-[9px] uppercase tracking-widest pr-4 text-right text-on-surface py-3">Orders Placed</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trendingDesigns.map((d, idx) => (
                    <TableRow key={d.designId || idx} className="border-b border-outline-variant/40 hover:bg-surface-container/10">
                      <TableCell className="pl-4 py-3">
                        <div className="w-12 h-12 rounded-xl border border-outline-variant overflow-hidden bg-surface-container-low flex items-center justify-center p-1.5 shadow-sm">
                          {d.designImageUrl ? (
                            <img src={d.designImageUrl} alt="Custom printing design mockup thumbnail" className="w-full h-full object-contain" />
                          ) : (
                            <Layers className="w-4 h-4 text-outline" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold font-mono text-xs pr-4 text-right py-4 text-primary">
                        {d.orderCount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>

        {/* Order stats breakdown widget */}
        <div className="bg-surface p-8 rounded-[2rem] border-2 border-outline-variant flex flex-col shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Activity size={20} className="text-primary" />
              <h3 className="font-lexend font-black text-on-surface uppercase tracking-widest text-sm italic">Operations Breakdown</h3>
            </div>
            {orderStats && (
              <Badge variant="outline" className="border-outline-variant text-[10px] font-black uppercase tracking-widest px-3 py-1 font-mono">
                Total Orders: {orderStats.totalOrders}
              </Badge>
            )}
          </div>

          <div>
            {!orderStats || orderStats.totalOrders === 0 ? (
              <div className="text-center py-12 text-on-surface-variant/60 text-xs font-bold uppercase tracking-wider">No operational order records found.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {Object.keys(statusCounts).map((status) => (
                  <div key={status} className="bg-surface-container/20 p-5 rounded-2xl border border-outline-variant/80 flex flex-col justify-between gap-3 text-center">
                    <div className="mx-auto">{getStatusBadge(status)}</div>
                    <div>
                      <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{getStatusLabel(status)}</p>
                      <p className="text-2xl font-black font-lexend text-on-surface font-mono italic">
                        {statusCounts[status]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
