import {
  AvailabilityBadge,
  Breadcrumbs,
  ButtonLink,
  PolicySection,
  ProductCard,
  ProductGallery,
  RentalRateBlock,
} from '../components'
import type { RentalProduct } from '../types/catalog'
import { getRentalCategoryLabel } from '../utilities/rentalPresentation'
import '../styles/product-detail.css'

const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

function formatDeposit(product: RentalProduct) {
  return product.deposit.amount === null
    ? 'Dikonfirmasi Berswara'
    : idrFormatter.format(product.deposit.amount)
}

function getGuidanceFacts(product: RentalProduct) {
  const facts: Array<{ label: string; value: string }> = []
  const { guidance } = product

  if (guidance.minimumAgeMonths !== undefined) {
    facts.push({
      label: 'Usia minimum',
      value: `${guidance.minimumAgeMonths} bulan`,
    })
  }

  if (guidance.maximumAgeMonths !== undefined) {
    facts.push({
      label: 'Usia maksimum',
      value: `${guidance.maximumAgeMonths} bulan`,
    })
  }

  if (guidance.maximumWeightKg !== undefined) {
    facts.push({
      label: 'Berat maksimum',
      value: `${guidance.maximumWeightKg} kg`,
    })
  }

  if (guidance.stages.length > 0) {
    facts.push({
      label: 'Tahap penggunaan',
      value: guidance.stages.join(', '),
    })
  }

  return facts
}

export interface RentalProductDetailProps {
  product: RentalProduct
  relatedProducts: readonly RentalProduct[]
  isDraftPreview?: boolean
}

