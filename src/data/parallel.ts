/**
 * Content for the redesigned home page — the sections built around the
 * parallel idea. Copy lives here so it can change without touching layout.
 */

import type { ImageMetadata } from "astro";
import aleksandar from "@/assets/inparallel/team/team-aleksandar-dumic.webp";
import darko from "@/assets/inparallel/team/team-darko-milosevic.webp";
import aleksandarShadow from "@/assets/inparallel/team/team-aleksandar-dumic-shadow.webp";
import darkoShadow from "@/assets/inparallel/team/team-darko-milosevic-shadow.webp";
import josephPoster from "@/assets/inparallel/testimonials/intaker-joseph-rudolo.webp";
import orPoster from "@/assets/inparallel/testimonials/ballerine-or-moshkovitz.webp";
import intakerLogo from "@/assets/inparallel/logos/intaker.svg";
import ballerineLogo from "@/assets/inparallel/logos/ballerine-white.svg";

/* -------------------------------------------------------------------------- */
/* Relay vs parallel                                                           */
/* -------------------------------------------------------------------------- */

export interface RelayTrack {
  name: string;
  /** Start and end along the timeline, 0–100, when the work runs as a relay. */
  relay: [number, number];
  /** The same, when it runs in parallel. */
  parallel: [number, number];
}

/**
 * The same four workstreams, laid out both ways. Illustrative, not a promise:
 * the board shows the shape of the two schedules, so there are no weeks on it.
 */
export const RELAY_TRACKS: RelayTrack[] = [
  { name: "Strategy & copy", relay: [0, 22], parallel: [0, 26] },
  { name: "Design", relay: [24, 48], parallel: [6, 46] },
  { name: "Webflow build", relay: [50, 80], parallel: [14, 58] },
  { name: "SEO & AEO", relay: [82, 100], parallel: [10, 60] },
];

export interface Value {
  title: string;
  text: string;
}

/** What clients tell us they didn't get from their last agency. */
export const VALUES: Value[] = [
  {
    title: "Radical candor",
    text: "If it won't work, we say so — before the work starts, not after the invoice.",
  },
  {
    title: "One senior crew",
    text: "The people who pitch are the people who design, build and ship.",
  },
  {
    title: "Webflow natives",
    text: "Your team edits copy, pages and SEO without a developer in the loop.",
  },
  {
    title: "Launch is day one",
    text: "The site keeps shipping after go-live — pages, experiments, releases.",
  },
  {
    title: "Zero theatre",
    text: "No decks about decks. Progress you can click, every single week.",
  },
];

/* -------------------------------------------------------------------------- */
/* The two of us                                                              */
/* -------------------------------------------------------------------------- */

export interface Founder {
  name: string;
  role: string;
  /** What they do on a project — the same for both of us, on purpose. */
  does: string;
  photo: ImageMetadata;
  /** The photo's silhouette, blurred once and saved, to stand behind it. */
  shadow: ImageMetadata;
}

/**
 * Left stroke, right stroke — the order the mark is drawn in. Two equal
 * co-founders doing the same job side by side: there's no split of roles to
 * show, and the matching captions say so.
 */
const BOTH = "Strategy, design, Webflow and launch — on every project.";

export const FOUNDERS: Founder[] = [
  {
    name: "Aleksandar Dumić",
    role: "Co-founder",
    does: BOTH,
    photo: aleksandar,
    shadow: aleksandarShadow,
  },
  {
    name: "Darko Milošević",
    role: "Co-founder",
    does: BOTH,
    photo: darko,
    shadow: darkoShadow,
  },
];

export interface CrewCard {
  title: [string, string];
  text: string;
  link: { label: string; href: string };
}

/** The three promises under the two of us. */
export const CREW_CARDS: CrewCard[] = [
  {
    title: ["Ideas become", "live sites"],
    text: "Strategy, design, build and launch — you take the credit.",
    link: { label: "Browse the work", href: "/work" },
  },
  {
    title: ["We go first,", "you get results"],
    text: "Every strategy is tested on our own site before it touches yours.",
    link: { label: "See all services", href: "/services" },
  },
  {
    title: ["Webflow natives,", "fiercely honest"],
    text: "If it won't work, we say so before the work starts.",
    link: { label: "Meet the studio", href: "/about" },
  },
];

/* -------------------------------------------------------------------------- */
/* Video stories                                                              */
/* -------------------------------------------------------------------------- */

export interface VideoStory {
  client: string;
  industry: string;
  name: string;
  /** Signed under the quote, the way a note would be. */
  initials: string;
  /** The quote, said plainly, then the part worth underlining. */
  quote: [string, string];
  /**
   * The film itself, once it's hosted on the studio's own Cloudinary.
   * Until then the card shows the still and the quote, with no play button.
   * TODO: add the Cloudinary URLs for both films.
   */
  video?: string;
  poster: ImageMetadata;
  logo: ImageMetadata;
}

/**
 * Recorded by the clients themselves. Quotes are transcribed as said; the one
 * edit, in brackets, stands in for the studio's name.
 */
export const VIDEO_STORIES: VideoStory[] = [
  {
    client: "Intaker",
    industry: "Legal tech",
    name: "Joseph Rudolo",
    initials: "J. R.",
    quote: [
      "Even without the price difference, ",
      "I would still have picked [us].",
    ],
    poster: josephPoster,
    logo: intakerLogo,
  },
  {
    client: "Ballerine",
    industry: "AI technology",
    name: "Or Moshkovitz",
    initials: "Or M.",
    quote: [
      "Like having a fully integrated core team, ",
      "from strategy to design to development.",
    ],
    poster: orPoster,
    logo: ballerineLogo,
  },
];
