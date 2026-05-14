import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../api/client';
import { getProducts, getProductsByCategory } from '../api/products';
import type { Product } from '../types/product';

interface UseProductsOptions {
  searchTerm: string;
  selectedCategory: string;
}

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

function matchesSearchTerm(product: Product, searchTerm: string): boolean {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return [product.title, product.description, product.brand, product.category]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLowerCase().includes(normalizedSearch));
}

export function useProducts({ searchTerm, selectedCategory }: UseProductsOptions): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestRequestId = useRef(0);

  const loadProducts = useCallback(async () => {
    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;

    setLoading(true);
    setError(null);

    try {
      const response = selectedCategory
        ? await getProductsByCategory(selectedCategory)
        : await getProducts(searchTerm);

      if (latestRequestId.current !== requestId) {
        return;
      }

      const nextProducts = selectedCategory
        ? response.products.filter((product) => matchesSearchTerm(product, searchTerm))
        : response.products;

      setProducts(nextProducts);
    } catch (error) {
      if (latestRequestId.current !== requestId) {
        return;
      }

      if (error instanceof ApiError) {
        setError(`API error: ${error.status}`);
      } else {
        setError('Unexpected error');
      }
      setProducts([]);
    } finally {
      if (latestRequestId.current === requestId) {
        setLoading(false);
      }
    }
  }, [searchTerm, selectedCategory]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  return {
    products,
    loading,
    error,
    reload: loadProducts,
  };
}
