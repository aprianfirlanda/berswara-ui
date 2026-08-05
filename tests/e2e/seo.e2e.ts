import { expect, test } from '@playwright/test'

test('a product route supplies product-specific sharing and canonical metadata', async ({
  page,
}) => {
  await page.goto('/products/cybex-libelle')

  await expect(page).toHaveTitle('Sewa Cybex Libelle | Berswara')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    'href',
    'https://berswara.vercel.app/products/cybex-libelle',
  )
  await expect(page.locator('meta[property="og:type"]')).toHaveAttribute(
    'content',
    'product',
  )
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    'content',
    'Sewa Cybex Libelle | Berswara',
  )
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
    'content',
    'https://berswara.vercel.app/assets/products/cybex-libelle-1200.webp',
  )

  const structuredData = await page
    .locator('script[data-seo-structured-data="true"]')
    .textContent()
  expect(JSON.parse(structuredData!)).toMatchObject({
    '@type': 'Service',
    name: 'Rental Cybex Libelle',
    serviceType: 'Rental perlengkapan bayi',
  })
})

test('unknown product routes are excluded from indexing', async ({ page }) => {
  await page.goto('/products/tidak-ada')

  await expect(page).toHaveTitle('Halaman Tidak Ditemukan | Berswara')
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    'content',
    'noindex, nofollow',
  )
})
