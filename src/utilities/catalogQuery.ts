import type {
  RentalCategory,
  RentalProduct,
} from '../types/catalog'
import { rentalCategories } from '../types/catalog'
import { getRentalCategoryLabel } from './rentalPresentation'

export type CatalogCategoryFilter = RentalCategory | 'all'
export type CatalogSort = 'featured' | 'newest' | 'name' | 'starting-rate'

export interface CatalogQuery {
  search: string
  category: CatalogCategoryFilter
  sort: CatalogSort
}

export interface CatalogSortOption {
  value: CatalogSort
  label: string
}

const defaultSortOptions: CatalogSortOption[] = [
  { value: 'featured', label: 'Rekomendasi' },
  { value: 'newest', label: 'Terbaru diperbarui' },
  { value: 'name', label: 'Nama A–Z' },
]

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLocaleLowerCase('id-ID')
}

export function getStartingRate(product: RentalProduct) {
  const amounts = product.rateOptions
    .filter((rate) => rate.status === 'approved' && rate.amount !== null)
    .map((rate) => rate.amount as number)

  return amounts.length > 0 ? Math.min(...amounts) : null
}

export function getCatalogSortOptions(
  products: readonly RentalProduct[],
): CatalogSortOption[] {
  const supportsStartingRate = products.some(
    (product) => getStartingRate(product) !== null,
  )

  return supportsStartingRate
    ? [
        ...defaultSortOptions,
        { value: 'starting-rate', label: 'Tarif mulai terendah' },
      ]
    : defaultSortOptions
}

export function parseCatalogCategory(value: string | null): CatalogCategoryFilter {
  return rentalCategories.includes(value as RentalCategory)
    ? (value as RentalCategory)
    : 'all'
}

export function parseCatalogSort(
  value: string | null,
  options: readonly CatalogSortOption[],
): CatalogSort {
  return options.some((option) => option.value === value)
    ? (value as CatalogSort)
    : 'featured'
}

export function filterAndSortCatalog(
  products: readonly RentalProduct[],
  query: CatalogQuery,
) {
  const search = normalize(query.search)
  const filtered = products.filter((product) => {
    if (query.category !== 'all' && product.category !== query.category) {
      return false
    }

    if (!search) return true

    const searchableText = normalize(
      [
        product.name,
        getRentalCategoryLabel(product.category),
        product.summary,
        product.description,
        ...product.features,
      ].join(' '),
    )

    return searchableText.includes(search)
  })

  return [...filtered].sort((left, right) => {
    if (query.sort === 'newest') {
      const byDate = right.updatedAt.localeCompare(left.updatedAt)
      return byDate || left.name.localeCompare(right.name, 'id-ID')
    }

    if (query.sort === 'name') {
      return left.name.localeCompare(right.name, 'id-ID')
    }

    if (query.sort === 'starting-rate') {
      const leftRate = getStartingRate(left)
      const rightRate = getStartingRate(right)

      if (leftRate === null && rightRate === null) return 0
      if (leftRate === null) return 1
      if (rightRate === null) return -1
      return leftRate - rightRate
    }

    return Number(right.featured) - Number(left.featured)
      || left.name.localeCompare(right.name, 'id-ID')
  })
}

export function getCategoryCounts(products: readonly RentalProduct[]) {
  return products.reduce<Record<CatalogCategoryFilter, number>>(
    (counts, product) => {
      counts.all += 1
      counts[product.category] += 1
      return counts
    },
    {
      all: 0,
      stroller: 0,
      earmuff: 0,
      'push-walker': 0,
      'balance-bike': 0,
    },
  )
}
