import { apiClient, ApiResponse } from "@/lib/api-client";

/** Closed client-side view of the anonymous content contract. */
export const PUBLIC_CONTENT_KEYS = [
  "zalo_link",
  "contact.phone",
  "contact.email",
  "contact.address",
  "footer.description",
  "footer.description.vi",
  "footer.description.en",
  "footer.contact_url",
  "footer.returns_url",
  "footer.tracking_url",
  "footer.size_guide_url",
  "footer.faq_url",
  "footer.facebook_url",
  "footer.instagram_url",
  "seo.home.title.vi",
  "seo.home.title.en",
  "seo.home.description.vi",
  "seo.home.description.en",
  "seo.products.title.vi",
  "seo.products.title.en",
  "seo.products.description.vi",
  "seo.products.description.en",
  "banner.home.image_url",
  "banner.home.link",
] as const;

export type PublicContentKey = (typeof PUBLIC_CONTENT_KEYS)[number];
export type PublicContentMap = Partial<Record<PublicContentKey, string>>;
export type PublicContentLocale = "vi" | "en";

type PublicConfigEntry = {
  configKey: string;
  configValue?: string | null;
  scope?: "PUBLIC" | "INTERNAL";
  active?: boolean;
};

let publicContentPromise: Promise<PublicContentMap> | null = null;

function isPublicContentKey(key: string): key is PublicContentKey {
  return (PUBLIC_CONTENT_KEYS as readonly string[]).includes(key);
}

function loadPublicContent(): Promise<PublicContentMap> {
  if (!publicContentPromise) {
    publicContentPromise = apiClient
      .get<ApiResponse<PublicConfigEntry[]>>("/public-configs")
      .then((response) => response.data.reduce<PublicContentMap>((result, entry) => {
        if (
          isPublicContentKey(entry.configKey) &&
          entry.scope === "PUBLIC" &&
          entry.active !== false &&
          typeof entry.configValue === "string"
        ) {
          result[entry.configKey] = entry.configValue;
        }
        return result;
      }, {}))
      .catch((error) => {
        console.error("Failed to fetch public content", error);
        return {};
      });
  }
  return publicContentPromise;
}

export function getLocalizedPublicContent(
  content: PublicContentMap,
  key: "footer.description" | "seo.home.title" | "seo.home.description" | "seo.products.title" | "seo.products.description",
  locale: PublicContentLocale,
  fallback: string,
): string {
  const localizedKey = `${key}.${locale}` as PublicContentKey;
  return content[localizedKey] ?? content[key as PublicContentKey] ?? fallback;
}

export function getSafePublicUrl(value: string | undefined, fallback = "#"): string {
  if (!value?.trim()) return fallback;
  const candidate = value.trim();
  if (candidate.startsWith("/")) return candidate;
  try {
    const url = new URL(candidate);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : fallback;
  } catch {
    return fallback;
  }
}

export const publicConfigService = {
  getConfigsMap: loadPublicContent,
  clearCache: () => {
    publicContentPromise = null;
  },
  getConfigByKey: async (key: PublicContentKey) => {
    const configs = await loadPublicContent();
    const value = configs[key];
    return value === undefined ? null : { configKey: key, configValue: value };
  },
};
