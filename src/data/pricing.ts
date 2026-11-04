/**
 * Content for /pricing — what each service costs and covers, how a fixed
 * price works, and the referral programme.
 *
 * Figures are the studio's published ones, in US dollars, written once here
 * as numbers and formatted wherever they show — the hero, the slider's
 * markers and the answers below all read the same value. Where a price
 * hasn't been set yet it is `null`, and the page prints a visible `TODO`
 * instead of a number, so a missing price can't go live looking like one.
 */
import { SERVICES_P, type Service } from "@/data/offer.ts";

const dollars = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

/** `$8,000`. */
export const usd = (value: number) => dollars.format(value);

/** `$8k` — the short form the slider writes its marks in. */
export const usdShort = (value: number) => `$${Math.round(value / 1000)}k`;

const service = (slug: string): Service => {
  const found = SERVICES_P.find((item) => item.slug === slug);
  if (!found) throw new Error(`No service "${slug}" in src/data/offer.ts`);
  return found;
};

/* -------------------------------------------------------------------------- */
/* Prices, per service                                                        */
/* -------------------------------------------------------------------------- */

export type Timeline =
  { kind: "weeks"; from: number; to: number } | { kind: "monthly" };

export interface PriceTier {
  service: Service;
  /** The "investment from" figure in USD; `null` until the studio sets it. */
  from: number | null;
  /** Retainers are priced by the month. */
  monthly: boolean;
  text: string;
  /** Six lines, shown as two columns of three on wide screens. */
  includes: string[];
  timeline: Timeline;
}

export const PRICE_TIERS: PriceTier[] = [
  {
    service: service("design-development"),
    from: 8000,
    monthly: false,
    text: "A focused launch site for teams that need to be live, fast, and still look senior.",
    includes: [
      "Positioning and sitemap",
      "Up to 5 designed pages",
      "SEO and speed basics",
      "Copy for every page",
      "Webflow build and CMS",
      "14 days of free fixes",
    ],
    /* The service page's week-by-week process; the old pricing table said 3
       to 5 weeks. */
    timeline: { kind: "weeks", from: 6, to: 8 },
  },
  {
    service: service("webflow-development"),
    from: 20000,
    monthly: false,
    text: "Your design, built in Webflow pixel for pixel, with a CMS your team can run from day one.",
    includes: [
      "Pixel-perfect build",
      "Scalable CMS setup",
      "Responsive layouts",
      "Interactions and motion",
      "Speed and SEO basics",
      "14 days of free fixes",
    ],
    /* The studio's own figure ("two to four weeks for most sites"); the old
       pricing table said 6 to 8. */
    timeline: { kind: "weeks", from: 2, to: 4 },
  },
  {
    service: service("seo-aeo"),
    /* TODO: the monthly price. The source page only ever had a placeholder. */
    from: null,
    monthly: true,
    text: "Technical SEO, content and AI answers that grow your rankings and citations every month.",
    includes: [
      "Technical SEO audit",
      "Keyword research",
      "AI answer optimisation",
      "On-page fixes",
      "Schema markup",
      "Monthly report",
    ],
    timeline: { kind: "monthly" },
  },
  {
    service: service("growth"),
    /* TODO: the monthly price. The source page only ever had a placeholder. */
    from: null,
    monthly: true,
    text: "A senior Webflow crew on your site every month — the same two people every time.",
    includes: [
      "New pages and sections",
      "Conversion upgrades",
      "Integrations and CMS",
      "Proactive ideas",
      "Unused hours roll over a month",
      "Monthly report",
    ],
    timeline: { kind: "monthly" },
  },
];

/**
 * The length of the timeline bar, in weeks. Not a promise — only the scale
 * the two project timelines are drawn against, so 6 to 8 weeks reads as
 * longer than 3 to 5 at a glance.
 */
export const TIMELINE_SCALE = 10;

export const timelineLabel = (timeline: Timeline) =>
  timeline.kind === "weeks"
    ? `${timeline.from} to ${timeline.to} weeks`
    : "Month to month";

const [designDev, webflowDev, seoAeo, growth] = PRICE_TIERS as [
  PriceTier,
  PriceTier,
  PriceTier,
  PriceTier,
];

/* -------------------------------------------------------------------------- */
/* How we compare                                                             */
/* -------------------------------------------------------------------------- */

export interface CompareRow {
  question: string;
  inHouse: string;
  agency: string;
  us: string;
}

export const COMPARE_COLUMNS = {
  inHouse: "In-house team",
  agency: "Traditional agency",
  us: "inParallel",
} as const;

export const COMPARE: CompareRow[] = [
  {
    question: "What you pay",
    inHouse: "Three salaries, plus benefits",
    agency: "A retainer, then change orders",
    /* The source page had a copy slip in this cell (it repeated the agency
       column's "A team shared across clients"); this is the page's own
       headline in its place. */
    us: "One price, agreed up front",
  },
  {
    question: "Time to start",
    inHouse: "3 to 6 months of hiring",
    agency: "4 to 8 weeks of pitching",
    us: "Within two weeks",
  },
  {
    question: "Who does the work",
    inHouse: "Whoever you manage to hire",
    agency: "A team shared across clients",
    us: "A senior crew, named on day one",
  },
  {
    question: "Webflow depth",
    inHouse: "Depends on the hire",
    agency: "One platform of many",
    us: "Webflow specialists, certified partner",
  },
  {
    question: "After launch",
    inHouse: "Ongoing",
    agency: "A new contract",
    us: "Growth, the week after launch",
  },
  {
    question: "Response time",
    inHouse: "Same day",
    agency: "Days to weeks",
    us: "Same week, usually same day",
  },
  {
    question: "If someone leaves",
    inHouse: "You start hiring again",
    agency: "The team rotates",
    us: "Documented, nothing stops",
  },
];

