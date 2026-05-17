import { notFound } from "next/navigation";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import RelatedProducts from "@/components/product/RelatedProducts";
import { PRODUCT_DETAILS } from "@/data/productData";
import { ProductDetailResponse } from "@/services/productService";

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

  const mockProduct: ProductDetailResponse = {
    id: 999,
    name: PRODUCT_DETAILS.name,
    slug: PRODUCT_DETAILS.id,
    description: "Experience premium comfort and unmatched style with the VaporMax Training Pro.",
    brandName: PRODUCT_DETAILS.brand,
    categoryName: "Footwear",
    gender: "UNISEX",
    images: [
      {
        id: 1,
        imageUrl: PRODUCT_DETAILS.images.main,
        isThumbnail: true,
        sortOrder: 1
      },
      ...PRODUCT_DETAILS.images.thumbnails.map((url, index) => ({
        id: index + 2,
        imageUrl: url,
        isThumbnail: false,
        sortOrder: index + 2
      }))
    ],
    variants: [
      {
        id: 101,
        sku: "VM-BLUE-8",
        size: "8",
        color: "Electric Blue",
        originalPrice: 150.00,
        salePrice: 135.00,
        stockQuantity: 10,
        status: "ACTIVE"
      },
      {
        id: 102,
        sku: "VM-BLUE-9",
        size: "9",
        color: "Electric Blue",
        originalPrice: 150.00,
        salePrice: 135.00,
        stockQuantity: 5,
        status: "ACTIVE"
      },
      {
        id: 103,
        sku: "VM-BLUE-10",
        size: "10",
        color: "Electric Blue",
        originalPrice: 150.00,
        salePrice: 135.00,
        stockQuantity: 8,
        status: "ACTIVE"
      },
      {
        id: 104,
        sku: "VM-BLUE-11",
        size: "11",
        color: "Electric Blue",
        originalPrice: 150.00,
        salePrice: 135.00,
        stockQuantity: 0,
        status: "ACTIVE"
      },
      {
        id: 105,
        sku: "VM-BLACK-8",
        size: "8",
        color: "Stealth Black",
        originalPrice: 150.00,
        salePrice: 150.00,
        stockQuantity: 12,
        status: "ACTIVE"
      },
      {
        id: 106,
        sku: "VM-BLACK-9",
        size: "9",
        color: "Stealth Black",
        originalPrice: 150.00,
        salePrice: 150.00,
        stockQuantity: 15,
        status: "ACTIVE"
      },
      {
        id: 107,
        sku: "VM-BLACK-10",
        size: "10",
        color: "Stealth Black",
        originalPrice: 150.00,
        salePrice: 150.00,
        stockQuantity: 0,
        status: "ACTIVE"
      },
      {
        id: 108,
        sku: "VM-BLACK-11",
        size: "11",
        color: "Stealth Black",
        originalPrice: 150.00,
        salePrice: 150.00,
        stockQuantity: 6,
        status: "ACTIVE"
      }
    ]
  };

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
          <span className="text-on-surface">{mockProduct.name}</span>
        </div>

        {/* PDP Grid Setup */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          {/* Left Column: Image Gallery (Col 7) */}
          <ProductGallery images={mockProduct.images} />

          {/* Right Column: Product Info & Actions (Col 5) */}
          <ProductInfo product={mockProduct} />
        </div>

        {/* Related Products Section */}
        <RelatedProducts />
      </main>

      <Footer />
    </div>
  );
}
