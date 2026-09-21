/**
 * Tab strips.
 *
 * Driven entirely by the markup `<Tabs>` renders — a `[data-tabs]` root, its
 * `[role="tab"]` buttons and the panels they name in `aria-controls` — so one
 * pass wires up every set on the page.
 */
export function initTabs(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLElement>("[data-tabs]").forEach((root) => {
    const tabs = [...root.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
    if (tabs.length < 2) return;

    const select = (next: HTMLButtonElement, moveFocus = true) => {
      tabs.forEach((tab) => {
        const selected = tab === next;
        tab.setAttribute("aria-selected", String(selected));
        tab.tabIndex = selected ? 0 : -1;

        const panel = document.getElementById(
          tab.getAttribute("aria-controls") ?? "",
        );
        if (panel) panel.hidden = !selected;
      });
      if (moveFocus) next.focus();
    };

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => select(tab, false));
    });

    /* Arrow keys move between tabs and open as they go, which is the expected
       behaviour for a tablist with automatic activation. */
    root.addEventListener("keydown", (event) => {
      const current = tabs.indexOf(document.activeElement as HTMLButtonElement);
      if (current === -1) return;

      const steps: Record<string, number> = {
        ArrowRight: 1,
        ArrowDown: 1,
        ArrowLeft: -1,
        ArrowUp: -1,
      };

      let next: number | undefined;
      const step = steps[event.key];
      if (step) next = (current + step + tabs.length) % tabs.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = tabs.length - 1;

      if (next === undefined) return;
      event.preventDefault();
      select(tabs[next]!);
    });
  });
}
