import Link from "next/link";
import { ButtonLink, CtaBand, DraftMark, PageHero, PlaceholderTag, Portrait, SectionHeading } from "@/components/ui";
import { isPreview, services, site, team } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "About Us",
  description:
    "Enhanc Media is a strategic marketing, branding and communications agency. Learn who we are, what we believe and how we work.",
  path: "/about",
});

const pillars = [
  {
    label: "Our vision",
    text: "To be the strategic partner that ambitious businesses, individuals and organizations trust to shape how they are seen, understood and remembered.",
  },
  {
    label: "Our mission",
    text: "To combine clear strategy, considered creativity and responsible communication, so our clients build stronger brands, earn credibility and grow with purpose.",
  },
  {
    label: "Our philosophy",
    text: "Understanding comes before action. We listen first, decide what success means, and only then design what will achieve it, measuring honestly along the way.",
  },
];

const difference = [
  { title: "Strategy before output", text: "We agree what needs to be achieved before deciding what to make. Every deliverable traces back to an objective." },
  { title: "One integrated team", text: "Branding, communications, digital marketing and web development are planned together, so your presence is coherent across every touchpoint." },
  { title: "Breadth of audiences", text: "We work with companies, individuals, public figures, institutions and social organizations, and adapt our approach to each." },
  { title: "Responsibility as standard", text: "Accurate claims, lawful methods and respect for privacy are part of how we work, especially in public and political communication." },
];

export default function About() {
  const founder = team().find((p) => p.slug === "prince-yadav");
  return (
    <>
      <PageHero
        eyebrow="About Enhanc Media"
        title="Built on ideas. Driven by strategy. Focused on impact."
        lead="Enhanc Media is a full-service strategic marketing and communications agency helping businesses, individuals and organizations build stronger brands, establish their presence and create meaningful influence."
        art={3}
      />

      <section className="bg-white py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Who we are" title="A strategic partner, not just a service provider." />
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-muted lg:col-span-6 lg:col-start-7">
            <p className="reveal">
              We bring together strategy, branding, communications, digital marketing and web development under one
              considered direction. That lets us look at a client&rsquo;s presence as a whole, from the first impression
              to the final enquiry, rather than as a set of disconnected tasks.
            </p>
            <p className="reveal">
              Our clients range from startups and established companies to creators, public figures, political leaders,
              educational institutions and social organizations, in India and internationally. Their needs differ widely.
              What they share is the need to be understood clearly and represented well.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper py-24 md:py-32">
        <div className="container-x grid gap-px bg-line md:grid-cols-3">
          {pillars.map((p, i) => (
            <div key={p.label} className="reveal bg-paper p-8 md:p-10" style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}>
              <p className="eyebrow text-gold-ink">{p.label}</p>
              <p className="mt-6 font-heading text-xl font-medium leading-snug text-ink md:text-2xl">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-24 text-white md:py-32">
        <div className="container-x">
          <SectionHeading tone="light" eyebrow="What makes us different" title="How our approach differs." className="max-w-3xl" />
          <ul className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {difference.map((d, i) => (
              <li key={d.title} className="reveal border-t border-line-dark pt-6">
                <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-gold">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-heading text-2xl font-semibold">{d.title}</h3>
                <p className="mt-3 max-w-lg leading-relaxed text-mist">{d.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-white py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow="Areas of expertise" title="Seven disciplines, one direction." className="max-w-2xl" />
            <div className="reveal"><ButtonLink href="/services" variant="text">All services</ButtonLink></div>
          </div>
          <ul className="mt-14 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <li key={s.slug} className="reveal border-b border-line sm:odd:border-r lg:border-r lg:[&:nth-child(4n)]:border-r-0">
                <Link href={`/services/${s.slug}`} className="group block p-6 transition-colors hover:bg-paper">
                  <span className="font-heading text-lg font-semibold text-ink">{s.title}</span>
                  <span className="mt-2 block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold-ink opacity-70 transition-opacity group-hover:opacity-100">
                    Learn more →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {founder && (
        <section className="border-t border-line bg-paper py-24 md:py-32">
          <div className="container-x grid items-center gap-14 md:grid-cols-12">
            <div className="reveal group md:col-span-5">
              <Portrait person={founder} />
            </div>
            <div className="md:col-span-6 md:col-start-7">
              <p className="eyebrow reveal text-gold-ink">Founder</p>
              <h2 className="display reveal mt-6 text-4xl text-ink md:text-5xl">{founder.name}</h2>
              <p className="reveal mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-gold-ink">{founder.role}</p>
              {founder.bio ? (
                <p className="reveal mt-8 text-lg leading-relaxed text-muted">{founder.bio}</p>
              ) : (
                <p className="reveal mt-8 text-lg leading-relaxed text-muted">
                  {site.name} was founded by {founder.name}, who leads the agency as
                  its Founder &amp; CEO.
                </p>
              )}
              {isPreview && !founder.bio && (
                <div className="mt-6"><PlaceholderTag>Founder biography pending</PlaceholderTag></div>
              )}
              <DraftMark item={founder} />
              <div className="reveal mt-10"><ButtonLink href="/leadership" variant="text">Leadership</ButtonLink></div>
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
