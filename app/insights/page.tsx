import { ArticleCard, ButtonLink, CtaBand, PageHero } from "@/components/ui";
import { insights } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Insights",
  description: "Perspectives on marketing, branding, communications, personal branding and digital growth from Enhanc Media.",
  path: "/insights",
});

export default function Insights() {
  const articles = insights();
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Thinking beyond the ordinary."
        lead="Perspectives on marketing, branding, communication, technology and growth: what we are learning, and what we believe."
        art={1}
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
              <p className="eyebrow text-gold-ink">Coming soon</p>
              <h2 className="display mt-6 text-3xl text-ink md:text-4xl">Our first articles are on their way.</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                We will publish perspectives on branding, marketing, communications and growth here.
              </p>
              <div className="mt-10"><ButtonLink href="/services" variant="outline">Explore our services</ButtonLink></div>
            </div>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
