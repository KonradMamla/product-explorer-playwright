import { useEffect, useRef, useState } from 'react';
import { ApiError } from '../api/client';
import { getProductById } from '../api/products';
import type { Product } from '../types/product';

interface UseProductDetailsResult {
  product: Product | null;
  loading: boolean;
  error: string | null;
}

export function useProductDetails(productId: number | null): UseProductDetailsResult {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestRequestId = useRef(0);

  useEffect(() => {
    if (productId === null) {
      setProduct(null);
      setLoading(false);
      setError(null);
      return;
    }

    const loadProduct = async () => {
      const requestId = latestRequestId.current + 1;
      latestRequestId.current = requestId;

      setLoading(true);
      setError(null);

      try {
        const response = await getProductById(productId);

        if (latestRequestId.current !== requestId) {
          return;
        }

        setProduct(response);
      } catch (error) {
        if (latestRequestId.current !== requestId) {
          return;
        }

        if (error instanceof ApiError) {
          setError(`Could not load product details (status ${error.status}).`);
        } else {
          setError('Could not load product details.');
        }
        setProduct(null);
      } finally {
        if (latestRequestId.current === requestId) {
          setLoading(false);
        }
      }
    };

    void loadProduct();
  }, [productId]);

  return {
    product,
    loading,
    error,
  };
}
