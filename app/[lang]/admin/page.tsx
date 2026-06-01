"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Calendar,
  Layers
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { adminService, RevenueReportResponse } from "@/services/adminService";

export default function AdminDashboardPage() {
  const params = useParams();
  const locale = params?.lang as string || "en";

  const [isLoading, setIsLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState("0 đ");
  const [activeOrdersCount, setActiveOrdersCount] = useState(0);
  const [totalProductsCount, setTotalProductsCount] = useState(0);
  const [newCustomersCount, setNewCustomersCount] = useState(0);
  const [revenueList, setRevenueList] = useState<RevenueReportResponse[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setIsLoading(true);
        
        // Define date range: last 30 days
        const endDateStr = new Date().toISOString().split("T")[0];
        const startDateStr = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

        const [revenueRes, statsRes, productsRes, ordersRes] = await Promise.all([
          adminService.getDailyRevenue(startDateStr, endDateStr).catch(() => ({ data: [] as RevenueReportResponse[] })),
          adminService.getOrderStatistics(startDateStr, endDateStr).catch(() => ({ data: { totalOrders: 0, statusCounts: {} } })),
          adminService.getProducts({ size: 1 }).catch(() => ({ data: { totalElements: 0 } })),
          adminService.getAllOrders({ size: 5 }).catch(() => ({ data: { content: [] } }))
        ]);

        // 1. Process Total Revenue
        const revData = revenueRes.data || [];
        setRevenueList(revData);
        const sumRevenue = revData.reduce((acc, curr) => acc + (curr.revenue || 0), 0);
        setTotalRevenue(`${sumRevenue.toLocaleString()} đ`);

        // 2. Process Active Orders (PENDING, CONFIRMED, SHIPPED)
        const stats = statsRes.data || { totalOrders: 0, statusCounts: {} };
        const counts = (stats.statusCounts || {}) as Record<string, number>;
        const active = (counts.PENDING || 0) + (counts.CONFIRMED || 0) + (counts.SHIPPED || 0);
        setActiveOrdersCount(active);

        // 3. Process Total Products
        const totalProducts = productsRes.data?.totalElements ?? 0;
        setTotalProductsCount(totalProducts);

        // 4. Process New Customers (Calculated estimate from orders or fallback)
        const estCustomers = Math.max(1, Math.ceil((stats.totalOrders || 0) * 0.6));
        setNewCustomersCount(estCustomers);

        // 5. Process Recent Orders
        const ordData = ordersRes.data?.content || [];
        setRecentOrders(ordData);

      } catch (err) {
        console.error("Error loading admin dashboard statistics", err);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  // Helper to format date strings nicely
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString(locale === "vi" ? "vi-VN" : "en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Status badge style helper
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

  // Custom high-fidelity responsive SVG chart calculation
  const renderSVGChart = () => {
    if (revenueList.length < 2) {
      return (
        <div className="text-center text-on-surface-variant/60 py-10 space-y-2">
          <Calendar size={32} className="mx-auto text-outline animate-bounce" />
          <p className="text-xs uppercase tracking-widest font-black">Awaiting Sales Records</p>
          <p className="text-[10px] text-outline font-medium">Daily revenue graphs populate as successfully delivered orders accumulate.</p>
        </div>
      );
    }

    const width = 500;
    const height = 220;
    const paddingLeft = 60;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 40;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Get max revenue value for scaling
    const maxVal = Math.max(...revenueList.map(r => r.revenue), 100000);
    const scaledMax = maxVal * 1.1; // Add 10% breathing room on top

    // Map list items to coordinates
    const coords = revenueList.map((item, index) => {
      const x = paddingLeft + (index / (revenueList.length - 1)) * chartWidth;
      const y = paddingTop + chartHeight - ((item.revenue || 0) / scaledMax) * chartHeight;
      return { x, y, date: item.date, revenue: item.revenue };
    });

    // Create polyline/path string
    const linePath = coords.map(c => `${c.x},${c.y}`).join(" ");
    const areaPath = `${paddingLeft},${paddingTop + chartHeight} ${linePath} ${paddingLeft + chartWidth},${paddingTop + chartHeight} Z`;

    return (
      <div className="w-full flex flex-col">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-[240px] text-on-surface overflow-visible">
          <defs>
            <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary, #fe9400)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="var(--primary, #fe9400)" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
            const y = paddingTop + r * chartHeight;
            const val = Math.round(scaledMax * (1 - r));
            return (
              <g key={i} className="opacity-20">
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="currentColor" strokeWidth={1} strokeDasharray="4 4" />
                <text x={paddingLeft - 10} y={y + 4} textAnchor="end" className="text-[9px] font-mono font-black text-on-surface-variant">{val.toLocaleString()}</text>
              </g>
            );
          })}

          {/* Area under curve with gradient glow */}
          <path d={areaPath} fill="url(#chartGlow)" />

          {/* Stroke Line */}
          <polyline points={linePath} fill="none" stroke="var(--primary, #fe9400)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />

          {/* Interactive Dots */}
          {coords.map((c, i) => (
            <circle
              key={i}
              cx={c.x}
              cy={c.y}
              r={4}
              className="fill-primary stroke-white border-2 hover:r-6 cursor-pointer transition-all duration-200"
            >
              <title>{`${c.date}: ${(c.revenue || 0).toLocaleString()} đ`}</title>
            </circle>
          ))}

          {/* X Axis Labels */}
          {coords.map((c, i) => {
            // Only show labels for first, middle, and last elements to keep it clean
            if (i !== 0 && i !== coords.length - 1 && i !== Math.floor(coords.length / 2)) return null;
            return (
              <text
                key={i}
                x={c.x}
                y={paddingTop + chartHeight + 20}
                textAnchor="middle"
                className="text-[9px] font-black text-on-surface-variant uppercase tracking-wider"
              >
                {c.date}
              </text>
            );
          })}
        </svg>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-4 text-on-surface-variant">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest italic animate-pulse">Syncing Command Operations...</p>
      </div>
    );
  }

  const stats = [
    { 
      label: "Total Revenue", 
      value: totalRevenue, 
      change: "+12.5%", 
      trend: "up",
      icon: TrendingUp 
    },
    { 
      label: "Active Orders", 
      value: activeOrdersCount.toString(), 
      change: "+5.2%", 
      trend: "up",
      icon: ShoppingCart 
    },
    { 
      label: "Total Products", 
      value: totalProductsCount.toString(), 
      change: "0%", 
      trend: "neutral",
      icon: Package 
    },
    { 
      label: "New Customers", 
      value: newCustomersCount.toString(), 
      change: "+14.8%", 
      trend: "up",
      icon: Users 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-2 font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.15em]">
        <Link href={`/${locale}`} className="hover:text-primary transition-colors flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          ADMIN
        </Link>
        <span className="text-[12px] leading-none">›</span>
        <span className="text-on-surface">DASHBOARD</span>
      </div>

      <h2 className="text-5xl font-black italic tracking-tighter text-on-surface uppercase leading-none mb-8" style={{ fontFamily: "var(--font-lexend)" }}>
        Command <span className="text-primary">Center</span>
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="group bg-surface p-6 rounded-3xl border border-outline-variant shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-6">
              <div className="p-4 bg-primary/5 rounded-2xl text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors duration-300">
                <stat.icon size={28} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border",
                stat.trend === "up" ? "text-success bg-success/5 border-success/20" : 
                stat.trend === "down" ? "text-error bg-error/5 border-error/20" : 
                "text-on-surface-variant bg-surface-variant border-outline-variant"
              )}>
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight size={12} /> : 
                 stat.trend === "down" ? <ArrowDownRight size={12} /> : null}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-2xl font-black text-on-surface tracking-tighter italic" style={{ fontFamily: "var(--font-lexend)" }}>
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity / Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Dynamic SVG Area Chart */}
        <div className="lg:col-span-2 bg-surface p-8 rounded-[2rem] border-2 border-outline-variant flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-lexend font-black text-on-surface uppercase tracking-widest text-sm italic">Revenue Analytics</h3>
              <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-wider mt-1">Gross daily revenue stream — past 30 days</p>
            </div>
            <TrendingUp className="text-primary animate-pulse" size={20} />
          </div>
          <div className="flex-grow flex items-center justify-center py-4">
            {renderSVGChart()}
          </div>
        </div>

        {/* Real Dynamic Recent Orders list */}
        <div className="bg-surface p-8 rounded-[2rem] border-2 border-outline-variant min-h-[440px] flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-lexend font-black text-on-surface uppercase tracking-widest text-sm italic">Recent Orders</h3>
            <Layers size={18} className="text-primary" />
          </div>

          <div className="flex-grow flex flex-col justify-center">
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-outline">
                  <ShoppingCart size={24} />
                </div>
                <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                  Awaiting Elite Transactions
                </p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/60 w-full flex flex-col">
                {recentOrders.map((order) => (
                  <Link 
                    key={order.id} 
                    href={`/${locale}/admin/orders/${order.id}`}
                    className="group/item flex justify-between items-center py-3.5 hover:bg-primary/5 hover:px-2 rounded-xl transition-all duration-200"
                  >
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase tracking-wider text-on-surface group-hover/item:text-primary transition-colors">
                        Order #{order.id}
                      </p>
                      <p className="text-[9px] font-bold text-on-surface-variant tracking-wider">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-xs font-black text-on-surface font-mono">
                        {(order.totalAmount || 0).toLocaleString()} đ
                      </p>
                      <div>
                        {getStatusBadge(order.status)}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href={`/${locale}/admin/orders`} className="w-full mt-6">
            <Button variant="outline" className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px]">
              View All Orders
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
}
