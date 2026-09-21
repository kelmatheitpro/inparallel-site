/**
 * Content for the home page.
 *
 * Kept out of the section components so copy can be edited — or swapped for a
 * CMS fetch — without touching layout.
 */

import type { ImageMetadata } from "astro";

import veyor from "@/assets/inparallel/logos/veyor.svg";
import shiftolic from "@/assets/inparallel/logos/shiftolic.svg";
import intaker from "@/assets/inparallel/logos/intaker.svg";
import harper from "@/assets/inparallel/logos/harper.svg";
import hypersonix from "@/assets/inparallel/logos/hypersonix.svg";
import ballerineTile from "@/assets/inparallel/logos/ballerine-tile.svg";
import sustain from "@/assets/inparallel/logos/sustain.svg";
import testimonial1 from "@/assets/inparallel/testimonial-1.png";
import testimonial2 from "@/assets/inparallel/testimonial-2.png";
import belgrade from "@/assets/inparallel/belgrade.png";
import worldwide from "@/assets/inparallel/worldwide.png";

/* -------------------------------------------------------------------------- */
/* Trusted by                                                                  */
/* -------------------------------------------------------------------------- */

export interface ClientLogo {
  name: string;
  logo: ImageMetadata;
  /** Natural aspect ratio of the artwork, so each tile reserves the right box. */
  ratio: number;
}

export const CLIENT_LOGOS: ClientLogo[] = [
  { name: "Veyor", logo: veyor, ratio: 137 / 38 },
  { name: "Shiftolic", logo: shiftolic, ratio: 1298 / 250 },
  { name: "Intaker", logo: intaker, ratio: 115.2 / 24 },
  { name: "Harper", logo: harper, ratio: 3.921 },
  { name: "Hypersonix", logo: hypersonix, ratio: 6.051 },
  { name: "Ballerine", logo: ballerineTile, ratio: 4.256 },
  { name: "Sustain Commercial Solar", logo: sustain, ratio: 2.312 },
];

/* -------------------------------------------------------------------------- */
/* Case studies                                                                */
/* -------------------------------------------------------------------------- */

export interface CaseStudy {
  client: string;
  industry: string;
  /** Headline, split into the stated half and the faded half. */
  headline: string;
  headlineMuted: string;
  stat: string;
  statLabel: string;
  href: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    client: "Ballerine",
    industry: "AI technology",
    headline: "How inparallel rebuilt compliance",
    headlineMuted: "into a site the marketing team runs alone.",
    stat: "+214%",
    statLabel: "demo requests after relaunch",
    href: "#work",
  },
  {
    client: "Shiftolic",
    industry: "Healthcare",
    headline: "From first call to a live healthcare brand",
    headlineMuted: "in a single sprint",
    stat: "14 days",
    statLabel: "kickoff to launch",
    href: "#work",
  },
];

/* -------------------------------------------------------------------------- */
/* Video testimonials                                                          */
/* -------------------------------------------------------------------------- */

export interface VideoTestimonial {
  poster: ImageMetadata;
  /** Point this at a real file to make the play button start a video. */
  video?: string;
  stat: string;
  statLabel: string;
  quote: string;
  role: string;
  client: string;
  industry: string;
}

export const VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    poster: testimonial1,
    stat: "+214%",
    statLabel: "demo requests",
    quote:
      "With inparallel we finally have a site our own team can run. The honest feedback stung for a day — then it outperformed everything.",
    role: "Marketing Director",
    client: "Ballerine",
    industry: "AI technology",
  },
  {
    poster: testimonial2,
    stat: "14 days",
    statLabel: "first call to live",
    quote:
      "Fourteen days. Brand, copy, site, live. I've waited longer for a proposal from other agencies.",
    role: "CEO",
    client: "Shiftolic",
    industry: "Healthcare",
  },
];

/* -------------------------------------------------------------------------- */
/* Services                                                                    */
/* -------------------------------------------------------------------------- */

