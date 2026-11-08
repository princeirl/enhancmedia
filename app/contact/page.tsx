import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { PageHero, PlaceholderTag } from "@/components/ui";
import { isPreview, services, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Contact Us",
  description: "Tell Enhanc Media about your project, challenge or ambition. We respond to every genuine inquiry.",
  path: "/contact",
});

export default function Contact() {
  const c = site.contact;
  const channels = [
    c.email && { label: "Email", value: c.email, href: `mailto:${c.email}` },
    c.phone && { label: "Telephone", value: c.phone, href: `tel:${c.phone.replace(/[^+\d]/g, "")}` },
    c.whatsapp && { label: "WhatsApp", value: c.whatsapp, href: `https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`, external: true },
  ].filter(Boolean) as { label: string; value: string; href: string; external?: boolean }[];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let’s start with a conversation."
        lead="Tell us about your organization, your objectives and what you would like to achieve. We read every inquiry and respond using your preferred contact method."
        art={0}
      />
      <section className="bg-paper pb-24 md:pb-32">
        <div className="container-x grid gap-14 pt-16 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <p className="eyebrow text-gold-ink">Direct contact</p>
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
                  <p className="leading-relaxed text-muted">
                    The form is the quickest way to reach us. Your inquiry goes directly to our team.
                  </p>
                  {isPreview && <PlaceholderTag>Email, telephone and WhatsApp pending</PlaceholderTag>}
                </div>
              )}
              {c.address && (
                <div className="mt-10">
                  <p className="eyebrow text-gold-ink">Office</p>
                  <p className="mt-4 whitespace-pre-line leading-relaxed text-charcoal">{c.address}</p>
                </div>
              )}
              <div className="mt-10 border-l-2 border-gold bg-white p-6">
                <p className="font-heading text-lg font-semibold text-ink">Prefer to talk it through?</p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">Request a consultation and we will arrange a time that suits you.</p>
                <Link href="/book-a-consultation" className="mt-4 inline-block text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink link-draw">
                  Book a consultation
                </Link>
              </div>
            </div>
          </aside>
          <div className="lg:col-span-8">
            <ContactForm
              intent="inquiry"
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
