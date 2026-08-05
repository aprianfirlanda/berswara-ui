import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { berswaraBusiness } from '../src/config/business'
import { HowItWorksPage } from '../src/pages/HowItWorksPage'

function renderPage() {
  return renderToStaticMarkup(
    <MemoryRouter>
      <HowItWorksPage />
    </MemoryRouter>,
  )
}

describe('How It Works page', () => {
  test('explains the end-to-end rental journey without promising instant booking', () => {
    const markup = renderPage()

    expect(markup).toContain('Inquiry bukan reservasi')
    expect(markup).toContain('Tunggu konfirmasi Berswara')
    expect(markup).toContain('Sepakati detail rental')
    expect(markup).toContain('Terima, gunakan, kembalikan')
  })

  test('covers approved policy topics using keyboard-accessible disclosure controls', () => {
    const markup = renderPage()

    expect(markup.match(/<details/g)).toHaveLength(7)
    expect(markup).toContain('Minimum rental mengikuti produk')
    expect(markup).toContain('tidak memakai deposit')
    expect(markup).toContain('membatalkan, atau memperpanjang rental')
    expect(markup).toContain('kerusakan, atau aksesori yang belum lengkap')
    expect(markup).toContain('kebersihan, pemeriksaan, serta data penyewa')
    expect(markup).toContain('tidak ada proses pengembalian deposit')
  })

  test('uses the approved service area, delivery choices, Catalog, and WhatsApp actions', () => {
    const markup = renderPage()

    expect(markup).toContain(berswaraBusiness.serviceArea)
    expect(markup).toContain('Self-pickup')
    expect(markup).toContain('Kurir instan')
    expect(markup).toContain('Kurir toko')
    expect(markup).toContain('Titik temu')
    expect(markup).toContain('href="/catalog"')
    expect(markup).toContain(`https://wa.me/${berswaraBusiness.whatsapp.digits}`)
  })
})
