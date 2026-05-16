export const API_ROUTES = {
  products: '/products',
  productSearch: '/products/search',
  productById: /\/products\/\d+$/,
  productsByCategory: (slug: string) => `/products/category/${slug}`,
  categories: '/products/categories',
};
