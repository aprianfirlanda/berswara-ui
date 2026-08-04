import type { ButtonHTMLAttributes } from 'react'
import { Link } from 'react-router-dom'
import type { RentalCategory } from '../../types/catalog'
import { rentalCategoryLabels } from '../../utilities/rentalPresentation'

export interface CategoryChipProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value'> {
  value: RentalCategory | 'all'
  selected?: boolean
  count?: number
}

export function CategoryChip({
  value,
  selected = false,
  count,
  children,
  className,
  ...props
}: CategoryChipProps) {
  const label = children ?? (value === 'all' ? 'Semua' : rentalCategoryLabels[value])

  return (
    <button
      {...props}
      className={`category-chip ${selected ? 'category-chip-active' : ''} ${className ?? ''}`.trim()}
      type="button"
      aria-pressed={selected}
      data-category={value}
    >
      <span>{label}</span>
      {count !== undefined ? <span className="category-count">{count}</span> : null}
    </button>
  )
}

export interface CategoryCardProps {
  category: RentalCategory
  description: string
  to?: string
  count?: number
}

export function CategoryCard({
  category,
  description,
  to = `/catalog?category=${category}`,
  count,
}: CategoryCardProps) {
  return (
    <Link className={`category-card category-card-${category}`} to={to}>
      <span className="category-card-label">{rentalCategoryLabels[category]}</span>
      <span className="category-card-description">{description}</span>
      {count !== undefined ? (
        <span className="category-card-count">{count} produk</span>
      ) : null}
      <span className="category-card-arrow" aria-hidden="true">
        →
      </span>
    </Link>
  )
}
