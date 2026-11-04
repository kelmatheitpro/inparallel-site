import { CONTACT_EMAIL } from "@/consts.ts";

type Field = HTMLInputElement | HTMLTextAreaElement;

/** How the status line counts what's left to fix. */
const COUNT = ["", "One thing", "Two things", "Three things"];

/** The full enquiry form on /contact. */
export function initContactForm() {
  const form = document.querySelector<HTMLFormElement>("[data-contact]");
  const status = form?.querySelector<HTMLElement>("[data-contact-status]");
  if (!form || !status) return;

  const fields = [
    ...form.querySelectorAll<Field>("input[required], textarea[required]"),
  ];

  const say = (message: string, ok: boolean) => {
    status.textContent = message;
    status.toggleAttribute("data-ok", ok);
    status.toggleAttribute("data-error", !ok);
  };

  const quiet = () => {
    status.textContent = "";
    status.removeAttribute("data-ok");
    status.removeAttribute("data-error");
  };

  /* The form is `novalidate` so the messages come from here rather than from
     the browser's own bubbles, but the constraints still do the checking. The
     exception is spaces, which `required` would let through as an answer. */
  const problem = (field: Field) => {
    if (!field.value.trim()) return `Add ${field.dataset.field}.`;
    return field.validity.typeMismatch
      ? "That email address doesn't look right."
      : "";
  };

  const flag = (field: Field, message: string) => {
    const error = form.querySelector(`#${field.id}-error`);
    if (error) error.textContent = message;
    if (message) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
  };

  form.addEventListener("input", (event) => {
    const field = event.target as Field;
    /* A field someone is correcting stops being flagged as they type, and
       counts as visited from here on. */
    if (fields.includes(field)) {
      field.dataset.touched = "";
      flag(field, "");
    }
    quiet();
  });

  /* Leaving a field that was typed in says what's wrong with it there and then,
     rather than at the end of the form. An untouched one is left alone. */
  form.addEventListener("focusout", (event) => {
    const field = event.target as Field;
    if (fields.includes(field) && "touched" in field.dataset)
      flag(field, problem(field));
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const wrong = fields.filter((field) => problem(field));
    if (wrong.length) {
      for (const field of fields) flag(field, problem(field));
      /* The errors sit under their fields, which can be a screen away from
         this line on a phone, so it says how many and the focus goes there. */
      say(`${COUNT[wrong.length]} to fix above.`, false);
      wrong[0]?.focus();
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

    /* Not everyone has a mail app set up, and the page can't tell, so the
       address is right there for whoever nothing opened for. */
    say(
      `Opening your mail app. Send it from there and you'll usually hear back the same day. Nothing opened? Write to ${CONTACT_EMAIL}.`,
      true,
    );
  });
}
