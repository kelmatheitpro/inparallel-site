/**
 * Content for /upwork-extended-team — the page you send to a freelancer.
 *
 * Same trade as /extended-team, different reader. This one is one person on
 * Upwork with more work than hours, whose whole business is a review score and
 * a client list. Every guarantee here is about him keeping both.
 *
 * The page is not in the nav. It's a link you send.
 */

/**
 * TODO: placeholders, all of them. The doc is blunt about why the price has to
 * be on the page: he won't start a conversation without knowing whether you
 * fit inside his margin. Until these are real, don't send the link.
 */
export const DETAILS = {
  /** Currency and locale the calculator formats in. */
  currency: "EUR",
  locale: "en-IE",
  /** Turnaround on a quote. */
  quoteWithin: "24 hours",
  /** Smallest job you'll take, for the "what we don't do" line. */
  floor: "€X00",
  /** Where the closing form sends him. */
  briefHref: "/contact",
  /** Two builds he can clone and look inside. */
  cloneOne: "#",
  cloneTwo: "#",
} as const;

export const HERO_FACTS = [
  {
    value: `Fixed quote in ${DETAILS.quoteWithin}`,
    label: "no discovery call",
  },
  { value: "Your workspace", label: "your Webflow, your Figma" },
  { value: "NDA first", label: "signed before any access" },
];

/** The three that decide whether he keeps reading. Kept high on the page. */
export const GUARANTEES = [
  {
    title: "Your client stays yours",
    text: "No contact during the project, none after it. Non-solicit signed before we start.",
  },
  {
    title: "Your review stays yours",
    text: "You deliver, you communicate, you collect the feedback. The five stars have your name on them.",
  },
  {
    title: "We're invisible",
    text: "Not in a portfolio, not on a site, not on LinkedIn. There is no version of this where your client learns our name.",
  },
];

/** Four steps, each one showing how little is left on his side. */
export const STEPS = [
  {
    title: "Send the Figma and the deadline",
    text: "One link. No brief template, no discovery call.",
  },
  {
    title: `Get a fixed price and a date in ${DETAILS.quoteWithin}`,
    text: "Fixed means fixed. If we misjudged it, that's ours to carry.",
  },
  {
    title: "We build in your Webflow workspace",
    text: "You have staging access from the first day, not a reveal at the end.",
  },
  {
    title: "We hand it to you, you hand it to the client",
    text: "You never join a call unless you want to.",
  },
];

/**
 * The calculator's job types.
 *
 * `price` is what we charge you; `hours` is roughly what the job takes off your
 * calendar. Both feed the sum on the page, so a wrong number here is a wrong
 * promise there.
 */
export const JOB_TYPES = [
  { id: "landing", name: "Landing page", price: 0, hours: 20 },
  { id: "site", name: "5–10 page site", price: 0, hours: 60 },
  { id: "migration", name: "Migration to Webflow", price: 0, hours: 40 },
  { id: "hourly", name: "A week of hands", price: 0, hours: 40 },
];

export const PRICING_NOTE =
  "What you charge your client is none of our business. Our price doesn't change with it.";

/** The part nobody writes down and everybody wonders about. */
export const UPWORK_MECHANICS = [
  "You stay the contracted party on Upwork. We're not in that relationship at all.",
  "You pay us off-platform, against our invoice, like any other subcontractor.",
  "Upwork allows a support team behind a freelancer — you remain responsible for delivery.",
  "If you'd rather, add us to your Upwork agency and run it that way instead.",
];

export const MECHANICS_NOTE =
  "We're not your legal advisor, and we won't pretend to be. This is simply how everyone we work with does it.";

/** White-label work leaves no portfolio, so the proof has to be openable. */
export const PROOF = [
  "Client-First naming, or your own convention if you have one",
  "CMS structure built to grow, not hardcoded sections",
  "Lighthouse over 90 on mobile, or the reason it can't be",
  "Checked on a real phone, not only in Webflow preview",
  "Handover with a Loom walkthrough",
];

export const SITUATIONS = [
  {
    title: "The client said yes",
    text: "And you're booked solid for the next six weeks.",
  },
  {
    title: "The job is dull or repetitive",
    text: "Worth money, not worth your week, and you don't want to turn it down.",
  },
  {
    title: "You're going away",
    text: "The deadlines aren't.",
  },
];

export const NOT_DOING = [
  "No WordPress.",
  "No branding.",
  "We don't talk to your client.",
  `Nothing under ${DETAILS.floor}.`,
];

export const FAQ = [
  {
    question: "What if the client asks for changes after handover?",
    answer:
      "Bugs are ours for 14 days and not billed. New requests are quoted the same way as the first job — fixed price, fixed date.",
  },
  {
    question: "What if you miss the deadline?",
    answer:
      "The date is part of the fixed price, so a slip is ours to absorb. You'll know the day we see the risk, not the week it lands.",
  },
  {
    question: "Who's responsible if the site breaks in three months?",
    answer:
      "The build is yours and lives in your workspace. If something we built is at fault, we fix it. If the client changed it, we'll quote the repair.",
  },
  {
    question: "Can I give you only part of a project?",
    answer:
      "Yes. Most of it starts that way — one template, one CMS collection, the interactions nobody wants to do.",
  },
  {
    question: "Do you work in my Figma file or make your own?",
    answer:
      "Yours. We don't restructure it, and we ask before renaming anything.",
  },
  {
    question: "What if I need someone urgently on a Friday night?",
    answer:
      "Ask. If we're free we'll say yes, and if we're not we'll say so straight away rather than take it and be late.",
  },
];
