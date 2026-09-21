/**
 * The four service pages.
 *
 * `/services` is a junction — it names the four lanes and sends the visitor to
 * the one that matches where their site is today. Everything specific to a lane
 * lives here: the pain it answers, what we can do about it, the questions that
 * lane gets asked, and which case studies count as proof for it.
 *
 * The proof is filtered by the `services` each case study already lists, so a
 * project appears on a lane's page because of what was actually done on it
 * rather than because somebody put it in a list twice.
 */

export interface LanePage {
  /** Matches the `id` in `LANES`. */
  id: string;
  slug: string;
  name: string;
  /** Meta description for this page. */
  description: string;

  hero: { title: string; titleMuted: string; lead: string };

  /**
   * The section that names the visitor's problem before we say a word about
   * ourselves. Written as their situation, not as our offer.
   */
  problem: { title: string; titleMuted: string; body: string[] };

  /**
   * What we can do about it. Five or six, each one a claim we can stand on.
   * `figure` turns a card into the one carrying a number, which is what stops
   * the grid reading as six paragraphs in boxes.
   */
  capabilities: {
    title: string;
    text: string;
    figure?: string;
    figureLabel?: string;
  }[];

  /** The heading over the process, named for this lane. */
  processTitle: string;
  processTitleMuted: string;

  /** A case study counts as proof here if it lists any of these services. */
  proofServices: string[];

  faq: { question: string; answer: string }[];
}

