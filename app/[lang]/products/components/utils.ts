export type ColorHexMap = Record<string, string>;

export const normalizeColorName = (colorName: string): string =>
  colorName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .toLowerCase()
    .trim();

export const buildColorHexMap = (colors: Array<{ name: string; hexCode: string }>): ColorHexMap =>
  colors.reduce<ColorHexMap>((map, color) => {
    if (color.name && color.hexCode) {
      map[normalizeColorName(color.name)] = color.hexCode;
    }
    return map;
  }, {});

export const getColorHex = (colorName: string, colorHexMap: ColorHexMap = {}): string => {
  const map: Record<string, string> = {
    black: "#0D0D0D",
    white: "#F9F9F9",
    red: "#EF4444",
    blue: "#3B82F6",
    green: "#22C55E",
    grey: "#8E9196",
    gray: "#8E9196",
    orange: "#F97316",
    yellow: "#EAB308",
    navy: "#1E3A8A",
    volt: "#ADFF2F",
    purple: "#A855F7",
    pink: "#EC4899",
    brown: "#78350F"
  };
  const normalizedName = normalizeColorName(colorName);
  return colorHexMap[normalizedName] || map[normalizedName] || "#CCCCCC";
};

export const isLightColor = (hexColor: string): boolean => {
  const normalized = hexColor.replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(normalized)) return false;
  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  return (red * 299 + green * 587 + blue * 114) / 1000 > 180;
};

export const getGenderLabel = (g: string, t: any): string => {
  switch (g) {
    case "ALL": return t("catalog.all");
    case "MEN": return t("catalog.men");
    case "WOMEN": return t("catalog.women");
    case "UNISEX": return t("catalog.unisex");
    default: return g;
  }
};
