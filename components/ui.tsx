import Link from "next/link";
import type { ReactNode } from "react";
import { formatDate, isDraft, isPreview, type Article, type Person, type Project } from "@/lib/content";

// ---------- Buttons ----------
export function ButtonLink({
  href,
  children,
  variant = "solid",
  tone = "dark",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "text";
  tone?: "dark" | "light";
  className?: string;
}) {
  const base =
    "group inline-flex items-center justify-center gap-4 text-[0.72rem] font-semibold uppercase tracking-[0.22em] transition-colors duration-300";
  const styles = {
    solid: tone === "dark" ? "bg-ink px-7 py-4 text-white hover:bg-charcoal" : "bg-white px-7 py-4 text-ink hover:bg-paper",
    outline:
      tone === "dark"
        ? "border border-ink/80 px-7 py-4 text-ink hover:bg-ink hover:text-white"
        : "border border-white/40 px-7 py-4 text-white hover:border-white hover:bg-white hover:text-ink",
    text: tone === "dark" ? "py-2 text-ink" : "py-2 text-white",
  }[variant];
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
      <span className="h-px w-6 bg-gold transition-all duration-500 group-hover:w-10" aria-hidden />
    </Link>
  );
}

// ---------- Headings ----------
export function Eyebrow({ children, tone = "dark", index }: { children: ReactNode; tone?: "dark" | "light"; index?: string }) {
  return (
    <p className={`eyebrow flex items-center gap-3 ${tone === "light" ? "text-gold" : "text-gold-ink"}`}>
      {index && <span>{index}</span>}
      <span className="h-px w-8 bg-gold" aria-hidden />
      <span>{children}</span>
    </p>
  );
}

export function SectionHeading({
  eyebrow,
  index,
  title,
  lead,
  tone = "dark",
  as: H = "h2",
  className = "",
}: {
  eyebrow?: string;
  index?: string;
  title: ReactNode;
  lead?: ReactNode;
  tone?: "dark" | "light";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={`reveal ${className}`}>
      {eyebrow && <Eyebrow tone={tone} index={index}>{eyebrow}</Eyebrow>}
      <H
        className={`display mt-6 text-[2.1rem] sm:text-5xl lg:text-[3.6rem] ${tone === "light" ? "text-white" : "text-ink"}`}
      >
        {title}
      </H>
      {lead && (
        <p className={`mt-6 max-w-2xl text-lg leading-relaxed ${tone === "light" ? "text-mist" : "text-muted"}`}>{lead}</p>
      )}
    </div>
  );
}

