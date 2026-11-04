/**
 * Copy for /services and for each service's own page, keyed by the slugs in
 * `offer.ts`. That file names the four services and holds what every page
 * shares (name, headline, text, the four things each includes, the lane
 * colours); this one holds what only the services pages need.
 *
 * Two sources, read under these rules:
 *
 * - The studio's own service pages (written for inParallel; their old lanes
 *   were Design, Build, Launch and Plus). Their problems, capabilities,
 *   process, guarantees and FAQ answers are used as written, renamed to the
 *   four services here: Design → Design & Development, Build → Webflow
 *   Development, Launch → whichever build it belongs to, Plus → Growth.
 * - The old agency site's services pages, for the lineup, the structure and
 *   what the studio pages don't cover (SEO & AEO, the overview, the prices).
 *   Where it repeats one service's copy on another's, only the copy written
 *   for that service is used.
 *
 * Where the two disagree, the studio's own pages win: 14 days of free fixes
 * after launch (not "a week on call"), a build in 2 to 4 weeks, unused
 * retainer hours rolling over one month (not "never expiring"), and no brand
 * identity work. Prices come from the old pricing page where it states one;
 * the studio pages have none yet. Anything still missing is a visible `TODO:`.
 */

import type { Service } from "@/data/offer.ts";

export interface Fact {
  value: string;
  label: string;
}

/** A figure from a project, with the client it was measured for when known. */
export interface Result extends Fact {
  client?: string;
}

export interface Step {
  title: string;
  /** The title in a word, where it's too long for its tab. */
  tab?: string;
  text: string;
  deliverables: string[];
  /** When it happens. Only set where the studio has said. */
  when?: string;
  /** What lands in the client's hands at this step. */
  output?: string;
}

export interface Term {
  label: string;
  value: string;
}

export interface Faq {
  question: string;
  answer: string;
}

/** A heading in two lines; `serif` names the one softer word in it. */
export interface Title {
  lines: [string, string];
  serif?: string;
}

/** Something we do about the problem; `figure` makes it the card with a number. */
export interface Capability {
  title: string;
  text: string;
  figure?: string;
  figureLabel?: string;
}

/** The one section a service page has that the others don't. */
export type Extra = "every-project" | "ledger" | "automations";

export interface ServicePage {
  meta: { title: string; description: string };
  hero: Title & { lead: string };
  /** The two figures the hero's card leads with, and the overview repeats. */
  facts: [Fact, Fact];
  /** The rest of the terms, in smaller rows under the figures. */
  terms: Term[];
  /** One sentence for the overview's row, under the service's headline. */
  overview: string;
  /** The four ticks on the overview's row, where `offer.ts` can't be used. */
  highlights?: string[];
  /** The visitor's situation, then what we do about it. */
  problem?: {
    title: Title;
    body: string[];
    capabilities: Capability[];
  };
  process: { title: Title; lead: string; steps: Step[] };
  /** A plain list of what the service covers, for a page with no problem. */
  included?: { title: Title; lead: string; items: string[] };
  extra?: Extra;
  /** The case study shown on the page (an id in `src/content/projects`). */
  study: string;
  results: Result[];
  faq: Faq[];
}

/** The lane colours as custom properties, for a section's `style`. */
export const laneStyle = ({ theme }: Service) =>
  `--lane-dark: ${theme.dark}; --lane-accent: ${theme.accent}; --lane-soft: ${theme.soft};`;

/**
 * A service's page in its own colour, from the bar at the top to the footer:
 * the deep shades and the tints the site is drawn with, set to the service's,
 * so everything that doesn't know about lanes follows. `--brand-500` carries
 * white text, and half the accent keeps that at AA on all four.
 */
