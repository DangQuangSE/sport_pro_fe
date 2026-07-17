import type { SeoProduct } from "./metadata";
import { SEO_BRAND } from "./policy";
import { projectProductOffer } from "../product/offer";

type JsonObject = Record<string, unknown>;

export function serializeJsonLd(value: JsonObject): string {
  return JSON.stringify(value).replace(/</gu, "\\u003c");
}

export function buildOrganizationJsonLd(origin: URL): JsonObject {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": new URL("/#organization", origin).href,
    name: SEO_BRAND,
    url: new URL("/vi", origin).href,
    logo: new URL("/vsport.png", origin).href,
  };
}

export function buildWebsiteJsonLd(origin: URL): JsonObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": new URL("/#website", origin).href,
    name: SEO_BRAND,
    url: new URL("/vi", origin).href,
  };
}

export function buildProductJsonLd({ origin, product }: { origin: URL; product: SeoProduct }): JsonObject {
  const offer = projectProductOffer(product.variants ?? []);
  const images = (product.images ?? []).map((image) => image.imageUrl).filter(Boolean);
  const value: JsonObject = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    url: new URL(`/vi/product/${encodeURIComponent(product.slug)}`, origin).href,
    ...(product.description?.trim() ? { description: product.description.trim() } : {}),
    ...(images.length ? { image: images } : {}),
  };
  if (offer) {
    value.offers = {
      "@type": "Offer",
      priceCurrency: "VND",
      price: offer.price,
      availability: `https://schema.org/${offer.inStock ? "InStock" : "OutOfStock"}`,
      url: value.url,
    };
  }
  if (
    typeof product.averageRating === "number" &&
    typeof product.reviewCount === "number" &&
    product.reviewCount > 0
  ) {
    value.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: product.averageRating,
      reviewCount: product.reviewCount,
    };
  }
  return value;
}

export function buildBreadcrumbJsonLd(origin: URL, product: SeoProduct): JsonObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: new URL("/vi", origin).href },
      { "@type": "ListItem", position: 2, name: "Sản phẩm", item: new URL("/vi/products", origin).href },
      { "@type": "ListItem", position: 3, name: product.name, item: new URL(`/vi/product/${encodeURIComponent(product.slug)}`, origin).href },
    ],
  };
}
