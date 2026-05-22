# SEO — source-subject-client (App Router)

Tài liệu chuẩn triển khai SEO/metadata trong dự án. Đối chiếu code tại `lib/seo/`, `app/layout.tsx`, `app/sitemap.ts`, `app/robots.ts`.

## 1. Biến môi trường

| Biến | Bắt buộc | Vai trò |
|------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | **Có** khi build/deploy production | Origin chuẩn cho canonical, OG URL, sitemap, `metadataBase`. **Không** có slash cuối (ví dụ `https://example.com`). |
| `NEXT_PUBLIC_API_URL` | Khuyến nghị | Backend phục vụ API public subjects — dùng trong `getPublicSubjectsForSeo()` (sitemap, metadata theo slug). Mặc định dev: `http://localhost:8080/`. |

**Local:** không set `NEXT_PUBLIC_APP_URL` thì `getSiteUrl()` fallback `http://localhost:3000`.

## 2. API chính (`lib/seo/`)

### `getSiteUrl()` — `lib/seo/site.ts`

- Nguồn chân lý **origin tĩnh** (build-time / env).
- Dùng cho: `buildPageMetadata`, `app/sitemap.ts`, `app/robots.ts`, `metadataBase` ở root layout.

### `buildPageMetadata()` — `lib/seo/metadata.ts`

- Tham số: `title`, `description?`, `path` (đường dẫn pathname, có hoặc không `/` đầu), `noindex?`.
- Output: `Metadata` Next.js với **canonical**, **robots**, **openGraph**, **twitter** (card `summary_large_image`).
- Tiêu đề social: nếu `title` chưa chứa `REQ-Bean9` thì thêm hậu tố `| REQ-Bean9` cho OG/Twitter (title template của layout không áp dụng trực tiếp cho OG).

### `getSiteUrlFromRequest()` — `lib/seo/request-site-url.ts`

- **Chỉ server** (Server Components / `generateMetadata`): đọc `Host` / `X-Forwarded-Host` / `X-Forwarded-Proto`.
- Dùng khi cần **origin trùng domain với request** (đa domain, preview share Facebook/Zalo): ví dụ `RootJsonLd`.
- Fallback: `getSiteUrl()`.

### `SITE` — `lib/seo/site.ts`

- `name`, `shortName`, `defaultDescription`, `locale` — mô tả mặc định và branding; override theo từng route qua metadata.

### Dữ liệu môn cho SEO — `lib/seo/fetch-subjects-public.ts`

- `getPublicSubjectsForSeo()`: cache theo request, `fetch` có `next: { revalidate: 600 }`, phân trang an toàn (giới hạn trang).
- `getSubjectSeoBySlug(slug)`: lookup trong list đã fetch — dùng trong `generateMetadata` động.

## 3. Root layout — `app/layout.tsx`

- `metadataBase: new URL(getSiteUrl())` — bắt buộc đúng prod URL để URL tương đối trong metadata resolve đúng.
- `metadata` mặc định: title template `%s | REQ-Bean9`, keywords, OG/Twitter, canonical gốc.
- `<html lang="vi">`.
- `<RootJsonLd />` — JSON-LD toàn site (xem mục 5).

## 4. Route mới — checklist

1. **Metadata**
   - Export `metadata` tĩnh hoặc `generateMetadata` async cho mọi route **public** cần index.
   - Ưu tiên `buildPageMetadata({ title, description, path: "/..." })` để đồng bộ canonical/OG.

2. **Nội dung có HTML tĩnh**
   - Có ít nhất phần quan trọng cho SEO (ít nhất một `h1` rõ nghĩa khi hợp lý) — **tránh** toàn bộ nội dung chính chỉ render sau hydrate client mà không có HTML ban đầu.

3. **Hiệu năng `generateMetadata`**
   - Không làm query nặng / không giới hạn trên mọi navigation.
   - Tái sử dụng fetch đã cache/`revalidate` (pattern trong `lib/seo/fetch-subjects-public.ts`).

4. **Sitemap** (nếu route cần Google index)
   - Mở rộng `app/sitemap.ts`: thêm entry theo pattern static + optional `flatMap` từ API (giống nhánh `luyen-de/${slug}`).

5. **Loading UX**
   - Xem `AGENTS.md`: hầu hết segment có `loading.tsx` cùng cấp `page.tsx` (trừ ngoại lệ đã ghi trong repo).

## 5. JSON-LD — `lib/seo/root-json-ld.tsx`

- Server component: `@graph` gồm **Organization**, **WebSite**, và **ItemList** minh họa luồng luyện đề (URL thật trên site).
- URL dùng `getSiteUrlFromRequest()` để khớp domain request.
- Không thêm `SearchAction` tới đường dẫn tìm kiếm nếu app chưa có trang tìm nội bộ tương ứng.

## 6. `robots.txt` — `app/robots.ts`

- `allow: "/"`, `disallow: ["/api/"]`.
- `sitemap: ${getSiteUrl()}/sitemap.xml`.

## 7. `sitemap.xml` — `app/sitemap.ts`

- Entry tĩnh (home, `/luyen-de`, `/khoa-hoc`, …).
- Entry động: `getPublicSubjectsForSeo()` → `/luyen-de/[slug]`, `/luyen-de/[slug]/thi-thu`.
- Khi thêm nhóm URL mới: **cập nhật file này** nếu cần index.

## 8. Ví dụ `generateMetadata` có sẵn

- `app/luyen-de/[slug]/hoc-theo-de/page.tsx` — dùng `buildPageMetadata` + slug.
- `app/(landing)/page.tsx` — metadata landing.

Tham khảo pattern import và `path` canonical cho đúng route.

## 9. Quy tắc Cursor trong repo

- `.cursor/rules/seo-app-router.mdc` — nhắc `getSiteUrl`, `buildPageMetadata`, `NEXT_PUBLIC_APP_URL`, HTML tĩnh, mở rộng sitemap.

---

**Tóm tắt:** Production luôn set `NEXT_PUBLIC_APP_URL`; route public dùng `buildPageMetadata`; URL động cần index thì cập nhật `app/sitemap.ts`; metadata nặng phải qua fetch có cache/revalidate; đa domain share preview cân nhắc `getSiteUrlFromRequest` cho JSON-LD và các metadata phụ thuộc request.
