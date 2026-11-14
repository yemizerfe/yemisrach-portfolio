import type { Metadata } from "next";

import { siteConfig } from "@/data/site";

/**
 * Canonical site origin.
 *
 * Set NEXT_PUBLIC_SITE_URL in the deployment environment so canonical URLs,
 * Open Graph tags, the sitemap and robots.txt all point at the live domain.
 * The fallback keeps local builds consistent.
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://yemisrach-zerfe.vercel.app";

export const siteDescription =
  "Portfolio of Yemisrach Zerfe, a software engineer focused on backend development, APIs, databases, system design, and modern web applications.";

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Yemisrach Zerfe | Backend Software Engineer",
    template: "%s | Yemisrach Zerfe",
  },
  description: siteDescription,
  applicationName: `${siteConfig.name} — Portfolio`,
  authors: [{ name: siteConfig.name, url: siteConfig.github }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  keywords: [
    "Yemisrach Zerfe",
    "backend engineer",
    "software engineer",
    "Node.js",
    "TypeScript",
    "Python",
    "FastAPI",
    "PostgreSQL",
    "REST APIs",
    "system design",
    "software architecture",
  ],
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: `${siteConfig.name} — Portfolio`,
    title: "Yemisrach Zerfe | Backend Software Engineer",
    description: siteDescription,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yemisrach Zerfe | Backend Software Engineer",
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

/** Absolute URL helper for canonical links and structured data. */
export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}
