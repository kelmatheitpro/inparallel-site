import { CONTACT_EMAIL } from "@/consts.ts";

/** The "have a brief ready?" form in the footer. */
export function initBriefForm() {
  const form = document.querySelector<HTMLFormElement>("[data-brief]");
  const status = form?.querySelector<HTMLElement>("[data-brief-status]");
  const field = form?.querySelector<HTMLInputElement>("#brief-email");
  if (!form || !status || !field) return;

  /* The field points at the status line, so a screen reader reads out
     what's wrong with it when it's focused again. */
  if (!status.id) status.id = "brief-status";
  const say = (message: string, ok: boolean) => {
    status.textContent = message;
    status.toggleAttribute("data-ok", ok);
    status.toggleAttribute("data-error", !ok);
    if (ok) {
      field.removeAttribute("aria-invalid");
      field.removeAttribute("aria-describedby");
    } else {
      field.setAttribute("aria-invalid", "true");
      field.setAttribute("aria-describedby", status.id);
    }
  };

  const clear = () => {
    status.textContent = "";
    status.removeAttribute("data-ok");
    status.removeAttribute("data-error");
    field.removeAttribute("aria-invalid");
    field.removeAttribute("aria-describedby");
  };

  field.addEventListener("input", clear);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = field.value.trim();
    if (!email) {
      say("Add an email address so we can reply.", false);
      field.focus();
      return;
    }
    if (!field.checkValidity()) {
      say("That email address doesn't look right.", false);
      field.focus();
      return;
    }

    /* No endpoint is wired up yet, so the brief is handed to the visitor's mail
       client rather than posted somewhere it would be dropped. */
    const subject = encodeURIComponent("Brief for inParallel");
    const body = encodeURIComponent(`Reply to: ${email}\n\n`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    say("Opening your mail app — send it over and we'll reply today.", true);
    form.reset();
  });
}
