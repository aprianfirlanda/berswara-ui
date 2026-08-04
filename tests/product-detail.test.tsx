import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { rentalProducts } from '../src/data/rentalProducts'
import { ProductDetailPage } from '../src/pages/ProductDetailPage'
import { RentalProductDetail } from '../src/pages/RentalProductDetail'
import type { RentalProduct } from '../src/types/catalog'
import {
  getRelatedRentalProducts,
  getRentalProductFromSource,
} from '../src/utilities/productDetail'

function createApprovedProduct(
  base: RentalProduct,
  overrides: Partial<RentalProduct> = {},
): RentalProduct {
  return {
    ...base,
    contentStatus: 'approved',
    published: true,
    rateOptions: [
      {
        id: `${base.slug}-daily`,
        label: 'Harian',
        amount: 75_000,
        currency: 'IDR',
        duration: { value: 1, unit: 'day' },
        status: 'approved',
      },
      {
        id: `${base.slug}-weekly`,
        label: 'Mingguan',
        amount: 350_000,
        currency: 'IDR',
        duration: { value: 1, unit: 'week' },
        status: 'approved',
      },
    ],
    minimumRentalDuration: {
      value: 2,
      unit: 'day',
      status: 'approved',
    },
    deposit: {
      amount: 300_000,
      currency: 'IDR',
      refundable: true,
      status: 'approved',
      note: 'Dikembalikan setelah pemeriksaan.',
    },
    availability: {
      indicator: 'available-to-request',
      status: 'approved',
      exactDateConfirmationRequired: true,
      note: 'Tanggal dikonfirmasi oleh Berswara.',
    },
    includedItems: {
      items: ['Unit utama', 'Tas penyimpanan'],
      status: 'approved',
    },
    condition: { value: 'Kondisi baik.', status: 'approved' },
    hygiene: { value: 'Dibersihkan sebelum sewa.', status: 'approved' },
    logistics: { value: 'Delivery atau pickup.', status: 'approved' },
    guidance: { ...base.guidance, status: 'approved' },
    ...overrides,
  }
}

describe('product detail selection', () => {
  test('only resolves products present in the supplied visible source', () => {
    const approved = createApprovedProduct(rentalProducts[0])

    expect(getRentalProductFromSource(approved.slug, [approved])).toBe(approved)
    expect(getRentalProductFromSource(rentalProducts[1].slug, [approved])).toBeUndefined()
  })

  test('related items exclude current product and prefer its category', () => {
    const source = rentalProducts.map((product) =>
      createApprovedProduct(product),
    )
    const current = source[0]
    const related = getRelatedRentalProducts(current, source, 4)

    expect(related).toHaveLength(4)
    expect(related.some((product) => product.slug === current.slug)).toBe(false)
    expect(related.slice(0, 2).every((product) => product.category === 'stroller')).toBe(true)
  })
})

describe('rental product detail template', () => {
  test('renders product-specific sections and unambiguous multiple rates', () => {
    const product = createApprovedProduct(rentalProducts[0])
    const related = [createApprovedProduct(rentalProducts[1])]
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <RentalProductDetail product={product} relatedProducts={related} />
      </MemoryRouter>,
    )

    expect(markup).toContain(product.name)
    expect(markup).toContain('Harian')
    expect(markup).toContain('/ 1 hari')
    expect(markup).toContain('Mingguan')
    expect(markup).toContain('/ 1 minggu')
    expect(markup).toContain('300.000')
    expect(markup).toContain('Unit utama')
    expect(markup).toContain('Kondisi baik.')
    expect(markup).toContain(`/products/${related[0].slug}`)
  })

  test('renders unavailable next-date and alternative messaging', () => {
    const unavailable = createApprovedProduct(rentalProducts[0], {
      availability: {
        indicator: 'currently-unavailable',
        status: 'approved',
        exactDateConfirmationRequired: true,
        note: 'Tanggal berikutnya dikonfirmasi oleh Berswara.',
      },
    })
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <RentalProductDetail
          product={unavailable}
          relatedProducts={[createApprovedProduct(rentalProducts[1])]}
        />
      </MemoryRouter>,
    )

    expect(markup).toContain('Unit ini sedang tidak tersedia')
    expect(markup).toContain('Tanyakan tanggal berikutnya')
    expect(markup).toContain('alternatif dari kategori yang sama')
  })

  test('unpublished and unknown public slugs render Not Found', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/products/cybex-libelle']}>
        <Routes>
          <Route path="/products/:productSlug" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(markup).toContain('Halaman tidak ditemukan')
    expect(markup).not.toContain('Tarif sewa Cybex Libelle')
  })
})
