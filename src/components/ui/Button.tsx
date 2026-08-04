import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'regular' | 'compact'

interface ButtonStyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  isFullWidth?: boolean
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonStyleProps {
  isLoading?: boolean
  loadingLabel?: string
  leadingIcon?: ReactNode
}

export interface ButtonLinkProps extends LinkProps, ButtonStyleProps {
  leadingIcon?: ReactNode
}

function getButtonClassName({
  variant = 'primary',
  size = 'regular',
  isFullWidth = false,
}: ButtonStyleProps) {
  return [
    'ui-button',
    `ui-button-${variant}`,
    `ui-button-${size}`,
    isFullWidth ? 'ui-button-full' : '',
  ]
    .filter(Boolean)
    .join(' ')
}

export function Button({
  variant,
  size,
  isFullWidth,
  isLoading = false,
  loadingLabel = 'Memproses…',
  leadingIcon,
  disabled,
  children,
  className,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={`${getButtonClassName({ variant, size, isFullWidth })} ${className ?? ''}`.trim()}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
    >
      {isLoading ? <span className="ui-spinner" aria-hidden="true" /> : leadingIcon}
      <span>{isLoading ? loadingLabel : children}</span>
    </button>
  )
}

export function ButtonLink({
  variant,
  size,
  isFullWidth,
  leadingIcon,
  children,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      {...props}
      className={`${getButtonClassName({ variant, size, isFullWidth })} ${className ?? ''}`.trim()}
    >
      {leadingIcon}
      <span>{children}</span>
    </Link>
  )
}
