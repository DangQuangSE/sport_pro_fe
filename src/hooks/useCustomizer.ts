"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiClient, ApiResponse } from "@/lib/api-client";
import { customDesignService } from "@/services/customDesignService";
import { cartService } from "@/services/cartService";
import { toast } from "sonner";

// Interfaces
export interface PrintingMaterial {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  isActive: boolean;
}

export interface PrintingPriceConfig {
  id: number;
  type: "TEXT" | "IMAGE";
  unitPrice: number;
}

export interface CustomText {
  id: string;
  text: string;
  font: string;
  color: string;
  fontSize: number;
  x: number;
  y: number;
}

export interface CustomImage {
  id: string;
  src: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const defaultMaterials: PrintingMaterial[] = [
  { id: 1, name: "In chuyển nhiệt", description: "Bền màu, phẳng mịn, phù hợp thiết kế nhiều màu sắc phức tạp.", basePrice: 30000, isActive: true },
  { id: 2, name: "Decal phản quang", description: "Màu sắc nổi bật, độ bền cao, phù hợp in tên và số áo phát sáng.", basePrice: 50000, isActive: true }
];

const defaultPriceConfigs: PrintingPriceConfig[] = [
  { id: 1, type: "TEXT", unitPrice: 10000 },
  { id: 2, type: "IMAGE", unitPrice: 25000 }
];

export function useCustomizer() {
  const router = useRouter();
  const params = useParams();
  const locale = (params?.lang as string) || "vi";

  // States
  const [materials, setMaterials] = useState<PrintingMaterial[]>([]);
  const [priceConfigs, setPriceConfigs] = useState<PrintingPriceConfig[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<PrintingMaterial | null>(null);
  const [colors, setColors] = useState<string[]>(["#0058bc", "#FF9500", "#1a1c1f", "#ffffff", "#ba1a1a", "#00b32c", "#e0007b"]);
  
  const [texts, setTexts] = useState<CustomText[]>([
    { id: "text-1", text: "SPORT PRO", font: "Lexend", color: "#0058bc", fontSize: 24, x: 0, y: -20 }
  ]);
  const [images, setImages] = useState<CustomImage[]>([]);
  
  const [inputText, setInputText] = useState("");
  const [selectedFont, setSelectedFont] = useState("Lexend");
  const [selectedColor, setSelectedColor] = useState("#0058bc");
  const [selectedFontSize, setSelectedFontSize] = useState(24);
  const [activeTextId, setActiveTextId] = useState<string | null>("text-1");
  
  const [viewSide, setViewSide] = useState<"front" | "back">("front");
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Pricing
  const productBasePrice = 850000;
  const [totalPrice, setTotalPrice] = useState(productBasePrice);
  const [printingPrice, setPrintingPrice] = useState(0);

  // Fetch configs from Backend
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const response = await apiClient.get<ApiResponse<{ 
          materials: PrintingMaterial[], 
          priceConfigs: PrintingPriceConfig[], 
          colors?: { id: number, name: string, hexCode: string, isActive?: boolean }[] 
        }>>("/public/printing/all");
        const activeMats = response.data?.materials?.filter(m => m.isActive) || [];
        setMaterials(activeMats.length > 0 ? activeMats : defaultMaterials);
        setPriceConfigs(response.data?.priceConfigs || defaultPriceConfigs);
        setSelectedMaterial(activeMats.length > 0 ? activeMats[0] : defaultMaterials[0]);

        // Load Printing Colors from Backend public payload
        if (response.data?.colors && response.data.colors.length > 0) {
          setColors(response.data.colors.map(c => c.hexCode));
        }
      } catch (err) {
        console.error("Failed to load backend printing configs, using default fallbacks.", err);
        setMaterials(defaultMaterials);
        setPriceConfigs(defaultPriceConfigs);
        setSelectedMaterial(defaultMaterials[0]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfigs();
  }, []);

  // Recalculate Printing Price
  useEffect(() => {
    if (!selectedMaterial) return;

    const textConfig = priceConfigs.find(c => c.type === "TEXT") || defaultPriceConfigs[0];
    const imageConfig = priceConfigs.find(c => c.type === "IMAGE") || defaultPriceConfigs[1];

    const materialBaseCost = selectedMaterial.basePrice;
    const textExtraCost = texts.length * textConfig.unitPrice;
    const imageExtraCost = images.length * imageConfig.unitPrice;

    const calculatedPrinting = materialBaseCost + textExtraCost + imageExtraCost;
    setPrintingPrice(calculatedPrinting);
    setTotalPrice(productBasePrice + calculatedPrinting);
  }, [selectedMaterial, texts, images, priceConfigs]);

  // Add Text Layer
  const handleAddText = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newText: CustomText = {
      id: `text-${Date.now()}`,
      text: inputText.trim().toUpperCase(),
      font: selectedFont,
      color: selectedColor,
      fontSize: selectedFontSize,
      x: 0,
      y: 10
    };

    setTexts([...texts, newText]);
    setActiveTextId(newText.id);
    setInputText("");
  };

