import { ArticleCard, ButtonLink, CtaBand, PageHero } from "@/components/ui";
import { insights, page } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

const c = page("insights");

export const metadata = pageMeta({ ...c.seo, path: "/insights" });

export default function Insights() {
  const articles = insights();
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
          {articles.length > 0 ? (
            <div className="grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((a, i) => (
                <ArticleCard key={a.slug} article={a} index={i} />
              ))}
            </div>
          ) : (
            <div className="reveal mx-auto max-w-2xl py-12 text-center">
              <p className="eyebrow text-gold-ink">{c.empty.eyebrow}</p>
              <h2 className="display mt-6 text-3xl text-ink md:text-4xl">{c.empty.heading}</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">{c.empty.text}</p>
              <div className="mt-10"><ButtonLink href={c.empty.link.href} variant="outline">{c.empty.link.label}</ButtonLink></div>
            </div>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
