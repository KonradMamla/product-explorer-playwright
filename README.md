# Product Explorer — Playwright Test Suite

A comprehensive test suite for the **Product Explorer** React application, built to demonstrate real-world Playwright usage across multiple testing layers.

## Test coverage

| Layer                 | What's tested                                                         |
| --------------------- | --------------------------------------------------------------------- |
| **E2E**               | Search, category filtering, favorites persistence, multi-tab behavior |
| **API**               | DummyJSON endpoints — response schema, status codes, error handling   |
| **Component**         | Isolated React component rendering and interaction                    |
| **Visual regression** | UI consistency across code changes                                    |

## Tech stack

- [Playwright](https://playwright.dev/) — test runner, assertions, browser automation
- [TypeScript](https://www.typescriptlang.org/) — strict mode throughout
- React + Vite — application under test
- GitHub Actions — CI pipeline

## Project structure

```
tests/
├── e2e/          # Full browser UI flows
├── api/          # HTTP-level tests via Playwright request context
└── visual/       # Screenshot regression tests

src/components/__tests__/  # Component tests (CT runner)

pages/            # Page Object Model
fixtures/         # Custom Playwright fixtures (dependency injection)
helpers/          # Shared API helpers
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

## Key Playwright features demonstrated

- **Multi-browser** — Chromium, Firefox, WebKit, Pixel 5, iPhone 13
- **API testing** — via `request` context, no browser overhead
- **Component testing** — isolated rendering with `@playwright/experimental-ct-react`
- **Visual regression** — `toHaveScreenshot()` with baseline management
- **Network interception** — `page.route()` for mocking and assertions
- **Custom fixtures** — dependency injection via `test.extend()`
- **Multi-tab** — `context.newPage()` scenarios
- **Trace viewer** — enabled on first retry for debugging

## Architectural decisions

See [DECISIONS.md](./DECISIONS.md) for rationale behind key technical choices.
