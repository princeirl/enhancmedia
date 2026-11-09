import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { marked } from "marked";

import siteData from "@/content/site.json";
import servicesData from "@/content/services.json";
import industriesData from "@/content/industries.json";
import teamData from "@/content/team.json";
import workData from "@/content/work.json";
import sharedData from "@/content/shared.json";
import navigationData from "@/content/navigation.json";
import formsData from "@/content/forms.json";

/**
 * Content lives in `content/` as JSON and Markdown, so it can be edited without touching
 * components (see README → "Updating content").
 *
 * Anything marked `"status": "draft"` is placeholder or unapproved material. It is left out
 * of the production build entirely, and appears — clearly labelled — only in a preview build
 * (`npm run build:preview`, or `npm run dev`).
 */
export const isPreview =
  process.env.SITE_PREVIEW === "1" || process.env.NODE_ENV === "development";

export type Status = "draft" | "published";

type Published = { status?: Status | string };
export function visible<T extends Published>(items: T[]): T[] {
  return isPreview ? items : items.filter((i) => i.status === "published");
}
export const isDraft = (i: Published) => i.status !== "published";

// ---------- Site ----------
export type Site = Omit<typeof siteData, "legalName" | "brand" | "contact" | "social" | "forms" | "booking" | "shareImage"> & {
  shareImage: string | null;
  legalName: string | null;
  brand: { logoOnLight: string | null; logoOnDark: string | null };
  contact: {
    email: string | null;
    phone: string | null;
    whatsapp: string | null;
    address: string | null;
    hours: string | null;
  };
  social: { label: string; url: string }[];
  forms: { endpoint: string; turnstileSiteKey: string | null };
  booking: { provider: string | null; url: string | null };
};
export const site = siteData as unknown as Site;
// The spam-protection site key (public) may also be supplied at build time.
if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) site.forms.turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/** Canonical origin: `url` in content/site.json, or SITE_URL at build time to override it. */
export const siteUrl = (process.env.SITE_URL || site.url).replace(/\/$/, "");

// ---------- Shared text, navigation, forms, pages ----------
export type Link = { label: string; href: string };
export const shared = sharedData;
export const navigation = navigationData as Omit<typeof navigationData, "header"> & {
  header: Omit<typeof navigationData.header, "items"> & {
    items: { label: string; href: string; auto: "services" | "industries" | null; allLabel: string | null; children: Link[] }[];
  };
};
export const forms = formsData;
export type FormsText = typeof formsData;

import homePage from "@/content/pages/home.json";
import aboutPage from "@/content/pages/about.json";
import servicesPage from "@/content/pages/services.json";
import serviceDetailPage from "@/content/pages/service-detail.json";
import industriesPage from "@/content/pages/industries.json";
import industryDetailPage from "@/content/pages/industry-detail.json";
import workPage from "@/content/pages/work.json";
import workDetailPage from "@/content/pages/work-detail.json";
import insightsPage from "@/content/pages/insights.json";
import articlePage from "@/content/pages/article.json";
import leadershipPage from "@/content/pages/leadership.json";
import contactPage from "@/content/pages/contact.json";
import bookPage from "@/content/pages/book-a-consultation.json";
import notFoundPage from "@/content/pages/not-found.json";

/** Every page's own text, one file per page in `content/pages/`. */
const pages = {
  home: homePage,
  about: aboutPage,
  services: servicesPage,
  "service-detail": serviceDetailPage,
  industries: industriesPage,
  "industry-detail": industryDetailPage,
  work: workPage,
  "work-detail": workDetailPage,
  insights: insightsPage,
  article: articlePage,
  leadership: leadershipPage,
  contact: contactPage,
  "book-a-consultation": bookPage,
  "not-found": notFoundPage,
};
export const page = <K extends keyof typeof pages>(name: K): (typeof pages)[K] => pages[name];

