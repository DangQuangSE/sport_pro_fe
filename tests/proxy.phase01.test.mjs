import assert from 'node:assert/strict'
import test from 'node:test'
import { NextRequest } from 'next/server'

const proxyModule = new URL('../proxy.ts', import.meta.url)

async function loadProxy() {
  return import(proxyModule.href)
}

function request(path, { acceptLanguage = 'en-US', cookies = {} } = {}) {
  const headers = new Headers({ 'accept-language': acceptLanguage })
  const cookie = Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join('; ')
  if (cookie) headers.set('cookie', cookie)
  return new NextRequest(`https://www.dongphucquangvinh.com${path}`, { headers })
}

test('root permanently redirects to /vi regardless of Accept-Language', async () => {
  const { proxy } = await loadProxy()

  for (const acceptLanguage of ['vi-VN,vi;q=0.9', 'en-US,en;q=0.9']) {
    const response = await proxy(request('/', { acceptLanguage }))
    assert.equal(response.status, 308)
    assert.equal(response.headers.get('location'), 'https://www.dongphucquangvinh.com/vi')
  }
})

test('unprefixed public routes permanently redirect to Vietnamese', async () => {
  const { proxy } = await loadProxy()
  const response = await proxy(request('/products?gender=men', { acceptLanguage: 'en-US' }))

  assert.equal(response.status, 308)
  assert.equal(response.headers.get('location'), 'https://www.dongphucquangvinh.com/vi/products?gender=men')
})

test('logged-out protected redirects preserve the requested locale', async () => {
  const { proxy } = await loadProxy()

  const en = await proxy(request('/en/profile', { acceptLanguage: 'vi-VN' }))
  const vi = await proxy(request('/vi/orders', { acceptLanguage: 'en-US' }))
  assert.equal(en.headers.get('location'), 'https://www.dongphucquangvinh.com/en/login')
  assert.equal(vi.headers.get('location'), 'https://www.dongphucquangvinh.com/vi/login')
})

test('role and authenticated auth-page redirects preserve the requested locale', async () => {
  const { proxy } = await loadProxy()

  const nonAdmin = await proxy(request('/en/admin', {
    acceptLanguage: 'vi-VN',
    cookies: { is_logged_in: 'true', user_role: 'USER' },
  }))
  const loggedIn = await proxy(request('/vi/login', {
    acceptLanguage: 'en-US',
    cookies: { is_logged_in: 'true', user_role: 'USER' },
  }))
  assert.equal(nonAdmin.headers.get('location'), 'https://www.dongphucquangvinh.com/en')
  assert.equal(loggedIn.headers.get('location'), 'https://www.dongphucquangvinh.com/vi')
})

test('English public pages remain usable and are not redirected to Vietnamese', async () => {
  const { proxy } = await loadProxy()
  assert.equal(await proxy(request('/en')), undefined)
  assert.equal(await proxy(request('/en/products')), undefined)
})

test('proxy matcher excludes framework assets, metadata, files, images, and application APIs', async () => {
  const { config } = await loadProxy()
  assert.equal(config.matcher.length, 1)
  const matcher = new RegExp(`^${config.matcher[0]}$`)

  for (const excluded of [
    '/_next/static/chunk.js',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
    '/api/products',
    '/images/logo.png',
    '/asset.css',
  ]) {
    assert.equal(matcher.test(excluded), false, `${excluded} must bypass proxy`)
  }
  assert.equal(matcher.test('/'), true)
  assert.equal(matcher.test('/vi/products'), true)
})
