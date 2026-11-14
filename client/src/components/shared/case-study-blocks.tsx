import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

import { ApiCapabilityList } from "@/components/shared/api-capability";
import { ArchitectureFlow } from "@/components/shared/architecture-flow";
import { CaseStudyAccordion } from "@/components/shared/case-study-accordion";
import { CaseStudyTabs } from "@/components/shared/case-study-tabs";
import { ChallengeCards } from "@/components/shared/challenge-cards";
import { CodeSnippetList } from "@/components/shared/code-snippet";
import { CompareColumns } from "@/components/shared/compare-columns";
import { DatabaseDiagram } from "@/components/shared/database-diagram";
import { DecisionCard } from "@/components/shared/decision-card";
import { FlowSteps } from "@/components/shared/flow-steps";
import { ProjectScreenshot } from "@/components/shared/project-screenshot";
import { Reveal } from "@/components/shared/reveal";
import { StatusPill } from "@/components/shared/status-pill";
import { TechBadgeList } from "@/components/shared/tech-badge";
import type { CaseStudyBlock } from "@/types/portfolio";

interface CaseStudyBlocksProps {
  blocks: CaseStudyBlock[];
}

/**
 * Renders a case study from typed data.
 *
 * Every project page uses this renderer, so a new project is a data change
 * rather than a new page. Each block owns its anchor id, which is what the
 * sticky navigation links to.
 *
 * Nothing here can leak a private detail: blocks carry capability descriptions,
 * layer names and trade-offs, never routes, hostnames or configuration values.
 */
export function CaseStudyBlocks({ blocks }: CaseStudyBlocksProps) {
  return (
    <div className="flex flex-col gap-16 lg:gap-20">
      {blocks.map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </div>
  );
}

/**
 * Section heading for one block.
 *
 * A block marked `planned` renders the site's usual pill beside its heading, so
 * designed work can never be read as delivered work — the same honesty
 * mechanism the project cards use.
 */
function BlockHeading({ block }: { block: CaseStudyBlock }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <h2
          id={block.id}
          className="scroll-mt-28 text-xl font-medium tracking-tight text-foreground sm:text-2xl"
        >
          {block.title}
        </h2>
        {block.status === "planned" ? (
          <StatusPill status="designed / planned" />
        ) : null}
      </div>
      {block.description ? (
        <p className="max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
          {block.description}
        </p>
      ) : null}
    </div>
  );
}

/** Shared section shell, so every block keeps the same rhythm. */
function BlockShell({
  block,
  children,
}: {
  block: CaseStudyBlock;
  children: ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <BlockHeading block={block} />
      {children}
    </section>
  );
}

/** Splits "Label — explanation" items so the label can be emphasised. */
function splitLabelledItem(item: string) {
  const separator = item.indexOf(" — ");
  if (separator === -1) {
    return { label: null, text: item };
  }
  return {
    label: item.slice(0, separator),
    text: item.slice(separator + 3),
  };
}

