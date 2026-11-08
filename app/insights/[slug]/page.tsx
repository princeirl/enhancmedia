import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard, Breadcrumbs, CtaBand, DraftMark, JsonLd } from "@/components/ui";
import { formatDate, getArticle, insights, site, siteUrl } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

type Params = { slug: string };

export const dynamicParams = false;
export function generateStaticParams(): Params[] {
  const list = insights().map((a) => ({ slug: a.slug }));
  return list.length ? list : [{ slug: "unavailable" }];
}

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const a = getArticle((await params).slug);
  if (!a) return { title: "Not found", robots: { index: false } };
  return pageMeta({ title: a.title, description: a.excerpt, path: `/insights/${a.slug}`, type: "article" });
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const more = insights().filter((x) => x.slug !== a.slug).slice(0, 3);
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: a.title,
          description: a.excerpt,
          datePublished: a.date,
          articleSection: a.category,
          publisher: { "@type": "Organization", name: site.name, url: siteUrl },
          mainEntityOfPage: `${siteUrl}/insights/${a.slug}`,
        }}
      />
      <Breadcrumbs items={[{ href: "/insights", label: "Insights" }, { href: `/insights/${a.slug}`, label: a.title }]} />
      <article>
        <header className="bg-paper">
          <div className="container-x pb-16 pt-16 md:pb-20 md:pt-24">
            <div className="mx-auto max-w-3xl">
              <div className="flex flex-wrap items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em]">
                <span className="text-gold-ink">{a.category}</span>
                <span className="h-px w-4 bg-line" aria-hidden />
                <time dateTime={a.date} className="text-muted">{formatDate(a.date)}</time>
                <DraftMark item={a} />
              </div>
              <h1 className="display mt-7 text-[2.3rem] text-ink sm:text-5xl lg:text-[3.6rem]">{a.title}</h1>
              <p className="mt-7 text-xl leading-relaxed text-muted">{a.excerpt}</p>
            </div>
          </div>
        </header>
        <div className="border-t border-line bg-white py-16 md:py-24">
          <div className="container-x">
            <div className="prose-em mx-auto" dangerouslySetInnerHTML={{ __html: a.html }} />
            <div className="mx-auto mt-16 max-w-[68ch] border-t border-line pt-8">
              <Link href="/insights" className="text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-ink link-draw">← All insights</Link>
            </div>
          </div>
        </div>
      </article>
      {more.length > 0 && (
        <section className="border-t border-line bg-paper py-24">
          <div className="container-x">
            <h2 className="display text-3xl text-ink md:text-4xl">Further reading</h2>
            <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-3">
              {more.map((m, i) => (
                <ArticleCard key={m.slug} article={m} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
