import type { Metadata } from "next";
import { buildStaticPageMetadata, type SeoLocale } from "@/lib/seo/metadata";
import { resolveSiteOrigin } from "@/lib/seo/policy";
import ProductsCatalogClient from "./ProductsCatalogClient";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ lang: SeoLocale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const [{ lang }, query] = await Promise.all([params, searchParams]);
  return buildStaticPageMetadata({
    locale: lang,
    page: "products",
    origin: resolveSiteOrigin(),
    searchParams: query,
  });
}

export default function ProductsCatalogPage() {
  return <ProductsCatalogClient />;
}
