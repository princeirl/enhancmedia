import Link from "next/link";
import { Artwork, ArticleCard, ButtonLink, CtaBand, Portrait, ProjectCard, SectionHeading, DraftMark } from "@/components/ui";
import { industries, insights, services, site, team, work } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  description:
    "Enhanc Media is a strategic marketing, branding and communications agency for businesses, individuals and organizations in India and international markets.",
  path: "/",
});

export default function Home() {
  const h = site.home;
  const projects = work().slice(0, 4);
  const articles = insights().slice(0, 3);
  const people = team();

  return (
    <>
      {/* 01 — Hero */}
      <section className="relative isolate overflow-hidden bg-ink text-white">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_75%_35%,rgba(185,154,112,0.16),transparent_55%),radial-gradient(ellipse_at_10%_100%,rgba(255,255,255,0.05),transparent_50%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute -right-[22rem] top-1/2 -z-10 h-[900px] w-[900px] -translate-y-1/2 text-white/[0.09] md:-right-56 lg:-right-24" aria-hidden>
          <Artwork variant={0} className="animate-drift h-full w-full" />
        </div>
        <div className="container-x flex min-h-[calc(100svh-72px)] flex-col justify-between pb-10 pt-20 md:min-h-[calc(100svh-84px)] md:pt-28">
          <div className="max-w-5xl">
            <p className="eyebrow rise-in flex items-center gap-3 text-gold">
              <span className="h-px w-8 bg-gold" aria-hidden />
              {h.hero.eyebrow}
            </p>
            <h1 className="display mt-8 text-[2.7rem] sm:text-6xl md:text-7xl lg:text-[5.6rem]">
              {h.hero.headline.map((line, i) => (
                <span key={line} className="rise-in block" style={{ ["--d" as string]: `${120 + i * 110}ms` }}>
                  {i === h.hero.headline.length - 1 ? <span className="text-gold">{line}</span> : line}
                </span>
              ))}
            </h1>
            <p className="rise-in mt-9 max-w-2xl text-lg leading-relaxed text-mist md:text-xl" style={{ ["--d" as string]: "480ms" }}>
              {h.hero.text}
            </p>
            <div className="rise-in mt-11 flex flex-col gap-4 sm:flex-row" style={{ ["--d" as string]: "600ms" }}>
              <ButtonLink href="/services" tone="light">Explore our services</ButtonLink>
              <ButtonLink href="/contact" tone="light" variant="outline">Start a project</ButtonLink>
            </div>
          </div>
          <div className="mt-20 grid grid-cols-2 gap-6 border-t border-line-dark pt-8 text-[0.72rem] font-medium uppercase tracking-[0.2em] text-mist sm:grid-cols-4">
            {["Strategy", "Branding", "Communications", "Growth"].map((w, i) => (
              <span key={w} className="rise-in flex items-center gap-3" style={{ ["--d" as string]: `${700 + i * 80}ms` }}>
                <span className="text-gold">0{i + 1}</span>
                {w}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 02 — Introduction */}
      <section className="bg-paper py-24 md:py-36">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Who we are" index="01" title={h.intro.heading} />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <p className="reveal font-heading text-2xl font-medium leading-snug text-ink md:text-[1.75rem]">{h.intro.lead}</p>
            <p className="reveal mt-7 text-lg leading-relaxed text-muted">{h.intro.body}</p>
            <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {h.intro.points.map((p, i) => (
                <li key={p.title} className="reveal border-t border-line pt-5" style={{ ["--reveal-delay" as string]: `${(i % 2) * 90}ms` }}>
                  <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-gold-ink">0{i + 1}</p>
                  <p className="mt-2 font-heading text-lg font-semibold text-ink">{p.title}</p>
                  <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{p.text}</p>
                </li>
              ))}
            </ul>
            <div className="reveal mt-12">
              <ButtonLink href="/about" variant="text">More about us</ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* 03 — What we do */}
      <section className="border-t border-line bg-white py-24 md:py-36">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow="Our expertise" index="02" title="What we do" className="max-w-2xl" />
            <p className="reveal max-w-md text-lg leading-relaxed text-muted">
              Seven integrated disciplines, working under one strategic direction.
            </p>
          </div>
          <ol className="mt-16 border-t border-ink">
            {services.map((s, i) => (
              <li key={s.slug} className="reveal border-b border-line">
                <Link
                  href={`/services/${s.slug}`}
                  className="group relative grid items-baseline gap-3 py-8 transition-colors md:grid-cols-12 md:gap-8 md:py-10"
                >
                  <span className="absolute inset-x-0 bottom-[-1px] h-px origin-left scale-x-0 bg-gold transition-transform duration-700 group-hover:scale-x-100" aria-hidden />
                  <span className="text-[0.75rem] font-semibold tracking-[0.2em] text-gold-ink md:col-span-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-[1.7rem] font-semibold leading-tight tracking-tight text-ink transition-transform duration-500 group-hover:translate-x-2 md:col-span-5 md:text-4xl">
                    {s.title}
                  </h3>
                  <p className="text-[0.98rem] leading-relaxed text-muted md:col-span-4">{s.short}</p>
                  <span className="mt-2 inline-flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ink md:col-span-2 md:mt-0 md:justify-end">
                    Learn more
                    <span className="h-px w-5 bg-gold transition-all duration-500 group-hover:w-9" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 04 — Who we work with */}
      <section className="bg-ink py-24 text-white md:py-36">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-12">
            <SectionHeading tone="light" eyebrow="Who we work with" index="03" title={h.audiences.heading} className="lg:col-span-7" />
            <p className="reveal self-end text-lg leading-relaxed text-mist lg:col-span-4 lg:col-start-9">
              Every audience has its own expectations and constraints. Our work is shaped to each.
            </p>
          </div>
          <ul className="mt-16 grid border-l border-t border-line-dark sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind, i) => (
              <li key={ind.slug} className="reveal border-b border-r border-line-dark" style={{ ["--reveal-delay" as string]: `${(i % 4) * 70}ms` }}>
                <Link href={`/industries/${ind.slug}`} className="group flex h-full flex-col p-7 transition-colors duration-500 hover:bg-white/[0.04] md:p-8">
                  <span className="text-[0.7rem] font-semibold tracking-[0.2em] text-gold">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-8 font-heading text-xl font-semibold leading-snug">{ind.title}</h3>
                  <p className="mt-3 flex-1 text-[0.92rem] leading-relaxed text-mist">{ind.short}</p>
                  <span className="mt-8 inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em]">
                    Explore
                    <span className="h-px w-5 bg-gold transition-all duration-500 group-hover:w-9" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
            <li className="reveal border-b border-r border-line-dark">
              <Link href="/contact" className="group flex h-full flex-col justify-between bg-gold p-7 text-ink md:p-8">
                <span className="eyebrow">Not listed?</span>
                <span className="mt-8 font-heading text-xl font-semibold leading-snug">Tell us about your organization and what you need.</span>
                <span className="mt-8 inline-flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em]">
                  Start a conversation
                  <span className="h-px w-5 bg-ink transition-all duration-500 group-hover:w-9" aria-hidden />
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* 05 — Selected work (shown only when genuine, approved projects exist; placeholders in preview) */}
      {projects.length > 0 && (
        <section className="bg-paper py-24 md:py-36">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionHeading eyebrow="Selected work" index="04" title="Ideas into execution." className="max-w-2xl" />
              <div className="reveal"><ButtonLink href="/work" variant="text">View all work</ButtonLink></div>
            </div>
            <div className="mt-16 grid gap-x-8 gap-y-16 md:grid-cols-2">
              {projects.map((p, i) => (
                <ProjectCard key={p.slug} project={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 06 — Our approach */}
      <section className="border-t border-line bg-white py-24 md:py-36">
        <div className="container-x">
          <SectionHeading
            eyebrow="Our approach"
            index="05"
            title="Thoughtful strategy. Purposeful execution."
            lead="A clear, repeatable method that keeps every engagement focused on its objectives."
            className="max-w-3xl"
          />
          <ol className="relative mt-20 grid gap-12 md:grid-cols-5 md:gap-6">
            <span className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-line md:left-0 md:top-[7px] md:h-px md:w-full" aria-hidden />
            {site.approach.map((st, i) => (
              <li key={st.title} className="reveal relative pl-10 md:pl-0 md:pt-12" style={{ ["--reveal-delay" as string]: `${i * 110}ms` }}>
                <span className="absolute left-0 top-1 block h-[15px] w-[15px] border border-gold bg-white md:top-0" aria-hidden>
                  <span className="absolute inset-[4px] bg-gold" />
                </span>
                <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-gold-ink">STAGE {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-heading text-2xl font-semibold uppercase tracking-[0.04em] text-ink">{st.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{st.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 07 — Leadership */}
      <section className="bg-paper py-24 md:py-36">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading eyebrow="Leadership" index="06" title="The people behind Enhanc Media." className="max-w-2xl" />
            <div className="reveal"><ButtonLink href="/leadership" variant="text">Meet the leadership</ButtonLink></div>
          </div>
          <ul className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {people.map((p, i) => (
              <li key={p.slug} className="reveal group" style={{ ["--reveal-delay" as string]: `${i * 100}ms` }}>
                <Portrait person={p} />
                <div className="mt-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-ink">{p.name}</h3>
                    <p className="mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-gold-ink">{p.role}</p>
                  </div>
                  <DraftMark item={p} />
                </div>
                {p.summary && <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{p.summary}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 08 — Why Enhanc Media */}
      <section className="border-t border-line bg-white py-24 md:py-36">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <SectionHeading eyebrow="Why Enhanc Media" index="07" title="Why work with Enhanc Media?" />
              <p className="reveal mt-6 text-lg leading-relaxed text-muted">The principles that shape how we work with every client.</p>
            </div>
          </div>
          <ul className="grid gap-px bg-line lg:col-span-8 sm:grid-cols-2">
            {site.principles.map((p, i) => (
              <li key={p.title} className={`reveal bg-white p-7 md:p-9 ${i === site.principles.length - 1 ? "sm:col-span-2" : ""}`}>
                <p className="text-[0.7rem] font-semibold tracking-[0.2em] text-gold-ink">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-4 font-heading text-xl font-semibold text-ink">{p.title}</h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 09 — Insights (shown only when articles are published; drafts in preview) */}
      {articles.length > 0 && (
        <section className="bg-paper py-24 md:py-36">
          <div className="container-x">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
              <SectionHeading eyebrow="Insights" index="08" title="Thinking beyond the ordinary." className="max-w-2xl" />
              <div className="reveal"><ButtonLink href="/insights" variant="text">All insights</ButtonLink></div>
            </div>
            <div className="mt-16 grid gap-x-8 gap-y-14 md:grid-cols-3">
              {articles.map((a, i) => (
                <ArticleCard key={a.slug} article={a} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10 — Final call to action */}
      <CtaBand />
    </>
  );
}

