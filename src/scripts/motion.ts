/**
 * inParallel motion — the one chunk every animated part of the site imports.
 *
 * It holds GSAP and ScrollTrigger (Lenis loads on demand) and a
 * small data-attribute API, so a section opts in from its own markup:
 *
 *   data-anim="slash"   headings: each line is cut in along the logo's slant,
 *                       the mark's two strokes travelling just ahead of the
 *                       edge, over space that is still empty
 *   data-anim="label"   `// 01 — Work` labels: the strokes drop in, the words
 *                       type out behind them
 *   data-anim="rule"    a parallel rule (`.rule-pair`): two hairlines drawn
 *                       side by side, the second a beat behind the first
 *   data-anim="image"   media: wiped open along the slant, settling as it lands
 *   data-anim="rise"    anything else: up and in. A parent with
 *                       data-anim-group staggers its `rise` children
 *   data-anim="count"   a figure climbs to the value the markup already holds
 *   data-anim="light"   a sentence lights up word by word, in reading order
 *
 *   data-scrub="parallax" (+ data-amount)   drifts against the scroll
 *   data-scrub="slide" (+ data-amount)      runs along the slant with the scroll
 *   data-scrub="figures"                    the pinned figures on a service page
 *
 *   data-cursor="Label"  a label follows the pointer over the element
 *
 * Nothing above the fold is hidden: start states are set here, at boot, only
 * for elements that start below the viewport. Without JavaScript, or for a
 * reader who has asked for less motion, every element stays as authored.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

export { gsap, ScrollTrigger };

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

/** The logo's two strokes lean 32° off vertical; every slanted edge follows. */
export const SLANT = Math.tan((32 * Math.PI) / 180);

export const QUERIES = {
  motion: "(prefers-reduced-motion: no-preference)",
  fine: "(hover: hover) and (pointer: fine)",
  desktop: "(width >= 62rem)",
} as const;

export const matches = (query: string) => window.matchMedia(query).matches;

/** Weak devices skip the expensive work: smooth scroll, scrubs, the hero glass. */
export function lowEnd(): boolean {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return (
    (nav.deviceMemory ?? 8) <= 2 ||
    (nav.hardwareConcurrency ?? 8) <= 2 ||
    Boolean(nav.connection?.saveData)
  );
}

/** Resolves once the page is visible and no longer being prerendered. */
export function whenShown(): Promise<void> {
  const doc = document as Document & { prerendering?: boolean };
  return new Promise((resolve) => {
    const check = () => {
      if (doc.prerendering || doc.visibilityState !== "visible") return;
      document.removeEventListener("prerenderingchange", check);
      document.removeEventListener("visibilitychange", check);
      resolve();
    };
    document.addEventListener("prerenderingchange", check);
    document.addEventListener("visibilitychange", check);
    check();
  });
}

/** Fonts, but never longer than 800 ms — a late font is better than a late page. */
export const fontsReady = (): Promise<void> =>
  Promise.race([
    document.fonts?.ready,
    new Promise((resolve) => setTimeout(resolve, 800)),
  ]).then(() => undefined);

/* ------------------------------------------------------------------------ */
/* Smooth scroll                                                             */
/* ------------------------------------------------------------------------ */

let lenis: Lenis | null = null;
const overlays = new Set<string>();

export const getLenis = () => lenis;

/** Holds the page still while any overlay (menu, lightbox) is open. */
export function setOverlay(id: string, open: boolean) {
  if (open) overlays.add(id);
  else overlays.delete(id);
  if (!lenis) return;
  if (overlays.size) lenis.stop();
  else lenis.start();
}

/** Overlays announce themselves with this event: `detail: { id, open }`. */
export const OVERLAY_EVENT = "inparallel:overlay";

function remToPx(value: string): number {
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  const number = parseFloat(value);
  if (!Number.isFinite(number)) return 0;
  return value.trim().endsWith("rem") ? number * rem : number;
}

/**
 * Whether a wheel event came from a trackpad rather than a wheel with notches.
 * Browsers don't say. A continuous device reports `wheelDelta` at exactly three
 * times its pixel delta; a notched wheel reports whole notches. Once a gesture
 * is known to be continuous it stays that way until the input goes quiet, so
 * one event that happens to look notched can't switch scroller mid-flick.
 */
let continuousUntil = 0;

