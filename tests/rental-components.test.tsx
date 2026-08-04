import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import {
  AvailabilityBadge,
  Button,
  CategoryChip,
  ProductCard,
  RentalRateBlock,
  SearchInput,
  StatePanel,
} from '../src/components'
import { rentalProducts } from '../src/data/rentalProducts'
import type { AvailabilityIndicator, RentalRateOption } from '../src/types/catalog'
import {
  formatRentalAmount,
  formatRentalDuration,
  getAvailabilityLabel,
} from '../src/utilities/rentalPresentation'

const approvedRate: RentalRateOption = {
  id: 'test-rate',
  label: 'Harian',
  amount: 75_000,
  currency: 'IDR',
  duration: { value: 1, unit: 'day' },
  status: 'approved',
}

describe('rental formatting', () => {
  test('always includes a duration unit', () => {
    expect(formatRentalDuration({ value: 2, unit: 'day' })).toBe('2 hari')
    expect(formatRentalDuration({ value: null, unit: 'week' })).toBe(
      'dikonfirmasi / minggu',
    )
  })

  test('formats approved and pending rental amounts safely', () => {
    expect(formatRentalAmount(approvedRate)).toContain('75.000')
    expect(formatRentalAmount({ ...approvedRate, amount: null })).toBe(
      'Tarif dikonfirmasi',
    )
  })
})

describe('availability variants', () => {
  const indicators: AvailabilityIndicator[] = [
    'available-to-request',
    'limited-availability',
    'currently-unavailable',
  ]

  test('each status has visible text and a non-color symbol', () => {
    for (const indicator of indicators) {
      const markup = renderToStaticMarkup(
        <AvailabilityBadge indicator={indicator} />,
      )
      expect(markup).toContain(getAvailabilityLabel(indicator))
      expect(markup).toContain('availability-badge-icon')
      expect(markup).toContain(`data-availability="${indicator}"`)
    }
  })
})

describe('interactive component states', () => {
  test('button exposes loading and disabled semantics', () => {
    const markup = renderToStaticMarkup(
      <Button isLoading loadingLabel="Memeriksa…">
        Cek ketersediaan
      </Button>,
    )
    expect(markup).toContain('aria-busy="true"')
    expect(markup).toContain('disabled=""')
    expect(markup).toContain('Memeriksa…')
  })

  test('category chip exposes its selected state', () => {
    const markup = renderToStaticMarkup(
      <CategoryChip value="stroller" selected count={3} />,
    )
    expect(markup).toContain('aria-pressed="true"')
    expect(markup).toContain('Stroller')
    expect(markup).toContain('3')
  })

  test('search error is associated with the input', () => {
    const markup = renderToStaticMarkup(
      <SearchInput value="stroller" onChange={() => undefined} error="Pencarian gagal" />,
    )
    expect(markup).toContain('aria-invalid="true"')
    expect(markup).toContain('role="alert"')
    expect(markup).toContain('Pencarian gagal')
  })
})

describe('composed rental components', () => {
  test('rate block renders amount unit and minimum period together', () => {
    const markup = renderToStaticMarkup(
      <RentalRateBlock
        rateOptions={[approvedRate]}
        minimumDuration={{ value: 2, unit: 'day', status: 'approved' }}
      />,
    )
    expect(markup).toContain('75.000')
    expect(markup).toContain('/ 1 hari')
    expect(markup).toContain('Minimum sewa:')
    expect(markup).toContain('2 hari')
  })

  test('product card renders product-specific rental context', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <ProductCard product={rentalProducts[0]} />
      </MemoryRouter>,
    )
    expect(markup).toContain(rentalProducts[0].name)
    expect(markup).toContain('/products/cybex-libelle')
    expect(markup).toContain('Minimum sewa:')
    expect(markup).toContain('Tersedia untuk ditanyakan')
  })

  test('error feedback announces plain-language recovery content', () => {
    const markup = renderToStaticMarkup(
      <StatePanel
        variant="error"
        title="Katalog belum dapat dimuat"
        description="Coba kembali beberapa saat lagi."
        actionLabel="Coba lagi"
        onAction={() => undefined}
      />,
    )
    expect(markup).toContain('aria-live="assertive"')
    expect(markup).toContain('Katalog belum dapat dimuat')
    expect(markup).toContain('Coba lagi')
  })
})