/** Fills `{name}` placeholders in editable text, e.g. "Service {number} · {title}". */
export function fill(text: string, vars: Record<string, string | number>) {
  return text.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m));
}

// ---------- Legal pages ----------
export type LegalDoc = { title: string; description: string; updated: string; sections: { heading: string; html: string }[] };
export function legal(name: "privacy-policy" | "terms"): LegalDoc {
  const { data, content } = matter(fs.readFileSync(path.join(process.cwd(), "content", "legal", `${name}.md`), "utf8"));
  const s = siteData as unknown as Site;
  const entity = s.legalName ?? s.name;
  const contact = s.contact.email ? `[${s.contact.email}](mailto:${s.contact.email})` : "[our contact form](/contact)";
  const body = content.replaceAll("{entity}", entity).replaceAll("{contact}", contact);
  const sections = body
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const nl = chunk.indexOf("\n");
      return { heading: chunk.slice(0, nl).trim(), html: marked.parse(chunk.slice(nl + 1), { async: false }) as string };
    });
  return { title: String(data.title), description: String(data.description), updated: String(data.updated), sections };
}

// ---------- Services ----------
export type Service = {
  slug: string;
  title: string;
  short: string;
  headline: string;
  intro: string;
  problems: string[];
  offerings: { title: string; text: string }[];
  process: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
  commitments?: string[];
};
export const services = servicesData as Service[];
export const getService = (slug: string) => services.find((s) => s.slug === slug);

// ---------- Industries ----------
export type Industry = {
  slug: string;
  title: string;
  short: string;
  headline: string;
  understanding: string;
  challenges: string[];
  services: string[];
  solutions: { title: string; text: string }[];
  approach: string;
};
export const industries = industriesData as Industry[];
export const getIndustry = (slug: string) => industries.find((s) => s.slug === slug);

// ---------- Team ----------
export type Person = {
  slug: string;
  status: Status;
  name: string;
  role: string;
  photo: string | null;
  bio: string | null;
  summary: string | null;
  linkedin: string | null;
  note?: string;
};
export const team = () => visible(teamData as Person[]);

// ---------- Work ----------
export type Project = {
  slug: string;
  status: Status;
  title: string;
  client: string | null;
  industry: string;
  category: string;
  services: string[];
  year: string | null;
  cover: string | null;
  summary: string;
  background: string;
  challenge: string;
  strategy: string;
  execution: string;
  deliverables: string[];
  results: string | null;
  gallery: { src: string; alt: string }[];
};
export const workCategories = (): string[] => page("work").categories;
export const work = () => visible(workData as Project[]);
export const getProject = (slug: string) => work().find((p) => p.slug === slug);
export const workForService = (slug: string) => work().filter((p) => p.services.includes(slug));

// ---------- Insights ----------
export type Article = {
  slug: string;
  title: string;
  category: string;
  date: string;
  status: Status;
  excerpt: string;
  cover: string | null;
  html: string;
};

const insightsDir = path.join(process.cwd(), "content", "insights");

let articleCache: Article[] | null = null;
function allArticles(): Article[] {
  if (articleCache) return articleCache;
  const files = fs.existsSync(insightsDir)
    ? fs.readdirSync(insightsDir).filter((f) => f.endsWith(".md"))
    : [];
  articleCache = files
    .map((file) => {
      const { data, content } = matter(fs.readFileSync(path.join(insightsDir, file), "utf8"));
      return {
        slug: file.replace(/\.md$/, ""),
        title: String(data.title),
        category: String(data.category ?? "Insights"),
        date: String(data.date),
        status: (data.status === "published" ? "published" : "draft") as Status,
        excerpt: String(data.excerpt ?? ""),
        cover: data.cover ? String(data.cover) : null,
        html: marked.parse(content, { async: false }) as string,
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  return articleCache;
}
export const insights = () => visible(allArticles());
export const getArticle = (slug: string) => insights().find((a) => a.slug === slug);

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