  // Remove Text Layer
  const handleRemoveText = (id: string) => {
    setTexts(texts.filter(t => t.id !== id));
    if (activeTextId === id) {
      setActiveTextId(null);
    }
  };

  // Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const newImage: CustomImage = {
          id: `image-${Date.now()}`,
          src: event.target.result as string,
          name: file.name,
          x: 0,
          y: 40,
          width: 70,
          height: 70
        };
        setImages([...images, newImage]);
      }
    };
    reader.readAsDataURL(file);
  };

  // Remove Image Layer
  const handleRemoveImage = (id: string) => {
    setImages(images.filter(img => img.id !== id));
  };

  // Reset Design
  const handleResetDesign = () => {
    setTexts([
      { id: "text-1", text: "SPORT PRO", font: "Lexend", color: "#0058bc", fontSize: 24, x: 0, y: -20 }
    ]);
    setImages([]);
    if (materials.length > 0) {
      setSelectedMaterial(materials[0]);
    }
    setViewSide("front");
    setZoomLevel(1);
    setActiveTextId("text-1");
  };

  // Update specific text layer properties
  const handleUpdateText = (id: string, updates: Partial<CustomText>) => {
    setTexts(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const compileDesignToBlob = async (): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      canvas.width = 800;
      canvas.height = 1000;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Failed to get canvas context"));
        return;
      }

      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      bgImg.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuApAvuc8kUmi1kPVuDAo-oq_0nc-mqUK1nIR6tvQU4KX8XdymhuHs97bAa6NJgjNGVSQF26WChfvU6FHg-CPujrbgM73RaLRQlm9g7zS-7rbEMOQnW9RvZm2qhr0qezf_hhBjbWpFYXFoA94FUXFPLeyW3DsoMnShdOYvg7a3PtHyxONtqYfrfAWD3q2RsymdRhymbCyMOPNm3J1Gaa9CkGA0Ng38rcaTndLazCZ0IQaT6psrpzA8kVMXjpK-xVhJ8qTy-_IhTMo3U";
      
      bgImg.onload = async () => {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const shirtWidth = canvas.width * 0.82;
        const shirtHeight = (bgImg.height / bgImg.width) * shirtWidth;
        const shirtX = (canvas.width - shirtWidth) / 2;
        const shirtY = (canvas.height - shirtHeight) / 2;
        
        ctx.globalAlpha = 0.9;
        ctx.drawImage(bgImg, shirtX, shirtY, shirtWidth, shirtHeight);
        ctx.globalAlpha = 1.0;

        const overlayWidth = canvas.width * 0.42;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        const scaleFactor = overlayWidth / (420 * 0.42);

        // Draw Texts
        for (const t of texts) {
          ctx.save();
          ctx.font = `900 ${t.fontSize * scaleFactor}px Lexend, sans-serif`;
          ctx.fillStyle = t.color;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          const tx = centerX + (t.x * scaleFactor);
          const ty = centerY + (t.y * scaleFactor);
          
          ctx.fillText(t.text, tx, ty);
          ctx.restore();
        }

        // Draw Logos
        for (const img of images) {
          try {
            const logoImg = await new Promise<HTMLImageElement>((resLogo, rejLogo) => {
              const logo = new Image();
              logo.crossOrigin = "anonymous";
              logo.src = img.src;
              logo.onload = () => resLogo(logo);
              logo.onerror = (err) => rejLogo(err);
            });

            ctx.save();
            const imgWidth = img.width * scaleFactor;
            const imgHeight = img.height * scaleFactor;
            const ix = centerX + (img.x * scaleFactor) - (imgWidth / 2);
            const iy = centerY + (img.y * scaleFactor) - (imgHeight / 2);
            
            ctx.drawImage(logoImg, ix, iy, imgWidth, imgHeight);
            ctx.restore();
          } catch (logoErr) {
            console.error("Failed to load logo image for drawing", logoErr);
          }
        }

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Canvas conversion to Blob failed"));
          }
        }, "image/png");
      };

      bgImg.onerror = (err) => {
        reject(new Error("Failed to load background shirt image"));
      };
    });
  };

  const handleSaveDesignAndLinkToCart = async () => {
    if (!selectedMaterial) {
      throw new Error("No printing material selected");
    }

    const blob = await compileDesignToBlob();
    const file = new File([blob], "custom_design.png", { type: "image/png" });

    const designMetadata = JSON.stringify({
      texts: texts,
      images: images
    });

    const requestData = {
      materialId: selectedMaterial.id,
      numTextLines: texts.length,
      numImages: images.length,
      metadata: designMetadata
    };

    const saveRes = await customDesignService.saveDesign(file, requestData);
    const designId = saveRes.data.id;
    const designImageUrl = saveRes.data.designImageUrl;

    const cartRes = await cartService.getMyCart();
    const cartItems = cartRes.data?.items || [];
    
    const customizableItem = cartItems.find(item => item.isCustomizable ?? item.customizable);

    if (customizableItem) {
      await cartService.addOrUpdateItem({
        variantId: customizableItem.variantId,
        quantity: customizableItem.quantity,
        customDesignId: designId,
        isReplace: true
      });
    } else {
      console.warn("No customizable item found in cart. Creating fallback/local data.");
    }

    const customDesignLocalData = {
      printingPrice: printingPrice,
      materialName: selectedMaterial.name,
      designImageUrl: designImageUrl,
      textsCount: texts.length,
      imagesCount: images.length,
      customDesignId: designId
    };
    localStorage.setItem("sport_pro_custom_design", JSON.stringify(customDesignLocalData));

    return { designId, designImageUrl };
  };

  // Confirm design and redirect back to Checkout
  const handleConfirmAndReturn = () => {
    const customDesignData = {
      printingPrice: printingPrice,
      materialName: selectedMaterial?.name || "In chuyển nhiệt",
      designImageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuApAvuc8kUmi1kPVuDAo-oq_0nc-mqUK1nIR6tvQU4KX8XdymhuHs97bAa6NJgjNGVSQF26WChfvU6FHg-CPujrbgM73RaLRQlm9g7zS-7rbEMOQnW9RvZm2qhr0qezf_hhBjbWpFYXFoA94FUXFPLeyW3DsoMnShdOYvg7a3PtHyxONtqYfrfAWD3q2RsymdRhymbCyMOPNm3J1Gaa9CkGA0Ng38rcaTndLazCZ0IQaT6psrpzA8kVMXjpK-xVhJ8qTy-_IhTMo3U",
      textsCount: texts.length,
      imagesCount: images.length
    };

    localStorage.setItem("sport_pro_custom_design", JSON.stringify(customDesignData));
    router.push(`/${locale}/checkout`);
  };

  const handleDragText = (id: string, deltaX: number, deltaY: number) => {
    setTexts(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          x: Math.max(-75, Math.min(75, t.x + deltaX)),
          y: Math.max(-115, Math.min(115, t.y + deltaY))
        };
      }
      return t;
    }));
  };

  const handleDragImage = (id: string, deltaX: number, deltaY: number) => {
    setImages(prev => prev.map(img => {
      if (img.id === id) {
        return {
          ...img,
          x: Math.max(-80, Math.min(80, img.x + deltaX)),
          y: Math.max(-120, Math.min(120, img.y + deltaY))
        };
      }
      return img;
    }));
  };

  return {
    materials,
    priceConfigs,
    selectedMaterial,
    setSelectedMaterial,
    colors,
    texts,
    setTexts,
    images,
    setImages,
    inputText,
    setInputText,
    selectedFont,
    setSelectedFont,
    selectedColor,
    setSelectedColor,
    selectedFontSize,
    setSelectedFontSize,
    activeTextId,
    setActiveTextId,
    handleUpdateText,
    viewSide,
    setViewSide,
    zoomLevel,
    setZoomLevel,
    isLoading,
    totalPrice,
    printingPrice,
    handleAddText,
    handleRemoveText,
    handleImageUpload,
    handleRemoveImage,
    handleResetDesign,
    handleConfirmAndReturn,
    handleSaveDesignAndLinkToCart,
    handleDragText,
    handleDragImage
  };
}
