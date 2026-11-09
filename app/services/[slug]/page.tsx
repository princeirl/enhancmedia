import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, CtaBand, FaqList, JsonLd, PageHero, ButtonLink, ProjectCard, SectionHeading } from "@/components/ui";
import { fill, getService, industries, page, services, siteUrl, site, workForService } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

type Params = { slug: string };

const c = page("service-detail");

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const s = getService((await params).slug);
  if (!s) return {};
  return pageMeta({ title: s.title, description: s.short, path: `/services/${s.slug}` });
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const index = services.findIndex((x) => x.slug === s.slug);
  const next = services[(index + 1) % services.length];
  const related = industries.filter((i) => i.services.includes(s.slug));
  const projects = workForService(s.slug);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Service",
              name: s.title,
              description: s.intro,
              provider: { "@type": "Organization", name: site.name, url: siteUrl },
              areaServed: c.areaServed,
              url: `${siteUrl}/services/${s.slug}`,
            },
            {
              "@type": "FAQPage",
              mainEntity: s.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
            },
          ],
        }}
      />
      <Breadcrumbs items={[{ href: "/services", label: page("services").hero.eyebrow }, { href: `/services/${s.slug}`, label: s.title }]} />
      <PageHero eyebrow={fill(c.eyebrow, { number: String(index + 1).padStart(2, "0"), title: s.title })} title={s.headline} lead={s.intro} art={index}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <ButtonLink href={c.primary.href}>{c.primary.label}</ButtonLink>
          <ButtonLink href={c.secondary.href} variant="outline">{c.secondary.label}</ButtonLink>
        </div>
      </PageHero>

      {/* Problems we address */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={c.problems.eyebrow} title={c.problems.heading} />
          </div>
          <ul className="lg:col-span-6 lg:col-start-7">
            {s.problems.map((p, i) => (
              <li key={p} className="reveal flex gap-6 border-b border-line py-6 first:border-t">
                <span className="text-[0.72rem] font-semibold tracking-[0.2em] text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-lg leading-relaxed text-charcoal">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* What we offer */}
      <section className="bg-ink py-24 text-white md:py-32">
        <div className="container-x">
          <SectionHeading tone="light" eyebrow={c.offerings.eyebrow} title={fill(c.offerings.heading, { title: s.title })} className="max-w-3xl" />
          <ul className="mt-16 grid border-l border-t border-line-dark sm:grid-cols-2 lg:grid-cols-3">
            {s.offerings.map((o) => (
              <li key={o.title} className="reveal border-b border-r border-line-dark p-7 md:p-9">
                <span className="block h-px w-8 bg-gold" aria-hidden />
                <h3 className="mt-6 font-heading text-xl font-semibold">{o.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-mist">{o.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Commitments (political communications) */}
      {s.commitments && (
        <section className="border-b border-line bg-paper py-20 md:py-24">
          <div className="container-x grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHeading eyebrow={c.commitments.eyebrow} title={c.commitments.heading} />
            </div>
            <ul className="grid gap-4 lg:col-span-7 lg:col-start-6">
              {s.commitments.map((c) => (
                <li key={c} className="reveal flex gap-4 border-l-2 border-gold bg-white px-6 py-5 leading-relaxed text-charcoal">
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Our process */}
      <section className="bg-white py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={c.process.eyebrow} title={c.process.heading} className="max-w-3xl" />
          <ol className="mt-16 grid gap-10 md:grid-cols-4 md:gap-8">
            {s.process.map((p, i) => (
              <li key={p.title} className="reveal border-t-2 border-ink pt-6" style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}>
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-ink">{c.process.stepLabel} {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-heading text-2xl font-semibold text-ink">{p.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Relevant work */}
      {projects.length > 0 && (
        <section className="border-t border-line bg-paper py-24 md:py-32">
          <div className="container-x">
            <SectionHeading eyebrow={c.work.eyebrow} title={c.work.heading} />
            <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
              {projects.slice(0, 2).map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQs */}
      <section className="border-t border-line bg-white py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow={c.faqs.eyebrow} title={c.faqs.heading} />
          </div>
          <div className="reveal lg:col-span-8">
            <FaqList items={s.faqs} />
          </div>
        </div>
      </section>

      {/* Related industries & next service */}
      <section className="border-t border-line bg-paper">
        <div className="container-x grid md:grid-cols-2">
          <div className="border-b border-line py-14 md:border-b-0 md:border-r md:pr-12">
            <p className="eyebrow text-gold-ink">{c.relatedLabel}</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={`/industries/${r.slug}`} className="inline-block border border-line bg-white px-4 py-2 text-sm transition-colors hover:border-ink">
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <Link href={`/services/${next.slug}`} className="group py-14 md:pl-12">
            <p className="eyebrow text-gold-ink">{c.nextLabel}</p>
            <p className="mt-5 flex items-center justify-between gap-6 font-heading text-3xl font-semibold text-ink">
              {next.title}
              <span className="text-gold transition-transform duration-500 group-hover:translate-x-2" aria-hidden>→</span>
            </p>
          </Link>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
