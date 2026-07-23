# Product Explorer — Playwright Test Suite

[![Playwright Tests](https://github.com/KonradMamla/product-explorer-playwright/actions/workflows/playwright.yml/badge.svg)](https://github.com/KonradMamla/product-explorer-playwright/actions/workflows/playwright.yml)

A comprehensive test suite for the **Product Explorer** React application, built to demonstrate real-world Playwright usage across multiple testing layers.

## Test coverage

| Layer                 | What's tested                                                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **E2E**               | Search, category filtering, favorites persistence, multi-tab & multi-user isolation, error handling (network mocking), accessibility (axe-core) |
| **API**               | DummyJSON endpoints — response schema, status codes, error handling, Zod schema validation, formal contract testing (JSON Schema + Ajv)         |
| **Component**         | Isolated React component rendering and interaction (SearchBar, CategoryFilter, ProductCard)                                                     |
| **Visual regression** | UI consistency across code changes, using mocked deterministic data                                                                             |

## Tech stack

- [Playwright](https://playwright.dev/) — test runner, assertions, browser automation
- [TypeScript](https://www.typescriptlang.org/) — strict mode throughout
- React + Vite — application under test
- GitHub Actions — CI pipeline

## Project structure

```
tests/
├── e2e/                       # Full browser UI flows
│   ├── search.spec.ts
│   ├── categories.spec.ts
│   ├── favorites.spec.ts
│   ├── multi-tab.spec.ts      # shared context + isolated context scenarios
│   ├── error-handling.spec.ts # network mocking via page.route()
│   └── accessibility.spec.ts  # axe-core WCAG scans
├── api/                       # HTTP-level tests via Playwright request context
│   ├── products.spec.ts
│   ├── categories.spec.ts
│   ├── products-schema.spec.ts    # Zod schema validation
│   └── products-contract.spec.ts  # JSON Schema contract validation (Ajv)
└── visual/                    # Screenshot regression tests (mocked data)

src/components/__tests__/      # Component tests (CT runner)
├── SearchBar.spec.tsx
├── CategoryFilter.spec.tsx
└── ProductCard.spec.tsx

pages/                         # Page Object Model
├── BasePage.ts
├── ProductListPage.ts
└── ProductModalPage.ts

fixtures/                      # Custom Playwright fixtures + mock data
├── index.ts
└── product-mocks.ts

helpers/                       # Shared utilities
├── api.routes.ts              # API URL patterns
├── constants.ts                # Technical constants
├── patterns.ts                 # Regex patterns
├── test-data.ts                 # Business test data
├── assertions.ts                # Reusable custom assertions
└── schemas/
    └── product.schema.ts        # Zod schemas

scripts/
└── generate-contract.ts       # Generates JSON Schema contract from Zod

contracts/
└── products-api.contract.json # Versioned API contract (generated)

Dockerfile                     # Linux/CI environment parity
.dockerignore

.github/workflows/
└── playwright.yml             # CI: smoke on push, sharded regression on PR/nightly, component tests
```

## Running tests

Install dependencies and browsers:

```bash
npm install
npx playwright install
```

Run all E2E, API and visual tests:

```bash
npx playwright test
```

Run component tests:

```bash
npx playwright test -c playwright-ct.config.ts
```

Run specific browser only:

```bash
npx playwright test --project=chromium
```

Run with UI mode (recommended for local development):

```bash
npx playwright test --ui
```

Open HTML report after test run:

```bash
npx playwright show-report
```

Generate the API contract from the current Zod schema:

```bash
npm run generate:contract
```

Run tests inside Docker (Linux environment matching CI):

```bash
docker build -t product-explorer-tests .
docker run --rm product-explorer-tests              # fast local check (workers: 50%)
docker run --rm -e CI=true product-explorer-tests    # faithful CI reproduction (workers: 1)
```

## CI/CD

| Trigger                | Job(s)                                     | Scope                                                    |
| ---------------------- | ------------------------------------------ | -------------------------------------------------------- |
| Push to `main`         | Smoke Tests                                | `@smoke` tag, Chromium only (~15 min)                    |
| Pull Request to `main` | Regression (3 parallel shards) + Component | Full suite, all browsers, sharded for speed (~20–30 min) |
| Nightly (2:00 UTC)     | Regression (3 parallel shards) + Component | Full suite + email alert on failure                      |

Update visual regression baselines locally before committing:

```bash
npx playwright test tests/visual/ --update-snapshots
```

## Key Playwright features demonstrated

- **Multi-browser** — Chromium, Firefox, WebKit, Pixel 5, iPhone 13
- **API testing** — via `request` context, no browser overhead
- **Component testing** — isolated rendering with `@playwright/experimental-ct-react`
- **Visual regression** — `toHaveScreenshot()` with mocked data for deterministic baselines
- **Network interception** — `page.route()` for mocking, `page.unroute()` for cleanup
- **Custom fixtures** — dependency injection via `test.extend()`
- **BrowserContext isolation** — `context.newPage()` for shared-session tabs, `browser.newContext()` for fully isolated multi-user scenarios
- **Accessibility testing** — automated WCAG scans via `@axe-core/playwright`
- **API contract testing** — Zod schema validation plus a formally versioned JSON Schema contract, validated with Ajv
- **Trace viewer** — enabled on first retry for debugging
- **Docker** — Linux/CI environment parity for local reproduction of pipeline conditions
- **CI/CD** — tiered GitHub Actions pipeline with smoke/regression split, sharded parallel execution, browser caching, and failure email alerts

## Architectural decisions

See [DECISIONS.md](./DECISIONS.md) for rationale behind key technical choices.
