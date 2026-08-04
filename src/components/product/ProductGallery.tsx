import { useId, useState } from 'react'
import type { ProductImageAsset } from '../../types/media'
import { ResponsiveProductImage } from '../media/ResponsiveProductImage'

export interface ProductGalleryProps {
  images: readonly ProductImageAsset[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const galleryId = useId()
  const [activeIndex, setActiveIndex] = useState(0)
  const activeImage = images[activeIndex] ?? images[0]

  if (!activeImage) {
    return (
      <div className="product-gallery-empty" role="img" aria-label={`Foto ${productName} belum tersedia`}>
        Foto produk belum tersedia
      </div>
    )
  }

  return (
    <section className="product-gallery" aria-label={`Galeri ${productName}`}>
      <div className="product-gallery-stage" id={`${galleryId}-stage`}>
        <ResponsiveProductImage asset={activeImage} loading="eager" />
      </div>
      {images.length > 1 ? (
        <div
          className="product-gallery-thumbnails"
          role="group"
          aria-label="Pilih foto produk"
        >
          {images.map((image, index) => (
            <button
              key={`${image.slug}-${index}`}
              type="button"
              className="product-gallery-thumbnail"
              aria-pressed={index === activeIndex}
              aria-controls={`${galleryId}-stage`}
              onClick={() => setActiveIndex(index)}
            >
              <ResponsiveProductImage asset={image} />
              <span className="visually-hidden">Tampilkan foto {index + 1}</span>
            </button>
          ))}
        </div>
      ) : null}
    </section>
  )
}
