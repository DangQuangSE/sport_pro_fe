import "server-only";
import { cache } from "react";
import type { ProductDetailResponse } from "@/services/productService";

function apiOrigin(): string {
  const value = (process.env.INTERNAL_API_URL ?? process.env.NEXT_PUBLIC_API_URL)?.replace(/\/$/u, "");
  if (!value) throw new Error("NEXT_PUBLIC_API_URL is required for server product metadata");
  return value;
}

const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

function isProduct(value: unknown): value is ProductDetailResponse {
  if (!value || typeof value !== "object") return false;
  const product = value as Record<string, unknown>;
  if (
    !isNumber(product.id) ||
    typeof product.name !== "string" || !product.name.trim() ||
    typeof product.slug !== "string" || !product.slug.trim() ||
    typeof product.description !== "string" ||
    typeof product.status !== "string" ||
    !Array.isArray(product.images) ||
    !Array.isArray(product.variants)
  ) return false;

  const imagesValid = product.images.every((entry) => {
    if (!entry || typeof entry !== "object") return false;
    const image = entry as Record<string, unknown>;
    return typeof image.imageUrl === "string" && typeof image.isThumbnail === "boolean";
  });
  const variantsValid = product.variants.every((entry) => {
    if (!entry || typeof entry !== "object") return false;
    const variant = entry as Record<string, unknown>;
    return isNumber(variant.originalPrice) && (variant.salePrice === null || isNumber(variant.salePrice)) &&
      isNumber(variant.stockQuantity) && typeof variant.status === "string";
  });
  return imagesValid && variantsValid;
}

export const getPublicProductBySlug = cache(async (slug: string): Promise<ProductDetailResponse | null> => {
  const response = await fetch(`${apiOrigin()}/products/${encodeURIComponent(slug)}`, {
    next: { revalidate: 300 },
    signal: AbortSignal.timeout(5000),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Product API failed with status ${response.status}`);
  const payload: unknown = await response.json();
  const product = payload && typeof payload === "object"
    ? (payload as Record<string, unknown>).data
    : undefined;
  if (!isProduct(product) || product.status !== "ACTIVE") return null;
  return product;
});
