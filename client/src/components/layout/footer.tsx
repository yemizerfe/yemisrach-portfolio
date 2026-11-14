import Link from "next/link";

import { GitHubIcon } from "@/components/shared/github-icon";
import { Separator } from "@/components/ui/separator";
import { navLinks, siteConfig } from "@/data/site";

/** Minimal footer: identity, the three useful links, and the current year. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="section-seam relative overflow-hidden">
      {/* Closing atmosphere: two faint clouds in the page's own lights and a
          hairline along the very bottom edge, so the page ends on light rather
          than simply stopping. Decorative, and behind the content. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <span
          className="orb left-1/2 top-[-45%] size-[34rem] -translate-x-1/2"
          style={
            {
              "--orb-color": "var(--color-accent-violet)",
              "--orb-opacity": "0.24",
              "--orb-duration": "40s",
            } as React.CSSProperties
          }
        />
        <span
          className="orb right-[-10%] bottom-[-55%] size-[26rem]"
          style={
            {
              "--orb-color": "var(--color-accent-cyan)",
              "--orb-opacity": "0.18",
              "--orb-duration": "52s",
              "--orb-delay": "-8s",
            } as React.CSSProperties
          }
        />
      </div>
      <span
        aria-hidden="true"
        className="seam-glow pointer-events-none absolute inset-x-0 bottom-0 h-px opacity-70"
      />

      <div className="shell py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-gradient animate-text-sheen text-[15px] font-medium tracking-tight">
              {siteConfig.name}
            </p>
            <p className="text-[13px] text-muted-foreground">{siteConfig.role}</p>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-foreground-subtle">
              {siteConfig.status}
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={siteConfig.resumePath}
                  className="text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Resume
                </Link>
              </li>
              <li>
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  <GitHubIcon className="size-3.5" />
                  GitHub
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <Separator className="my-8" decorative />

        <div className="flex flex-col gap-3 text-[12px] text-foreground-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {siteConfig.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
