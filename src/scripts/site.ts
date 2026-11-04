/**
 * Every piece of client behaviour on the site, started once from the layout.
 *
 * It lives here rather than in a `<script>` beside each component because each
 * one is driven by `data-` attributes in the markup, not by a component
 * instance — one pass over the document wires up all of them, and a component
 * nested inside a section keeps working the same as one the page renders
 * directly.
 */
import { initNav } from "@/scripts/nav.ts";
import { initButtons } from "@/scripts/buttons.ts";
import { initMotion } from "@/scripts/motion.ts";
import { initHeroGlass } from "@/scripts/hero-glass.ts";
import { initHeroBackdrop } from "@/scripts/hero-backdrop.ts";
import { initTabs } from "@/scripts/tabs.ts";
import { initReveal } from "@/scripts/reveal.ts";
import { initLightbox } from "@/scripts/lightbox.ts";
import { initVideoLoops } from "@/scripts/video-loop.ts";
import { initCursorMedia } from "@/scripts/cursor-media.ts";
import { initMarginCalculator } from "@/scripts/margin-calculator.ts";
import { initQuoteCalculator } from "@/scripts/quote-calculator.ts";
import { initBriefForm } from "@/scripts/brief-form.ts";
import { initContactForm } from "@/scripts/contact-form.ts";
import { initFloatCards } from "@/scripts/float-cards.ts";

initNav();
initButtons();
initHeroGlass();
void initMotion();
initHeroBackdrop();
initTabs();
initReveal();
initLightbox();
initVideoLoops();
initCursorMedia();
initMarginCalculator();
initQuoteCalculator();
initBriefForm();
initContactForm();
initFloatCards();
