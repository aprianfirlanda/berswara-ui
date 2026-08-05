import { lazy } from 'react'

export const DeferredCatalogPage = lazy(() =>
  import('./CatalogPage').then((module) => ({ default: module.CatalogPage })),
)

export const DeferredProductDetailPage = lazy(() =>
  import('./ProductDetailPage').then((module) => ({
    default: module.ProductDetailPage,
  })),
)

export const DeferredHowItWorksPage = lazy(() =>
  import('./HowItWorksPage').then((module) => ({
    default: module.HowItWorksPage,
  })),
)

export const DeferredAboutPage = lazy(() =>
  import('./AboutPage').then((module) => ({ default: module.AboutPage })),
)

export const DeferredContactPage = lazy(() =>
  import('./ContactPage').then((module) => ({ default: module.ContactPage })),
)

export const DeferredNotFoundPage = lazy(() =>
  import('./NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)
