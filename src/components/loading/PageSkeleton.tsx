"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";
import { ProductTileSkeleton, AddressListSkeleton } from "./ContentSkeleton";

type Variant = "catalog" | "product" | "profile" | "cart" | "orders" | "detail" | "addresses" | "dashboard" | "table";

function FormSkeleton() {
  return <div className="space-y-6 rounded-2xl border border-outline-variant/50 p-6">
    <Skeleton className="h-6 w-1/2" />
    {Array.from({ length: 4 }, (_, i) => <div key={i} className="space-y-2">
      <Skeleton className="h-3 w-1/4" /><Skeleton className="h-11 w-full" />
    </div>)}
  </div>;
}

function ListSkeleton() {
  return <div className="space-y-4">
    {Array.from({ length: 3 }, (_, i) => <div key={i} className="flex gap-4 rounded-2xl border border-outline-variant/50 p-5">
      <Skeleton className="h-24 w-24 shrink-0" />
      <div className="flex-1 space-y-4"><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-5 w-1/3" /></div>
    </div>)}
  </div>;
}

export function PageContentSkeleton({ variant = "catalog" }: { variant?: Variant }) {
  const { t } = useTranslation();
  return <div role="status" aria-live="polite" aria-busy="true" className="w-full space-y-8" data-page-skeleton={variant}>
    <span className="sr-only">{t("pageLoading.label")}</span>
    <div aria-hidden="true" className="space-y-8">
      <div className="space-y-3"><Skeleton className="h-3 w-32" /><Skeleton className="h-9 w-2/3 max-w-sm" /><Skeleton className="h-4 w-3/4 max-w-lg" /></div>
      {variant === "catalog" ? <div className="flex gap-8">
        <div className="hidden w-56 shrink-0 space-y-6 lg:block"><FormSkeleton /></div>
        <div className="flex-1 space-y-5"><Skeleton className="h-11 w-full" />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => <ProductTileSkeleton key={i} />)}
          </div>
        </div>
      </div> : variant === "product" ? <div className="grid gap-8 lg:grid-cols-2">
        <Skeleton className="aspect-square w-full" /><FormSkeleton />
      </div> : variant === "profile" ? <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6"><Skeleton className="h-72 w-full rounded-3xl" /><Skeleton className="h-52 w-full rounded-2xl" /></div><FormSkeleton />
      </div> : variant === "cart" || variant === "detail" ? <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        <ListSkeleton /><FormSkeleton />
      </div> : variant === "addresses" ? <AddressListSkeleton /> : variant === "orders" ? <ListSkeleton />
      : variant === "dashboard" ? <><div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-28 w-full" />)}</div><Skeleton className="h-80 w-full" /></>
      : <div className="space-y-4"><Skeleton className="h-11 w-full max-w-sm" /><div className="overflow-hidden rounded-2xl border border-outline-variant/50 p-5"><Skeleton className="mb-6 h-8 w-full" />{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="mb-4 h-10 w-full" />)}</div></div>}
    </div>
  </div>;
}
