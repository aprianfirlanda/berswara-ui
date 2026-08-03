import type { RentalProduct } from './catalog'

// This fixture must remain a TypeScript error: required catalog fields are absent.
// @ts-expect-error RentalProduct deliberately rejects incomplete product data.
const incompleteProduct: RentalProduct = { slug: 'incomplete-product' }

void incompleteProduct
