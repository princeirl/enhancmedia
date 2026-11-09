import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Logo } from "@/components/Logo";
import { RevealObserver } from "@/components/RevealObserver";
import { JsonLd, PreviewBanner } from "@/components/ui";
import { industries, navigation, services, shared, site, siteUrl } from "@/lib/content";

// Fonts are downloaded at build time and served from our own origin.
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${site.name} | ${site.tagline}`,
  description: site.description,
  applicationName: site.name,
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#111111",
  width: "device-width",
  initialScale: 1,
};

// Menu items come from content/navigation.json; "auto" fills a menu with every service or industry.
const nav = navigation.header.items.map((item) => ({
  href: item.href,
  label: item.label,
  allLabel: item.allLabel ?? undefined,
  children:
    item.auto === "services"
      ? services.map((s) => ({ href: `/services/${s.slug}`, label: s.title }))
      : item.auto === "industries"
        ? industries.map((s) => ({ href: `/industries/${s.slug}`, label: s.title }))
        : item.children.length
          ? item.children
          : undefined,
}));
const h = navigation.header;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        {/* Marks that JS is running, so scroll-reveal may hide content until it is in view. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: site.name,
            url: siteUrl,
            description: site.description,
            slogan: site.tagline,
            founder: { "@type": "Person", name: site.founder },
            ...(site.contact.email ? { email: site.contact.email } : {}),
            ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
            ...(site.social.length ? { sameAs: site.social.map((s) => s.url) } : {}),
          }}
        />
        <PreviewBanner />
        <Header
          nav={nav}
          logo={<Logo />}
          text={{ cta: h.cta, mobileButtons: h.mobileButtons, openMenu: h.openMenu, closeMenu: h.closeMenu, skip: shared.labels.skipToContent, homeLabel: `${site.name} — ${shared.labels.home.toLowerCase()}` }}
        />
        <main id="main">{children}</main>
        <Footer />
        <RevealObserver />
      </body>
    </html>
  );
}
