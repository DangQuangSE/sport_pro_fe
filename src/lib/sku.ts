export function viToSlug(str: string): string {
  return str
    .toLowerCase()
    .replace(/[àáảãạăắặằẳẵâấầẩẫậ]/g, "a")
    .replace(/[èéẻẽẹêếềểễệ]/g, "e")
    .replace(/[ìíỉĩị]/g, "i")
    .replace(/[òóỏõọôốồổỗộơớờởỡợ]/g, "o")
    .replace(/[ùúủũụưứừửữự]/g, "u")
    .replace(/[ỳýỷỹỵ]/g, "y")
    .replace(/đ/g, "d")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .trim();
}

export function generateSku(brandSlug: string, categorySlug: string, colorName: string, size: string): string {
  const brandCode = brandSlug.split("-")[0].slice(0, 3).toUpperCase();
  const catCode = categorySlug.toUpperCase();
  const colorCode = colorName ? viToSlug(colorName).toUpperCase() : "";
  const sizeCode = size ? size.toUpperCase() : "";
  return [brandCode, catCode, colorCode, sizeCode].filter(Boolean).join("-");
}
