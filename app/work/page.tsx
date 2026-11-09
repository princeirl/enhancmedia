import { ButtonLink, CtaBand, PageHero, ProjectCard } from "@/components/ui";
import { WorkFilter } from "@/components/WorkFilter";
import { page, work } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

const c = page("work");

export const metadata = pageMeta({ ...c.seo, path: "/work" });

export default function Work() {
  const projects = work();
  return (
    <>
      <PageHero
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        lead={c.hero.lead}
        art={c.hero.art}
      />
      <section className="bg-white py-20 md:py-28">
        <div className="container-x">
          {projects.length > 0 ? (
            <WorkFilter
              categories={c.categories}
              allLabel={c.filterAll}
              groupLabel={c.filterLabel}
              items={projects.map((p, i) => ({
                key: p.slug,
                category: p.category,
                node: <ProjectCard project={p} index={i} />,
              }))}
            />
          ) : (
            <div className="reveal mx-auto max-w-2xl py-12 text-center">
              <p className="eyebrow text-gold-ink">{c.empty.eyebrow}</p>
              <h2 className="display mt-6 text-3xl text-ink md:text-4xl">{c.empty.heading}</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">{c.empty.text}</p>
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <ButtonLink href={c.empty.primary.href}>{c.empty.primary.label}</ButtonLink>
                <ButtonLink href={c.empty.secondary.href} variant="outline">{c.empty.secondary.label}</ButtonLink>
              </div>
            </div>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
