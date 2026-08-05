import { useSearchParams } from 'react-router-dom'
import {
  CatalogResults,
  CategoryChip,
  SearchInput,
  type CatalogLoadStatus,
} from '../components'
import {
  getPublishedRentalProducts,
  rentalProducts,
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
import '../styles/catalog.css'

const defaultStatus: CatalogLoadStatus = 'ready'

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const isDraftPreview =
    import.meta.env.DEV && searchParams.get('preview') === 'draft'
  const sourceProducts = isDraftPreview
    ? rentalProducts
    : getPublishedRentalProducts()
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
    const next = new URLSearchParams()
    const preview = searchParams.get('preview')
    if (preview) next.set('preview', preview)
    setSearchParams(next, { replace: true })
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

      {isDraftPreview ? (
        <div className="catalog-preview-banner" role="status">
          Pratinjau development aktif. Katalog publik tetap menggunakan
          pengaman nilai yang belum disetujui.
        </div>
      ) : null}

      <section className="catalog-controls" aria-label="Cari dan filter katalog">
        <SearchInput
          value={search}
          onChange={(event) => updateSearchParams({ q: event.target.value })}
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
              onClick={() => updateSearchParams({ category: 'all' })}
            >
              Semua
            </CategoryChip>
            {rentalCategories.map((item) => (
              <CategoryChip
                key={item}
                value={item}
                selected={category === item}
                count={categoryCounts[item]}
                onClick={() => updateSearchParams({ category: item })}
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
            onChange={(event) =>
              updateSearchParams({ sort: event.target.value as CatalogSort })
            }
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
        productHrefSuffix={isDraftPreview ? '?preview=draft' : undefined}
      />
    </section>
  )
}
