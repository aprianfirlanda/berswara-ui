import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from '../components'
import { berswaraBusiness } from '../config/business'
import { getRentalProductBySlug } from '../data/rentalProducts'
import type { RentalProduct } from '../types/catalog'
import { useDocumentMetadata } from '../utilities/useDocumentMetadata'
import {
  buildWhatsAppUrl,
  trackWhatsAppInquiry,
  type WhatsAppInquiryVariant,
} from '../utilities/whatsapp'
import '../styles/contact.css'

export function ContactPage() {
  const [searchParams] = useSearchParams()
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'failed'>(
    'idle',
  )
  const product: RentalProduct | undefined = getRentalProductBySlug(
    searchParams.get('product') ?? '',
  )
  const variant: WhatsAppInquiryVariant = product
    ? product.availability.indicator === 'currently-unavailable'
      ? 'unavailable-next-date'
      : 'product-availability'
    : 'general'
  const origin = typeof window === 'undefined' ? undefined : window.location.origin
  const whatsAppUrl = buildWhatsAppUrl({
    variant,
    productName: product?.name,
    productSlug: product?.slug,
    origin,
  })
  const alternativeWhatsAppUrl = product
    ? buildWhatsAppUrl({
        variant: 'unavailable-alternative',
        productName: product.name,
        productSlug: product.slug,
        origin,
      })
    : null

  useDocumentMetadata({ title: 'Kontak & Layanan | Berswara' })

  const copyPhoneNumber = async () => {
    try {
      await navigator.clipboard.writeText(berswaraBusiness.whatsapp.display)
      setCopyStatus('copied')
    } catch {
      setCopyStatus('failed')
    }
  }

  return (
    <article className="contact-page">
      <header className="contact-hero">
        <div>
          <p className="eyebrow">Kontak Berswara</p>
          <h1>
            Tanyakan produk dan tanggal sewa lewat kanal resmi kami.
          </h1>
          <p className="contact-hero-copy">
            Berswara melayani rental perlengkapan bayi di Kota Bandung.
            Ketersediaan, total biaya, deposit, dan logistik selalu dikonfirmasi
            sebelum reservasi disetujui.
          </p>
          {product ? (
            <div className="contact-product-context" role="status">
              <span>Produk yang ditanyakan</span>
              <strong>{product.name}</strong>
              <Link to={`/products/${product.slug}?preview=draft`}>
                Lihat kembali detail produk
              </Link>
            </div>
          ) : null}
        </div>

        <section className="contact-chat-card" aria-labelledby="chat-heading">
          <p className="contact-card-kicker">WhatsApp resmi</p>
          <h2 id="chat-heading">{berswaraBusiness.whatsapp.display}</h2>
          <p>
            Pesan sudah disiapkan untuk membantu Berswara memahami kebutuhan
            dan tanggal sewa kamu.
          </p>
          <a
            className="ui-button ui-button-primary ui-button-regular contact-whatsapp-link"
            href={whatsAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackWhatsAppInquiry({
                source: product ? 'product-contact' : 'contact-page',
                variant,
                productSlug: product?.slug,
              })
            }
          >
            <span>Buka WhatsApp</span>
          </a>
          {product?.availability.indicator === 'currently-unavailable' &&
          alternativeWhatsAppUrl ? (
            <a
              className="ui-button ui-button-ghost ui-button-regular contact-whatsapp-link"
              href={alternativeWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWhatsAppInquiry({
                  source: 'product-contact-alternative',
                  variant: 'unavailable-alternative',
                  productSlug: product.slug,
                })
              }
            >
              <span>Minta alternatif produk</span>
            </a>
          ) : null}
          <Button variant="secondary" onClick={copyPhoneNumber}>
            Salin nomor WhatsApp
          </Button>
          <p className="contact-copy-status" aria-live="polite">
            {copyStatus === 'copied'
              ? 'Nomor WhatsApp berhasil disalin.'
              : copyStatus === 'failed'
                ? `Salin manual nomor ${berswaraBusiness.whatsapp.display}.`
                : 'Gunakan tombol salin jika WhatsApp tidak dapat dibuka.'}
          </p>
        </section>
      </header>

      <section className="contact-service-section" aria-labelledby="service-heading">
        <div className="contact-section-heading">
          <p className="eyebrow">Informasi layanan</p>
          <h2 id="service-heading">Sebelum mengirim pertanyaan.</h2>
        </div>
        <dl className="contact-service-grid">
          <div>
            <dt>Jam layanan</dt>
            <dd>{berswaraBusiness.hours}</dd>
          </div>
          <div>
            <dt>Area layanan</dt>
            <dd>{berswaraBusiness.serviceArea}</dd>
          </div>
          <div>
            <dt>Delivery</dt>
            <dd>{berswaraBusiness.delivery}</dd>
          </div>
          <div>
            <dt>Pickup</dt>
            <dd>{berswaraBusiness.pickup}</dd>
          </div>
          <div>
            <dt>Alamat publik</dt>
            <dd>
              Berswara tidak mempublikasikan alamat. Instruksi pickup diberikan
              setelah koordinasi melalui WhatsApp.
            </dd>
          </div>
          <div>
            <dt>Instagram</dt>
            <dd>
              <a
                href={berswaraBusiness.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {berswaraBusiness.instagram.handle}
              </a>
            </dd>
          </div>
        </dl>
      </section>

      <aside className="contact-reservation-note">
        <strong>Pesan WhatsApp belum menjadi reservasi.</strong>
        <p>
          Rental baru dikonfirmasi setelah Berswara menyetujui tanggal, total
          biaya, deposit, logistik, persyaratan penyewa, dan ketentuan yang
          berlaku.
        </p>
      </aside>
    </article>
  )
}
