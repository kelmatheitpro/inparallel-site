/** Site name. Appended to every page title and used as `og:site_name`. */
export const SITE_NAME = "inParallel";
/** Fallback meta description for pages that don't set their own. */
export const SITE_DESCRIPTION =
  "inParallel is a two-person Webflow studio in Belgrade. We design, build and grow Webflow sites for B2B teams — working alongside yours, from first sketch to long after launch.";
/**
 * The site is private for now: clients get a link, and search engines must
 * never list it. This keeps every page out of the index, and robots.txt and
 * `vercel.json` do the same at their end. Going public means undoing all
 * three, adding `sitemap()` back in `astro.config.mjs` and restoring
 * `src/pages/_llms.txt.ts` to `llms.txt.ts`.
 */
export const SITE_PRIVATE = true;

/** Canonical origin. Resolves canonical URLs and social images. */
export const SITE_URL = "https://inparallel.agency";
/** BCP 47 locale tag used to format dates and numbers. */
export const SITE_LOCALE = "en-US";
/** Where every "book a call" and mail link points. */
export const CONTACT_EMAIL = "hello@inparallel.agency";
/**
 * Routes kept out of search results. Each is excluded from the sitemap and
 * served with a `robots: noindex, nofollow` tag, so the two can't disagree.
 *
 * Surrounding slashes are optional: `"/thanks"`, `"thanks"` and `"/thanks/"`
 * all match the same route.
 */
export const NOINDEX_ROUTES: string[] = [
  "/404",
  "/example-components",
  "/hero-variants",
  "/section-variants",
];

/**
 * The proof chip the site repeats — in the hero, on the contact page and above
 * the testimonials. Stated once here because it is a claim, and a claim that
 * disagrees with itself in three places is worse than no claim at all.
 */
export const SOCIAL_PROOF = {
  score: "100%",
  source: "Job Success on Upwork",
} as const;

export interface NavChild {
  label: string;
  href: string;
  description: string;
}

export interface NavLink {
  id: string;
  label: string;
  href?: string;
  children?: NavChild[];
}

/** The four services and the agency offer, shared by the nav dropdown and the footer. */
export const SERVICES_MENU: NavChild[] = [
  {
    label: "Design & Development",
    href: "/services/design-development",
    description: "Strategy, copy, design and build — one team, one launch day",
  },
  {
    label: "Webflow Development",
    href: "/services/webflow-development",
    description: "Bring us your Figma; we build it in Webflow, pixel perfect",
  },
  {
    label: "SEO & AEO",
    href: "/services/seo-aeo",
    description: "Easy to find and easy to cite, on Google and in AI search",
  },
  {
    label: "Growth",
    href: "/services/growth",
    description: "New pages, experiments and releases, every month",
  },
  {
    label: "Extended team",
    href: "/extended-team",
    description: "Two Webflow developers working inside your agency's team",
  },
];

export const NAV_LINKS: NavLink[] = [
  { id: "about", label: "About us", href: "/about" },
  {
    id: "services",
    label: "Services",
    href: "/services",
    children: SERVICES_MENU,
  },
  { id: "work", label: "Our work", href: "/work" },
  { id: "pricing", label: "Pricing", href: "/pricing" },
  { id: "insights", label: "Insights", href: "/blog" },
];