export function RentalProductDetail({
  product,
  relatedProducts,
  isDraftPreview = false,
}: RentalProductDetailProps) {
  const categoryLabel = getRentalCategoryLabel(product.category)
  const guidanceFacts = getGuidanceFacts(product)
  const isUnavailable =
    product.availability.indicator === 'currently-unavailable'
  const previewSuffix = isDraftPreview ? '?preview=draft' : ''
  const contactUrl = `/contact?product=${encodeURIComponent(product.slug)}`

  return (
    <article className="product-detail-page">
      {isDraftPreview ? (
        <div className="product-detail-preview-banner" role="status">
          Pratinjau development: data produk ini masih draft dan tidak dapat
          diakses melalui build production.
        </div>
      ) : null}

      <Breadcrumbs
        items={[
          { label: 'Beranda', to: '/' },
          { label: 'Katalog sewa', to: '/catalog' },
          { label: categoryLabel, to: `/catalog?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="product-detail-primary">
        <section
          className="product-detail-summary"
          aria-labelledby="product-detail-heading"
        >
          <div className="product-detail-meta">
            <span className="product-detail-category">{categoryLabel}</span>
            <AvailabilityBadge indicator={product.availability.indicator} />
          </div>
          <h1 id="product-detail-heading">{product.name}</h1>
          <p className="product-detail-lead">{product.summary}</p>

          {isUnavailable ? (
            <aside className="product-unavailable-note" role="status">
              <strong>Unit ini sedang tidak tersedia.</strong>
              <p>
                Tanyakan tanggal berikutnya atau lihat alternatif dari kategori
                yang sama. Permintaan belum menjadi reservasi.
              </p>
            </aside>
          ) : null}

          <aside className="product-date-note">
            <span aria-hidden="true">◷</span>
            <div>
              <strong>Tanggal pasti perlu dikonfirmasi</strong>
              <p>{product.availability.note}</p>
            </div>
          </aside>

          <RentalRateBlock
            rateOptions={product.rateOptions}
            minimumDuration={product.minimumRentalDuration}
            heading={`Tarif sewa ${product.name}`}
          />

          <section className="product-deposit-card" aria-labelledby="deposit-heading">
            <div>
              <p className="product-detail-kicker">Deposit refundable</p>
              <h2 id="deposit-heading">{formatDeposit(product)}</h2>
            </div>
            <p>{product.deposit.note}</p>
          </section>

          <div className="product-detail-actions">
            <ButtonLink to={contactUrl}>
              {isUnavailable
                ? 'Tanyakan tanggal berikutnya'
                : 'Tanyakan ketersediaan'}
            </ButtonLink>
            <ButtonLink to="/how-it-works" variant="secondary">
              Pelajari cara sewa
            </ButtonLink>
          </div>
          <p className="product-inquiry-disclaimer">
            Mengirim pertanyaan tidak langsung mengonfirmasi booking. Berswara
            akan menyampaikan total, deposit, logistik, dan ketentuan sebelum
            reservasi disetujui.
          </p>
        </section>

        <div className="product-detail-gallery">
          <ProductGallery images={product.images} productName={product.name} />
          <p className="product-gallery-caption">
            Foto produk digunakan sebagai referensi. Kondisi unit aktual
            didokumentasikan sebelum serah terima.
          </p>
        </div>
      </div>

      <section className="product-detail-description" aria-labelledby="about-product-heading">
        <p className="eyebrow">Tentang produk</p>
        <h2 id="about-product-heading">{product.summary}</h2>
        <p>{product.description}</p>
      </section>

      <div className="product-detail-facts-grid">
        <section className="product-detail-fact-card" aria-labelledby="features-heading">
          <p className="product-detail-kicker">Yang perlu diketahui</p>
          <h2 id="features-heading">Fitur utama</h2>
          <ul className="product-check-list">
            {product.features.map((feature) => (
              <li key={feature}>
                <span aria-hidden="true">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </section>

        <section className="product-detail-fact-card" aria-labelledby="suitability-heading">
          <p className="product-detail-kicker">Kesesuaian</p>
          <h2 id="suitability-heading">Panduan penggunaan</h2>
          {guidanceFacts.length > 0 ? (
            <dl className="product-detail-definition-list">
              {guidanceFacts.map((fact) => (
                <div key={fact.label}>
                  <dt>{fact.label}</dt>
                  <dd>{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p>Kesesuaian usia dan tahap penggunaan dikonfirmasi saat inquiry.</p>
          )}
          {product.guidance.note ? (
            <p className="product-detail-fact-note">{product.guidance.note}</p>
          ) : null}
        </section>
      </div>

      <section className="product-detail-specifications" aria-labelledby="specifications-heading">
        <div>
          <p className="eyebrow">Detail produk</p>
          <h2 id="specifications-heading">Spesifikasi & kelengkapan</h2>
        </div>
        <div className="product-specification-panels">
          <dl className="product-specification-list">
            {product.specifications.map((specification) => (
              <div key={specification.label}>
                <dt>{specification.label}</dt>
                <dd>{specification.value}</dd>
              </div>
            ))}
          </dl>
          <div className="product-included-items">
            <h3>Termasuk dalam sewa</h3>
            {product.includedItems.items.length > 0 ? (
              <ul>
                {product.includedItems.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>
                {product.includedItems.note
                  ?? 'Kelengkapan dikonfirmasi sebelum reservasi.'}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="product-detail-operations" aria-labelledby="operations-heading">
        <div className="product-section-heading">
          <p className="eyebrow">Sebelum disewa</p>
          <h2 id="operations-heading">Kondisi, kebersihan, dan serah terima.</h2>
        </div>
        <div className="product-policy-grid">
          <PolicySection title="Kondisi unit" eyebrow="Pemeriksaan" icon="◎">
            <p>{product.condition.value}</p>
          </PolicySection>
          <PolicySection title="Kebersihan" eyebrow="Perawatan" icon="✦">
            <p>{product.hygiene.value}</p>
          </PolicySection>
          <PolicySection title="Pengiriman atau pickup" eyebrow="Logistik" icon="↔">
            <p>{product.logistics.value}</p>
          </PolicySection>
        </div>
      </section>

      <section className="product-safety-section" aria-labelledby="safety-heading">
        <div>
          <p className="eyebrow">Penggunaan aman</p>
          <h2 id="safety-heading">Catatan perawatan & keselamatan</h2>
          <p>
            Ikuti petunjuk produsen dan pastikan produk sesuai dengan tahap
            perkembangan anak.
          </p>
        </div>
        <ul className="product-safety-list">
          {product.careAndSafetyNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section className="product-how-it-works" aria-labelledby="detail-process-heading">
        <div>
          <p className="eyebrow">Belum yakin?</p>
          <h2 id="detail-process-heading">Pahami proses rental sebelum bertanya.</h2>
          <p>
            Lihat cara konfirmasi tanggal, pembayaran, serah terima,
            pengembalian, pemeriksaan, dan penyelesaian deposit.
          </p>
        </div>
        <ButtonLink to="/how-it-works" variant="secondary">
          Baca cara sewa
        </ButtonLink>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="product-related-section" aria-labelledby="related-heading">
          <div className="product-section-heading product-section-heading-row">
            <div>
              <p className="eyebrow">Alternatif lain</p>
              <h2 id="related-heading">Produk yang mungkin sesuai.</h2>
            </div>
            <ButtonLink
              to={`/catalog?category=${product.category}`}
              variant="ghost"
              size="compact"
            >
              Lihat kategori {categoryLabel} →
            </ButtonLink>
          </div>
          <div className="product-related-grid">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard
                key={relatedProduct.slug}
                product={relatedProduct}
                to={`/products/${relatedProduct.slug}${previewSuffix}`}
              />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