function isTrackpad(event: WheelEvent): boolean {
  const legacy = event as WheelEvent & { wheelDeltaY?: number };
  const continuous = legacy.wheelDeltaY
    ? Math.abs(legacy.wheelDeltaY) === Math.abs(event.deltaY) * 3
    : event.deltaMode === 0;
  const now = event.timeStamp;
  if (continuous) continuousUntil = now + 400;
  return continuous || now < continuousUntil;
}

async function startLenis(): Promise<() => void> {
  const { default: LenisClass } = await import("lenis");
  const nav = remToPx(
    getComputedStyle(document.documentElement).getPropertyValue("--nav-height"),
  );
  const instance = new LenisClass({
    lerp: 0.1,
    smoothWheel: true,
    syncTouch: false,
    autoRaf: false,
    anchors: { offset: -nav, duration: 1.1 },
    /* A wheel that clicks gets the glide; it scrolls in steps otherwise. A
       trackpad or a Magic Mouse is left to the browser: it already glides, on
       the compositor, at the display's own rate and whatever the page is doing.
       Smoothing it a second time on the main thread only makes it feel heavy,
       and any busy frame would stop the page under the reader's fingers. */
    virtualScroll: ({ event }) => event instanceof WheelEvent && !isTrackpad(event),
  });
  const tick = (time: number) => instance.raf(time * 1000);
  instance.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  /* Lenis drives the scroll from here on; the stylesheet's smooth anchor
     scrolling would fight it. */
  document.documentElement.style.scrollBehavior = "auto";
  lenis = instance;
  if (overlays.size) instance.stop();
  return () => {
    gsap.ticker.remove(tick);
    instance.destroy();
    document.documentElement.style.removeProperty("scroll-behavior");
    lenis = null;
  };
}

/* ------------------------------------------------------------------------ */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------ */

const all = <T extends HTMLElement = HTMLElement>(
  selector: string,
  root: ParentNode = document,
) => Array.from(root.querySelectorAll<T>(selector));

/** Starts below the fold: its top is under the bottom of the viewport. */
const below = (el: Element) =>
  el.getBoundingClientRect().top > window.innerHeight * 0.98;

/** Plays once, when the element's top reaches `start` — also after a jump past it. */
function once(trigger: Element, start: string, play: () => unknown) {
  const run = (self: ScrollTrigger) => {
    self.kill();
    play();
  };
  return ScrollTrigger.create({
    trigger,
    start: `top ${start}`,
    onEnter: run,
    onLeave: run,
  });
}

/**
 * The wipe pictures come in with: everything left of an edge that leans at
 * the logo's angle. `--x` is the edge at the foot, `--o` its lead at the top.
 */
/** The two strokes of the mark, as a small inline marker. */
function strokes(className: string): HTMLSpanElement {
  const mark = document.createElement("span");
  mark.className = `slash-mark ${className}`;
  mark.setAttribute("aria-hidden", "true");
  mark.append(document.createElement("i"), document.createElement("i"));
  return mark;
}

/* ------------------------------------------------------------------------ */
/* Reveals                                                                   */
/* ------------------------------------------------------------------------ */

function rise(targets: HTMLElement[], stagger: number) {
  gsap.set(targets, { opacity: 0, y: "1.75rem" });
  return () =>
    gsap.to(targets, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "expo.out",
      stagger,
      clearProps: "opacity,transform",
    });
}

const slashTriggers = new WeakMap<Element, ScrollTrigger>();

/** Whether the head decided intros run on this page view (see the layout). */
const introsOn = () => document.documentElement.classList.contains("intro");

/**
 * One line of a heading, as the cut sees it: where its words start and end,
 * the band of the heading it owns, and the height its letters actually take.
 */
interface Band {
  top: number;
  bottom: number;
  start: number;
  end: number;
  /** Where a blade may run: this line's letters, clear of its neighbours'. */
  bladeTop: number;
  bladeBottom: number;
}

/**
 * A heading's lines, read off the text itself — nothing is split or wrapped.
 * Each band runs from halfway to the line above to halfway to the line below
 * (the first and last reach `pad` past their letters, for ascenders,
 * descenders and an italic's overhang), so together the bands cover the
 * heading and no two overlap.
 */
