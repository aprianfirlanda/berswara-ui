import { getProductImageAsset } from './productAssets'
import type {
  ApprovalStatus,
  ManagedList,
  ManagedText,
  ProductGuidance,
  RentalCategory,
  RentalDeposit,
  RentalDuration,
  RentalProduct,
  RentalRateOption,
} from '../types/catalog'
import { validateRentalCatalog } from '../utilities/validateRentalCatalog'

const pendingApproval: ApprovalStatus = 'pending-approval'
const exactDateNote =
  'Ketersediaan untuk tanggal sewa tertentu harus dikonfirmasi langsung oleh Berswara.'

const pendingRate = (category: RentalCategory): RentalRateOption[] =>
  [
    { id: '1-day', label: '1 hari', value: 1, unit: 'day' },
    { id: '3-days', label: '3 hari', value: 3, unit: 'day' },
    { id: '1-week', label: '1 minggu', value: 1, unit: 'week' },
    { id: '1-month', label: '1 bulan', value: 1, unit: 'month' },
  ].map(({ id, label, value, unit }) => ({
    id: `${category}-${id}-pending`,
    label,
    amount: null,
    currency: 'IDR' as const,
    duration: { value, unit: unit as RentalRateOption['duration']['unit'] },
    status: pendingApproval,
    note: 'Nominal dikonfirmasi langsung oleh Berswara sebelum reservasi.',
  }))

const pendingMinimumDuration = (): RentalDuration => ({
  value: 1,
  unit: 'day',
  status: 'approved',
  note: 'Pilihan periode tersedia untuk 1 hari, 3 hari, 1 minggu, dan 1 bulan.',
})

const pendingDeposit = (): RentalDeposit => ({
  amount: null,
  currency: 'IDR',
  refundable: true,
  status: pendingApproval,
  note: 'Nominal dan ketentuan deposit dikonfirmasi saat inquiry.',
})

const pendingIncludedItems = (): ManagedList => ({
  items: [],
  status: pendingApproval,
  note: 'Daftar barang dan aksesori yang disertakan belum disetujui.',
})

const pendingOperations = (value: string): ManagedText => ({
  value,
  status: pendingApproval,
})

const guidance = (
  values: Omit<ProductGuidance, 'status'>,
): ProductGuidance => ({
  ...values,
  status: pendingApproval,
})

const commonPublicFields = (category: RentalCategory) => ({
  contentStatus: 'approved' as const,
  rateOptions: pendingRate(category),
  minimumRentalDuration: pendingMinimumDuration(),
  maximumRentalDuration: null,
  deposit: pendingDeposit(),
  availability: {
    indicator: 'available-to-request' as const,
    status: pendingApproval,
    exactDateConfirmationRequired: true as const,
    note: exactDateNote,
  },
  includedItems: pendingIncludedItems(),
  condition: pendingOperations(
    'Kondisi unit aktual dikonfirmasi dan didokumentasikan sebelum serah terima.',
  ),
  hygiene: pendingOperations(
    'Proses kebersihan dan inspeksi menunggu persetujuan operasional Berswara.',
  ),
  logistics: pendingOperations(
    'Pilihan pengiriman atau pengambilan dikonfirmasi saat inquiry.',
  ),
  featured: false,
  published: true,
  updatedAt: '2026-08-04',
})

