import { useState } from 'react'
import {
  AvailabilityBadge,
  Breadcrumbs,
  Button,
  ButtonLink,
  CategoryCard,
  CategoryChip,
  ImageFallback,
  LoadingSkeleton,
  PolicySection,
  ProcessSteps,
  ProductCard,
  ProductGallery,
  RentalRateBlock,
  SearchInput,
  StatePanel,
} from '../components'
import { rentalProducts } from '../data/rentalProducts'
import type { RentalRateOption } from '../types/catalog'

const approvedRates: RentalRateOption[] = [
  {
    id: 'story-daily',
    label: 'Harian',
    amount: 75_000,
    currency: 'IDR',
    duration: { value: 1, unit: 'day' },
    status: 'approved',
  },
  {
    id: 'story-weekly',
    label: 'Mingguan',
    amount: 350_000,
    currency: 'IDR',
    duration: { value: 1, unit: 'week' },
    status: 'approved',
  },
]

const storySteps = [
  { title: 'Pilih produk', description: 'Lihat detail, tarif, dan durasi sewa.' },
  { title: 'Kirim tanggal', description: 'Sampaikan tanggal mulai dan selesai.' },
  { title: 'Konfirmasi', description: 'Berswara mengonfirmasi unit dan biaya.' },
  { title: 'Pakai & kembali', description: 'Gunakan lalu kembalikan sesuai jadwal.' },
]

export function RentalComponentsStoryPage() {
  const [query, setQuery] = useState('stroller')
  const galleryAsset = rentalProducts[0].images[0]
  const galleryImages = [
    galleryAsset,
    {
      ...galleryAsset,
      slug: `${galleryAsset.slug}-alternate`,
      name: `${galleryAsset.name} alternatif`,
    },
  ]

  return (
    <section className="component-story-page">
      <header className="component-story-header">
        <p className="eyebrow">APR-11 · Development story</p>
        <h1>Komponen rental Berswara</h1>
        <p>Halaman ini hanya tersedia pada development untuk memeriksa varian komponen.</p>
      </header>

      <section className="component-story-section">
        <h2>Actions</h2>
        <div className="component-story-row">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button isLoading loadingLabel="Memeriksa…">Loading</Button>
          <Button disabled>Disabled</Button>
          <ButtonLink to="/catalog">Button link</ButtonLink>
        </div>
      </section>

      <section className="component-story-section">
        <h2>Availability and rates</h2>
        <div className="component-story-row">
          <AvailabilityBadge indicator="available-to-request" />
          <AvailabilityBadge indicator="limited-availability" />
          <AvailabilityBadge indicator="currently-unavailable" />
        </div>
        <div className="component-story-grid component-story-grid-two">
          <RentalRateBlock
            rateOptions={approvedRates}
            minimumDuration={{ value: 2, unit: 'day', status: 'approved' }}
          />
          <RentalRateBlock
            rateOptions={rentalProducts[0].rateOptions}
            minimumDuration={rentalProducts[0].minimumRentalDuration}
          />
        </div>
      </section>

      <section className="component-story-section">
        <h2>Discovery controls</h2>
        <SearchInput
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onClear={() => setQuery('')}
          hint="Cari berdasarkan nama atau kategori."
        />
        <div className="component-story-row">
          <CategoryChip value="all" count={8}>Semua</CategoryChip>
          <CategoryChip value="stroller" selected count={3} />
          <CategoryChip value="earmuff" count={2} />
          <CategoryChip value="push-walker" disabled count={2} />
        </div>
        <div className="component-story-grid">
          <CategoryCard category="stroller" description="Nyaman untuk jalan-jalan" count={3} />
          <CategoryCard category="earmuff" description="Lindungi telinga si kecil" count={2} />
          <CategoryCard category="push-walker" description="Dukung langkah pertamanya" count={2} />
          <CategoryCard category="balance-bike" description="Latih motorik dan seimbang" count={1} />
        </div>
      </section>

      <section className="component-story-section">
        <h2>Product card and gallery</h2>
        <div className="component-story-grid component-story-grid-two">
          <ProductCard product={rentalProducts[0]} headingLevel={2} />
          <ProductGallery productName={rentalProducts[0].name} images={galleryImages} />
        </div>
        <ImageFallback name="Contoh produk" />
      </section>

      <section className="component-story-section">
        <h2>Navigation and information</h2>
        <Breadcrumbs items={[
          { label: 'Beranda', to: '/' },
          { label: 'Katalog', to: '/catalog' },
          { label: 'Cybex Libelle' },
        ]} />
        <ProcessSteps steps={storySteps} />
        <div className="component-story-grid component-story-grid-two">
          <PolicySection title="Durasi & deposit" eyebrow="Ketentuan">
            <p>Nilai final selalu dikonfirmasi sebelum reservasi.</p>
          </PolicySection>
          <PolicySection title="Kebersihan & kondisi" eyebrow="Perawatan">
            <p>Informasi operasional resmi akan menggantikan placeholder ini.</p>
          </PolicySection>
        </div>
      </section>

      <section className="component-story-section">
        <h2>System feedback</h2>
        <LoadingSkeleton count={2} />
        <LoadingSkeleton variant="detail" />
        <div className="component-story-grid component-story-grid-two">
          <StatePanel
            variant="empty"
            title="Belum ada produk yang cocok"
            description="Coba kata kunci atau kategori lain."
            actionLabel="Reset pencarian"
            onAction={() => setQuery('')}
          />
          <StatePanel
            variant="error"
            title="Katalog belum dapat dimuat"
            description="Coba lagi atau kembali ke halaman katalog."
            actionLabel="Coba lagi"
            onAction={() => undefined}
          />
        </div>
      </section>
    </section>
  )
}
