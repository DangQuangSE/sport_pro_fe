export type Step = "basic" | "variants" | "images";

export type BasicInfo = {
  name: string;
  description: string;
  categoryId: string;
  brandId: string;
  gender: string;
  status: string;
  isFeatured: boolean;
};

export type ProductVariantDraft = {
  sku: string;
  size: string;
  colorId: string;
  originalPrice: number;
  salePrice: number | null;
  stockQuantity: number;
  status: "ACTIVE" | "INACTIVE";
};
