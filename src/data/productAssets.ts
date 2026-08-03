import type { ProductImageAsset } from '../types/media'

const productAssetPath = '/assets/products'

export const productImageAssets: ProductImageAsset[] = [
  {
    slug: 'scoora-cronos-lite',
    name: 'Scoora Cronos Lite',
    alt: 'Earmuff bayi Scoora Cronos Lite warna ungu dengan bantalan telinga abu-abu',
    width: 1200,
    height: 1200,
    sources: {
      small: `${productAssetPath}/scoora-cronos-lite-480.webp`,
      medium: `${productAssetPath}/scoora-cronos-lite-800.webp`,
      large: `${productAssetPath}/scoora-cronos-lite-1200.webp`,
    },
  },
  {
    slug: 'cocolatte-pockit-gen-7',
    name: 'Cocolatte Pockit Gen 7',
    alt: 'Stroller kabin Cocolatte Pockit Gen 7 warna hitam dan hijau zaitun',
    width: 1200,
    height: 1200,
    sources: {
      small: `${productAssetPath}/cocolatte-pockit-gen-7-480.webp`,
      medium: `${productAssetPath}/cocolatte-pockit-gen-7-800.webp`,
      large: `${productAssetPath}/cocolatte-pockit-gen-7-1200.webp`,
    },
  },
  {
    slug: 'balance-bike-rabbit',
    name: 'Balance Bike Rabbit',
    alt: 'Balance bike anak berbentuk kelinci warna putih, merah muda, dan ungu',
    width: 1200,
    height: 1200,
    sources: {
      small: `${productAssetPath}/balance-bike-rabbit-480.webp`,
      medium: `${productAssetPath}/balance-bike-rabbit-800.webp`,
      large: `${productAssetPath}/balance-bike-rabbit-1200.webp`,
    },
  },
  {
    slug: 'chris-olins-lisbon-630',
    name: 'Chris Olins Lisbon 630',
    alt: 'Stroller Chris Olins Lisbon 630 warna biru tua dengan kursi yang dapat diputar',
    width: 1080,
    height: 1350,
    sources: {
      small: `${productAssetPath}/chris-olins-lisbon-630-480.webp`,
      medium: `${productAssetPath}/chris-olins-lisbon-630-800.webp`,
      large: `${productAssetPath}/chris-olins-lisbon-630-1080.webp`,
    },
  },
  {
    slug: 'cybex-libelle',
    name: 'Cybex Libelle',
    alt: 'Stroller lipat Cybex Libelle warna hitam',
    width: 1200,
    height: 1200,
    sources: {
      small: `${productAssetPath}/cybex-libelle-480.webp`,
      medium: `${productAssetPath}/cybex-libelle-800.webp`,
      large: `${productAssetPath}/cybex-libelle-1200.webp`,
    },
  },
  {
    slug: 'scoora-cronos-black',
    name: 'Scoora Cronos',
    alt: 'Earmuff bayi Scoora Cronos warna hitam dengan bantalan kepala dan telinga',
    width: 1200,
    height: 1200,
    sources: {
      small: `${productAssetPath}/scoora-cronos-black-480.webp`,
      medium: `${productAssetPath}/scoora-cronos-black-800.webp`,
      large: `${productAssetPath}/scoora-cronos-black-1200.webp`,
    },
  },
  {
    slug: 'sugar-baby-my-circus-walker',
    name: 'Sugar Baby My Circus Baby Walker',
    alt: 'Push walker Sugar Baby My Circus warna merah muda dengan panel aktivitas',
    width: 1080,
    height: 1350,
    sources: {
      small: `${productAssetPath}/sugar-baby-my-circus-walker-480.webp`,
      medium: `${productAssetPath}/sugar-baby-my-circus-walker-800.webp`,
      large: `${productAssetPath}/sugar-baby-my-circus-walker-1080.webp`,
    },
  },
  {
    slug: 'fisher-price-zebra-walker',
    name: 'Fisher-Price Learn with Me Zebra Walker',
    alt: 'Push walker Fisher-Price berbentuk zebra dengan panel aktivitas warna-warni',
    width: 1200,
    height: 1200,
    sources: {
      small: `${productAssetPath}/fisher-price-zebra-walker-480.webp`,
      medium: `${productAssetPath}/fisher-price-zebra-walker-800.webp`,
      large: `${productAssetPath}/fisher-price-zebra-walker-1200.webp`,
    },
  },
]

export function getProductImageAsset(slug: string): ProductImageAsset {
  const asset = productImageAssets.find((item) => item.slug === slug)

  if (!asset) {
    throw new Error(`Missing product image asset for slug: ${slug}`)
  }

  return asset
}
