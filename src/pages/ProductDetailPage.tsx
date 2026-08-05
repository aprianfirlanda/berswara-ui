import { useParams } from 'react-router-dom'
import { getPublishedRentalProducts } from '../data/rentalProducts'
import { berswaraBusiness } from '../config/business'
import { getCanonicalUrl } from '../config/site'
import type { RentalProduct } from '../types/catalog'
import {
  getRelatedRentalProducts,
  getRentalProductFromSource,
} from '../utilities/productDetail'
import { NotFoundPage } from './NotFoundPage'
import { RentalProductDetail } from './RentalProductDetail'
import { useDocumentMetadata } from '../utilities/useDocumentMetadata'

export function ProductDetailPage() {
  const { productSlug = '' } = useParams()
  const sourceProducts = getPublishedRentalProducts()
  const product = getRentalProductFromSource(productSlug, sourceProducts)

  if (!product) {
    return <NotFoundPage />
  }

  return <ProductDetailContent product={product} sourceProducts={sourceProducts} />
}

function ProductDetailContent({
  product,
  sourceProducts,
}: {
  product: RentalProduct
  sourceProducts: ReturnType<typeof getPublishedRentalProducts>
}) {

  const path = `/products/${product.slug}`
  const image = product.images[0].sources.large

  useDocumentMetadata({
    title: `Sewa ${product.name} | Berswara`,
    description: `${product.summary} Ketersediaan tanggal rental dikonfirmasi Berswara melalui WhatsApp.`,
    path,
    image,
    type: 'product',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: `Rental ${product.name}`,
      description: product.summary,
      serviceType: 'Rental perlengkapan bayi',
      url: getCanonicalUrl(path),
      image: new URL(image, getCanonicalUrl(path)).toString(),
      provider: {
        '@type': 'Organization',
        name: 'Berswara',
      },
      areaServed: berswaraBusiness.serviceArea,
      offers: {
        '@type': 'Offer',
        price: Math.min(
          ...product.rateOptions
            .map((rate) => rate.amount)
            .filter((amount): amount is number => amount !== null),
        ),
        priceCurrency: 'IDR',
        url: getCanonicalUrl(path),
      },
    },
  })

  return (
    <RentalProductDetail
      product={product}
      relatedProducts={getRelatedRentalProducts(product, sourceProducts)}
    />
  )
}