export interface Service {
  id: string;
  label: string;
  headline: string;
  headlineSecond: string;
  text: string;
  tags: string[];
  ctaLabel: string;
  href: string;
}

export const SERVICES: Service[] = [
  {
    id: "design",
    label: "inparallelDesign",
    headline: "A site designed to sell,",
    headlineSecond: "not to win awards",
    text: "Strategy, copy and interface design in Figma — laid out on a component system your own developer can build from without guessing what you meant.",
    tags: ["UX & wireframes", "art direction", "UX copy", "Figma components"],
    ctaLabel: "Explore inparallelDesign",
    href: "/contact",
  },
  {
    id: "build",
    label: "inparallelBuild",
    headline: "Your design, built in",
    headlineSecond: "Webflow that lasts",
    text: "You bring the brand and the design. We build it in Webflow your marketing team can edit without a developer in the loop.",
    tags: ["Webflow build", "CMS architecture", "design QA", "team handover"],
    ctaLabel: "Explore inparallelBuild",
    href: "/contact",
  },
  {
    id: "launch",
    label: "inparallelLaunch",
    headline: "Built, launched and handed over,",
    headlineSecond: "with nothing left hanging",
    text: "The build plus everything that turns it into a launch day: migration and redirects, analytics, QA on real devices, and a team that can run the site from the first morning.",
    tags: [
      "Webflow build",
      "migration & redirects",
      "QA & performance",
      "launch plan",
    ],
    ctaLabel: "Explore inparallelLaunch",
    href: "/contact",
  },
  {
    id: "plus",
    label: "inparallel+",
    headline: "Launch is day one,",
    headlineSecond: "not the finish line",
    text: "Design, build and launch, then a retained crew shipping new pages, experiments and releases every week — the work that turns a launch into a growth channel.",
    tags: ["design & build", "new pages", "CRO & experiments", "reporting"],
    ctaLabel: "Explore inparallel+",
    href: "/contact",
  },
];

/* -------------------------------------------------------------------------- */
/* How the work runs                                                           */
/* -------------------------------------------------------------------------- */

export interface ProcessStep {
  title: string;
  text: string;
}

export const PROCESS: ProcessStep[] = [
  {
    title: "A call, not a questionnaire",
    text: "Thirty minutes with the people who would do the work. You leave knowing whether we are the right studio for this, including when we are not.",
  },
  {
    title: "A scope you can argue with",
    text: "One page: what ships, what does not, what it costs and when. Everything we cut is written down so nobody discovers it in week five.",
  },
  {
    title: "A staging link every week",
    text: "Progress you can click rather than a status meeting. Real pages, real content, from the first week to the last.",
  },
  {
    title: "Handover, then growth",
    text: "We hand over a site your team can run, and stay on only if there is work worth staying for. Most clients move onto inparallel+.",
  },
];

/* -------------------------------------------------------------------------- */
/* Ways we differ                                                              */
/* -------------------------------------------------------------------------- */

export interface Differentiator {
  /** Which inline icon to draw. See `WaysWeDiffer.astro`. */
  icon: "target" | "crew" | "grid" | "chart" | "star";
  title: string;
  text: string;
}

export const DIFFERENTIATORS: Differentiator[] = [
  {
    icon: "target",
    title: "Radical condor",
    text: "If it won't work, we say so — before the work starts, not after the invoice. Some clients hear no from us more than from their own board.",
  },
  {
    icon: "crew",
    title: "One senior crew",
    text: "The people who pitch are the people who design, build and ship. No juniors learning on your budget, no account managers in between.",
  },
  {
    icon: "grid",
    title: "Webflow natives",
    text: "Your team edits copy, pages and SEO without a developer in the loop. We hand over a site you own, not one you rent from us.",
  },
  {
    icon: "chart",
    title: "Launch is day one",
    text: "The site keeps shipping after go-live — new pages, experiments, releases. Our best numbers all happened months after launch.",
  },
  {
    icon: "star",
    title: "Zero theatre",
    text: "No decks about decks. Progress you can click, every single week — a staging link beats a status meeting.",
  },
];

