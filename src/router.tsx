import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { RouteErrorBoundary } from './components/routing/RouteErrorBoundary'
import { AboutPage } from './pages/AboutPage'
import { CatalogPage } from './pages/CatalogPage'
import { ContactPage } from './pages/ContactPage'
import { HomePage } from './pages/HomePage'
import { HowItWorksPage } from './pages/HowItWorksPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { RentalComponentsStoryPage } from './pages/RentalComponentsStoryPage'

const developmentRoutes = import.meta.env.DEV
  ? [{ path: '__components', element: <RentalComponentsStoryPage /> }]
  : []

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'catalog', element: <CatalogPage /> },
      { path: 'products/:productSlug', element: <ProductDetailPage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'contact', element: <ContactPage /> },
      ...developmentRoutes,
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])
