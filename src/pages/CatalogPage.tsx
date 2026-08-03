import { Link } from 'react-router-dom'
import { PagePlaceholder } from './PagePlaceholder'

export function CatalogPage() {
  return (
    <PagePlaceholder
      eyebrow="Katalog"
      title="Pilih perlengkapan yang ingin disewa."
      description="Pencarian, filter, harga, dan ketersediaan produk akan dibangun pada tiket katalog."
    >
      <Link className="text-link" to="/products/cocolatte-pockit-gen-7">
        Coba rute detail produk →
      </Link>
    </PagePlaceholder>
  )
}
