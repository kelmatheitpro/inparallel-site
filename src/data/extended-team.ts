/**
 * Content for /extended-team — the page an agency lands on.
 *
 * The audience here is not a client but another agency: someone who has won
 * work and hasn't the hands for it. Every section is written against a fear
 * they arrive with — that you'll be busy when they need you, that you'll turn
 * up in front of their client, that they'll have to manage you.
 *
 * Kept out of the page for the same reason the home page's copy is: the words
 * change far more often than the layout does.
 */

/**
 * The figures that have to be true before this page goes anywhere.
 *
 * TODO: every value in this block is a placeholder. Rates decide whether an
 * agency writes to you at all — the doc is right that they can't send an
 * enquiry until they know whether you fit inside their margin — so these are
 * the first thing to fill in.
 */
export const DETAILS = {
  /** e.g. "Next opening: 6 October, one seat" */
  availability: "Next opening: TBC",
  /** Hours you overlap with them, as a range. */
  overlap: "9–17 CET",
  /** Shortest engagement you'll take. */
  minimum: "From one week",
  /** Weekly rate for one developer. */
  weeklyRate: "€X,XXX per developer, per week",
  /** Floor for fixed-scope work. */
  projectFrom: "Fixed scope from €X,XXX",
  /** The hour rate behind the bank-of-hours and small-change work. */
  hourly: "€XX per hour",
  /** Where the trial week is priced. */
  trialPrice: "€X,XXX for the week",
  /** Booking link for the closing CTA. */
  callHref: "https://cal.com/",
  /** The signed paperwork, ready to read before they ask. */
  ndaHref: "#",
  /** A Webflow project they can clone and open up. */
  cloneHref: "#",
} as const;

export const HERO_FACTS = [
  { value: DETAILS.availability, label: "availability" },
  { value: DETAILS.overlap, label: "working hours overlap" },
  { value: DETAILS.minimum, label: "minimum engagement" },
];

/** Three situations, written so an agency recognises itself in three seconds. */
export const SCENARIOS = [
  {
    title: "You won the pitch",
    text: "It ships in six weeks and everyone who could build it is already booked on something else.",
  },
  {
    title: "The work keeps coming",
    text: "Webflow projects arrive steadily — never quite enough to justify a full-time hire, always enough to hurt when you say no.",
  },
  {
    title: "Someone is out",
    text: "Your developer is leaving, on holiday or off sick. The deadlines carry on regardless.",
  },
];

/** The two ways most engagements run. */
export const MODELS = [
  {
    id: "capacity",
    name: "Capacity by the week",
    text: "Reserve one or two developers for a set number of weeks. We work in your tools, to your process, and you decide what we pick up each morning.",
    billing: "Billed weekly · one week minimum · a week's notice to stop",
  },
  {
    id: "fixed",
    name: "Fixed scope, as your subcontractor",
    text: "Send the brief and the deadline. You get a fixed price and a delivery date, and no management time on your side once it starts.",
    billing: "Billed per project · 50% to start, 50% on delivery",
  },
];

/** The table that settles which of the two to take. */
export const MODEL_TABLE = [
  {
    question: "When it fits",
    capacity: "The scope isn't settled and will move as the client reacts",
    fixed: "The brief is locked and you want it off your desk",
  },
  {
    question: "Who sets priorities",
    capacity: "You do, day to day",
    fixed: "We do, against the agreed scope",
  },
  {
    question: "How it's billed",
    capacity: "Weekly, per developer",
    fixed: "Per project, half up front",
  },
];

/** Everything else on the menu, for the shapes the two models don't cover. */
export const ARRANGEMENTS = [
  {
    name: "Bank of hours",
    text: "Buy 40 or 80 hours up front and spend them across three months. For the steady trickle of two-hour changes that never justifies a quote.",
  },
  {
    name: "Retained availability",
    text: "A small monthly fee for the right to call and have a developer within 48 hours. Unused, it turns into credit against work.",
  },
  {
    name: "Project rescue",
    text: "A fixed price to audit what you've inherited, then an estimate to fix it. For when a freelancer disappeared mid-build.",
  },
  {
    name: "White-label care plan",
    text: "You sell the care plan to your client and we run it. Recurring on both sides, and nobody has to think about it again.",
  },
  {
    name: "Priced by the unit",
    text: "Per template and per CMS collection instead of per hour. Five templates and two collections costs what it costs, with no call needed.",
  },
  {
    name: "Webflow lead for your team",
    text: "We don't build. We set the standard, review your team's work, write the conventions and bring your juniors up. A few hours a week.",
  },
  {
    name: "Automations only",
    text: "Make and n8n work on its own, separate from anything Webflow — for the client of yours who needs it when you don't do it.",
  },
  {
    name: "A day of training",
    text: "One workshop for your team on Client-First, CMS architecture or automation. Fixed price, one day.",
  },
];