function Block({ block }: { block: CaseStudyBlock }) {
  switch (block.kind) {
    case "prose":
      return (
        <BlockShell block={block}>
          <div className="flex max-w-3xl flex-col gap-4">
            {block.paragraphs.map((paragraph, index) => (
              <p
                key={`${block.id}-${index}`}
                className="text-[14.5px] leading-[1.75] text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </BlockShell>
      );

    case "list":
      return (
        <BlockShell block={block}>
          <ul className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {block.items.map((item) => {
              const { label, text } = splitLabelledItem(item);
              return (
                <li
                  key={item}
                  className="flex flex-col gap-1.5 bg-card p-5 transition-colors duration-200 hover:bg-secondary/25"
                >
                  {label ? (
                    <span className="text-[13px] font-medium tracking-tight text-foreground">
                      {label}
                    </span>
                  ) : null}
                  <span className="text-[12.5px] leading-relaxed text-muted-foreground">
                    {text}
                  </span>
                </li>
              );
            })}
          </ul>
        </BlockShell>
      );

    case "architecture":
      return (
        <BlockShell block={block}>
          <ArchitectureFlow architecture={block.architecture} />
        </BlockShell>
      );

    case "database":
      return (
        <BlockShell block={block}>
          <DatabaseDiagram diagram={block.diagram} />
        </BlockShell>
      );

    case "api":
      return (
        <BlockShell block={block}>
          <ApiCapabilityList capabilities={block.capabilities} />
          {block.note ? (
            <p className="max-w-3xl text-[12.5px] leading-relaxed text-foreground-subtle">
              {block.note}
            </p>
          ) : null}
        </BlockShell>
      );

    case "decisions":
      return (
        <BlockShell block={block}>
          <div className="grid gap-6 md:grid-cols-2 md:gap-x-10">
            {block.items.map((item) => (
              <DecisionCard key={item.question} decision={item} />
            ))}
          </div>
        </BlockShell>
      );

    case "flow":
      return (
        <BlockShell block={block}>
          <FlowSteps steps={block.steps} note={block.note} />
        </BlockShell>
      );

    case "compare":
      return (
        <BlockShell block={block}>
          <CompareColumns columns={block.columns} note={block.note} />
        </BlockShell>
      );

    case "challenges":
      return (
        <BlockShell block={block}>
          <ChallengeCards items={block.items} />
        </BlockShell>
      );

    case "code":
      return (
        <BlockShell block={block}>
          <CodeSnippetList snippets={block.snippets} />
        </BlockShell>
      );

    case "tabs":
      return (
        <BlockShell block={block}>
          <CaseStudyTabs tabs={block.tabs} label={block.title} />
          {block.note ? (
            <p className="max-w-3xl text-[12.5px] leading-relaxed text-foreground-subtle">
              {block.note}
            </p>
          ) : null}
        </BlockShell>
      );

    case "accordion":
      return (
        <BlockShell block={block}>
          <CaseStudyAccordion items={block.items} />
        </BlockShell>
      );

    case "milestones":
      return (
        <BlockShell block={block}>
          <div className="grid gap-4 md:grid-cols-2">
            {block.items.map((item, index) => (
              <Reveal key={item.title} delay={(index % 2) * 0.04} className="h-full">
                <article className="flex h-full flex-col gap-2.5 rounded-xl border border-border bg-card p-5">
                  <h3 className="text-[14px] font-medium tracking-tight text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-[12.5px] leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </BlockShell>
      );

    case "gallery":
      return (
        <BlockShell block={block}>
          <div className="grid gap-4 md:grid-cols-2">
            {block.images.map((image) => (
              <ProjectScreenshot key={image.alt} image={image} />
            ))}
          </div>
          {block.note ? (
            <p className="max-w-3xl text-[12.5px] leading-relaxed text-foreground-subtle">
              {block.note}
            </p>
          ) : null}
        </BlockShell>
      );

    case "stack":
      return (
        <BlockShell block={block}>
          <div className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2">
            {block.groups.map((group) => {
              const label = group.label.toLowerCase();
              const isQualified =
                group.status === "planned" ||
                (group.status === undefined &&
                  mutedStackGroups.some((word) => label.includes(word)));

              return (
                <div key={group.label} className="flex flex-col gap-4 bg-card p-5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <p className="eyebrow">{group.label}</p>
                    {group.status === "planned" ? (
                      <StatusPill status="planned" />
                    ) : null}
                  </div>
                  <TechBadgeList
                    items={group.items}
                    label={`${group.label} technologies`}
                    tone={isQualified ? "muted" : "default"}
                  />
                </div>
              );
            })}
          </div>
        </BlockShell>
      );

    case "links":
      return (
        <BlockShell block={block}>
          <ul className="grid gap-3 sm:grid-cols-2">
            {block.items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group flex h-full flex-col gap-1.5 rounded-xl border border-border bg-card p-5 transition-colors duration-200 hover:border-border-strong"
                >
                  <span className="flex items-center gap-1.5 text-[13px] font-medium tracking-tight text-foreground">
                    {item.label}
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5 text-foreground-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </span>
                  <span className="text-[12.5px] leading-relaxed text-muted-foreground">
                    {item.detail}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </BlockShell>
      );

    default:
      return null;
  }
}

/**
 * Group labels that already announce a qualification.
 *
 * A group called "Where implemented" is making a narrower claim than one called
 * "Backend", so its badges render in the muted register and cannot be skimmed as
 * shipped work.
 */
const mutedStackGroups = ["planned", "exploring", "implemented", "appropriate"];


