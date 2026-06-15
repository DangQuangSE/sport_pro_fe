import type { Metadata } from "next";
import { Lexend, Inter } from "next/font/google";
import "../globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";
import { ZaloFloatingButton } from "@/components/home/ZaloFloatingButton";

import { use } from "react";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (lang === "vi") {
    return {
      title: "ĐỒNG PHỤC QUANG VINH - Xưởng May Đồng Phục Uy Tín & Chất Lượng",
      description: "Đồng Phục Quang Vinh chuyên may đo, sản xuất đồng phục doanh nghiệp, đồng phục học sinh, đồ thể thao chất lượng cao với thiết kế độc quyền, uy tín.",
      openGraph: {
        title: "ĐỒNG PHỤC QUANG VINH - Xưởng May Đồng Phục Uy Tín & Chất Lượng",
        description: "May đo đồng phục doanh nghiệp, học sinh, quần áo thể thao cao cấp tại Đồng Phục Quang Vinh.",
        url: "https://www.dongphucquangvinh.com/vi",
        siteName: "Đồng Phục Quang Vinh",
        images: [
          {
            url: "/vsport.png",
            width: 800,
            height: 600,
            alt: "Đồng Phục Quang Vinh Logo",
          },
        ],
        type: "website",
      },
    };
  }
  return {
    title: "QUANG VINH UNIFORMS - Trusted Custom & Performance Apparel",
    description: "Quang Vinh Uniforms specializes in manufacturing custom corporate, school, and athletic wear with premium quality and unique designs.",
    openGraph: {
      title: "QUANG VINH UNIFORMS - Trusted Custom & Performance Apparel",
      description: "Premium custom corporate, school, and athletic uniforms by Quang Vinh Uniforms.",
      url: "https://www.dongphucquangvinh.com/en",
      siteName: "Quang Vinh Uniforms",
      images: [
        {
          url: "/vsport.png",
          width: 800,
          height: 600,
          alt: "Quang Vinh Uniforms Logo",
        },
      ],
      type: "website",
    },
  };
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = use(params);
  return (
    <html
      lang={lang}
      className={`${lexend.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            {children}
            <ZaloFloatingButton />
            <Toaster richColors position="top-right" closeButton />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