export const laneTheme = (service: Service) => `:root:root {
  ${laneStyle(service)}
  --dark-950: color-mix(in oklab, var(--lane-dark) 74%, black);
  --dark-900: var(--lane-dark);
  --dark-850: color-mix(in oklab, var(--lane-accent) 6%, var(--lane-dark));
  --dark-800: color-mix(in oklab, var(--lane-accent) 10%, var(--lane-dark));
  --dark-700: color-mix(in oklab, var(--lane-accent) 18%, var(--lane-dark));
  --brand-100: color-mix(in oklab, var(--lane-soft) 40%, white);
  --brand-300: var(--lane-soft);
  --brand-500: color-mix(in oklab, var(--lane-accent) 50%, var(--lane-dark));
  --brand-600: color-mix(in oklab, var(--lane-accent) 42%, var(--lane-dark));
  --brand-700: color-mix(in oklab, var(--lane-accent) 34%, var(--lane-dark));
  --brand-mark: var(--lane-accent);
}`;

/* -------------------------------------------------------------------------- */
/* Shared figures and answers                                                  */
/* -------------------------------------------------------------------------- */

/*
 * "Measured after launch, not before": figures from the case studies, each
 * with the client it was measured for. Only what a study's own write-up
 * states — the old pages' template figures (+214%, 0.9s, 98, 92%) had
 * nothing behind them and aren't used. A page doesn't repeat the figure its
 * own case study's card already shows beside them.
 */
const ENGAGEMENT: Result = {
  value: "16x",
  label: "Engagement time growth",
  client: "Ballerine",
};
const BALLERINE_PAGES: Result = {
  value: "30+",
  label: "Pages launched",
  client: "Ballerine",
};
const SUSTAIN_PAGES: Result = {
  value: "80+",
  label: "Pages launched",
  client: "Sustain Commercial Solar",
};
const SEO_SCORE: Result = {
  value: "100",
  label: "SEO score, mobile and desktop",
  client: "TrakPro",
};
const INDEXABLE: Result = {
  value: "25+",
  label: "Indexable pages, from 3",
  client: "TrakPro",
};
const MIGRATED: Result = {
  value: "1,000+",
  label: "CMS items migrated",
  client: "Veyor Digital",
};
const MARKETS: Result = {
  value: "5",
  label: "Markets on one foundation",
  client: "Veyor Digital",
};
const NO_SEO_LOSS: Result = {
  value: "Zero",
  label: "SEO value lost in the move",
  client: "Veyor Digital",
};

const PAY_ON_LAUNCH: Term = {
  label: "How you pay",
  value: "50% to start, 50% on launch",
};
const FREE_FIXES: Term = {
  label: "After launch",
  value: "14 days of free fixes",
};

const OWN_ACCOUNT: Faq = {
  question: "Do you work in our Webflow account?",
  answer:
    "Yes, from the first day. The site is yours whether or not you keep working with us, and you never have to ask for it back.",
};

const AFTER_LAUNCH: Faq = {
  question: "What happens if something breaks after launch?",
  answer:
    "Fixes are ours for 14 days and not billed. On launch day itself we're watching, with a rollback plan ready if the switch has to be reversed.",
};

const RANKINGS: Faq = {
  question: "Will we lose our search rankings?",
  answer:
    "Not if the redirects are right. Every URL on the old site is mapped to its new home and verified after the switch — that mapping is the single thing that decides whether rankings survive, so it's the thing we spend the most time on.",
};

/** One figure for each lane on the overview, in the order of `SERVICES_P`. */
export const OVERVIEW_RESULTS: Result[] = [
  SUSTAIN_PAGES,
  MIGRATED,
  SEO_SCORE,
  ENGAGEMENT,
];

/* -------------------------------------------------------------------------- */
/* The four pages                                                              */
/* -------------------------------------------------------------------------- */

