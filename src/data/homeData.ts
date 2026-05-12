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
export const CATEGORIES: Readonly<CategoryItem[]> = [];

// ── Products ─────────────────────────────────────────────────────────────────
export const FEATURED_PRODUCTS: Readonly<ProductCard[]> = [];


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
