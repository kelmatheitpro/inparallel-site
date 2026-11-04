/**
 * Content for the about page, and for the bylines on Insights.
 *
 * Kept out of the sections so copy can be edited without touching layout, the
 * same way `parallel.ts` works for the home page. Our names and photographs
 * come from `FOUNDERS` (`parallel.ts`); this file adds what only the about
 * page and the blog need on top of them.
 */

import type { ImageMetadata } from "astro";
import { FOUNDERS } from "@/data/parallel.ts";
import studioLounge from "@/assets/inparallel/about/studio-lounge.webp";
import aleksandarLaptop from "@/assets/inparallel/about/aleksandar-laptop.webp";
import darkoDesk from "@/assets/inparallel/about/darko-desk.webp";
import aleksandarAvatar from "@/assets/inparallel/blog/aleksandar-dumic.webp";
import darkoCutout from "@/assets/inparallel/team/team-darko-milosevic.webp";

/* -------------------------------------------------------------------------- */
/* The name                                                                    */
/* -------------------------------------------------------------------------- */

export interface NamePoint {
  title: string;
  text: string;
}

/** What "in parallel" means in practice — the three things the name says. */
export const NAME_POINTS: NamePoint[] = [
  {
    title: "Two senior people",
    text: "Aleksandar and Darko are co-founders who both plan, design, build and ship. Whoever you talk to knows your project end to end, with no account manager in between.",
  },
  {
    title: "In parallel, not a relay",
    text: "Strategy, design, build and SEO run at the same time instead of being handed down a line, so nothing gets dropped between steps and launch moves up.",
  },
  {
    title: "Alongside your team",
    text: "We work next to your marketers, designers and developers: an extension of your team, not a black box you send briefs into.",
  },
];

/**
 * The two of us at work, shown whole: the picture is wide, and any crop of it
 * loses one of us or Darko's legs.
 */
export const STUDIO_PHOTO = {
  image: studioLounge,
  alt: "Darko stretched out on the studio sofa with his laptop, Aleksandar beside him working on his",
};

/* -------------------------------------------------------------------------- */
/* The two of us                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Two equal co-founders. Neither of us has a lane: both of us plan, design,
 * build in Webflow, launch and grow every project, so the two are presented
 * the same way — the same title, the same line — like the mark's two strokes.
 */
export const CO_FOUNDER = {
  role: "Co-founder",
  line: "Plans it, designs it, builds it in Webflow, ships it.",
} as const;

export interface Person {
  name: string;
  /** Transparent cut-out, standing, arms folded. */
  photo: ImageMetadata;
  linkedin: string;
}

const LINKEDIN: Record<string, string> = {
  "Aleksandar Dumić": "https://www.linkedin.com/in/aleksandar-dumic-603080318/",
  "Darko Milošević": "https://www.linkedin.com/in/darko-milosevicc/",
};

/** In the order the mark is drawn: left stroke, right stroke. */
export const PEOPLE: Person[] = FOUNDERS.map((founder) => ({
  name: founder.name,
  photo: founder.photo,
  linkedin: LINKEDIN[founder.name] ?? "",
}));

/* -------------------------------------------------------------------------- */
/* Authors                                                                     */
/* -------------------------------------------------------------------------- */

export interface Author {
  name: string;
  role: string;
  /** Square-ish portrait for the byline and the author card. */
  photo: ImageMetadata;
  bio: string;
  linkedin: string;
}

/** Keyed the way a post's `author` field names them. */
export const AUTHORS: Record<"aleksandar" | "darko", Author> = {
  aleksandar: {
    name: "Aleksandar Dumić",
    role: CO_FOUNDER.role,
    photo: aleksandarAvatar,
    bio: "Aleksandar is a co-founder of inParallel. He writes about the technical side of Webflow: how sites are built to perform and scale, and where the platform's limits really are.",
    linkedin: LINKEDIN["Aleksandar Dumić"] ?? "",
  },
  darko: {
    name: "Darko Milošević",
    role: CO_FOUNDER.role,
    photo: darkoCutout,
    bio: "Darko is a co-founder of inParallel. Like Aleksandar, he plans, designs, builds and ships every project the studio takes on.",
    linkedin: LINKEDIN["Darko Milošević"] ?? "",
  },
};

