import type { RentalDuration, RentalRateOption } from '../../types/catalog'
import {
  formatRentalAmount,
  formatRentalDuration,
} from '../../utilities/rentalPresentation'

export interface RentalRateBlockProps {
  rateOptions: readonly RentalRateOption[]
  minimumDuration: RentalDuration
  compact?: boolean
  heading?: string
}

export function RentalRateBlock({
  rateOptions,
  minimumDuration,
  compact = false,
  heading = 'Tarif sewa',
}: RentalRateBlockProps) {
  const rates = rateOptions.length > 0 ? rateOptions : []

  return (
    <section
      className={`rental-rate-block ${compact ? 'rental-rate-block-compact' : ''}`.trim()}
      aria-label={heading}
    >
      <p className="rental-rate-heading">{heading}</p>
      {rates.length > 0 ? (
        <ul className="rental-rate-list">
          {rates.map((rate) => (
            <li key={rate.id}>
              <span className="rental-rate-option-label">{rate.label}</span>
              <span className="rental-rate-value">
                <span className="rental-rate-amount">{formatRentalAmount(rate)}</span>
                <span className="rental-rate-unit">
                  / {formatRentalDuration(rate.duration)}
                </span>
              </span>
              {!compact && rate.note ? (
                <span className="rental-rate-option-note">{rate.note}</span>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rental-rate-pending">Pilihan tarif dikonfirmasi oleh Berswara.</p>
      )}
      <p className="rental-rate-minimum">
        <strong>Minimum sewa:</strong> {formatRentalDuration(minimumDuration)}
      </p>
    </section>
  )
}
