export function BrandLogo() {
  return (
    <picture>
      <source
        type="image/webp"
        srcSet="/assets/brand/berswara-logo-320.webp 320w, /assets/brand/berswara-logo-640.webp 640w"
        sizes="(max-width: 480px) 150px, 180px"
      />
      <img
        className="brand-logo"
        src="/assets/brand/berswara-logo-320.png"
        srcSet="/assets/brand/berswara-logo-320.png 320w, /assets/brand/berswara-logo-640.png 640w"
        sizes="(max-width: 480px) 150px, 180px"
        width="320"
        height="83"
        alt="Berswara"
        decoding="async"
      />
    </picture>
  )
}
