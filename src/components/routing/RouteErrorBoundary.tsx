import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

export function RouteErrorBoundary() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Terjadi kendala saat membuka halaman ini.'

  return (
    <main className="route-error">
      <p className="eyebrow">Oops</p>
      <h1>Halaman belum bisa ditampilkan</h1>
      <p>{message}</p>
      <Link className="button" to="/">Kembali ke beranda</Link>
    </main>
  )
}
