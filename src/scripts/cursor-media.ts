/**
 * The image a section carries under the pointer.
 *
 * It is hidden until the pointer is inside the section, then eased toward it a
 * frame at a time rather than pinned to it — the lag is small, but it is what
 * makes the thing read as something being carried rather than as a second
 * cursor. `hero-backdrop.ts` moves its light the same way, for the same reason.
 *
 * Position leaves as two custom properties in the section's own pixels; what
 * the image does with them is the stylesheet's business.
 */

/** How much of the remaining distance the image covers each frame. */
const EASE = 0.12;

/** Below this the image has arrived and the loop can stop. */
const SETTLED = 0.4;

export function initCursorMedia(scope: ParentNode = document) {
  const roots = [...scope.querySelectorAll<HTMLElement>("[data-cursor-media]")];
  if (!roots.length) return;

  /* A pointer that can't hover has nothing to follow, and a reader who asked
     for less motion is not asking for a picture chasing their finger. */
  if (!matchMedia("(hover: hover)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  roots.forEach((root) => {
    const media = root.querySelector<HTMLElement>("[data-cursor-media-item]");
    if (!media) return;

    let toX = 0;
    let toY = 0;
    let x = 0;
    let y = 0;
    let frame = 0;
    let started = false;

    const tick = () => {
      x += (toX - x) * EASE;
      y += (toY - y) * EASE;
      media.style.setProperty("--_x", `${x}px`);
      media.style.setProperty("--_y", `${y}px`);

      const moving = Math.abs(toX - x) > SETTLED || Math.abs(toY - y) > SETTLED;
      frame = moving ? requestAnimationFrame(tick) : 0;
    };

    root.addEventListener("pointermove", (event) => {
      const box = root.getBoundingClientRect();
      toX = event.clientX - box.left;
      toY = event.clientY - box.top;

      /* The first reading is where the image appears from, so it fades in
         under the pointer rather than flying in from the corner. */
      if (!started) {
        started = true;
        x = toX;
        y = toY;
        media.style.setProperty("--_x", `${x}px`);
        media.style.setProperty("--_y", `${y}px`);
        root.classList.add("is-carrying");
      }

      if (!frame) frame = requestAnimationFrame(tick);
    });

    root.addEventListener("pointerleave", () => {
      root.classList.remove("is-carrying");
      /* Forgotten rather than eased home: the next entry starts wherever the
         pointer comes in, which is the only place it makes sense to appear. */
      started = false;
    });
  });
}
