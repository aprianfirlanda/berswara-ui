export interface ResponsiveImageSources {
  small: string
  medium: string
  large: string
}

export interface ProductImageAsset {
  slug: string
  name: string
  alt: string
  width: number
  height: number
  sources: ResponsiveImageSources
}
