import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const metadataModule = new URL('../src/lib/seo/metadata.ts', import.meta.url)
const jsonLdModule = new URL('../src/lib/seo/json-ld.ts', import.meta.url)
const productPage = new URL('../app/[lang]/product/[slug]/page.tsx', import.meta.url)
const catalogPage = new URL('../app/[lang]/products/page.tsx', import.meta.url)
const origin = new URL('https://www.dongphucquangvinh.com')

async function metadata() {
  return import(metadataModule.href)
}

async function jsonLd() {
  return import(jsonLdModule.href)
}

test('Vietnamese home metadata is indexable, branded, and canonical', async () => {
  const { buildStaticPageMetadata } = await metadata()
  const value = buildStaticPageMetadata({ locale: 'vi', page: 'home', origin })

  assert.match(String(value.title), /Đồng Phục Quang Vinh/i)
  assert.match(value.description, /đồng phục|quần áo|thể thao|in ấn/i)
  assert.equal(value.alternates.canonical, 'https://www.dongphucquangvinh.com/vi')
  assert.deepEqual(value.robots, { index: true, follow: true })
  assert.equal(value.openGraph.url, 'https://www.dongphucquangvinh.com/vi')
  assert.doesNotMatch(JSON.stringify(value), /sport\s*pro/i)
})

test('English home remains usable but canonicalizes to Vietnamese and is noindex', async () => {
  const { buildStaticPageMetadata } = await metadata()
  const value = buildStaticPageMetadata({ locale: 'en', page: 'home', origin })

  assert.equal(value.alternates.canonical, 'https://www.dongphucquangvinh.com/vi')
  assert.deepEqual(value.robots, { index: false, follow: true })
  assert.equal(value.openGraph.url, 'https://www.dongphucquangvinh.com/vi')
})

test('catalog metadata collapses query variants to the Vietnamese catalog canonical', async () => {
  const { buildStaticPageMetadata } = await metadata()
  for (const locale of ['vi', 'en']) {
    const value = buildStaticPageMetadata({
      locale,
      page: 'products',
      origin,
      searchParams: { category: 'ao-bong-da', page: '2' },
    })
    assert.equal(value.alternates.canonical, 'https://www.dongphucquangvinh.com/vi/products')
    assert.equal(value.robots.index, locale === 'vi')
    assert.equal(value.robots.follow, true)
    assert.match(String(value.title), /Đồng Phục Quang Vinh/i)
    assert.match(value.description, /sản phẩm|quần áo|thể thao|đồng phục/i)
  }
})

test('active product metadata is unique while English is noindex with Vietnamese canonical', async () => {
  const { buildProductMetadata } = await metadata()
  const product = {
    name: 'Áo bóng đá Phoenix', slug: 'ao-bong-da-phoenix', description: 'Áo thi đấu thoáng khí.',
    images: [{ imageUrl: 'https://cdn.example/phoenix.jpg', isThumbnail: true }],
    variants: [{ originalPrice: 250000, salePrice: 220000, stockQuantity: 4, status: 'ACTIVE' }],
  }
  const vi = buildProductMetadata({ locale: 'vi', product, origin })
  const en = buildProductMetadata({ locale: 'en', product, origin })

  assert.match(String(vi.title), /Áo bóng đá Phoenix/)
  assert.match(String(vi.title), /Đồng Phục Quang Vinh/)
  assert.equal(vi.alternates.canonical, 'https://www.dongphucquangvinh.com/vi/product/ao-bong-da-phoenix')
  assert.deepEqual(vi.robots, { index: true, follow: true })
  assert.deepEqual(en.robots, { index: false, follow: true })
  assert.equal(en.alternates.canonical, vi.alternates.canonical)
  assert.equal(vi.openGraph.images[0].url, product.images[0].imageUrl)
})

test('product metadata tolerates missing optional image and description without inventing values', async () => {
  const { buildProductMetadata } = await metadata()
  const value = buildProductMetadata({
    locale: 'vi', origin,
    product: { name: 'Áo trơn', slug: 'ao-tron', description: '', images: [], variants: [] },
  })

  assert.equal(value.alternates.canonical, 'https://www.dongphucquangvinh.com/vi/product/ao-tron')
  assert.ok(!value.openGraph.images || value.openGraph.images.length === 0)
  assert.doesNotMatch(value.description, /undefined|null/i)
})

test('JSON-LD serialization escapes markup-significant less-than characters and remains parseable', async () => {
  const { serializeJsonLd } = await jsonLd()
  const serialized = serializeJsonLd({ name: '</script><script>alert(1)</script>', note: 'áo < đẹp' })

  assert.equal(serialized.includes('<'), false)
  assert.deepEqual(JSON.parse(serialized), { name: '</script><script>alert(1)</script>', note: 'áo < đẹp' })
  assert.match(serialized, /\\u003c/i)
})

test('Product JSON-LD emits truthful VND offer and stock availability only from reliable variants', async () => {
  const { buildProductJsonLd } = await jsonLd()
  const value = buildProductJsonLd({
    origin,
    product: {
      name: 'Áo chạy bộ', slug: 'ao-chay-bo', description: 'Áo chạy bộ nhẹ.', images: [],
      variants: [
        { originalPrice: 300000, salePrice: 250000, stockQuantity: 2, status: 'ACTIVE' },
        { originalPrice: 320000, salePrice: 0, stockQuantity: 0, status: 'INACTIVE' },
      ],
    },
  })

  assert.equal(value['@type'], 'Product')
  assert.equal(value.offers.priceCurrency, 'VND')
  assert.equal(value.offers.price, 250000)
  assert.match(value.offers.availability, /InStock$/)
  assert.equal(value.aggregateRating, undefined)
  assert.equal(value.image, undefined)
})

test('Product JSON-LD omits unsupported offer and ratings instead of fabricating defaults', async () => {
  const { buildProductJsonLd } = await jsonLd()
  const value = buildProductJsonLd({
    origin,
    product: {
      name: 'Sản phẩm đặt may', slug: 'san-pham-dat-may', description: '', images: [], variants: [],
      averageRating: 5, reviewCount: 0,
    },
  })

  assert.equal(value.offers, undefined)
  assert.equal(value.aggregateRating, undefined)
  assert.equal(value.image, undefined)
  assert.equal(value.sku, undefined)
})

test('Product JSON-LD includes ratings only when both rating and positive review count are reliable', async () => {
  const { buildProductJsonLd } = await jsonLd()
  const value = buildProductJsonLd({
    origin,
    product: {
      name: 'Áo polo', slug: 'ao-polo', description: 'Áo polo.', images: [], variants: [],
      averageRating: 4.6, reviewCount: 12,
    },
  })
  assert.deepEqual(value.aggregateRating, { '@type': 'AggregateRating', ratingValue: 4.6, reviewCount: 12 })
})

test('product route is server-owned and uses generateMetadata plus notFound for unavailable products', async () => {
  const source = await readFile(productPage, 'utf8')
  assert.doesNotMatch(source, /^\s*["']use client["']/m)
  assert.match(source, /export\s+(?:async\s+)?function\s+generateMetadata|export\s+const\s+generateMetadata/)
  assert.match(source, /\bnotFound\s*\(/)
  assert.match(source, /await\s+[^;\n]*(?:product|Product)[^;\n]*(?:slug|params)|(?:slug|params)[^;\n]*(?:product|Product)/i)
})

test('catalog no longer mutates title and description from the client component', async () => {
  const source = await readFile(catalogPage, 'utf8')
  assert.doesNotMatch(source, /<title[>\s]/i)
  assert.doesNotMatch(source, /<meta\s+name=["']description["']/i)
})
