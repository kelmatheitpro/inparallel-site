import type { ImageMetadata } from "astro";
import judeCornishStill from "@/assets/inparallel/testimonials/sustain-jude-cornish.webp";

/**
 * Copy and figures for the work index and the case study pages.
 *
 * The studies themselves live in `src/content/projects`; this file holds what
 * sits around them — the index's headings, which studies it features, the
 * filter order, the figures the "Measured after launch" board draws, and the
 * films that go with a study.
 */

/* -------------------------------------------------------------------------- */
/* The index                                                                  */
/* -------------------------------------------------------------------------- */

export const WORK_INDEX = {
  hero: {
    label: "Our work",
    lead: "Every study here is a live site, run by its own team, and judged on what it did once it shipped.",
    /** The studies the browser under the copy runs through, in order. */
    featured: ["trakpro", "veyor", "shiftolic", "ballerine"],
  },
  compare: {
    index: "01",
    label: "Before & after",
    lead: "Drag the line to compare Ballerine's old site with the one we shipped.",
  },
  grid: {
    index: "02",
    label: "Every site",
    lead: "Five studies written up in full. Five more on the way.",
  },
  measures: {
    index: "03",
    label: "Results",
    lead: "Each figure comes from one of the studies above, and links back to it. The two strokes under it show what it is measured against.",
  },
  stories: { index: "04" },
} as const;

/**
 * The filters over the grid, in the order they're offered. A category with no
 * study in it isn't drawn, so the row never offers an empty result.
 */
export const WORK_CATEGORIES = [
  "SaaS",
  "AI",
  "Healthcare",
  "Commerce",
  "Industrial",
] as const;

/* -------------------------------------------------------------------------- */
/* Measured after launch                                                      */
/* -------------------------------------------------------------------------- */

/**
 * One of the two strokes under a figure: a bar drawn to scale against its
 * partner, with what it stands for and its value at the end.
 */
export interface Stroke {
  /** What the stroke stands for: "Previous site", "Mobile", "Week 1". */
  key: string;
  /** Written at the stroke's end. */
  value: string;
  /** Length as a share of the full track, 0–1. */
  length: number;
  /** Where along the track it starts, 0–1 — for strokes that follow each other in time. */
  start?: number;
  /** `before` is the old way, drawn grey; `after` is what shipped, drawn blue. */
  tone: "before" | "after";
}

export interface Measure {
  /** The study the figure comes from — the page checks it is there. */
  study: string;
  /** Exactly as the study states it, in its `stat` or one of its `results`. */
  figure: string;
  measure: string;
  strokes: [Stroke, Stroke];
}

/**
 * Every figure is one the study itself states, and every stroke is drawn to
 * the scale the study gives — nothing is estimated. The sentence each one
 * rests on is quoted beside it.
 */
export const MEASURES: Measure[] = [
  {
    /* "average engagement time on the site grew 16x compared to the previous
       version" — Ballerine, The result. */
    study: "ballerine",
    figure: "16x",
    measure: "Average engagement time",
    strokes: [
      { key: "Previous site", value: "1x", length: 1 / 16, tone: "before" },
      { key: "New site", value: "16x", length: 1, tone: "after" },
    ],
  },
  {
    /* "25+ pages launched, from 3 indexable" and "From 3 indexable pages to a
       full multi-page site, all of it discoverable" — TrakPro. */
    study: "trakpro",
    figure: "25+",
    measure: "Pages a search engine can find",
    strokes: [
      { key: "Old site", value: "3", length: 3 / 25, tone: "before" },
      { key: "New site", value: "25+", length: 1, tone: "after" },
    ],
  },
  {
    /* "The first week was design … The second week was development" —
       Shiftolic, The solution. */
    study: "shiftolic",
    figure: "2 weeks",
    measure: "Kickoff to launch, design and build",
    strokes: [
      { key: "Week 1", value: "Design", length: 0.5, tone: "after" },
      { key: "Week 2", value: "Build", start: 0.5, length: 0.5, tone: "after" },
    ],
  },
  {
    /* "Because the old site had only one region, the core of the work was
       restructuring a single-region site into a five-region one" — Veyor. */
    study: "veyor",
    figure: "5",
    measure: "Markets, each with its own SEO",
    strokes: [
      { key: "Old site", value: "1 region", length: 1 / 5, tone: "before" },
      { key: "New site", value: "5 markets", length: 1, tone: "after" },
    ],
  },
  {
    /* "SEO reached a perfect 100 on both mobile and desktop" — TrakPro, The
       result. Out of 100, so both strokes run the full track. */
    study: "trakpro",
    figure: "100",
    measure: "SEO score, out of 100",
    strokes: [
      { key: "Mobile", value: "100", length: 1, tone: "after" },
      { key: "Desktop", value: "100", length: 1, tone: "after" },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* Films                                                                      */
/* -------------------------------------------------------------------------- */

export interface StudyFilm {
  /** The id out of the watch URL. The film is on Darko's own channel. */
  youtube: string;
  /** The still it is shown as until it's played. */
  poster: ImageMetadata;
  speaker: string;
  /** What the film is. Not a quote: nothing here is put in their mouth. */
  line: string;
}

/** A client on camera, by study id, for a study without a written quote. */
export const STUDY_FILMS: Record<string, StudyFilm> = {
  sustain: {
    youtube: "HSKTT5Ig2RE",
    poster: judeCornishStill,
    speaker: "Jude Cornish",
    line: "on working with us",
  },
};

/* -------------------------------------------------------------------------- */
/* Shared helpers                                                             */
/* -------------------------------------------------------------------------- */

/** What an address bar shows: the domain, without the scheme or a `www.`. */
export const hostOf = (url: string) =>
  new URL(url).hostname.replace(/^www\./, "");

/** A category as a filter value: "Industrial" → "industrial". */
export const categoryKey = (category: string) =>
  category.toLowerCase().replace(/[^a-z0-9]+/g, "-");

/**
 * How tall to set a client's mark so every mark carries the same weight: a
 * wide wordmark sits lower than a stacked one. `base` is the height of a mark
 * four times as wide as it is tall; the rest scale by area from there.
 */
export const logoHeight = (logo: ImageMetadata, base = 1.6) => {
  const ratio = logo.height ? logo.width / logo.height : 4;
  const scale = Math.min(1.4, Math.max(0.75, Math.sqrt(4 / ratio)));
  return `${(base * scale).toFixed(3)}rem`;
};

/**
 * How a quote is signed: first name and the initial of the last, the way a
 * note is — "Or Moshkovitz" → "Or M.".
 */
export const signatureOf = (name: string) => {
  const [first = "", ...rest] = name.trim().split(/\s+/);
  const last = rest.at(-1);
  return last ? `${first} ${last[0]}.` : first;
};
