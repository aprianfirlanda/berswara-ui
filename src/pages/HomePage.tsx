import {
  ButtonLink,
  CategoryCard,
  ProcessSteps,
  ProductCard,
  ResponsiveProductImage,
} from '../components'
import {
  getPublishedRentalProducts,
  getRentalProductBySlug,
} from '../data/rentalProducts'
import type { RentalProduct } from '../types/catalog'
import { getHomeFeaturedProducts } from '../utilities/homePage'
import { trackAnalyticsEvent } from '../utilities/analytics'
import { useDocumentMetadata } from '../utilities/useDocumentMetadata'

const categories = [
  {
    category: 'stroller' as const,
    description: 'Teman jalan yang praktis untuk kebutuhan harian dan perjalanan.',
  },
  {
    category: 'earmuff' as const,
    description: 'Pelindung telinga dengan bantalan lembut untuk si kecil.',
  },
  {
    category: 'push-walker' as const,
    description: 'Dukungan bermain untuk tahap belajar berdiri dan berjalan.',
  },
  {
    category: 'balance-bike' as const,
    description: 'Permainan beroda untuk aktivitas motorik dan keseimbangan.',
  },
] as const

const rentalSteps = [
  {
    title: 'Pilih kebutuhan',
    description: 'Jelajahi kategori dan temukan perlengkapan yang sesuai.',
  },
  {
    title: 'Kirim tanggal',
    description: 'Sampaikan produk serta tanggal mulai dan selesai yang diinginkan.',
  },
  {
    title: 'Tunggu konfirmasi',
    description: 'Berswara memeriksa unit, biaya, deposit, dan pilihan serah terima.',
  },
  {
    title: 'Gunakan & kembalikan',
    description: 'Terima perlengkapan, gunakan sesuai panduan, lalu kembalikan tepat waktu.',
  },
] as const

function requireHeroProduct(slug: string): RentalProduct {
  const product = getRentalProductBySlug(slug)

  if (!product) {
    throw new Error(`Missing Home hero product: ${slug}`)
  }

  return product
}

const heroProducts = [
  requireHeroProduct('cybex-libelle'),
  requireHeroProduct('scoora-cronos-lite'),
  requireHeroProduct('fisher-price-zebra-walker'),
]

