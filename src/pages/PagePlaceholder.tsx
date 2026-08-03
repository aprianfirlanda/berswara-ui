import type { ReactNode } from 'react'

interface PagePlaceholderProps {
  eyebrow: string
  title: string
  description: string
  children?: ReactNode
}

export function PagePlaceholder({
  eyebrow,
  title,
  description,
  children,
}: PagePlaceholderProps) {
  return (
    <section className="page-placeholder">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="page-description">{description}</p>
      {children}
    </section>
  )
}