function bandsOf(el: HTMLElement, pad: number): Band[] {
  const box = el.getBoundingClientRect();
  const range = document.createRange();
  range.selectNodeContents(el);
  const rows: { l: number; r: number; t: number; b: number }[] = [];
  for (const rect of Array.from(range.getClientRects())) {
    if (rect.width < 1 || rect.height < 1) continue;
    const middle = (rect.top + rect.bottom) / 2;
    const row = rows.find((r) => middle > r.t && middle < r.b);
    if (row) {
      row.l = Math.min(row.l, rect.left);
      row.r = Math.max(row.r, rect.right);
      row.t = Math.min(row.t, rect.top);
      row.b = Math.max(row.b, rect.bottom);
    } else
      rows.push({ l: rect.left, r: rect.right, t: rect.top, b: rect.bottom });
  }
  rows.sort((a, b) => a.t - b.t);
  return rows.map((row, i) => {
    const prev = rows[i - 1];
    const next = rows[i + 1];
    const height = row.b - row.t;
    /* A blade stays inside its own line's letters and below the line
       above's (descenders included) — on a tight heading the two lines'
       font boxes overlap, and a blade in that overlap would graze the
       line above's tails. The same at the foot, against the line below. */
    let bladeTop = Math.max(row.t + height * 0.08, prev ? prev.b : -Infinity);
    let bladeBottom = Math.min(row.b - height * 0.1, next ? next.t : Infinity);
    if (bladeBottom - bladeTop < height * 0.35) {
      bladeTop = row.t + height * 0.3;
      bladeBottom = row.b - height * 0.25;
    }
    return {
      top: (prev ? (prev.b + row.t) / 2 : row.t - pad) - box.top,
      bottom: (next ? (row.b + next.t) / 2 : row.b + pad) - box.top,
      start: row.l - box.left,
      end: row.r - box.left,
      bladeTop: bladeTop - box.top,
      bladeBottom: bladeBottom - box.top,
    };
  });
}

/**
 * The clip for a cut in progress: every band shows what lies left of its own
 * slanted edge. `edges[i]` is where band i's edge meets the band's foot; the
 * edge's top runs ahead of that by the band's height times the slant.
 */
function cutPath(bands: Band[], edges: number[], left: number) {
  const points = [`${left}px ${bands[0]!.top}px`];
  bands.forEach((band, i) => {
    const lean = (band.bottom - band.top) * SLANT;
    points.push(
      `${edges[i]! + lean}px ${band.top}px`,
      `${edges[i]!}px ${band.bottom}px`,
    );
  });
  points.push(`${left}px ${bands.at(-1)!.bottom}px`);
  return `polygon(${points.join(", ")})`;
}

/**
 * The signature cut. Each line of the heading is uncovered by an edge that
 * leans at the logo's angle, a beat after the line above it — side by side,
 * the way the name says — with the mark's two strokes travelling just ahead
 * of the edge like a blade. A blade is kept to its own line's letters and
 * only ever crosses space that line hasn't shown yet: never a letter you can
 * read, never the line above, never the text below.
 *
 * Nothing is split: the heading keeps its own text and its own fill, and is
 * measured when the cut starts, so late fonts or a resized column can't
 * leave it measured wrong.
 */
