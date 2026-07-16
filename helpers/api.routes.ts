export const API_ROUTES = {
  products: '/products',
  productSearch: '/products/search',
  productsByCategory: (category: string) => `/products/category/${category}`,
  categories: '/products/categories',
};
