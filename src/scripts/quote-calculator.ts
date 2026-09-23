/**
 * The estimator on the services page.
 *
 * The page sells a fixed price inside 24 hours, so making the visitor book a
 * call to hear a number would undercut the one promise it repeats. It does the
 * sum in front of him instead, and being a band rather than a figure is the
 * honest form for work nobody has scoped yet.
 *
 * Every number lives on the markup, put there by the page from
 * `src/data/services.ts`. Nothing about a price is written twice.
 */

export function initQuoteCalculator() {
  const root = document.querySelector<HTMLElement>("[data-quote]");
  if (!root) return;

  const pick = root.querySelector<HTMLSelectElement>("[data-quote-package]");
  const pages = root.querySelector<HTMLInputElement>("[data-quote-pages]");
  const collections = root.querySelector<HTMLInputElement>(
    "[data-quote-collections]",
  );
  const scope = root.querySelector<HTMLElement>("[data-quote-scope]");
  const pagesNote = root.querySelector<HTMLElement>("[data-quote-pages-note]");
  const collectionsNote = root.querySelector<HTMLElement>(
    "[data-quote-collections-note]",
  );
  const total = root.querySelector<HTMLElement>("[data-quote-total]");
  const unit = root.querySelector<HTMLElement>("[data-quote-unit]");
  const timeline = root.querySelector<HTMLElement>("[data-quote-timeline]");
  const timelineLabel = root.querySelector<HTMLElement>(
    "[data-quote-timeline-label]",
  );
  const summary = root.querySelector<HTMLElement>("[data-quote-summary]");
  if (!pick || !pages || !collections || !total || !timeline) return;

  const addOns = [
    ...root.querySelectorAll<HTMLInputElement>("[data-quote-addon]"),
  ];
  const lists = [
    ...root.querySelectorAll<HTMLElement>("[data-quote-includes]"),
  ];

  const money = new Intl.NumberFormat(root.dataset.locale || undefined, {
    style: "currency",
    currency: root.dataset.currency || "EUR",
    maximumFractionDigits: 0,
  });

  const perPage = Number(root.dataset.perPage ?? 0);
  const perCollection = Number(root.dataset.perCollection ?? 0);
  const spread = Number(root.dataset.spread ?? 1);

  /** An unpriced package is a dash rather than a zero, which would read free. */
  const EMPTY = "—";

  const num = (value: string | undefined) => Number(value ?? 0);

  /** Estimates are rounded so a band doesn't pretend to be a calculation. */
  const round = (value: number) => Math.round(value / 100) * 100;

  /**
   * A range that stays inside a fortnight reads as days, because that is how a
   * short job is quoted. Once the far end reaches two weeks everyone counts in
   * weeks — and so does the card for the same lane further up the page.
   */
  const duration = ([from, to]: [number, number]) => {
    if (!to) return EMPTY;
    if (to >= 14) {
      const weeks = (days: number) => Math.round(days / 7);
      return `${weeks(from)}–${weeks(to)} weeks`;
    }
    return `${from}–${to} days`;
  };

  const update = () => {
    const option = pick.selectedOptions[0];
    if (!option) return;

    const base = num(option.dataset.base);
    const monthly = option.dataset.unit === "month";

    /* A retainer is priced by the month, so page and collection counts have
       nothing to add to it. The inputs go rather than sit there ignored. */
    if (scope) scope.hidden = monthly;
    if (summary) summary.textContent = option.dataset.summary ?? "";

    lists.forEach((list) => {
      list.hidden = list.dataset.quoteIncludes !== option.value;
    });

    /* Switching package keeps whatever scope was typed — losing it would be
       worse than the mismatch. What changes is the note saying how much of it
       this package already covers, so the sum never looks arbitrary. */
    const pagesIncluded = num(option.dataset.pages);
    const collectionsIncluded = num(option.dataset.collections);
    if (pagesNote) pagesNote.textContent = `${pagesIncluded} included`;
    if (collectionsNote) {
      collectionsNote.textContent = `${collectionsIncluded} included`;
    }

    const extraPages = Math.max(0, Number(pages.value || 0) - pagesIncluded);
    const extraCollections = Math.max(
      0,
      Number(collections.value || 0) - collectionsIncluded,
    );

    let price = base;
    let from = num(option.dataset.daysMin);
    let to = num(option.dataset.daysMax);

    if (!monthly) {
      price += extraPages * perPage + extraCollections * perCollection;
    }

    addOns.forEach((addOn) => {
      if (!addOn.checked) return;
      price += num(addOn.dataset.price);
      if (!monthly) {
        const days = num(addOn.dataset.days);
        from += days;
        to += days;
      }
    });

    /* A package with no base price can still show a real timeline, so the two
       outputs are decided separately. */
    total.textContent = base
      ? `${money.format(round(price))}–${money.format(round(price * spread))}`
      : EMPTY;

    if (unit) unit.textContent = monthly ? "per month" : "for the project";

    /* A retainer has no handover to count towards, so the label under the
       figure changes with it rather than describing the wrong thing. */
    timeline.textContent = monthly ? "Ongoing" : duration([from, to]);
    if (timelineLabel) {
      timelineLabel.textContent = monthly
        ? "rolling monthly"
        : "start to handover";
    }
  };

  pick.addEventListener("change", update);
  pages.addEventListener("input", update);
  collections.addEventListener("input", update);
  addOns.forEach((addOn) => addOn.addEventListener("change", update));
  update();
}
