import { getProductImageAsset } from './productAssets'
import type {
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

const exactDateNote =
  'Ketersediaan untuk tanggal sewa tertentu dikonfirmasi langsung oleh Berswara melalui WhatsApp.'

type ApprovedRate = readonly [label: string, amount: number, value: number, unit: 'day' | 'month']

const approvedRates = (
  slug: string,
  values: readonly ApprovedRate[],
): RentalRateOption[] =>
  values.map(([label, amount, value, unit]) => ({
    id: `${slug}-${value}-${unit}`,
    label,
    amount,
    currency: 'IDR',
    duration: { value, unit },
    status: 'approved',
  }))

const minimumDuration = (value: number, unit: 'day' | 'month'): RentalDuration => ({
  value,
  unit,
  status: 'approved',
})

const noDeposit = (): RentalDeposit => ({
  amount: null,
  currency: 'IDR',
  refundable: true,
  status: 'approved',
  note: 'Semua produk Berswara tidak memakai deposit.',
})

const confirmWithAdmin = (value: string): ManagedText => ({
  value,
  status: 'pending-approval',
})

const includedItems = (): ManagedList => ({
  items: [],
  status: 'pending-approval',
  note: 'Kelengkapan unit dikonfirmasi admin melalui WhatsApp sebelum reservasi.',
})

const guidance = (values: Omit<ProductGuidance, 'status'>): ProductGuidance => ({
  ...values,
  status: 'approved',
})

const commonPublicFields = (
  minimum: RentalDuration,
  featured: boolean,
) => ({
  contentStatus: 'approved' as const,
  minimumRentalDuration: minimum,
  maximumRentalDuration: null,
  deposit: noDeposit(),
  availability: {
    indicator: 'available-to-request' as const,
    status: 'approved' as const,
    exactDateConfirmationRequired: true as const,
    note: exactDateNote,
  },
  includedItems: includedItems(),
  condition: confirmWithAdmin(
    'Kondisi unit dikonfirmasi admin sesuai rental sebelum serah terima.',
  ),
  hygiene: confirmWithAdmin(
    'Informasi kebersihan dan pemeriksaan dikonfirmasi admin sebelum serah terima.',
  ),
  logistics: confirmWithAdmin(
    'Pilihan pengiriman atau pickup dikonfirmasi admin melalui WhatsApp.',
  ),
  featured,
  published: true,
  updatedAt: '2026-08-05',
})

export const rentalProducts = [
  {
    slug: 'cybex-libelle',
    name: 'Cybex Libelle',
    category: 'stroller',
    summary: 'Stroller lipat ringkas untuk perjalanan bersama anak.',
    description:
      'Cybex Libelle adalah stroller ringkas dengan kanopi XXL, harness lima titik, dan suspensi roda depan untuk kebutuhan perjalanan.',
    ...commonPublicFields(minimumDuration(3, 'day'), true),
    rateOptions: approvedRates('cybex-libelle', [
      ['3 hari', 200_000, 3, 'day'],
      ['7 hari', 275_000, 7, 'day'],
      ['14 hari', 345_000, 14, 'day'],
      ['30 hari', 415_000, 30, 'day'],
    ]),
    images: [getProductImageAsset('cybex-libelle')],
    features: [
      'Kanopi matahari XXL dengan UPF 50+',
      'One-pull harness dan harness lima titik berbantalan',
      'Sandaran kaki dapat disesuaikan',
      'Suspensi roda depan',
      'Dapat dilipat dan berdiri tegak untuk penyimpanan',
    ],
    specifications: [
      { label: 'Berat stroller', value: '6,2 kg' },
      { label: 'Dimensi terbuka', value: '71 × 52 × 102 cm' },
      { label: 'Dimensi terlipat', value: '32 × 20 × 48 cm' },
    ],
    guidance: guidance({
      minimumAgeMonths: 6,
      maximumWeightKg: 25,
      stages: ['Duduk dengan bantuan stroller'],
      note: 'Cocok mulai usia 6 bulan hingga berat anak 25 kg; tetap ikuti petunjuk penggunaan produsen.',
    }),
    careAndSafetyNotes: [
      'Gunakan harness sesuai petunjuk produsen.',
      'Pastikan stroller terkunci sempurna sebelum digunakan.',
    ],
  },
  {
    slug: 'cocolatte-pockit-gen-7',
    name: 'Cocolatte Pockit Gen 7',
    category: 'stroller',
    summary: 'Stroller compact untuk bepergian dengan lipatan satu tangan.',
    description:
      'Cocolatte Pockit Gen 7 adalah stroller compact dengan kanopi, tas perjalanan, keranjang penyimpanan, dan roda depan 360 derajat.',
    ...commonPublicFields(minimumDuration(3, 'day'), false),
    rateOptions: approvedRates('cocolatte-pockit-gen-7', [
      ['3 hari', 125_000, 3, 'day'],
      ['7 hari', 200_000, 7, 'day'],
      ['14 hari', 235_000, 14, 'day'],
      ['30 hari', 325_000, 30, 'day'],
    ]),
    images: [getProductImageAsset('cocolatte-pockit-gen-7')],
    features: [
      'Kanopi matahari, tas perjalanan, dan keranjang penyimpanan',
      'Sabuk pengaman lima titik',
      'Dorongan dan sistem lipat satu tangan',
      'Roda depan 360 derajat dengan lock system',
      'Suspensi roda depan dan belakang',
    ],
    specifications: [
      { label: 'Berat stroller', value: 'Sekitar 5,5–6 kg' },
      { label: 'Kapasitas', value: 'Hingga sekitar 20 kg' },
      { label: 'Dimensi terbuka', value: 'Sekitar 80 × 45 × 100 cm' },
      { label: 'Dimensi terlipat', value: 'Sekitar 60 × 45 × 25 cm' },
    ],
    guidance: guidance({
      stages: [],
      note: 'Kesesuaian usia dan ketentuan bagasi kabin dikonfirmasi melalui WhatsApp atau kepada maskapai.',
    }),
    careAndSafetyNotes: [
      'Pastikan stroller terkunci sempurna setelah dibuka.',
      'Gunakan sistem pengaman sesuai petunjuk produsen.',
    ],
  },
  {
    slug: 'scoora-cronos-lite',
    name: 'Scoora Cronos Lite',
    category: 'earmuff',
    summary: 'Earmuff ringan dengan headband lembut dan bantalan telinga empuk.',
    description:
      'Scoora Cronos Lite adalah hearing protection untuk anak dengan headband fleksibel yang dapat disesuaikan dan bantalan telinga lembut.',
    ...commonPublicFields(minimumDuration(3, 'day'), false),
    rateOptions: approvedRates('scoora-cronos-lite', [
      ['3 hari', 25_000, 3, 'day'],
      ['7 hari', 45_000, 7, 'day'],
      ['14 hari', 55_000, 14, 'day'],
      ['30 hari', 65_000, 30, 'day'],
    ]),
    images: [getProductImageAsset('scoora-cronos-lite')],
    features: [
      'Headband lembut, fleksibel, dan dapat disesuaikan',
      'Bantalan busa empuk di sekitar telinga',
      'Ringan dan mudah dibawa',
      'Membantu meredam suara bising',
      'Material durable ABS',
    ],
    specifications: [
      { label: 'Usia rujukan', value: '0–4 tahun' },
      { label: 'Berat', value: '195 gram' },
      { label: 'Ukuran', value: '18 × 18 × 8 cm' },
      { label: 'Tipe', value: 'Hearing protection' },
    ],
    guidance: guidance({
      stages: ['Perlindungan telinga saat berada di lingkungan ramai'],
      note: 'Kesesuaian ukuran dan usia perlu dikonfirmasi sebelum penggunaan.',
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
    summary: 'Earmuff hitam dengan headband lembut dan bantalan telinga empuk.',
    description:
      'Scoora Cronos adalah hearing protection anak dengan headband fleksibel yang dapat disesuaikan dan bantalan telinga lembut.',
    ...commonPublicFields(minimumDuration(3, 'day'), true),
    rateOptions: approvedRates('scoora-cronos-black', [
      ['3 hari', 25_000, 3, 'day'],
      ['7 hari', 45_000, 7, 'day'],
      ['14 hari', 55_000, 14, 'day'],
      ['30 hari', 65_000, 30, 'day'],
    ]),
    images: [getProductImageAsset('scoora-cronos-black')],
    features: [
      'Headband lembut, fleksibel, dan dapat disesuaikan',
      'Bantalan busa empuk di sekitar telinga',
      'Ringan dan mudah dibawa',
      'Membantu meredam suara bising',
      'Material durable ABS',
    ],
    specifications: [
      { label: 'Usia rujukan', value: '0–4 tahun' },
      { label: 'Berat', value: '195 gram' },
      { label: 'Ukuran', value: '18 × 18 × 8 cm' },
      { label: 'Tipe', value: 'Hearing protection' },
    ],
    guidance: guidance({
      stages: ['Perlindungan telinga saat berada di lingkungan ramai'],
      note: 'Kesesuaian ukuran dan usia perlu dikonfirmasi sebelum penggunaan.',
    }),
    careAndSafetyNotes: [
      'Pastikan headband nyaman dan tidak terlalu ketat.',
      'Ikuti batas durasi penggunaan dari produsen.',
    ],
  },
  {
    slug: 'fisher-price-zebra-walker',
    name: 'Fisher-Price Learn with Me Zebra Walker',
    category: 'push-walker',
    summary: 'Baby walker interaktif untuk duduk, bermain, berdiri, dan berjalan.',
    description:
      'Fisher-Price Learn with Me Zebra Walker membantu anak usia 6 bulan ke atas belajar berdiri dan berjalan sambil mengembangkan motorik kasar, keseimbangan, dan koordinasi.',
    ...commonPublicFields(minimumDuration(1, 'month'), true),
    rateOptions: approvedRates('fisher-price-zebra-walker', [
      ['1 bulan', 60_000, 1, 'month'],
      ['2 bulan', 100_000, 2, 'month'],
    ]),
    images: [getProductImageAsset('fisher-price-zebra-walker')],
    features: [
      'Dua mode: duduk dan bermain, serta berdiri dan berjalan',
      'Pegangan ergonomis dan empat roda stabil',
      'Tombol interaktif dan musik edukatif',
      'Halaman buku dan lampu',
    ],
    specifications: [{ label: 'Bentuk', value: 'Zebra' }],
    guidance: guidance({
      minimumAgeMonths: 6,
      stages: ['Duduk dan bermain', 'Belajar berdiri', 'Belajar berjalan'],
      note: 'Gunakan sesuai tahap perkembangan anak dan dengan pengawasan orang dewasa.',
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
      'Balance Bike Rabbit Labelle adalah mainan beroda untuk aktivitas di dalam atau luar ruangan serta latihan sensorik, motorik, dan keseimbangan.',
    ...commonPublicFields(minimumDuration(1, 'month'), false),
    rateOptions: approvedRates('balance-bike-rabbit-labelle', [
      ['1 bulan', 50_000, 1, 'month'],
      ['2 bulan', 85_000, 2, 'month'],
    ]),
    images: [getProductImageAsset('balance-bike-rabbit')],
    features: [
      'Dapat dimainkan di dalam dan luar ruangan',
      'Membantu mengembangkan sensorik, motorik, dan keseimbangan',
      'Food grade, bebas BPA, dan tidak beracun',
      'Mudah dipasang dan dibersihkan',
      'Anti-UV dan tidak berkarat',
    ],
    specifications: [
      { label: 'Standar', value: 'SNI' },
      { label: 'Berat anak maksimum', value: '30 kg' },
      { label: 'Ukuran produk', value: '49,5 × 24 × 38 cm' },
      { label: 'Ukuran dus', value: '49 × 21 × 27 cm' },
    ],
    guidance: guidance({
      maximumWeightKg: 30,
      stages: ['Latihan motorik', 'Latihan keseimbangan'],
      note: 'Gunakan dengan pengawasan orang dewasa.',
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
