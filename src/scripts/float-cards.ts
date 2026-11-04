/**
 * The footer's three screens: they drift by themselves (that part is CSS) and
 * shy away from the pointer. The nearer it comes the further they lean off,
 * each directly away from it, and when it leaves they spring back. The push is
 * on the outer element, so it adds to the drift rather than interrupting it.
 */
import { gsap } from "@/scripts/motion.ts";

/** How close the pointer has to come, in pixels from a card's middle. */
const REACH = 320;
/** The furthest a card leans away. */
const TRAVEL = 60;

export function initFloatCards() {
  const stage = document.querySelector<HTMLElement>("[data-float-cards]");
  if (!stage) return;

  new IntersectionObserver(([entry]) => {
    stage.classList.toggle("is-away", !entry?.isIntersecting);
  }).observe(stage);

  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!canHover || still) return;

  const area = stage.parentElement ?? stage;
  const cards = [...stage.querySelectorAll<HTMLElement>("[data-float-card]")];
  let frame = 0;

  const push = (x: number, y: number) => {
    const box = stage.getBoundingClientRect();
    for (const card of cards) {
      const dx = box.left + card.offsetLeft + card.offsetWidth / 2 - x;
      const dy = box.top + card.offsetTop + card.offsetHeight / 2 - y;
      const distance = Math.hypot(dx, dy) || 1;
      const near = Math.max(0, 1 - distance / REACH);
      gsap.to(card, {
        x: (dx / distance) * near * near * TRAVEL,
        y: (dy / distance) * near * near * TRAVEL,
        rotation: (dx / distance) * near * 7,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  };

  area.addEventListener(
    "pointermove",
    (event) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        push(event.clientX, event.clientY);
      });
    },
    { passive: true },
  );

  area.addEventListener("pointerleave", () => {
    cancelAnimationFrame(frame);
    frame = 0;
    gsap.to(cards, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 1.6,
      ease: "elastic.out(1, 0.5)",
      overwrite: "auto",
    });
  });
}
