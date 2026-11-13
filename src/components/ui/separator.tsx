import { cn } from "@/lib/utils";

interface SeparatorProps {
  className?: string;
  /** Vertical separators are used inside toolbars and meta rows. */
  orientation?: "horizontal" | "vertical";
  /**
   * Decorative separators are hidden from assistive technology; a semantic
   * separator exposes the separation role instead.
   */
  decorative?: boolean;
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = false,
}: SeparatorProps) {
  return (
    <div
      data-slot="separator"
      role={decorative ? "presentation" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
    />
  );
}

export { Separator };