/* -------------------------------------------------------------------------- */
/* How we work                                                                 */
/* -------------------------------------------------------------------------- */

export interface ProcessCard {
  /** Two lines, broken where the promise hands over to its payoff. */
  title: [string, string];
  text: string;
  /**
   * A photograph of the two of us. Without one, the card shows the mark —
   * the two strokes on the hero's glass — instead.
   */
  image?: ImageMetadata;
  alt?: string;
  /** Where the crop centres, as an `object-position`. */
  focus?: string;
}

/**
 * Only photographs in which nobody but the two of us appears: one of each of
 * us, and the third promise carries the mark. The wide picture of us together
 * stands on its own further up the page (`STUDIO_PHOTO`).
 */
export const PROCESS_CARDS: ProcessCard[] = [
  {
    title: ["From first idea", "to live launch"],
    text: "Strategy, design, build and rollout, handled by the two of us from start to finish.",
    image: aleksandarLaptop,
    alt: "Aleksandar on the studio sofa, working on a laptop covered in stickers",
  },
  {
    title: ["We test first,", "you move faster"],
    text: "We try ideas on our own workflows before they become recommendations for your website.",
    image: darkoDesk,
    alt: "Darko working at a laptop in the darkened studio",
    focus: "50% 40%",
  },
  {
    title: ["Webflow natives,", "honest early"],
    text: "If something is not worth doing, we say it early and point you to a better path.",
  },
];

/* -------------------------------------------------------------------------- */
/* Reach                                                                       */
/* -------------------------------------------------------------------------- */

export interface Place {
  label: string;
  /** Degrees east, −180 to 180. */
  lon: number;
  /** Degrees north, −90 to 90. */
  lat: number;
}

/** Where the arcs leave from, and the chip that names it on the map. */
export const ORIGIN: Place = { label: "Belgrade", lon: 20.45, lat: 44.8 };

/**
 * Where they land: the regions the work has gone to, not particular cities —
 * the map is a picture of reach, not a client list. Order only decides which
 * arc is drawn first.
 */
export const DESTINATIONS: Place[] = [
  { label: "North America", lon: -100, lat: 40 },
  { label: "South America", lon: -55, lat: -12 },
  { label: "Asia", lon: 105, lat: 32 },
  { label: "Australia", lon: 134, lat: -25 },
];

export interface Stat {
  /**
   * Written out as it finally reads. Anything with digits in it counts up to
   * this on arrival, keeping whatever sits either side; anything without —
   * the infinity sign — is left as it is.
   */
  value: string;
  label: string;
}

export const REACH_STATS: Stat[] = [
  { value: "100+", label: "projects worldwide" },
  { value: "6", label: "continents" },
  { value: "30+", label: "happy partners" },
  { value: "∞", label: "bigger things ahead" },
];

/* -------------------------------------------------------------------------- */
/* The previous design                                                         */
/* -------------------------------------------------------------------------- */

/*
 * The about sections of the previous design (`src/components/sections/About*`)
 * still import these. They are no longer on any page; the data stays until
 * those components are removed, so they keep compiling.
 */

export interface StoryBlock {
  lead: string;
  rest: string;
  image?: ImageMetadata;
  alt?: string;
  side: "start" | "end";
}

export const STORY: StoryBlock[] = [
  {
    lead: "We partner with ambitious companies",
    rest: "to build digital experiences that are not only beautiful, but built to drive real business results.",
    side: "end",
  },
  {
    lead: "From early-stage startups to established teams,",
    rest: "we become a reliable extension of your own — briefed once, trusted with the rest.",
    side: "start",
  },
];

export interface CrewCard {
  title: string;
  text: string;
  image?: ImageMetadata;
  alt?: string;
}

export const CREW_CARDS: CrewCard[] = PROCESS_CARDS.map((card) => ({
  title: card.title.join(" "),
  text: card.text,
  ...(card.image ? { image: card.image, alt: card.alt ?? "" } : {}),
}));
