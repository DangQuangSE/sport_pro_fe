import type { Metadata } from "next";
import { SEO_BRAND, canonicalUrl } from "./policy";

export type SeoLocale = "vi" | "en";

export type SeoProduct = {
  name: string;
  slug: string;
  description?: string | null;
  images?: Array<{ imageUrl: string; isThumbnail?: boolean }>;
  variants?: Array<{
    originalPrice?: number;
    salePrice?: number | null;
    stockQuantity?: number;
    status?: string;
  }>;
  averageRating?: number;
  reviewCount?: number;
  status?: string;
};

const COPY = {
  home: {
    title: `${SEO_BRAND} | Quần áo thể thao, đồng phục và in ấn`,
    description:
      "Đồng Phục Quang Vinh cung cấp quần áo nam nữ, đồ thể thao, đồng phục và dịch vụ thiết kế, in ấn theo yêu cầu trên toàn quốc.",
    path: "/vi",
  },
  products: {
    title: `Sản phẩm quần áo và đồng phục | ${SEO_BRAND}`,
    description:
      "Khám phá sản phẩm quần áo nam nữ, trang phục thể thao và đồng phục chất lượng tại Đồng Phục Quang Vinh, giao hàng toàn quốc.",
    path: "/vi/products",
  },
} as const;

function robots(locale: SeoLocale) {
  return { index: locale === "vi", follow: true };
}

export function buildStaticPageMetadata({
  locale,
  page,
  origin,
}: {
  locale: SeoLocale;
  page: keyof typeof COPY;
  origin: URL;
  searchParams?: Record<string, string | string[] | undefined>;
}): Metadata {
  const copy = COPY[page];
  const url = canonicalUrl(copy.path, origin);
  if (!url) throw new Error(`Missing canonical policy for ${page}`);
  return {
    title: copy.title,
    description: copy.description,
    alternates: { canonical: url },
    robots: robots(locale),
    openGraph: {
      title: copy.title,
      description: copy.description,
      url,
      siteName: SEO_BRAND,
      locale: "vi_VN",
      type: "website",
      images: [{ url: new URL("/vsport.png", origin).href, alt: `Logo ${SEO_BRAND}` }],
    },
  };
}

export function buildProductMetadata({
  locale,
  product,
  origin,
}: {
  locale: SeoLocale;
  product: SeoProduct;
  origin: URL;
}): Metadata {
  const url = canonicalUrl(`/vi/product/${encodeURIComponent(product.slug)}`, origin);
  if (!url) throw new Error("Product canonical could not be generated");
  const title = `${product.name} | ${SEO_BRAND}`;
  const description = product.description?.trim() ||
    `Xem thông tin ${product.name} tại ${SEO_BRAND}. Quần áo thể thao và đồng phục giao hàng toàn quốc.`;
  const image = product.images?.find((item) => item.isThumbnail)?.imageUrl ?? product.images?.[0]?.imageUrl;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: robots(locale),
    openGraph: {
      title,
      description,
      url,
      siteName: SEO_BRAND,
      locale: "vi_VN",
      type: "website",
      ...(image ? { images: [{ url: image, alt: product.name }] } : {}),
    },
  };
}
