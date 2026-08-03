import { Link, useParams } from 'react-router-dom'
import { PagePlaceholder } from './PagePlaceholder'
import { toTitleCase } from '../utilities/toTitleCase'

export function ProductDetailPage() {
  const { productSlug = '' } = useParams()

  return (
    <PagePlaceholder
      eyebrow="Detail produk"
      title={toTitleCase(productSlug) || 'Produk Berswara'}
      description={`Stable product slug: ${productSlug || 'not provided'}`}
    >
      <Link className="text-link" to="/catalog">← Kembali ke katalog</Link>
    </PagePlaceholder>
  )
}
