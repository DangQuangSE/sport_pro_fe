"use client";

import React from "react";
import { Layers, Type, Plus, ImageIcon, CloudUpload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PrintingMaterial, CustomText, CustomImage } from "@/hooks/useCustomizer";

interface CustomizerSidebarProps {
  readonly materials: PrintingMaterial[];
  readonly selectedMaterial: PrintingMaterial | null;
  readonly setSelectedMaterial: (m: PrintingMaterial) => void;
  readonly colors?: string[];
  readonly inputText: string;
  readonly setInputText: (t: string) => void;
  readonly selectedFont: string;
  readonly setSelectedFont: (f: string) => void;
  readonly selectedColor: string;
  readonly setSelectedColor: (c: string) => void;
  readonly selectedFontSize: number;
  readonly setSelectedFontSize: (s: number) => void;
  readonly activeTextId: string | null;
  readonly setActiveTextId: (id: string | null) => void;
  readonly handleUpdateText: (id: string, updates: Partial<CustomText>) => void;
  readonly handleAddText: (e: React.FormEvent) => void;
  readonly handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readonly texts: CustomText[];
  readonly handleRemoveText: (id: string) => void;
  readonly images: CustomImage[];
  readonly handleRemoveImage: (id: string) => void;
  readonly formatCurrency: (amt: number) => string;
}

