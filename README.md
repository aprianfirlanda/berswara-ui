# Berswara UI

Public rental-catalog website for Berswara, built with React, TypeScript, Vite, and Bun.

## Local development

```bash
bun install
bun run dev
```

Quality checks:

```bash
bun run lint
bun test
bun run build
```

## Automated rental-journey tests

The fast test suite uses Bun's built-in test runner for deterministic catalog,
product, WhatsApp, Not Found, and responsive-navigation behavior. Playwright
adds a browser-level rental journey without opening a headed browser:

```bash
# First time only: download the Chromium test browser.
bunx playwright install chromium

bun run test:e2e
bun run test:ci
```

`test:e2e` starts Vite automatically and verifies Home → Catalog → Product →
Contact, including the generated WhatsApp URL. The CI workflow runs the same
commands non-interactively on Chromium.

## Public routes

| Route | Screen |
| --- | --- |
| `/` | Home |
| `/catalog` | Rental Catalog |
| `/products/:productSlug` | Rental Product Detail |
| `/how-it-works` | How It Works |
| `/about` | About Berswara |
| `/contact` | Contact |
| `*` | Not Found |

All routes render inside the shared application shell. Product detail URLs use a stable slug, for example `/products/cocolatte-pockit-gen-7`.

## Hosting

The application uses browser-based client routing, so production hosting must rewrite unknown requests to `/index.html`.

- `vercel.json` configures the rewrite for Vercel.
- `public/_redirects` configures the rewrite for hosts that support the Netlify redirects format.

If another host is selected, add its equivalent SPA fallback before deployment.

### Vercel production setup

This repository is deployed from the `berswara-ui` directory. In the Vercel
project, set **Root Directory** to `berswara-ui`; Vercel can then use the Bun
lockfile and the default `bun run build` command. The committed `vercel.json`
provides the SPA fallback, cache policy, and static-site security headers.

Before the next production deployment, add this Vercel Production environment
variable (no trailing slash):

```text
VITE_SITE_URL=https://your-production-domain.example
```

Use the same value in preview if previews need accurate canonical metadata.
Never commit a real environment file; `.env.example` documents the expected
shape and `.env.local` is ignored.

GitHub pull requests and pushes to `main` run the root workflow at
`.github/workflows/berswara-ui-ci.yml`. It installs from the lockfile, runs
linting, all Bun tests, the production build, and Playwright.

### Launch smoke test and rollback

After Vercel reports a Production deployment, run the browser smoke test against
the actual HTTPS domain:

```bash
cd berswara-ui
PLAYWRIGHT_BASE_URL="https://your-production-domain.example" \
  bunx playwright test tests/e2e/production-smoke.e2e.ts
```

Confirm the Vercel deployment uses HTTPS, the custom-domain redirect (if one is
configured), direct navigation to each public route, canonical/robots/sitemap
URLs, and the WhatsApp inquiry link. The smoke test covers all direct public
routes plus Catalog → Product → Contact → WhatsApp.

To roll back, open **Vercel → Deployments**, select the last known-good
Production deployment, and use **Promote to Production**. Repeat the smoke test
after promotion and record the deployment URL and reason for the rollback.

## SEO and sharing

Every public route updates its Bahasa Indonesia title, description, canonical URL,
Open Graph, and Twitter metadata. Published product pages also include
product-specific sharing information and truthful `Service` structured data for
rental—not a sales product or confirmed booking.

`public/sitemap.xml` and `public/robots.txt` list only public pages and the six
approved products. Not Found and unpublished product routes use `noindex`.

The production Vercel domain is `https://berswara-ui.vercel.app`. If a custom domain
is connected, set `VITE_SITE_URL` to that full HTTPS origin and update the two
public indexing files before the next production deployment.

## Image assets

Brand and product media are stored under `public/assets` with stable, descriptive filenames.

- The Berswara logo has transparent PNG fallbacks and responsive WebP variants at 320 px and 640 px.
- Each product graphic has WebP variants for 480 px cards, 800 px medium layouts, and its native 1080/1200 px detail view.
- `src/data/productAssets.ts` is the typed source for image dimensions, responsive paths, and Indonesian alternative text.
- `ResponsiveProductImage` reserves the source aspect ratio, lazy-loads by default, and renders a branded fallback when an image fails.

## Rental catalog data

`src/data/rentalProducts.ts` is the typed source of truth for the six approved rental products. It supports catalog cards, filters, detail pages, related products, and WhatsApp inquiry context.

