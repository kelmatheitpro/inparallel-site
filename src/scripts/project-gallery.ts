/**
 * The slider a case panel opens. Every panel with a `data-gallery` list is a
 * link to its study that, with this running, opens that list instead. Middle
 * screen first; each side screen opens its own page. Keys, thumbnails, drag
 * and swipe move between them, and a tap beside the page or Escape closes it.
 *
 * Opening has the page rise in the middle of the screen rather than grow out
 * of the panel: the screens and the slides are different shapes, and a morph
 * between them stretches both.
 */
interface GalleryPage {
  src: string;
  thumb: string;
  name: string;
}

interface Gallery {
  client: string;
  host: string;
  logo: string;
  pages: GalleryPage[];
}

const RATIO = 2940 / 1670;

const pad = (n: number) => String(n).padStart(2, "0");

export function initProjectGallery() {
  const root = document.querySelector<HTMLElement>("[data-project-gallery]");
  const panels = [...document.querySelectorAll<HTMLElement>("[data-gallery]")];
  if (!root || !panels.length) return;

  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pick = <T extends HTMLElement>(name: string) =>
    root.querySelector<T>(`[data-pg-${name}]`)!;
  const dim = pick("dim");
  const logo = pick("logo");
  const count = pick("count");
  const stage = pick("stage");
  const cap = pick("cap");
  const thumbs = pick("thumbs");
  const prev = pick<HTMLButtonElement>("prev");
  const next = pick<HTMLButtonElement>("next");
  const closeButton = pick<HTMLButtonElement>("close");

  let gallery: Gallery | undefined;
  let slides: HTMLElement[] = [];
  let current = 0;
  let width = 0;
  let drag = 0;
  let opener: HTMLElement | null = null;

  const size = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const small = vw < 768;
    const room = small
      ? vw - 32
      : Math.min(1056, vw * 0.7333, vw - (vw < 992 ? 160 : 300));
    const height = Math.max(160, Math.min(room / RATIO, vh - (small ? 290 : 470)));
    width = height * RATIO;
    root.style.setProperty("--pg-w", `${width}px`);
    root.style.setProperty("--pg-h", `${height}px`);
  };

  /* Neighbours wait to the sides, smaller, and only show while they're being
     dragged in or switched to. Transform and opacity only: this runs on every
     frame of a drag. */
  const place = (animate: boolean) => {
    if (!gallery) return;
    const gap = width * 0.9;
    slides.forEach((slide, i) => {
      const offset = i - current + drag / gap;
      const away = Math.min(Math.abs(offset), 1.6);
      const near = Math.min(away, 1);
      slide.classList.toggle("is-anim", animate);
      slide.style.transform = `translateX(${offset * gap}px) scale(${1 - near * 0.16})`;
      slide.style.opacity = String(1 - near);
      slide.style.zIndex = String(10 - Math.round(away * 3));
      slide.setAttribute("aria-hidden", String(i !== current));
    });
    [...thumbs.children].forEach((thumb, i) => {
      thumb.classList.toggle("is-on", i === current);
      thumb.setAttribute("aria-current", String(i === current));
    });
    const page = gallery.pages[current]!;
    count.innerHTML = `${pad(current + 1)} / <span>${pad(gallery.pages.length)}</span>`;
    cap.innerHTML = `${page.name} <span>${gallery.host}</span>`;
    prev.disabled = current === 0;
    next.disabled = current === gallery.pages.length - 1;
  };

  const go = (index: number) => {
    if (!gallery) return;
    current = Math.max(0, Math.min(gallery.pages.length - 1, index));
    drag = 0;
    place(true);
  };

  const lock = (open: boolean) => {
    document.documentElement.classList.toggle("is-locked", open);
    document.dispatchEvent(
      new CustomEvent("inparallel:overlay", {
        detail: { id: "gallery", open },
      }),
    );
  };

  const open = (panel: HTMLElement, index: number) => {
    gallery = JSON.parse(panel.dataset.gallery ?? "null") as Gallery;
    if (!gallery?.pages.length) return;
    current = Math.max(0, Math.min(gallery.pages.length - 1, index));
    opener = panel;
    logo.innerHTML = `<img src="${gallery.logo}" alt="${gallery.client}">`;
    stage.replaceChildren();
    thumbs.replaceChildren();
    slides = gallery.pages.map((page, i) => {
      const slide = document.createElement("div");
      slide.className = "pg_slide";
      const image = document.createElement("img");
      image.src = page.src;
      image.alt = `${gallery!.client}: ${page.name}`;
      image.draggable = false;
      slide.append(image);
      stage.append(slide);

      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "pg_thumb";
      thumb.setAttribute("aria-label", `Show ${page.name}`);
      const small = document.createElement("img");
      small.src = page.thumb;
      small.alt = "";
      thumb.append(small);
      thumb.addEventListener("click", () => go(i));
      thumbs.append(thumb);
      return slide;
    });

    root.classList.add("is-open");
    lock(true);
    size();
    place(false);

    const slide = slides[current]!;
    if (!still && slide.animate) {
      const base = slide.style.transform;
      slide.animate(
        [
          { opacity: 0, transform: `${base} translateY(56px) scale(.94)` },
          { opacity: 1, transform: base },
        ],
        {
          duration: 950,
          delay: 60,
          easing: "cubic-bezier(.16,1,.3,1)",
          fill: "backwards",
        },
      );
    }
    setTimeout(() => root.classList.add("is-ready"), still ? 0 : 300);
    closeButton.focus({ preventScroll: true });
  };

  const close = () => {
    if (!root.classList.contains("is-open")) return;
    const slide = slides[current];
    root.classList.remove("is-ready");
    const done = () => {
      root.classList.remove("is-open");
      dim.style.opacity = "";
      lock(false);
      stage.replaceChildren();
      slides = [];
      gallery = undefined;
      opener?.focus({ preventScroll: true });
    };
    if (!still && slide?.animate) {
      slides.forEach((other) => {
        if (other !== slide) other.style.opacity = "0";
      });
      slide.classList.remove("is-anim");
      dim.style.opacity = "0";
      const base = slide.style.transform;
      slide.animate(
        [
          { opacity: 1, transform: base },
          { opacity: 0, transform: `${base} translateY(28px) scale(.97)` },
        ],
        {
          duration: 380,
          easing: "cubic-bezier(.4,0,.2,1)",
          fill: "forwards",
        },
      ).onfinish = done;
    } else done();
  };

  for (const panel of panels) {
    panel.addEventListener("click", (event) => {
      /* A modified click still means "open the study". */
      if (event.metaKey || event.ctrlKey || event.shiftKey) return;
      event.preventDefault();
      const screen = (event.target as Element).closest(".case-screen");
      const side = screen?.classList.contains("is-left")
        ? 1
        : screen?.classList.contains("is-right")
          ? 2
          : 0;
      open(panel, side);
    });
  }

  closeButton.addEventListener("click", close);
  dim.addEventListener("click", close);
  prev.addEventListener("click", () => go(current - 1));
  next.addEventListener("click", () => go(current + 1));

  document.addEventListener("keydown", (event) => {
    if (!root.classList.contains("is-open")) return;
    if (event.key === "Escape") close();
    else if (event.key === "ArrowRight") go(current + 1);
    else if (event.key === "ArrowLeft") go(current - 1);
    else if (event.key === "Tab") {
      /* Focus stays in the dialog. */
      const buttons = [...root.querySelectorAll<HTMLElement>("button")].filter(
        (button) =>
          !(button as HTMLButtonElement).disabled && button.offsetParent,
      );
      const first = buttons[0];
      const last = buttons.at(-1);
      /* A drag takes focus off the buttons; it comes back rather than
         escaping to the page behind. */
      if (!root.contains(document.activeElement)) {
        first?.focus();
        event.preventDefault();
        return;
      }
      if (event.shiftKey && document.activeElement === first) {
        last?.focus();
        event.preventDefault();
      } else if (!event.shiftKey && document.activeElement === last) {
        first?.focus();
        event.preventDefault();
      }
    }
  });

  window.addEventListener("resize", () => {
    if (!root.classList.contains("is-open")) return;
    size();
    place(false);
  });

  let down: { x: number; at: number } | undefined;
  let moved = false;

  stage.addEventListener("pointerdown", (event) => {
    down = { x: event.clientX, at: performance.now() };
    moved = false;
    stage.setPointerCapture(event.pointerId);
    stage.classList.add("is-drag");
  });

  stage.addEventListener("pointermove", (event) => {
    if (!down || !gallery) return;
    drag = event.clientX - down.x;
    if (Math.abs(drag) > 4) moved = true;
    const atEnd =
      (current === 0 && drag > 0) ||
      (current === gallery.pages.length - 1 && drag < 0);
    if (atEnd) drag *= 0.35;
    place(false);
  });

  const up = (event: PointerEvent) => {
    if (!down) return;
    stage.classList.remove("is-drag");
    const speed = drag / Math.max(1, performance.now() - down.at);
    const moveBy = drag;
    down = undefined;
    if (!moved) {
      const box = slides[current]?.getBoundingClientRect();
      drag = 0;
      const inside =
        box &&
        event.clientX >= box.left &&
        event.clientX <= box.right &&
        event.clientY >= box.top &&
        event.clientY <= box.bottom;
      /* The browser taking a vertical swipe back cancels the pointer: that
         isn't a tap beside the page, so it doesn't close. */
      if (inside || event.type === "pointercancel") place(true);
      else close();
      return;
    }
    if (moveBy < -width * 0.18 || speed < -0.5) go(current + 1);
    else if (moveBy > width * 0.18 || speed > 0.5) go(current - 1);
    else go(current);
  };

  stage.addEventListener("pointerup", up);
  stage.addEventListener("pointercancel", up);
}
