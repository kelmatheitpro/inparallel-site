/**
 * Content for the services page.
 *
 * The page argues in four different shapes on purpose — a strip that moves, a
 * sum the reader does himself, a table, a flow diagram — because a page that
 * states nine things in nine identical card grids stops being read around the
 * third. Each block below is the content for one of those shapes.
 *
 * TODO: prices. Every figure in the estimator is a placeholder, and a `0` is
 * treated as unset and renders as a dash rather than as free, so the page stays
 * honest until the real numbers land. Timelines are real and work today.
 */

/* -------------------------------------------------------------------------- */
/* Hero                                                                        */
/* -------------------------------------------------------------------------- */

export const HERO = {
  eyebrow: "Webflow development & automation",
  /** Stated half, then the half the design fades. */
  title: "Webflow sites, built properly",
  titleMuted: "the first time.",
  lead: "We're a two-person Webflow studio. We turn your designs into fast, maintainable sites, move you off platforms you've outgrown, and keep everything running after launch.",
  cta: { label: "Get a fixed quote in 24h", href: "/contact" },
  secondary: { label: "See our work", href: "/work" },
};

/* -------------------------------------------------------------------------- */
/* Navigator proof                                                             */
/*                                                                             */
/* The hero's artwork is the argument rather than decoration: anyone who has    */
/* opened a Webflow project knows which of these two trees they inherited, and  */
/* no adjective does that work as quickly.                                      */
/* -------------------------------------------------------------------------- */

export interface NavigatorNode {
  /** Indent level in the tree, 0-based. */
  depth: number;
  label: string;
}

export const NAVIGATOR_MESSY: NavigatorNode[] = [
  { depth: 0, label: "Body" },
  { depth: 1, label: "Div Block 12" },
  { depth: 2, label: "Div Block 13" },
  { depth: 3, label: "Heading 4" },
  { depth: 3, label: "Div Block 47" },
  { depth: 4, label: "Link Block 3" },
  { depth: 2, label: "Div Block 48" },
];

export const NAVIGATOR_CLEAN: NavigatorNode[] = [
  { depth: 0, label: "Body" },
  { depth: 1, label: "page-wrapper" },
  { depth: 2, label: "section_hero" },
  { depth: 3, label: "padding-global" },
  { depth: 4, label: "container-large" },
  { depth: 5, label: "hero_content" },
  { depth: 6, label: "button-group" },
];

export const NAVIGATOR_CAPTION =
  "The same page, two ways. One of them your team can edit next year.";

/* -------------------------------------------------------------------------- */
/* Proof strip                                                                 */
/*                                                                             */
/* Guarantees rather than counts: we would rather repeat four things we can     */
/* hold to than publish a project total that flatters nobody.                   */
/* -------------------------------------------------------------------------- */

export const PROOF_ITEMS: string[] = [
  "Fixed price",
  "A quote within 24 hours",
  "You own everything",
  "14 days of free fixes",
  "Built in your Webflow workspace",
];

/* -------------------------------------------------------------------------- */
/* The four lanes                                                              */
/* -------------------------------------------------------------------------- */

export interface Lane {
  id: string;
  name: string;
  promise: string;
  /** The self-selection test. Two lines, written as the reader's situation. */
  forYou: string[];
  whatYouGet: string[];
  /** Calendar time, written the way it is quoted. */
  timing: string;
  ctaLabel: string;
  href: string;
  /** The retainer is the work worth winning, so the design says so. */
  featured?: boolean;
  note?: string;
}