/** Named, countable things — because "senior developers" means nothing. */
export const DELIVERABLES = [
  "Two named people, the same two for the whole engagement, with links to their profiles",
  "A guaranteed number of hours a week each, written as a number",
  "A replacement inside 48 hours if one of us is out of action",
  "A written standup every day, in your Slack",
  "Staging access from the first day, not at the end",
  "A Friday note: what shipped, what's blocked, what's next",
];

/** The section that says they won't have to train you. */
export const PROCESS_FIT = [
  "Your Slack, through Slack Connect. Not email.",
  "Your Jira, Linear, Asana or ClickUp. We don't bring tools with us.",
  "Your Webflow workspace and your Figma file — we're a seat you switch off when it's done.",
  "Your class naming convention if you have one, ours if you don't.",
  `${DETAILS.overlap} overlap, and a reply inside two hours in that window.`,
  "Onboarding is one 30-minute call plus access.",
];

/** The fear-killing list. Written flat, with nothing hedged. */
export const RULES = [
  "You sign the contract with the end client. We have no relationship with them.",
  "The site lives in your Webflow workspace. You own the project and the invoice.",
  "An NDA is signed before the first access, and we send it so you don't have to.",
  "Non-solicit: we don't contact your clients during the work or after it.",
  "We don't appear in a portfolio, on a website or on LinkedIn. Nowhere.",
  "All code and files are yours from day one. No licences, no conditions.",
  "We join a client call only if you ask us to, and then under your name.",
];

/** What separates this from the freelancer they last hired. */
export const STANDARD = [
  "Classes named by Client-First or your own system — never “div block 47”",
  "A CMS structure set up to grow, not hardcoded sections",
  "Checked on every breakpoint and on a real phone, not just Webflow preview",
  "Lighthouse over 90 on mobile, or the reason it can't be",
  "Semantic HTML, alt text, focus states, contrast",
  "Handover with a Loom walkthrough and a short structure document",
  "14 days of bug fixes after handover, not billed",
];

/** A quick scan for whether you cover their particular job. */
export const COVERAGE = [
  "Figma to Webflow",
  "CMS architecture",
  "Interactions & animation",
  "WordPress migration",
  "Framer migration",
  "Localisation",
  "Memberstack",
  "Stripe",
  "Webflow Logic",
  "Make & n8n",
  "CRM integrations",
  "GA4 & GTM",
  "Performance",
  "Accessibility",
];

export const PRICING = [
  {
    name: "Capacity by the week",
    price: DETAILS.weeklyRate,
    text: "One developer, full weeks, your priorities.",
  },
  {
    name: "Fixed scope",
    price: DETAILS.projectFrom,
    text: "Quoted against the brief, half up front.",
  },
  {
    name: "By the hour",
    price: DETAILS.hourly,
    text: "For a bank of hours and the small changes that follow a launch.",
  },
];

export const NOT_DOING = [
  "We don't do WordPress.",
  "We don't do branding or logos.",
  "We don't take engagements shorter than a week.",
  "We don't work with your client without you in the room.",
];

export const FAQ = [
  {
    question: "What if your developer disappears mid-project?",
    answer:
      "There are two of us on every engagement and a replacement inside 48 hours is part of the arrangement. The work lives in your workspace, so nothing walks out with anyone.",
  },
  {
    question: "Who carries it if the deadline slips?",
    answer:
      "On fixed scope, we do — the date is part of the price. On weekly capacity you're setting the priorities, so we flag the risk in the daily note the day we see it, not the week it lands.",
  },
  {
    question: "How and in what currency do we pay?",
    answer:
      "Bank transfer against an invoice from our company, in euros. TODO: confirm terms — net 14, net 30, or on delivery.",
  },
  {
    question: "Can we present you to the client as our team?",
    answer:
      "Yes. That's the point. We're invisible by default, and on a call only if you ask, under your name.",
  },
  {
    question: "What if we only need ten hours a week?",
    answer:
      "Then take a bank of hours rather than weekly capacity — you buy 40 or 80 and spend them as they come up over three months.",
  },
  {
    question: "Can we pause and pick it up again?",
    answer:
      "Yes, with a week's notice. Coming back depends on the calendar at the time, which is why the availability at the top of this page is kept current.",
  },
];
