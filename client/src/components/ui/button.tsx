import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * shadcn/ui-style button.
 *
 * `primary` is the site's one loud surface: the violet → indigo → cyan
 * gradient defined by `.button-vivid`, which slides on hover and carries a
 * matching coloured shadow. Everything else stays quiet — navy plates, hairline
 * borders and one cyan focus ring — so the call to action is the only thing
 * competing with the display type for attention.
 *
 * The transition list includes `background-position` and `box-shadow` so the
 * gradient slide and the glow animate; without them the base utilities would
 * replace the component's own transition.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium outline-none transition-[background-color,border-color,color,opacity,transform,background-position,box-shadow] duration-300 ease-[var(--ease-out-expo)] focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "button-vivid active:translate-y-px",
        secondary:
          "border border-border bg-secondary/60 text-foreground backdrop-blur-sm hover:border-accent-cyan/40 hover:bg-secondary hover:text-foreground",
        outline:
          "border border-border text-foreground hover:border-accent-violet/45 hover:bg-secondary/50",
        ghost:
          "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
        link: "text-accent-cyan-soft underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3.5 text-[13px] [&_svg]:size-3.5",
        default: "h-10 px-4 [&_svg]:size-4",
        lg: "h-11 px-5 text-[15px] [&_svg]:size-4",
        icon: "size-10 [&_svg]:size-4",
        "icon-sm": "size-9 [&_svg]:size-4",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

type ButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** Render as the single child element (for example a Next.js Link). */
    asChild?: boolean;
  };

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
