import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../api/client';
import { getCategories } from '../api/products';
import type { ProductCategory } from '../types/product';

interface UseCategoriesResult {
  categories: ProductCategory[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const latestRequestId = useRef(0);

  const loadCategories = useCallback(async () => {
    const requestId = latestRequestId.current + 1;
    latestRequestId.current = requestId;

    setLoading(true);
    setError(null);

    try {
      const response = await getCategories();

      if (latestRequestId.current !== requestId) {
        return;
      }

      setCategories(response);
    } catch (error) {
      if (latestRequestId.current !== requestId) {
        return;
      }

      if (error instanceof ApiError) {
        setError(`API error: ${error.status}`);
      } else {
        setError('Unexpected error');
      }
      setCategories([]);
    } finally {
      if (latestRequestId.current === requestId) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  return {
    categories,
    loading,
    error,
    reload: loadCategories,
  };
}
