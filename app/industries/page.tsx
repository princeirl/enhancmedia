import Link from "next/link";
import { CtaBand, PageHero } from "@/components/ui";
import { industries, page } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

const c = page("industries");

export const metadata = pageMeta({ ...c.seo, path: "/industries" });

export default function Industries() {
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
          <ul className="grid gap-px bg-line md:grid-cols-2">
            {industries.map((ind, i) => (
              <li key={ind.slug} className="reveal bg-white">
                <Link href={`/industries/${ind.slug}`} className="group flex h-full flex-col p-8 transition-colors duration-500 hover:bg-paper md:p-12">
                  <span className="text-[0.72rem] font-semibold tracking-[0.2em] text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                  <h2 className="mt-8 font-heading text-3xl font-semibold tracking-tight text-ink">{ind.title}</h2>
                  <p className="mt-4 max-w-md flex-1 leading-relaxed text-muted">{ind.short}</p>
                  <span className="mt-10 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink">
                    {c.itemLink}
                    <span className="h-px w-5 bg-gold transition-all duration-500 group-hover:w-10" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
            <li className="reveal bg-ink">
              <Link href={c.other.link.href} className="group flex h-full flex-col p-8 text-white md:p-12">
                <span className="eyebrow text-gold">{c.other.eyebrow}</span>
                <h2 className="mt-8 font-heading text-3xl font-semibold tracking-tight">{c.other.heading}</h2>
                <p className="mt-4 max-w-md flex-1 leading-relaxed text-mist">{c.other.text}</p>
                <span className="mt-10 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em]">
                  {c.other.link.label}
                  <span className="h-px w-5 bg-gold transition-all duration-500 group-hover:w-10" aria-hidden />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