function cut(el: HTMLElement) {
  const em = parseFloat(getComputedStyle(el).fontSize) || 16;
  const bands = bandsOf(el, em * 0.32);
  if (!bands.length) {
    el.style.removeProperty("clip-path");
    return gsap.timeline();
  }
  const gap = em * 0.07;
  const edges = bands.map(
    (band) => band.start - (band.bottom - band.top) * SLANT,
  );
  const left = Math.min(0, ...edges) - em;
  const paint = () => {
    el.style.clipPath = cutPath(bands, edges, left);
  };

  const staticPosition = getComputedStyle(el).position === "static";
  if (staticPosition) el.style.position = "relative";
  const blades: HTMLElement[] = [];

  const tl = gsap.timeline({
    onUpdate: paint,
    onComplete: () => {
      blades.forEach((blade) => blade.remove());
      el.style.removeProperty("clip-path");
      if (staticPosition) el.style.removeProperty("position");
    },
  });

  bands.forEach((band, i) => {
    const top = Math.max(band.top, band.bladeTop);
    const bottom = Math.min(band.bottom, band.bladeBottom);
    const blade = strokes("slash-blade");
    blade.style.top = `${top}px`;
    blade.style.height = `${bottom - top}px`;
    el.append(blade);
    blades.push(blade);
    /* The blade's foot sits a little above the band's, so it starts that
       much further along the edge to stay parallel with it, `gap` ahead. */
    const offset = (band.bottom - bottom) * SLANT + gap;
    const place = () => {
      blade.style.translate = `${edges[i]! + offset}px 0`;
    };
    place();

    const edge = { x: edges[i]! };
    const at = i * 0.1;
    const duration = 0.7 + Math.min((band.end - band.start) / 3000, 0.3);
    const follow = () => {
      edges[i] = edge.x;
      place();
    };
    tl.to(
      edge,
      { x: band.end + 2, duration, ease: "power3.inOut", onUpdate: follow },
      at,
    )
      .to(blade, { opacity: 1, duration: 0.16, ease: "power1.out" }, at)
      .to(
        edge,
        {
          x: band.end + 2 + gap * 2,
          duration: 0.24,
          ease: "power1.out",
          onUpdate: follow,
        },
        at + duration,
      )
      .to(
        blade,
        { opacity: 0, duration: 0.24, ease: "power1.in" },
        at + duration,
      );
  });
  paint();
  return tl;
}

/**
 * Hides a heading until its cut, then cuts it in. An `intro` heading
 * (`data-intro`) was hidden by the stylesheet from the first paint, so it
 * never shows and then vanishes; it is cut in as soon as it's ready — unless
 * the stylesheet's failsafe has already shown it, in which case it stays as
 * it is. Any other heading is hidden here and cut in when the reader gets
 * there.
 */
function slash(el: HTMLElement, intro = false) {
  if (intro) {
    if (getComputedStyle(el).visibility === "visible") {
      el.classList.add("is-armed");
      return;
    }
    el.style.clipPath = "inset(0 100% 0 0)";
    el.classList.add("is-armed");
    gsap.delayedCall(0.12, () => cut(el));
    return;
  }
  el.style.clipPath = "inset(0 100% 0 0)";
  const play = () => cut(el);
  slashTriggers.get(el)?.kill();
  slashTriggers.set(el, once(el, "85%", play));
}

function label(el: HTMLElement) {
  const mark = el.querySelector<HTMLElement>(".label_slash");
  const text = el.querySelector<HTMLElement>(".label_text") ?? el;
  if (mark) gsap.set(mark, { opacity: 0, x: "-0.5em", skewX: -20 });
  gsap.set(text, { clipPath: "inset(0 100% 0 0)" });
  return () => {
    const tl = gsap.timeline();
    if (mark)
      tl.to(
        mark,
        {
          opacity: 1,
          x: 0,
          skewX: 0,
          duration: 0.6,
          ease: "back.out(2)",
          clearProps: "all",
        },
        0,
      );
    /* Stepped, so the words arrive a few characters at a time, like typing. */
    const chars = Math.max(4, (text.textContent ?? "").trim().length);
    tl.to(
      text,
      {
        clipPath: "inset(0 0% 0 0)",
        duration: Math.min(0.9, chars * 0.035),
        ease: `steps(${Math.min(chars, 24)})`,
        clearProps: "clipPath",
      },
      0.15,
    );
    return tl;
  };
}

function rule(el: HTMLElement) {
  const lines = all(":scope > i", el);
  const targets = lines.length ? lines : [el];
  gsap.set(targets, { scaleX: 0, transformOrigin: "0 50%" });
  return () =>
    gsap.to(targets, {
      scaleX: 1,
      duration: 1.2,
      ease: "power3.inOut",
      stagger: 0.12,
      clearProps: "transform",
    });
}

/** The first solid colour behind an element: what a cover has to match. */
function surface(el: HTMLElement) {
  for (let node = el.parentElement; node; node = node.parentElement) {
    const { backgroundColor } = getComputedStyle(node);
    if (!/^(transparent|rgba\(.*, 0\))$/.test(backgroundColor))
      return backgroundColor;
  }
  return "transparent";
}

/**
 * A picture wiped open along the slant, by a sheet of the page's own colour
 * sliding off it rather than by a clip closing in. Both look the same; the clip
 * would repaint the picture on every frame, and the sheet only moves, which the
 * compositor does for free however large the picture is.
 */