export const LANE_PAGES: LanePage[] = [
  /* ------------------------------------------------------------------ design */
  {
    id: "design",
    slug: "design",
    name: "inparallelDesign",
    description:
      "Strategy, copy and interface design for Webflow — laid out on a component system your developer can build from without guessing what you meant.",
    hero: {
      title: "A site designed to sell,",
      titleMuted: "not to win awards.",
      lead: "Strategy, copy and interface design in Figma. Drawn on a component system, with every breakpoint decided — so the build is assembly, not interpretation.",
    },
    problem: {
      title: "Most design work",
      titleMuted: "ends at the mood board.",
      body: [
        "Neither of those answers the question the site actually has to answer: why should this visitor choose you over the other tab they have open?",
        "So the layout gets prettier and the argument stays missing. The build goes ahead anyway, and six months later the traffic is fine and the enquiries are not.",
      ],
    },
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
        title: "A system, not a stack of screens",
        text: "Components, states, spacing rules and type scale. A developer builds from it without asking what you meant on page nine.",
      },
      {
        title: "Drawn for the phone first",
        figure: "Every",
        figureLabel: "breakpoint drawn",
        text: "Mobile is not the desktop squeezed. It is designed, because that is where most of your visitors actually are.",
      },
      {
        title: "A build estimate attached",
        text: "From the people who would build it. A design nobody has costed is a wish, and wishes get value-engineered later.",
      },
    ],
    processTitle: "How the design gets made.",
    processTitleMuted: "No mood boards.",
    proofServices: [
      "Brand & visual direction",
      "UX & messaging",
      "Design from scratch",
    ],
    faq: [
      {
        question: "Do we need a finished brand first?",
        answer:
          "No. We work with whatever you have — a logo and two colours is enough to start. What we won't do is invent a brand identity from scratch; if that's what you need, we'll say so and point you at someone who does it properly.",
      },
      {
        question: "Can our own developer build from your files?",
        answer:
          "That's what they're for. You get a Figma component system with states, breakpoints and spacing rules, not a flat picture of a page. If your developer has questions, they can ask us directly.",
      },
      {
        question: "What if we want you to build it too?",
        answer:
          "Then you want inparallelBuild, and the two are quoted together. The design costs the same either way — we don't discount it to win the build.",
      },
      {
        question: "How many rounds of revision?",
        answer:
          "Two on direction, then detail until it's right. We've never run out of rounds, because the argument is agreed before anything is drawn.",
      },
    ],
  },

  /* ------------------------------------------------------------------- build */
  {
    id: "build",
    slug: "build",
    name: "inparallelBuild",
    description:
      "Your design, built in Webflow your marketing team can run — pixel-accurate across every breakpoint, on a CMS planned before the pages.",
    hero: {
      title: "Your design, built in",
      titleMuted: "Webflow that lasts.",
      lead: "Pixel-accurate across every breakpoint, on a CMS planned before the pages, handed over to a team that can run it without calling a developer.",
    },
    problem: {
      title: "It looked finished",
      titleMuted: "until month four.",
      body: [
        "That's when somebody adds a page the structure didn't expect. A case study needs a second author. A product line needs its own template. The CMS only made sense to whoever built it, so every change becomes a ticket.",
        "Most Webflow sites get rebuilt inside a year for exactly this reason — not because the design aged, but because the content structure was an afterthought.",
      ],
    },
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
    processTitle: "How a build runs.",
    processTitleMuted: "A link on day one.",
    proofServices: [
      "Webflow build",
      "Component library",
      "CMS architecture",
      "Performance optimisation",
    ],
    faq: [
      {
        question: "How long does a build take?",
        answer:
          "Two to four weeks for most sites. You get an exact date with your quote, and the date is part of the fixed price — a slip is ours to absorb, not yours to pay for.",
      },
      {
        question: "Do you work in our Webflow account?",
        answer:
          "Yes, from the first day. The site is yours whether or not you keep working with us, and you never have to ask for it back.",
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
    ],
  },

  /* ------------------------------------------------------------------ launch */
  {
    id: "launch",
    slug: "launch",
    name: "inparallelLaunch",
    description:
      "Migration, redirects, DNS and analytics, handled in order — so the day you switch platforms is the day nothing happens.",
    hero: {
      title: "Built, launched and handed over,",
      titleMuted: "with nothing left hanging.",
      lead: "Migration, redirect mapping, DNS and analytics, done in the right order and verified before go-live — so switching platforms is the day nothing happens.",
    },
    problem: {
      title: "The build was never",
      titleMuted: "the risky part.",
      body: [
        "Rankings you spent years earning can be undone by a redirect map nobody checked. Forms stop reaching the inbox and nobody notices for a week. Analytics starts a new history and last year is gone.",
        "Almost everything that goes wrong on launch day is a list somebody didn't make. We make the list, and we're watching when the switch is thrown.",
      ],
    },
    capabilities: [
      {
        title: "Nothing loses its address",
        figure: "Every",
        figureLabel: "redirect mapped",
        text: "URL by URL, checked after the switch and not before it. Your search rankings survive the move because somebody verified that they did.",
      },
      {
        title: "Content and assets migrated",
        text: "CMS collections, images, documents. Not a copy-paste job that leaves half the archive on the old platform.",
      },
      {
        title: "Domain, DNS and SSL in order",
        text: "Done in the sequence that avoids an hour of downtime, rather than the sequence that seems obvious at 9am.",
      },
      {
        title: "Analytics verified before go-live",
        text: "GA4, Search Console, conversions and forms tested end to end. You find out tracking is broken now, not at the end of the quarter.",
      },
      {
        title: "QA on real devices",
        text: "Including the mid-range Android your visitors actually carry, not just the preview on a fast laptop.",
      },
      {
        title: "We watch launch day",
        text: "Somebody is looking at the site and the inbox while the DNS propagates, with a rollback ready if it's needed.",
      },
    ],
    processTitle: "How a launch runs.",
    processTitleMuted: "In the right order.",
    proofServices: [
      "Migration & redirects",
      "CMS migration",
      "Localisation",
      "Multi-region architecture",
      "HubSpot & analytics integration",
    ],
    faq: [
      {
        question: "Will we lose our search rankings?",
        answer:
          "Not if the redirects are right. Every URL on the old site is mapped to its new home and verified after the switch — that mapping is the single thing that decides whether rankings survive, so it's the thing we spend the most time on.",
      },
      {
        question: "How long does a launch take?",
        answer:
          "Three to ten days for most sites, depending on how much content moves and how many integrations have to be re-pointed. Migration from another platform adds a few days on both ends of that range.",
      },
      {
        question: "Which platforms do you migrate from?",
        answer:
          "WordPress, Framer, Wix, Squarespace and hand-coded sites, most often. If it's on the web we can usually move it — and if we can't, we'll say so on the first call rather than halfway through.",
      },
      {
        question: "Our Webflow site is 80% done and stuck. Can you finish it?",
        answer:
          "Usually, yes. We'll look at what's there first and tell you honestly whether finishing it costs less than rebuilding it. Sometimes the answer is rebuild, and we'd rather lose that argument early.",
      },
      {
        question: "What happens if something breaks after launch?",
        answer:
          "Fixes are ours for 14 days and not billed. On launch day itself we're watching, with a rollback plan ready if the switch has to be reversed.",
      },
    ],
  },

  /* -------------------------------------------------------------------- plus */
  {
    id: "plus",
    slug: "plus",
    name: "inparallel+",
    description:
      "A retained Webflow crew shipping new pages, automations and experiments every month — the work that turns a launch into a growth channel.",
    hero: {
      title: "Launch is day one,",
      titleMuted: "not the finish line.",
      lead: "A retained crew shipping new pages, automations and experiments every month, with a report on what changed and what moved — and the same two people every time.",
    },
    problem: {
      title: "Most agencies stop",
      titleMuted: "the morning after.",
      body: [
        "The site goes live, the team disbands, and the thing you just paid for starts ageing. Six months later the roadmap has moved, the site hasn't, and the only way to change it is another project with another quote.",
        "Our best numbers all happened months after a launch — on the sites where somebody was still shipping. A website is a channel you run, not a thing you buy once.",
      ],
    },
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
    processTitle: "How a month runs.",
    processTitleMuted: "Every month.",
    /* Deliberately narrow: "performance optimisation" happens on every build,
       so counting it here would pad the page with work that wasn't retained. */
    proofServices: ["inparallel+ retainer", "Motion & interaction"],
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
          "The same two people who pitched it. That's the whole reason the number of Plus clients is capped.",
      },
    ],
  },
];

export const laneBySlug = (slug: string) =>
  LANE_PAGES.find((lane) => lane.slug === slug);
