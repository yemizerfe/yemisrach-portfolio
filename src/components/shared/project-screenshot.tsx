import Image from "next/image";
import { ImagePlus } from "lucide-react";

import type { ProjectImage } from "@/types/portfolio";
import { cn } from "@/lib/utils";

interface ProjectScreenshotProps {
  image: ProjectImage;
  className?: string;
}

/**
 * An interface screenshot slot.
 *
 * The same rule the home-page portrait follows: while `src` is null the frame
 * renders an honestly labelled empty slot showing where the file belongs, so an
 * absent screenshot is a known gap rather than a broken image or an invented
 * mock-up.
 */
export function ProjectScreenshot({ image, className }: ProjectScreenshotProps) {
  return (
    <figure
      className={cn(
        "flex flex-col overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-foreground-subtle">
          {image.alt}
        </span>
        <span className="font-mono text-[10.5px] text-foreground-subtle">
          {image.src ? "screenshot" : "empty slot"}
        </span>
      </div>

      <div className="plate-marks relative w-full" style={{ aspectRatio: "16 / 10" }}>
        {image.src ? (
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 1024px) 32rem, 100vw"
            className="object-cover"
          />
        ) : (
          <div
            role="img"
            aria-label={`${image.alt} placeholder — no screenshot added yet`}
            className="grid-backdrop absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
          >
            <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent-soft">
              <ImagePlus aria-hidden="true" className="size-3.5" />
              waiting for screenshot
            </span>
            <span className="max-w-[20rem] break-all font-mono text-[10.5px] leading-relaxed text-foreground-subtle">
              {image.expectedPath}
            </span>
          </div>
        )}
      </div>

      <figcaption className="border-t border-border px-4 py-3 text-[12px] leading-relaxed text-muted-foreground">
        {image.caption}
      </figcaption>
    </figure>
  );
}
