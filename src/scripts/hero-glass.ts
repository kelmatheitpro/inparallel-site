/**
 * Decides whether the hero glass runs, and keeps it cheap when it does.
 *
 *   <div data-glass> <div class="…_poster"> <canvas> </div>
 *
 * The live pane (`parallel-glass.ts`, loaded on demand) starts once the page
 * has loaded and the browser is idle, never for a reader who has asked for
 * less motion, never on a weak device or with Save-Data on, and only where
 * WebGL 2 is available. It renders only while the hero is on screen and the
 * tab is visible, at a device pixel ratio of at most 1 (the glass is soft
 * light, and a retina canvas costs four times the pixels for nothing), and
 * gives its context back if the page asks it to stop for good. Everywhere
 * else, and until its first frame lands, the CSS poster shows instead.
 */
import type { Glass } from "@/scripts/parallel-glass.ts";
import { lowEnd, whenShown } from "@/scripts/motion.ts";

const idle = (run: () => void) => {
  if (typeof window.requestIdleCallback === "function")
    window.requestIdleCallback(run, { timeout: 1500 });
  else window.setTimeout(run, 200);
};

const loaded = () =>
  new Promise<void>((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", () => resolve(), { once: true });
  });

export function initHeroGlass() {
  const host = document.querySelector<HTMLElement>("[data-glass]");
  const canvas = host?.querySelector("canvas");
  if (!host || !canvas) return;
  /* The page decided before first paint (an inline script in the hero)
     whether the live glass should run; without that mark, the frozen one
     is already showing. */
  if (!host.classList.contains("glass-dynamic")) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (lowEnd()) return;

  const area = host.closest<HTMLElement>("section") ?? host;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  let glass: Glass | null = null;
  let visible = true;

  const run = () => {
    if (!glass) return;
    if (visible && !document.hidden) glass.start();
    else glass.stop();
  };

  const boot = async () => {
    const { createGlass } = await import("@/scripts/parallel-glass.ts");
    const wide = canvas.clientWidth >= canvas.clientHeight;
    glass = createGlass(canvas, {
      maxDpr: 1,
      /* Landscape: the strokes stand right of the copy, further over on a
         narrower screen where the copy takes more of the width. Portrait:
         they rise behind it, high and to the right. */
      focus: wide
        ? [canvas.clientWidth < 1280 ? 0.84 : 0.72, 0.52]
        : [0.78, 0.72],
      ribAngle: 32,
      ribFrom: 90,
      onFirstFrame: () => host.classList.add("is-live"),
    });
    /* No WebGL 2 after all (or the shader wouldn't build): show the still. */
    if (!glass) {
      host.classList.remove("glass-dynamic");
      return;
    }
    run();

    new IntersectionObserver(
      ([entry]) => {
        visible = Boolean(entry?.isIntersecting);
        run();
      },
      { threshold: 0 },
    ).observe(area);
    document.addEventListener("visibilitychange", run);
    new ResizeObserver(() => glass?.resize()).observe(canvas);

    const leave = () => {
      const height = area.offsetHeight || window.innerHeight;
      glass?.leave(window.scrollY / height);
    };
    window.addEventListener("scroll", leave, { passive: true });
    leave();

    if (fine) {
      area.addEventListener(
        "pointermove",
        (event) => {
          const box = canvas.getBoundingClientRect();
          glass?.point(
            (event.clientX - box.left) / box.width,
            (event.clientY - box.top) / box.height,
          );
        },
        { passive: true },
      );
      area.addEventListener("pointerleave", () => glass?.point(null));
    }
  };

  void whenShown()
    .then(loaded)
    .then(() => idle(() => void boot()));
}