export const rentalProducts = [
  {
    slug: 'cybex-libelle',
    name: 'Cybex Libelle',
    category: 'stroller',
    summary: 'Stroller lipat ringkas untuk perjalanan bersama anak.',
    description:
      'Cybex Libelle adalah stroller hitam yang dapat dilipat ringkas, dilengkapi kanopi dan fitur pendukung perjalanan.',
    ...commonPublicFields('stroller'),
    images: [getProductImageAsset('cybex-libelle')],
    features: [
      'Kanopi matahari XXL dengan UPF 50+',
      'Suspensi roda depan',
      'Harness lima titik dengan bantalan',
      'Dapat dilipat ringkas',
    ],
    specifications: [{ label: 'Warna', value: 'Hitam' }],
    guidance: guidance({
      minimumAgeMonths: 6,
      maximumWeightKg: 25,
      stages: ['Duduk dengan bantuan stroller'],
      note: 'Panduan pada materi produk; tetap ikuti petunjuk penggunaan produsen.',
    }),
    careAndSafetyNotes: [
      'Gunakan harness sesuai petunjuk produsen.',
      'Batas usia dan berat perlu dikonfirmasi sebelum sewa.',
    ],
  },
  {
    slug: 'cocolatte-pockit-gen-7',
    name: 'Cocolatte Pockit Gen 7',
    category: 'stroller',
    summary: 'Stroller kabin ringan dan ringkas untuk kebutuhan traveling.',
    description:
      'Cocolatte Pockit Gen 7 merupakan stroller berukuran kabin dengan lipatan ringkas dan roda depan yang dapat berputar.',
    ...commonPublicFields('stroller'),
    images: [getProductImageAsset('cocolatte-pockit-gen-7')],
    features: [
      'Ukuran kabin yang ringkas',
      'Dapat dibawa sebagai tas backpack',
      'Roda depan dapat berputar',
      'Posisi lipat padat',
    ],
    specifications: [
      { label: 'Berat stroller', value: '6 kg' },
      { label: 'Warna', value: 'Hitam dan hijau zaitun' },
    ],
    guidance: guidance({
      minimumAgeMonths: 6,
      maximumAgeMonths: 36,
      stages: ['Duduk dengan bantuan stroller'],
      note: 'Rentang usia berasal dari materi produk dan perlu dikonfirmasi.',
    }),
    careAndSafetyNotes: [
      'Pastikan stroller terkunci sempurna setelah dibuka.',
      'Gunakan sistem pengaman sesuai petunjuk produsen.',
    ],
  },
  {
    slug: 'chris-olins-lisbon-630',
    name: 'Chris Olins Lisbon 630',
    category: 'stroller',
    summary: 'Stroller dengan arah kursi fleksibel dan posisi duduk atau bersandar.',
    description:
      'Chris Olins Lisbon 630 menawarkan kursi yang dapat menghadap depan atau belakang serta posisi duduk dan bersandar.',
    ...commonPublicFields('stroller'),
    images: [getProductImageAsset('chris-olins-lisbon-630')],
    features: [
      'Kursi dapat menghadap depan atau belakang',
      'Posisi duduk dan bersandar',
      'Dapat dilipat ringkas',
    ],
    specifications: [{ label: 'Warna', value: 'Biru tua' }],
    guidance: guidance({
      minimumAgeMonths: 6,
      maximumWeightKg: 50,
      stages: ['Duduk dengan bantuan stroller'],
      note: 'Panduan berasal dari materi produk dan perlu dikonfirmasi.',
    }),
    careAndSafetyNotes: [
      'Kunci posisi kursi sebelum digunakan.',
      'Batas berat perlu dikonfirmasi sebelum sewa.',
    ],
  },
  {
    slug: 'scoora-cronos-lite',
    name: 'Scoora Cronos Lite',
    category: 'earmuff',
    summary: 'Earmuff bayi ringan dengan headband dan bantalan yang dapat disesuaikan.',
    description:
      'Scoora Cronos Lite adalah pelindung telinga bayi berwarna ungu dengan bantalan kepala dan telinga yang lembut.',
    ...commonPublicFields('earmuff'),
    images: [getProductImageAsset('scoora-cronos-lite')],
    features: [
      'Headband dapat disesuaikan',
      'Headband berbantalan',
      'Bantalan telinga berbahan foam lembut',
      'Lapisan luar tahan pakai',
    ],
    specifications: [{ label: 'Warna', value: 'Ungu dan abu-abu' }],
    guidance: guidance({
      stages: ['Perlindungan telinga saat berada di lingkungan ramai'],
      note: 'Kesesuaian ukuran dan usia harus dikonfirmasi sebelum penggunaan.',
    }),
    careAndSafetyNotes: [
      'Pastikan headband nyaman dan tidak terlalu ketat.',
      'Ikuti batas durasi penggunaan dari produsen.',
    ],
  },
  {
    slug: 'scoora-cronos-black',
    name: 'Scoora Cronos',
    category: 'earmuff',
    summary: 'Earmuff bayi hitam dengan bantalan lembut dan headband yang dapat diatur.',
    description:
      'Scoora Cronos adalah pelindung telinga bayi berwarna hitam dengan bantalan kepala dan telinga untuk kenyamanan penggunaan.',
    ...commonPublicFields('earmuff'),
    images: [getProductImageAsset('scoora-cronos-black')],
    features: [
      'Headband dapat disesuaikan',
      'Headband berbantalan',
      'Bantalan telinga berbahan foam lembut',
      'Lapisan luar tahan pakai',
    ],
    specifications: [{ label: 'Warna', value: 'Hitam' }],
    guidance: guidance({
      stages: ['Perlindungan telinga saat berada di lingkungan ramai'],
      note: 'Kesesuaian ukuran dan usia harus dikonfirmasi sebelum penggunaan.',
    }),
    careAndSafetyNotes: [
      'Pastikan headband nyaman dan tidak terlalu ketat.',
      'Ikuti batas durasi penggunaan dari produsen.',
    ],
  },
  {
    slug: 'sugar-baby-my-circus-walker',
    name: 'Sugar Baby My Circus Baby Walker',
    category: 'push-walker',
    summary: 'Push walker dengan panel aktivitas yang membantu anak belajar berjalan dan bermain.',
    description:
      'Sugar Baby My Circus Baby Walker memadukan pegangan belajar berjalan dengan panel permainan yang dapat dilepas.',
    ...commonPublicFields('push-walker'),
    images: [getProductImageAsset('sugar-baby-my-circus-walker')],
    features: [
      'Panel permainan dapat dilepas',
      'Papan tulis',
      'Piano yang dapat dilepas',
      'Shape sorter',
      'Roda gigi yang dapat diputar',
    ],
    specifications: [
      { label: 'Penggunaan', value: 'Tampak samping dan belakang pada materi produk' },
      { label: 'Standar pada materi produk', value: 'Bebas BPA dan EN71' },
    ],
    guidance: guidance({
      stages: ['Belajar berjalan', 'Perkembangan sensori'],
      note: 'Tahap perkembangan dan pengawasan perlu dikonfirmasi sebelum sewa.',
    }),
    careAndSafetyNotes: [
      'Gunakan hanya dengan pengawasan orang dewasa.',
      'Gunakan di permukaan datar dan jauh dari tangga.',
    ],
  },
  {
    slug: 'fisher-price-zebra-walker',
    name: 'Fisher-Price Learn with Me Zebra Walker',
    category: 'push-walker',
    summary: 'Push walker berbentuk zebra dengan pegangan dan panel aktivitas interaktif.',
    description:
      'Fisher-Price Learn with Me Zebra Walker mendukung aktivitas duduk dan bermain sekaligus latihan berdiri dan berjalan.',
    ...commonPublicFields('push-walker'),
    images: [getProductImageAsset('fisher-price-zebra-walker')],
    features: [
      'Pegangan mudah digenggam',
      'Roda stabil',
      'Panel aktivitas interaktif',
      'Buku dengan halaman yang dapat diputar',
      'Lagu dan frasa sing-along',
    ],
    specifications: [{ label: 'Bentuk', value: 'Zebra' }],
    guidance: guidance({
      stages: ['Duduk dan bermain', 'Belajar berdiri', 'Belajar berjalan'],
      note: 'Tahap perkembangan dan pengawasan perlu dikonfirmasi sebelum sewa.',
    }),
    careAndSafetyNotes: [
      'Gunakan hanya dengan pengawasan orang dewasa.',
      'Gunakan di permukaan datar dan jauh dari tangga.',
    ],
  },
  {
    slug: 'balance-bike-rabbit-labelle',
    name: 'Balance Bike Rabbit Labelle',
    category: 'balance-bike',
    summary: 'Balance bike berbentuk kelinci untuk aktivitas motorik dan keseimbangan anak.',
    description:
      'Balance Bike Rabbit Labelle merupakan mainan beroda empat untuk aktivitas di dalam atau luar ruangan.',
    ...commonPublicFields('balance-bike'),
    images: [getProductImageAsset('balance-bike-rabbit')],
    features: [
      'Mendukung aktivitas sensorik dan motorik',
      'Mendukung latihan keseimbangan',
      'Dapat dimainkan di dalam atau luar ruangan',
      'Bahan disebut food grade dan bebas BPA pada materi produk',
    ],
    specifications: [
      { label: 'Bentuk', value: 'Kelinci' },
      { label: 'Warna', value: 'Putih, merah muda, dan ungu' },
    ],
    guidance: guidance({
      maximumWeightKg: 30,
      stages: ['Latihan motorik', 'Latihan keseimbangan'],
      note: 'Batas berat berasal dari materi produk dan perlu dikonfirmasi.',
    }),
    careAndSafetyNotes: [
      'Gunakan hanya dengan pengawasan orang dewasa.',
      'Gunakan di permukaan datar dan jauh dari lalu lintas atau tangga.',
    ],
  },
] as const satisfies readonly RentalProduct[]

validateRentalCatalog(rentalProducts)

export function getRentalProductBySlug(slug: string) {
  return rentalProducts.find((product) => product.slug === slug)
}

export function getRentalProductsByCategory(category: RentalCategory) {
  return rentalProducts.filter((product) => product.category === category)
}

export function getPublishedRentalProducts() {
  return rentalProducts.filter((product) => product.published)
}
