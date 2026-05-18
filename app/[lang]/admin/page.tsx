"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { 
    label: "Total Revenue", 
    value: "$12,450.00", 
    change: "+12.5%", 
    trend: "up",
    icon: TrendingUp 
  },
  { 
    label: "Active Orders", 
    value: "48", 
    change: "+5.2%", 
    trend: "up",
    icon: ShoppingCart 
  },
  { 
    label: "Total Products", 
    value: "156", 
    change: "0%", 
    trend: "neutral",
    icon: Package 
  },
  { 
    label: "New Customers", 
    value: "12", 
    change: "-2.4%", 
    trend: "down",
    icon: Users 
  },
];

export default function AdminDashboardPage() {
  const params = useParams();
  const locale = params?.lang as string || "en";
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-2 border-outline-variant pb-8">
        <div className="space-y-2">
          <h2 className="text-5xl font-black italic tracking-tighter text-on-surface uppercase leading-none">
            Command <span className="text-primary">Center</span>
          </h2>
          <p className="text-on-surface-variant max-w-md font-medium text-sm tracking-tight">
            Real-time performance metrics and operational control for the Sport Pro ecosystem.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Last Updated</p>
            <p className="text-sm font-black text-primary italic">Just Now</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-surface-container border border-outline-variant flex items-center justify-center text-primary animate-pulse">
            <TrendingUp size={24} />
          </div>
        </div>
      </div>

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
              <h3 className="text-3xl font-black text-on-surface tracking-tighter italic">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity / Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface p-8 rounded-[2rem] border-2 border-outline-variant min-h-[440px] flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/[0.02] group-hover:bg-primary/[0.04] transition-colors" />
          <div className="relative text-center space-y-4">
            <div className="w-16 h-16 bg-surface rounded-2xl border border-outline-variant flex items-center justify-center mx-auto text-on-surface-variant shadow-inner">
              <TrendingUp size={32} />
            </div>
            <div>
              <p className="font-lexend font-black uppercase tracking-widest text-on-surface">Revenue Analytics</p>
              <p className="text-xs text-on-surface-variant italic font-medium">Synchronizing real-time data streams...</p>
            </div>
            <div className="pt-4">
              <Badge variant="outline" className="border-primary/30 text-primary font-bold">RECHARTS INTEGRATION PENDING</Badge>
            </div>
          </div>
        </div>
        <div className="bg-surface p-8 rounded-[2rem] border-2 border-outline-variant min-h-[440px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-lexend font-black text-on-surface uppercase tracking-widest text-sm italic">Recent Orders</h3>
            <ArrowUpRight size={20} className="text-primary" />
          </div>
          <div className="flex-grow flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-outline">
              <ShoppingCart size={24} />
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              Awaiting Elite Transactions
            </p>
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

