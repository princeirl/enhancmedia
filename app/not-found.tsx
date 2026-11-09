import { ButtonLink } from "@/components/ui";
import { page } from "@/lib/content";

export default function NotFound() {
  const c = page("not-found");
  return (
    <section className="bg-paper">
      <div className="container-x flex min-h-[65vh] flex-col justify-center py-24">
        <p className="eyebrow text-gold-ink">{c.eyebrow}</p>
        <h1 className="display mt-6 max-w-3xl text-5xl text-ink md:text-7xl">{c.heading}</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">{c.text}</p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href={c.primary.href}>{c.primary.label}</ButtonLink>
          <ButtonLink href={c.secondary.href} variant="outline">{c.secondary.label}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
