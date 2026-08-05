import { Link } from 'react-router-dom'
import type { RentalProduct } from '../../types/catalog'
import { ResponsiveProductImage } from '../media/ResponsiveProductImage'
import { getRentalCategoryLabel } from '../../utilities/rentalPresentation'
import { AvailabilityBadge } from './AvailabilityBadge'
import { RentalRateBlock } from './RentalRateBlock'

export interface ProductCardProps {
  product: RentalProduct
  headingLevel?: 2 | 3
  eagerImage?: boolean
  to?: string
}

export function ProductCard({
  product,
  headingLevel = 3,
  eagerImage = false,
  to,
}: ProductCardProps) {
  const Heading = `h${headingLevel}` as const
  const href = to ?? `/products/${product.slug}`

  return (
    <article className="rental-product-card">
      <Link className="rental-product-media" to={href} tabIndex={-1} aria-hidden="true">
        <ResponsiveProductImage
          asset={product.images[0]}
          loading={eagerImage ? 'eager' : 'lazy'}
          fetchPriority={eagerImage ? 'high' : 'auto'}
        />
      </Link>
      <div className="rental-product-body">
        <div className="rental-product-meta">
          <span>{getRentalCategoryLabel(product.category)}</span>
          <AvailabilityBadge indicator={product.availability.indicator} compact />
        </div>
        <Heading className="rental-product-title">
          <Link to={href}>{product.name}</Link>
        </Heading>
        <p className="rental-product-summary">{product.summary}</p>
        <RentalRateBlock
          rateOptions={product.rateOptions}
          minimumDuration={product.minimumRentalDuration}
          compact
          heading={`Tarif ${product.name}`}
        />
        <Link className="rental-product-detail-link" to={href}>
          Lihat detail <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  )
}
