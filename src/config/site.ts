const configuredSiteUrl = import.meta.env.VITE_SITE_URL?.trim()

export const berswaraSite = {
  name: 'Berswara',
  defaultDescription:
    'Rental stroller, earmuff, push walker, dan balance bike untuk keluarga di Kota Bandung dan Kabupaten Bandung.',
  defaultImage: '/assets/products/cybex-libelle-1200.webp',
  // Override the production Vercel domain with VITE_SITE_URL when a custom
  // production domain is connected.
  url: (configuredSiteUrl || 'https://berswara-ui.vercel.app').replace(/\/+$/, ''),
} as const

export function getCanonicalUrl(path: string) {
  return new URL(path, `${berswaraSite.url}/`).toString()
}
