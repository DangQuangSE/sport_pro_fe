import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildProductMetadata, type SeoLocale } from "@/lib/seo/metadata";
import { buildBreadcrumbJsonLd, buildProductJsonLd } from "@/lib/seo/json-ld";
import { resolveSiteOrigin } from "@/lib/seo/policy";
import { getPublicProductBySlug } from "@/server/products";
import ProductDetailClient from "./ProductDetailClient";

type ProductRouteProps = {
  params: Promise<{ lang: SeoLocale; slug: string }>;
};

export async function generateMetadata({ params }: ProductRouteProps): Promise<Metadata> {
  const { lang, slug } = await params;
  try {
    const product = await getPublicProductBySlug(slug);
    if (!product) return { robots: { index: false, follow: true } };
    return buildProductMetadata({ locale: lang, product, origin: resolveSiteOrigin() });
  } catch {
    return { robots: { index: false, follow: true } };
  }
}

export default async function ProductDetailPage({ params }: ProductRouteProps) {
  const { slug } = await params;
  try {
    const product = await getPublicProductBySlug(slug);
    if (!product) notFound();
    const origin = resolveSiteOrigin();
    return (
      <>
        <JsonLd value={buildBreadcrumbJsonLd(origin, product)} />
        <JsonLd value={buildProductJsonLd({ origin, product })} />
        <ProductDetailClient initialProduct={product} />
      </>
    );
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error) throw error;
    return <ProductDetailClient />;
  }
}
