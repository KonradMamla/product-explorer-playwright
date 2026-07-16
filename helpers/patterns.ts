export const PATTERNS = {
  // Validates full URL format: must start with http:// or https://
  URL: /^https?:\/\//,

  // Matches product detail endpoint: /products/{id} where id is a positive integer
  PRODUCT_ENDPOINT: /\/products\/\d+$/,

  // Extracts first integer from a string
  FIRST_NUMBER: /\d+/,
} as const;
