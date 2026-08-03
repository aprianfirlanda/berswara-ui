import { Link } from 'react-router-dom'
import { PagePlaceholder } from './PagePlaceholder'

export function HomePage() {
  return (
    <PagePlaceholder
      eyebrow="Sewa perlengkapan bayi"
      title="Lebih praktis untuk setiap tahap tumbuh si kecil."
      description="Temukan stroller, earmuff, push walker, dan balance bike yang siap menemani keluarga."
    >
      <Link className="button" to="/catalog">Lihat katalog sewa</Link>
    </PagePlaceholder>
  )
}
