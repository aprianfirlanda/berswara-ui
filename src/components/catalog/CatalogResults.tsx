import type { RentalProduct } from '../../types/catalog'
import { LoadingSkeleton } from '../feedback/LoadingSkeleton'
import { StatePanel } from '../feedback/StatePanel'
import { ProductCard } from './ProductCard'

export type CatalogLoadStatus = 'ready' | 'loading' | 'error'

export interface CatalogResultsProps {
  status: CatalogLoadStatus
  products: readonly RentalProduct[]
  hasActiveFilters: boolean
  onReset: () => void
  onRetry: () => void
  hasPublishedInventory: boolean
  productHrefSuffix?: string
}

export function CatalogResults({
  status,
  products,
  hasActiveFilters,
  onReset,
  onRetry,
  hasPublishedInventory,
  productHrefSuffix = '',
}: CatalogResultsProps) {
  if (status === 'loading') {
    return <LoadingSkeleton count={6} label="Memuat katalog sewa" />
  }

  if (status === 'error') {
    return (
      <StatePanel
        variant="error"
        title="Katalog belum dapat dimuat"
        description="Coba lagi. Jika masalah berlanjut, hubungi Berswara melalui halaman kontak."
        actionLabel="Coba lagi"
        onAction={onRetry}
      />
    )
  }

  if (products.length === 0 && hasActiveFilters) {
    return (
      <StatePanel
        variant="empty"
        title="Belum ada produk yang cocok"
        description="Coba kata kunci atau kategori lain, atau reset pencarian untuk melihat semua produk."
        actionLabel="Reset pencarian"
        onAction={onReset}
      />
    )
  }

  if (products.length === 0 && !hasPublishedInventory) {
    return (
      <StatePanel
        variant="info"
        title="Katalog sedang disiapkan"
        description="Detail produk dan ketentuan sewa sedang dikonfirmasi sebelum dipublikasikan."
        icon="…"
      />
    )
  }

  return (
    <div className="catalog-product-grid" aria-label="Daftar produk sewa">
      {products.map((product, index) => (
        <ProductCard
          key={product.slug}
          product={product}
          headingLevel={2}
          eagerImage={index === 0}
          to={`/products/${product.slug}${productHrefSuffix}`}
        />
      ))}
    </div>
  )
}
