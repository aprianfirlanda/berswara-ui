import type { RentalProduct } from '../types/catalog'

export function getRentalProductFromSource(
  slug: string,
  products: readonly RentalProduct[],
) {
  return products.find((product) => product.slug === slug)
}

export function getRelatedRentalProducts(
  currentProduct: RentalProduct,
  products: readonly RentalProduct[],
  limit = 3,
) {
  return products
    .filter((product) => product.slug !== currentProduct.slug)
    .toSorted((left, right) => {
      const leftSameCategory = left.category === currentProduct.category
      const rightSameCategory = right.category === currentProduct.category

      if (leftSameCategory !== rightSameCategory) {
        return leftSameCategory ? -1 : 1
      }

      if (left.featured !== right.featured) {
        return left.featured ? -1 : 1
      }

      return left.name.localeCompare(right.name, 'id')
    })
    .slice(0, limit)
}
