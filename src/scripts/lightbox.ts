/**
 * The video dialog.
 *
 * One `<dialog>` serves every play button on the page: each trigger carries
 * what to show on `data-` attributes and the dialog reads them as it opens.
 */
export function initLightbox() {
  const dialog = document.querySelector<HTMLDialogElement>("[data-lightbox]");
  if (!dialog || typeof dialog.showModal !== "function") return;

  const video = dialog.querySelector<HTMLVideoElement>("[data-lightbox-video]");
  const frame = dialog.querySelector<HTMLIFrameElement>(
    "[data-lightbox-frame]",
  );
  const poster = dialog.querySelector<HTMLImageElement>(
    "[data-lightbox-poster]",
  );
  const caption = dialog.querySelector<HTMLElement>("[data-lightbox-caption]");
  if (!video || !frame || !poster || !caption) return;

  const open = (trigger: HTMLElement) => {
    const src = trigger.dataset.video;
    const youtube = trigger.dataset.youtube;
    const still = trigger.dataset.poster;
    const text = trigger.dataset.caption ?? "";

    caption.textContent = text;
    dialog.setAttribute("aria-label", text || "Video");

    video.hidden = true;
    frame.hidden = true;
    poster.hidden = true;

    if (youtube) {
      /* Sound on and controls showing: the muted loop on the card is the
         trailer, this is the thing itself. */
      frame.src = `https://www.youtube-nocookie.com/embed/${youtube}?autoplay=1&rel=0&modestbranding=1&playsinline=1&cc_load_policy=0`;
      frame.hidden = false;
    } else if (src) {
      video.src = src;
      if (still) video.poster = still;
      video.hidden = false;
    } else {
      /* No file for this one yet, so the dialog shows the still it was opened
         from rather than an empty player. */
      poster.hidden = !still;
      if (still) poster.src = still;
    }

    dialog.showModal();
    if (src && !youtube) video.play().catch(() => {});
  };

  const close = () => {
    video.pause();
    video.removeAttribute("src");
    video.load();
    /* Emptying the frame is what stops a YouTube clip: it keeps playing, sound
       and all, for as long as it is loaded. */
    frame.removeAttribute("src");
    frame.hidden = true;
    dialog.close();
  };

  document
    .querySelectorAll<HTMLElement>("[data-lightbox-open]")
    .forEach((trigger) =>
      trigger.addEventListener("click", () => open(trigger)),
    );

  dialog
    .querySelector("[data-lightbox-close]")
    ?.addEventListener("click", close);

  /* A click on the backdrop lands on the dialog itself, never on its contents,
     which is what separates the two here. */
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) close();
  });

  /* Escape closes the dialog without going through the button. */
  dialog.addEventListener("close", () => {
    video.pause();
    video.removeAttribute("src");
    frame.removeAttribute("src");
    frame.hidden = true;
  });
}
