"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type NavChild = { href: string; label: string };
type NavItem = { href: string; label: string; children?: NavChild[]; allLabel?: string };
type HeaderText = {
  cta: NavChild;
  mobileButtons: NavChild[];
  openMenu: string;
  closeMenu: string;
  skip: string;
  homeLabel: string;
};

export function Header({ nav, logo, text }: { nav: NavItem[]; logo: React.ReactNode; text: HeaderText }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [panelTop, setPanelTop] = useState(72);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // Escape closes; lock scroll while the mobile menu is open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/"));
  const isSectionActive = (item: NavItem) =>
    isActive(item.href) || !!item.children?.some((c) => isActive(c.href));

  const enter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const leave = () => {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  };

  return (
    <>
    <header
      ref={headerRef}
      className={`sticky top-0 z-50 border-b transition-[background-color,border-color,box-shadow] duration-500 ${
        scrolled || mobileOpen
          ? "border-line bg-paper/95 shadow-[0_1px_24px_rgba(17,17,17,0.04)] backdrop-blur-md"
          : "border-transparent bg-paper"
      }`}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        {text.skip}
      </a>
      <div className="container-x flex h-[72px] items-center justify-between gap-6 md:h-[84px]">
        <Link href="/" className="shrink-0" aria-label={text.homeLabel}>
          {logo}
        </Link>

        {/* Desktop navigation */}
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {nav.map((item) => (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={item.children ? () => enter(item.label) : undefined}
                onMouseLeave={item.children ? leave : undefined}
              >
                {item.children ? (
                  <>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className={`eyebrow px-2.5 py-3 transition-colors hover:text-ink xl:px-3 ${
                          isSectionActive(item) ? "text-ink" : "text-muted"
                        }`}
                        aria-current={isActive(item.href) ? "page" : undefined}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        className="-ml-1.5 p-1.5 text-muted hover:text-ink"
                        aria-expanded={openMenu === item.label}
                        aria-controls={`menu-${item.label}`}
                        aria-label={`${item.label} menu`}
                        onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                      >
                        <Chevron open={openMenu === item.label} />
                      </button>
                    </div>
                    <div
                      id={`menu-${item.label}`}
                      className={`absolute left-1/2 top-full w-[320px] -translate-x-1/2 pt-3 transition-[opacity,transform] duration-300 ${
                        openMenu === item.label
                          ? "visible translate-y-0 opacity-100"
                          : "invisible -translate-y-1 opacity-0"
                      }`}
                    >
                      <div className="border border-line bg-white p-2 shadow-[0_18px_50px_rgba(17,17,17,0.08)]">
                        <ul>
                          {item.children.map((c) => (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                className={`group flex items-center justify-between px-4 py-2.5 text-[0.92rem] transition-colors hover:bg-paper ${
                                  isActive(c.href) ? "text-ink" : "text-charcoal"
                                }`}
                              >
                                {c.label}
                                <span className="text-gold opacity-0 transition-opacity group-hover:opacity-100" aria-hidden>
                                  →
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {item.allLabel && (
                          <Link
                            href={item.href}
                            className="mt-1 block border-t border-line px-4 pb-2 pt-3 text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-gold-ink hover:text-ink"
                          >
                            {item.allLabel} →
                          </Link>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`eyebrow block px-2.5 py-3 transition-colors hover:text-ink xl:px-3 ${
                      isActive(item.href) ? "text-ink" : "text-muted"
                    }`}
                    aria-current={isActive(item.href) ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={text.cta.href}
            className="group hidden items-center gap-3 bg-ink px-5 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-white transition-colors hover:bg-charcoal sm:inline-flex"
          >
            {text.cta.label}
            <span className="h-px w-5 bg-gold transition-all duration-500 group-hover:w-8" aria-hidden />
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? text.closeMenu : text.openMenu}
            onClick={() => {
              if (headerRef.current) setPanelTop(Math.max(0, headerRef.current.getBoundingClientRect().bottom));
              setMobileOpen((o) => !o);
            }}
          >
            <span className="relative block h-3 w-6" aria-hidden>
              <span
                className={`absolute left-0 h-px w-6 bg-ink transition-all duration-300 ${mobileOpen ? "top-1.5 rotate-45" : "top-0"}`}
              />
              <span
                className={`absolute left-0 h-px w-6 bg-ink transition-all duration-300 ${mobileOpen ? "top-1.5 -rotate-45" : "top-3"}`}
              />
            </span>
          </button>
        </div>
      </div>

    </header>

      {/* Mobile navigation — outside <header>, whose backdrop filter would otherwise contain it */}
      <div
        id="mobile-menu"
        style={{ top: panelTop }}
        className={`fixed inset-x-0 bottom-0 z-40 overflow-y-auto border-t border-line bg-paper transition-[opacity,visibility] duration-300 lg:hidden ${
          mobileOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="container-x py-6">
          <ul className="divide-y divide-line border-y border-line">
            {nav.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <details className="group" open={isSectionActive(item)}>
                    <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-heading text-2xl font-medium">
                      {item.label}
                      <span className="text-gold transition-transform duration-300 group-open:rotate-45" aria-hidden>
                        +
                      </span>
                    </summary>
                    <ul className="pb-4">
                      {item.allLabel && (
                        <li>
                          <Link href={item.href} className="block py-2 text-[0.95rem] font-medium text-ink">
                            {item.allLabel}
                          </Link>
                        </li>
                      )}
                      {item.children.map((c) => (
                        <li key={c.href}>
                          <Link href={c.href} className="block py-2 text-[0.95rem] text-muted">
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </details>
                ) : (
                  <Link href={item.href} className="block py-4 font-heading text-2xl font-medium">
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-8 grid gap-3">
            {text.mobileButtons.map((b, i) => (
              <Link
                key={b.href + i}
                href={b.href}
                className={`px-6 py-4 text-center text-[0.75rem] font-semibold uppercase tracking-[0.22em] ${
                  i === 0 ? "bg-ink text-white" : "border border-ink text-ink"
                }`}
              >
                {b.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      aria-hidden
      className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    >
      <path d="M1.5 3.5 5 7l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
