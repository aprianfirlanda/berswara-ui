import { Suspense, type ComponentType } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { RouteErrorBoundary } from './components/routing/RouteErrorBoundary'
import { HomePage } from './pages/HomePage'
import {
  DeferredAboutPage,
  DeferredCatalogPage,
  DeferredContactPage,
  DeferredHowItWorksPage,
  DeferredNotFoundPage,
  DeferredProductDetailPage,
} from './pages/deferredPages'

function deferredPage(Page: ComponentType) {
  return (
    <Suspense
      fallback={
        <div className="route-loading" role="status" aria-live="polite">
          Memuat halaman…
        </div>
      }
    >
      <Page />
    </Suspense>
  )
}

const developmentRoutes = import.meta.env.DEV
  ? [
      {
        path: '__components',
        lazy: async () => {
          const { RentalComponentsStoryPage } = await import(
            './pages/RentalComponentsStoryPage'
          )
          return { Component: RentalComponentsStoryPage }
        },
      },
    ]
  : []

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: deferredPage(DeferredCatalogPage) },
      {
        path: 'products/:productSlug',
        element: deferredPage(DeferredProductDetailPage),
      },
      { path: 'how-it-works', element: deferredPage(DeferredHowItWorksPage) },
      { path: 'about', element: deferredPage(DeferredAboutPage) },
      { path: 'contact', element: deferredPage(DeferredContactPage) },
      ...developmentRoutes,
      { path: '*', element: deferredPage(DeferredNotFoundPage) },
    ],
  },
])
