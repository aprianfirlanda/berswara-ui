import { afterEach, expect, test } from 'bun:test'
import {
  configureAnalytics,
  resetAnalyticsForTesting,
  trackAnalyticsEvent,
} from '../src/utilities/analytics'

afterEach(resetAnalyticsForTesting)

test('analytics sends only once after consent is granted', () => {
  const events: string[] = []
  configureAnalytics({
    consent: true,
    sink: (event) => events.push(JSON.stringify(event)),
  })

  const event = {
    name: 'product_detail_viewed' as const,
    properties: { productSlug: 'cybex-libelle', category: 'stroller' },
  }

  expect(trackAnalyticsEvent(event)).toBe(true)
  expect(trackAnalyticsEvent(event)).toBe(false)
  expect(events).toEqual([JSON.stringify(event)])
})

test('analytics does not send without consent and never propagates provider failures', () => {
  const events: string[] = []
  configureAnalytics({
    consent: false,
    sink: (event) => events.push(event.name),
  })

  expect(
    trackAnalyticsEvent({ name: 'catalog_search_used', properties: {} }),
  ).toBe(true)
  expect(events).toEqual([])

  resetAnalyticsForTesting()
  configureAnalytics({
    consent: true,
    sink: () => {
      throw new Error('provider unavailable')
    },
  })

  expect(() =>
    trackAnalyticsEvent({
      name: 'home_catalog_cta_clicked',
      properties: { placement: 'hero' },
    }),
  ).not.toThrow()
})
