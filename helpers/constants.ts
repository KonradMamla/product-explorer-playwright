export const BASE_URLS = {
  API: 'https://dummyjson.com',
} as const;

export const STORAGE_KEYS = {
  FAVOURITES: 'product-explorer-favourites',
} as const;

export const API_PARAMS = {
  SEARCH_QUERY_KEY: 'q',
  DEFAULT_LIMIT: 12,
} as const;

export const TESTID_PREFIXES = {
  PRODUCT_CARD: 'product-card-',
  SHOW_DETAILS: 'show-details-',
  TOGGLE_FAVOURITE: 'toggle-favourite-',
} as const;

export const ROUTE_PATTERNS = {
  PRODUCTS_API: `${BASE_URLS.API}/products*`,
} as const;
