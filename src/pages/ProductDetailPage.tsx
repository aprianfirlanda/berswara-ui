import { useParams, useSearchParams } from 'react-router-dom'
import {
  getPublishedRentalProducts,
  rentalProducts,
} from '../data/rentalProducts'
import {
  getRelatedRentalProducts,
  getRentalProductFromSource,
} from '../utilities/productDetail'
import { NotFoundPage } from './NotFoundPage'
import { RentalProductDetail } from './RentalProductDetail'

export function ProductDetailPage() {
  const { productSlug = '' } = useParams()
  const [searchParams] = useSearchParams()
  const isDraftPreview =
    import.meta.env.DEV && searchParams.get('preview') === 'draft'
  const sourceProducts = isDraftPreview
    ? rentalProducts
    : getPublishedRentalProducts()
  const product = getRentalProductFromSource(productSlug, sourceProducts)

  if (!product) {
    return <NotFoundPage />
  }

  return (
    <RentalProductDetail
      product={product}
      relatedProducts={getRelatedRentalProducts(product, sourceProducts)}
      isDraftPreview={isDraftPreview}
    />
  )
}
