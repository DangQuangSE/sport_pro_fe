"use client";

import { useState, useEffect, useCallback } from "react";

export interface FontConfig {
  id: number;
  name: string;
  displayName: string;
}

const defaultFonts: FontConfig[] = [
  { id: 1, name: "Lexend", displayName: "Lexend (Thể thao)" },
  { id: 2, name: "Anton", displayName: "Anton (Mạnh mẽ)" },
  { id: 3, name: "Bebas Neue", displayName: "Bebas (Chuyên nghiệp)" },
  { id: 4, name: "Jockey One", displayName: "Jockey (Cổ điển)" },
  { id: 5, name: "Russo One", displayName: "Russo (Góc cạnh)" },
  { id: 6, name: "Tourney", displayName: "Tourney (Độc đáo)" },
  { id: 7, name: "Jersey 25", displayName: "Jersey 25 (Varsity)" }
];

export function useAdminFonts() {
  const [fonts, setFonts] = useState<FontConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("sport_pro_fonts");
        if (saved) {
          setFonts(JSON.parse(saved));
        } else {
          localStorage.setItem("sport_pro_fonts", JSON.stringify(defaultFonts));
          setFonts(defaultFonts);
        }
      } catch (err) {
        console.error("Failed to load local font configurations.", err);
        setFonts(defaultFonts);
      } finally {
        setIsLoading(false);
      }
    }
  }, []);

  const saveFonts = useCallback((newFonts: FontConfig[]) => {
    setFonts(newFonts);
    if (typeof window !== "undefined") {
      localStorage.setItem("sport_pro_fonts", JSON.stringify(newFonts));
    }
  }, []);

  const addFont = useCallback((data: Omit<FontConfig, "id">) => {
    const newId = fonts.length > 0 ? Math.max(...fonts.map(f => f.id)) + 1 : 1;
    const newFonts = [...fonts, { id: newId, ...data }];
    saveFonts(newFonts);
    return { success: true };
  }, [fonts, saveFonts]);

  const updateFont = useCallback((id: number, data: Omit<FontConfig, "id">) => {
    const newFonts = fonts.map(f => f.id === id ? { ...f, ...data } : f);
    saveFonts(newFonts);
    return { success: true };
  }, [fonts, saveFonts]);

  const deleteFont = useCallback((id: number) => {
    const newFonts = fonts.filter(f => f.id !== id);
    saveFonts(newFonts);
    return { success: true };
  }, [fonts, saveFonts]);

  return {
    fonts,
    isLoading,
    addFont,
    updateFont,
    deleteFont,
    saveFonts
  };
}
