import { expect } from '../fixtures';
import { PATTERNS } from './patterns';

export function assertValidUrl(url: string): void {
  expect(url).toMatch(PATTERNS.URL);
}

export function assertValidImageUrl(url: string): void {
  expect(url).toMatch(PATTERNS.URL);
  expect(url).toMatch(/\.(jpg|jpeg|png|webp)$/i);
}

export function assertValidProduct(product: {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}): void {
  expect(product.id).toBeGreaterThan(0);
  expect(product.title).toBeTruthy();
  expect(product.price).toBeGreaterThan(0);
  assertValidImageUrl(product.thumbnail);
}
