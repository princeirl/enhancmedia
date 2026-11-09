import Link from "next/link";
import { industries, isPreview, navigation, services, site } from "@/lib/content";
import { Logo } from "./Logo";
import { PlaceholderTag } from "./ui";


export function Footer() {
  const c = site.contact;
  const f = navigation.footer;
  const year = new Date().getFullYear();
  const hasContact = c.email || c.phone || c.whatsapp;
  return (
    <footer className="bg-ink text-white">
      <div className="container-x"><div className="grid gap-14 border-b border-line-dark py-20 md:grid-cols-12 md:gap-10">
        <div className="md:col-span-4">
          <Logo tone="light" tagline />
          <p className="mt-8 max-w-sm text-[0.95rem] leading-relaxed text-mist">{site.description}</p>
        </div>

        <FooterCol title={f.exploreTitle} className="md:col-span-2">
          {f.explore.map((l, i) => (
            <FooterLink key={l.href + i} href={l.href}>{l.label}</FooterLink>
          ))}
        </FooterCol>

        <FooterCol title={f.servicesTitle} className="md:col-span-3">
          {services.map((s) => (
            <FooterLink key={s.slug} href={`/services/${s.slug}`}>{s.title}</FooterLink>
          ))}
        </FooterCol>

        <FooterCol title={f.industriesTitle} className="md:col-span-3">
          {industries.map((s) => (
            <FooterLink key={s.slug} href={`/industries/${s.slug}`}>{s.title}</FooterLink>
          ))}
        </FooterCol>
      </div></div>

      <div className="container-x"><div className="grid gap-10 border-b border-line-dark py-12 md:grid-cols-12">
        <div className="md:col-span-6">
          <p className="eyebrow text-gold">{f.contactTitle}</p>
          {hasContact ? (
            <ul className="mt-5 space-y-2 text-[0.95rem]">
              {c.email && <li><a className="link-draw" href={`mailto:${c.email}`}>{c.email}</a></li>}
              {c.phone && <li><a className="link-draw" href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}>{c.phone}</a></li>}
              {c.whatsapp && (
                <li>
                  <a className="link-draw" href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g, "")}`} rel="noopener noreferrer" target="_blank">
                    {f.whatsappLabel}
                  </a>
                </li>
              )}
              {c.address && <li className="pt-2 text-mist">{c.address}</li>}
            </ul>
          ) : (
            <div className="mt-5 space-y-3">
              <p className="text-[0.95rem] text-mist">
                {f.noContact.text}{" "}
                <Link href={f.noContact.link.href} className="text-white underline decoration-gold underline-offset-4">{f.noContact.link.label}</Link>.
              </p>
              {isPreview && <PlaceholderTag>Email, phone and WhatsApp pending</PlaceholderTag>}
            </div>
          )}
        </div>
        <div className="md:col-span-6 md:text-right">
          <p className="eyebrow text-gold">{f.followTitle}</p>
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
        <p>© {year} {site.legalName ?? site.name}. {f.rights}</p>
        <ul className="flex gap-6">
          {f.legal.map((l) => (
            <li key={l.href}><Link href={l.href} className="hover:text-white">{l.label}</Link></li>
          ))}
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
