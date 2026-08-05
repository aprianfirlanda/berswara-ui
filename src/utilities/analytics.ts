export type AnalyticsEvent =
  | {
      name: 'home_catalog_cta_clicked'
      properties: { placement: 'hero' | 'featured' | 'final-cta' }
    }
  | {
      name: 'catalog_category_selected'
      properties: { category: string }
    }
  | {
      name: 'catalog_search_used'
      properties: Record<string, never>
    }
  | {
      name: 'catalog_sort_selected'
      properties: { sort: string }
    }
  | {
      name: 'product_detail_viewed'
      properties: { productSlug: string; category: string }
    }
  | {
      name: 'how_it_works_viewed'
      properties: Record<string, never>
    }
  | {
      name: 'whatsapp_inquiry_clicked'
      properties: {
        source: string
        variant: string
        productSlug?: string
        category?: string
      }
    }

export type AnalyticsSink = (event: AnalyticsEvent) => void

let analyticsSink: AnalyticsSink | undefined
let hasAnalyticsConsent = false
const dispatchedEvents = new Set<string>()

function eventKey(event: AnalyticsEvent) {
  return `${event.name}:${JSON.stringify(event.properties)}`
}

/**
 * A provider is deliberately opt-in. Call this only after the visitor has
 * granted the consent required for the selected analytics provider.
 */
export function configureAnalytics({
  consent,
  sink,
}: {
  consent: boolean
  sink?: AnalyticsSink
}) {
  hasAnalyticsConsent = consent
  analyticsSink = sink
}

export function trackAnalyticsEvent(event: AnalyticsEvent) {
  const key = eventKey(event)
  if (dispatchedEvents.has(key)) return false

  dispatchedEvents.add(key)

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<AnalyticsEvent>('berswara:analytics', { detail: event }),
    )
  }

  if (!hasAnalyticsConsent || !analyticsSink) return true

  try {
    analyticsSink(event)
  } catch {
    // Analytics must never interrupt navigation, search, or an inquiry.
  }

  return true
}

export function resetAnalyticsForTesting() {
  analyticsSink = undefined
  hasAnalyticsConsent = false
  dispatchedEvents.clear()
}
