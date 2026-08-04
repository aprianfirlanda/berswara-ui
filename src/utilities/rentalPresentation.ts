import type {
  AvailabilityIndicator,
  RentalCategory,
  RentalDuration,
  RentalDurationUnit,
  RentalRateOption,
} from '../types/catalog'

export const availabilityPresentation: Record<
  AvailabilityIndicator,
  { icon: string; label: string; className: string }
> = {
  'available-to-request': {
    icon: '✓',
    label: 'Tersedia untuk ditanyakan',
    className: 'availability-badge-available',
  },
  'limited-availability': {
    icon: '!',
    label: 'Ketersediaan terbatas',
    className: 'availability-badge-limited',
  },
  'currently-unavailable': {
    icon: '×',
    label: 'Saat ini tidak tersedia',
    className: 'availability-badge-unavailable',
  },
}

export const rentalCategoryLabels: Record<RentalCategory, string> = {
  stroller: 'Stroller',
  earmuff: 'Earmuff',
  'push-walker': 'Push Walker',
  'balance-bike': 'Balance Bike',
}

const durationLabels: Record<RentalDurationUnit, string> = {
  day: 'hari',
  week: 'minggu',
  month: 'bulan',
}

const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function getAvailabilityLabel(indicator: AvailabilityIndicator) {
  return availabilityPresentation[indicator].label
}

export function getRentalCategoryLabel(category: RentalCategory) {
  return rentalCategoryLabels[category]
}

export function formatRentalDuration(
  duration: Pick<RentalDuration, 'value' | 'unit'>,
) {
  if (duration.value === null) return `dikonfirmasi / ${durationLabels[duration.unit]}`
  return `${duration.value} ${durationLabels[duration.unit]}`
}

export function formatRentalAmount(rate: RentalRateOption) {
  return rate.amount === null ? 'Tarif dikonfirmasi' : idrFormatter.format(rate.amount)
}