function image(el: HTMLElement) {
  const inner = el.querySelector("img, picture, video, canvas");
  const sheet = document.createElement("span");
  sheet.className = "image-sheet";
  sheet.setAttribute("aria-hidden", "true");
  sheet.style.backgroundColor = surface(el);
  if (getComputedStyle(el).position === "static") el.style.position = "relative";
  el.style.overflow = "clip";
  el.append(sheet);
  if (inner) gsap.set(inner, { scale: 1.1 });
  return () => {
    const tl = gsap.timeline();
    if (inner)
      tl.to(
        inner,
        { scale: 1, duration: 1.3, ease: "expo.out", clearProps: "transform" },
        0,
      );
    tl.to(
      sheet,
      {
        xPercent: 100,
        duration: 1.35,
        ease: "expo.inOut",
        onComplete: () => {
          sheet.remove();
          el.style.removeProperty("overflow");
        },
      },
      0,
    );
    return tl;
  };
}

/** `100+` climbs to a hundred and keeps its plus; `∞` is left alone. */
const FIGURE = /^(\D*?)(\d[\d.,]*)(.*)$/s;

function count(el: HTMLElement) {
  const parts = FIGURE.exec(el.textContent ?? "");
  if (!parts) return () => undefined;
  const [, before = "", digits = "", after = ""] = parts;
  const target = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(target)) return () => undefined;
  const decimals = digits.split(".")[1]?.length ?? 0;
  const grouped = digits.includes(",");
  const final = el.textContent;
  const write = (value: number) => {
    const fixed = value.toFixed(decimals);
    el.textContent = `${before}${
      grouped
        ? Number(fixed).toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : fixed
    }${after}`;
  };
  write(0);
  return () => {
    const state = { value: 0 };
    return gsap.to(state, {
      value: target,
      duration: 1.6,
      ease: "expo.out",
      onUpdate: () => write(state.value),
      onComplete: () => {
        el.textContent = final;
      },
    });
  };
}

/**
 * A sentence that lights up in reading order: every word starts dim and comes
 * up a moment after the one before. Split into words rather than letters so
 * nothing about the type changes, which is what lets the markup go back exactly
 * as written afterwards without a line moving.
 */
function light(el: HTMLElement) {
  const original = el.innerHTML;
  const words: HTMLElement[] = [];
  const split = (node: Node) => {
    for (const child of [...node.childNodes]) {
      if (child.nodeType !== Node.TEXT_NODE) {
        split(child);
        continue;
      }
      const parts = document.createDocumentFragment();
      for (const part of (child.textContent ?? "").split(/(\s+)/)) {
        if (!part.trim()) {
          parts.append(part);
          continue;
        }
        const word = document.createElement("span");
        word.textContent = part;
        word.style.opacity = "0.3";
        words.push(word);
        parts.append(word);
      }
      child.replaceWith(parts);
    }
  };
  split(el);
  return () =>
    gsap.to(words, {
      opacity: 1,
      duration: 0.45,
      ease: "none",
      stagger: Math.min(0.09, 1.5 / words.length),
      onComplete: () => {
        el.innerHTML = original;
      },
    });
}

const REVEALS: Record<
  string,
  [start: string, prep: (el: HTMLElement) => () => unknown]
> = {
  label: ["90%", label],
  rule: ["92%", rule],
  image: ["82%", image],
  count: ["88%", count],
  light: ["80%", light],
};

/**
 * A group's items rise together when they arrive together — a row of cards
 * on a wide screen — and one by one when they arrive one by one, stacked on
 * a phone. Whatever reaches the line in the same frame is staggered as one.
 */
function riseGroup(items: HTMLElement[], stagger: number) {
  gsap.set(items, { opacity: 0, y: "1.75rem" });
  let queue: HTMLElement[] = [];
  let frame = 0;
  const flush = () => {
    frame = 0;
    const batch = queue;
    queue = [];
    gsap.to(batch, {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: "expo.out",
      stagger,
      clearProps: "opacity,transform",
    });
  };
  for (const item of items)
    once(item, "88%", () => {
      queue.push(item);
      frame ||= requestAnimationFrame(flush);
    });
}

