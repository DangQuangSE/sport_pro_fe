"use client";

import { useState, useEffect, useCallback } from "react";

export interface PrintingColor {
  id: number;
  name: string;
  hexCode: string;
}

const defaultPrintingColors: PrintingColor[] = [
  { id: 1, name: "Trắng cơ bản", hexCode: "#ffffff" },
  { id: 2, name: "Đen carbon", hexCode: "#1a1c1f" },
  { id: 3, name: "Xanh dương thể thao", hexCode: "#0058bc" },
  { id: 4, name: "Cam dạ quang", hexCode: "#FF9500" },
  { id: 5, name: "Đỏ chiến thắng", hexCode: "#ba1a1a" },
  { id: 6, name: "Xanh lá dạ quang", hexCode: "#00b32c" },
  { id: 7, name: "Hồng dạ quang", hexCode: "#e0007b" },
  { id: 8, name: "Vàng phản quang", hexCode: "#ffd700" }
];

export function useAdminPrintingColors() {
  const [colors, setColors] = useState<PrintingColor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sport_pro_printing_colors");
        if (saved) {
          setColors(JSON.parse(saved));
        } else {
          localStorage.setItem("sport_pro_printing_colors", JSON.stringify(defaultPrintingColors));
          setColors(defaultPrintingColors);
        }
      } catch (err) {
        console.error("Failed to load local printing colors.", err);
        setColors(defaultPrintingColors);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const saveColors = useCallback((newColors: PrintingColor[]) => {
    setColors(newColors);
    if (typeof window !== "undefined") {
      localStorage.setItem("sport_pro_printing_colors", JSON.stringify(newColors));
    }
  }, []);

  const createColor = useCallback(async (data: Omit<PrintingColor, "id">) => {
    const newId = colors.length > 0 ? Math.max(...colors.map(c => c.id)) + 1 : 1;
    const newColors = [...colors, { id: newId, ...data }];
    saveColors(newColors);
    return { success: true };
  }, [colors, saveColors]);

  const updateColor = useCallback(async (id: number, data: Omit<PrintingColor, "id">) => {
    const newColors = colors.map(c => c.id === id ? { ...c, ...data } : c);
    saveColors(newColors);
    return { success: true };
  }, [colors, saveColors]);

  const deleteColor = useCallback(async (id: number) => {
    const newColors = colors.filter(c => c.id !== id);
    saveColors(newColors);
    return { success: true };
  }, [colors, saveColors]);

  return {
    colors,
    isLoading,
    createColor,
    updateColor,
    deleteColor,
    saveColors
  };
}
