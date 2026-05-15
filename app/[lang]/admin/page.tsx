"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

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
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-on-surface">Dashboard Overview</h2>
        <p className="text-on-surface-variant">Welcome back, here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface p-6 rounded-2xl border border-outline-variant shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary">
                <stat.icon size={24} />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full",
                stat.trend === "up" ? "text-success bg-success/10" : 
                stat.trend === "down" ? "text-error bg-error/10" : 
                "text-on-surface-variant bg-surface-variant"
              )}>
                {stat.change}
                {stat.trend === "up" ? <ArrowUpRight size={14} /> : 
                 stat.trend === "down" ? <ArrowDownRight size={14} /> : null}
              </div>
            </div>
            <div>
              <p className="text-sm text-on-surface-variant font-medium mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-on-surface">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity / Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface p-8 rounded-2xl border border-outline-variant min-h-[400px] flex items-center justify-center">
          <div className="text-center">
            <p className="text-on-surface-variant mb-2">Revenue Analytics Chart</p>
            <p className="text-xs text-outline italic">(Chart integration coming soon)</p>
          </div>
        </div>
        <div className="bg-surface p-8 rounded-2xl border border-outline-variant min-h-[400px] flex flex-col">
          <h3 className="font-bold text-on-surface mb-6">Recent Orders</h3>
          <div className="flex-grow flex items-center justify-center text-on-surface-variant text-sm italic">
            No recent orders to show.
          </div>
        </div>
      </div>
    </div>
  );
}

