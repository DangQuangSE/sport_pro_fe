"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";

export function LoadingRegion({ children, className }: { children: React.ReactNode; className?: string }) {
  const { t } = useTranslation();
  return <div role="status" aria-busy="true" className={className}>
    <span className="sr-only">{t("pageLoading.label")}</span>
    <div aria-hidden="true">{children}</div>
  </div>;
}

export function ProductTileSkeleton({ className }: { className?: string }) {
  return <div className={cn("overflow-hidden rounded-2xl border border-outline-variant/50 bg-surface", className)}>
    <Skeleton className="aspect-[4/5] w-full rounded-none" />
    <div className="space-y-3 p-5"><Skeleton className="h-3 w-1/3" /><Skeleton className="h-6 w-4/5" /><Skeleton className="h-6 w-1/2" /><Skeleton className="mt-4 h-10 w-full" /></div>
  </div>;
}

export function ProductGridSkeleton({ count = 4, className }: { count?: number; className?: string }) {
  return <LoadingRegion><div className={cn("grid grid-cols-2 gap-5 md:grid-cols-4", className)}>
    {Array.from({ length: count }, (_, i) => <ProductTileSkeleton key={i} />)}
  </div></LoadingRegion>;
}

export function AddressListSkeleton({ count = 2 }: { count?: number }) {
  return <LoadingRegion><div className="grid gap-5 md:grid-cols-2">
    {Array.from({ length: count }, (_, i) => <div key={i} className="space-y-4 rounded-2xl border border-outline-variant/50 p-6">
      <Skeleton className="h-5 w-1/2" /><Skeleton className="h-4 w-1/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-9 w-24" />
    </div>)}
  </div></LoadingRegion>;
}

export function ReviewsSkeleton() {
  return <LoadingRegion><div className="space-y-6 py-4">
    {Array.from({ length: 3 }, (_, i) => <div key={i} className="space-y-3 border-b border-outline-variant/50 pb-6">
      <div className="flex items-center gap-3"><Skeleton className="size-10 rounded-full" /><Skeleton className="h-4 w-32" /></div>
      <Skeleton className="h-3 w-24" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" />
    </div>)}
  </div></LoadingRegion>;
}

/** Render directly inside tbody; column count must match the table header. */
export function TableSkeletonRows({ columns, rows = 5 }: { columns: number; rows?: number }) {
  const { t } = useTranslation();
  return <>{Array.from({ length: rows }, (_, row) => <TableRow key={row}>
    {Array.from({ length: columns }, (_, col) => <TableCell key={col}>
      {row === 0 && col === 0 && <span role="status" className="sr-only">{t("pageLoading.label")}</span>}
      <Skeleton aria-hidden="true" className="h-6 w-full" />
    </TableCell>)}
  </TableRow>)}</>;
}

export function DesignPreviewSkeleton() {
  return <LoadingRegion className="p-6"><div className="grid gap-6 sm:grid-cols-2">
    <Skeleton className="aspect-square w-full" /><div className="space-y-4"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-40 w-full" /></div>
  </div></LoadingRegion>;
}

export function CustomizerSkeleton() {
  return <LoadingRegion className="min-h-screen bg-surface p-4 sm:p-8">
    <div className="mb-6 flex justify-between gap-4"><Skeleton className="h-10 w-40" /><Skeleton className="h-10 w-32" /></div>
    <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_280px]">
      <div className="space-y-4"><Skeleton className="h-8 w-3/4" /><Skeleton className="h-56 w-full" /><Skeleton className="h-36 w-full" /></div>
      <Skeleton className="aspect-square w-full" /><div className="space-y-4"><Skeleton className="h-8 w-2/3" /><Skeleton className="h-40 w-full" /><Skeleton className="h-12 w-full" /></div>
    </div>
  </LoadingRegion>;
}
