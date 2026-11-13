"use client";

import { useId, useRef, useState } from "react";

import type { TabItem } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface CaseStudyTabsProps {
  tabs: TabItem[];
  /** Accessible label for the tab group. */
  label: string;
  className?: string;
}

/**
 * Tabs for two or three alternative views of the same subject — an
 * implemented path beside its designed counterpart, usually.
 *
 * Properly wired as an ARIA tab set: one tab in the tab order at a time, arrow
 * keys move between tabs, Home/End jump to the ends, and the active tab owns its
 * panel. A tab set that only responds to clicks is a div with opinions.
 */
export function CaseStudyTabs({ tabs, label, className }: CaseStudyTabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeTab = tabs[activeIndex];

  function focusTab(index: number) {
    const next = (index + tabs.length) % tabs.length;
    setActiveIndex(next);
    tabRefs.current[next]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case "ArrowRight":
        event.preventDefault();
        focusTab(activeIndex + 1);
        break;
      case "ArrowLeft":
        event.preventDefault();
        focusTab(activeIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        focusTab(0);
        break;
      case "End":
        event.preventDefault();
        focusTab(tabs.length - 1);
        break;
      default:
        break;
    }
  }

  if (!activeTab) {
    return null;
  }

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <div
        role="tablist"
        aria-label={label}
        className="no-scrollbar -mx-1 flex gap-1.5 overflow-x-auto px-1"
      >
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;

          return (
            <button
              key={tab.label}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={handleKeyDown}
              className={cn(
                "shrink-0 rounded-lg border px-3.5 py-2 text-[12.5px] tracking-tight transition-colors duration-200",
                isActive
                  ? "border-border-strong bg-secondary/60 text-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-border-strong hover:text-foreground",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${baseId}-panel-${activeIndex}`}
        aria-labelledby={`${baseId}-tab-${activeIndex}`}
        tabIndex={0}
        className="rounded-xl border border-border bg-card p-5 sm:p-6"
      >
        <div className="flex flex-col gap-4">
          {activeTab.heading ? (
            <h3 className="text-sm font-medium tracking-tight text-foreground">
              {activeTab.heading}
            </h3>
          ) : null}

          {activeTab.paragraphs?.map((paragraph, index) => (
            <p
              key={`${activeTab.label}-paragraph-${index}`}
              className="max-w-prose text-[13.5px] leading-relaxed text-muted-foreground"
            >
              {paragraph}
            </p>
          ))}

          {activeTab.items && activeTab.items.length > 0 ? (
            <ul className="flex flex-col gap-2.5">
              {activeTab.items.map((item) => (
                <li
                  key={item}
                  className="flex gap-2.5 text-[12.5px] leading-relaxed text-muted-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="mt-1.5 size-1.5 shrink-0 rounded-full bg-foreground-subtle"
                  />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
