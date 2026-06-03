"use client";

import React, { useEffect } from "react";
import { useAuthContext } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import LanguageToggle from "@/components/ui/LanguageToggle";
import Sidebar from "@/components/admin/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoggedIn, isLoading } = useAuthContext();
  const router = useRouter();
  const params = useParams();
  const lang = params.lang as string;
  const { t } = useTranslation();

  useEffect(() => {
    if (!isLoading) {
      if (!isLoggedIn) {
        router.push(`/${lang}/login`);
      } else if (user?.role !== "ADMIN") {
        router.push(`/${lang}`);
      }
    }
  }, [isLoading, isLoggedIn, user, router, lang]);

  if (isLoading || !isLoggedIn || user?.role !== "ADMIN") {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface">
        <div className="space-y-4 w-full max-w-md px-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-10 w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-grow flex flex-col min-w-0">
        <header className="h-20 border-b border-outline-variant bg-surface sticky top-0 z-10 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-on-surface capitalize">
            {t("admin.title") || "Admin Management"}
          </h1>
          <div className="flex items-center gap-6">
            <LanguageToggle />
            <div className="text-right">
              <p className="text-sm font-medium text-on-surface">{user.email}</p>
              <p className="text-xs text-on-surface-variant uppercase tracking-wider">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
              {user.email.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>
        <main className="flex-grow p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
