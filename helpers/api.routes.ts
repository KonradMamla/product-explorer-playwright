export const API_ROUTES = {
  products: '/products',
  productSearch: '/products/search',
  productsByCategory: (slug: string) => `/products/category/${slug}`,
  categories: '/products/categories',
};
