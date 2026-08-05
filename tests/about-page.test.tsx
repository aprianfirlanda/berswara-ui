import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { berswaraBusiness } from '../src/config/business'
import { AboutPage } from '../src/pages/AboutPage'

describe('About Berswara page', () => {
  test('explains temporary-use rental without promising an automatic booking', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    )

    expect(markup).toContain('masa pakai yang sementara')
    expect(markup).toContain('tidak menganggap pertanyaan sebagai booking')
    expect(markup).toContain('sebelum reservasi disetujui')
  })

  test('states the approved preparation, inspection, and service logistics', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    )

    expect(markup).toContain('kondisi unit, kelengkapan, kebersihan, dan pemeriksaan')
    expect(markup).toContain('Detail unit dan serah terima')
    expect(markup).toContain(berswaraBusiness.serviceArea)
    expect(markup).toContain(berswaraBusiness.delivery)
    expect(markup).toContain(berswaraBusiness.pickup)
  })

  test('uses real product images and exposes Catalog and Contact actions', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    )

    expect(markup).toContain('alt="Stroller lipat Cybex Libelle')
    expect(markup).toContain('alt="Push walker Fisher-Price berbentuk zebra')
    expect(markup).toContain('href="/catalog"')
    expect(markup).toContain('href="/contact"')
  })
})
