import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium leading-none tracking-wide transition-colors [&_svg]:size-3",
  {
    variants: {
      variant: {
        /** Technology chip — monospaced elsewhere, quiet by default. */
        muted: "border-white/[0.07] bg-white/[0.04] text-muted-foreground",
        outline: "border-border-strong/70 bg-transparent text-foreground-subtle",
        accent: "border-accent-cyan/35 bg-accent-cyan/10 text-accent-cyan-soft",
        /** Status pill with a signal dot. */
        status:
          "border-border bg-secondary/40 font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "muted",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
