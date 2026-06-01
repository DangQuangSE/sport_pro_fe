"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { 
  Users, 
  Loader2,
  Mail,
  User as UserIcon,
  ShieldAlert
} from "lucide-react";
import { adminService } from "@/services/adminService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import MembershipBadge from "@/components/ui/MembershipBadge";

export default function AdminUsersPage() {
  const params = useParams();
  const locale = params?.lang as string || "en";

  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        setIsLoading(true);
        const res = await adminService.getUsers();
        setUsers(res.data || []);
      } catch (err) {
        console.error("Failed to load admin users list", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadUsers();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0
    }).format(value);
  };

  const getRoleBadge = (role: string) => {
    if (role?.toUpperCase() === "ADMIN") {
      return (
        <Badge className="bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-none uppercase font-bold text-[9px] tracking-wider px-2 py-0.5 flex items-center gap-1 w-fit">
          <ShieldAlert className="w-3 h-3" />
          Admin
        </Badge>
      );
    }
    return (
      <Badge className="bg-slate-500/10 text-slate-500 border border-slate-500/20 shadow-none uppercase font-bold text-[9px] tracking-wider px-2 py-0.5 w-fit">
        User
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-on-surface-variant">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest italic animate-pulse">Syncing User Files...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-2 font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.15em]">
        <Link href={`/${locale}/admin`} className="hover:text-primary transition-colors flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          ADMIN
        </Link>
        <span className="text-[12px] leading-none">›</span>
        <span className="text-on-surface">USERS</span>
      </div>

      <h2 className="text-5xl font-black italic tracking-tighter text-on-surface uppercase leading-none mb-8 font-lexend" style={{ fontFamily: "var(--font-lexend)" }}>
        Users <span className="text-primary">System</span>
      </h2>

      {/* Content Table */}
      <div className="bg-surface rounded-3xl border-2 border-outline-variant overflow-hidden shadow-sm">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-16">
            <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-outline">
              <Users size={24} />
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
              No users found on this database segment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-surface-container/30">
                <TableRow className="border-b border-outline-variant/60">
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 pl-6 text-on-surface">ID</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-on-surface">Avatar</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-on-surface">Full Name</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-on-surface">Email</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-on-surface">Role</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-on-surface">Membership</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 pr-6 text-right text-on-surface">Total Spending</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} className="border-b border-outline-variant/40 hover:bg-surface-container/10 transition-colors">
                    <TableCell className="font-bold font-mono text-xs pl-6 py-4">#{user.id}</TableCell>
                    <TableCell className="py-4">
                      <div className="w-9 h-9 rounded-full border border-outline-variant overflow-hidden bg-surface-container-low flex items-center justify-center">
                        {user.avatar ? (
                          <img src={user.avatar} alt="User avatar" className="w-full h-full object-cover" />
                        ) : (
                          <UserIcon className="w-4 h-4 text-outline" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-bold text-sm text-on-surface py-4">
                      {user.lastName} {user.firstName}
                    </TableCell>
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                        <Mail className="w-3.5 h-3.5 text-outline shrink-0" />
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell className="py-4">{getStatusBadgeWrapper(user.role)}</TableCell>
                    <TableCell className="py-4">
                      <MembershipBadge tier={user.tier} size="sm" showLabel={true} />
                    </TableCell>
                    <TableCell className="font-bold font-mono text-xs pr-6 text-right py-4">
                      {formatCurrency(user.totalSpending ?? 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );

  function getStatusBadgeWrapper(role: string) {
    return getRoleBadge(role);
  }
}
