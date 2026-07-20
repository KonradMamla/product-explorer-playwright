# Product Explorer — Playwright Test Suite

A comprehensive test suite for the **Product Explorer** React application, built to demonstrate real-world Playwright usage across multiple testing layers.

## Test coverage

| Layer                 | What's tested                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------- | --- |
| **E2E**               | Search, category filtering, favorites persistence, multi-tab & multi-user isolation, error handling (network mocking) |
| **API**               | DummyJSON endpoints — response schema, status codes, error handling                                                   |
| **Component**         | Isolated React component rendering and interaction (SearchBar, CategoryFilter, ProductCard)                           |
| **Visual regression** | UI consistency across code changes, using mocked deterministic data                                                   |     |

## Tech stack

- [Playwright](https://playwright.dev/) — test runner, assertions, browser automation
- [TypeScript](https://www.typescriptlang.org/) — strict mode throughout
- React + Vite — application under test
- GitHub Actions — CI pipeline

## Project structure

## Project structure

\`\`\`
tests/
├── e2e/ # Full browser UI flows
│ ├── search.spec.ts
│ ├── categories.spec.ts
│ ├── favorites.spec.ts
│ ├── multi-tab.spec.ts # shared context + isolated context scenarios
│ └── error-handling.spec.ts # network mocking via page.route()
├── api/ # HTTP-level tests via Playwright request context
│ ├── products.spec.ts
│ └── categories.spec.ts
└── visual/ # Screenshot regression tests (mocked data)

src/components/**tests**/ # Component tests (CT runner)
├── SearchBar.spec.tsx
├── CategoryFilter.spec.tsx
└── ProductCard.spec.tsx

pages/ # Page Object Model
├── BasePage.ts
├── ProductListPage.ts
└── ProductModalPage.ts

fixtures/ # Custom Playwright fixtures + mock data
├── index.ts
└── product-mocks.ts

helpers/ # Shared utilities
├── api.routes.ts # API URL patterns
├── constants.ts # Technical constants
├── patterns.ts # Regex patterns
├── test-data.ts # Business test data
└── assertions.ts # Reusable custom assertions

.github/workflows/
└── playwright.yml # CI pipeline: smoke on push, regression on PR/nightly
\`\`\`

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

## CI/CD

The pipeline runs three jobs depending on the trigger:

| Trigger                | Job(s)                       | Scope                                 |
| ---------------------- | ---------------------------- | ------------------------------------- |
| Push to `main`         | Smoke Tests                  | `@smoke` tag, Chromium only (~15 min) |
| Pull Request to `main` | Regression + Component Tests | Full suite, all browsers (~60 min)    |
| Nightly (2:00 UTC)     | Regression + Component Tests | Full suite + email alert on failure   |

Update visual regression baselines locally before committing:

\`\`\`bash
npx playwright test tests/visual/ --update-snapshots
\`\`\`

## Key Playwright features demonstrated

- **Multi-browser** — Chromium, Firefox, WebKit, Pixel 5, iPhone 13
- **API testing** — via `request` context, no browser overhead
- **Component testing** — isolated rendering with `@playwright/experimental-ct-react`
- **Visual regression** — `toHaveScreenshot()` with mocked data for deterministic baselines
- **Network interception** — `page.route()` for mocking, `page.unroute()` for cleanup
- **Custom fixtures** — dependency injection via `test.extend()`
- **BrowserContext isolation** — `context.newPage()` for shared-session tabs, `browser.newContext()` for fully isolated multi-user scenarios
- **Trace viewer** — enabled on first retry for debugging
- **CI/CD** — tiered GitHub Actions pipeline with smoke/regression split, browser caching, and failure email alerts

## Architectural decisions

See [DECISIONS.md](./DECISIONS.md) for rationale behind key technical choices.
