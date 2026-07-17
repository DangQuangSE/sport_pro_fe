import { Inter, Lexend } from "next/font/google";
import { use } from "react";
import "../globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";
import { ZaloFloatingButton } from "@/components/home/ZaloFloatingButton";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "@/lib/seo/json-ld";
import { resolveSiteOrigin, SUPPORTED_LOCALES } from "@/lib/seo/policy";
import { notFound } from "next/navigation";

const lexend = Lexend({ variable: "--font-lexend", subsets: ["latin"] });
const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = use(params);
  if (!SUPPORTED_LOCALES.some((locale) => locale === lang)) notFound();
  const origin = resolveSiteOrigin();

  return (
    <html lang={lang} className={`${lexend.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <JsonLd value={buildOrganizationJsonLd(origin)} />
        <JsonLd value={buildWebsiteJsonLd(origin)} />
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
