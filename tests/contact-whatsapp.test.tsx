import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { berswaraBusiness } from '../src/config/business'
import { rentalProducts } from '../src/data/rentalProducts'
import { ContactPage } from '../src/pages/ContactPage'
import {
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  getWhatsAppInquiryEventDetail,
} from '../src/utilities/whatsapp'

describe('WhatsApp rental inquiries', () => {
  test('builds a general inquiry without implying a confirmed reservation', () => {
    const message = buildWhatsAppMessage({ variant: 'general' })

    expect(message).toContain('rental perlengkapan bayi')
    expect(message).toContain('Tanggal mulai:')
    expect(message).toContain('Tanggal selesai:')
    expect(message).toContain('bukan konfirmasi reservasi')
  })

  test('includes product identity, canonical page URL, and date prompts', () => {
    const product = rentalProducts[0]
    const message = buildWhatsAppMessage({
      variant: 'product-availability',
      productName: product.name,
      productSlug: product.slug,
      origin: 'https://berswara.example',
    })

    expect(message).toContain(product.name)
    expect(message).toContain(
      `https://berswara.example/products/${product.slug}`,
    )
    expect(message).toContain('Tanggal mulai:')
    expect(message).toContain('Tanggal selesai:')
  })

  test('offers safe unavailable next-date and alternative variants', () => {
    const product = rentalProducts[0]
    const nextDate = buildWhatsAppMessage({
      variant: 'unavailable-next-date',
      productName: product.name,
      productSlug: product.slug,
    })
    const alternative = buildWhatsAppMessage({
      variant: 'unavailable-alternative',
      productName: product.name,
      productSlug: product.slug,
    })

    expect(nextDate).toContain('tanggal tersedia berikutnya')
    expect(alternative).toContain('meminta alternatif')
    expect(nextDate).not.toContain('booking berhasil')
    expect(alternative).not.toContain('booking berhasil')
  })

  test('uses the approved number and URL-encodes Indonesian message text', () => {
    const url = buildWhatsAppUrl({ variant: 'general' })
    const parsed = new URL(url)

    expect(parsed.hostname).toBe('wa.me')
    expect(parsed.pathname).toBe(`/${berswaraBusiness.whatsapp.digits}`)
    expect(parsed.searchParams.get('text')).toContain(
      'Halo Berswara, saya ingin bertanya',
    )
    expect(url).not.toContain(' ')
  })

  test('exposes an analytics hook without message contents', () => {
    const detail = getWhatsAppInquiryEventDetail({
      source: 'product-contact',
      variant: 'product-availability',
      productSlug: 'cybex-libelle',
    })

    expect(detail).toEqual({
      source: 'product-contact',
      variant: 'product-availability',
      productSlug: 'cybex-libelle',
    })
    expect('message' in detail).toBe(false)
  })
})

describe('Contact page', () => {
  test('renders approved contact, service, logistics, and social information', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter>
        <ContactPage />
      </MemoryRouter>,
    )

    expect(markup).toContain(berswaraBusiness.whatsapp.display)
    expect(markup).toContain(berswaraBusiness.hours)
    expect(markup).toContain(berswaraBusiness.serviceArea)
    expect(markup).toContain('Biaya mengikuti jarak')
    expect(markup).toContain('Lokasi dan waktu serah terima')
    expect(markup).toContain(berswaraBusiness.instagram.handle)
    expect(markup).toContain('target="_blank"')
    expect(markup).toContain('rel="noopener noreferrer"')
    expect(markup).not.toContain('Menunggu konfirmasi')
  })

  test('uses product query context for the primary inquiry', () => {
    const product = rentalProducts[0]
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={[`/contact?product=${product.slug}`]}>
        <ContactPage />
      </MemoryRouter>,
    )

    expect(markup).toContain(product.name)
    expect(markup).toContain('https://wa.me/6281991582500')
    expect(markup).toContain('Buka WhatsApp')
  })
})
