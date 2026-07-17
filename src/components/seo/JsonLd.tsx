import { serializeJsonLd } from "@/lib/seo/json-ld";

export function JsonLd({ value }: { value: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(value) }} />;
}
