/**
 * Wraps each button's label so it can step aside on hover (see "Buttons" in
 * `parallel.css`). A button whose markup already has the wrapper is left alone,
 * and one this never reaches still works: its arrow just arrives beside a label
 * that stays put.
 */
export function initButtons(root: ParentNode = document) {
  for (const button of root.querySelectorAll<HTMLElement>(".btn")) {
    if (button.querySelector(":scope > .btn_label")) continue;
    const label = document.createElement("span");
    label.className = "btn_label";
    label.append(...button.childNodes);
    button.append(label);
  }
}
