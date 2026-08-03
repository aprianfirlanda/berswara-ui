import type { ProductImageAsset } from './media'

export const rentalCategories = [
  'stroller',
  'earmuff',
  'push-walker',
  'balance-bike',
] as const

export type RentalCategory = (typeof rentalCategories)[number]
export type RentalCurrency = 'IDR'
export type RentalDurationUnit = 'day' | 'week' | 'month'
export type ApprovalStatus = 'approved' | 'pending-approval'
export type ProductContentStatus = 'draft' | 'approved'
export type AvailabilityIndicator =
  | 'available-to-request'
  | 'limited-availability'
  | 'currently-unavailable'

export interface RentalDuration {
  value: number | null
  unit: RentalDurationUnit
  status: ApprovalStatus
  note?: string
}

export interface RentalRateOption {
  id: string
  label: string
  amount: number | null
  currency: RentalCurrency
  duration: {
    value: number
    unit: RentalDurationUnit
  }
  status: ApprovalStatus
  note?: string
}

export interface RentalDeposit {
  amount: number | null
  currency: RentalCurrency
  refundable: true
  status: ApprovalStatus
  note: string
}

export interface RentalAvailability {
  indicator: AvailabilityIndicator
  status: ApprovalStatus
  exactDateConfirmationRequired: true
  note: string
}

export interface ManagedText {
  value: string
  status: ApprovalStatus
}

export interface ManagedList {
  items: string[]
  status: ApprovalStatus
  note?: string
}

export interface ProductSpecification {
  label: string
  value: string
}

export interface ProductGuidance {
  minimumAgeMonths?: number
  maximumAgeMonths?: number
  maximumWeightKg?: number
  stages: string[]
  status: ApprovalStatus
  note?: string
}

export interface RentalProduct {
  slug: string
  name: string
  category: RentalCategory
  summary: string
  description: string
  contentStatus: ProductContentStatus
  rateOptions: RentalRateOption[]
  minimumRentalDuration: RentalDuration
  maximumRentalDuration: RentalDuration | null
  deposit: RentalDeposit
  availability: RentalAvailability
  images: ProductImageAsset[]
  features: string[]
  specifications: ProductSpecification[]
  includedItems: ManagedList
  guidance: ProductGuidance
  condition: ManagedText
  hygiene: ManagedText
  logistics: ManagedText
  careAndSafetyNotes: string[]
  featured: boolean
  published: boolean
  updatedAt: string
}
