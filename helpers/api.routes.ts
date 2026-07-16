export const API_ROUTES = {
  products: '/products',
  productSearch: '/products/search',
  productById: (id: number) => `/products/${id}`,
  productsByCategory: (category: string) => `/products/category/${category}`,
  categories: '/products/categories',
};
