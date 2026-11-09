import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs, ButtonLink, CtaBand, PageHero, ProjectCard, SectionHeading } from "@/components/ui";
import { fill, getIndustry, getService, industries, page, work } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

type Params = { slug: string };

const c = page("industry-detail");

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  return industries.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const ind = getIndustry((await params).slug);
  if (!ind) return {};
  return pageMeta({ title: ind.title, description: ind.short, path: `/industries/${ind.slug}` });
}

export default async function IndustryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const ind = getIndustry(slug);
  if (!ind) notFound();
  const index = industries.findIndex((x) => x.slug === ind.slug);
  const applicable = ind.services.map(getService).filter((s) => !!s);
  const projects = work().filter((p) => p.services.some((s) => ind.services.includes(s))).slice(0, 2);
  const others = industries.filter((i) => i.slug !== ind.slug);

  return (
    <>
      <Breadcrumbs items={[{ href: "/industries", label: page("industries").hero.eyebrow }, { href: `/industries/${ind.slug}`, label: ind.title }]} />
      <PageHero eyebrow={fill(c.eyebrow, { title: ind.title })} title={ind.headline} lead={ind.short} art={index + 2}>
        <ButtonLink href={c.button.href}>{c.button.label}</ButtonLink>
      </PageHero>

      <section className="bg-white py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={c.understanding.eyebrow} title={c.understanding.heading} />
          </div>
          <p className="reveal font-heading text-xl font-medium leading-relaxed text-ink md:text-2xl lg:col-span-6 lg:col-start-7">
            {ind.understanding}
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-paper py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={c.challenges.eyebrow} title={c.challenges.heading} />
          </div>
          <ul className="lg:col-span-6 lg:col-start-7">
            {ind.challenges.map((c, i) => (
              <li key={c} className="reveal flex gap-6 border-b border-line py-6 first:border-t">
                <span className="text-[0.72rem] font-semibold tracking-[0.2em] text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-lg leading-relaxed text-charcoal">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-ink py-24 text-white md:py-32">
        <div className="container-x">
          <SectionHeading tone="light" eyebrow={c.help.eyebrow} title={c.help.heading} className="max-w-3xl" />
          <ul className="mt-14 grid gap-px bg-line-dark md:grid-cols-3">
            {ind.solutions.map((s) => (
              <li key={s.title} className="reveal bg-ink p-8 md:p-10">
                <span className="block h-px w-8 bg-gold" aria-hidden />
                <h3 className="mt-6 font-heading text-2xl font-semibold">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-mist">{s.text}</p>
              </li>
            ))}
          </ul>
          <div className="mt-20">
            <p className="eyebrow text-gold">{c.help.servicesLabel}</p>
            <ul className="mt-6 grid border-t border-line-dark sm:grid-cols-2">
              {applicable.map((s) => (
                <li key={s.slug} className="border-b border-line-dark sm:odd:border-r">
                  <Link href={`/services/${s.slug}`} className="group flex items-center justify-between gap-6 py-6 sm:px-6">
                    <span className="font-heading text-xl font-semibold">{s.title}</span>
                    <span className="text-gold transition-transform duration-500 group-hover:translate-x-2" aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow={c.approach.eyebrow} title={c.approach.heading} />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="reveal text-lg leading-relaxed text-muted">{ind.approach}</p>
            <div className="reveal mt-10">
              <ButtonLink href={c.approach.button.href} variant="outline">{c.approach.button.label}</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {projects.length > 0 && (
        <section className="border-t border-line bg-paper py-24 md:py-32">
          <div className="container-x">
            <SectionHeading eyebrow={c.work.eyebrow} title={c.work.heading} />
            <div className="mt-14 grid gap-x-8 gap-y-14 md:grid-cols-2">
              {projects.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-line bg-paper py-14">
        <div className="container-x">
          <p className="eyebrow text-gold-ink">{c.othersLabel}</p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/industries/${o.slug}`} className="inline-block border border-line bg-white px-4 py-2 text-sm transition-colors hover:border-ink">
                  {o.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
