# SauceDemo QA Challenge — Playwright Test Suite

Senior QA Engineer Challenge — E-Commerce Platform Testing  
**Application Under Test:** [https://www.saucedemo.com](https://www.saucedemo.com)

---

## Project Structure

```
saucedemo-qa-challenge/
├── .gitignore
├── README.md
├── TestPlan_SauceDemo.odt     # Full test plan document
├── playwright.config.ts        # Browser configuration and project matrix
├── package.json
├── tsconfig.json
├── pages/                      # Page Object Model (POM)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts        # Includes index-based product selection pattern
│   ├── CartPage.ts             # Includes getItemByIndex abstraction
│   └── CheckoutPage.ts
├── tests/
│   ├── test-data.ts            # Centralized credentials, routes and test data
│   ├── helpers/
│   │   └── auth.ts             # Reusable login helpers (loginAs, loginAsStandardUser)
│   ├── login.spec.ts           # Login scenarios (positive, negative, brute force)
│   ├── checkout.spec.ts        # E2E purchase flow and cart management
│   └── api-security.spec.ts    # API-level security validations
└── features/                   # Gherkin feature files (living documentation)
    ├── login.feature
    ├── checkout.feature
    └── api-security.feature
```

---

## Installation

```bash
# Clone the repository
git clone https://github.com/LeoAngel3000/saucedemo-qa-challenge.git
cd saucedemo-qa-challenge

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

---

## Running Tests

```bash
# Smoke gate — Chromium only (intended for CI/CD per-commit runs)
npm test

# Full cross-browser suite (Chromium + Firefox + WebKit)
npm run test:full

# API security tests only
npm run test:api

# View HTML report after test run
npm run report
```

---

## Worker Configuration

The project is configured to run with `4 workers` locally, which parallelizes test execution across 4 browser processes for speed. In CI environments (where the `CI` environment variable is set automatically by GitHub Actions), it drops to `2 workers` to avoid resource constraints on shared runners. If you experience timeouts on an older or low-resource machine, set `workers: 1` in `playwright.config.ts`.

---

## Selector Strategy

All locators use `data-test` attributes as the primary selector strategy, as these are stable identifiers that are unlikely to change with UI refactoring. In cases where no `data-test` attribute exists on an element (for example, the cart item container `.cart_item`), a CSS class is used as a fallback and documented with an inline comment explaining the decision.

---

## Test Scenarios

### login.spec.ts
| Scenario | Expected Result |
|---|---|
| Successful login with valid credentials | Redirected to products page |
| Unsuccessful login with invalid password | Generic error message displayed |
| No lockout after 6 failed attempts *(known failure)* | Lockout message expected but absent — documents brute force vulnerability |

### checkout.spec.ts
| Scenario | Expected Result |
|---|---|
| E2E purchase of a random product | Order confirmation displayed, cart empty |
| Cart reflects correct product name and price | Product details match inventory |
| Cart item can be removed before checkout | Cart empty, badge not visible |
| Cart state persists across page refresh | Cart badge count unchanged after reload |

### api-security.spec.ts
| Scenario | Expected Result |
|---|---|
| Login payload does not expose password | Password not found in plaintext in request |
| Unauthenticated access returns 401 *(known failure)* | 401 expected — SauceDemo returns 404 (static app, no server-side auth) |
| Session token cleared should redirect to login *(known failure)* | Redirect expected — SauceDemo allows continued access without token |

---

## Known Failures

Three tests are intentionally designed to fail. They document security vulnerabilities that would be treated as critical defects in a production application. They should not block the CI pipeline.

| Test | Vulnerability | Standard Reference |
|---|---|---|
| No account lockout after 6 failed attempts | Brute force risk | OWASP: lockout after 5 consecutive failures |
| Unauthenticated access does not return 401 | Missing HTTP access control | HTTP standard: 401 Unauthorized |
| Session remains active after token is cleared | Missing server-side session validation | OWASP: session invalidation on token removal |

---

## Architecture Decisions

**Gherkin and Playwright as separate layers.** The `features/` directory contains Gherkin scenarios that serve as living documentation and test design artifacts. The `tests/` directory contains the Playwright implementation. These two layers are intentionally kept separate — Cucumber integration to connect them directly is a natural next step but was excluded from this challenge scope to keep the focus on Playwright architecture and test quality.

**Centralized test data.** All credentials, routes, and form data live in `tests/test-data.ts`. SauceDemo exposes multiple test users that all share a single password — the data structure reflects this relationship explicitly, making it easy to extend to other users in the future.

**Index-based POM abstraction.** `CartPage` and `InventoryPage` expose a base method that accepts an index parameter (`getItemByIndex`, `addProductToCart`), with semantic convenience methods built on top (`getFirstItemName`, `addRandomProductToCart`). This pattern keeps implementation details encapsulated while making test code read like natural language.

---

## Assumptions & Limitations

- **Single user in scope:** Only `standard_user` is tested. Alternative accounts (`locked_out_user`, etc.) are explicitly out of scope and documented in the Test Plan.
- **Static frontend:** SauceDemo does not send real POST requests on login. The API security test for payload inspection documents the expected behavior for a production app.
- **No real transactions:** Checkout is simulated. No payment gateway is involved.
- **Manual state reset:** Cart state persists between sessions and can be manually reset using a menu option.
- **Credentials:** Hardcoded for this challenge only. In a production setup, credentials must be stored in environment variables (`.env`).
- **Browser strategy:** Smoke gate runs on Chromium only for CI/CD speed. Firefox and WebKit are available via `npm run test:full` for scheduled or pre-release validation.
