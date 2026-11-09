import Link from "next/link";
import { CtaBand, PageHero, SectionHeading } from "@/components/ui";
import { page, services, shared } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

const c = page("services");

export const metadata = pageMeta({ ...c.seo, path: "/services" });

export default function Services() {
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
          <ol className="border-t border-ink">
            {services.map((s, i) => (
              <li key={s.slug} className="reveal border-b border-line">
                <Link href={`/services/${s.slug}`} className="group grid gap-6 py-12 md:grid-cols-12 md:gap-8 md:py-14">
                  <span className="text-[0.75rem] font-semibold tracking-[0.2em] text-gold-ink md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="md:col-span-5">
                    <h2 className="font-heading text-3xl font-semibold tracking-tight text-ink transition-transform duration-500 group-hover:translate-x-2 md:text-4xl">
                      {s.title}
                    </h2>
                    <p className="mt-4 max-w-md leading-relaxed text-muted">{s.short}</p>
                  </div>
                  <ul className="grid content-start gap-x-6 gap-y-2 text-[0.92rem] text-charcoal sm:grid-cols-2 md:col-span-5">
                    {s.offerings.map((o) => (
                      <li key={o.title} className="flex gap-3">
                        <span className="mt-[0.6em] h-px w-3 shrink-0 bg-gold" aria-hidden />
                        {o.title}
                      </li>
                    ))}
                  </ul>
                  <span className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink md:col-span-1 md:text-right">
                    <span className="link-draw">{c.itemLink}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line bg-paper py-24 md:py-32">
        <div className="container-x">
          <SectionHeading eyebrow={c.method.eyebrow} title={c.method.heading} className="max-w-3xl" />
          <ol className="mt-14 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-5">
            {shared.approach.map((st, i) => (
              <li key={st.title} className="reveal bg-paper p-7">
                <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-gold-ink">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 font-heading text-xl font-semibold uppercase tracking-[0.04em] text-ink">{st.title}</h3>
                <p className="mt-3 text-[0.92rem] leading-relaxed text-muted">{st.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
