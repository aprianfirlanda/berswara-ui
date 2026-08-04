import type { RentalProduct } from '../types/catalog'

export function getHomeFeaturedProducts(
  products: readonly RentalProduct[],
  limit = 3,
) {
  const publishedProducts = products.filter((product) => product.published)
  const explicitlyFeatured = publishedProducts.filter(
    (product) => product.featured,
  )

  return (explicitlyFeatured.length > 0
    ? explicitlyFeatured
    : publishedProducts
  ).slice(0, limit)
}
