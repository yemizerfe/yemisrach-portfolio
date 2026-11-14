import Image from "next/image";
import { Camera, ImagePlus } from "lucide-react";

import { portraitFacts, portraitPhoto } from "@/data/portrait";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/utils";

/** "Yemisrach Zerfe" → "YZ". Tolerates a single-word name. */
function initialsOf(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2) || "—"
  );
}

interface PortraitFrameProps {
  className?: string;
}

/**
 * Home-page portrait frame.
 *
 * Rendered in the hero, beside the identity copy. Server component: no state and
 * no motion, so it adds nothing to the client bundle. When `portraitPhoto.src`
 * is set the real photo is rendered; while it is null the frame shows an
 * honestly labelled empty slot at the same size, so the layout is already
 * correct the moment a photo is added.
 */
export function PortraitFrame({ className }: PortraitFrameProps) {
  const { src, alt, caption, label, ratio, expectedPath } = portraitPhoto;
  const initials = initialsOf(siteConfig.name);

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-foreground-subtle">
          {label}
        </span>
        <span className="flex items-center gap-1.5">
          <Camera aria-hidden="true" className="size-3.5 text-foreground-subtle" />
          <span className="font-mono text-[10.5px] text-foreground-subtle">
            {src ? "photo" : "empty slot"}
          </span>
        </span>
      </div>

      {/* Plate area. The registration marks sit on the slot itself, so a photo
          is framed by them and the empty slot is marked out like a technical
          plate rather than looking unfinished. */}
      <div className="plate-marks relative w-full" style={{ aspectRatio: ratio }}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(min-width: 1024px) 24rem, 100vw"
            className="object-cover"
          />
        ) : (
          <div
            aria-label={`${label} placeholder — no photo added yet`}
            role="img"
            className="grid-backdrop absolute inset-0 flex flex-col items-center justify-center gap-5 p-6 text-center"
          >
            {/* Viewfinder guides: the slot is a frame waiting for a subject, so
                the finding marks are drawn rather than implied. The initials
                sit on the intersection and cover it, leaving four rays. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-border"
            />

            <span
              aria-hidden="true"
              className="flex size-20 items-center justify-center rounded-full border border-dashed border-border-strong bg-secondary/50 font-mono text-xl tracking-tight text-foreground sm:size-24 sm:text-2xl"
            >
              {initials}
            </span>

            <span className="flex flex-col items-center gap-2">
              <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-accent-soft">
                <ImagePlus aria-hidden="true" className="size-3.5" />
                waiting for photo
              </span>
              <span className="max-w-[18rem] font-mono text-[10.5px] leading-relaxed text-foreground-subtle">
                {expectedPath}
              </span>
            </span>
          </div>
        )}
      </div>

      <figcaption className="flex flex-col gap-4 border-t border-border px-4 py-4">
        {/* The caption is the "how to add a photo" instruction, so it is only
            shown while the slot is still empty. */}
        {src ? null : (
          <p className="text-[12px] leading-relaxed text-foreground-subtle">
            {caption}
          </p>
        )}

        <dl className="flex flex-col gap-2.5">
          {portraitFacts.map((fact) => (
            <div
              key={fact.label}
              className="flex items-baseline justify-between gap-4"
            >
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-foreground-subtle">
                {fact.label}
              </dt>
              <dd className="text-right text-[12.5px] leading-relaxed text-muted-foreground">
                {fact.href ? (
                  <a
                    href={fact.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-accent-soft underline-offset-4 hover:underline"
                  >
                    {fact.value}
                  </a>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </figcaption>
    </figure>
  );
}
