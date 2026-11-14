import {
  ArrowUpRight,
  Mail,
  MapPin,
} from "lucide-react";
import type { ReactNode } from "react";

import { ContactForm } from "@/components/sections/contact-form";
import { GitHubIcon } from "@/components/shared/github-icon";
import { LinkedInIcon } from "@/components/shared/linkedin-icon";
import { Reveal } from "@/components/shared/reveal";
import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { TechBadge } from "@/components/shared/tech-badge";
import {
  contactInfoCopy,
  contactIntro,
  contactOpportunitiesCopy,
  contactOpportunityItems,
} from "@/data/contact";
import { contactChannels, siteConfig } from "@/data/site";
import { accentFor } from "@/lib/accents";
import { cn } from "@/lib/utils";

/** The sub-heading every block below the invitation shares. */
function BlockHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="text-[15px] font-medium tracking-tight text-foreground">
      {children}
    </h3>
  );
}

/**
 * The mark for a channel.
 *
 * Kept beside the component rather than in the data: `siteConfig` describes
 * destinations, and how a destination looks is a presentation decision. The
 * brand marks are inline SVGs because Lucide v1 ships no brand icons.
 */
function ChannelIcon({ id, className }: { id: string; className?: string }) {
  if (id === "github") return <GitHubIcon className={className} />;
  if (id === "linkedin") return <LinkedInIcon className={className} />;
  return <Mail className={className} />;
}

/**
 * Contact — how to reach me, and the shortest honest way to do it.
 *
 * The order follows the questions a visitor actually has: the invitation, then
 * the destinations, then the form, then what I am open to, then one closing
 * line with the three links worth having. The form sits beside the information
 * on a wide screen and below it on a narrow one, because how to reach me is
 * worth reading before the form asks for anything.
 *
 * Nothing here invents a detail. The channels come from `siteConfig`, which
 * holds no address until a real one exists; the form sends through EmailJS,
 * which refuses honestly when delivery is not configured instead of reporting a
 * success it did not have.
 */
export function Contact() {
  return (
    <Section id="contact" labelledBy="contact-heading">
      <div className="flex flex-col gap-12 lg:gap-16">
        <SectionHeading
          id="contact-heading"
          index={contactIntro.index}
          eyebrow={contactIntro.eyebrow}
          title={contactIntro.title}
          gradient="warm"
          description={contactIntro.description}
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-14">
          {/* Column one: where I can be found. Rows divided by hairlines, each
              tinting towards its own register on hover — the same ledger the
              rest of the site uses for lists of real things. */}
          <div className="flex flex-col gap-6">
            <BlockHeading>{contactInfoCopy.title}</BlockHeading>

            <ul className="flex flex-col border-t border-border">
              {contactChannels.map((channel, index) => {
                const accent = accentFor(channel.id);

                return (
                  <Reveal as="li" key={channel.id} delay={index * 0.05}>
                    <a
                      href={channel.href}
                      {...(channel.external
                        ? { target: "_blank", rel: "noreferrer noopener" }
                        : {})}
                      className={cn(
                        "group flex items-center justify-between gap-6 border-b border-border py-5 pl-1 pr-2 transition-[background-color,border-color] duration-300 hover:bg-secondary/40 hover:border-[color:color-mix(in_oklab,var(--glow-color,var(--color-border-strong))_45%,transparent)]",
                        accent.glow,
                      )}
                    >
                      <span className="flex items-start gap-4">
                        <span
                          aria-hidden="true"
                          className={cn(
                            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg border transition-colors duration-300",
                            accent.chip,
                          )}
                        >
                          <ChannelIcon id={channel.id} className="size-4" />
                        </span>
                        <span className="flex flex-col gap-1">
                          <span className="text-[14px] font-medium tracking-tight text-foreground">
                            {channel.label}
                          </span>
                          <span className="break-all font-mono text-[12px] text-muted-foreground">
                            {channel.value}
                          </span>
                          <span className="max-w-sm text-[12.5px] leading-relaxed text-foreground-subtle">
                            {channel.description}
                          </span>
                        </span>
                      </span>

                      <ArrowUpRight
                        aria-hidden="true"
                        className={cn(
                          "size-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                          accent.soft,
                        )}
                      />
                    </a>
                  </Reveal>
                );
              })}
            </ul>

            {/* A country, never an address. */}
            <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-foreground-subtle">
              <MapPin aria-hidden="true" className="size-3.5" />
              Based in {siteConfig.location}
            </p>
          </div>

          <ContactForm email={siteConfig.email} />
        </div>

        {/* Open to Opportunities. The list is the claim, so it stays short and
            every item is something I can actually say yes to. */}
        <div className="flex flex-col gap-5 border-t border-border pt-10">
          <div className="flex flex-col gap-2">
            <BlockHeading>{contactOpportunitiesCopy.title}</BlockHeading>
            <p className="max-w-2xl text-[13px] leading-relaxed text-muted-foreground">
              {contactOpportunitiesCopy.note}
            </p>
          </div>

          <ul className="flex flex-wrap gap-2">
            {contactOpportunityItems.map((opportunity) => (
              <li key={opportunity.id}>
                <TechBadge
                  label={opportunity.label}
                  className={accentFor(opportunity.id).chip}
                />
              </li>
            ))}
          </ul>
        </div>

      </div>
    </Section>
  );
}
