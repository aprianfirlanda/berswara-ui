import { describe, expect, test } from 'bun:test'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { NotFoundPage } from '../src/pages/NotFoundPage'
import { ProductDetailPage } from '../src/pages/ProductDetailPage'

function renderNotFound() {
  return renderToStaticMarkup(
    <MemoryRouter>
      <NotFoundPage />
    </MemoryRouter>,
  )
}

describe('Not Found recovery', () => {
  test('offers clear Catalog, Home, and Contact recovery paths', () => {
    const markup = renderNotFound()

    expect(markup).toContain('Halaman yang dicari belum ditemukan')
    expect(markup).toContain('href="/catalog"')
    expect(markup).toContain('Jelajahi katalog')
    expect(markup).toContain('href="/"')
    expect(markup).toContain('Kembali ke beranda')
    expect(markup).toContain('href="/contact"')
    expect(markup).toContain('Hubungi Berswara')
  })

  test('provides a programmatically focusable recovery heading', () => {
    const markup = renderNotFound()

    expect(markup).toContain('id="not-found-heading"')
    expect(markup).toContain('tabindex="-1"')
    expect(markup).toContain('aria-labelledby="not-found-heading"')
  })

  test('does not reveal publication or inventory state', () => {
    const markup = renderNotFound().toLowerCase()

    expect(markup).not.toContain('unpublished')
    expect(markup).not.toContain('published')
    expect(markup).not.toContain('inventory')
    expect(markup).not.toContain('stok internal')
  })

  test('uses the same safe recovery for an unpublished product slug', () => {
    const markup = renderToStaticMarkup(
      <MemoryRouter initialEntries={['/products/cybex-libelle']}>
        <Routes>
          <Route path="/products/:productSlug" element={<ProductDetailPage />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(markup).toContain('Halaman yang dicari belum ditemukan')
    expect(markup).toContain('Jelajahi katalog')
    expect(markup).not.toContain('Tarif sewa Cybex Libelle')
  })
})
