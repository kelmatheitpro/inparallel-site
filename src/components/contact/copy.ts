/**
 * Copy for /contact: the booking link, what happens after someone gets in
 * touch, and the choices the enquiry form offers.
 *
 * Kept beside the page's components rather than in the markup, so the words
 * and the choices can change without touching the layout.
 */
import { SERVICES_MENU } from "@/consts.ts";

/**
 * TODO: inParallel's booking link — a calendar the visitor picks a time in.
 * Until it is set, the page asks for a time by email instead, and says so.
 */
export const BOOKING_URL: string | null = null;

export interface Step {
  title: string;
  text: string;
}

/** What happens after someone books or writes, in the studio's own words. */
export const NEXT_STEPS: Step[] = [
  {
    title: "Pick a time",
    text: "The people on the call are the people who ship your site. No hand-off to a junior team.",
  },
  {
    title: "A plan and an estimate",
    text: "You leave the 30 minutes with both, whether you hire us or not.",
  },
  {
    title: "One fixed number",
    text: "Agreed after the first call. No meter running, no surprises after.",
  },
];

/** The services the form offers, named as the menus name them. */
export const SERVICE_CHOICES = SERVICES_MENU.map((service) => service.label);

/** In dollars, like the prices on /pricing. */
export const BUDGETS = [
  "Under $10k",
  "$10k – $25k",
  "$25k – $50k",
  "$50k+",
  "Not sure yet",
];
