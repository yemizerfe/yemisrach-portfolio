import { cn } from "@/lib/utils";

interface TechBadgeProps {
  label: string;
  className?: string;
  /**
   * `subtle` marks a supporting layer (the interface, for example) and `muted`
   * marks something designed or studied rather than implemented. Three tiers,
   * so the emphasis carries meaning instead of decoration.
   */
  tone?: "default" | "subtle" | "muted";
}

/** Small monospaced label for a technology or concept. */
export function TechBadge({ label, className, tone = "default" }: TechBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-1 font-mono text-[11px] leading-none tracking-tight transition-colors",
        tone === "default" && "border-border bg-secondary/40 text-muted-foreground",
        tone === "subtle" && "border-border/70 bg-transparent text-foreground-subtle",
        tone === "muted" && "border-dashed border-border bg-transparent text-foreground-subtle",
        className,
      )}
    >
      {label}
    </span>
  );
}

interface TechBadgeListProps {
  items: string[];
  className?: string;
  /** Accessible label for the group, e.g. "Technologies used". */
  label?: string;
  tone?: "default" | "subtle" | "muted";
  limit?: number;
}

export function TechBadgeList({
  items,
  className,
  label = "Technologies",
  tone = "default",
  limit,
}: TechBadgeListProps) {
  const shown = typeof limit === "number" ? items.slice(0, limit) : items;
  const remainder = items.length - shown.length;

  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-1.5", className)}>
      {shown.map((item) => (
        <li key={item}>
          <TechBadge label={item} tone={tone} />
        </li>
      ))}
      {remainder > 0 ? (
        <li>
          <TechBadge label={`+${remainder}`} tone="muted" />
        </li>
      ) : null}
    </ul>
  );
}
