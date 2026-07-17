export const SEO_BRAND = "Đồng Phục Quang Vinh";
export const SUPPORTED_LOCALES = ["vi", "en"] as const;
export const DEFAULT_INDEX_LOCALE = "vi" as const;

type SiteEnvironment = {
  NODE_ENV?: string;
  SITE_URL?: string;
};

const PRODUCTION_ORIGIN = "https://www.dongphucquangvinh.com";

function isAllowedOrigin(origin: URL): boolean {
  const isOriginOnly =
    origin.pathname === "/" &&
    !origin.search &&
    !origin.hash &&
    !origin.username &&
    !origin.password;
  const isProduction = origin.origin === PRODUCTION_ORIGIN;
  const isLocal =
    origin.protocol === "http:" &&
    (origin.hostname === "localhost" || origin.hostname === "127.0.0.1");
  return isOriginOnly && (isProduction || isLocal);
}

export function resolveSiteOrigin(environment: SiteEnvironment = process.env): URL {
  const rawSiteUrl = environment.SITE_URL?.trim();
  if (!rawSiteUrl) {
    throw new Error("SITE_URL is required");
  }

  let origin: URL;
  try {
    origin = new URL(rawSiteUrl);
  } catch {
    throw new Error("SITE_URL must be an absolute URL");
  }

  if (origin.pathname !== "/" || origin.search || origin.hash || origin.username || origin.password) {
    throw new Error("SITE_URL must contain only an origin");
  }

  if (environment.NODE_ENV === "production") {
    if (origin.origin !== PRODUCTION_ORIGIN) {
      throw new Error(`SITE_URL must equal ${PRODUCTION_ORIGIN} in production`);
    }
  } else if (
    origin.protocol !== "http:" ||
    (origin.hostname !== "localhost" && origin.hostname !== "127.0.0.1")
  ) {
    throw new Error("SITE_URL must be an explicit HTTP localhost URL outside production");
  }

  return origin;
}

function encodedProductSlug(pathname: string): string | null {
  const match = pathname.match(/^\/(?:vi|en)\/product\/([^/]+)\/?$/u);
  if (!match) return null;
  try {
    return encodeURIComponent(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}

export function toVietnameseCanonicalPath(pathOrUrl: string): string | null {
  const url = new URL(pathOrUrl, "https://seo.local");
  const pathname = url.pathname.replace(/\/$/u, "") || "/";

  if (pathname === "/vi" || pathname === "/en") return "/vi";
  if (pathname === "/vi/products" || pathname === "/en/products") return "/vi/products";

  const slug = encodedProductSlug(pathname);
  return slug ? `/vi/product/${slug}` : null;
}

export function canonicalUrl(pathOrUrl: string, origin: URL): string | null {
  if (!isAllowedOrigin(origin)) {
    throw new Error("Canonical origin must be the production host or an explicit HTTP localhost origin");
  }
  const canonicalPath = toVietnameseCanonicalPath(pathOrUrl);
  return canonicalPath ? new URL(canonicalPath, origin).href.replace(/\/$/u, "") : null;
}
