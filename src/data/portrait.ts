import type { PortraitFact, PortraitPhoto } from "@/types/portfolio";
import { education } from "@/data/about";
import { focusAreas, siteConfig } from "@/data/site";

/**
 * Home-page portrait slot.
 *
 * Two ways to fill it, no code change needed:
 *   1. Put a photo in `public/images/` and set `src` below, e.g.
 *      src: "/images/yemisrach-zerfe.jpg"
 *      A 4:5 crop (portrait) looks best in the frame.
 *   2. Leave `src` as null and the frame renders a labelled placeholder, so
 *      the layout is already sized for the photo and nothing 404s in the
 *      meantime.
 */
export const portraitPhoto: PortraitPhoto = {
  src: "/images/yemisrach-zerfe.png",
  expectedPath: "public/images/yemisrach-zerfe.png",
  label: "Portrait",
  alt: `Portrait of ${siteConfig.name}, ${siteConfig.role.toLowerCase()}.`,
  caption:
    "Placeholder frame — drop a 4:5 portrait photo into public/images and set portraitPhoto.src in src/data/portrait.ts.",
  ratio: "4 / 5",
};

/**
 * Quick facts beside the portrait.
 *
 * Deliberately derived from the verified site data rather than hard-coded, so
 * the frame can never drift from (or contradict) the rest of the site. The
 * focus line shows the first three disciplines — backend first — because the
 * hero frame is narrow and the full list is stated in the copy beside it.
 */
export const portraitFacts: PortraitFact[] = [
  { label: "Name", value: siteConfig.name },
  { label: "Role", value: siteConfig.role },
  { label: "Degree", value: education.degree },
  { label: "University", value: education.institution },
  { label: "Location", value: siteConfig.location },
  { label: "Focus", value: focusAreas.slice(0, 3).join(" • ") },
  {
    label: "GitHub",
    value: `github.com/${siteConfig.githubHandle}`,
    href: siteConfig.github,
  },
];
