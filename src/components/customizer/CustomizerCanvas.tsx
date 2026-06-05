"use client";

import React, { useRef } from "react";
import { ZoomIn, ZoomOut, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CustomText, CustomImage } from "@/hooks/useCustomizer";
import { useTranslation } from "@/hooks/useTranslation";

interface CustomizerCanvasProps {
  readonly texts: CustomText[];
  readonly images: CustomImage[];
  readonly viewSide: "front" | "back";
  readonly setViewSide: (side: "front" | "back") => void;
  readonly zoomLevel: number;
  readonly setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  readonly handleResetDesign: () => void;
  readonly onDragText: (id: string, deltaX: number, deltaY: number) => void;
  readonly onDragImage: (id: string, deltaX: number, deltaY: number) => void;
  readonly activeTextId: string | null;
  readonly setActiveTextId: (id: string | null) => void;
}

export default function CustomizerCanvas({
  texts,
  images,
  viewSide,
  setViewSide,
  zoomLevel,
  setZoomLevel,
  handleResetDesign,
  onDragText,
  onDragImage,
  activeTextId,
  setActiveTextId
}: CustomizerCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    id: string,
    type: "text" | "image"
  ) => {
    if (e.button !== 0) return; // only left click / primary touch
    e.preventDefault();

    let lastX = e.clientX;
    let lastY = e.clientY;

    const handlePointerMove = (moveEvent: PointerEvent) => {
      // Correct for scale factor when zoomed
      const deltaX = (moveEvent.clientX - lastX) / zoomLevel;
      const deltaY = (moveEvent.clientY - lastY) / zoomLevel;
      lastX = moveEvent.clientX;
      lastY = moveEvent.clientY;

      if (type === "text") {
        onDragText(id, deltaX, deltaY);
      } else {
        onDragImage(id, deltaX, deltaY);
      }
    };

    const handlePointerUp = () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
  };

  return (
    <section className="w-full lg:w-auto h-[260px] sm:h-[320px] lg:h-full flex-grow lg:flex-grow-[3] flex flex-col py-4 lg:py-6 relative bg-[#ededf2] rounded-2xl shadow-inner overflow-hidden border border-[#c1c6d7] items-center justify-center">
      
      {/* Zoom & Canvas controls */}
      <div className="absolute top-6 right-6 flex gap-2 z-10 bg-white p-1 rounded-xl shadow-sm border border-[#e2e2e7]">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 text-on-surface-variant hover:text-primary"
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.5))}
          title={t("product.details.zoomIn") || "Zoom In"}
        >
          <ZoomIn size={18} />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 text-on-surface-variant hover:text-primary"
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.7))}
          title={t("product.details.zoomOut") || "Zoom Out"}
        >
          <ZoomOut size={18} />
        </Button>
        <div className="w-px h-6 bg-[#e2e2e7] self-center mx-1"></div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-10 w-10 text-on-surface-variant hover:text-primary"
          onClick={handleResetDesign}
          title={t("product.details.resetDesign") || "Reset Design"}
        >
          <RotateCcw size={18} />
        </Button>
      </div>

      {/* Active Canvas Container */}
      <div 
        ref={containerRef}
        className="flex-grow flex items-center justify-center relative w-full h-full p-8"
        style={{ transform: `scale(${zoomLevel})`, transition: "transform 0.2s ease-out" }}
      >
        {/* Blank T-Shirt Box */}
        <div className="relative h-[90%] max-h-[380px] lg:max-h-[500px] aspect-[4/5] bg-white shadow-xl rounded-[2rem] border border-[#c1c6d7] flex items-center justify-center overflow-hidden">
          <img 
            src={viewSide === "front" ? "/front_shirt_mockup.png" : "/back_shirt_mockup.png"} 
            alt="Blank sports t-shirt" 
            className="w-[82%] h-auto object-contain opacity-90 drop-shadow-xl"
          />

          {/* ACTIVE LAYER OVERLAY FRAME (DRAGGABLE BOUNDS) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="border border-dashed border-primary/50 w-[42%] h-[55%] flex flex-col items-center justify-center relative pointer-events-auto bg-white/5 backdrop-blur-[0.5px]">
              
              {/* Bounding box corners visual cues */}
              <div className="absolute -top-1 -left-1 w-2 h-2 bg-white border border-primary rounded-full" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-white border border-primary rounded-full" />
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-white border border-primary rounded-full" />
              <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-white border border-primary rounded-full" />

              {/* Render Draggable Custom Texts */}
              {texts.map((t) => (
                <div
                  key={t.id}
                  className={`cursor-move absolute select-none transition-all duration-75 ${
                    activeTextId === t.id 
                      ? "border border-dashed border-[#717786]/35 px-2.5 py-1 rounded scale-105" 
                      : "hover:scale-102 hover:bg-black/5 hover:rounded px-2.5 py-1"
                  }`}
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${t.x}px), calc(-50% + ${t.y}px))`,
                    touchAction: "none"
                  }}
                  onPointerDown={(e) => {
                    setActiveTextId(t.id);
                    handlePointerDown(e, t.id, "text");
                  }}
                >
                  <span 
                    className="text-center font-black tracking-tight leading-none drop-shadow-md uppercase block whitespace-nowrap"
                    style={{
                      fontFamily: 
                        t.font === "Lexend" ? "var(--font-lexend)" :
                        t.font === "Anton" ? "var(--font-anton)" :
                        t.font === "Bebas Neue" ? "var(--font-bebas)" :
                        t.font === "Jockey One" ? "var(--font-jockey)" :
                        t.font === "Russo One" ? "var(--font-russo)" :
                        t.font === "Tourney" ? "var(--font-tourney)" :
                        t.font === "Jersey 25" ? "var(--font-jersey)" : t.font,
                      color: t.color,
                      fontSize: `${t.fontSize}px`
                    }}
                  >
                    {t.text}
                  </span>
                </div>
              ))}

              {/* Render Draggable Custom Logo Images */}
              {images.map((img) => (
                <div
                  key={img.id}
                  className="cursor-move absolute active:scale-105 transition-transform"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: `translate(calc(-50% + ${img.x}px), calc(-50% + ${img.y}px))`,
                    touchAction: "none"
                  }}
                  onPointerDown={(e) => handlePointerDown(e, img.id, "image")}
                >
                  <img 
                    src={img.src} 
                    alt="Custom logo"
                    className="object-contain drop-shadow-lg"
                    style={{ width: `${img.width}px`, height: `${img.height}px` }}
                  />
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>

      {/* View Toggles (Front/Back) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white p-1 rounded-full shadow-md border border-[#e2e2e7] flex gap-1 z-10">
        <button 
          onClick={() => setViewSide("front")}
          className={`px-5 py-2 rounded-full font-lexend font-black uppercase text-[10px] tracking-wider transition-all ${
            viewSide === "front" 
              ? "bg-primary text-white shadow-sm" 
              : "text-on-surface-variant hover:bg-[#f9f9fe]"
          }`}
        >
          Mặt trước
        </button>
        <button 
          onClick={() => setViewSide("back")}
          className={`px-5 py-2 rounded-full font-lexend font-black uppercase text-[10px] tracking-wider transition-all ${
            viewSide === "back" 
              ? "bg-primary text-white shadow-sm" 
              : "text-on-surface-variant hover:bg-[#f9f9fe]"
          }`}
        >
          Mặt sau
        </button>
      </div>
    </section>
  );
}
