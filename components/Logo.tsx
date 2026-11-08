import { site } from "@/lib/content";

/**
 * INTERIM WORDMARK — not the official logo.
 * The official logo files have not been supplied yet (brief §19, stage 1). Until they are,
 * this typographic stand-in is used. To switch to the official artwork, place the files in
 * `public/brand/` and set `brand.logoOnLight` / `brand.logoOnDark` in `content/site.json`
 * (e.g. "/brand/logo-black.svg", "/brand/logo-white.svg"). This component then renders them
 * unchanged, at their own proportions.
 */
export function Logo({
  tone = "dark",
  tagline = false,
  className = "",
}: {
  tone?: "dark" | "light";
  tagline?: boolean;
  className?: string;
}) {
  const file = tone === "light" ? site.brand.logoOnDark : site.brand.logoOnLight;
  if (file) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={file} alt={site.name} className={`h-9 w-auto md:h-10 ${className}`} />;
  }
  return (
    <span
      className={`inline-flex flex-col items-center leading-none ${tone === "light" ? "text-white" : "text-ink"} ${className}`}
      aria-label={site.name}
      role="img"
    >
      <svg viewBox="0 0 120 8" className="mb-[5px] h-[6px] w-[64%]" aria-hidden="true">
        <path d="M2 7 Q60 -4 118 7" fill="none" stroke="currentColor" strokeWidth="1.1" />
      </svg>
      <span className="font-heading text-[15px] font-medium tracking-[0.42em] md:text-[17px]" style={{ marginRight: "-0.42em" }}>
        ENHANC MEDIA
      </span>
      {tagline && (
        <span className="mt-2 text-[7.5px] font-medium tracking-[0.38em] opacity-75" style={{ marginRight: "-0.38em" }}>
          STRATEGY | CREATIVE | GROWTH
        </span>
      )}
    </span>
  );
}