- Required fields are enforced by `RentalProduct` and the `satisfies` operator.
- Currency is fixed to IDR and every approved rate includes a duration value and unit.
- Exact-date availability always requires Berswara confirmation.
- Every retained product has approved rates, an approved minimum rental period, and no deposit.
- Chris Olins Lisbon 630 and Sugar Baby My Circus Baby Walker are not published in the public catalog.
- Exact-date availability, condition, included items, hygiene, and final logistics are confirmed by Berswara through WhatsApp before reservation.
- `validateRentalCatalog` rejects duplicate/invalid slugs, missing categories or images, invalid rates, and confirmed exact-date claims.

## Rental Catalog behavior

The `/catalog` page derives its visible cards exclusively from `getPublishedRentalProducts()`. Search, category, and sorting selections are stored in URL query parameters so filtered links can be shared and opened from Home category actions.

- `q` searches normalized product names, category labels, summaries, descriptions, and features.
- `category` supports `stroller`, `earmuff`, `push-walker`, and `balance-bike`.
- `sort` supports recommendations, newest update, and name. Starting-rate sorting appears only when at least one approved numeric rate exists.
- Invalid query values fall back to safe defaults.
- Loading, error, no-results, unpublished-catalog, image-fallback, and unavailable-product presentation use shared system components.

During local development, optional `state=loading` or `state=error` parameters exercise feedback states. These development behaviors are disabled in production.

## Design system foundations

Global styles are split into production-ready layers imported by `src/index.css`:

- `tokens.css` contains the Berswara palette, typography, spacing, borders, radii, shadows, layout widths, breakpoint references, focus, motion, and layering tokens.
- `reset.css` provides accessible global defaults, Fredoka headings, Nunito body copy, visible focus indicators, and reduced-motion behavior.
- `utilities.css` provides reusable containers, sections, stacks, clusters, auto-grids, surfaces, responsive helpers, and visually-hidden content.
- `global.css` applies the tokens to the current application shell and placeholder components without redefining shared design values.

Fredoka and Nunito are bundled from `@fontsource`, so typography does not depend on a third-party font request at runtime.

## Shared site shell

`AppShell` renders the same sticky header, primary navigation, main-content skip link, and footer on every public route.

- Desktop navigation includes an active-route state and a prominent availability action.
- At 768 px and below, the header uses an always-visible availability shortcut and an accessible collapsible menu. The menu exposes `aria-expanded`, closes after navigation, and closes with Escape while returning focus to its trigger.
- The logo image includes intrinsic dimensions to reserve space while loading.
- The footer includes navigation and clearly labeled placeholders for service area, operating hours, WhatsApp, and social links. These placeholders must be replaced only after official business details are approved.

## Rental component library

Reusable, typed components are exported from `src/components/index.ts` and grouped by purpose:

- `ui`: button and internal-link actions with primary, secondary, ghost, compact, loading, full-width, and disabled variants.
- `catalog`: product cards, category cards/chips, controlled search, availability badges, and rate blocks.
- `product`: keyboard-operable single/multiple-image gallery.
- `content`: breadcrumbs, rental process steps, and policy sections.
- `feedback`: catalog/detail loading skeletons and reusable empty, error, or informational panels.
- `media`: responsive product images and a standalone accessible image fallback.

Availability badges use readable labels and symbols in addition to color. Rental-rate blocks always pair the amount or confirmation placeholder with a duration unit and minimum-period statement.

Run `bun test` for representative component state and formatting coverage. During local development, `/__components` provides a visual story page for responsive and keyboard review; it is omitted from production routing.

## Privacy-conscious analytics

Berswara has a provider-agnostic analytics event layer. It records only these
safe interaction facts: Home catalog CTA placement, catalog category selection,
whether search was used (never its query), sort choice, product slug/category,
How It Works view, and WhatsApp inquiry source/variant/product category.

No analytics event contains a search query, WhatsApp message, requested dates,
phone number, customer identity, address, or conversation content. Events are
deduplicated during a client session so React rendering and client navigation do
not send the same event twice.

No third-party provider is enabled by default. Before connecting one, show the
consent required by the provider and applicable privacy rules, then call
`configureAnalytics({ consent: true, sink })`. The `sink` receives only the
typed, minimal event payload. If consent is absent or a provider fails, the site
continues browsing and WhatsApp links normally.

For development verification, listen for the local browser event
`berswara:analytics`; it exposes the same safe payload but does not transmit it.