export const SERVICE_PAGES: Record<string, ServicePage> = {
  "design-development": {
    meta: {
      title: "Webflow design and development",
      description:
        "Strategy, design, development, SEO and launch for your new Webflow site. One team, one timeline, from blank canvas to live website.",
    },
    hero: {
      lines: ["Zero to a live site,", "in weeks not quarters"],
      serif: "weeks",
      lead: "Strategy, copy, design and the Webflow build, from one senior crew, on a date we commit to.",
    },
    facts: [
      { value: "From $8k", label: "One fixed price" },
      { value: "6 to 8 weeks", label: "Kickoff to launch" },
    ],
    terms: [
      PAY_ON_LAUNCH,
      FREE_FIXES,
      { label: "Best for", value: "New brands and full rebuilds" },
    ],
    overview:
      "A new website from scratch, end to end: strategy, design, development, SEO and launch, all handled by the same two people.",
    /* `offer.ts` lists "Brand and UI design", and the studio doesn't do brand
       identity work, so the row names the interface instead. */
    highlights: [
      "Strategy and messaging",
      "UX and interface design",
      "Webflow build",
      "Launch and handover",
    ],
    problem: {
      title: { lines: ["Most design work", "ends at the mood board."] },
      body: [
        "A mood board doesn't answer the question the site actually has to answer: why should this visitor choose you over the other tab they have open?",
        "So the layout gets prettier and the argument stays missing. The build goes ahead anyway, and six months later the traffic is fine and the enquiries are not.",
      ],
      capabilities: [
        {
          title: "The argument before the layout",
          text: "We write what each page has to prove before we draw it. Layout is the consequence of that, not the starting point.",
        },
        {
          title: "Copy inside the design file",
          text: "UX copy is drawn with the interface, not left as lorem ipsum for someone to fill in after the spacing is locked.",
        },
        {
          title: "Drawn for the phone first",
          figure: "Every",
          figureLabel: "breakpoint drawn",
          text: "Mobile is not the desktop squeezed. It is designed, because that is where most of your visitors actually are.",
        },
        {
          title: "A system, not a stack of screens",
          text: "Components, states, spacing rules and type scale, so the build is assembly, not interpretation.",
        },
        {
          title: "The CMS is planned before the pages",
          text: "Collections, relationships and fields are decided against how your content will grow, not against the five pages in the design file.",
        },
        {
          title: "Nothing loses its address",
          text: "URL by URL, checked after the switch and not before it. Your search rankings survive the move because somebody verified that they did.",
        },
      ],
    },
    process: {
      title: { lines: ["Full-service", "web transformation"] },
      lead: "Five steps on one eight-week timeline, overlapping where they can, so the copy, the design and the build move together.",
      steps: [
        {
          title: "Discovery",
          text: "We learn your business before we draw anything.",
          deliverables: ["Positioning", "Sitemap", "Success metrics"],
          when: "Week 1",
        },
        {
          title: "Direction and copy",
          tab: "Direction",
          text: "The art direction and every word on the page, written with you.",
          deliverables: ["Art direction", "Messaging", "Full copy"],
          when: "Weeks 1 to 2",
        },
        {
          title: "Design",
          text: "Every page designed for desktop and mobile, motion included.",
          deliverables: ["Up to 12 layouts", "Design system", "Prototype"],
          when: "Weeks 2 to 4",
        },
        {
          title: "Webflow build",
          tab: "Build",
          text: "A clean build your team can update without us.",
          deliverables: ["Class system", "CMS", "SEO and speed"],
          when: "Weeks 4 to 6",
        },
        {
          title: "Launch",
          text: "We take it live, watch launch day and fix anything that breaks for 14 days.",
          deliverables: [
            "QA on real devices",
            "Recorded walkthrough",
            "14 days of free fixes",
          ],
          when: "Weeks 6 to 8",
        },
      ],
    },
    extra: "every-project",
    study: "shiftolic",
    results: [ENGAGEMENT, SUSTAIN_PAGES, SEO_SCORE, MARKETS],
    faq: [
      {
        question: "Do we need a finished brand first?",
        answer:
          "No. We work with whatever you have — a logo and two colours is enough to start. What we won't do is invent a brand identity from scratch; if that's what you need, we'll say so and point you at someone who does it properly.",
      },
      {
        question: "Who writes the copy?",
        answer:
          "We do, with you. The copy is written with the design, not bolted on after: the messaging and the words for every page are part of Design & Development.",
      },
      {
        question: "How many rounds of revision?",
        answer:
          "Two on direction, then detail until it's right. We've never run out of rounds, because the argument is agreed before anything is drawn.",
      },
      {
        question: "How long does it actually take?",
        answer:
          "6 to 8 weeks from kickoff to launch: discovery in week 1, direction and copy in weeks 1 to 2, design in weeks 2 to 4, the Webflow build in weeks 4 to 6 and launch in weeks 6 to 8.",
      },
      {
        question: "What does it cost?",
        answer:
          "From $8,000, as one fixed price. Send us what you have and you get the price and a launch date within 24 hours — and that price is the one you pay: 50% to start, 50% on launch.",
      },
      {
        question: "Which platforms do you migrate from?",
        answer:
          "WordPress, Framer, Wix, Squarespace and hand-coded sites, most often. If it's on the web we can usually move it — and if we can't, we'll say so on the first call rather than halfway through.",
      },
      AFTER_LAUNCH,
    ],
  },

  "webflow-development": {
    meta: {
      title: "Webflow development for your design",
      description:
        "Your design, built in Webflow your marketing team can run — pixel-accurate across every breakpoint, on a CMS planned before the pages.",
    },
    hero: {
      lines: ["Bring the design,", "we'll bring it to life."],
      serif: "life",
      lead: "Pixel-accurate across every breakpoint, on a CMS planned before the pages, handed over to a team that can run it without calling a developer.",
    },
    /* The price is the old pricing page's; the time is the studio's own
       ("two to four weeks for most sites"), where the old pages said 4 to 6
       and 6 to 8. */
    facts: [
      { value: "From $20k", label: "One fixed price" },
      { value: "2 to 4 weeks", label: "For most builds" },
    ],
    terms: [
      PAY_ON_LAUNCH,
      FREE_FIXES,
      { label: "Best for", value: "Teams with designs ready" },
    ],
    overview:
      "Your designs, built in Webflow with a CMS your team can run alone.",
    problem: {
      title: { lines: ["It looked finished", "until month four."] },
      body: [
        "That's when somebody adds a page the structure didn't expect. A case study needs a second author. A product line needs its own template. The CMS only made sense to whoever built it, so every change becomes a ticket.",
        "Most Webflow sites get rebuilt inside a year for exactly this reason — not because the design aged, but because the content structure was an afterthought.",
      ],
      capabilities: [
        {
          title: "The CMS is planned before the pages",
          text: "Collections, relationships and fields are decided against how your content will grow, not against the five pages in the design file.",
        },
        {
          title: "Components that are actually components",
          text: "One change reaches every instance. Not forty copies of a card with a class name nobody can read.",
        },
        {
          title: "Pixel-accurate, every breakpoint",
          text: "Including the ones between the ones in the design. We draw the in-between states rather than letting the browser decide.",
        },
        {
          title: "Fast on the phone, on purpose",
          figure: "90+",
          figureLabel: "mobile Lighthouse",
          text: "Decided during the build, not audited after the complaint. Performance is a design decision you can't retrofit cheaply.",
        },
        {
          title: "Technical SEO from the first page",
          text: "Meta, schema, sitemap, Open Graph. Not a task at the end that gets cut when the date slips.",
        },
        {
          title: "Training, and a recording of it",
          text: "A walkthrough of your CMS your team can replay next year, when the person who sat in the session has moved on.",
        },
      ],
    },
    process: {
      title: {
        lines: ["How a build runs.", "A link on day one."],
        serif: "day",
      },
      lead: "The same steps, every project. The reliability is in the repetition.",
      steps: [
        {
          title: "Brief",
          text: "Send a Figma link or your current site. If we need more than that, it's a 20-minute call — not a questionnaire.",
          deliverables: [
            "Design review",
            "Scope questions",
            "Feasibility check",
          ],
          output: "A call, or nothing at all",
        },
        {
          title: "Fixed quote",
          text: "Price, scope and launch date within 24 hours. What ships and what does not is written down, so nobody discovers a cut in week five.",
          deliverables: [
            "Fixed price",
            "Launch date",
            "What ships",
            "What does not",
          ],
          when: "Within 24 hours",
          output: "One page you can argue with",
        },
        {
          title: "Build",
          text: "You get a staging link on day one and watch it come together. Progress you can click beats a status meeting.",
          deliverables: [
            "Component library",
            "CMS architecture",
            "Responsive build",
            "Device QA",
          ],
          when: "2 to 4 weeks",
          output: "A link, updated all week",
        },
        {
          title: "Handoff",
          text: "Training, documentation and 14 days of support. Then it's yours, in your workspace, with nothing left hanging.",
          deliverables: [
            "CMS training",
            "Recorded walkthrough",
            "Written notes",
            "14 days of fixes",
          ],
          output: "The keys, and the manual",
        },
      ],
    },
    extra: "ledger",
    study: "ballerine",
    results: [BALLERINE_PAGES, MIGRATED, SUSTAIN_PAGES, MARKETS],
    faq: [
      {
        question: "How long does a build take?",
        answer:
          "Two to four weeks for most sites. You get an exact date with your quote, and the date is part of the fixed price — a slip is ours to absorb, not yours to pay for.",
      },
      {
        question: "What if the design isn't quite finished?",
        answer:
          "We'll tell you which parts are ready to build and which aren't. Building from a half-finished design costs more than waiting a week, and we'd rather say that than discover it in week three.",
      },
      {
        question: "Will our team be able to edit it?",
        answer:
          "That's the point. Copy, pages, images and SEO are edited in the Webflow Editor — four fields and a Publish button, no Designer and no way to break the layout by changing a sentence.",
      },
      {
        question: "What about interactions and animation?",
        answer:
          "Included, within reason. Every interaction has to earn its place: if it slows the page or distracts from the message, we'll argue against it before we build it.",
      },
      OWN_ACCOUNT,
      {
        question: "Our Webflow site is 80% done and stuck. Can you finish it?",
        answer:
          "Usually, yes. We'll look at what's there first and tell you honestly whether finishing it costs less than rebuilding it. Sometimes the answer is rebuild, and we'd rather lose that argument early.",
      },
      {
        question: "What does it cost?",
        answer:
          "From $20,000, as one fixed price. Send us the design and you get the price and a launch date within 24 hours — and that price is the one you pay: 50% to start, 50% on launch.",
      },
    ],
  },

  "seo-aeo": {
    meta: {
      title: "Webflow SEO and AEO",
      description:
        "Technical SEO, content and AI answer optimisation for Webflow sites. We audit, structure and grow your rankings and AI citations, month after month.",
    },
    hero: {
      lines: ["Show up where", "your buyers search."],
      serif: "search",
      lead: "We make your site easy to find and easy to cite, with technical SEO, content structure, and AI search optimization that brings the right people to you.",
    },
    facts: [
      { value: "6 weeks", label: "To the first wins" },
      { value: "Month to month", label: "Billed monthly" },
    ],
    terms: [
      { label: "Starting at", value: "TODO: monthly price" },
      { label: "Every month", value: "A report on rankings and citations" },
      { label: "Best for", value: "Live sites that should rank" },
    ],
    overview:
      "Technical SEO, content and schema, so Google and AI tools find and quote you.",
    process: {
      title: {
        lines: ["From audit to answers,", "in five moves"],
        serif: "answers",
      },
      lead: "We fix what holds the site back first, then publish and measure every month.",
      steps: [
        {
          title: "Audit",
          text: "We find what is holding your rankings back today.",
          deliverables: [
            "Technical SEO audit",
            "Core Web Vitals",
            "AI visibility check",
          ],
          when: "Weeks 1 to 2",
        },
        {
          title: "Research",
          text: "The searches and questions your buyers actually use.",
          deliverables: [
            "Keyword research",
            "Question mapping",
            "Competitor gaps",
          ],
          when: "Week 2",
        },
        {
          title: "Structure",
          text: "Pages built so Google and AI can read every part of them.",
          deliverables: [
            "Schema and metadata",
            "Internal linking",
            "Webflow CMS setup",
          ],
          when: "Weeks 3 to 4",
        },
        {
          title: "Content",
          text: "Clear answers that rank, and get quoted by AI.",
          deliverables: [
            "Pages and articles",
            "Answer blocks and FAQs",
            "Entities and llms.txt",
          ],
          when: "Every month",
        },
        {
          title: "Grow",
          text: "We track rankings and AI citations, then double down on what works.",
          deliverables: [
            "Rank tracking",
            "AI citation tracking",
            "Monthly report",
          ],
          when: "Monthly",
        },
      ],
    },
    included: {
      title: {
        lines: ["Found on Google,", "and in the answers"],
        serif: "answers",
      },
      lead: "Technical SEO, content and AI answers that grow your rankings and citations every month.",
      items: [
        "Technical SEO audit",
        "Keyword research",
        "On-page fixes",
        "Schema and structured data",
        "AI answer optimisation (AEO)",
        "Core Web Vitals",
        "New pages and articles",
        "Rank and AI citation tracking",
        "Monthly report",
      ],
    },
    study: "ballerine",
    results: [SEO_SCORE, INDEXABLE, NO_SEO_LOSS, MARKETS],
    faq: [
      RANKINGS,
      {
        question: "Who writes the copy?",
        answer:
          "We do. New pages and articles, answer blocks and FAQs are written every month as part of SEO & AEO.",
      },
      {
        question: "How long does it actually take?",
        answer:
          "The first wins come in about six weeks: the audit takes weeks 1 to 2, research week 2 and the structural fixes weeks 3 to 4. Content and tracking then run every month.",
      },
      {
        question: "What do we get every month?",
        answer:
          "New pages and articles, rank and AI citation tracking, and a report on both.",
      },
      OWN_ACCOUNT,
      {
        question: "What does it cost?",
        answer: "SEO & AEO is billed monthly. TODO: monthly price.",
      },
    ],
  },

  growth: {
    meta: {
      title: "An ongoing Webflow team for your site",
      description:
        "A retained Webflow crew shipping new pages, automations and experiments every month — the work that turns a launch into a growth channel.",
    },
    hero: {
      lines: ["Built once.", "Growing forever."],
      serif: "forever",
      lead: "A retained crew shipping new pages, automations and experiments every month, with a report on what changed and what moved — and the same two people every time.",
    },
    facts: [
      { value: "Month to month", label: "A month's notice, no lock-in" },
      { value: "Every week", label: "New releases, checked and live" },
    ],
    terms: [
      { label: "Starting at", value: "TODO: monthly price" },
      { label: "Unused hours", value: "Roll over one month" },
      { label: "Best for", value: "Sites that need to keep shipping" },
    ],
    overview:
      "New pages, tests and a report every month, from the same senior crew.",
    problem: {
      title: { lines: ["Most agencies stop", "the morning after."] },
      body: [
        "The site goes live, the team disbands, and the thing you just paid for starts ageing. Six months later the roadmap has moved, the site hasn't, and the only way to change it is another project with another quote.",
        "Our best numbers all happened months after a launch — on the sites where somebody was still shipping. A website is a channel you run, not a thing you buy once.",
      ],
      capabilities: [
        {
          title: "New pages and sections, monthly",
          text: "Campaign pages, product additions, whatever the quarter needs — built from a system that already exists, so they ship in days.",
        },
        {
          title: "Automations, not just pages",
          text: "Forms to your CRM, Slack alerts, a CMS fed from the sheet your team already keeps. Work moves without anyone touching it.",
        },
        {
          title: "Conversion work and experiments",
          text: "Changes with a reason attached and a number afterwards, rather than a redesign every eighteen months.",
        },
        {
          title: "A monthly report worth reading",
          text: "What changed, what moved, and what we'd do next. One page, not a dashboard nobody opens.",
        },
        {
          title: "You get a person, not a queue",
          figure: "1 day",
          figureLabel: "to a reply",
          text: "From one of the two people who built the site. Not a queue, not a ticket number, not an account manager relaying it.",
        },
        {
          title: "We take on a limited number",
          text: "A retainer only works if there is room to do the work. When there isn't, we say so instead of taking the money.",
        },
      ],
    },
    process: {
      title: {
        lines: ["A plan for the quarter,", "shipped every week"],
        serif: "every",
      },
      lead: "We start with what the site does today, agree one plan, then design, ship and measure on a steady rhythm.",
      steps: [
        {
          title: "Audit",
          text: "We start with what your site is doing today.",
          deliverables: [
            "Analytics and SEO audit",
            "Speed and accessibility",
            "A ranked fix list",
          ],
          when: "Weeks 1 to 2",
        },
        {
          title: "Roadmap",
          text: "One shared plan for the quarter, ordered by impact.",
          deliverables: [
            "Quarterly roadmap",
            "Monthly team time",
            "One shared channel",
          ],
          when: "Week 2",
        },
        {
          title: "Design",
          text: "New pages, sections and campaigns, designed when you need them.",
          deliverables: [
            "Landing pages",
            "New sections",
            "Design system updates",
          ],
          when: "Every sprint",
        },
        {
          title: "Ship",
          text: "Built, checked and live in Webflow every single week.",
          deliverables: [
            "Weekly releases",
            "CMS and integrations",
            "QA on every change",
          ],
          when: "Every week",
        },
        {
          title: "Grow",
          text: "We measure, test and feed what we learn back into the plan.",
          deliverables: ["A/B tests", "SEO and AEO", "Monthly report"],
          when: "Monthly",
        },
      ],
    },
    extra: "automations",
    study: "shiftolic",
    results: [ENGAGEMENT, BALLERINE_PAGES, MARKETS, INDEXABLE],
    faq: [
      {
        question: "How many hours do we get?",
        answer:
          "A block of hours agreed up front, and a running list of what they went on. Unused hours roll one month, because a quiet January shouldn't punish you in February.",
      },
      {
        question: "Can we pause or stop?",
        answer:
          "Monthly, with a month's notice. There's no lock-in — the site is in your workspace and keeps working whether or not we're on it.",
      },
      {
        question: "What if you didn't build our site?",
        answer:
          "Then we start with a look at what's there and an honest read on whether it's worth extending. Sometimes a retainer on a bad build is money spent holding it together, and we'll tell you if that's the case.",
      },
      {
        question: "Is there a minimum?",
        answer:
          "Yes — below a certain size a retainer costs you more than it returns, and you're better off with one-off work. We'd rather quote you for that.",
      },
      {
        question: "Who actually does the work?",
        answer:
          "The same two people who pitched it. That's the whole reason the number of Growth clients is capped.",
      },
      {
        question: "What does it cost?",
        answer: "Growth is billed monthly. TODO: monthly price.",
      },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/* What every project gets, and where Webflow stops                            */
/* -------------------------------------------------------------------------- */

export const EVERY_PROJECT: { title: string; text: string }[] = [
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

export const DONT_DO: string[] = [
  "WordPress, Framer or custom-coded sites",
  "Logo design and brand identity",
  "Sites without a design, unless we agree on a design partner first",
  "Work we can't quote a fixed price for",
];

export const DONT_DO_NOTE =
  "Saying no to these is how we stay good at the rest.";

/* -------------------------------------------------------------------------- */
/* The first change after handover (Webflow Development)                       */
/* -------------------------------------------------------------------------- */

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

/** The fields a marketer sees, drawn as the Webflow Editor shows them. */
export const EDITOR_FIELDS: { label: string; value: string }[] = [
  { label: "Headline", value: "Webflow sites, built properly" },
  { label: "Body", value: "We're a two-person Webflow studio…" },
  { label: "Button", value: "Get a fixed quote in 24h" },
  { label: "Image", value: "hero-founders.webp" },
];

export const EDITOR_NOTE =
  "This is the whole interface your team needs. No Designer, no classes, no way to break the layout by editing a sentence.";

/* -------------------------------------------------------------------------- */
/* Automations (Growth)                                                        */
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
  "Included in Growth, and available as an add-on to any other service or on its own.";

/* -------------------------------------------------------------------------- */
/* The overview: /services                                                     */
/* -------------------------------------------------------------------------- */

/** A cell in the comparison: words, or simply included (`true`) or not. */
export type CompareValue = string | boolean;

export interface CompareRow {
  label: string;
  /** One value per service, in the order of `SERVICES_P`. */
  values: [CompareValue, CompareValue, CompareValue, CompareValue];
}

/*
 * "Side by side", from the old services overview, corrected where the
 * studio's own pages say otherwise: Webflow Development takes 2 to 4 weeks,
 * copy on Growth is an add-on, the builds end with 14 days of free fixes, and
 * automations are an add-on everywhere but Growth. Prices follow the old
 * pricing page.
 */
export const COMPARE_ROWS: CompareRow[] = [
  {
    label: "Best for",
    values: [
      "New brands and full rebuilds",
      "Teams with designs ready",
      "Live sites that should rank",
      "Sites that need to keep shipping",
    ],
  },
  {
    label: "Timeline",
    values: [
      "6 to 8 weeks",
      "2 to 4 weeks",
      "First wins in 6 weeks",
      "Month to month",
    ],
  },
  {
    label: "How you pay",
    values: [
      "Fixed price, half on launch",
      "Fixed price, half on launch",
      "Monthly",
      "Monthly",
    ],
  },
  { label: "Strategy and copy", values: [true, false, true, "Add-on"] },
  { label: "Design", values: [true, "Your designs", false, "New pages"] },
  { label: "Webflow build and CMS", values: [true, true, false, true] },
  { label: "SEO and AEO", values: ["Built in", "Built in", true, true] },
  { label: "Automations", values: ["Add-on", "Add-on", "Add-on", true] },
  {
    label: "After launch",
    values: [
      "14 days of free fixes",
      "14 days of free fixes",
      "Monthly report",
      "Monthly report",
    ],
  },
  {
    label: "Starting at",
    values: ["$8,000", "$20,000", "TODO: price", "TODO: price"],
  },
];

export interface Ask {
  /** What a visitor might say, in their words. */
  text: string;
  /** The service it points to (a slug in `offer.ts`). */
  service: string;
}

/**
 * "Not sure what you need?" — six things people say, each pointing to a
 * service. The answers are the old site's, minus three figures nothing else
 * backs up ("2 minutes", "#1", "+38%"); each keeps a fact the services pages
 * do state instead.
 */
export const ASKS: Ask[] = [
  { text: "We need a new website.", service: "design-development" },
  { text: "Our site needs a rebuild.", service: "design-development" },
  { text: "Our designs are ready in Figma.", service: "webflow-development" },
  { text: "Nobody finds us on Google.", service: "seo-aeo" },
  { text: "We want the site to keep improving.", service: "growth" },
  { text: "We want more leads, every month.", service: "growth" },
];

/** What we say back, after "Then you want …". */
export const ANSWERS: Record<string, string> = {
  "design-development":
    "One team for the strategy, the copy, the design and the build. You're live in 6 to 8 weeks.",
  "webflow-development":
    "We build your Figma pixel for pixel, with a CMS your team can run alone. Most builds take 2 to 4 weeks.",
  "seo-aeo":
    "We fix what holds you back and get you quoted in AI answers. The first wins come in about six weeks.",
  growth:
    "The same two people ship new pages, automations and tests every month, with a month's notice and no lock-in.",
};

/** The overview's questions: the studio's own answers, across all four. */
export const OVERVIEW_FAQ: Faq[] = [
  {
    question: "How long does a project take?",
    answer:
      "A build takes 2 to 4 weeks and a launch 3 to 10 days. You get an exact date with your quote, and the date is part of the fixed price — so a slip is ours to absorb.",
  },
  {
    question: "What do you need from me to start?",
    answer:
      "A Figma file or your current site, and a deadline. We'll ask for anything else we need rather than sending you a form to fill in.",
  },
  {
    question: "What if I don't have a design yet?",
    answer:
      "Then you want Design & Development, or we bring in a design partner. If speed matters more than polish we can build from a solid wireframe instead.",
  },
  {
    question: "Do you work in my Webflow account?",
    answer:
      "Yes. Everything lives in your workspace from the first day, so the site is yours whether or not you keep working with us.",
  },
  {
    question: "What does it cost?",
    answer:
      "Design & Development starts at $8,000 and Webflow Development at $20,000, each as one fixed price; send us what you have and the quote lands within 24 hours. SEO & AEO and Growth are monthly. TODO: monthly prices for SEO & AEO and Growth.",
  },
  {
    question: "How does payment work?",
    answer:
      "50% to start, 50% on launch. SEO & AEO and Growth are billed monthly.",
  },
  {
    question: "What happens after handoff?",
    answer:
      "14 days of free fixes. After that you can move to Growth, or just reach out when something comes up.",
  },
  {
    question: "Who actually does the work?",
    answer:
      "The same two people who pitched it, on every project. No account managers, no handoffs to juniors, no one relaying messages.",
  },
];