/* -------------------------------------------------------------------------- */
/* Studio cards                                                                */
/* -------------------------------------------------------------------------- */

export interface StudioCard {
  title: string;
  text: string;
  linkLabel: string;
  href: string;
}

export const STUDIO_CARDS: StudioCard[] = [
  {
    title: "Six people. Zero layers.",
    text: "Design, copy, build and growth sit at the same table — yours. The people you meet on the first call are the people who ship.",
    linkLabel: "Meet the studio",
    href: "/about",
  },
  {
    title: "Based in Belgrade. Building worldwide.",
    text: "Our clients run from EU healthcare to US legal tech. Same honesty, wherever you are.",
    linkLabel: "See the work",
    href: "/work",
  },
];

/* -------------------------------------------------------------------------- */
/* Written reviews                                                             */
/* -------------------------------------------------------------------------- */

export interface Review {
  id: string;
  client: string;
  quote: string;
  role: string;
  industry: string;
}

export const REVIEWS: Review[] = [
  {
    id: "shiftolic",
    client: "Shiftolic",
    quote:
      "Fourteen days from first call to a live healthcare brand. They said the timeline out loud on day one and then simply hit it.",
    role: "CEO",
    industry: "Healthcare",
  },
  {
    id: "ballerine",
    client: "Ballerine",
    quote:
      "The honest feedback stung for about a day. Then the new site outperformed the old one in every metric we track.",
    role: "Marketing Director",
    industry: "AI technology",
  },
  {
    id: "pythagora",
    client: "Pythagora",
    quote:
      "They pushed back on half our brief and were right about most of it. The site ships new pages weekly now, without us filing a ticket.",
    role: "Head of Growth",
    industry: "Developer tools",
  },
  {
    id: "intaker",
    client: "Intaker",
    quote:
      "We own the site outright. Our marketing team edits pages, launches campaigns and never waits on a developer to do it.",
    role: "VP Marketing",
    industry: "Legal tech",
  },
  {
    id: "veyor",
    client: "Veyor",
    quote:
      "No decks about decks. Every week there was a staging link with something new on it, right through to launch and past it.",
    role: "Founder",
    industry: "Construction software",
  },
];

/* -------------------------------------------------------------------------- */
/* Footer                                                                      */
/* -------------------------------------------------------------------------- */

export interface LocationCard {
  title: string;
  text: string;
  image: ImageMetadata;
}

export const LOCATIONS: LocationCard[] = [
  {
    title: "Belgrade — HQ",
    text: "Serbia · CET working hours",
    image: belgrade,
  },
  {
    title: "Worldwide — remote",
    text: "EU & US time zones, covered",
    image: worldwide,
  },
];

export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: "Pages",
    links: [
      { label: "Work", href: "/work" },
      { label: "Services", href: "/services" },
      { label: "Why inparallel", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Services",
    links: [
      { label: "inparallelDesign", href: "/services#services" },
      { label: "inparallelBuild", href: "/services#services" },
      { label: "inparallelLaunch", href: "/services#services" },
      { label: "inparallel+", href: "/services#services" },
      { label: "Extended team", href: "/extended-team" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About the studio", href: "/about" },
      { label: "Careers", href: "/contact" },
      { label: "Contact", href: "/contact" },
      {
        label: "hello@inparallel.agency",
        href: "mailto:hello@inparallel.agency",
      },
    ],
  },
];

export interface SocialLink {
  label: string;
  href: string;
  icon: "linkedin" | "instagram" | "x" | "dribbble";
}

export const SOCIALS: SocialLink[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/", icon: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
  { label: "X", href: "https://x.com/", icon: "x" },
  { label: "Dribbble", href: "https://dribbble.com/", icon: "dribbble" },
];
