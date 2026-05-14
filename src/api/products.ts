import { apiFetch } from './client';
import type { Product, ProductCategory, ProductsResponse } from '../types/product';

export function getProducts(query = ''): Promise<ProductsResponse> {
  const trimmed = query.trim();
  const path = trimmed
    ? `/products/search?q=${encodeURIComponent(trimmed)}&limit=12`
    : '/products?limit=12';

  return apiFetch<ProductsResponse>(path);
}

export function getProductById(productId: number): Promise<Product> {
  return apiFetch<Product>(`/products/${productId}`);
}

// TODO (candidate): wire categories into the UI.
export function getCategories(): Promise<ProductCategory[]> {
  return apiFetch<ProductCategory[]>('/products/categories');
}

// TODO (candidate): decide whether this should replace search results or be combined with them.
export function getProductsByCategory(categorySlug: string): Promise<ProductsResponse> {
  return apiFetch<ProductsResponse>(`/products/category/${encodeURIComponent(categorySlug)}`);
}
