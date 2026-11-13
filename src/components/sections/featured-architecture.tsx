"use client";

import { useState } from "react";

import { Section } from "@/components/shared/section";
import { SectionHeading } from "@/components/shared/section-heading";
import { systemFlow, systemServices, type SystemNode } from "@/data/system-architecture";
import { cn } from "@/lib/utils";

/**
 * "How I Think About Systems" — the reference architecture.
 *
 * Every component is a real button, so the explanation is reachable by
 * keyboard and by touch, not only by hover. The detail panel is a polite
 * live region: a screen reader announces the change when focus moves.
 */
export function FeaturedArchitecture() {
  const [activeId, setActiveId] = useState<string>(systemFlow[2].id);

  const allNodes: SystemNode[] = [...systemFlow, ...systemServices];
  const activeNode = allNodes.find((node) => node.id === activeId) ?? systemFlow[0];

  return (
    <Section id="architecture" labelledBy="architecture-heading" tone="raised">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading
            id="architecture-heading"
            index="10"
            eyebrow="System design"
            title="How I think about systems."
            gradient="cool"
            description="A request path with its boundaries marked: presentation, boundary, trust, domain and storage. The services beside it exist to keep that path short."
          />

          <p className="max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
            This is a mental model for reasoning about systems, not a claim that
            every project uses every component. Each project borrows the parts it
            needs — EstatePlus, for example, is being built API-first, with the
            queue and stream layers added against a real workload rather than in
            advance.
          </p>

          <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-foreground-subtle">
            select a component to see its role
          </p>
        </div>

        <ArchitectureExplorer
          activeId={activeId}
          activeNode={activeNode}
          onSelect={setActiveId}
        />
      </div>
    </Section>
  );
}

interface ArchitectureExplorerProps {
  activeId: string;
  activeNode: SystemNode;
  onSelect: (id: string) => void;
}


function ArchitectureExplorer({
  activeId,
  activeNode,
  onSelect,
}: ArchitectureExplorerProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="eyebrow">Request path</p>
        <span className="font-mono text-[10.5px] text-foreground-subtle">
          {systemFlow.length} layers
        </span>
      </div>

      <ol className="flex flex-col">
        {systemFlow.map((node, index) => (
          <li key={node.id} className="relative">
            <button
              type="button"
              onMouseEnter={() => onSelect(node.id)}
              onFocus={() => onSelect(node.id)}
              onClick={() => onSelect(node.id)}
              aria-describedby="architecture-detail"
              className={cn(
                "flex w-full items-center gap-4 rounded-lg px-3 py-2.5 text-left transition-colors duration-200",
                activeId === node.id ? "bg-secondary/60" : "hover:bg-secondary/30",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "size-1.5 shrink-0 rounded-full transition-colors",
                  activeId === node.id ? "bg-accent" : "bg-border-strong",
                )}
              />
              <span className="flex flex-1 flex-wrap items-baseline gap-2">
                <span className="text-[13.5px] font-medium tracking-tight text-foreground">
                  {node.name}
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground-subtle">
                  {node.label}
                </span>
              </span>
            </button>

            {index < systemFlow.length - 1 ? (
              <span aria-hidden="true" className="ml-[18px] block h-3 w-px bg-border" />
            ) : null}
          </li>
        ))}
      </ol>

      <div className="rule-fade" />

      <p className="eyebrow">Supporting services</p>

      <ul className="flex flex-wrap gap-2">
        {systemServices.map((node) => (
          <li key={node.id}>
            <button
              type="button"
              onMouseEnter={() => onSelect(node.id)}
              onFocus={() => onSelect(node.id)}
              onClick={() => onSelect(node.id)}
              aria-describedby="architecture-detail"
              className={cn(
                "rounded-lg border px-3 py-2 font-mono text-[11.5px] tracking-tight transition-colors duration-200",
                activeId === node.id
                  ? "border-accent/40 bg-accent/[0.08] text-accent-soft"
                  : "border-border bg-secondary/30 text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              {node.name}
            </button>
          </li>
        ))}
      </ul>

      <div
        id="architecture-detail"
        aria-live="polite"
        className="mt-1 flex min-h-[104px] flex-col gap-1.5 rounded-lg border border-border bg-secondary/20 p-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[12px] tracking-tight text-foreground">
            {activeNode.name}
          </span>
          <span className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground-subtle">
            {activeNode.label}
          </span>
        </div>
        <p className="text-[12.5px] leading-relaxed text-muted-foreground">
          {activeNode.detail}
        </p>
      </div>
    </div>
  );
}
