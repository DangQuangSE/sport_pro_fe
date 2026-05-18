// ─── Home Page Static Data ────────────────────────────────────────────────────
// Principle: Data Decoupling — no hardcoded strings in components (§1.1)

export interface NavLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface CategoryItem {
  label: string;
  href: string;
  icon: string; // lucide icon name
  active?: boolean;
}

export interface ProductCard {
  id: string;
  category: string;
  name: string;
  price: string;
  imageUrl: string;
  imageAlt: string;
  badge?: string;
  size: "large" | "small";
}

export interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

// ── Navigation ──────────────────────────────────────────────────────────────
export const NAV_LINKS: Readonly<NavLink[]> = [
  { label: "Men", href: "#", active: true },
  { label: "Women", href: "#" },
  { label: "Running", href: "#" },
  { label: "Training", href: "#" },
  { label: "Sale", href: "#" },
];

// ── Categories ───────────────────────────────────────────────────────────────
export const CATEGORIES: Readonly<CategoryItem[]> = [
  { label: "Running", href: "#", icon: "Footprints", active: true },
  { label: "Training", href: "#", icon: "Dumbbell" },
  { label: "Basketball", href: "#", icon: "Circle" },
  { label: "Football", href: "#", icon: "Trophy" },
  { label: "Outdoor", href: "#", icon: "Mountain" },
  { label: "Sale", href: "#", icon: "Tag" },
];

// ── Products ─────────────────────────────────────────────────────────────────
export const FEATURED_PRODUCTS: Readonly<ProductCard[]> = [
  {
    id: "nike-pegasus-41",
    category: "Running",
    name: "Nike Air Zoom Pegasus 41",
    price: "3.190.000₫",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBtpUfafK5MybY1UWBhz2CjP9H6H469wbuz-CIdmhKd3vkRz2lPC__vTccnZvVung8V_QozUKkrMGDHOTvXAywvMz2m5xn-g9qyKJf0Km9-c8sONnjElQ7_Al_fibhiNHFHL5Pe6JntxVpTeIZ_fQXLfUOVlqgMno673VjQxZrSv32NPiHAumx6GA-NGs1cxjBOri5Fpb9CfrPxi4sDVqLZzMx981ofCLS9Ci03nCavU85DHmdmHA0jMD4Y9Jih25sBWVjRMTT03GI",
    imageAlt: "Nike Air Zoom Pegasus 41 running shoe — electric blue accents on light grey studio background",
    size: "large",
  },
  {
    id: "adidas-ultraboost-24",
    category: "Training",
    name: "adidas Ultraboost 24",
    price: "4.650.000₫",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB12nKnhdLNG0oT_i-lrr076K-GSODQiDMiucuet8-SfKHzgNCw6H81GRkN9e8NjsTuej4HhD7rfHzykVl4lD6jD9pcIo2hLPPpzmWqtLDpA5ROkQ3RY0lX89soHG6_yGSIRmSbNf_smRJPnPPUTm8FaLYtX8OXNRFwPvUuLSk0rb8fTktUQR57WXhxpl5zgROdN9BKK2NfgHwkQ5f-MNkfJqTLwhY13TVX-7AQP8weRDt52vY2VzLBtKp7tFxpLS9E6HkQUCLMvy4",
    imageAlt: "adidas Ultraboost 24 — electric blue Primeknit upper on white background",
    badge: "Limited Edition",
    size: "small",
  },
  {
    id: "pro-training-duffel",
    category: "Accessories",
    name: "Under Armour Project Rock Duffel",
    price: "1.590.000₫",
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBs9-MGMbxmDUVoDEKtdXjOp6_SV8XzqF-XcJUElmVAU7BlZqQ_67b__2W64N4INhx0Xa_oVUvphDGuCq_1m-jNPBP5w-DcXi2w0T-AJ62NIPggE6XaCt1wahQzaID-avXl3v3X_o6fbZiUVSUlegxiGRK9ydTJle9MpzybPEsto8Fyy3BJp3OnR3BXtpz7Xrh7yRv0E6Rsmi9nyUPt1tRq5djtc62YebEUJkwMc6UF3dOxYVXOnzcjMeu1Lr3mRiydhhtKaQu28As",
    imageAlt: "Under Armour Project Rock matte black duffel bag — studio lighting on white background",
    size: "small",
  },
];

// ── Footer ───────────────────────────────────────────────────────────────────
export const FOOTER_COLUMNS: Readonly<FooterColumn[]> = [
  {
    heading: "Shop",
    links: [
      { label: "Men's Apparel", href: "#" },
      { label: "Women's Apparel", href: "#" },
      { label: "Footwear", href: "#" },
      { label: "Accessories", href: "#" },
      { label: "Sale", href: "#" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Contact", href: "#" },
      { label: "Returns", href: "#" },
      { label: "Order Tracking", href: "#" },
      { label: "Size Guide", href: "#" },
      { label: "FAQ", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Careers", href: "#" },
    ],
  },
];

export const HERO_SHOE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC8aOsTpbjD8DRGLg9AVm-G-FRTPbc1ez3qBh1SJ4ixGuV3UUDCwlC3Aq0ocAtA1vymvlelXJ-WYxFoPXNrdF3vAvKMSB2mD_u0rl2LXuYKGVK-YApAN_5QWDxWjH_o3jrTzSLv_48oCcfq056VpRWcCExBC_0q0yRRcVp5tdsvsS1wRakXtl2WPY73lVPrXrgRiiIb-vDgsnKVHBzjngMKfS15uvSPn322jcbPpkhxaafVPDtF-sPLzXUV8hGq5TaMhTyL4Hlvy70";

export const HERO_INLINE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA7ymdubPNhE6kd-3a2Y0DGVlZNJoCcHGfW23i61I2qgcUNWpYTSRRsqT5Gb2JCoix4TTXgSZEo_fLkDsbSyszVUwpxx6fK8RjJD1Me15nH2n8B9sU-6Yob2_YXTSbKi9pH2E8AR5Qg6UZmOJFlTk6rnrjomxnqJv5N1d6rjmpUehc56M_GfXmw-l9oaiXlZZNvQPC3J4qxUfnDzRtkxc5Y4WQvF7Ci14kHMCE4ELeClakMTaZZSe-OHXW_OKBpZEkbWNT5Eq6XV6Y";

export const PROMO_BANNER_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAFYYZRkz52_lHFyasGgC4L9MeJ1fu1X27osYlGG0xcEgjzGTiijCp4fm3y7Tanj4Vo-4MWou27DfOqoopkLa7G8QGmZ2XW7Psph4DowQjUWLXp-xDGLIUXjLOt9w6DLThnCUQe2Cv9Xf_Hp0PMnj65OEygIr4yQjfBzJo8TQjkxTCWB1-XAhgkY8zrR9fRB4GUlwiYrZ78isr5ufgPh8fkZt2XKB_MQKkth7s6foakimFJoeS2D8Gt0KAlUHNiutJeXgQw8MtkBoY";
