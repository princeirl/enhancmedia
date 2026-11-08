import { ButtonLink } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="bg-paper">
      <div className="container-x flex min-h-[65vh] flex-col justify-center py-24">
        <p className="eyebrow text-gold-ink">Error 404</p>
        <h1 className="display mt-6 max-w-3xl text-5xl text-ink md:text-7xl">This page could not be found.</h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
          The page may have moved, or the address may be incorrect.
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <ButtonLink href="/">Return home</ButtonLink>
          <ButtonLink href="/contact" variant="outline">Contact us</ButtonLink>
        </div>
      </div>
    </section>
  );
}
