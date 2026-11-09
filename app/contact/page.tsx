import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { PageHero, PlaceholderTag } from "@/components/ui";
import { forms, isPreview, page, services, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

const t = page("contact");

export const metadata = pageMeta({ ...t.seo, path: "/contact" });

export default function Contact() {
  const c = site.contact;
  const channels = [
    c.email && { label: t.direct.email, value: c.email, href: `mailto:${c.email}` },
    c.phone && { label: t.direct.phone, value: c.phone, href: `tel:${c.phone.replace(/[^+\d]/g, "")}` },
    c.whatsapp && { label: t.direct.whatsapp, value: c.whatsapp, href: `https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`, external: true },
  ].filter(Boolean) as { label: string; value: string; href: string; external?: boolean }[];

  return (
    <>
      <PageHero
        eyebrow={t.hero.eyebrow}
        title={t.hero.title}
        lead={t.hero.lead}
        art={t.hero.art}
      />
      <section className="bg-paper pb-24 md:pb-32">
        <div className="container-x grid gap-14 pt-16 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow text-gold-ink">{t.direct.eyebrow}</p>
              {channels.length > 0 ? (
                <ul className="mt-6 divide-y divide-line border-y border-line">
                  {channels.map((ch) => (
                    <li key={ch.label}>
                      <a
                        href={ch.href}
                        {...(ch.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group flex items-center justify-between gap-4 py-5"
                      >
                        <span>
                          <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">{ch.label}</span>
                          <span className="mt-1 block font-heading text-lg font-medium text-ink">{ch.value}</span>
                        </span>
                        <span className="text-gold transition-transform duration-500 group-hover:translate-x-1" aria-hidden>→</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="mt-6 space-y-4">
                  <p className="leading-relaxed text-muted">{t.direct.fallback}</p>
                  {isPreview && <PlaceholderTag>Email, telephone and WhatsApp pending</PlaceholderTag>}
                </div>
              )}
              {c.address && (
                <div className="mt-10">
                  <p className="eyebrow text-gold-ink">{t.officeLabel}</p>
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-charcoal">{c.address}</p>
                </div>
              )}
              <div className="mt-10 border-l-2 border-gold bg-white p-6">
                <p className="font-heading text-lg font-semibold text-ink">{t.consultation.heading}</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{t.consultation.text}</p>
                <Link href={t.consultation.link.href} className="mt-4 inline-block text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink link-draw">
                  {t.consultation.link.label}
                </Link>
              </div>
            </div>
          </aside>
          <div className="lg:col-span-8">
            <ContactForm
              intent="inquiry"
              text={forms}
              endpoint={site.forms.endpoint}
              turnstileSiteKey={site.forms.turnstileSiteKey}
              services={services.map((s) => ({ slug: s.slug, title: s.title }))}
            />
          </div>
        </div>
      </section>
    </>
  );
}
