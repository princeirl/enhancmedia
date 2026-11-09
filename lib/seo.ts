import type { Metadata } from "next";
import { isPreview, site, siteUrl } from "./content";

/** Per-page metadata: unique title, description, canonical URL and social sharing tags. */
/** The sharing image: one set in the admin (site.shareImage), or the generated default. */
const shareImage = site.shareImage ?? "/og.png";

export function pageMeta({
  title,
  description,
  path,
  type = "website",
}: {
  title?: string | null;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata {
  const fullTitle = title ? `${title} | ${site.name}` : `${site.name} | ${site.tagline}`;
  return {
    title: fullTitle,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: fullTitle,
      description,
      url: `${siteUrl}${path}`,
      siteName: site.name,
      type,
      locale: "en_IN",
      images: [{ url: shareImage, width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [shareImage] },
    robots: isPreview ? { index: false, follow: false } : undefined,
  };
}
