import type { Product } from '../types/product';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  favourites: number[];
  onOpenDetails: (productId: number) => void;
  onToggleFavourite: (productId: number) => void;
}

export function ProductGrid({
  products,
  favourites,
  onOpenDetails,
  onToggleFavourite,
}: ProductGridProps) {
  if (products.length === 0) {
    return <p data-testid="empty-state">No products found.</p>;
  }

  return (
    <section className="product-grid" data-testid="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          isFavourite={favourites.includes(product.id)}
          onOpenDetails={onOpenDetails}
          onToggleFavourite={onToggleFavourite}
        />
      ))}
    </section>
  );
}