// ---------- Placeholder marking ----------
export function PlaceholderTag({ children = "Placeholder" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 border border-dashed border-gold-ink bg-[#fbf6ee] px-2 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-gold-ink">
      <span className="h-1.5 w-1.5 rounded-full bg-gold-ink" aria-hidden />
      {children}
    </span>
  );
}

export function DraftMark({ item }: { item: { status?: string } }) {
  return isPreview && isDraft(item) ? <PlaceholderTag>Draft — not published</PlaceholderTag> : null;
}

export function PreviewBanner() {
  if (!isPreview) return null;
  return (
    <div className="bg-gold px-4 py-2 text-center text-[0.72rem] font-semibold text-ink">
      Preview build: includes placeholder and draft content, marked as such. Not for publication.
    </div>
  );
}

// ---------- Page hero ----------
export function PageHero({
  eyebrow,
  title,
  lead,
  children,
  art = 0,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children?: ReactNode;
  art?: number;
}) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <div className="pointer-events-none absolute -right-40 top-1/2 hidden h-[640px] w-[640px] -translate-y-1/2 text-ink/[0.07] md:block" aria-hidden>
        <Artwork variant={art} className="h-full w-full" />
      </div>
      <div className="container-x relative pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="max-w-4xl">
          <p className="eyebrow rise-in flex items-center gap-3 text-gold-ink">
            <span className="h-px w-8 bg-gold" aria-hidden />
            {eyebrow}
          </p>
          <h1 className="display rise-in mt-7 text-[2.5rem] text-ink sm:text-6xl lg:text-[4.6rem]" style={{ ["--d" as string]: "80ms" }}>
            {title}
          </h1>
          {lead && (
            <p className="rise-in mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl" style={{ ["--d" as string]: "160ms" }}>
              {lead}
            </p>
          )}
          {children && (
            <div className="rise-in mt-10" style={{ ["--d" as string]: "240ms" }}>
              {children}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ---------- Closing call to action ----------
export function CtaBand({
  title = "Your next chapter starts with a conversation.",
  text = "Have an idea, a challenge or an ambition worth pursuing? Let’s discuss how we can bring it to life.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <div className="pointer-events-none absolute -bottom-1/2 left-1/2 h-[900px] w-[900px] -translate-x-1/2 text-white/[0.06]" aria-hidden>
        <Artwork variant={0} className="animate-drift h-full w-full" />
      </div>
      <div className="container-x relative py-24 text-center md:py-36">
        <div className="reveal mx-auto max-w-4xl">
          <p className="eyebrow text-gold">Let&rsquo;s talk</p>
          <h2 className="display mt-6 text-[2.3rem] sm:text-5xl lg:text-[4rem]">{title}</h2>
          <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-mist">{text}</p>
          <div className="mt-11 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <ButtonLink href="/contact" tone="light">
              Let&rsquo;s talk
            </ButtonLink>
            <ButtonLink href="/book-a-consultation" tone="light" variant="outline">
              Book a consultation
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Abstract artwork (brand-coloured, no stock imagery) ----------
export function Artwork({ variant = 0, className = "" }: { variant?: number; className?: string }) {
  const v = ((variant % 6) + 6) % 6;
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1 } as const;
  return (
    <svg viewBox="0 0 400 400" className={className} aria-hidden="true" focusable="false">
      {v === 0 && (
        <g {...stroke}>
          {Array.from({ length: 9 }).map((_, i) => (
            <circle key={i} cx="200" cy="200" r={30 + i * 21} />
          ))}
          <path d="M200 11 A189 189 0 0 1 389 200" stroke="var(--color-gold)" strokeWidth="1.6" />
        </g>
      )}
      {v === 1 && (
        <g {...stroke}>
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`h${i}`} x1="0" x2="400" y1={i * 40} y2={i * 40} />
          ))}
          {Array.from({ length: 11 }).map((_, i) => (
            <line key={`v${i}`} y1="0" y2="400" x1={i * 40} x2={i * 40} />
          ))}
          <circle cx="240" cy="160" r="80" stroke="var(--color-gold)" strokeWidth="1.6" />
        </g>
      )}
      {v === 2 && (
        <g {...stroke}>
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={i} x1={-200 + i * 40} y1="400" x2={i * 40} y2="0" />
          ))}
          <line x1="120" y1="400" x2="320" y2="0" stroke="var(--color-gold)" strokeWidth="1.6" />
        </g>
      )}
      {v === 3 && (
        <g {...stroke}>
          {Array.from({ length: 7 }).map((_, i) => (
            <path key={i} d={`M${20 + i * 10} 380 A${180 - i * 10} ${180 - i * 10} 0 0 1 ${380 - i * 10} 380`} />
          ))}
          <path d="M20 380 A180 180 0 0 1 200 200" stroke="var(--color-gold)" strokeWidth="1.6" />
        </g>
      )}
      {v === 4 && (
        <g {...stroke}>
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={40 + i * 15} y={40 + i * 15} width={320 - i * 30} height={320 - i * 30} />
          ))}
          <line x1="40" y1="360" x2="360" y2="40" stroke="var(--color-gold)" strokeWidth="1.6" />
        </g>
      )}
      {v === 5 && (
        <g {...stroke}>
          {Array.from({ length: 12 }).map((_, i) => (
            <ellipse key={i} cx="200" cy="200" rx="180" ry={14 + i * 15} />
          ))}
          <circle cx="200" cy="200" r="6" fill="var(--color-gold)" stroke="none" />
        </g>
      )}
    </svg>
  );
}

