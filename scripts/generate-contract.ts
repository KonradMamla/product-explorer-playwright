import { z } from 'zod';
import { writeFileSync, mkdirSync } from 'fs';
import { ProductsResponseSchema } from '../helpers/schemas/product.schema';

const contract = z.toJSONSchema(ProductsResponseSchema);

mkdirSync('contracts', { recursive: true });
writeFileSync('contracts/products-api.contract.json', JSON.stringify(contract, null, 2));

console.log('Contract generated: contracts/products-api.contract.json');