export const LANES: Lane[] = [
  {
    id: "design",
    name: "inparallelDesign",
    promise: "You need the design and the copy before anything gets built.",
    forYou: [
      "You have a brand but nothing drawn, and no one to write the words.",
      "Your last site was designed by whoever was free that week.",
    ],
    whatYouGet: [
      "UX, wireframes and art direction",
      "UX copy written with the design, not bolted on after",
      "A Figma component system your developer can build from",
      "Every breakpoint drawn, not left to interpretation",
      "A build estimate from the people who would build it",
    ],
    timing: "1–3 weeks",
    ctaLabel: "Start with Design",
    href: "/services/design",
  },
  {
    id: "build",
    name: "inparallelBuild",
    promise: "You have the design. We build the site.",
    forYou: [
      "Your Figma is final and you need it live in Webflow.",
      "You need a CMS your team can update without calling a developer.",
    ],
    whatYouGet: [
      "Pixel-accurate build across every breakpoint",
      "CMS structured around how your content will grow",
      "Interactions that stay smooth on mid-range phones",
      "Technical SEO: meta, schema, sitemap, Open Graph",
      "90+ mobile Lighthouse score",
      "CMS training and a recorded walkthrough",
    ],
    timing: "2–4 weeks",
    ctaLabel: "Start a Build",
    href: "/services/build",
  },
  {
    id: "launch",
    name: "inparallelLaunch",
    promise: "You have a site. We get it live, properly.",
    forYou: [
      "You're moving from WordPress, Framer, Wix or Squarespace.",
      "Your Webflow site is 80% done and has been stuck for weeks.",
    ],
    whatYouGet: [
      "Content migration, including CMS collections and assets",
      "301 redirect map so you keep your search rankings",
      "Domain, DNS and SSL setup",
      "GA4, Search Console and tracking",
      "Speed and accessibility pass before go-live",
      "Launch-day monitoring and fixes",
    ],
    timing: "3–10 days",
    ctaLabel: "Plan a Launch",
    href: "/services/launch",
  },
  {
    id: "plus",
    name: "inparallel+",
    promise: "We build it, launch it, and stay on.",
    forYou: [
      "Your website is a growth channel, not a brochure.",
      "You want a Webflow team without hiring one.",
    ],
    whatYouGet: [
      "Everything in Build and Launch",
      "Monthly hours for new pages, sections and changes",
      "Automations: forms to CRM, alerts, content workflows",
      "Conversion improvements and A/B tests",
      "A monthly report on what changed and what moved",
      "A reply within one business day",
    ],
    timing: "Monthly",
    ctaLabel: "Talk about Plus",
    href: "/services/plus",
    featured: true,
    note: "We take on a limited number of Plus clients at a time.",
  },
];

/* -------------------------------------------------------------------------- */
/* Comparison                                                                  */
/*                                                                             */
/* The one section people actually read when they are stuck between two         */
/* packages, so it states every row for every lane rather than implying some.   */
/* -------------------------------------------------------------------------- */

/** `true` included · `false` not in this lane · a string qualifies it. */
export type Cell = boolean | string;

export interface ComparisonRow {
  label: string;
  /** In the order of `LANES`. */
  cells: [Cell, Cell, Cell, Cell];
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  { label: "UX & interface design", cells: [true, false, false, true] },
  { label: "UX copywriting", cells: [true, false, false, "add-on"] },
  { label: "Webflow build", cells: [false, true, "finish only", true] },
  { label: "CMS setup", cells: ["structure only", true, true, true] },
  {
    label: "Migration from another platform",
    cells: [false, "add-on", true, true],
  },
  { label: "Redirects & SEO setup", cells: [false, true, true, true] },
  { label: "Analytics setup", cells: [false, "add-on", true, true] },
  { label: "Automations", cells: [false, "add-on", "add-on", true] },
  { label: "Ongoing changes", cells: [false, false, false, true] },
  { label: "Monthly reporting", cells: [false, false, false, true] },
  { label: "Priority support", cells: [false, false, false, true] },
];

/* -------------------------------------------------------------------------- */
/* Automations                                                                 */
/* -------------------------------------------------------------------------- */

export interface Flow {
  title: string;
  text: string;
  /** Drawn as a chain, so the reader sees the shape before reading it. */
  steps: string[];
}

export const AUTOMATION_LEAD =
  "Most sites collect a lead and then someone copies it into a spreadsheet. We connect your site to the tools your team already uses, so work moves without anyone touching it.";

export const FLOWS: Flow[] = [
  {
    title: "Lead routing",
    text: "A form submission reaches your CRM, gets enriched, and pings the right person before they've closed the tab.",
    steps: ["Form", "Enrich", "CRM", "Slack"],
  },
  {
    title: "Content from anywhere",
    text: "Your CMS updates itself from the sheet or base your team already keeps, instead of being typed twice.",
    steps: ["Airtable", "Sync", "Webflow CMS"],
  },
  {
    title: "Client onboarding",
    text: "A signed proposal creates the project, the folder, the invoice and the welcome email.",
    steps: ["Signed", "Project", "Invoice", "Email"],
  },
  {
    title: "Reporting",
    text: "Weekly traffic and lead numbers land in your inbox without anyone building a report.",
    steps: ["GA4", "Digest", "Inbox"],
  },
];

export const AUTOMATION_TOOLS: string[] = [
  "Make",
  "n8n",
  "Zapier",
  "Airtable",
  "HubSpot",
  "Slack",
];

export const AUTOMATION_NOTE =
  "Available as an add-on to any package, or on its own.";

/* -------------------------------------------------------------------------- */
/* Always included                                                             */
/* -------------------------------------------------------------------------- */

