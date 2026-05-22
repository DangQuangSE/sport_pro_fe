export const getColorHex = (colorName: string): string => {
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
  return map[colorName.toLowerCase()] || "#CCCCCC";
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
