import { expect, test } from '@playwright/test'

const directRoutes = [
  '/',
  '/catalog',
  '/products/cybex-libelle',
  '/how-it-works',
  '/about',
  '/contact',
]

test('deployed public routes and the primary rental inquiry flow are healthy', async ({
  page,
}) => {
  for (const route of directRoutes) {
    await page.goto(route)
    await expect(page.locator('main#main-content')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
  }

  await page.goto('/catalog')
  await page.getByRole('link', { name: 'Cybex Libelle' }).first().click()
  await expect(page).toHaveURL(/\/products\/cybex-libelle$/)
  await page.getByRole('link', { name: 'Tanyakan ketersediaan' }).click()
  await expect(page).toHaveURL(/\/contact\?product=cybex-libelle$/)

  const whatsAppHref = await page
    .getByRole('link', { name: 'Buka WhatsApp' })
    .getAttribute('href')
  expect(new URL(whatsAppHref!).hostname).toBe('wa.me')
})