export default function CustomizerSidebar({
  materials,
  selectedMaterial,
  setSelectedMaterial,
  colors = ["#0058bc", "#FF9500", "#1a1c1f", "#ffffff", "#ba1a1a", "#00b32c", "#e0007b"],
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
  handleAddText,
  handleImageUpload,
  texts,
  handleRemoveText,
  images,
  handleRemoveImage,
  formatCurrency
}: CustomizerSidebarProps) {
  const activeText = texts.find(t => t.id === activeTextId);

  // Dynamic Fonts Load from localStorage (shared with Admin config)
  const defaultFonts = [
    { id: 1, name: "Lexend", displayName: "Lexend (Thể thao)" },
    { id: 2, name: "Anton", displayName: "Anton (Mạnh mẽ)" },
    { id: 3, name: "Bebas Neue", displayName: "Bebas (Chuyên nghiệp)" },
    { id: 4, name: "Jockey One", displayName: "Jockey (Cổ điển)" },
    { id: 5, name: "Russo One", displayName: "Russo (Góc cạnh)" },
    { id: 6, name: "Tourney", displayName: "Tourney (Độc đáo)" },
    { id: 7, name: "Jersey 25", displayName: "Jersey 25 (Varsity)" }
  ];
  const [availableFonts, setAvailableFonts] = React.useState(defaultFonts);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sport_pro_fonts");
      if (saved) {
        try {
          setAvailableFonts(JSON.parse(saved));
        } catch (err) {
          console.error("Failed to parse local fonts, using defaults.", err);
        }
      }
    }
  }, []);

  return (
    <aside className="w-full lg:w-88 flex-shrink-0 flex flex-col gap-4 lg:gap-6 py-4 lg:py-6 px-1 lg:px-0 lg:pr-2 overflow-y-auto border-b lg:border-b-0 lg:border-r border-[#e2e2e7] flex-grow lg:flex-grow-0 h-0 lg:h-full text-left">
      <div className="space-y-1">
        <h1 className="font-lexend font-black text-2xl uppercase tracking-tight">Tùy Chỉnh Thiết Kế</h1>
        <p className="text-xs text-on-surface-variant font-medium leading-relaxed">
          Tự tay thiết kế áo thi đấu đẳng cấp cao. Tên, số áo và logo tùy chỉnh theo ý bạn.
        </p>
      </div>

      <div className="space-y-6">
        {/* 1. CHẤT LIỆU IN */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e2e7] shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#e2e2e7] pb-3">
            <Layers className="text-primary" size={16} />
            <h3 className="font-lexend font-black uppercase text-xs tracking-wider">Chất liệu in ấn</h3>
          </div>
          <div className="flex flex-col gap-3">
            {materials.map((mat) => (
              <label 
                key={mat.id}
                className={`flex items-start gap-3 p-3.5 border rounded-xl cursor-pointer transition-all ${
                  selectedMaterial?.id === mat.id 
                    ? "border-primary bg-primary/[0.02]" 
                    : "border-[#c1c6d7] hover:bg-[#f9f9fe]"
                }`}
              >
                <input 
                  type="radio" 
                  name="material"
                  className="mt-1 text-primary focus:ring-primary"
                  checked={selectedMaterial?.id === mat.id}
                  onChange={() => setSelectedMaterial(mat)}
                />
                <div>
                  <span className="font-lexend font-black text-xs uppercase tracking-tight block text-on-surface">
                    {mat.name} <span className="text-primary italic font-black">+{formatCurrency(mat.basePrice)}</span>
                  </span>
                  <span className="text-[10px] text-on-surface-variant font-medium block mt-0.5 leading-relaxed">
                    {mat.description}
                  </span>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 2. THÊM & CHỈNH SỬA VĂN BẢN */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e2e7] shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-[#e2e2e7] pb-3">
            <div className="flex items-center gap-2">
              <Type className="text-primary" size={16} />
              <h3 className="font-lexend font-black uppercase text-xs tracking-wider">
                {activeText ? "Chỉnh sửa chữ / Số" : "Thêm văn bản / Số"}
              </h3>
            </div>
            {activeText && (
              <button 
                type="button" 
                onClick={() => setActiveTextId(null)}
                className="text-[10px] font-black text-primary hover:underline uppercase tracking-tight"
              >
                + Thêm lớp mới
              </button>
            )}
          </div>
          
          {activeText ? (
            // EDITING ACTIVE LAYER
            <div className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#414755]">Nội dung lớp chữ</Label>
                <Input 
                  value={activeText.text}
                  onChange={(e) => handleUpdateText(activeText.id, { text: e.target.value.toUpperCase() })}
                  placeholder="NHẬP TÊN HOẶC SỐ ÁO..."
                  className="h-10 text-xs rounded-lg border-[#c1c6d7] focus:border-primary uppercase font-bold"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#414755]">Font chữ</Label>
                  <select 
                    value={activeText.font}
                    onChange={(e) => handleUpdateText(activeText.id, { font: e.target.value })}
                    className="w-full h-10 px-3 rounded-lg border border-[#c1c6d7] bg-white text-xs font-bold font-lexend focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  >
                    {availableFonts.map(f => (
                      <option key={f.id} value={f.name}>{f.displayName}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#414755]">Màu sắc in</Label>
                  <div className="flex flex-wrap gap-2.5 items-center">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-7 h-7 rounded-full border border-[#c1c6d7] transition-all shrink-0 relative ${
                          activeText.color === color 
                            ? "ring-2 ring-primary ring-offset-1 scale-110 shadow-sm" 
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleUpdateText(activeText.id, { color })}
                        title={color}
                      >
                        {color === "#ffffff" && <div className="absolute inset-0.5 rounded-full border border-[#e2e2e7]" />}
                      </button>
                    ))}
                    
                    {/* Custom Color picker swatch */}
                    <div 
                      className={`relative w-7 h-7 rounded-full border border-[#c1c6d7] transition-all shrink-0 cursor-pointer overflow-hidden ${
                        !colors.includes(activeText.color)
                          ? "ring-2 ring-primary ring-offset-1 scale-110 shadow-sm" 
                          : "hover:scale-105"
                      }`}
                      style={{ 
                        background: !colors.includes(activeText.color)
                          ? activeText.color
                          : "linear-gradient(135deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)"
                      }}
                      title="Chọn màu tùy chỉnh"
                    >
                      <input 
                        type="color" 
                        value={activeText.color}
                        onChange={(e) => handleUpdateText(activeText.id, { color: e.target.value })}
                        className="absolute inset-0 w-full h-full scale-150 cursor-pointer opacity-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* FONT SIZE SLIDER */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#414755]">Cỡ chữ</Label>
                  <span className="text-[10px] font-mono font-bold bg-[#f3f3f8] px-1.5 py-0.5 rounded border border-[#e2e2e7]">{activeText.fontSize}px</span>
                </div>
                <input 
                  type="range"
                  min="14"
                  max="64"
                  value={activeText.fontSize}
                  onChange={(e) => handleUpdateText(activeText.id, { fontSize: parseInt(e.target.value) })}
                  className="w-full h-1.5 bg-[#ededf2] rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          ) : (
            // ADDING NEW LAYER
            <form onSubmit={handleAddText} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-[10px] font-black uppercase tracking-widest text-[#414755]">Nội dung in thêm</Label>
                <Input 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="NHẬP TÊN HOẶC SỐ ÁO..."
                  className="h-10 text-xs rounded-lg border-[#c1c6d7] focus:border-primary uppercase font-bold"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#414755]">Font chữ</Label>
                  <select 
                    value={selectedFont}
                    onChange={(e) => setSelectedFont(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-[#c1c6d7] bg-white text-xs font-bold font-lexend focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  >
                    {availableFonts.map(f => (
                      <option key={f.id} value={f.name}>{f.displayName}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#414755]">Màu sắc in</Label>
                  <div className="flex flex-wrap gap-2.5 items-center">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-7 h-7 rounded-full border border-[#c1c6d7] transition-all shrink-0 relative ${
                          selectedColor === color 
                            ? "ring-2 ring-primary ring-offset-1 scale-110 shadow-sm" 
                            : "hover:scale-105"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                      >
                        {color === "#ffffff" && <div className="absolute inset-0.5 rounded-full border border-[#e2e2e7]" />}
                      </button>
                    ))}
                    
                    {/* Custom Color picker swatch */}
                    <div 
                      className={`relative w-7 h-7 rounded-full border border-[#c1c6d7] transition-all shrink-0 cursor-pointer overflow-hidden ${
                        !colors.includes(selectedColor)
                          ? "ring-2 ring-primary ring-offset-1 scale-110 shadow-sm" 
                          : "hover:scale-105"
                      }`}
                      style={{ 
                        background: !colors.includes(selectedColor)
                          ? selectedColor
                          : "linear-gradient(135deg, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)"
                      }}
                      title="Chọn màu tùy chỉnh"
                    >
                      <input 
                        type="color" 
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="absolute inset-0 w-full h-full scale-150 cursor-pointer opacity-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* FONT SIZE SLIDER */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-[#414755]">Cỡ chữ</Label>
                  <span className="text-[10px] font-mono font-bold bg-[#f3f3f8] px-1.5 py-0.5 rounded border border-[#e2e2e7]">{selectedFontSize}px</span>
                </div>
                <input 
                  type="range"
                  min="14"
                  max="64"
                  value={selectedFontSize}
                  onChange={(e) => setSelectedFontSize(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-[#ededf2] rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <Button 
                type="submit"
                variant="outline"
                className="w-full h-11 border-2 border-outline-variant text-xs font-black uppercase tracking-widest rounded-lg flex items-center justify-center gap-1.5"
              >
                <Plus size={14} /> Thêm lớp chữ
              </Button>
            </form>
          )}
        </div>

        {/* 3. THÊM LOGO / HÌNH ẢNH */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e2e7] shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-[#e2e2e7] pb-3">
            <ImageIcon className="text-primary" size={16} />
            <h3 className="font-lexend font-black uppercase text-xs tracking-wider">Tải lên Logo của bạn</h3>
          </div>

          <div className="relative border-2 border-dashed border-[#c1c6d7] hover:border-primary rounded-xl p-6 flex flex-col items-center justify-center text-center bg-[#f9f9fe] hover:bg-primary/[0.01] transition-all cursor-pointer group">
            <input 
              type="file" 
              accept="image/*"
              onChange={handleImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <CloudUpload size={28} className="text-[#717786] group-hover:text-primary mb-2 transition-colors animate-bounce" />
            <p className="font-lexend font-bold text-xs uppercase tracking-wider text-on-surface">Nhấn để tải ảnh lên</p>
            <p className="text-[10px] text-on-surface-variant mt-1 leading-relaxed">PNG, JPG, SVG (Tối đa 5MB)</p>
          </div>
        </div>

        {/* 4. ACTIVE LAYERS LIST */}
        {(texts.length > 0 || images.length > 0) && (
          <div className="bg-white p-5 rounded-2xl border border-[#e2e2e7] shadow-sm space-y-3">
            <h4 className="font-lexend font-black uppercase text-[10px] tracking-wider text-on-surface-variant">Lớp thiết kế hoạt động</h4>
            <div className="space-y-2">
              {texts.map((t) => (
                <div 
                  key={t.id} 
                  onClick={() => setActiveTextId(t.id)}
                  className={`flex justify-between items-center p-2.5 rounded-lg border transition-all cursor-pointer ${
                    activeTextId === t.id 
                      ? "border-primary bg-primary/[0.03] shadow-sm" 
                      : "border-[#e2e2e7] bg-[#f9f9fe] hover:border-[#c1c6d7]"
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <Type size={14} className={activeTextId === t.id ? "text-primary shrink-0" : "text-[#717786] shrink-0"} />
                    <span className="font-lexend text-xs font-bold truncate tracking-tight">{t.text}</span>
                    <span className="text-[8px] font-bold font-mono px-1 rounded bg-[#e8e8ed] text-on-surface-variant shrink-0 truncate">{t.font} | {t.fontSize}px</span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveText(t.id);
                    }}
                    className="text-[#717786] hover:text-error transition-colors ml-2 shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
              {images.map((img) => (
                <div key={img.id} className="flex justify-between items-center bg-[#f9f9fe] p-2.5 rounded-lg border border-[#e2e2e7]">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <ImageIcon size={14} className="text-primary shrink-0" />
                    <span className="font-mono text-xs font-bold line-clamp-1 truncate">{img.name}</span>
                  </div>
                  <button 
                    onClick={() => handleRemoveImage(img.id)}
                    className="text-[#717786] hover:text-error transition-colors shrink-0 ml-2"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
