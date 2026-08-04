import type { ReactNode } from 'react'
import { Button } from '../ui/Button'

export type StatePanelVariant = 'empty' | 'error' | 'info'

export interface StatePanelProps {
  variant: StatePanelVariant
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  icon?: ReactNode
}

export function StatePanel({
  variant,
  title,
  description,
  actionLabel,
  onAction,
  icon,
}: StatePanelProps) {
  return (
    <section
      className={`state-panel state-panel-${variant}`}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <span className="state-panel-icon" aria-hidden="true">
        {icon ?? (variant === 'error' ? '!' : '⌕')}
      </span>
      <h2>{title}</h2>
      <p>{description}</p>
      {actionLabel && onAction ? (
        <Button variant={variant === 'error' ? 'primary' : 'secondary'} onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </section>
  )
}
