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
