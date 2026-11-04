/**
 * The margin sum on the Upwork page.
 *
 * The page sells taking work off someone's hands, and the only number that
 * decides it is what's left for him. So the page does the sum in front of him
 * rather than asking him to book a call to find out — and, since what he is
 * buying is Webflow and automation work, the page doing something useful is
 * the argument.
 *
 * The prices live on the options themselves, put there by the page from
 * `src/data/upwork.ts`. Nothing about the numbers is written twice.
 */

export function initMarginCalculator() {
  const root = document.querySelector<HTMLElement>("[data-margin]");
  if (!root) return;

  const job = root.querySelector<HTMLSelectElement>("[data-margin-job]");
  const charge = root.querySelector<HTMLInputElement>("[data-margin-charge]");
  const keep = root.querySelector<HTMLElement>("[data-margin-keep]");
  const share = root.querySelector<HTMLElement>("[data-margin-share]");
  const hours = root.querySelector<HTMLElement>("[data-margin-hours]");
  const ours = root.querySelector<HTMLElement>("[data-margin-ours]");
  if (!job || !charge || !keep || !share || !hours || !ours) return;

  const money = new Intl.NumberFormat(root.dataset.locale || undefined, {
    style: "currency",
    currency: root.dataset.currency || "EUR",
    maximumFractionDigits: 0,
  });

  /** An unset price is a dash rather than a zero, which would read as free. */
  const EMPTY = "—";

  /* Most keystrokes leave most figures as they were, and rewriting one would
     still send the browser back to lay it out. */
  const write = (el: HTMLElement, text: string) => {
    if (el.textContent !== text) el.textContent = text;
  };

  const update = () => {
    const option = job.selectedOptions[0];
    const price = Number(option?.dataset.price ?? 0);
    const jobHours = Number(option?.dataset.hours ?? 0);
    const charged = Number(charge.value);

    write(hours, jobHours ? `${jobHours} hours` : EMPTY);
    write(ours, price ? money.format(price) : EMPTY);

    if (!price || !(charged > 0)) {
      write(keep, EMPTY);
      write(share, EMPTY);
      return;
    }

    const left = charged - price;
    write(keep, money.format(left));
    /* Of what he invoices, not of what he pays us: it is his margin he is
       weighing, and a negative one is worth showing as plainly as a good one. */
    write(share, `${Math.round((left / charged) * 100)}%`);
  };

  job.addEventListener("change", update);
  charge.addEventListener("input", update);
  update();
}