/* -------------------------------------------------------------------------- */
/* One price, everything on it                                                */
/* -------------------------------------------------------------------------- */

/** Which receipt line a promise answers for — hovering one lights the other. */
export type ReceiptKey = "crew" | "changes" | "meter";

export interface PricePromise {
  key: ReceiptKey;
  title: string;
  text: string;
}

export const PROMISES: PricePromise[] = [
  {
    key: "meter",
    title: "No meter running",
    text: "We do not track hours, so you never pay for the time we spend on calls with you.",
  },
  {
    key: "changes",
    title: "Changes, said out loud",
    text: "If the scope moves, you hear what it costs the same week, before anything is added.",
  },
  {
    key: "crew",
    title: "The crew you met",
    text: "The people on the first call are the people who ship your site. No hand-off to a junior team.",
  },
];

export interface ReceiptLine {
  label: string;
  value: string;
  /** A line that costs nothing extra — `$0`, `None` — set in the accent. */
  free?: boolean;
  key?: ReceiptKey;
}

export interface Receipt {
  title: string;
  meta: string;
  /** Lines in groups, a dashed rule between each group. */
  groups: ReceiptLine[][];
  total: readonly [string, string];
  thanks: string;
}

export const RECEIPT: Receipt = {
  title: "Webflow Development",
  meta: "Fixed price",
  groups: [
    [
      { label: "Discovery and positioning", value: "Included" },
      { label: "Messaging and full copy", value: "Included" },
      { label: "Up to 12 unique layouts", value: "Included" },
      { label: "Webflow build and CMS", value: "Included" },
      { label: "SEO, speed and QA", value: "Included" },
      { label: "Recorded handover", value: "Included" },
    ],
    [
      { label: "Project management", value: "Included", key: "crew" },
      { label: "Change orders", value: "$0", free: true, key: "changes" },
      { label: "Hourly tracking", value: "None", free: true, key: "meter" },
      { label: "Surprise invoices", value: "None", free: true },
    ],
  ],
  total: ["One number,", "agreed on the first call"],
  thanks: "Thank you for building with inParallel",
};

/* -------------------------------------------------------------------------- */
/* Referrals                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * TODO: the programme as the source page ran it. Confirm the studio runs the
 * same one — the share, the alternative and when it's paid — before launch.
 */
export const REFERRAL = {
  /** Of the referred client's first project. */
  share: 0.1,
  min: 5000,
  max: 50000,
  step: 1000,
  start: 40000,
};

/** Where each project service starts, marked under the slider. */
export const REFERRAL_MARKS = PRICE_TIERS.flatMap((tier) =>
  tier.from !== null && !tier.monthly
    ? [{ at: tier.from, name: tier.service.name }]
    : [],
);

/* -------------------------------------------------------------------------- */
/* Questions                                                                  */
/* -------------------------------------------------------------------------- */

export interface Question {
  question: string;
  /** `null` while the answer is still to be written. */
  answer: string | null;
  /** What the owner still has to supply, shown as a visible TODO. */
  todo?: string;
}

/**
 * The six questions every service page asks. The source wrote only the first
 * answer; the next four are put together from what this page already states
 * (prices, timelines, what each service includes) and the delivery steps the
 * service pages describe — confirm them. The last one has nothing to stand on
 * yet, so it stays a TODO.
 */
export const FAQ: Question[] = [
  {
    question: "What if we already have a brand?",
    answer:
      "Then we use it. Art direction becomes a shorter step, we apply what you already have to real pages instead of inventing a new world, and the time saved goes back into design and build.",
  },
  {
    question: "Who writes the copy?",
    answer: `We do, with you. Copy for every page is part of a ${designDev.service.name} project: the look and every word on the page, written with you.`,
  },
  {
    question: "How long does it actually take?",
    answer: `${designDev.service.name} takes ${timelineLabel(designDev.timeline)}, and ${webflowDev.service.name} ${timelineLabel(webflowDev.timeline)}. ${seoAeo.service.name} and ${growth.service.name} run month to month.`,
  },
  {
    question: "What does it cost?",
    answer: `${designDev.service.name} starts at ${usd(designDev.from ?? 0)} and ${webflowDev.service.name} at ${usd(webflowDev.from ?? 0)}; ${seoAeo.service.name} and ${growth.service.name} are priced by the month. Whichever you pick, you get one fixed number after the first call, and if the scope moves, you hear what it costs the same week, before anything is added.`,
    todo: `price — the monthly figures for ${seoAeo.service.name} and ${growth.service.name}`,
  },
  {
    question: "What happens after launch?",
    answer: `We take it live, and the first 14 days of fixes are on us. After that, ${growth.service.name} keeps the site shipping, with new pages, experiments and releases every month.`,
  },
  {
    question: "Can you work with our developers?",
    answer: null,
    todo: "answer — the source never wrote one",
  },
];
