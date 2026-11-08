import type { NextConfig } from "next";

// Static export: every page is prebuilt to `out/`. Nothing renders on a server, so the
// site can be served from any static host. The one dynamic need — the inquiry form — is
// handled by the Worker in `worker/`.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  reactStrictMode: true,
  poweredByHeader: false,
};

export default nextConfig;
