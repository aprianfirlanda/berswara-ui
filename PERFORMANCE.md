# Berswara frontend performance

## Production audit profile

- Date: 2026-08-05
- Lighthouse: 13.4.1
- URL: local `vite preview` production build
- Form factor: mobile
- Screen emulation: 412 × 823, device scale factor 1.75
- Throttling: Lighthouse simulated mobile throttling
- Browser: headless Google Chrome
- Category: Performance only

Run the production audit after `bun run build` and while `bun run preview --host 127.0.0.1 --port 4173` is active:

```sh
bunx lighthouse http://127.0.0.1:4173/ \
  --only-categories=performance \
  --output=json \
  --output-path=/tmp/berswara-lighthouse-mobile.json \
  --chrome-flags='--headless --no-sandbox' \
  --quiet
```

## Results

| Metric | Baseline | Final |
| --- | ---: | ---: |
| Performance score | 92 | 97 |
| First Contentful Paint | 2.2 s | 1.5 s |
| Largest Contentful Paint | 3.1 s | 2.5 s |
| Speed Index | 2.2 s | 1.5 s |
| Total Blocking Time | 10 ms | 20 ms |
| Cumulative Layout Shift | 0.002 | 0 |
| Total transferred | 385 KiB | 333 KiB |

The final Lighthouse report displays the simulated mobile LCP as 2.5 seconds (the raw value was 2505 ms). This is effectively at the target with no local-test margin, so it must be rechecked against the deployed HTTPS origin before launch.

## Implemented optimizations

- Product imagery uses 480, 800, and 1080/1200 WebP sources with explicit intrinsic dimensions and responsive `sizes`.
- Only the primary Home hero image and active product-detail image use eager loading and high fetch priority.
- Remaining hero, featured, catalog, related-product, and thumbnail images use native lazy loading.
- Catalog, Product Detail, Contact, About, How It Works, and Not Found routes are code split.
- Catalog, Product Detail, Contact, and Not Found CSS is emitted only with its route chunk.
- Fredoka 600 and Nunito 400 are self-hosted WOFF2 files. Critical faces use `font-display: optional` to prevent invisible text and late LCP repaint.
- Nunito emphasis weights are synthesized from the regular face, removing three font requests and approximately 49 KiB from the mobile transfer.
- The Fredoka heading face is preloaded; the body face is allowed to load without competing for the earliest request slots.
- Unused Vite/React starter SVGs and the unused starter hero PNG were removed.

## Remaining tradeoffs and deployment checks

- On constrained first visits, the rounded system fallback may remain for the page lifetime because critical faces use `font-display: optional`. Fast or cached visits retain the Berswara fonts.
- Synthetic Nunito emphasis is a small visual compromise that avoids downloading four static body-font weights.
- The main JavaScript chunk still includes React, React Router, the Home experience, and the shared catalog data. Lighthouse reported roughly 50 KiB of potential unused JavaScript, but further framework-level splitting would add another request to the initial Home route and should be justified with deployed measurements.
- Re-run Lighthouse against the deployed HTTPS origin because CDN caching, compression, TLS, and server response time can change field performance.
