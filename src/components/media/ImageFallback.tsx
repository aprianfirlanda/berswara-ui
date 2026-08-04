export interface ImageFallbackProps {
  name: string
  width?: number
  height?: number
  message?: string
}

export function ImageFallback({
  name,
  width = 4,
  height = 3,
  message = 'Foto belum tersedia',
}: ImageFallbackProps) {
  return (
    <div
      className="product-image-fallback"
      role="img"
      aria-label={`Foto ${name} belum tersedia`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <img src="/assets/product-image-fallback.svg" alt="" />
      <span>{message}</span>
    </div>
  )
}
