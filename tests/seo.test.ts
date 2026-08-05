import { readFileSync } from 'node:fs'
import { expect, test } from 'bun:test'
import { berswaraSite, getCanonicalUrl } from '../src/config/site'
import { getPublishedRentalProducts } from '../src/data/rentalProducts'

test('public indexing files list only public pages and approved products', () => {
  const sitemap = readFileSync(new URL('../public/sitemap.xml', import.meta.url), 'utf8')
  const robots = readFileSync(new URL('../public/robots.txt', import.meta.url), 'utf8')

  expect(robots).toContain(`${berswaraSite.url}/sitemap.xml`)
  expect(sitemap).toContain(getCanonicalUrl('/catalog'))
  expect(sitemap).not.toContain('chris-olins-lisbon-630')
  expect(sitemap).not.toContain('sugar-baby-my-circus-walker')

  for (const product of getPublishedRentalProducts()) {
    expect(sitemap).toContain(getCanonicalUrl(`/products/${product.slug}`))
  }
})

test('canonical URLs preserve the selected public path', () => {
  expect(getCanonicalUrl('/products/cybex-libelle')).toBe(
    `${berswaraSite.url}/products/cybex-libelle`,
  )
})
