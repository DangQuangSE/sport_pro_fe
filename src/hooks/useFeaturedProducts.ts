import { useEffect, useState } from "react";
import { productService, ProductListResponse } from "@/services/productService";

export interface UseFeaturedProductsResult {
  products: ProductListResponse[];
  isLoading: boolean;
  error: string | null;
}

export function useFeaturedProducts(): UseFeaturedProductsResult {
  const [products, setProducts] = useState<ProductListResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchFeatured() {
      try {
        setIsLoading(true);
        const response = await productService.getProducts({ isFeatured: true, size: 3 });
        if (isMounted) {
          setProducts(response.data.content || []);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to fetch featured products");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchFeatured();

    return () => {
      isMounted = false;
    };
  }, []);

  return { products, isLoading, error };
}
