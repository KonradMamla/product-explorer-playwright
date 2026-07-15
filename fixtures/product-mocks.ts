import type { ProductsResponse, Product } from '../src/types/product';

export const MOCK_PRODUCTS: ProductsResponse = {
  products: [
    {
      id: 1,
      title: 'iPhone 14',
      description: 'An apple mobile which is nothing like apple',
      category: 'smartphones',
      price: 999,
      rating: 4.5,
      stock: 10,
      brand: 'Apple',
      thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
      images: ['https://cdn.dummyjson.com/product-images/1/1.jpg'],
    },
    {
      id: 2,
      title: 'Samsung Galaxy S22',
      description: 'Samsung Galaxy S22 is the latest flagship phone',
      category: 'smartphones',
      price: 799,
      rating: 4.3,
      stock: 5,
      brand: 'Samsung',
      thumbnail: 'https://cdn.dummyjson.com/product-images/2/thumbnail.jpg',
      images: ['https://cdn.dummyjson.com/product-images/2/1.jpg'],
    },
    {
      id: 3,
      title: 'OPPOF19',
      description: 'OPPO F19 is officially announced on April 2021',
      category: 'smartphones',
      price: 280,
      rating: 4.3,
      stock: 123,
      brand: 'OPPO',
      thumbnail: 'https://cdn.dummyjson.com/product-images/3/thumbnail.jpg',
      images: ['https://cdn.dummyjson.com/product-images/3/1.jpg'],
    },
  ],
  total: 3,
  skip: 0,
  limit: 3,
};

export const MOCK_PRODUCT_DETAILS: Product = {
  id: 1,
  title: 'iPhone 14',
  description: 'An apple mobile which is nothing like apple',
  category: 'smartphones',
  price: 999,
  rating: 4.5,
  stock: 10,
  brand: 'Apple',
  thumbnail: 'https://cdn.dummyjson.com/product-images/1/thumbnail.jpg',
  images: ['https://cdn.dummyjson.com/product-images/1/1.jpg'],
};