// ---------- People ----------
export function Portrait({ person, className = "" }: { person: Person; className?: string }) {
  const initials = person.status === "published"
    ? person.name.split(" ").map((p) => p[0]).slice(0, 2).join("")
    : "—";
  return (
    <div className={`relative aspect-[4/5] overflow-hidden bg-[#ecebe7] ${className}`}>
      {person.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={person.photo}
          alt={`${person.name}, ${person.role}`}
          className="h-full w-full object-cover grayscale-[15%] transition-transform duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center text-ink/25">
          <Artwork variant={3} className="absolute inset-0 h-full w-full text-ink/[0.06]" />
          <span className="relative font-heading text-6xl font-light tracking-[0.1em]">{initials}</span>
          {isPreview && (
            <span className="relative mt-4">
              <PlaceholderTag>Photograph pending</PlaceholderTag>
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Work ----------
export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <article className="reveal group" style={{ ["--reveal-delay" as string]: `${(index % 3) * 90}ms` }}>
      <Link href={`/work/${project.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-ink">
          {project.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.cover}
              alt=""
              className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <Artwork variant={index + 1} className="h-full w-full p-8 text-white/15 transition-transform duration-[900ms] group-hover:scale-[1.04]" />
          )}
          {isDraft(project) && isPreview && (
            <span className="absolute left-4 top-4">
              <PlaceholderTag />
            </span>
          )}
        </div>
        <div className="mt-5 flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-gold-ink">{project.category}</p>
            <h3 className="mt-2 font-heading text-xl font-semibold text-ink">{project.title}</h3>
            <p className="mt-1 text-sm text-muted">{project.client ?? project.industry}</p>
          </div>
          <span className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ink link-draw">View case study</span>
        </div>
      </Link>
    </article>
  );
}

// ---------- Insights ----------
export function ArticleCard({ article, index = 0 }: { article: Article; index?: number }) {
  return (
    <article className="reveal group" style={{ ["--reveal-delay" as string]: `${(index % 3) * 90}ms` }}>
      <Link href={`/insights/${article.slug}`} className="block">
        <div className="relative aspect-[16/10] overflow-hidden bg-[#ecebe7]">
          {article.cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.cover} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" loading="lazy" />
          ) : (
            <Artwork variant={index + 2} className="h-full w-full p-6 text-ink/15 transition-transform duration-700 group-hover:scale-[1.04]" />
          )}
          {isDraft(article) && isPreview && (
            <span className="absolute left-4 top-4">
              <PlaceholderTag>Draft</PlaceholderTag>
            </span>
          )}
        </div>
        <div className="mt-5 flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em]">
          <span className="text-gold-ink">{article.category}</span>
          <span className="h-px w-4 bg-line" aria-hidden />
          <time dateTime={article.date} className="text-muted">
            {formatDate(article.date)}
          </time>
        </div>
        <h3 className="mt-3 font-heading text-xl font-semibold leading-snug text-ink transition-colors group-hover:text-gold-ink">
          {article.title}
        </h3>
        <p className="mt-3 text-[0.95rem] leading-relaxed text-muted">{article.excerpt}</p>
      </Link>
    </article>
  );
}

// ---------- FAQ ----------
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.q} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 font-heading text-lg font-medium text-ink md:text-xl">
            {f.q}
            <span className="mt-1 text-xl leading-none text-gold transition-transform duration-300 group-open:rotate-45" aria-hidden>
              +
            </span>
          </summary>
          <p className="max-w-3xl pb-7 leading-relaxed text-muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

// ---------- Breadcrumbs ----------
export function Breadcrumbs({ items }: { items: { href: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="border-b border-line bg-paper">
      <ol className="container-x flex flex-wrap items-center gap-2 py-4 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-muted">
        <li>
          <Link href="/" className="hover:text-ink">Home</Link>
        </li>
        {items.map((it, i) => (
          <li key={it.href} className="flex items-center gap-2">
            <span aria-hidden className="text-gold">/</span>
            {i === items.length - 1 ? (
              <span aria-current="page" className="text-ink">{it.label}</span>
            ) : (
              <Link href={it.href} className="hover:text-ink">{it.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ---------- Structured data ----------
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
