export interface OfferVariant {
  originalPrice?: number;
  salePrice?: number | null;
  stockQuantity?: number;
  status?: string;
}

export interface ProductOffer {
  originalPrice: number;
  price: number;
  inStock: boolean;
}

export function projectProductOffer(
  variants: OfferVariant[],
  selectedVariant?: OfferVariant,
): ProductOffer | null {
  const variant = selectedVariant?.status === "ACTIVE"
    ? selectedVariant
    : variants.find((candidate) => candidate.status === "ACTIVE");

  if (!variant || typeof variant.originalPrice !== "number" || variant.originalPrice <= 0) return null;

  return {
    originalPrice: variant.originalPrice,
    price: typeof variant.salePrice === "number" && variant.salePrice > 0
      ? variant.salePrice
      : variant.originalPrice,
    inStock: typeof variant.stockQuantity === "number" && variant.stockQuantity > 0,
  };
}
