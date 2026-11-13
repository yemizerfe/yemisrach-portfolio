import { StatusPill } from "@/components/shared/status-pill";
import type { CompareColumn } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface CompareColumnsProps {
  columns: CompareColumn[];
  note?: string;
  className?: string;
}

/**
 * Two (or more) areas side by side, separated by hairlines rather than stacked
 * cards, so the comparison reads as one table instead of two unrelated panels.
 *
 * A column can carry `status: "planned"`, which renders the same pill the rest
 * of the site uses — that is what keeps a "target architecture" column from
 * being read as a delivered one.
 */
export function CompareColumns({ columns, note, className }: CompareColumnsProps) {
  return (
    <figure className={cn("flex flex-col gap-4", className)}>
      <div
        className="grid gap-px overflow-hidden rounded-xl border border-border bg-border"
        style={{ gridTemplateColumns: `repeat(auto-fit, minmax(16rem, 1fr))` }}
      >
        {columns.map((column) => (
          <div key={column.label} className="flex flex-col gap-4 bg-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-[13px] font-medium tracking-tight text-foreground">
                {column.label}
              </h3>
              {column.status === "planned" ? (
                <StatusPill status="target / planned" />
              ) : null}
            </div>

            <p className="text-[12.5px] leading-relaxed text-muted-foreground">
              {column.summary}
            </p>

            <ul className="flex flex-col gap-2.5 border-t border-border pt-4">
              {column.items.map((item) => (
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
          </div>
        ))}
      </div>

      {note ? (
        <figcaption className="text-[12.5px] leading-relaxed text-foreground-subtle">
          {note}
        </figcaption>
      ) : null}
    </figure>
  );
}
