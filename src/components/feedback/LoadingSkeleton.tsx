export interface LoadingSkeletonProps {
  variant?: 'card-grid' | 'detail'
  count?: number
  label?: string
}

export function LoadingSkeleton({
  variant = 'card-grid',
  count = 3,
  label = 'Memuat produk sewa',
}: LoadingSkeletonProps) {
  if (variant === 'detail') {
    return (
      <div className="loading-skeleton-detail" role="status" aria-label={label}>
        <span className="visually-hidden">{label}</span>
        <div className="skeleton skeleton-media" />
        <div className="loading-skeleton-copy">
          <div className="skeleton skeleton-line skeleton-line-short" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
          <div className="skeleton skeleton-line" />
        </div>
      </div>
    )
  }

  return (
    <div className="loading-skeleton-grid" role="status" aria-label={label}>
      <span className="visually-hidden">{label}</span>
      {Array.from({ length: count }, (_, index) => (
        <div className="loading-skeleton-card" key={index} aria-hidden="true">
          <div className="skeleton skeleton-card-media" />
          <div className="skeleton skeleton-line skeleton-line-short" />
          <div className="skeleton skeleton-title" />
          <div className="skeleton skeleton-line" />
        </div>
      ))}
    </div>
  )
}
