import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // The Docker image builds a self-contained server (`next start` and this
  // option are mutually exclusive, so it stays off elsewhere).
  output: process.env.NEXT_OUTPUT === "standalone" ? "standalone" : undefined,
  poweredByHeader: false,
  async redirects() {
    return [
      // SEO-safe redirects for the CEOOO case study under its earlier
      // spellings, so an older link never lands on a 404. The canonical
      // slug is "ceooo" (three o's).
      { source: "/projects/ceo-helper", destination: "/projects/ceooo", permanent: true },
      { source: "/projects/ceoooo", destination: "/projects/ceooo", permanent: true },
    ];
  },
};

export default nextConfig;

