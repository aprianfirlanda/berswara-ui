import { useSearchParams } from 'react-router-dom'
import {
  CatalogResults,
  CategoryChip,
  SearchInput,
  type CatalogLoadStatus,
} from '../components'
import {
  getPublishedRentalProducts,
} from '../data/rentalProducts'
import { rentalCategories } from '../types/catalog'
import {
  filterAndSortCatalog,
  getCatalogSortOptions,
  getCategoryCounts,
  parseCatalogCategory,
  parseCatalogSort,
  type CatalogCategoryFilter,
  type CatalogSort,
} from '../utilities/catalogQuery'
import { getRentalCategoryLabel } from '../utilities/rentalPresentation'
import { trackAnalyticsEvent } from '../utilities/analytics'
import { useDocumentMetadata } from '../utilities/useDocumentMetadata'
import '../styles/catalog.css'

const defaultStatus: CatalogLoadStatus = 'ready'

export function CatalogPage() {
  useDocumentMetadata({
    title: 'Katalog sewa perlengkapan bayi | Berswara',
    description:
      'Lihat pilihan stroller, earmuff, push walker, dan balance bike Berswara. Ketersediaan tanggal dikonfirmasi melalui WhatsApp.',
    path: '/catalog',
  })
  const [searchParams, setSearchParams] = useSearchParams()
  const sourceProducts = getPublishedRentalProducts()
  const sortOptions = getCatalogSortOptions(sourceProducts)
  const search = searchParams.get('q') ?? ''
  const category = parseCatalogCategory(searchParams.get('category'))
  const sort = parseCatalogSort(searchParams.get('sort'), sortOptions)
  const developmentStatus = import.meta.env.DEV
    ? searchParams.get('state')
    : null
  const status: CatalogLoadStatus =
    developmentStatus === 'loading' || developmentStatus === 'error'
      ? developmentStatus
      : defaultStatus

  const products = filterAndSortCatalog(sourceProducts, {
    search,
    category,
    sort,
  })
  const categoryCounts = getCategoryCounts(sourceProducts)
  const hasActiveFilters = Boolean(search.trim()) || category !== 'all'

  const updateSearchParams = (
    updates: Partial<{
      q: string
      category: CatalogCategoryFilter
      sort: CatalogSort
      state: string
    }>,
  ) => {
    const next = new URLSearchParams(searchParams)

    for (const [key, value] of Object.entries(updates)) {
      if (
        value === undefined
        || value === ''
        || (key === 'category' && value === 'all')
        || (key === 'sort' && value === 'featured')
      ) {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    }

    setSearchParams(next, { replace: true })
  }

  const resetCatalog = () => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  const retryCatalog = () => updateSearchParams({ state: '' })

  return (
    <section className="catalog-page">
      <header className="catalog-hero">
        <div>
          <p className="eyebrow">Katalog sewa</p>
          <h1>Temukan perlengkapan untuk kebutuhan si kecil.</h1>
          <p className="catalog-intro">
            Cari stroller, earmuff, push walker, dan balance bike. Tarif,
            durasi, dan ketersediaan tanggal tertentu selalu dikonfirmasi oleh
            Berswara sebelum reservasi.
          </p>
        </div>
        <aside className="catalog-availability-note" aria-label="Catatan ketersediaan">
          <strong>Ketersediaan mengikuti tanggal sewa</strong>
          <p>Status pada katalog adalah panduan umum, bukan konfirmasi booking.</p>
        </aside>
      </header>

      <section className="catalog-controls" aria-label="Cari dan filter katalog">
        <SearchInput
          value={search}
          onChange={(event) => {
            if (!search.trim() && event.target.value.trim()) {
              trackAnalyticsEvent({
                name: 'catalog_search_used',
                properties: {},
              })
            }
            updateSearchParams({ q: event.target.value })
          }}
          onClear={() => updateSearchParams({ q: '' })}
          hint="Cari berdasarkan nama, kategori, atau fitur produk."
        />

        <fieldset className="catalog-category-filter">
          <legend>Kategori</legend>
          <div className="catalog-chip-list">
            <CategoryChip
              value="all"
              selected={category === 'all'}
              count={categoryCounts.all}
              onClick={() => {
                trackAnalyticsEvent({
                  name: 'catalog_category_selected',
                  properties: { category: 'all' },
                })
                updateSearchParams({ category: 'all' })
              }}
            >
              Semua
            </CategoryChip>
            {rentalCategories.map((item) => (
              <CategoryChip
                key={item}
                value={item}
                selected={category === item}
                count={categoryCounts[item]}
                onClick={() => {
                  trackAnalyticsEvent({
                    name: 'catalog_category_selected',
                    properties: { category: item },
                  })
                  updateSearchParams({ category: item })
                }}
              >
                {getRentalCategoryLabel(item)}
              </CategoryChip>
            ))}
          </div>
        </fieldset>

        <label className="catalog-sort-control">
          <span>Urutkan</span>
          <select
            value={sort}
            onChange={(event) => {
              const selectedSort = event.target.value as CatalogSort
              trackAnalyticsEvent({
                name: 'catalog_sort_selected',
                properties: { sort: selectedSort },
              })
              updateSearchParams({ sort: selectedSort })
            }}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </section>

      <div className="catalog-results-heading" aria-live="polite">
        <p>
          <strong>{products.length}</strong> produk ditemukan
        </p>
        {hasActiveFilters && products.length > 0 ? (
          <button type="button" className="catalog-reset-link" onClick={resetCatalog}>
            Reset semua
          </button>
        ) : null}
      </div>

      <CatalogResults
        status={status}
        products={products}
        hasActiveFilters={hasActiveFilters}
        onReset={resetCatalog}
        onRetry={retryCatalog}
        hasPublishedInventory={sourceProducts.length > 0}
      />
    </section>
  )
}
