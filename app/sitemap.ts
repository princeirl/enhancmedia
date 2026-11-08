import type { MetadataRoute } from "next";
import { industries, insights, services, siteUrl, work } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const stat = ["", "/about", "/leadership", "/services", "/industries", "/work", "/insights", "/contact", "/book-a-consultation", "/privacy-policy", "/terms"];
  const urls = [
    ...stat,
    ...services.map((s) => `/services/${s.slug}`),
    ...industries.map((s) => `/industries/${s.slug}`),
    ...work().map((p) => `/work/${p.slug}`),
    ...insights().map((a) => `/insights/${a.slug}`),
  ];
  return urls.map((u) => ({ url: `${siteUrl}${u}`, changeFrequency: "monthly", priority: u === "" ? 1 : 0.7 }));
}
