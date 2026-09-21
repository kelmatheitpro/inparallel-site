import { CONTACT_EMAIL } from "@/consts.ts";

/** The full enquiry form on /contact. */
export function initContactForm() {
  const form = document.querySelector<HTMLFormElement>("[data-contact]");
  const status = form?.querySelector<HTMLElement>("[data-contact-status]");
  if (!form || !status) return;

  const say = (message: string, ok: boolean) => {
    status.textContent = message;
    status.toggleAttribute("data-ok", ok);
    status.toggleAttribute("data-error", !ok);
  };

  form.addEventListener("input", () => {
    if (!status.textContent) return;
    status.textContent = "";
    status.removeAttribute("data-ok");
    status.removeAttribute("data-error");
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    /* The form is `novalidate` so the messages come from here rather than from
       the browser's own bubbles, but the constraints still do the checking. */
    const invalid = form.querySelector<HTMLInputElement>(":invalid");
    if (invalid) {
      const label = form.querySelector(`label[for="${invalid.id}"]`);
      say(
        `Check the ${label?.textContent?.trim().toLowerCase() ?? "form"} field.`,
        false,
      );
      invalid.focus();
      return;
    }

    const data = new FormData(form);
    const value = (key: string) => String(data.get(key) ?? "").trim();

    /* No endpoint is wired up yet, so the enquiry is handed to the visitor's
       mail client rather than posted somewhere it would be dropped. */
    const subject = `Project enquiry — ${value("company") || value("name")}`;
    const body = [
      `Name: ${value("name")}`,
      `Email: ${value("email")}`,
      `Company: ${value("company") || "—"}`,
      `Service: ${value("service") || "Not sure yet"}`,
      `Budget: ${value("budget") || "—"}`,
      "",
      value("brief"),
    ].join("\n");

    window.location.href =
      `mailto:${CONTACT_EMAIL}` +
      `?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    say("Opening your mail app — send it and we'll reply today.", true);
  });
}
