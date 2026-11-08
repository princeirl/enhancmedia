import type { MetadataRoute } from "next";
import { isPreview, siteUrl } from "@/lib/content";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // A preview build must never be indexed.
  if (isPreview) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/", disallow: ["/api/"] }, sitemap: `${siteUrl}/sitemap.xml`, host: siteUrl };
}
