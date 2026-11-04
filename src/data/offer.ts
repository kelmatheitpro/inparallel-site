/**
 * The four services — one source for the home page tabs, the nav, the footer
 * and each service's own page.
 *
 * Each has a colour of its own (the lane it runs in): a deep shade for its
 * panels and a bright accent for its marks. Prices and timings match the
 * service pages (`service-pages.ts`) and /pricing; a figure without a source
 * doesn't go in.
 */

export interface ServiceStat {
  value: string;
  label: string;
}

export interface Service {
  slug: string;
  /** As the tabs and menus name it. */
  name: string;
  /** One line for menus. */
  summary: string;
  /** The claim on its tab, in two lines. */
  headline: [string, string];
  text: string;
  includes: string[];
  stats: ServiceStat[];
  theme: {
    /** Deep panel colour. */
    dark: string;
    /** Bright accent. */
    accent: string;
    /** Where the accent's gradient fades to. */
    soft: string;
  };
}

export const SERVICES_P: Service[] = [
  {
    slug: "design-development",
    name: "Design & Development",
    summary: "Strategy, copy, design and build — one team, one launch day.",
    headline: ["From first sketch", "to launch day."],
    text: "Strategy, copy, design and the Webflow build, with one team and one launch day.",
    includes: [
      "Strategy and messaging",
      "UX and interface design",
      "Webflow build",
      "Launch and handover",
    ],
    stats: [
      { value: "From $8k", label: "One fixed price" },
      { value: "6 to 8 weeks", label: "Kickoff to launch" },
    ],
    theme: { dark: "#082216", accent: "#12e39b", soft: "#7ddbb9" },
  },
  {
    slug: "webflow-development",
    name: "Webflow Development",
    summary: "Bring us your Figma; we build it in Webflow, pixel perfect.",
    headline: ["Bring the design,", "we'll bring it to life."],
    text: "Bring us your Figma and we build it in Webflow, pixel perfect, fast, responsive, and structured so your team can run it with ease.",
    includes: [
      "Webflow build",
      "CMS setup",
      "Interactions and animations",
      "Performance",
    ],
    stats: [
      { value: "From $20k", label: "One fixed price" },
      { value: "2 to 4 weeks", label: "For most builds" },
    ],
    theme: { dark: "#0d1928", accent: "#9fb4f2", soft: "#bbcaf7" },
  },
  {
    slug: "seo-aeo",
    name: "SEO & AEO",
    summary: "Easy to find and easy to cite, on Google and in AI search.",
    headline: ["Show up where", "your buyers search."],
    text: "We make your site easy to find and easy to cite, with technical SEO, content structure, and AI search optimization that brings the right people to you.",
    includes: [
      "Technical SEO",
      "On-page SEO",
      "AI search (AEO)",
      "Schema and structured data",
    ],
    stats: [
      { value: "6 weeks", label: "To the first wins" },
      { value: "Monthly", label: "Month to month" },
    ],
    theme: { dark: "#321f0d", accent: "#f2c27d", soft: "#ffdba8" },
  },
  {
    slug: "growth",
    name: "Growth",
    summary: "New pages, experiments and releases, every month after launch.",
    headline: ["Built once.", "Growing forever."],
    text: "The site keeps shipping after go-live, with new pages, experiments and releases every month.",
    includes: [
      "Conversion optimization",
      "A/B testing",
      "New pages and landing pages",
      "Analytics and reporting",
    ],
    stats: [
      { value: "Every week", label: "New releases, live" },
      { value: "Monthly", label: "A month's notice, no lock-in" },
    ],
    theme: { dark: "#66023c", accent: "#ff7ac7", soft: "#ffd8ef" },
  },
];
