/**
 * Scroll reveals, and the numbers that count up as they arrive.
 *
 * Both are driven by attributes rather than by a component, so a section opts
 * in from its own markup and nothing here needs to know what it is revealing.
 *
 * The class goes on whatever the reader's motion preference is. The stylesheet
 * already takes every transition down to nothing under
 * `prefers-reduced-motion`, so a reveal held back for those readers would leave
 * its content hidden for good rather than merely still. What is skipped for
 * them instead is the counting — motion with no resting state of its own — and
 * those numbers are simply left as the markup already writes them.
 */

/** How far into the viewport an element comes before it is revealed. */
const ROOT_MARGIN = "0px 0px -12% 0px";

/** How long a number takes to climb to the value the markup already holds. */
const COUNT_DURATION = 1400;

/**
 * Splits a written-out figure into the number to climb to and whatever sits
 * either side of it, so `100+` counts to a hundred and keeps its plus, and
 * a value with no digits at all — the infinity sign — is left alone.
 */
const FIGURE = /^(\D*?)(\d[\d.,]*)(.*)$/s;

const easeOut = (t: number) => 1 - (1 - t) ** 3;

export function initReveal(scope: ParentNode = document) {
  const targets = [...scope.querySelectorAll<HTMLElement>("[data-reveal]")];
  if (!targets.length) return;

  const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        /* Once revealed, it stays revealed: scrolling back past a section
           shouldn't replay it. */
        observer.unobserve(entry.target);
        reveal(entry.target as HTMLElement, still);
      }
    },
    { rootMargin: ROOT_MARGIN, threshold: 0 },
  );

  for (const target of targets) observer.observe(target);
}

function reveal(target: HTMLElement, still: boolean) {
  target.classList.add("is-revealed");
  if (still) return;

  /* A counter inside a reveal starts with it; one that is its own reveal
     target counts for itself. */
  const figures = [...target.querySelectorAll<HTMLElement>("[data-count]")];
  if (target.hasAttribute("data-count")) figures.push(target);
  for (const figure of figures) count(figure);
}

function count(figure: HTMLElement) {
  const parts = FIGURE.exec(figure.textContent ?? "");
  if (!parts) return;

  const [, before = "", digits = "", after = ""] = parts;
  const target = Number(digits.replace(/,/g, ""));
  if (!Number.isFinite(target)) return;

  const decimals = digits.split(".")[1]?.length ?? 0;
  const grouped = digits.includes(",");
  const started = performance.now();

  const write = (value: number) => {
    const fixed = value.toFixed(decimals);
    figure.textContent = `${before}${
      grouped
        ? Number(fixed).toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          })
        : fixed
    }${after}`;
  };

  const step = (now: number) => {
    const progress = Math.min((now - started) / COUNT_DURATION, 1);
    write(target * easeOut(progress));
    if (progress < 1) requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
}
