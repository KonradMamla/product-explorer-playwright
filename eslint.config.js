import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
  {
    ...playwright.configs['flat/recommended'],
    files: ['tests/**/*.ts', 'pages/**/*.ts', 'fixtures/**/*.ts', 'helpers/**/*.ts'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/explicit-function-return-type': 'off',
      'playwright/no-wait-for-timeout': 'error',
      'playwright/no-networkidle': 'warn',
    },
  },
];