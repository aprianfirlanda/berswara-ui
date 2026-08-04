import type { ReactNode } from 'react'

export interface PolicySectionProps {
  title: string
  children: ReactNode
  eyebrow?: string
  icon?: ReactNode
}

export function PolicySection({
  title,
  children,
  eyebrow,
  icon,
}: PolicySectionProps) {
  return (
    <article className="policy-section">
      {icon ? <span className="policy-section-icon">{icon}</span> : null}
      {eyebrow ? <p className="policy-section-eyebrow">{eyebrow}</p> : null}
      <h3>{title}</h3>
      <div className="policy-section-content">{children}</div>
    </article>
  )
}
