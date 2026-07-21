import { test, expect } from '../../fixtures';
import { API_ROUTES } from '../../helpers/api.routes';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import contract from '../../contracts/products-api.contract.json' with { type: 'json' };

const ajv = new Ajv2020();
addFormats(ajv);
const validateContract = ajv.compile(contract);

test.describe('Products API — contract validation', () => {
  test('product list response conforms to the documented contract @regression', async ({
    apiContext,
  }) => {
    const response = await apiContext.get(API_ROUTES.products);
    const body = await response.json();

    const isValid = validateContract(body);

    expect(isValid, JSON.stringify(validateContract.errors, null, 2)).toBe(true);
  });
});
