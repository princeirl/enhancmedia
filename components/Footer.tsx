import Link from "next/link";
import { industries, isPreview, services, site } from "@/lib/content";
import { Logo } from "./Logo";
import { PlaceholderTag } from "./ui";

const explore = [
  { href: "/about", label: "About" },
  { href: "/leadership", label: "Leadership" },
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/work", label: "Our Work" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
  { href: "/book-a-consultation", label: "Book a consultation" },
];

export function Footer() {
  const c = site.contact;
  const year = new Date().getFullYear();
  const hasContact = c.email || c.phone || c.whatsapp;
  return (
    <footer className="bg-ink text-white">
      <div className="container-x"><div className="grid gap-14 border-b border-line-dark py-20 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4">
          <Logo tone="light" tagline />
          <p className="mt-8 max-w-sm text-[0.95rem] leading-relaxed text-mist">{site.description}</p>
        </div>

        <FooterCol title="Explore" className="md:col-span-2">
          {explore.map((l) => (
            <FooterLink key={l.href} href={l.href}>{l.label}</FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Services" className="md:col-span-3">
          {services.map((s) => (
            <FooterLink key={s.slug} href={`/services/${s.slug}`}>{s.title}</FooterLink>
          ))}
        </FooterCol>

        <FooterCol title="Industries" className="md:col-span-3">
          {industries.map((s) => (
            <FooterLink key={s.slug} href={`/industries/${s.slug}`}>{s.title}</FooterLink>
          ))}
        </FooterCol>
      </div></div>

      <div className="container-x"><div className="grid gap-10 border-b border-line-dark py-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="eyebrow text-gold">Contact</p>
          {hasContact ? (
            <ul className="mt-5 space-y-2 text-[0.95rem]">
              {c.email && <li><a className="link-draw" href={`mailto:${c.email}`}>{c.email}</a></li>}
              {c.phone && <li><a className="link-draw" href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}>{c.phone}</a></li>}
              {c.whatsapp && (
                <li>
                  <a className="link-draw" href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} rel="noopener noreferrer" target="_blank">
                    WhatsApp
                  </a>
                </li>
              )}
              {c.address && <li className="pt-2 text-mist">{c.address}</li>}
            </ul>
          ) : (
            <div className="mt-5 space-y-3">
              <p className="text-[0.95rem] text-mist">
                Tell us about your project through our{" "}
                <Link href="/contact" className="text-white underline decoration-gold underline-offset-4">inquiry form</Link>.
              </p>
              {isPreview && <PlaceholderTag>Email, phone and WhatsApp pending</PlaceholderTag>}
            </div>
          )}
        </div>
        <div className="md:col-span-6 md:text-right">
          <p className="eyebrow text-gold">Follow</p>
          {site.social.length ? (
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] md:justify-end">
              {site.social.map((s) => (
                <li key={s.url}>
                  <a className="link-draw" href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5">{isPreview ? <PlaceholderTag>Social profiles pending</PlaceholderTag> : <p className="text-mist">—</p>}</div>
          )}
        </div>
      </div></div>

      <div className="container-x flex flex-col gap-4 py-8 text-[0.78rem] text-mist md:flex-row md:items-center md:justify-between">
        <p>© {year} {site.legalName ?? site.name}. All rights reserved.</p>
        <ul className="flex gap-6">
          <li><Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link></li>
          <li><Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link></li>
        </ul>
      </div>
    </footer>
  );
}

function FooterCol({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <nav aria-label={title} className={className}>
      <p className="eyebrow text-gold">{title}</p>
      <ul className="mt-5 space-y-2.5">{children}</ul>
    </nav>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-[0.92rem] text-[#cfcfcc] transition-colors hover:text-white">
        {children}
      </Link>
    </li>
  );
}
