import { expect, test } from '@playwright/test'

test('a customer can discover a product and prepare a WhatsApp availability inquiry', async ({
  page,
}) => {
  await page.goto('/')

  await page.getByRole('link', { name: 'Lihat katalog sewa' }).click()
  await expect(page).toHaveURL(/\/catalog$/)

  await page.getByRole('link', { name: 'Cybex Libelle' }).first().click()
  await expect(page).toHaveURL(/\/products\/cybex-libelle$/)

  await page.getByRole('link', { name: 'Tanyakan ketersediaan' }).click()
  await expect(page).toHaveURL(/\/contact\?product=cybex-libelle$/)

  const whatsAppHref = await page
    .getByRole('link', { name: 'Buka WhatsApp' })
    .getAttribute('href')

  expect(whatsAppHref).toBeTruthy()
  const whatsAppUrl = new URL(whatsAppHref!)
  expect(whatsAppUrl.hostname).toBe('wa.me')
  expect(whatsAppUrl.pathname).toBe('/6281991582500')
  expect(whatsAppUrl.searchParams.get('text')).toContain('Cybex Libelle')
  expect(whatsAppUrl.searchParams.get('text')).toContain('Tanggal mulai:')
  expect(whatsAppUrl.searchParams.get('text')).toContain(
    'perlu dikonfirmasi Berswara sebelum reservasi disetujui',
  )
})

test('mobile navigation opens, routes, and closes after a selection', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')

  const menuButton = page.getByRole('button', { name: 'Buka menu utama' })
  await menuButton.click()
  await expect(
    page.getByRole('button', { name: 'Tutup menu utama' }),
  ).toHaveAttribute('aria-expanded', 'true')

  await page
    .getByRole('navigation', { name: 'Navigasi utama' })
    .getByRole('link', { name: 'Katalog' })
    .click()
  await expect(page).toHaveURL(/\/catalog$/)
  await expect(
    page.getByRole('button', { name: 'Buka menu utama' }),
  ).toHaveAttribute('aria-expanded', 'false')
})
