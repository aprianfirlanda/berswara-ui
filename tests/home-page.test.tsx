import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { rentalProducts } from '../src/data/rentalProducts'
import { HomePage } from '../src/pages/HomePage'
import type { RentalProduct } from '../src/types/catalog'
import { getHomeFeaturedProducts } from '../src/utilities/homePage'

describe('Berswara Home page', () => {
  test('states the rental purpose and exposes the complete discovery journey', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(markup).toContain('Rental perlengkapan bayi')
    expect(markup).toContain('Berswara menyewakan stroller')
    expect(markup).toContain('Permintaan tanggal belum menjadi reservasi')
    expect(markup.match(/class="process-step-card"/g)).toHaveLength(4)
  })

  test('links all four category cards to filtered catalog results', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    for (const category of [
      'stroller',
      'earmuff',
      'push-walker',
      'balance-bike',
    ]) {
      expect(markup).toContain(`/catalog?category=${category}`)
    }
  })

  test('shows public product cards without inventing pending rental amounts', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    expect(markup.match(/class="rental-product-card"/g)).toHaveLength(3)
    expect(markup).toContain('Tarif dikonfirmasi')
    expect(markup).not.toMatch(/Rp\s*0/)
  })

  test('selects featured published records from the shared rental source', () => {
    const published = rentalProducts.slice(0, 4).map((product, index) => ({
      ...product,
      published: true,
      featured: index === 1 || index === 3,
    })) as RentalProduct[]

    expect(getHomeFeaturedProducts(published).map((product) => product.slug)).toEqual([
      published[1].slug,
      published[3].slug,
    ])
    expect(getHomeFeaturedProducts(published, 1)).toHaveLength(1)
  })
})
