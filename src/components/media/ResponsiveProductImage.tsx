import { useState } from 'react'
import type { ProductImageAsset } from '../../types/media'
import { ImageFallback } from './ImageFallback'

interface ResponsiveProductImageProps {
  asset: ProductImageAsset
  loading?: 'eager' | 'lazy'
  fetchPriority?: 'high' | 'low' | 'auto'
  sizes?: string
}

export function ResponsiveProductImage({
  asset,
  loading = 'lazy',
  fetchPriority = 'auto',
  sizes = '(max-width: 560px) calc(100vw - 3rem), (max-width: 960px) 45vw, 340px',
}: ResponsiveProductImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError) {
    return (
      <ImageFallback name={asset.name} width={asset.width} height={asset.height} />
    )
  }

  return (
    <img
      className="product-image"
      src={asset.sources.medium}
      srcSet={`${asset.sources.small} 480w, ${asset.sources.medium} 800w, ${asset.sources.large} ${asset.width}w`}
      sizes={sizes}
      width={asset.width}
      height={asset.height}
      alt={asset.alt}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      onError={() => setHasError(true)}
    />
  )
}
