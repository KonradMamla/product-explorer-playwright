import type { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onOpenDetails: (productId: number) => void;
  onToggleFavourite: (productId: number) => void;
  isFavourite: boolean;
}

export function ProductCard({
  product,
  onOpenDetails,
  onToggleFavourite,
  isFavourite,
}: ProductCardProps) {
  return (
    <article className="product-card" data-testid={`product-card-${product.id}`}>
      <img src={product.thumbnail} alt={product.title} className="product-image" />
      <div className="product-body">
        <div className="product-heading">
          <h2>{product.title}</h2>
          <span className="price">${product.price}</span>
        </div>
        <p>{product.description}</p>
        <dl className="product-meta">
          <div>
            <dt>Category</dt>
            <dd>{product.category}</dd>
          </div>
          <div>
            <dt>Rating</dt>
            <dd>{product.rating}</dd>
          </div>
          <div>
            <dt>Stock</dt>
            <dd>{product.stock}</dd>
          </div>
        </dl>
        <div className="product-actions">
          <button
            type="button"
            data-testid={`show-details-${product.id}`}
            onClick={() => onOpenDetails(product.id)}
          >
            Show details
          </button>
          <button
            type="button"
            data-testid={`toggle-favourite-${product.id}`}
            onClick={() => onToggleFavourite(product.id)}
          >
            {isFavourite ? 'Remove from favourites' : 'Add to favourites'}
          </button>
        </div>
      </div>
    </article>
  );
}
