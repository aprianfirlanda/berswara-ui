import { Link } from 'react-router-dom'
import { PagePlaceholder } from './PagePlaceholder'

export function NotFoundPage() {
  return (
    <PagePlaceholder
      eyebrow="404"
      title="Halaman tidak ditemukan."
      description="Tautan mungkin sudah berubah atau halaman belum tersedia."
    >
      <Link className="button" to="/">Kembali ke beranda</Link>
    </PagePlaceholder>
  )
}
