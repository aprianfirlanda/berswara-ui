import { useParams } from 'react-router-dom'
import { getPublishedRentalProducts } from '../data/rentalProducts'
import {
  getRelatedRentalProducts,
  getRentalProductFromSource,
} from '../utilities/productDetail'
import { NotFoundPage } from './NotFoundPage'
import { RentalProductDetail } from './RentalProductDetail'

export function ProductDetailPage() {
  const { productSlug = '' } = useParams()
  const sourceProducts = getPublishedRentalProducts()
  const product = getRentalProductFromSource(productSlug, sourceProducts)

  if (!product) {
    return <NotFoundPage />
  }

  return (
    <RentalProductDetail
      product={product}
      relatedProducts={getRelatedRentalProducts(product, sourceProducts)}
    />
  )
}
