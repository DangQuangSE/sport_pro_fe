"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users, Loader2, Mail, User as UserIcon,
  ShieldAlert, ShieldCheck, ShieldOff, Trash2, UserX, UserCheck
} from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/adminService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import MembershipBadge from "@/components/ui/MembershipBadge";
import { useTranslation } from "@/hooks/useTranslation";

type AdminUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: "USER" | "ADMIN";
  tier: string;
  totalSpending: number;
  isActive: boolean;
};

type ConfirmState = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
};

export default function AdminUsersPage() {
  const { t, locale } = useTranslation();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    isOpen: false, title: "", message: "", onConfirm: () => {},
  });

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setIsLoading(true);
      const res = await adminService.getUsers();
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users", err);
      toast.error(t("admin.users.loadError"));
    } finally {
      setIsLoading(false);
    }
  }

  const confirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmState({ isOpen: true, title, message, onConfirm });
  };
  const closeConfirm = () => setConfirmState(prev => ({ ...prev, isOpen: false }));

  const handleToggleRole = async (user: AdminUser) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
    const message = newRole === "ADMIN" ? t("admin.users.confirmPromote") : t("admin.users.confirmDemote");
    confirm(
      t("admin.users.changeRole").replace("{email}", user.email),
      message,
      async () => {
        closeConfirm();
        setActionLoading(user.id);
        try {
          const res = await adminService.updateUserRole(user.id, newRole);
          setUsers(prev => prev.map(u => u.id === user.id ? { ...u, role: res.data.role } : u));
          toast.success(t("admin.users.roleUpdated").replace("{role}", newRole));
        } catch {
          toast.error(t("admin.users.roleUpdateError"));
        } finally {
          setActionLoading(null);
        }
      }
    );
  };

  const handleDelete = async (user: AdminUser) => {
    confirm(
      t("admin.users.deleteTitle").replace("{email}", user.email),
      t("admin.users.deleteMessage"),
      async () => {
        closeConfirm();
        setActionLoading(user.id);
        try {
          await adminService.deleteUser(user.id);
          setUsers(prev => prev.map(u => u.id === user.id ? { ...u, isActive: false } : u));
          toast.success(t("admin.users.deleteSuccess"));
        } catch {
          toast.error(t("admin.users.deleteError"));
        } finally {
          setActionLoading(null);
        }
      }
    );
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 text-on-surface-variant">
        <Loader2 size={40} className="animate-spin text-primary" />
        <p className="text-xs font-bold uppercase tracking-widest italic animate-pulse">{t("admin.users.loading")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 font-bold text-[10px] text-on-surface-variant uppercase tracking-[0.15em]">
        <Link href={`/${locale}/admin`} className="hover:text-primary transition-colors flex items-center gap-1">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
          {t("admin.users.breadcrumbs.admin")}
        </Link>
        <span className="text-[12px] leading-none">›</span>
        <span className="text-on-surface">{t("admin.users.breadcrumbs.users")}</span>
      </div>

      <div className="flex items-end justify-between">
        <h2 className="text-5xl font-black italic tracking-tighter text-on-surface uppercase leading-none font-lexend">
          {t("admin.users.title").split(" ").map((word: string, i: number, arr: string[]) => (
            i === arr.length - 1
              ? <span key={i} className="text-primary"> {word}</span>
              : <span key={i}>{word} </span>
          ))}
        </h2>
        <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest pb-1">
          {t("admin.users.count").replace("{count}", String(users.length))}
        </p>
      </div>

      <div className="bg-surface rounded-3xl border-2 border-outline-variant overflow-hidden shadow-sm">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center space-y-4 py-16">
            <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-outline">
              <Users size={24} />
            </div>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">{t("admin.users.noUsers")}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-surface-container/30">
                <TableRow className="border-b border-outline-variant/60">
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 pl-6 text-on-surface">{t("admin.users.columns.id")}</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-on-surface">{t("admin.users.columns.avatar")}</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-on-surface">{t("admin.users.columns.fullName")}</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-on-surface">{t("admin.users.columns.email")}</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-on-surface">{t("admin.users.columns.role")}</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-on-surface">{t("admin.users.columns.status")}</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-on-surface">{t("admin.users.columns.membership")}</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 text-on-surface text-right">{t("admin.users.columns.spending")}</TableHead>
                  <TableHead className="font-bold text-[10px] uppercase tracking-widest py-4 pr-6 text-on-surface text-right">{t("admin.users.columns.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => {
                  const isRowLoading = actionLoading === user.id;
                  return (
                    <TableRow
                      key={user.id}
                      className={`border-b border-outline-variant/40 transition-colors ${!user.isActive ? "opacity-50 bg-error/5" : "hover:bg-surface-container/10"}`}
                    >
                      <TableCell className="font-bold font-mono text-xs pl-6 py-4">#{user.id}</TableCell>

                      <TableCell className="py-4">
                        <div className="w-9 h-9 rounded-full border border-outline-variant overflow-hidden bg-surface-container-low flex items-center justify-center">
                          {user.avatar
                            ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                            : <UserIcon className="w-4 h-4 text-outline" />}
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

                      <TableCell className="py-4">
                        {user.role === "ADMIN" ? (
                          <Badge className="bg-rose-500/10 text-rose-500 border border-rose-500/20 shadow-none uppercase font-bold text-[9px] tracking-wider px-2 py-0.5 flex items-center gap-1 w-fit">
                            <ShieldAlert className="w-3 h-3" /> Admin
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-500/10 text-slate-500 border border-slate-500/20 shadow-none uppercase font-bold text-[9px] tracking-wider px-2 py-0.5 w-fit">
                            User
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="py-4">
                        {user.isActive ? (
                          <Badge className="bg-success/10 text-success border border-success/20 shadow-none uppercase font-bold text-[9px] tracking-wider px-2 py-0.5 flex items-center gap-1 w-fit">
                            <UserCheck className="w-3 h-3" /> {t("admin.users.status.active")}
                          </Badge>
                        ) : (
                          <Badge className="bg-error/10 text-error border border-error/20 shadow-none uppercase font-bold text-[9px] tracking-wider px-2 py-0.5 flex items-center gap-1 w-fit">
                            <UserX className="w-3 h-3" /> {t("admin.users.status.deleted")}
                          </Badge>
                        )}
                      </TableCell>

                      <TableCell className="py-4">
                        <MembershipBadge tier={user.tier} size="sm" showLabel={true} />
                      </TableCell>

                      <TableCell className="font-bold font-mono text-xs text-right py-4">
                        {formatCurrency(user.totalSpending ?? 0)}
                      </TableCell>

                      <TableCell className="py-4 pr-6">
                        <div className="flex items-center justify-end gap-1.5">
                          {isRowLoading ? (
                            <Loader2 size={16} className="animate-spin text-primary" />
                          ) : (
                            <>
                              {/* Toggle Role */}
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-xl hover:border-primary hover:text-primary transition-all"
                                title={user.role === "ADMIN" ? t("admin.users.demoteToUser") : t("admin.users.promoteToAdmin")}
                                onClick={() => handleToggleRole(user)}
                              >
                                {user.role === "ADMIN" ? <ShieldOff size={14} /> : <ShieldCheck size={14} />}
                              </Button>

                              {/* Delete */}
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 rounded-xl hover:border-error hover:text-error transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                                title={user.isActive ? t("admin.users.deleteTitle").replace("{email}", user.email) : t("admin.users.alreadyDeleted")}
                                disabled={!user.isActive}
                                onClick={() => handleDelete(user)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Modal
        isOpen={confirmState.isOpen}
        onClose={closeConfirm}
        title={confirmState.title}
        footer={
          <>
            <Button variant="outline" onClick={closeConfirm} className="rounded-xl font-bold h-10">
              {t("admin.users.cancelBtn")}
            </Button>
            <Button variant="destructive" onClick={confirmState.onConfirm} className="rounded-xl font-bold h-10 shadow-md">
              {t("admin.users.confirmBtn")}
            </Button>
          </>
        }
      >
        <p className="text-on-surface-variant font-medium text-sm leading-relaxed">{confirmState.message}</p>
      </Modal>
    </div>
  );
}
