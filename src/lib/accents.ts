/**
 * Shared accent palette — six registers of one navy palette.
 *
 * The site is navy; this file hands out the *lights* that fall on it. Four of
 * the six are the palette's own lights (violet, cyan, champagne, emerald) and
 * two are the quiet registers (ice, ink) used for structure and metadata.
 * Every register was chosen to sit against blue-violet navy, so a page full of
 * colour-coded items still reads as one image.
 *
 * Emerald is the exception that proves the rule: it is never used to decorate,
 * only to carry the available/success signal.
 *
 * Nothing hard-codes "this project is violet": each data-driven item derives
 * its register from its own id through `accentFor()`, so the register is stable
 * across renders, consistent between the card and its section, and impossible
 * for two items to clash by accident. Sections walk the list in order through
 * `accentForIndex()`, which is why twelve sections read as twelve rooms.
 *
 * Every class string is a static literal on purpose — this is the only place
 * the register utilities appear, and Tailwind reads them from here.
 */

export const accentNames = [
  "violet",
  "cyan",
  "champagne",
  "emerald",
  "ice",
  "ink",
] as const;

export type AccentName = (typeof accentNames)[number];

export interface Accent {
  /** Register name, for callers that need to pick something themselves. */
  name: AccentName;
  /** Solid mark: dots, 1px rules, small numbers. */
  mark: string;
  /** Lighter variant, readable at body size on navy. */
  soft: string;
  /** Tinted chip: icon tile or label. */
  chip: string;
  /** Sets the hue `--glow-color` uses for the `.card-glow` hover treatment. */
  glow: string;
  /**
   * The same hue as a raw custom-property reference, for the few places that
   * need it in an inline style (seeded positions, generated backdrops) rather
   * than in a class. Kept in step with `glow` by construction.
   */
  token: string;
  /**
   * A two-stop wash for a raised plate, used with `bg-gradient-to-br`: gives a
   * card a coloured interior without a second border or an image.
   */
  plate: string;
}

export const accents: Record<AccentName, Accent> = {
  /** The structural cool light: headings, primary actions, the lead register. */
  violet: {
    name: "violet",
    mark: "bg-accent-violet",
    soft: "text-accent-violet-soft",
    chip: "border-accent-violet/30 bg-accent-violet/[0.1] text-accent-violet-soft",
    glow: "[--glow-color:var(--color-accent-violet)]",
    token: "var(--color-accent-violet)",
    plate: "from-accent-violet/[0.16] via-transparent to-accent-cyan/[0.08]",
  },
  /** The electric signal: links, live data, and the focus ring. */
  cyan: {
    name: "cyan",
    mark: "bg-accent-cyan",
    soft: "text-accent-cyan-soft",
    chip: "border-accent-cyan/30 bg-accent-cyan/[0.1] text-accent-cyan-soft",
    glow: "[--glow-color:var(--color-accent-cyan)]",
    token: "var(--color-accent-cyan)",
    plate: "from-accent-cyan/[0.16] via-transparent to-accent-violet/[0.08]",
  },
  /** The signature warm light: gold, and the site's original accent. */
  champagne: {
    name: "champagne",
    mark: "bg-accent",
    soft: "text-accent-soft",
    chip: "border-accent/30 bg-accent/[0.1] text-accent-soft",
    glow: "[--glow-color:var(--color-accent)]",
    token: "var(--color-accent)",
    plate: "from-accent/[0.16] via-transparent to-accent-violet/[0.08]",
  },
  /** The healthy signal: availability, success, "in progress". */
  emerald: {
    name: "emerald",
    mark: "bg-accent-emerald",
    soft: "text-accent-emerald-soft",
    chip: "border-accent-emerald/30 bg-accent-emerald/[0.1] text-accent-emerald-soft",
    glow: "[--glow-color:var(--color-accent-emerald)]",
    token: "var(--color-accent-emerald)",
    plate: "from-accent-emerald/[0.16] via-transparent to-accent-cyan/[0.08]",
  },
  /** Cool and quiet: structure, interfaces, secondary signals. */
  ice: {
    name: "ice",
    mark: "bg-accent-ice",
    soft: "text-accent-ice-soft",
    chip: "border-accent-ice/30 bg-accent-ice/[0.1] text-accent-ice-soft",
    glow: "[--glow-color:var(--color-accent-ice)]",
    token: "var(--color-accent-ice)",
    plate: "from-accent-ice/[0.14] via-transparent to-accent-violet/[0.08]",
  },
  /** Navy-grey: the quietest marks, metadata and muted states. */
  ink: {
    name: "ink",
    mark: "bg-accent-ink",
    soft: "text-accent-ink-soft",
    chip: "border-accent-ink/30 bg-accent-ink/[0.1] text-accent-ink-soft",
    glow: "[--glow-color:var(--color-accent-ink)]",
    token: "var(--color-accent-ink)",
    plate: "from-accent-ink/[0.14] via-transparent to-accent-ice/[0.06]",
  },
};

/**
 * Stable register for a seed (project slug, pillar id, practice title…).
 *
 * A tiny string hash rather than a lookup table: nothing has to be maintained
 * when a new project or pillar is added, the same id always lands on the same
 * register, and the result is identical on the server and the client.
 */
export function accentFor(seed: string): Accent {
  let hash = 0;
  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) % 1_000_003;
  }

  return accents[accentNames[hash % accentNames.length]];
}

/** Register for a section, derived from its monospaced index ("01" … "12"). */
export function accentForIndex(index?: string): Accent {
  const parsed = Number.parseInt(index ?? "", 10);
  const position = Number.isNaN(parsed) ? 0 : parsed;

  return accents[accentNames[(position - 1 + accentNames.length) % accentNames.length]];
}
