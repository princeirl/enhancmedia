import { Breadcrumbs, PlaceholderTag } from "@/components/ui";
import { isPreview } from "@/lib/content";

export function LegalPage({
  title,
  path,
  updated,
  sections,
}: {
  title: string;
  path: string;
  updated: string;
  sections: { heading: string; body: React.ReactNode }[];
}) {
  return (
    <>
      <Breadcrumbs items={[{ href: path, label: title }]} />
      <section className="bg-paper">
        <div className="container-x pb-14 pt-16 md:pt-24">
          <p className="eyebrow flex items-center gap-3 text-gold-ink">
            <span className="h-px w-8 bg-gold" aria-hidden />
            Legal
          </p>
          <h1 className="display mt-7 text-[2.5rem] text-ink sm:text-6xl">{title}</h1>
          <p className="mt-6 text-sm text-muted">Last updated: {updated}</p>
          {isPreview && (
            <div className="mt-5">
              <PlaceholderTag>Draft: to be reviewed by legal counsel before publication</PlaceholderTag>
            </div>
          )}
        </div>
      </section>
      <section className="border-t border-line bg-white py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <nav aria-label="On this page" className="hidden lg:col-span-3 lg:block">
            <ol className="sticky top-32 space-y-2 text-sm text-muted">
              {sections.map((s, i) => (
                <li key={s.heading}>
                  <a href={`#s${i + 1}`} className="hover:text-ink">{i + 1}. {s.heading}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="prose-em lg:col-span-8 lg:col-start-5">
            {sections.map((s, i) => (
              <section key={s.heading} id={`s${i + 1}`} className="scroll-mt-32">
                <h2>{i + 1}. {s.heading}</h2>
                {s.body}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
