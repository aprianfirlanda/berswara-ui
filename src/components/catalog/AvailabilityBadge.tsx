import type { AvailabilityIndicator } from '../../types/catalog'
import { availabilityPresentation } from '../../utilities/rentalPresentation'

export interface AvailabilityBadgeProps {
  indicator: AvailabilityIndicator
  compact?: boolean
}

export function AvailabilityBadge({
  indicator,
  compact = false,
}: AvailabilityBadgeProps) {
  const content = availabilityPresentation[indicator]

  return (
    <span
      className={`availability-badge ${content.className} ${compact ? 'availability-badge-compact' : ''}`.trim()}
      data-availability={indicator}
    >
      <span className="availability-badge-icon" aria-hidden="true">
        {content.icon}
      </span>
      <span>{content.label}</span>
    </span>
  )
}
