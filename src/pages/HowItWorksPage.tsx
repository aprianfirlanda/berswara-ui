import { ButtonLink, ProcessSteps } from '../components'
import { berswaraBusiness } from '../config/business'
import { useDocumentMetadata } from '../utilities/useDocumentMetadata'
import { buildWhatsAppUrl, trackWhatsAppInquiry } from '../utilities/whatsapp'
import '../styles/how-it-works.css'

const rentalSteps = [
  {
    title: 'Pilih produk & tanggal',
    description:
      'Jelajahi katalog, pilih perlengkapan yang sesuai, lalu kirim tanggal mulai dan selesai lewat WhatsApp.',
  },
  {
    title: 'Tunggu konfirmasi Berswara',
    description:
      'Admin mengecek ketersediaan unit, jadwal, total biaya, dan pilihan pengiriman atau pengembalian.',
  },
  {
    title: 'Sepakati detail rental',
    description:
      'Metode dan batas waktu pembayaran, informasi penyewa yang diperlukan, serta ketentuan relevan dikonfirmasi sebelum reservasi.',
  },
  {
    title: 'Terima, gunakan, kembalikan',
    description:
      'Unit diserahterimakan sesuai jadwal. Gunakan dengan baik, lalu kembalikan tepat waktu melalui pilihan yang disepakati.',
  },
] as const

const policyItems = [
  {
    title: 'Durasi rental',
    body: 'Minimum rental mengikuti produk: stroller dan earmuff mulai 3 hari, sedangkan Fisher-Price Zebra Walker dan Balance Bike Rabbit mulai 1 bulan. Pilihan periode dan biaya lengkap tersedia pada halaman produk.',
  },
  {
    title: 'Ketersediaan & reservasi',
    body: 'Tanggal pada inquiry belum berarti unit dipesan. Reservasi berlaku setelah Berswara menyetujui ketersediaan, jadwal, total biaya, layanan serah terima, dan ketentuan melalui WhatsApp.',
  },
  {
    title: 'Pembayaran & deposit',
    body: 'Semua produk Berswara tidak memakai deposit. Metode serta batas waktu pembayaran dikonfirmasi admin melalui WhatsApp sebelum reservasi.',
  },
  {
    title: 'Perubahan, pembatalan, & perpanjangan',
    body: 'Jika ingin mengubah jadwal, membatalkan, atau memperpanjang rental, hubungi Berswara melalui WhatsApp. Ketentuan yang sesuai dengan reservasi dikonfirmasi sebelum disetujui.',
  },
  {
    title: 'Keterlambatan, kerusakan, & barang hilang',
    body: 'Jika ada kendala pengembalian, kerusakan, atau aksesori yang belum lengkap, segera hubungi Berswara. Penanganan dan ketentuan yang berlaku dikonfirmasi sederhana melalui WhatsApp.',
  },
  {
    title: 'Kondisi, kebersihan, & identitas penyewa',
    body: 'Informasi kondisi unit, barang yang disertakan, kebersihan, pemeriksaan, serta data penyewa yang diperlukan dikonfirmasi admin untuk tiap rental sebelum serah terima.',
  },
  {
    title: 'Pengembalian & penggantian dana',
    body: 'Pengembalian dilakukan sesuai jadwal dan pilihan layanan yang disepakati. Karena Berswara tidak memakai deposit, tidak ada proses pengembalian deposit; penggantian dana bila relevan dikonfirmasi untuk kasusnya melalui WhatsApp.',
  },
] as const

const deliveryOptions = [
  {
    title: 'Self-pickup',
    description:
      'Ambil dan kembalikan unit langsung sesuai jadwal yang disepakati. Biaya gratis; alamat disampaikan lewat WhatsApp setelah jadwal disetujui.',
  },
  {
    title: 'Kurir instan',
    description:
      'Pengiriman atau pengembalian dapat menggunakan Grab, GoSend, atau Maxim. Tarif aplikasi dibayar oleh penyewa.',
  },
  {
    title: 'Kurir toko',
    description:
      'Tim Berswara dapat mengantar dan menjemput di rumah. Ongkir mulai dari Rp15.000 dan menyesuaikan jarak.',
  },
  {
    title: 'Titik temu',
    description:
      'Pengambilan atau pengembalian dapat dilakukan di titik yang disepakati bersama. Biaya menyesuaikan lokasi.',
  },
] as const