function reveals(root: ParentNode) {
  for (const group of all("[data-anim-group]", root)) {
    const items = all('[data-anim="rise"]', group).filter(below);
    if (items.length) riseGroup(items, Number(group.dataset.stagger) || 0.08);
  }
  for (const el of all('[data-anim="rise"]', root)) {
    if (el.closest("[data-anim-group]") || !below(el)) continue;
    once(el, "88%", rise([el], 0));
  }
  for (const el of all('[data-anim="slash"]', root)) {
    /* A heading on screen at first paint is left exactly as it is — taking
       away words someone may already be reading is worse than any entrance —
       unless it's an intro, which the stylesheet kept hidden for this. */
    const intro = el.hasAttribute("data-intro") && introsOn();
    if (intro || below(el)) slash(el, intro);
  }
  let introAt = 0;
  for (const el of all("[data-anim]", root)) {
    const entry = REVEALS[el.dataset.anim ?? ""];
    if (!entry) continue;
    const [start, prep] = entry;
    /* An intro label or rule plays as the page arrives, in document order;
       the stylesheet has kept it hidden until now. */
    if (el.hasAttribute("data-intro") && introsOn()) {
      const play = prep(el);
      el.classList.add("is-armed");
      gsap.delayedCall(0.05 + introAt++ * 0.08, play);
      continue;
    }
    /* The same rule for labels, rules and the rest: what was already painted
       stays exactly as it is. */
    if (!below(el)) continue;
    once(el, start, prep(el));
  }
}

/* ------------------------------------------------------------------------ */
/* Scrubs                                                                    */
/* ------------------------------------------------------------------------ */

function scrubs(root: ParentNode, fine: boolean) {
  for (const el of all("[data-scrub]", root)) {
    const kind = el.dataset.scrub;
    const amount = Number(el.dataset.amount) || 6;
    if (kind === "parallax" && fine) {
      gsap.fromTo(
        el,
        { yPercent: amount },
        {
          yPercent: -amount,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    } else if (kind === "slide") {
      /* Along the slant: as far across as it travels down. */
      gsap.fromTo(
        el,
        { x: () => -amount * 16 * SLANT, y: () => amount * 16 },
        {
          x: () => amount * 16 * SLANT,
          y: () => -amount * 16,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );
    } else if (kind === "figures") {
      figures(el);
    } else if (kind === "converge" && fine && matches(QUERIES.desktop)) {
      /* Two strokes arriving along their own lean, from opposite ends, and
         settling into line as the section reaches the middle of the screen.
         The travel is a fraction of the room around them, so nothing they
         carry ever reaches the content above or below. */
      const travel = Number(el.dataset.amount) || 40;
      const direction = Number(el.dataset.direction) || 1;
      gsap.fromTo(
        el,
        { x: -direction * travel * SLANT, y: direction * travel },
        {
          x: 0,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el.parentElement ?? el,
            start: "top 92%",
            end: "center 58%",
            scrub: 0.8,
          },
        },
      );
    }
  }
}

/**
 * The figures behind a service: the stage pins while the room under it scrolls,
 * and the scroll draws one lane after another round the mark, each closing on
 * its own figure. Everything is drawn in the markup: this takes it back to
 * nothing first, so without it the section is simply a finished picture.
 */
function figures(el: HTMLElement) {
  const lanes = all("[data-figure-lane]", el);
  const leads = all("[data-figure-lead]", el);
  const nodes = all("[data-figure-node]", el);
  const items = all("[data-figure]", el);
  const outline = all("[data-figure-outline]", el);
  const fill = all("[data-figure-fill]", el);
  if (!lanes.length) return;

  el.classList.add("is-running");
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
    },
  });

  timeline.fromTo(
    outline,
    { strokeDashoffset: 1 },
    { strokeDashoffset: 0, duration: lanes.length + 0.6 },
    0,
  );
  lanes.forEach((lane, index) => {
    const start = index * 1.05;
    timeline
      .set(lane, { opacity: 1 }, start)
      .fromTo(
        lane,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1, ease: "power1.inOut" },
        start,
      )
      .fromTo(
        nodes[index] ?? [],
        { opacity: 0, scale: 0.4, transformOrigin: "50% 50%" },
        { opacity: 1, scale: 1, duration: 0.15 },
        start + 0.9,
      )
      .fromTo(
        leads[index] ?? [],
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.25 },
        start + 0.92,
      )
      .fromTo(
        items[index] ?? [],
        { autoAlpha: 0.14, x: 14 },
        { autoAlpha: 1, x: 0, duration: 0.25 },
        start + 1,
      );
  });
  timeline
    .fromTo(
      fill,
      { opacity: 0.08 },
      { opacity: 1, duration: 0.5 },
      lanes.length * 1.05,
    )
    .to({}, { duration: 0.35 });
}

