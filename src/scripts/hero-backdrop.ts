/**
 * The light the pointer carries across the hero backdrop.
 *
 * Everything the backdrop does by itself is CSS. What needs a script is where
 * the pointer is, and that leaves as two custom properties: the light's
 * position in the section's own pixels, and how far it sits from the section's
 * centre, which each layer multiplies by a travel of its own.
 *
 * The light is eased toward the pointer a frame at a time rather than pinned to
 * it. The lag is small, but it is what makes the thing read as light thrown
 * across the scene instead of a second cursor.
 */

/** How much of the remaining distance the light covers each frame. */
const EASE = 0.14;

/**
 * The same, for the lean settling back to nothing once the pointer has gone.
 * Slow enough that the layers drift home over a couple of seconds rather than
 * snapping back the moment the light goes out.
 */
const RELEASE = 0.03;

/** Below this, in pixels, the light has arrived and the loop can stop. */
const SETTLED = 0.5;

/** And below this for the lean, which is a ratio rather than a length. */
const LEAN_SETTLED = 0.002;

/**
 * How long the light takes to fade out, from the stylesheet. Coming back
 * within it means the old light is still on screen, so the new one picks up
 * from where it is instead of jumping to the pointer.
 */
const FADE = 1200;

export function initHeroBackdrop() {
  const backdrop = document.querySelector<HTMLElement>("[data-hero-backdrop]");
  const scene = backdrop?.closest<HTMLElement>(".section");
  if (!backdrop || !scene) return;

  /* A finger has no hover to follow, and a reader who has asked for less
     motion has asked for this too. Neither answer changes without the kind of
     change that reloads the page, so both are read the once. */
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /* The pointer, in viewport coordinates, as the last event left it. The
     section's own box is read inside the frame instead, so a scroll between
     two moves can't put the light somewhere the pointer isn't. */
  let pointerX = 0;
  let pointerY = 0;
  let inside = false;
  let leftAt = -Infinity;
  let frame = 0;

  /* Where the light actually is, in the section's coordinates. */
  let lightX = 0;
  let lightY = 0;

  /* And how far the layers have leaned with it, eased apart from the light so
     that letting go of one doesn't drag the other across the section. */
  let leanX = 0;
  let leanY = 0;

  const draw = () => {
    frame = 0;

    const box = scene.getBoundingClientRect();
    let moving = false;

    /* With the pointer gone the light stays exactly where it was left and
       simply fades from there. Walking it back to the middle on the way out is
       what made it look like it was being reeled in. */
    if (inside) {
      const targetX = pointerX - box.left;
      const targetY = pointerY - box.top;

      lightX += (targetX - lightX) * EASE;
      lightY += (targetY - lightY) * EASE;

      backdrop.style.setProperty("--_pointer-x", `${lightX.toFixed(1)}px`);
      backdrop.style.setProperty("--_pointer-y", `${lightY.toFixed(1)}px`);

      moving =
        Math.abs(targetX - lightX) > SETTLED ||
        Math.abs(targetY - lightY) > SETTLED;
    }

    const leanTargetX = inside ? lightX / box.width - 0.5 : 0;
    const leanTargetY = inside ? lightY / box.height - 0.5 : 0;
    const leanEase = inside ? EASE : RELEASE;

    leanX += (leanTargetX - leanX) * leanEase;
    leanY += (leanTargetY - leanY) * leanEase;

    backdrop.style.setProperty("--_lean-x", leanX.toFixed(3));
    backdrop.style.setProperty("--_lean-y", leanY.toFixed(3));

    if (
      moving ||
      Math.abs(leanTargetX - leanX) > LEAN_SETTLED ||
      Math.abs(leanTargetY - leanY) > LEAN_SETTLED
    ) {
      schedule();
    }
  };

  const schedule = () => {
    frame ||= requestAnimationFrame(draw);
  };

  scene.addEventListener(
    "pointermove",
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;

      if (!inside) {
        /* Coming back to a light that has already gone out, it starts again
           where the pointer is; coming back to one still fading, it eases from
           where that one got to, because a jump would be visible. */
        if (performance.now() - leftAt > FADE) {
          const box = scene.getBoundingClientRect();
          lightX = pointerX - box.left;
          lightY = pointerY - box.top;
        }
        inside = true;
        backdrop.toggleAttribute("data-lit", true);
      }

      schedule();
    },
    { passive: true },
  );

  scene.addEventListener("pointerleave", () => {
    inside = false;
    leftAt = performance.now();
    backdrop.toggleAttribute("data-lit", false);
    schedule();
  });
}
