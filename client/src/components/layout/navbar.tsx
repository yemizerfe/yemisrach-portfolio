"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FileText, Menu, X } from "lucide-react";

import { GitHubIcon } from "@/components/shared/github-icon";
import { Button } from "@/components/ui/button";
import { navLinks, siteConfig } from "@/data/site";
import { useActiveSection } from "@/hooks/use-active-section";
import { useHashSync } from "@/hooks/use-hash-sync";
import { cn } from "@/lib/utils";

const sectionIds = ["top", "projects", "engineering", "about", "contact"];

/**
 * Sticky navigation.
 *
 * Desktop shows the section links with an active indicator; mobile collapses
 * to a single menu button and a panel. The panel closes on Escape, on route
 * change and on selection, restores focus to the trigger, and locks page
 * scroll while it is open.
 */
export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const activeId = useActiveSection(sectionIds);
  // The address bar follows the section being read, and deep links land on
  // their section — the same behaviour as any documentation site.
  useHashSync(activeId);
  const prefersReducedMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const isHome = pathname === "/";

  /**
   * Section links move the page themselves. A hash-only navigation makes the
   * router change the URL without scrolling the one-pager, which leaves the
   * address bar naming a section you are not looking at; scrolling here means
   * the spy writes the hash as the page settles, so URL and view always agree.
   * From another route the link navigates normally and the deep link lands.
   */
  const handleSectionClick = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!isHome) {
      return;
    }

    const id = href.split("#")[1];
    const target = id === undefined ? null : document.getElementById(id);
    if (target === null) {
      return;
    }

    event.preventDefault();
    setIsOpen(false);
    target.scrollIntoView({
      block: "start",
      behavior: prefersReducedMotion ? "instant" : "smooth",
    });

    // A smooth scroll needs frames. When the browser skips the animation —
    // reduced motion, or a tab that is not painting — the page would simply
    // stay where it was. If nothing has moved shortly after, jump instead.
    const from = window.scrollY;
    window.setTimeout(() => {
      if (Math.abs(window.scrollY - from) < 4) {
        target.scrollIntoView({ block: "start", behavior: "instant" });
      }
    }, 400);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-md">
      {/* Animated accent hairline: a gradient that walks the palette sideways,
          so the fixed bar belongs to the page grid instead of sitting on top
          of it. */}
      <span
        aria-hidden="true"
        className="gradient-line pointer-events-none absolute inset-x-0 -bottom-px h-px opacity-80"
      />
      <div className="shell">
        <div className="flex h-16 items-center justify-between gap-6">
          <Link
            href="/#top"
            onClick={(event) => handleSectionClick(event, "/#top")}
            className="flex items-center gap-2.5 rounded-md text-[15px] font-medium tracking-tight text-foreground"
          >
            <span
              aria-hidden="true"
              className="size-2 rounded-full bg-gradient-to-br from-accent-violet to-accent-cyan shadow-[0_0_12px] shadow-accent-violet/60"
            />
            {siteConfig.name}
          </Link>

          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  isHome && activeId !== null && link.href === `/#${activeId}`;

                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={(event) => handleSectionClick(event, link.href)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative rounded-md px-3 py-2 text-[13px] transition-colors duration-200",
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {link.label}
                      <span
                        aria-hidden="true"
                        className={cn(
                          "absolute inset-x-2 -bottom-px h-px transition-opacity duration-300",
                          isActive ? "gradient-line opacity-100" : "opacity-0",
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <Button asChild size="icon-sm" variant="ghost">
              <a
                href={siteConfig.github}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`GitHub profile: ${siteConfig.githubHandle}`}
              >
                <GitHubIcon className="size-4" />
              </a>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link href={siteConfig.resumePath}>
                <FileText />
                Resume
              </Link>
            </Button>
          </div>

          <Button
            ref={triggerRef}
            type="button"
            size="icon-sm"
            variant="ghost"
            className="md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            id="mobile-navigation"
            ref={panelRef}
            key="mobile-navigation"
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            animate={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }
            }
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <nav aria-label="Sections" className="shell py-4">
              <ul className="flex flex-col">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={(event) => handleSectionClick(event, link.href)}
                      className="block rounded-lg px-3 py-3 text-[15px] text-foreground transition-colors hover:bg-secondary/40"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
                <Button asChild variant="secondary" className="w-full">
                  <a
                    href={siteConfig.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    onClick={() => setIsOpen(false)}
                  >
                    <GitHubIcon className="size-4" />
                    GitHub
                  </a>
                </Button>
                <Button asChild className="w-full">
                  <Link
                    href={siteConfig.resumePath}
                    onClick={() => setIsOpen(false)}
                  >
                    <FileText />
                    Resume
                  </Link>
                </Button>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
