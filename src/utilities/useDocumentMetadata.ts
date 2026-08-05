import { useEffect } from 'react'
import { getCanonicalUrl, berswaraSite } from '../config/site'

interface DocumentMetadataOptions {
  title: string
  description?: string
  path?: string
  image?: string
  type?: 'website' | 'product'
  robots?: string
  structuredData?: Record<string, unknown>
}

function upsertMeta(
  selector: string,
  attribute: 'name' | 'property',
  value: string,
) {
  const existing = document.querySelector<HTMLMetaElement>(selector)
  const meta = existing ?? document.createElement('meta')
  const previousContent = meta.content

  meta.setAttribute(attribute, selector.match(/="([^"]+)"/)?.[1] ?? '')
  meta.content = value

  if (!existing) document.head.append(meta)

  return () => {
    if (!existing) {
      meta.remove()
    } else {
      meta.content = previousContent
    }
  }
}

export function useDocumentMetadata({
  title,
  description = berswaraSite.defaultDescription,
  path = '/',
  image = berswaraSite.defaultImage,
  type = 'website',
  robots,
  structuredData,
}: DocumentMetadataOptions) {
  useEffect(() => {
    const previousTitle = document.title
    const existingRobots = document.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    )
    const previousRobots = existingRobots?.content
    const robotsMeta = existingRobots ?? document.createElement('meta')
    const createdRobotsMeta = !existingRobots
    const canonicalUrl = getCanonicalUrl(path)
    const absoluteImageUrl = new URL(image, canonicalUrl).toString()
    const cleanups = [
      upsertMeta('meta[name="description"]', 'name', description),
      upsertMeta('meta[property="og:title"]', 'property', title),
      upsertMeta('meta[property="og:description"]', 'property', description),
      upsertMeta('meta[property="og:type"]', 'property', type),
      upsertMeta('meta[property="og:url"]', 'property', canonicalUrl),
      upsertMeta('meta[property="og:image"]', 'property', absoluteImageUrl),
      upsertMeta('meta[name="twitter:card"]', 'name', 'summary_large_image'),
      upsertMeta('meta[name="twitter:title"]', 'name', title),
      upsertMeta('meta[name="twitter:description"]', 'name', description),
      upsertMeta('meta[name="twitter:image"]', 'name', absoluteImageUrl),
    ]
    const existingCanonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    )
    const canonical = existingCanonical ?? document.createElement('link')
    const previousCanonical = canonical.href
    const createdCanonical = !existingCanonical
    canonical.rel = 'canonical'
    canonical.href = canonicalUrl

    if (createdCanonical) document.head.append(canonical)

    const existingStructuredData = document.querySelector<HTMLScriptElement>(
      'script[data-seo-structured-data="true"]',
    )
    const structuredDataScript = structuredData
      ? existingStructuredData ?? document.createElement('script')
      : null
    const previousStructuredData = structuredDataScript?.textContent

    if (structuredDataScript && structuredData) {
      structuredDataScript.type = 'application/ld+json'
      structuredDataScript.dataset.seoStructuredData = 'true'
      structuredDataScript.textContent = JSON.stringify(structuredData)
      if (!existingStructuredData) document.head.append(structuredDataScript)
    }

    document.title = title

    if (robots) {
      robotsMeta.name = 'robots'
      robotsMeta.content = robots

      if (createdRobotsMeta) {
        document.head.append(robotsMeta)
      }
    }

    return () => {
      document.title = previousTitle
      cleanups.reverse().forEach((cleanup) => cleanup())

      if (createdCanonical) {
        canonical.remove()
      } else {
        canonical.href = previousCanonical
      }

      if (structuredDataScript) {
        if (!existingStructuredData) {
          structuredDataScript.remove()
        } else {
          structuredDataScript.textContent = previousStructuredData ?? ''
        }
      }

      if (robots) {
        if (createdRobotsMeta) {
          robotsMeta.remove()
        } else if (previousRobots !== undefined) {
          robotsMeta.content = previousRobots
        }
      }
    }
  }, [description, image, path, robots, structuredData, title, type])
}
