import { useEffect, useRef } from 'react'
import { ButtonLink } from '../components'
import { BrandLogo } from '../components/media/BrandLogo'
import { useDocumentMetadata } from '../utilities/useDocumentMetadata'
import '../styles/not-found.css'

export function NotFoundPage() {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useDocumentMetadata({
    title: 'Halaman Tidak Ditemukan | Berswara',
    robots: 'noindex, nofollow',
  })

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  return (
    <section className="not-found-page" aria-labelledby="not-found-heading">
      <div className="not-found-copy">
        <p className="eyebrow">Ups, jalurnya berbeda</p>
        <p className="not-found-code" aria-hidden="true">
          404
        </p>
        <h1 id="not-found-heading" ref={headingRef} tabIndex={-1}>
          Halaman yang dicari belum ditemukan.
        </h1>
        <p className="not-found-description">
          Tautannya mungkin sudah berubah atau belum tersedia. Tenang, kamu
          tetap bisa menjelajahi perlengkapan rental Berswara atau menghubungi
          kami untuk meminta bantuan.
        </p>

        <div className="not-found-actions" aria-label="Pilihan pemulihan halaman">
          <ButtonLink to="/catalog">Jelajahi katalog</ButtonLink>
          <ButtonLink to="/" variant="secondary">
            Kembali ke beranda
          </ButtonLink>
          <ButtonLink to="/contact" variant="ghost">
            Hubungi Berswara
          </ButtonLink>
        </div>

        <p className="not-found-contact-note">
          Untuk pertanyaan umum, halaman Kontak akan menampilkan kanal resmi
          Berswara yang tersedia.
        </p>
      </div>

      <div className="not-found-visual" aria-hidden="true">
        <span className="not-found-orbit not-found-orbit-large" />
        <span className="not-found-orbit not-found-orbit-small" />
        <div className="not-found-logo-card">
          <BrandLogo />
          <span>Yuk, cari jalan kembali.</span>
        </div>
        <span className="not-found-paw not-found-paw-one">●</span>
        <span className="not-found-paw not-found-paw-two">●</span>
        <span className="not-found-star not-found-star-one">✦</span>
        <span className="not-found-star not-found-star-two">✦</span>
      </div>
    </section>
  )
}
