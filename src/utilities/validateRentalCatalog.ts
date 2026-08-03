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
      const hasPendingRequiredContent =
        product.contentStatus !== 'approved' ||
        product.rateOptions.some((rate) => rate.status !== 'approved') ||
        product.minimumRentalDuration.status !== 'approved' ||
        product.deposit.status !== 'approved' ||
        product.availability.status !== 'approved' ||
        product.includedItems.status !== 'approved' ||
        product.condition.status !== 'approved' ||
        product.hygiene.status !== 'approved' ||
        product.logistics.status !== 'approved'

      if (hasPendingRequiredContent) {
        errors.push(`${product.slug}: draft content cannot be published`)
      }

      if (product.includedItems.items.length === 0) {
        errors.push(`${product.slug}: published products need included items`)
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
