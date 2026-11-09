import Link from "next/link";
import { notFound } from "next/navigation";
import { Artwork, Breadcrumbs, CtaBand, DraftMark, PlaceholderTag, ProjectCard } from "@/components/ui";
import { fill, getProject, getService, isDraft, isPreview, page, work } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

type Params = { slug: string };

const c = page("work-detail");

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  const list = work().map((p) => ({ slug: p.slug }));
  // A static export needs at least one path; with no published projects this placeholder
  // path renders the "not found" page and is excluded from the sitemap.
  return list.length ? list : [{ slug: "unavailable" }];
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const p = getProject((await params).slug);
  if (!p) return { title: "Not found", robots: { index: false } };
  return pageMeta({ title: `${p.title}${p.client ? ` — ${p.client}` : ""}`, description: p.summary, path: `/work/${p.slug}` });
}

export default async function CaseStudy({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const related = work().filter((x) => x.slug !== p.slug && (x.category === p.category || x.services.some((s) => p.services.includes(s)))).slice(0, 3);
  const fallbackRelated = related.length ? related : work().filter((x) => x.slug !== p.slug).slice(0, 3);

  const sections = [
    { label: c.sections.background, body: p.background },
    { label: c.sections.challenge, body: p.challenge },
    { label: c.sections.strategy, body: p.strategy },
    { label: c.sections.execution, body: p.execution },
  ];

  return (
    <>
      <Breadcrumbs items={[{ href: "/work", label: page("work").hero.eyebrow }, { href: `/work/${p.slug}`, label: p.title }]} />

      <section className="bg-paper">
        <div className="container-x pb-14 pt-16 md:pb-20 md:pt-24">
          <div className="flex flex-wrap items-center gap-4">
            <p className="eyebrow flex items-center gap-3 text-gold-ink">
              <span className="h-px w-8 bg-gold" aria-hidden />
              {p.category}
            </p>
            <DraftMark item={p} />
          </div>
          <h1 className="display mt-7 max-w-4xl text-[2.5rem] text-ink sm:text-6xl lg:text-[4.4rem]">{p.title}</h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">{p.summary}</p>
          <dl className="mt-14 grid gap-px border-y border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {[
              [c.facts.client, p.client ?? (isPreview ? "Name pending permission" : c.facts.confidential)],
              [c.facts.industry, p.industry],
              [c.facts.services, p.services.map((s) => getService(s)?.title).filter(Boolean).join(", ")],
              [c.facts.year, p.year ?? "—"],
            ].map(([k, v]) => (
              <div key={k} className="bg-paper py-5 sm:px-5 sm:first:pl-0">
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted">{k}</dt>
                <dd className="mt-2 font-heading text-lg font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="bg-ink">
        <div className="container-x py-0">
          <div className="relative aspect-[16/8] overflow-hidden">
            {p.cover ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.cover} alt={fill(c.coverAlt, { title: p.title })} className="h-full w-full object-cover" />
            ) : (
              <Artwork variant={2} className="h-full w-full p-10 text-white/15" />
            )}
            {!p.cover && isPreview && (
              <span className="absolute left-6 top-6"><PlaceholderTag>Project imagery pending</PlaceholderTag></span>
            )}
          </div>
        </div>
      </div>

      <section className="bg-white py-24 md:py-32">
        <div className="container-x space-y-16">
          {sections.map((s, i) => (
            <div key={s.label} className="reveal grid gap-6 border-t border-line pt-8 md:grid-cols-12">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-gold-ink md:col-span-4">
                {String(i + 1).padStart(2, "0")} — {s.label}
              </p>
              <p className="text-lg leading-relaxed text-charcoal md:col-span-7 md:col-start-6">{s.body}</p>
            </div>
          ))}
          <div className="reveal grid gap-6 border-t border-line pt-8 md:grid-cols-12">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-gold-ink md:col-span-4">05 — {c.sections.deliverables}</p>
            <ul className="grid gap-2 md:col-span-7 md:col-start-6 sm:grid-cols-2">
              {p.deliverables.map((d) => (
                <li key={d} className="flex gap-3 text-lg text-charcoal">
                  <span className="mt-[0.7em] h-px w-3 shrink-0 bg-gold" aria-hidden />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          {/* Results appear only when they have been verified and supplied. */}
          {p.results ? (
            <div className="reveal grid gap-6 border-t border-ink pt-8 md:grid-cols-12">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-gold-ink md:col-span-4">06 — {c.sections.results}</p>
              <p className="font-heading text-2xl font-medium leading-snug text-ink md:col-span-7 md:col-start-6">{p.results}</p>
            </div>
          ) : (
            isDraft(p) && isPreview && (
              <div className="reveal border-t border-line pt-8"><PlaceholderTag>Verified results pending</PlaceholderTag></div>
            )
          )}
        </div>
      </section>

      {p.gallery.length > 0 && (
        <section className="bg-paper py-20 md:py-28">
          <div className="container-x grid gap-6 md:grid-cols-2">
            {p.gallery.map((g) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={g.src} src={g.src} alt={g.alt} loading="lazy" className="reveal w-full" />
            ))}
          </div>
        </section>
      )}

      {fallbackRelated.length > 0 && (
        <section className="border-t border-line bg-paper py-24 md:py-32">
          <div className="container-x">
            <div className="flex items-end justify-between gap-6">
              <h2 className="display text-3xl text-ink md:text-4xl">{c.related.heading}</h2>
              <Link href={c.related.link.href} className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink link-draw">{c.related.link.label}</Link>
            </div>
            <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-3">
              {fallbackRelated.map((r, i) => (
                <ProjectCard key={r.slug} project={r} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </>
  );
}