export const ALWAYS_INCLUDED: { title: string; text: string }[] = [
  {
    title: "You own it",
    text: "The site lives in your Webflow workspace from day one. Not ours, not rented back to you.",
  },
  {
    title: "Clean build",
    text: "Client-First class naming. No “div block 47” waiting for whoever comes next.",
  },
  {
    title: "Tested on real devices",
    text: "Not just the Webflow preview. Mid-range Android included, because that is what your visitors carry.",
  },
  {
    title: "Accessible by default",
    text: "Contrast, focus states, alt text, semantic HTML — decided during the build, not audited after it.",
  },
  {
    title: "14 days of fixes, free",
    text: "Bugs after handoff are ours. You don't open a ticket for something we got wrong.",
  },
  {
    title: "Documented and recorded",
    text: "A walkthrough of your CMS you can replay, and notes for the person who joins next year.",
  },
];

/* -------------------------------------------------------------------------- */
/* Process                                                                     */
/* -------------------------------------------------------------------------- */

export interface Step {
  title: string;
  text: string;
  /** What actually lands in the client's hands at this step. */
  output: string;
  /** The work inside the step, named. A step nobody can itemise is a meeting. */
  deliverables: string[];
}

export const STEPS: Step[] = [
  {
    title: "Brief",
    text: "Send a Figma link or your current site. If we need more than that, it's a 20-minute call — not a questionnaire.",
    output: "A call, or nothing at all",
    deliverables: ["Design review", "Scope questions", "Feasibility check"],
  },
  {
    title: "Fixed quote",
    text: "Price, scope and launch date within 24 hours. What ships and what does not is written down, so nobody discovers a cut in week five.",
    output: "One page you can argue with",
    deliverables: ["Fixed price", "Launch date", "What ships", "What does not"],
  },
  {
    title: "Build",
    text: "You get a staging link on day one and watch it come together. Progress you can click beats a status meeting.",
    output: "A link, updated all week",
    deliverables: [
      "Component library",
      "CMS architecture",
      "Responsive build",
      "Device QA",
    ],
  },
  {
    title: "Handoff",
    text: "Training, documentation and 14 days of support. Then it's yours, in your workspace, with nothing left hanging.",
    output: "The keys, and the manual",
    deliverables: [
      "CMS training",
      "Recorded walkthrough",
      "Written notes",
      "14 days of fixes",
    ],
  },
];

/* -------------------------------------------------------------------------- */
/* What we believe                                                             */
/*                                                                             */
/* Beginners describe what they do; the section that positions us is the one    */
/* with opinions in it.                                                        */
/* -------------------------------------------------------------------------- */

export const BELIEFS: { title: string; text: string }[] = [
  {
    title: "Design the CMS before the pages",
    text: "Most Webflow sites get rebuilt within a year because the content structure was an afterthought. We plan collections first, so the site grows instead of breaking.",
  },
  {
    title: "Speed is a design decision",
    text: "You can't optimise a heavy site at the end. We make performance calls during the build, not after the complaints.",
  },
  {
    title: "If your team can't edit it, it isn't finished",
    text: "A site that needs a developer for every text change is a liability. We build for the person who will maintain it, not for the screenshot.",
  },
  {
    title: "Animation should explain, not decorate",
    text: "Every interaction has to earn its place. If it slows the page or distracts from the message, it goes.",
  },
];

/* -------------------------------------------------------------------------- */
/* The two of us                                                               */
/*                                                                             */
/* TODO: names are ours, photographs are not in the repo yet. Import them here  */
/* the way `about.ts` does and the section will use them.                      */
/* -------------------------------------------------------------------------- */

export const TEAM_LEAD =
  "No account managers, no handoffs to juniors, no one relaying messages. Two people, working directly with you from brief to launch.";

export const TEAM: {
  name: string;
  role: string;
  text: string;
  href: string;
}[] = [
  {
    name: "Darko",
    role: "Design & Webflow build",
    text: "Takes the design from wireframe to a site your team can run, and argues with the brief where it needs arguing.",
    href: "https://www.linkedin.com/",
  },
  {
    name: "Aleksandar",
    role: "Development & automation",
    text: "Handles migrations, integrations and everything that has to keep working after launch day.",
    href: "https://www.linkedin.com/",
  },
];

/* -------------------------------------------------------------------------- */
/* What we don't do                                                            */
/* -------------------------------------------------------------------------- */

export const DONT_DO: string[] = [
  "WordPress, Framer or custom-coded sites",
  "Logo design and brand identity",
  "Sites without a design, unless we agree on a design partner first",
  "Work we can't quote a fixed price for",
];

