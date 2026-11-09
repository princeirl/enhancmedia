import { ImageResponse } from "next/og";
import { page, site } from "@/lib/content";

export const dynamic = "force-static";

/** Default social sharing image, rendered once at build time. */
export function GET() {
  const headline = page("home").hero.headline;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#111111",
          color: "#ffffff",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20, color: "#B99A70", fontSize: 22, letterSpacing: 6 }}>
          <div style={{ width: 48, height: 2, background: "#B99A70" }} />
          {site.tagline.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2 }}>
          {headline.map((line, i) => (
            <span key={i} style={i === headline.length - 1 ? { color: "#B99A70" } : undefined}>{line}</span>
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 14 }}>{site.name.toUpperCase()}</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
