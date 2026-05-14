import { useEffect, useMemo, useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { ProductGrid } from './components/ProductGrid';
import { ProductDetailsModal } from './components/ProductDetailsModal';
import { ErrorState } from './components/ErrorState';
import { useCategories } from './hooks/useCategories';
import { useProductDetails } from './hooks/useProductDetails';
import { useProducts } from './hooks/useProducts';

const FAVOURITES_STORAGE_KEY = 'product-explorer-favourites';

function getInitialFavourites(): number[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(FAVOURITES_STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter((value): value is number => typeof value === 'number');
  } catch {
    return [];
  }
}

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [favourites, setFavourites] = useState<number[]>(getInitialFavourites);

  const { products, loading, error, reload } = useProducts({
    searchTerm,
    selectedCategory,
  });
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    reload: reloadCategories,
  } = useCategories();
  const {
    product: selectedProduct,
    loading: detailsLoading,
    error: detailsError,
  } = useProductDetails(selectedProductId);

  useEffect(() => {
    window.localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favourites));
  }, [favourites]);

  const favouriteProducts = useMemo(
    () => products.filter((product) => favourites.includes(product.id)),
    [favourites, products],
  );

  const toggleFavourite = (productId: number) => {
    setFavourites((current) =>
      current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId],
    );
  };

  const hasActiveFilters = searchTerm.trim().length > 0 || selectedCategory.length > 0;

  return (
    <main className="page-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Recruitment task app</p>
          <h1>Product Explorer</h1>
          <p className="hero-copy">
            Explore products, filter by category, inspect product details and save your
            favourites. The application is complete on the frontend side and ready to be
            covered with Cypress tests.
          </p>
        </div>
        <div className="favourites-badge" data-testid="favourites-count">
          Favourites: <strong>{favourites.length}</strong>
        </div>
      </header>

      <section className="toolbar">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
        <CategoryFilter
          categories={categories}
          loading={categoriesLoading}
          selectedCategory={selectedCategory}
          onChange={setSelectedCategory}
        />
      </section>

      {categoriesError && (
        <section className="inline-alert" data-testid="categories-error">
          <p>Could not load categories: {categoriesError}</p>
          <button type="button" onClick={() => void reloadCategories()}>
            Retry categories
          </button>
        </section>
      )}

      <section className="hint-box" data-testid="app-capabilities">
        <h2>What you can test</h2>
        <ul>
          <li>Search products and combine search with category filtering.</li>
          <li>Open product details and verify loading, success and error states.</li>
          <li>Add and remove favourites, then verify persistence after reload.</li>
        </ul>
      </section>

      {loading && <p data-testid="loading-state">Loading products...</p>}

      {!loading && error && <ErrorState message={error} onRetry={() => void reload()} />}

      {!loading && !error && (
        <>
          <div className="results-summary" data-testid="results-summary">
            <p>
              Showing <strong>{products.length}</strong> product{products.length === 1 ? '' : 's'}
              {selectedCategory ? (
                <>
                  {' '}
                  in <strong>{selectedCategory}</strong>
                </>
              ) : null}
              {searchTerm.trim() ? (
                <>
                  {' '}
                  for <strong>“{searchTerm.trim()}”</strong>
                </>
              ) : null}
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                className="text-button"
                data-testid="clear-filters-button"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                }}
              >
                Clear filters
              </button>
            )}
          </div>

          <ProductGrid
            products={products}
            favourites={favourites}
            onOpenDetails={setSelectedProductId}
            onToggleFavourite={toggleFavourite}
          />

          {favouriteProducts.length > 0 && (
            <section className="saved-section" data-testid="favourites-preview">
              <h2>Favourite products in current results</h2>
              <ul>
                {favouriteProducts.map((product) => (
                  <li key={product.id}>{product.title}</li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <ProductDetailsModal
        open={selectedProductId !== null}
        loading={detailsLoading}
        error={detailsError}
        product={selectedProduct}
        onClose={() => setSelectedProductId(null)}
      />
    </main>
  );
}

export default App;