export const DONT_DO_NOTE =
  "Saying no to these is how we stay good at the rest.";

/* -------------------------------------------------------------------------- */
/* FAQ                                                                         */
/* -------------------------------------------------------------------------- */

export const FAQ: { question: string; answer: string }[] = [
  {
    question: "How long does a project take?",
    answer:
      "A build takes 2–4 weeks and a launch 3–10 days. You get an exact date with your quote, and the date is part of the fixed price — so a slip is ours to absorb.",
  },
  {
    question: "What do you need from me to start?",
    answer:
      "A Figma file or your current site, and a deadline. We'll ask for anything else we need rather than sending you a form to fill in.",
  },
  {
    question: "What if I don't have a design yet?",
    answer:
      "Then you want inparallelDesign, or we bring in a design partner. If speed matters more than polish we can build from a solid wireframe instead.",
  },
  {
    question: "Do you work in my Webflow account?",
    answer:
      "Yes. Everything lives in your workspace from the first day, so the site is yours whether or not you keep working with us.",
  },
  {
    question: "What happens after handoff?",
    answer:
      "14 days of free fixes. After that you can move to inparallel+, or just reach out when something comes up.",
  },
  {
    question: "How does payment work?",
    answer: "50% to start, 50% on launch. inparallel+ is billed monthly.",
  },
];

/* -------------------------------------------------------------------------- */
/* Closing                                                                     */
/* -------------------------------------------------------------------------- */

export const CLOSING = {
  title: "Send us what you have.",
  titleMuted: "A quote lands within 24 hours.",
  lead: "A Figma link, a live site, or a rough idea on a call. Whichever it is, you get a price and a date — not a proposal deck.",
  cta: { label: "Get a fixed quote in 24h", href: "/contact" },
  aside: {
    text: "Running an agency and need more hands?",
    label: "See extended team",
    href: "/extended-team",
  },
};

/* -------------------------------------------------------------------------- */
/* Estimator                                                                   */
/* -------------------------------------------------------------------------- */

export interface QuotePackage {
  id: string;
  /** Matches the `id` in `LANES` so the two can be cross-linked. */
  name: string;
  /** One line under the picker, so the choice explains itself. */
  summary: string;
  /** Price for the base scope. `0` until we set it. */
  base: number;
  /** `project` prices once; `month` is a retainer and hides the scope inputs. */
  unit: "project" | "month";
  /** Scope the base price already covers. */
  pagesIncluded: number;
  collectionsIncluded: number;
  /** Calendar days for the base scope, as a range. */
  days: [number, number];
  includes: string[];
}

export const QUOTE_PACKAGES: QuotePackage[] = LANES.map((lane) => {
  const shape: Record<
    string,
    Pick<
      QuotePackage,
      "summary" | "unit" | "pagesIncluded" | "collectionsIncluded" | "days"
    >
  > = {
    design: {
      summary: lane.promise,
      unit: "project",
      pagesIncluded: 5,
      collectionsIncluded: 0,
      days: [7, 21],
    },
    build: {
      summary: lane.promise,
      unit: "project",
      pagesIncluded: 5,
      collectionsIncluded: 2,
      days: [14, 28],
    },
    launch: {
      summary: lane.promise,
      unit: "project",
      pagesIncluded: 10,
      collectionsIncluded: 3,
      days: [3, 10],
    },
    plus: {
      summary: lane.promise,
      unit: "month",
      pagesIncluded: 0,
      collectionsIncluded: 0,
      days: [0, 0],
    },
  };

  return {
    id: lane.id,
    name: lane.name,
    base: 0,
    includes: lane.whatYouGet,
    ...shape[lane.id]!,
  };
});

export interface QuoteAddOn {
  id: string;
  label: string;
  /** The line under the checkbox. Says what it buys, not what it is. */
  note: string;
  price: number;
  /** Calendar days this adds to both ends of the range. */
  days: number;
}

export const QUOTE_ADDONS: QuoteAddOn[] = [
  {
    id: "migration",
    label: "Migrating from another platform",
    note: "WordPress, Framer, Wix or Squarespace — content, assets and redirects.",
    price: 0,
    days: 4,
  },
  {
    id: "automation",
    label: "Automations",
    note: "Forms to your CRM, Slack alerts, CMS fed from Airtable or Notion.",
    price: 0,
    days: 3,
  },
];

export const QUOTE_RATES = {
  /** Each page past the ones the package covers. */
  perPage: 0,
  /** Each CMS collection past the ones the package covers. */
  perCollection: 0,
  /**
   * The estimate is a range, not a number: work nobody has scoped can only
   * honestly be a band. This is how much wider the top of it sits.
   */
  spread: 1.35,
};

