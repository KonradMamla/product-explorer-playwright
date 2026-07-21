import { z } from 'zod';

export const ProductSchema = z
  .object({
    id: z.number().positive(),
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    price: z.number().positive(),
    rating: z.number().min(0).max(5),
    stock: z.number().min(0),
    brand: z.string().optional(),
    thumbnail: z.string().url(),
    images: z.array(z.string().url()).optional(),
  })
  .loose();

export const ProductsResponseSchema = z.object({
  products: z.array(ProductSchema),
  total: z.number().nonnegative(),
  skip: z.number().nonnegative(),
  limit: z.number().positive(),
});

export const ProductCategorySchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  url: z.string().url(),
});
