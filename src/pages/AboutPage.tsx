import { ButtonLink, ResponsiveProductImage } from '../components'
import { berswaraBusiness } from '../config/business'
import { getRentalProductBySlug } from '../data/rentalProducts'
import type { RentalProduct } from '../types/catalog'
import { useDocumentMetadata } from '../utilities/useDocumentMetadata'
import '../styles/about.css'

function requireProduct(slug: string): RentalProduct {
  const product = getRentalProductBySlug(slug)

  if (!product) {
    throw new Error(`Missing About page product: ${slug}`)
  }

  return product
}

const aboutProducts = [
  requireProduct('cybex-libelle'),
  requireProduct('fisher-price-zebra-walker'),
]

const servicePrinciples = [
  {
    number: '01',
    title: 'Sewa seperlunya',
    description:
      'Stroller dan alat bermain dipakai pada fase tertentu. Rental membantu keluarga memilih kebutuhan tanpa harus menyimpan semuanya setelah fase itu berlalu.',
  },
  {
    number: '02',
    title: 'Jelas sebelum disetujui',
    description:
      'Produk, tanggal, biaya, deposit, serta cara serah terima dikonfirmasi lewat WhatsApp sebelum reservasi disetujui.',
  },
  {
    number: '03',
    title: 'Siap digunakan dengan tenang',
    description:
      'Unit disiapkan sesuai jenis perlengkapan, lalu kelengkapan dan kondisi aktualnya diperiksa sebelum serah terima.',
  },
] as const

export function AboutPage() {
  useDocumentMetadata({ title: 'Tentang Berswara | Rental perlengkapan bayi' })

  return (
    <article className="about-page">
      <header className="about-hero">
        <div className="about-hero-copy">
          <p className="eyebrow">Tentang Berswara</p>
          <h1>Perlengkapan tepat, hanya selama keluarga membutuhkannya.</h1>
          <p>
            Berswara adalah layanan rental perlengkapan bayi di Kota Bandung.
            Kami membantu keluarga memilih stroller dan teman bermain untuk
            masa pakai yang sementara, tanpa harus membeli semuanya.
          </p>
          <div className="about-hero-actions">
            <ButtonLink to="/catalog">Lihat katalog sewa</ButtonLink>
            <ButtonLink to="/contact" variant="secondary">
              Hubungi Berswara
            </ButtonLink>
          </div>
        </div>

        <div className="about-product-collage" aria-label="Produk rental Berswara">
          {aboutProducts.map((product, index) => (
            <figure
              key={product.slug}
              className={`about-product-card about-product-card-${index + 1}`}
            >
              <ResponsiveProductImage
                asset={product.images[0]}
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : 'low'}
                sizes="(max-width: 640px) 74vw, 30vw"
              />
              <figcaption>{product.name}</figcaption>
            </figure>
          ))}
          <span className="about-collage-badge" aria-hidden="true">
            rental
            <strong>bayi</strong>
          </span>
        </div>
      </header>

      <section className="about-introduction" aria-labelledby="about-purpose-heading">
        <div>
          <p className="eyebrow">Kenapa rental</p>
          <h2 id="about-purpose-heading">Lebih ringan untuk fase yang cepat berubah.</h2>
        </div>
        <div className="about-introduction-copy">
          <p>
            Kebutuhan si kecil bisa berubah seiring tumbuhnya. Berswara
            memberi pilihan untuk memakai perlengkapan yang relevan saat ini,
            lalu mengembalikannya setelah selesai digunakan.
          </p>
          <p>
            Kami tidak menganggap pertanyaan sebagai booking. Setiap inquiry
            ditinjau langsung agar tanggal, biaya, deposit, dan logistik dapat
            disepakati dengan jelas.
          </p>
        </div>
      </section>

      <section className="about-principles" aria-labelledby="about-principles-heading">
        <div className="about-section-heading">
          <p className="eyebrow">Cara kami bekerja</p>
          <h2 id="about-principles-heading">Prinsip sederhana untuk rental yang jelas.</h2>
        </div>
        <ol className="about-principle-list">
          {servicePrinciples.map((principle) => (
            <li key={principle.number}>
              <span aria-hidden="true">{principle.number}</span>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="about-operations" aria-labelledby="about-operations-heading">
        <div className="about-operations-copy">
          <p className="eyebrow">Sebelum serah terima</p>
          <h2 id="about-operations-heading">Detail unit dan serah terima dikonfirmasi lebih dahulu.</h2>
          <p>
            Informasi kondisi unit, kelengkapan, kebersihan, dan pemeriksaan
            dikonfirmasi admin untuk tiap rental sebelum serah terima. Dengan
            begitu, keluarga mengetahui detail yang berlaku untuk unit dan
            jadwal yang dipilih.
          </p>
          <p>
            Untuk penggunaan yang aman, keluarga tetap perlu mengikuti
            petunjuk produk dan mengonfirmasi kesesuaian usia atau berat anak
            sebelum menyewa.
          </p>
        </div>
        <aside className="about-operations-note">
          <span aria-hidden="true">✦</span>
          <div>
            <strong>Detail akhir dikonfirmasi bersama</strong>
            <p>
              Ketersediaan, total biaya, detail unit, dan cara serah terima
              tidak ditetapkan otomatis oleh website.
            </p>
          </div>
        </aside>
      </section>

      <section className="about-logistics" aria-labelledby="about-logistics-heading">
        <div className="about-section-heading">
          <p className="eyebrow">Layanan di Bandung</p>
          <h2 id="about-logistics-heading">Pilih serah terima yang paling nyaman.</h2>
        </div>
        <dl className="about-logistics-grid">
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
        </dl>
      </section>

      <section className="about-final-cta" aria-labelledby="about-cta-heading">
        <div>
          <p className="eyebrow">Mulai dari kebutuhanmu</p>
          <h2 id="about-cta-heading">Lihat pilihan rental untuk si kecil.</h2>
          <p>
            Jelajahi produk, lalu kirim pertanyaan dan tanggal yang kamu
            butuhkan. Berswara akan mengonfirmasi langkah berikutnya.
          </p>
        </div>
        <div className="about-final-actions">
          <ButtonLink to="/catalog">Jelajahi katalog</ButtonLink>
          <ButtonLink to="/contact" variant="secondary">
            Cek ketersediaan
          </ButtonLink>
        </div>
      </section>
    </article>
  )
}
