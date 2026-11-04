/**
 * The header: the mobile panel, the Services dropdown, and the solid-bar state
 * the overlapping nav takes once the page has moved.
 */
export function initNav() {
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  const toggle = nav?.querySelector<HTMLButtonElement>(".nav_toggle");
  if (!nav || !toggle) return;

  const dropdowns = [...nav.querySelectorAll<HTMLElement>("[data-dropdown]")];
  /* The breakpoint where every link sits in the bar. */
  const wide = window.matchMedia("(width >= 62rem)");

  const closeDropdowns = (except?: HTMLElement) => {
    dropdowns.forEach((dropdown) => {
      if (dropdown === except) return;
      dropdown.removeAttribute("data-open");
      dropdown
        .querySelector(".nav_disclosure")
        ?.setAttribute("aria-expanded", "false");
    });
  };

  const setOpen = (open: boolean) => {
    nav.toggleAttribute("data-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    if (!open) closeDropdowns();
    /* The page holds still under the open menu: no native scroll behind it
       (a phone), and smooth scrolling paused (a desktop narrowed down). */
    document.documentElement.classList.toggle("is-locked", open);
    document.dispatchEvent(
      new CustomEvent("inparallel:overlay", { detail: { id: "menu", open } }),
    );
  };

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  dropdowns.forEach((dropdown) => {
    const trigger =
      dropdown.querySelector<HTMLButtonElement>(".nav_disclosure");
    trigger?.addEventListener("click", () => {
      const open = trigger.getAttribute("aria-expanded") === "true";
      closeDropdowns(dropdown);
      dropdown.toggleAttribute("data-open", !open);
      trigger.setAttribute("aria-expanded", String(!open));
    });

    /* A panel opened from the keyboard goes when focus moves on past it. In
       the mobile menu it's part of the list: closing it there would pull the
       next links out from under the reader. */
    dropdown.addEventListener("focusout", (event) => {
      const next = event.relatedTarget;
      if (wide.matches && next instanceof Node && !dropdown.contains(next))
        closeDropdowns();
    });
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  /* An open menu is the whole page: Tab goes round the header and never into
     the locked page behind it, which focus would otherwise scroll. */
  const holdFocus = (event: KeyboardEvent) => {
    const stops = [
      ...nav.querySelectorAll<HTMLElement>("a[href], button"),
    ].filter((stop) => stop.getClientRects().length);
    const first = stops[0];
    const last = stops.at(-1);
    const current = document.activeElement;
    if (!first || !last) return;
    if (!nav.contains(current) || (!event.shiftKey && current === last)) {
      event.preventDefault();
      first.focus();
    } else if (event.shiftKey && current === first) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && nav.hasAttribute("data-open")) holdFocus(event);
    if (event.key !== "Escape") return;
    if (nav.querySelector("[data-dropdown][data-open]")) {
      const trigger = nav.querySelector<HTMLButtonElement>(
        "[data-dropdown][data-open] .nav_disclosure",
      );
      closeDropdowns();
      trigger?.focus();
    } else if (nav.hasAttribute("data-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  /* A click on the toggle lands inside the nav, so it stays its own job. */
  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Node) || nav.contains(target)) return;
    closeDropdowns();
    if (nav.hasAttribute("data-open")) setOpen(false);
  });

  /* Past this width every link is in the bar anyway. Only a menu that is open
     lets go of the page: a dialog may be holding it too. */
  wide.addEventListener("change", (event) => {
    if (event.matches && nav.hasAttribute("data-open")) setOpen(false);
  });

  /* A page kept for the back button comes back exactly as it was left, so
     nothing stays open on the way out. */
  window.addEventListener("pagehide", () => {
    closeDropdowns();
    if (nav.hasAttribute("data-open")) setOpen(false);
  });

  /* Solid bar once the page has moved, so the links stay legible over whatever
     section has scrolled under them. */
  const onScroll = () => {
    nav.toggleAttribute("data-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}
