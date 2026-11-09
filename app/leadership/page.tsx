import { CtaBand, DraftMark, PageHero, Portrait } from "@/components/ui";
import { page, shared, team } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

const c = page("leadership");

export const metadata = pageMeta({ ...c.seo, path: "/leadership" });

export default function Leadership() {
  const people = team();
  return (
    <>
      <PageHero
        eyebrow={c.hero.eyebrow}
        title={c.hero.title}
        lead={c.hero.lead}
        art={c.hero.art}
      />
      <section className="bg-white py-24 md:py-32">
        <div className="container-x">
          <ul className="grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((p, i) => (
              <li key={p.slug} className="reveal group" style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}>
                <Portrait person={p} />
                <div className="mt-7 border-t border-line pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="font-heading text-2xl font-semibold text-ink">{p.name}</h2>
                    <DraftMark item={p} />
                  </div>
                  <p className="mt-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-gold-ink">{p.role}</p>
                  {(p.summary || p.bio) && (
                    <p className="mt-4 leading-relaxed text-muted">{p.summary ?? p.bio}</p>
                  )}
                  {p.linkedin && (
                    <a
                      href={p.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-block text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink link-draw"
                    >
                      {c.profileLink} <span className="sr-only">— {p.name} {shared.labels.opensInNewTab}</span>
                    </a>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
