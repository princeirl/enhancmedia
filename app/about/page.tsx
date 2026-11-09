import Link from "next/link";
import { ButtonLink, CtaBand, DraftMark, PageHero, PlaceholderTag, Portrait, SectionHeading } from "@/components/ui";
import { fill, isPreview, page, services, site, team } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

const c = page("about");

export const metadata = pageMeta({ ...c.seo, path: "/about" });

export default function About() {
  const founder = team().find((p) => p.slug === c.founder.person);
  return (
    <>
      <PageHero
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        lead={c.hero.lead}
        art={c.hero.art}
      />

      <section className="bg-white py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={c.whoWeAre.eyebrow} title={c.whoWeAre.heading} />
          </div>
          <div className="space-y-6 text-lg leading-relaxed text-muted lg:col-span-6 lg:col-start-7">
            {c.whoWeAre.paragraphs.map((para, i) => (
              <p key={i} className="reveal">{para}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper py-24 md:py-32">
        <div className="container-x grid gap-px bg-line md:grid-cols-3">
          {c.pillars.map((p, i) => (
            <div key={p.label} className="reveal bg-paper p-8 md:p-10" style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}>
              <p className="eyebrow text-gold-ink">{p.label}</p>
              <p className="mt-6 font-heading text-xl font-medium leading-snug text-ink md:text-2xl">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink py-24 text-white md:py-32">
        <div className="container-x">
          <SectionHeading tone="light" eyebrow={c.difference.eyebrow} title={c.difference.heading} className="max-w-3xl" />
          <ul className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {c.difference.items.map((d, i) => (
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
            <SectionHeading eyebrow={c.expertise.eyebrow} title={c.expertise.heading} className="max-w-2xl" />
            <div className="reveal"><ButtonLink href={c.expertise.link.href} variant="text">{c.expertise.link.label}</ButtonLink></div>
          </div>
          <ul className="mt-14 grid border-t border-line sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <li key={s.slug} className="reveal border-b border-line sm:odd:border-r lg:border-r lg:[&:nth-child(4n)]:border-r-0">
                <Link href={`/services/${s.slug}`} className="group block p-6 transition-colors hover:bg-paper">
                  <span className="font-heading text-lg font-semibold text-ink">{s.title}</span>
                  <span className="mt-2 block text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold-ink opacity-70 transition-opacity group-hover:opacity-100">
                    {c.expertise.itemLink}
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
              <p className="eyebrow reveal text-gold-ink">{c.founder.eyebrow}</p>
              <h2 className="display reveal mt-6 text-4xl text-ink md:text-5xl">{founder.name}</h2>
              <p className="reveal mt-3 text-[0.78rem] font-semibold uppercase tracking-[0.2em] text-gold-ink">{founder.role}</p>
              {founder.bio ? (
                <p className="reveal mt-8 text-lg leading-relaxed text-muted">{founder.bio}</p>
              ) : (
                <p className="reveal mt-8 text-lg leading-relaxed text-muted">
                  {fill(c.founder.fallbackBio, { site: site.name, name: founder.name, role: founder.role })}
                </p>
              )}
              {isPreview && !founder.bio && (
                <div className="mt-6"><PlaceholderTag>Founder biography pending</PlaceholderTag></div>
              )}
              <DraftMark item={founder} />
              <div className="reveal mt-10"><ButtonLink href={c.founder.link.href} variant="text">{c.founder.link.label}</ButtonLink></div>
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
