import type { ProductCategory } from '../types/product';

interface CategoryFilterProps {
  categories: ProductCategory[];
  loading: boolean;
  selectedCategory: string;
  onChange: (category: string) => void;
}

export function CategoryFilter({
  categories,
  loading,
  selectedCategory,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <label htmlFor="category-select">Category</label>
      <select
        id="category-select"
        data-testid="category-select"
        value={selectedCategory}
        onChange={(event) => onChange(event.target.value)}
        disabled={loading}
      >
        <option value="">{loading ? 'Loading categories...' : 'All categories'}</option>
        {categories.map((category) => (
          <option key={category.slug} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