export function HowItWorksPage() {
  useDocumentMetadata({ title: 'Cara sewa & ketentuan rental | Berswara' })
  const whatsAppUrl = buildWhatsAppUrl({ variant: 'general' })

  return (
    <article className="how-it-works-page">
      <header className="how-it-works-hero">
        <div>
          <p className="eyebrow">Cara sewa Berswara</p>
          <h1>Sewa mudah, konfirmasi tetap jelas lewat WhatsApp.</h1>
          <p>
            Berswara adalah layanan rental, bukan booking instan. Kami
            mengonfirmasi ketersediaan, jadwal, biaya, serah terima, dan
            ketentuan sebelum reservasi disetujui.
          </p>
          <div className="how-it-works-hero-actions">
            <ButtonLink to="/catalog">Lihat katalog sewa</ButtonLink>
            <a
              className="ui-button ui-button-secondary ui-button-regular"
              href={whatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackWhatsAppInquiry({
                  source: 'how-it-works',
                  variant: 'general',
                })
              }
            >
              <span>Tanyakan melalui WhatsApp</span>
            </a>
          </div>
        </div>
        <aside className="how-it-works-inquiry-note" role="note">
          <span aria-hidden="true">01</span>
          <div>
            <strong>Inquiry bukan reservasi</strong>
            <p>
              Pesan WhatsApp membantu kami memeriksa kebutuhanmu. Reservasi
              baru dikonfirmasi setelah detailnya disetujui bersama.
            </p>
          </div>
        </aside>
      </header>

      <section className="how-it-works-journey" aria-labelledby="journey-heading">
        <div className="how-it-works-section-heading">
          <p className="eyebrow">Alur rental</p>
          <h2 id="journey-heading">Dari memilih sampai kembali, langkahnya tetap terarah.</h2>
        </div>
        <ProcessSteps steps={rentalSteps} heading="Empat langkah rental Berswara" />
      </section>

      <section className="how-it-works-delivery" aria-labelledby="delivery-heading">
        <div className="how-it-works-section-heading">
          <p className="eyebrow">Pengiriman & pengembalian</p>
          <h2 id="delivery-heading">Pilih cara serah terima yang paling nyaman.</h2>
          <p>
            Layanan tersedia di {berswaraBusiness.serviceArea}. Jadwal,
            pilihan layanan, dan biaya akhir selalu dikonfirmasi melalui
            WhatsApp sebelum reservasi.
          </p>
        </div>
        <div className="how-it-works-delivery-grid">
          {deliveryOptions.map((option, index) => (
            <article key={option.title}>
              <span aria-hidden="true">0{index + 1}</span>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="how-it-works-policies" aria-labelledby="policies-heading">
        <div className="how-it-works-section-heading">
          <p className="eyebrow">Ketentuan sederhana</p>
          <h2 id="policies-heading">Informasi penting sebelum menyewa.</h2>
          <p>
            Buka tiap bagian untuk membaca ringkasannya. Semua detail yang
            bergantung pada jadwal atau unit dikonfirmasi admin lewat WhatsApp.
          </p>
        </div>
        <div className="how-it-works-policy-list">
          {policyItems.map((policy, index) => (
            <details key={policy.title}>
              <summary>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                {policy.title}
              </summary>
              <p>{policy.body}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="how-it-works-final-cta" aria-labelledby="how-it-works-cta-heading">
        <div>
          <p className="eyebrow">Siap mulai?</p>
          <h2 id="how-it-works-cta-heading">Pilih produk, lalu kirim tanggal yang kamu butuhkan.</h2>
          <p>
            Berswara akan membantu mengonfirmasi langkah rental yang sesuai
            untuk kebutuhanmu.
          </p>
        </div>
        <div className="how-it-works-final-actions">
          <ButtonLink to="/catalog">Jelajahi katalog</ButtonLink>
          <ButtonLink to="/contact" variant="secondary">
            Lihat kontak Berswara
          </ButtonLink>
        </div>
      </section>
    </article>
  )
}
