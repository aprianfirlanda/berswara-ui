import {
  rentalCategories,
  type RentalProduct,
} from '../types/catalog'

export function validateRentalCatalog(products: readonly RentalProduct[]) {
  const errors: string[] = []
  const slugs = new Set<string>()
  const categories = new Set(products.map((product) => product.category))

  for (const product of products) {
    if (slugs.has(product.slug)) {
      errors.push(`Duplicate product slug: ${product.slug}`)
    }
    slugs.add(product.slug)

    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.slug)) {
      errors.push(`Invalid product slug: ${product.slug}`)
    }

    if (product.rateOptions.length === 0) {
      errors.push(`${product.slug}: at least one rate option is required`)
    }

    for (const rate of product.rateOptions) {
      if (rate.currency !== 'IDR') {
        errors.push(`${product.slug}: rate ${rate.id} must use IDR`)
      }
      if (rate.status === 'approved' && (!rate.amount || rate.amount <= 0)) {
        errors.push(`${product.slug}: approved rate ${rate.id} needs a positive amount`)
      }
      if (rate.status === 'pending-approval' && rate.amount !== null) {
        errors.push(`${product.slug}: pending rate ${rate.id} must not expose an amount`)
      }
    }

    if (!product.availability.exactDateConfirmationRequired) {
      errors.push(`${product.slug}: exact dates must require Berswara confirmation`)
    }

    if (product.images.length === 0) {
      errors.push(`${product.slug}: at least one image is required`)
    }

    if (product.features.length === 0) {
      errors.push(`${product.slug}: at least one feature is required`)
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(product.updatedAt)) {
      errors.push(`${product.slug}: updatedAt must use YYYY-MM-DD`)
    }

    if (product.published) {
      if (product.contentStatus !== 'approved') {
        errors.push(`${product.slug}: descriptive content must be approved before publication`)
      }

      const pendingRateWithoutDisclosure = product.rateOptions.some(
        (rate) => rate.status === 'pending-approval' && !rate.note,
      )
      if (pendingRateWithoutDisclosure) {
        errors.push(`${product.slug}: pending public rates need a confirmation note`)
      }

      if (
        product.includedItems.status === 'approved'
        && product.includedItems.items.length === 0
      ) {
        errors.push(`${product.slug}: published products need included items`)
      }

      if (
        product.includedItems.status === 'pending-approval'
        && !product.includedItems.note
      ) {
        errors.push(`${product.slug}: pending included items need a confirmation note`)
      }
    }
  }

  for (const category of rentalCategories) {
    if (!categories.has(category)) {
      errors.push(`Missing required category: ${category}`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`Invalid rental catalog:\n${errors.join('\n')}`)
  }
}
