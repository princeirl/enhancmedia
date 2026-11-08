import { ImageResponse } from "next/og";

export const dynamic = "force-static";

/** Default social sharing image, rendered once at build time. */
export function GET() {
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
          STRATEGY | CREATIVE | GROWTH
        </div>
        <div style={{ display: "flex", flexDirection: "column", fontSize: 76, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2 }}>
          <span>We build brands.</span>
          <span>We shape perceptions.</span>
          <span style={{ color: "#B99A70" }}>We create influence.</span>
        </div>
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 14 }}>ENHANC MEDIA</div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
