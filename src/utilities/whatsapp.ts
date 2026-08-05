import { berswaraBusiness } from '../config/business'
import { trackAnalyticsEvent } from './analytics'
import { getRentalProductBySlug } from '../data/rentalProducts'

export type WhatsAppInquiryVariant =
  | 'general'
  | 'product-availability'
  | 'unavailable-next-date'
  | 'unavailable-alternative'

export interface WhatsAppInquiryContext {
  variant: WhatsAppInquiryVariant
  productName?: string
  productSlug?: string
  origin?: string
}

const productUrl = (slug: string, origin?: string) => {
  const path = `/products/${slug}`
  return origin ? new URL(path, origin).toString() : path
}

export function buildWhatsAppMessage({
  variant,
  productName,
  productSlug,
  origin,
}: WhatsAppInquiryContext) {
  if (variant === 'general' || !productName || !productSlug) {
    return [
      'Halo Berswara, saya ingin bertanya tentang rental perlengkapan bayi.',
      '',
      'Produk atau kebutuhan:',
      'Tanggal mulai:',
      'Tanggal selesai:',
      '',
      'Saya memahami bahwa pesan ini adalah permintaan informasi, bukan konfirmasi reservasi.',
    ].join('\n')
  }

  const introductions: Record<Exclude<WhatsAppInquiryVariant, 'general'>, string> = {
    'product-availability': `Halo Berswara, saya ingin menanyakan ketersediaan ${productName}.`,
    'unavailable-next-date': `Halo Berswara, saya melihat ${productName} sedang tidak tersedia dan ingin menanyakan tanggal tersedia berikutnya.`,
    'unavailable-alternative': `Halo Berswara, saya ingin meminta alternatif untuk ${productName} yang sedang tidak tersedia.`,
  }

  return [
    introductions[variant],
    `Produk: ${productName}`,
    `Tautan: ${productUrl(productSlug, origin)}`,
    '',
    'Tanggal mulai:',
    'Tanggal selesai:',
    '',
    'Saya memahami bahwa ketersediaan, biaya, deposit, dan logistik perlu dikonfirmasi Berswara sebelum reservasi disetujui.',
  ].join('\n')
}

export function buildWhatsAppUrl(context: WhatsAppInquiryContext) {
  const message = buildWhatsAppMessage(context)
  return `https://wa.me/${berswaraBusiness.whatsapp.digits}?text=${encodeURIComponent(message)}`
}

export interface WhatsAppInquiryEventDetail {
  source: string
  variant: WhatsAppInquiryVariant
  productSlug?: string
}

export function getWhatsAppInquiryEventDetail(
  detail: WhatsAppInquiryEventDetail,
): WhatsAppInquiryEventDetail {
  return {
    source: detail.source,
    variant: detail.variant,
    ...(detail.productSlug ? { productSlug: detail.productSlug } : {}),
  }
}

export function trackWhatsAppInquiry(detail: WhatsAppInquiryEventDetail) {
  const safeDetail = getWhatsAppInquiryEventDetail(detail)
  const category = safeDetail.productSlug
    ? getRentalProductBySlug(safeDetail.productSlug)?.category
    : undefined

  trackAnalyticsEvent({
    name: 'whatsapp_inquiry_clicked',
    properties: {
      ...safeDetail,
      ...(category ? { category } : {}),
    },
  })

  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent<WhatsAppInquiryEventDetail>('berswara:whatsapp-inquiry', {
        detail: safeDetail,
      }),
    )
  }
}
