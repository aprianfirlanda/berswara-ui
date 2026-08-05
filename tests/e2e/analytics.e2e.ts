import { expect, test } from '@playwright/test'

test('public discovery and inquiry paths emit only privacy-safe analytics events', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const eventWindow = window as typeof window & {
      analyticsEvents?: Array<{ name: string; properties: Record<string, unknown> }>
    }
    eventWindow.analyticsEvents = []
    window.addEventListener('berswara:analytics', (event) => {
      eventWindow.analyticsEvents?.push(
        (event as CustomEvent<{ name: string; properties: Record<string, unknown> }>).detail,
      )
    })
  })

  await page.goto('/')
  await page.getByRole('link', { name: 'Lihat katalog sewa' }).first().click()
  await expect(page).toHaveURL(/\/catalog$/)

  await page.getByRole('button', { name: /Stroller/ }).click()
  await page.getByLabel('Cari produk sewa').fill('cybex')

  const events = await page.evaluate(() =>
    (window as typeof window & {
      analyticsEvents?: Array<{ name: string; properties: Record<string, unknown> }>
    }).analyticsEvents,
  )

  expect(events).toContainEqual({
    name: 'home_catalog_cta_clicked',
    properties: { placement: 'hero' },
  })
  expect(events).toContainEqual({
    name: 'catalog_category_selected',
    properties: { category: 'stroller' },
  })
  expect(events).toContainEqual({
    name: 'catalog_search_used',
    properties: {},
  })
  expect(JSON.stringify(events)).not.toContain('cybex')
})

test('product views are deduplicated and WhatsApp events contain no message data', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const eventWindow = window as typeof window & {
      analyticsEvents?: Array<{ name: string; properties: Record<string, unknown> }>
    }
    eventWindow.analyticsEvents = []
    window.addEventListener('berswara:analytics', (event) => {
      eventWindow.analyticsEvents?.push(
        (event as CustomEvent<{ name: string; properties: Record<string, unknown> }>).detail,
      )
    })
  })

  await page.goto('/products/cybex-libelle')
  await expect(page.getByRole('heading', { name: 'Cybex Libelle' })).toBeVisible()
  await page.getByRole('link', { name: 'Tanyakan ketersediaan' }).click()
  await expect(page).toHaveURL(/\/contact\?product=cybex-libelle$/)
  await page.getByRole('link', { name: 'Buka WhatsApp' }).click()

  const events = await page.evaluate(() =>
    (window as typeof window & {
      analyticsEvents?: Array<{ name: string; properties: Record<string, unknown> }>
    }).analyticsEvents,
  )
  const productViews = events?.filter(
    (event) => event.name === 'product_detail_viewed',
  )
  const whatsapp = events?.find(
    (event) => event.name === 'whatsapp_inquiry_clicked',
  )

  expect(productViews).toEqual([
    {
      name: 'product_detail_viewed',
      properties: { productSlug: 'cybex-libelle', category: 'stroller' },
    },
  ])
  expect(whatsapp).toEqual({
    name: 'whatsapp_inquiry_clicked',
    properties: {
      source: 'product-contact',
      variant: 'product-availability',
      productSlug: 'cybex-libelle',
      category: 'stroller',
    },
  })
  expect(JSON.stringify(whatsapp)).not.toContain('Tanggal')
  expect(JSON.stringify(whatsapp)).not.toContain('628199')
})
