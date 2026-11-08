import { ContactForm } from "@/components/ContactForm";
import { PageHero, PlaceholderTag } from "@/components/ui";
import { isPreview, services, site } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Book a Consultation",
  description: "Arrange a consultation with Enhanc Media to discuss your brand, communication or growth objectives.",
  path: "/book-a-consultation",
});

const expect = [
  { title: "A focused conversation", text: "We discuss your objectives, your audience and the challenges you face." },
  { title: "Honest perspective", text: "We share initial thoughts on what could help, and whether we are the right partner." },
  { title: "Clear next steps", text: "If it makes sense to continue, we outline how we would approach the work." },
];

export default function Book() {
  const b = site.booking;
  return (
    <>
      <PageHero
        eyebrow="Book a consultation"
        title="A considered first conversation."
        lead="A consultation is an opportunity to discuss your situation with us in detail, with no obligation to proceed."
        art={5}
      />
      <section className="border-b border-line bg-white py-20">
        <div className="container-x">
          <ol className="grid gap-px bg-line md:grid-cols-3">
            {expect.map((e, i) => (
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
                title="Schedule a consultation with Enhanc Media"
                className="h-[760px] w-full"
                loading="lazy"
              />
              <p className="border-t border-line px-6 py-4 text-sm text-muted">
                Trouble viewing the calendar?{" "}
                <a href={b.url} target="_blank" rel="noopener noreferrer" className="underline decoration-gold underline-offset-4">
                  Open the scheduling page
                </a>
                .
              </p>
            </div>
          ) : (
            <>
              <div className="mb-10">
                <h2 className="display text-3xl text-ink md:text-4xl">Request a consultation</h2>
                <p className="mt-4 max-w-2xl leading-relaxed text-muted">
                  Share a few details and your preferred times. We will confirm a time with you directly.
                </p>
                {isPreview && (
                  <div className="mt-5">
                    <PlaceholderTag>Online scheduling not yet connected; set booking.url in content/site.json</PlaceholderTag>
                  </div>
                )}
              </div>
              <ContactForm
                intent="consultation"
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
