import { notFound } from "next/navigation";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import { PRODUCT_DETAILS } from "@/data/productData";

interface ProductPageProps {
  params: Promise<{
    lang: string;
    id: string;
  }>;
}

export default async function ProductPage({ params }: Readonly<ProductPageProps>) {
  const { lang, id } = await params;

  // In a real app, we would fetch product data by ID.
  // For now, we only have one mocked product.
  if (id !== PRODUCT_DETAILS.id) {
    // We could return notFound(), but to allow testing from anywhere,
    // we'll just render the mock product anyway.
  }

  const product = PRODUCT_DETAILS;

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <Navbar />

      <main className="flex-grow pt-24 pb-8 px-8 max-w-[1280px] mx-auto w-full">
        {/* Breadcrumb / Meta */}
        <div className="flex items-center gap-2 mb-6 font-bold text-[12px] text-on-surface-variant uppercase tracking-[0.08em]">
          <a href="#" className="hover:text-primary transition-colors">
            GEAR
          </a>
          <span className="text-[16px] leading-none">›</span>
          <a href="#" className="hover:text-primary transition-colors">
            FOOTWEAR
          </a>
          <span className="text-[16px] leading-none">›</span>
          <span className="text-on-surface">{product.name}</span>
        </div>

        {/* PDP Grid Setup */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          {/* Left Column: Image Gallery (Col 7) */}
          <ProductGallery
            mainImage={product.images.main}
            thumbnails={product.images.thumbnails}
            badge={product.badge}
          />

          {/* Right Column: Product Info & Actions (Col 5) */}
          <ProductInfo product={product} />
        </div>

        {/* Related Products Section */}
        <RelatedProducts />
      </main>

      <Footer />
    </div>
  );
}