export function HomePage() {
  useDocumentMetadata({
    title: 'Berswara | Rental perlengkapan bayi Bandung',
    description:
      'Sewa stroller, earmuff, push walker, dan balance bike untuk keluarga di Kota Bandung dan Kabupaten Bandung.',
  })
  const featuredProducts = getHomeFeaturedProducts(
    getPublishedRentalProducts(),
  )

  return (
    <div className="home-page">
      <section className="home-hero" aria-labelledby="home-heading">
        <div className="home-hero-copy">
          <p className="eyebrow">Rental perlengkapan bayi</p>
          <h1 id="home-heading">
            Kebutuhan si kecil, <span>sewa seperlunya.</span>
          </h1>
          <p className="home-hero-intro">
            Berswara menyewakan stroller, earmuff, push walker, dan balance
            bike untuk menemani keluarga tanpa harus membeli semuanya.
          </p>
          <div className="home-hero-actions">
            <ButtonLink
              to="/catalog"
              onClick={() =>
                trackAnalyticsEvent({
                  name: 'home_catalog_cta_clicked',
                  properties: { placement: 'hero' },
                })
              }
            >
              Lihat katalog sewa
            </ButtonLink>
            <ButtonLink to="/how-it-works" variant="secondary">
              Pelajari cara sewa
            </ButtonLink>
          </div>
          <p className="home-inquiry-note">
            Permintaan tanggal belum menjadi reservasi. Berswara akan
            mengonfirmasi ketersediaan dan ketentuan terlebih dahulu.
          </p>
        </div>

        <div className="home-hero-collage" aria-label="Pilihan perlengkapan Berswara">
          <span className="home-collage-shape home-collage-shape-one" aria-hidden="true" />
          <span className="home-collage-shape home-collage-shape-two" aria-hidden="true" />
          {heroProducts.map((product, index) => (
            <figure
              key={product.slug}
              className={`home-collage-card home-collage-card-${index + 1}`}
            >
              <ResponsiveProductImage
                asset={product.images[0]}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'low'}
                sizes="(max-width: 560px) 42vw, (max-width: 960px) 28vw, 260px"
              />
              <figcaption>{product.name}</figcaption>
            </figure>
          ))}
          <div className="home-collage-sticker" aria-hidden="true">
            <span>4</span>
            kategori
          </div>
        </div>
      </section>

      <section className="home-trust-strip" aria-label="Keunggulan layanan Berswara">
        <div>
          <strong>Sewa, bukan beli</strong>
          <span>Pakai selama keluarga membutuhkan.</span>
        </div>
        <div>
          <strong>Konfirmasi manusia</strong>
          <span>Tanggal dan detail diperiksa sebelum reservasi.</span>
        </div>
        <div>
          <strong>Informasi transparan</strong>
          <span>Biaya dan ketentuan disetujui sebelum booking.</span>
        </div>
      </section>

      <section className="home-section" aria-labelledby="home-categories-heading">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Jelajahi kategori</p>
            <h2 id="home-categories-heading">Temukan yang sedang dibutuhkan.</h2>
          </div>
          <ButtonLink to="/catalog" variant="ghost" size="compact">
            Lihat semua produk →
          </ButtonLink>
        </div>
        <div className="home-category-grid">
          {categories.map((item) => (
            <CategoryCard
              key={item.category}
              category={item.category}
              description={item.description}
            />
          ))}
        </div>
      </section>

      <section
        className="home-section home-featured-section"
        aria-labelledby="home-featured-heading"
      >
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Pilihan Berswara</p>
            <h2 id="home-featured-heading">Produk pilihan untuk keluarga.</h2>
          </div>
          {featuredProducts.length > 0 ? (
            <ButtonLink
              to="/catalog"
              variant="ghost"
              size="compact"
              onClick={() =>
                trackAnalyticsEvent({
                  name: 'home_catalog_cta_clicked',
                  properties: { placement: 'featured' },
                })
              }
            >
              Buka katalog →
            </ButtonLink>
          ) : null}
        </div>

        {featuredProducts.length > 0 ? (
          <div className="home-featured-grid">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.slug}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="home-featured-pending">
            <div className="home-featured-pending-mark" aria-hidden="true">
              ✦
            </div>
            <div>
              <h3>Katalog sedang disiapkan</h3>
              <p>
                Detail tarif, durasi, dan ketersediaan akan tampil setelah
                informasi rental selesai dikonfirmasi Berswara.
              </p>
            </div>
            <ButtonLink to="/catalog" variant="secondary" size="compact">
              Lihat status katalog
            </ButtonLink>
          </div>
        )}
      </section>

      <section className="home-process" aria-labelledby="home-process-heading">
        <div className="home-process-intro">
          <p className="eyebrow">Cara sewa</p>
          <h2 id="home-process-heading">Dari pilih sampai kembali, tetap jelas.</h2>
          <p>
            Reservasi baru dikonfirmasi setelah produk, tanggal, biaya,
            deposit, dan cara serah terima disepakati bersama.
          </p>
          <ButtonLink to="/how-it-works" variant="secondary" size="compact">
            Lihat proses lengkap
          </ButtonLink>
        </div>
        <ProcessSteps steps={rentalSteps} heading="Empat langkah rental Berswara" />
      </section>

      <section className="home-final-cta" aria-labelledby="home-final-heading">
        <div>
          <p className="eyebrow">Mulai dari kebutuhanmu</p>
          <h2 id="home-final-heading">Cari perlengkapan yang pas untuk si kecil.</h2>
          <p>
            Jelajahi koleksi rental, lalu kirim produk dan tanggal pilihanmu
            untuk diperiksa Berswara.
          </p>
        </div>
        <ButtonLink
          to="/catalog"
          onClick={() =>
            trackAnalyticsEvent({
              name: 'home_catalog_cta_clicked',
              properties: { placement: 'final-cta' },
            })
          }
        >
          Jelajahi katalog sewa
        </ButtonLink>
      </section>
    </div>
  )
}
