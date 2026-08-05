import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { CatalogResults } from '../src/components'
import {
  getPublishedRentalProducts,
  rentalProducts,
} from '../src/data/rentalProducts'
import { CatalogPage } from '../src/pages/CatalogPage'
import type { RentalProduct } from '../src/types/catalog'
import {
  filterAndSortCatalog,
  getCatalogSortOptions,
  getCategoryCounts,
  parseCatalogCategory,
  parseCatalogSort,
} from '../src/utilities/catalogQuery'

const queryDefaults = {
  search: '',
  category: 'all' as const,
  sort: 'featured' as const,
}

function withApprovedRate(
  product: RentalProduct,
  amount: number,
): RentalProduct {
  return {
    ...product,
    published: true,
    rateOptions: [
      {
        id: `${product.slug}-approved-test`,
        label: 'Harian',
        amount,
        currency: 'IDR',
        duration: { value: 1, unit: 'day' },
        status: 'approved',
      },
    ],
  }
}

describe('catalog query behavior', () => {
  test('searches product name and category keywords', () => {
    const earmuffs = filterAndSortCatalog(rentalProducts, {
      ...queryDefaults,
      search: 'cronos',
      category: 'earmuff',
    })
    const balanceBike = filterAndSortCatalog(rentalProducts, {
      ...queryDefaults,
      search: 'balance bike',
    })

    expect(earmuffs).toHaveLength(2)
    expect(earmuffs.every((product) => product.category === 'earmuff')).toBe(true)
    expect(balanceBike.map((product) => product.slug)).toEqual([
      'balance-bike-rabbit-labelle',
    ])
  })

  test('combines category and search filters without mutating source data', () => {
    const originalOrder = rentalProducts.map((product) => product.slug)
    const results = filterAndSortCatalog(rentalProducts, {
      search: 'walker',
      category: 'push-walker',
      sort: 'name',
    })

    expect(results).toHaveLength(1)
    expect(results.map((product) => product.name)).toEqual([
      'Fisher-Price Learn with Me Zebra Walker',
    ])
    expect(rentalProducts.map((product) => product.slug)).toEqual(originalOrder)
  })

  test('sorts approved starting rates and keeps pending rates last', () => {
    const low = withApprovedRate(rentalProducts[0], 50_000)
    const high = withApprovedRate(rentalProducts[1], 100_000)
    const pending: RentalProduct = {
      ...rentalProducts[2],
      rateOptions: [
        {
          id: `${rentalProducts[2].slug}-pending-test`,
          label: '3 hari',
          amount: null,
          currency: 'IDR',
          duration: { value: 3, unit: 'day' },
          status: 'pending-approval',
          note: 'Tarif dikonfirmasi oleh Berswara.',
        },
      ],
    }
    const results = filterAndSortCatalog([high, pending, low], {
      ...queryDefaults,
      sort: 'starting-rate',
    })

    expect(results.map((product) => product.slug)).toEqual([
      low.slug,
      high.slug,
      pending.slug,
    ])
  })

  test('offers starting-rate sorting for the approved public catalog', () => {
    expect(
      getCatalogSortOptions(rentalProducts).some(
        (option) => option.value === 'starting-rate',
      ),
    ).toBe(true)
    expect(
      getCatalogSortOptions([withApprovedRate(rentalProducts[0], 50_000)]).some(
        (option) => option.value === 'starting-rate',
      ),
    ).toBe(true)
  })

  test('parses invalid URL values back to safe defaults', () => {
    const options = getCatalogSortOptions(rentalProducts)
    expect(parseCatalogCategory('invalid')).toBe('all')
    expect(parseCatalogCategory('stroller')).toBe('stroller')
    expect(parseCatalogSort('starting-rate', options)).toBe('starting-rate')
    expect(parseCatalogSort('newest', options)).toBe('newest')
  })

  test('counts every category from the same source collection', () => {
    expect(getCategoryCounts(rentalProducts)).toEqual({
      all: 6,
      stroller: 2,
      earmuff: 2,
      'push-walker': 1,
      'balance-bike': 1,
    })
  })
})

describe('catalog result states', () => {
  test('renders all six approved items when the source marks them visible', () => {
    const visibleProducts = rentalProducts.map((product) => ({
      ...product,
      published: true,
    }))
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <CatalogResults
          status="ready"
          products={visibleProducts}
          hasActiveFilters={false}
          hasPublishedInventory
          onReset={() => undefined}
          onRetry={() => undefined}
        />
      </MemoryRouter>,
    )

    expect(markup.match(/class="rental-product-card"/g)).toHaveLength(6)
    for (const product of rentalProducts) {
      expect(markup).toContain(product.name)
    }
  })

  test('renders loading, error, and one-action empty states', () => {
    const loading = renderToStaticMarkup(
      <CatalogResults
        status="loading"
        products={[]}
        hasActiveFilters={false}
        hasPublishedInventory
        onReset={() => undefined}
        onRetry={() => undefined}
      />,
    )
    const error = renderToStaticMarkup(
      <CatalogResults
        status="error"
        products={[]}
        hasActiveFilters={false}
        hasPublishedInventory
        onReset={() => undefined}
        onRetry={() => undefined}
      />,
    )
    const empty = renderToStaticMarkup(
      <CatalogResults
        status="ready"
        products={[]}
        hasActiveFilters
        hasPublishedInventory
        onReset={() => undefined}
        onRetry={() => undefined}
      />,
    )

    expect(loading).toContain('Memuat katalog sewa')
    expect(error).toContain('Katalog belum dapat dimuat')
    expect(error).toContain('Coba lagi')
    expect(empty).toContain('Belum ada produk yang cocok')
    expect(empty.match(/Reset pencarian/g)).toHaveLength(1)
  })

  test('production catalog renders six approved public records with published rates', () => {
    expect(getPublishedRentalProducts()).toHaveLength(6)
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/catalog']}>
        <CatalogPage />
      </MemoryRouter>,
    )
    expect(markup.match(/class="rental-product-card"/g)).toHaveLength(6)
    expect(markup).toContain('Rp200.000')
    expect(markup).toContain('Minimum sewa:')
    expect(markup).toContain('3 hari')
    expect(markup).not.toContain('Tarif dikonfirmasi')
  })
})
