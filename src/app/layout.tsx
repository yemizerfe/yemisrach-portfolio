import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Atmosphere } from "@/components/shared/atmosphere";
import { BackendGraphBackdrop } from "@/components/shared/backend-graph-backdrop";
import { CanvasBackdrop } from "@/components/shared/canvas-backdrop";
import { CinematicHost } from "@/components/shared/cinematic-host";
import { EngravingBackdrop } from "@/components/shared/engraving-backdrop";
import { MeshBackdrop } from "@/components/shared/mesh-backdrop";
import { defaultMetadata, siteUrl } from "@/lib/seo";
import { siteConfig } from "@/data/site";

import "./globals.css";

export const metadata: Metadata = defaultMetadata;

/** Structured data: who the site is about, stated factually. */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteUrl,
  jobTitle: siteConfig.role,
  description:
    "Software engineer focused on backend development, APIs, databases and system design.",
  sameAs: [siteConfig.github],
  knowsAbout: [
    "Backend development",
    "REST APIs",
    "Databases",
    "System design",
    "Web application development",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh bg-background text-foreground">
        {/* Site-wide atmosphere, bottom to top: the engraved technical plates
            (blueprint rack, circuit layout, topology mandala) as the artistic
            base, the animated colour mesh with its drifting clouds, light
            beams, panning grid and dust over that, the painted canvas ribbons
            of light on top of the mesh, then the backend-system graph drawn
            last so the diagram stays crisp over the paint. The engraving,
            mesh and graph layers are decorative server components; only the
            canvas layer is a client component, and it stays out of the way
            for reduced-motion and hidden tabs. */}
        <div className="pointer-events-none fixed inset-0 -z-10">
          <EngravingBackdrop />
          <MeshBackdrop />
          <CanvasBackdrop />
          <BackendGraphBackdrop variant="page" />
        </div>
        {/* The cinematic 3D room: a lazy-loaded React Three Fiber scene
            (obsidian core subject, three-point rig in the brand's lights,
            foreground shards, depth fog) fixed behind everything. Its camera
            drifts on its own clock and leans with the pointer — page scrolling
            never moves it; reduced motion gets one composed frame, and no
            WebGL means it never mounts. */}
        <CinematicHost />
        {/* Atmosphere: the vignette and grain that give the navy its depth. */}
        <Atmosphere />

        <a
          href="#main"
          className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-4 focus-visible:z-[60] focus-visible:rounded-lg focus-visible:bg-primary focus-visible:px-4 focus-visible:py-2 focus-visible:text-sm focus-visible:font-medium focus-visible:text-primary-foreground"
        >
          Skip to content
        </a>

        <Navbar />

        <main id="main">{children}</main>

        <Footer />

        <script
          type="application/ld+json"
          // Serialised server-side; content is a static object, no user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </body>
    </html>
  );
}
