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

## Image assets

Brand and product media are stored under `public/assets` with stable, descriptive filenames.

- The Berswara logo has transparent PNG fallbacks and responsive WebP variants at 320 px and 640 px.
- Each product graphic has WebP variants for 480 px cards, 800 px medium layouts, and its native 1080/1200 px detail view.
- `src/data/productAssets.ts` is the typed source for image dimensions, responsive paths, and Indonesian alternative text.
- `ResponsiveProductImage` reserves the source aspect ratio, lazy-loads by default, and renders a branded fallback when an image fails.

## Rental catalog data

`src/data/rentalProducts.ts` is the typed source of truth for the eight supplied rental products. It supports catalog cards, filters, detail pages, related products, and WhatsApp inquiry context.

- Required fields are enforced by `RentalProduct` and the `satisfies` operator.
- Currency is fixed to IDR and every rate includes a duration value and unit.
- Exact-date availability always requires Berswara confirmation.
- Unapproved prices, minimum periods, deposits, condition, hygiene, included items, and logistics use `pending-approval` with no fabricated monetary amount.
- All seeded products remain `published: false` until APR-6 business content is approved.
- `validateRentalCatalog` rejects duplicate/invalid slugs, missing categories or images, invalid rates, confirmed exact-date claims, and publishing with pending required content.

## Rental Catalog behavior

The `/catalog` page derives its visible cards exclusively from `getPublishedRentalProducts()`. Search, category, and sorting selections are stored in URL query parameters so filtered links can be shared and opened from Home category actions.

- `q` searches normalized product names, category labels, summaries, descriptions, and features.
- `category` supports `stroller`, `earmuff`, `push-walker`, and `balance-bike`.
- `sort` supports recommendations, newest update, and name. Starting-rate sorting appears only when at least one approved numeric rate exists.
- Invalid query values fall back to safe defaults.
- Loading, error, no-results, unpublished-catalog, image-fallback, and unavailable-product presentation use shared system components.

During local development, `/catalog?preview=draft` renders the eight seeded draft records for UI testing. Optional `state=loading` or `state=error` parameters exercise feedback states. These development behaviors are disabled in production, where draft products remain hidden until APR-6 approval.

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