/* ------------------------------------------------------------------------ */
/* Cursor label                                                              */
/* ------------------------------------------------------------------------ */

function cursorLabel(root: ParentNode): (() => void) | undefined {
  const targets = all("[data-cursor]", root);
  if (!targets.length) return;
  const pill = document.createElement("div");
  pill.className = "cursor-label";
  pill.setAttribute("aria-hidden", "true");
  const body = document.createElement("span");
  body.className = "cursor-label_pill";
  const mark = strokes("cursor-label_mark");
  const text = document.createElement("span");
  body.append(mark, text);
  pill.append(body);
  document.body.append(pill);
  const x = gsap.quickTo(pill, "x", { duration: 0.5, ease: "power3" });
  const y = gsap.quickTo(pill, "y", { duration: 0.5, ease: "power3" });
  const move = (event: PointerEvent) => {
    x(event.clientX);
    y(event.clientY);
  };
  const enter = (event: PointerEvent) => {
    const target = event.currentTarget as HTMLElement;
    text.textContent = target.dataset.cursor ?? "";
    gsap.set(pill, { x: event.clientX, y: event.clientY });
    pill.classList.add("is-on");
  };
  const leave = () => pill.classList.remove("is-on");
  window.addEventListener("pointermove", move, { passive: true });
  for (const el of targets) {
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointerleave", leave);
  }
  return () => {
    window.removeEventListener("pointermove", move);
    for (const el of targets) {
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerleave", leave);
    }
    pill.remove();
  };
}

/* ------------------------------------------------------------------------ */
/* Boot                                                                      */
/* ------------------------------------------------------------------------ */

let booted = false;

/** Starts smooth scrolling and every reveal and scrub on the page. Safe to call twice. */
export async function initMotion(root: ParentNode = document) {
  if (booted) return;
  booted = true;

  document.addEventListener(OVERLAY_EVENT, (event) => {
    const { id, open } =
      (event as CustomEvent<{ id: string; open: boolean }>).detail ?? {};
    if (id) setOverlay(id, Boolean(open));
  });

  await whenShown();
  await fontsReady();
  const low = lowEnd();
  const mm = gsap.matchMedia();
  /* Only what changes how motion behaves restarts it. Width doesn't: crossing
     a breakpoint (turning a tablet) must not hide and replay what the reader
     has already seen. */
  const conditions = { motion: QUERIES.motion, fine: QUERIES.fine };
  mm.add(conditions, (context) => {
    const { motion, fine } = context.conditions as Record<
      keyof typeof conditions,
      boolean
    >;
    if (!motion) return;
    let stopLenis: (() => void) | undefined;
    let cancelled = false;
    if (fine && !low)
      void startLenis().then((stop) =>
        cancelled ? stop() : (stopLenis = stop),
      );
    reveals(root);
    if (!low) scrubs(root, fine);
    const stopCursor = fine ? cursorLabel(root) : undefined;
    ScrollTrigger.refresh();

    /* When the page changes height after this — an image arriving late, a
       font swap, an accordion — every trigger below the change is measured
       against a position that no longer exists, and something could wait
       hidden in plain view. Re-measure, a moment after things settle. */
    let settle = 0;
    const heights = new ResizeObserver(() => {
      window.clearTimeout(settle);
      /* `true` holds it until the scroll stops: re-measuring everything in the
         middle of a flick is a dropped frame the reader would feel. */
      settle = window.setTimeout(() => ScrollTrigger.refresh(true), 200);
    });
    heights.observe(document.body);

    return () => {
      cancelled = true;
      heights.disconnect();
      window.clearTimeout(settle);
      stopLenis?.();
      stopCursor?.();
      /* Anything still waiting for its cut is let go, whole. */
      for (const el of all("[data-anim='slash']", root)) {
        el.style.removeProperty("clip-path");
        el.classList.add("is-armed");
        el.querySelectorAll(".slash-blade").forEach((blade) => blade.remove());
      }
    };
  });
}
