import { readFileSync } from 'node:fs'
import { expect, test } from 'bun:test'

test('Vercel keeps SPA routing, cache controls, and static security headers', () => {
  const config = JSON.parse(
    readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'),
  ) as {
    rewrites: Array<{ source: string; destination: string }>
    headers: Array<{ source: string; headers: Array<{ key: string; value: string }> }>
  }

  expect(config.rewrites).toContainEqual({
    source: '/(.*)',
    destination: '/index.html',
  })
  expect(config.headers.flatMap((rule) => rule.headers.map((header) => header.key))).toEqual(
    expect.arrayContaining([
      'Content-Security-Policy',
      'Permissions-Policy',
      'Referrer-Policy',
      'X-Content-Type-Options',
      'X-Frame-Options',
    ]),
  )
})
