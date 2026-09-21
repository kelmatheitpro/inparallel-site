/**
 * The header: the mobile panel, the Services dropdown, and the solid-bar state
 * the overlapping nav takes once the page has moved.
 */
export function initNav() {
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  const toggle = nav?.querySelector<HTMLButtonElement>(".nav_toggle");
  if (!nav || !toggle) return;

  const dropdowns = [...nav.querySelectorAll<HTMLElement>("[data-dropdown]")];

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
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
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

  /* Matches the breakpoint where every link is shown in the bar anyway. */
  window.matchMedia("(width >= 62rem)").addEventListener("change", (event) => {
    if (event.matches) setOpen(false);
  });

  /* Solid bar once the page has moved, so the links stay legible over whatever
     section has scrolled under them. */
  const onScroll = () => {
    nav.toggleAttribute("data-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}
