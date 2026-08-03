import { Link } from 'react-router-dom'
import { ResponsiveProductImage } from '../components/media/ResponsiveProductImage'
import { rentalProducts } from '../data/rentalProducts'
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
      <div className="asset-gallery" aria-label="Produk Berswara">
        {rentalProducts.map((product) => (
          <article className="asset-card" key={product.slug}>
            <ResponsiveProductImage asset={product.images[0]} />
            <h2>{product.name}</h2>
          </article>
        ))}
      </div>
    </PagePlaceholder>
  )
}
