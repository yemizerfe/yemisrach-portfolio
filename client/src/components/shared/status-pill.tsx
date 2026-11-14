import { cn } from "@/lib/utils";

interface StatusPillProps {
  status: string;
  className?: string;
  /**
   * `active` shows a pulsing signal dot. The dot is decorative: the status
   * text always carries the meaning, never colour alone.
   */
  tone?: "active" | "neutral";
}

export function StatusPill({
  status,
  className,
  tone = "neutral",
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-2.5 py-1 font-mono text-[10.5px] uppercase leading-none tracking-[0.14em] text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "size-1.5 rounded-full",
          tone === "active"
            ? "animate-node-pulse bg-accent"
            : "bg-foreground-subtle",
        )}
      />
      {status}
    </span>
  );
}
