import { ContactForm } from "@/components/ContactForm";
import { PageHero, PlaceholderTag } from "@/components/ui";
import { forms, isPreview, page, services, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

const c = page("book-a-consultation");

export const metadata = pageMeta({ ...c.seo, path: "/book-a-consultation" });

export default function Book() {
  const b = site.booking;
  return (
    <>
      <PageHero
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        lead={c.hero.lead}
        art={c.hero.art}
      />
      <section className="border-b border-line bg-white py-20">
        <div className="container-x">
          <ol className="grid gap-px bg-line md:grid-cols-3">
            {c.expect.map((e, i) => (
              <li key={e.title} className="reveal bg-white p-8">
                <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-gold-ink">{String(i + 1).padStart(2, "0")}</p>
                <h2 className="mt-4 font-heading text-xl font-semibold text-ink">{e.title}</h2>
                <p className="mt-2 leading-relaxed text-muted">{e.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-paper py-20 md:py-28">
        <div className="container-x mx-auto max-w-4xl">
          {b.url ? (
            <div className="border border-line bg-white">
              <iframe
                src={b.url}
                title={c.embed.title}
                className="h-[760px] w-full"
                loading="lazy"
              />
              <p className="border-t border-line px-6 py-4 text-sm text-muted">
                {c.embed.trouble}{" "}
                <a href={b.url} target="_blank" rel="noopener noreferrer" className="underline decoration-gold underline-offset-4">
                  {c.embed.link}
                </a>
                .
              </p>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h2 className="display text-3xl text-ink md:text-4xl">{c.request.heading}</h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted">{c.request.text}</p>
                {isPreview && (
                  <div className="mt-5">
                    <PlaceholderTag>Online scheduling not yet connected; set booking.url in content/site.json</PlaceholderTag>
                  </div>
                )}
              </div>
              <ContactForm
                intent="consultation"
                text={forms}
                endpoint={site.forms.endpoint}
                turnstileSiteKey={site.forms.turnstileSiteKey}
                services={services.map((s) => ({ slug: s.slug, title: s.title }))}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
}
