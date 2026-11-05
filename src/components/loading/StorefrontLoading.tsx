"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import { CheckoutHeader } from "@/components/checkout/CheckoutHeader";
import { useTranslation } from "@/hooks/useTranslation";
import { PageContentSkeleton } from "./PageSkeleton";
import { CustomizerSkeleton, LoadingRegion } from "./ContentSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthLayout } from "@/components/auth/AuthLayout";

type Props = React.ComponentProps<typeof PageContentSkeleton>;

export function StorefrontLoading({ variant = "catalog" }: Props) {
  return <div className="flex min-h-screen flex-col bg-surface">
    <Navbar />
    <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 pb-20 pt-36 sm:px-8">
      <PageContentSkeleton variant={variant} />
    </main>
    <Footer />
  </div>;
}

export function CheckoutLoading() {
  const { t, locale } = useTranslation();
  return <div className="flex min-h-screen flex-col bg-surface">
    <CheckoutHeader locale={locale} backHref={`/${locale}/cart`} backLabel={t("checkout.backToCart")} securityLabel={t("checkout.security")} />
    <main className="mx-auto w-full max-w-[1280px] px-4 py-16 sm:px-8"><PageContentSkeleton variant="cart" /></main>
  </div>;
}

export default function StorefrontRouteLoading() {
  const pathname = usePathname();
  if (/\/customizer(?:\/|$)/.test(pathname)) return <CustomizerSkeleton />;
  if (/\/(login|register|forgot-password)(?:\/|$)/.test(pathname)) {
    return <AuthLayout><LoadingRegion className="w-full max-w-md space-y-6">
      <div className="space-y-6"><Skeleton className="h-10 w-2/3" /><Skeleton className="h-4 w-full" />
        <Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" />
      </div>
    </LoadingRegion></AuthLayout>;
  }
  if (/\/checkout(?:\/|$)/.test(pathname)) return <CheckoutLoading />;
  const variant = /\/product\//.test(pathname) ? "product"
    : /\/profile\/orders\/[^/]+/.test(pathname) ? "detail"
    : /\/profile\/orders/.test(pathname) ? "orders"
    : /\/profile\/addresses/.test(pathname) ? "addresses"
    : /\/profile/.test(pathname) ? "profile"
    : /\/cart/.test(pathname) ? "cart" : "catalog";
  return <StorefrontLoading variant={variant} />;
}
