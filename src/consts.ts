/** Site name. Appended to every page title and used as `og:site_name`. */
export const SITE_NAME = "inparallel";
/** Fallback meta description for pages that don't set their own. */
export const SITE_DESCRIPTION =
  "inparallel is a Webflow studio with a business-first approach. We design, build and grow websites your own team can run — designed from scratch, built in code that lasts.";
/** Canonical origin. Resolves canonical URLs, social images, and the sitemap. */
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

/** The four service lanes, shared by the nav dropdown and the footer. */
export const SERVICES_MENU: NavChild[] = [
  {
    label: "inparallelDesign",
    href: "/services/design",
    description: "Strategy, copy and design your developer can build from",
  },
  {
    label: "inparallelBuild",
    href: "/services/build",
    description: "A Webflow build your team can actually run",
  },
  {
    label: "inparallelLaunch",
    href: "/services/launch",
    description: "Built, launched and handed over in weeks",
  },
  {
    label: "inparallel+",
    href: "/services/plus",
    description: "Growth work that keeps shipping after launch",
  },
  {
    label: "Extended team",
    href: "/extended-team",
    description: "Two Webflow developers inside your agency's team",
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
  { id: "contact", label: "Contact", href: "/contact" },
];