export const QUOTE_CURRENCY = "EUR";
export const QUOTE_LOCALE = "en-IE";

/** How long a real, fixed quote takes. The one promise the page repeats. */
export const QUOTE_WITHIN = "24 hours";

export const QUOTE_NOTE =
  "An estimate, not a quote. Send us the design or the site and you get a fixed price and a launch date within 24 hours — and that price is the one you pay.";

/* -------------------------------------------------------------------------- */
/* Where Webflow stops                                                         */
/*                                                                             */
/* Nobody expects the studio selling Webflow to name what it cannot do, which  */
/* is exactly why saying it early is worth more than another list of strengths.*/
/* It is also the only honest way to quote: the limits decide the price.       */
/* -------------------------------------------------------------------------- */

export const LIMITS_LEAD =
  "Webflow isn't perfect, and no platform is. We would rather you heard where the edges are from us, in the quote, than find them yourself in month three.";

export const LIMITS: { title: string; text: string }[] = [
  {
    title: "The CMS has hard ceilings",
    text: "Items per collection, fields per item, collections per site. Past them the answer is engineering rather than a setting — and it is quotable, but it is not free.",
  },
  {
    title: "E-commerce stops at a simple catalogue",
    text: "Past that, the store belongs on a platform built for it and the marketing site stays in Webflow. Two systems, on purpose, connected by us.",
  },
  {
    title: "Some things aren't native",
    text: "Gated content, complex filtering, a real integration. They get built — custom JavaScript, a third-party service, sometimes a small API. That adds time, and we show you where.",
  },
  {
    title: "Sometimes the answer is no",
    text: "If Webflow is the wrong tool for what you are describing, you will hear it on the first call rather than after the invoice. We lose the odd project that way.",
  },
];

/* -------------------------------------------------------------------------- */
/* Handover — what the buyer actually gets                                     */
/*                                                                             */
/* The Navigator comparison this replaces spoke to developers, and a developer */
/* is not who signs. Everything below is written for the person who will have  */
/* to live with the site: what they can change, who they have to ask, and what */
/* happens if we stop working together.                                        */
/* -------------------------------------------------------------------------- */

/** `cards` — three claims, each with a word standing behind it. */
export const OWNERSHIP: {
  figure: string;
  ghost: string;
  title: string;
  text: string;
}[] = [
  {
    figure: "Day one",
    ghost: "OWN",
    title: "It's in your workspace",
    text: "The site lives in your Webflow account from the first morning — not in ours, not rented back to you.",
  },
  {
    figure: "No ticket",
    ghost: "EDIT",
    title: "Your team makes changes",
    text: "Copy, pages, images and SEO are edited by whoever writes them. Nobody waits on a developer for a sentence.",
  },
  {
    figure: "14 days",
    ghost: "FREE",
    title: "Then it's yours",
    text: "Fixes after handover are ours and not billed. After that you can stay on, or not — the site works either way.",
  },
];

/** `ledger` — the same jobs, done two ways. */
export const LEDGER_LEAD =
  "The question isn't how a site is built. It's what happens the first time you need to change something.";

export const LEDGER: { job: string; usual: string; ours: string }[] = [
  {
    job: "Fix a typo in the headline",
    usual: "Email the agency. Wait.",
    ours: "Click it. Type. Done.",
  },
  {
    job: "Add a new case study",
    usual: "A developer duplicates a page and re-styles it.",
    ours: "Fill in a form. It appears everywhere it belongs.",
  },
  {
    job: "Launch a campaign page",
    usual: "A quote, a scope, and a week you didn't plan for.",
    ours: "Build it from sections the site already has.",
  },
  {
    job: "Change the phone number in the footer",
    usual: "Twelve pages, one at a time.",
    ours: "One field, every page.",
  },
];

/** `editor` — the fields a marketer sees, drawn as the Editor shows them. */
export const EDITOR_FIELDS: { label: string; value: string }[] = [
  { label: "Headline", value: "Webflow sites, built properly" },
  { label: "Body", value: "We're a two-person Webflow studio…" },
  { label: "Button", value: "Get a fixed quote in 24h" },
  { label: "Image", value: "hero-founders.webp" },
];

export const EDITOR_NOTE =
  "This is the whole interface your team needs. No Designer, no classes, no way to break the layout by editing a sentence.";

/** `promise` — one statement, three facts under it. */
export const PROMISE_FACTS: { value: string; label: string }[] = [
  { value: "Your account", label: "where the site lives" },
  { value: "Your team", label: "who edits it" },
  { value: "Your call", label: "whether we stay" },
];
