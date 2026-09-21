/**
 * Content for the about page.
 *
 * Kept out of the sections so copy can be edited — or swapped for a CMS fetch —
 * without touching layout, the same way `home.ts` works.
 */

import type { ImageMetadata } from "astro";

/* -------------------------------------------------------------------------- */
/* The story blocks                                                            */
/* -------------------------------------------------------------------------- */

export interface StoryBlock {
  /**
   * The claim, split where the sentence hands over. `lead` is the half the
   * design states in full white; `rest` is the half that stays muted until the
   * reader reaches it.
   */
  lead: string;
  rest: string;
  /**
   * The photograph beside it. Drop a file into `src/assets/inparallel/studio/`
   * and import it here; without one the block renders its frame empty rather
   * than breaking the layout.
   */
  image?: ImageMetadata;
  alt?: string;
  /** Which side of the row the photograph sits on. */
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

/** Where they land. Order only decides which arc is drawn first. */
export const DESTINATIONS: Place[] = [
  { label: "San Francisco", lon: -122.4, lat: 37.8 },
  { label: "New York", lon: -74, lat: 40.7 },
  { label: "London", lon: -0.1, lat: 51.5 },
  { label: "Tel Aviv", lon: 34.8, lat: 32.1 },
  { label: "Singapore", lon: 103.8, lat: 1.35 },
  { label: "Sydney", lon: 151.2, lat: -33.9 },
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
/* The crew                                                                    */
/* -------------------------------------------------------------------------- */

export interface CrewCard {
  title: string;
  text: string;
  /** Same as the story blocks: import a photograph here when there is one. */
  image?: ImageMetadata;
  alt?: string;
}

export const CREW_CARDS: CrewCard[] = [
  {
    title: "From first idea to live launch",
    text: "Strategy, design, build and rollout, handled by one tight team from start to finish.",
  },
  {
    title: "We test first, you move faster",
    text: "We try ideas on our own workflows before they ever become a recommendation for your website.",
  },
  {
    title: "Built in Webflow, spoken with honesty",
    text: "If something is not worth doing, we say it early and point you at the better path instead.",
  },
];
