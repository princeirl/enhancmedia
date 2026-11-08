import type { Metadata } from "next";
import { isPreview, site, siteUrl } from "./content";

/** Per-page metadata: unique title, description, canonical URL and social sharing tags. */
export function pageMeta({
  title,
  description,
  path,
  type = "website",
}: {
  title?: string;
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
      images: [{ url: "/og.png", width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: ["/og.png"] },
    robots: isPreview ? { index: false, follow: false } : undefined,
  };
}
