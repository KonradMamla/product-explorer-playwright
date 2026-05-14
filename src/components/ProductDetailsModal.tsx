import type { Product } from '../types/product';

interface ProductDetailsModalProps {
  open: boolean;
  loading: boolean;
  error: string | null;
  product: Product | null;
  onClose: () => void;
}

export function ProductDetailsModal({
  open,
  loading,
  error,
  product,
  onClose,
}: ProductDetailsModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-overlay" data-testid="product-details-modal" role="presentation">
      <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 id="modal-title">Product details</h2>
          <button className="close-button" data-testid="close-details-modal" type="button" onClick={onClose}>
            Close
          </button>
        </div>

        {loading ? <p data-testid="details-loading">Loading details...</p> : null}

        {!loading && error ? (
          <div className="inline-alert" data-testid="details-error">
            <p>{error}</p>
          </div>
        ) : null}

        {!loading && !error && product ? (
          <div className="product-details" data-testid="details-content">
            <img
              src={product.images?.[0] ?? product.thumbnail}
              alt={product.title}
              className="product-details-image"
            />
            <div>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <dl className="product-meta details-meta">
                <div>
                  <dt>Category</dt>
                  <dd>{product.category}</dd>
                </div>
                <div>
                  <dt>Brand</dt>
                  <dd>{product.brand ?? 'Unknown'}</dd>
                </div>
                <div>
                  <dt>Price</dt>
                  <dd>${product.price}</dd>
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
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
