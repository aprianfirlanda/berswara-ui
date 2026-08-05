import { expect, test } from '@playwright/test'

const publicRoutes = [
  '/',
  '/catalog',
  '/products/cybex-libelle',
  '/how-it-works',
  '/about',
  '/contact',
]

test('keyboard users can skip content and control the mobile menu', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Kebutuhan si kecil, sewa seperlunya.',
    }),
  ).toBeVisible()

  await page.keyboard.press('Tab')
  const skipLink = page.getByRole('link', { name: 'Lewati ke konten utama' })
  await expect(skipLink).toBeFocused()
  await expect(skipLink).toHaveCSS('outline-style', 'solid')

  await page.keyboard.press('Enter')
  await expect(page.locator('main#main-content')).toBeFocused()

  const menuButton = page.getByRole('button', { name: 'Buka menu utama' })
  await menuButton.focus()
  await page.keyboard.press('Enter')
  const closeMenuButton = page.getByRole('button', { name: 'Tutup menu utama' })
  await expect(closeMenuButton).toHaveAttribute('aria-expanded', 'true')
  await expect(
    page.getByRole('navigation', { name: 'Navigasi utama' }),
  ).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(page.getByRole('button', { name: 'Buka menu utama' })).toBeFocused()
  await expect(page.getByRole('button', { name: 'Buka menu utama' })).toHaveAttribute(
    'aria-expanded',
    'false',
  )
})

test('public pages retain landmarks, meaningful headings, and image text alternatives', async ({
  page,
}) => {
  for (const route of publicRoutes) {
    await page.goto(route)

    await expect(page.locator('main#main-content')).toHaveCount(1)
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1)
    await expect(page.locator('img:not([alt])')).toHaveCount(0)
  }
})

test('public layouts do not overflow at supported widths', async ({ page }) => {
  for (const viewport of [
    { width: 320, height: 800 },
    { width: 768, height: 900 },
    { width: 1440, height: 960 },
  ]) {
    await page.setViewportSize(viewport)

    for (const route of publicRoutes) {
      await page.goto(route)
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
          ),
        )
        .toBe(true)
    }
  }
})

test('reduced motion keeps the catalog usable without prolonged transitions', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/catalog')

  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'Temukan perlengkapan untuk kebutuhan si kecil.',
    }),
  ).toBeVisible()
  await expect(page.locator('.rental-product-card').first()).toHaveCSS(
    'transition-duration',
    '1e-05s',
  )
})
