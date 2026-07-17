import assert from 'node:assert/strict'
import test from 'node:test'

const policyModule = new URL('../src/lib/seo/policy.ts', import.meta.url)

async function policy() {
  return import(policyModule.href)
}

test('registry exposes the Vietnamese-first public SEO identity', async () => {
  const seo = await policy()

  assert.equal(seo.SEO_BRAND, 'Đồng Phục Quang Vinh')
  assert.deepEqual(seo.SUPPORTED_LOCALES, ['vi', 'en'])
  assert.equal(seo.DEFAULT_INDEX_LOCALE, 'vi')
})

test('production SITE_URL accepts only the exact HTTPS canonical host', async () => {
  const { resolveSiteOrigin } = await policy()

  assert.equal(
    resolveSiteOrigin({ NODE_ENV: 'production', SITE_URL: 'https://dongphucquangvinh.com' }).href,
    'https://dongphucquangvinh.com/',
  )
  for (const siteUrl of [
    undefined,
    '',
    'http://www.dongphucquangvinh.com',
    'https://www.dongphucquangvinh.com',
    'https://evil.example',
  ]) {
    assert.throws(
      () => resolveSiteOrigin({ NODE_ENV: 'production', SITE_URL: siteUrl }),
      /SITE_URL/,
    )
  }
})

test('non-production origin requires an explicit safe localhost URL', async () => {
  const { resolveSiteOrigin } = await policy()

  assert.equal(
    resolveSiteOrigin({ NODE_ENV: 'development', SITE_URL: 'http://localhost:3000' }).href,
    'http://localhost:3000/',
  )
  assert.equal(
    resolveSiteOrigin({ NODE_ENV: 'test', SITE_URL: 'http://127.0.0.1:3000' }).href,
    'http://127.0.0.1:3000/',
  )
  assert.throws(() => resolveSiteOrigin({ NODE_ENV: 'test', SITE_URL: undefined }), /SITE_URL/)
  assert.throws(
    () => resolveSiteOrigin({ NODE_ENV: 'development', SITE_URL: 'https://preview.example' }),
    /SITE_URL/,
  )
})

test('English public routes map to matching Vietnamese canonical paths', async () => {
  const { toVietnameseCanonicalPath } = await policy()

  assert.equal(toVietnameseCanonicalPath('/en'), '/vi')
  assert.equal(toVietnameseCanonicalPath('/en/products'), '/vi/products')
  assert.equal(toVietnameseCanonicalPath('/en/product/ao%20bong-da'), '/vi/product/ao%20bong-da')
  assert.equal(toVietnameseCanonicalPath('/vi/product/áo đấu'), '/vi/product/%C3%A1o%20%C4%91%E1%BA%A5u')
})

test('catalog queries collapse to one canonical and unknown/private paths are not canonicalized', async () => {
  const { toVietnameseCanonicalPath } = await policy()

  assert.equal(toVietnameseCanonicalPath('/vi/products?gender=men&page=2'), '/vi/products')
  assert.equal(toVietnameseCanonicalPath('/en/products?q=football'), '/vi/products')
  assert.equal(toVietnameseCanonicalPath('/vi/admin'), null)
  assert.equal(toVietnameseCanonicalPath('/vi/not-a-public-route'), null)
})

test('canonicalUrl is absolute and never retains query or fragment variants', async () => {
  const { canonicalUrl } = await policy()
  const origin = new URL('https://dongphucquangvinh.com')

  assert.equal(canonicalUrl('/en/products?sort=price#items', origin), 'https://dongphucquangvinh.com/vi/products')
})
