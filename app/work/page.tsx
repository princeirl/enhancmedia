import { ButtonLink, CtaBand, PageHero, ProjectCard } from "@/components/ui";
import { WorkFilter } from "@/components/WorkFilter";
import { work, workCategories } from "@/lib/content";
import { pageMeta } from "@/lib/seo";

export const metadata = pageMeta({
  title: "Our Work",
  description: "Selected branding, digital marketing, web development, personal branding, PR and political communication projects by Enhanc Media.",
  path: "/work",
});

export default function Work() {
  const projects = work();
  return (
    <>
      <PageHero
        eyebrow="Our work"
        title="Ideas into execution."
        lead="A selection of our work, presented with the permission of the clients involved: the challenge, the strategy, what we executed and what it achieved."
        art={2}
      />
      <section className="bg-white py-20 md:py-28">
        <div className="container-x">
          {projects.length > 0 ? (
            <WorkFilter
              categories={workCategories}
              items={projects.map((p, i) => ({
                key: p.slug,
                category: p.category,
                node: <ProjectCard project={p} index={i} />,
              }))}
            />
          ) : (
            <div className="reveal mx-auto max-w-2xl py-12 text-center">
              <p className="eyebrow text-gold-ink">Case studies</p>
              <h2 className="display mt-6 text-3xl text-ink md:text-4xl">Case studies are being prepared for publication.</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                Each project is published only once the client has approved how it is presented. In the meantime, we
                are glad to discuss relevant experience in a private conversation.
              </p>
              <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
                <ButtonLink href="/contact">Start a conversation</ButtonLink>
                <ButtonLink href="/services" variant="outline">Explore our services</ButtonLink>
              </div>
            </div>
          )}
        </div>
      </section>
      <CtaBand />
    </>
  );
}
