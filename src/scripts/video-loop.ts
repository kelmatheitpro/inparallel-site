/**
 * The muted clips that play behind cards.
 *
 * A YouTube frame set to autoplay starts downloading and decoding the moment it
 * is in the document, wherever the page happens to be scrolled. So none of them
 * are in the document: the frame is built when its card comes within a screen of
 * the viewport, and paused again once the card has gone. What the markup ships
 * is a still.
 *
 * The frame is also kept invisible until the player says it is playing, rather
 * than when it finishes loading. A player that hasn't started yet is not a black
 * rectangle — it is YouTube's own poster, title bar and play button — so a
 * browser that refuses to autoplay would otherwise put all of that in the middle
 * of the card. Waiting for the state means the still simply stays, and the
 * button over it opens the clip in full as it always did.
 *
 * Play, pause and the state itself go over `postMessage`, which the player
 * answers once it is asked to with `enablejsapi`. No reason to load YouTube's
 * API for three messages.
 */

/** Cookie-less host: the frame only sets storage once someone plays it. */
const ORIGIN = "https://www.youtube-nocookie.com";

/** How far ahead of the viewport a clip is built, so it is running on arrival. */
const LEAD = "300px";

/** YouTube's state for a player that is actually running. */
const PLAYING = 1;

/**
 * How long after it starts the frame is shown.
 *
 * The player puts its own title bar over the first moment of playback and then
 * fades it out. Holding the still over that means what appears is the clip,
 * not a YouTube card with a title on it.
 */
const REVEAL = 1400;

export function initVideoLoops() {
  const loops = [
    ...document.querySelectorAll<HTMLElement>("[data-video-loop]"),
  ];
  if (!loops.length) return;

  /* Asked for less motion, the still is the whole of it. The button over the
     top still opens the clip, which is a thing chosen rather than a thing that
     happens at you. */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /** Reveals waiting on the player's title bar to get out of the way. */
  const reveals = new Map<HTMLElement, number>();

  const post = (loop: HTMLElement, message: object) => {
    loop
      .querySelector("iframe")
      ?.contentWindow?.postMessage(JSON.stringify(message), ORIGIN);
  };

  const command = (loop: HTMLElement, func: "playVideo" | "pauseVideo") =>
    post(loop, { event: "command", func, args: [] });

  const build = (loop: HTMLElement) => {
    const id = loop.dataset.youtube;
    if (!id) return;

    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      /* A single video loops only against a playlist, and its own id is the
         playlist of one. */
      loop: "1",
      playlist: id,
      controls: "0",
      /* The recording carries its own captions, burnt into the picture. The
         player's would be a second set stacked over them. */
      cc_load_policy: "0",
      disablekb: "1",
      fs: "0",
      modestbranding: "1",
      rel: "0",
      playsinline: "1",
      enablejsapi: "1",
      origin: window.location.origin,
    });

    const frame = document.createElement("iframe");
    frame.src = `${ORIGIN}/embed/${id}?${params}`;
    frame.title = "";
    /* The card is out of the accessibility tree and the button beside it
       carries the name, so the frame must be out of the tab order too. */
    frame.tabIndex = -1;
    frame.setAttribute("allow", "autoplay; encrypted-media");
    /* Nothing is heard from the player until it is asked to talk. */
    frame.addEventListener("load", () => post(loop, { event: "listening" }));

    loop.append(frame);
  };

  window.addEventListener("message", (event) => {
    if (event.origin !== ORIGIN) return;

    const loop = loops.find(
      (candidate) =>
        candidate.querySelector("iframe")?.contentWindow === event.source,
    );
    if (!loop) return;

    let message: { event?: string; info?: unknown };
    try {
      message =
        typeof event.data === "string" ? JSON.parse(event.data) : event.data;
    } catch {
      return;
    }

    /* The state arrives as `onStateChange` and again inside the player's
       running `infoDelivery` chatter; either will do. */
    const info = message?.info;
    const state =
      typeof info === "object" && info !== null
        ? (info as { playerState?: number }).playerState
        : info;

    if (typeof state !== "number") return;

    if (state !== PLAYING) {
      window.clearTimeout(reveals.get(loop));
      reveals.delete(loop);
      loop.toggleAttribute("data-playing", false);
      return;
    }

    if (loop.hasAttribute("data-playing") || reveals.has(loop)) return;
    reveals.set(
      loop,
      window.setTimeout(() => {
        reveals.delete(loop);
        loop.toggleAttribute("data-playing", true);
      }, REVEAL),
    );
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const loop = entry.target as HTMLElement;
        if (!entry.isIntersecting) {
          command(loop, "pauseVideo");
        } else if (loop.querySelector("iframe")) {
          command(loop, "playVideo");
        } else {
          build(loop);
        }
      });
    },
    { rootMargin: LEAD },
  );

  loops.forEach((loop) => observer.observe(loop));
}
