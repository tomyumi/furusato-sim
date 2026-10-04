import type { KeyboardEvent as ReactKeyboardEvent } from "react";

/** シミュレーター各ステップの入力欄。Enter で次欄／次ステップへ進む対象。 */
const FIELD_SELECTOR = [
  'input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="checkbox"]):not([type="radio"])',
  "select",
  "textarea",
].join(",");

function isUsableField(el: HTMLElement): boolean {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    if (el.disabled || el.readOnly) return false;
  } else if (el instanceof HTMLSelectElement) {
    if (el.disabled) return false;
  } else {
    return false;
  }
  if (el.getAttribute("aria-hidden") === "true") return false;
  return el.getClientRects().length > 0;
}

export function listAdvanceFields(root: ParentNode): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FIELD_SELECTOR)).filter(isUsableField);
}

function isComposingEnter(event: ReactKeyboardEvent | KeyboardEvent): boolean {
  if ("nativeEvent" in event) {
    return event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229;
  }
  return event.isComposing || event.keyCode === 229;
}

function shouldHandleEnter(event: ReactKeyboardEvent | KeyboardEvent): boolean {
  if (event.key !== "Enter") return false;
  if (event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) return false;
  if (isComposingEnter(event)) return false;
  const target = event.target;
  if (!(target instanceof HTMLElement)) return false;
  return target.matches(FIELD_SELECTOR);
}

export function handleEnterToAdvanceField(
  event: ReactKeyboardEvent | KeyboardEvent,
  root: ParentNode | null,
  onLastField: () => void,
): void {
  if (!shouldHandleEnter(event) || !root) return;
  event.preventDefault();

  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  const fields = listAdvanceFields(root);
  const index = fields.indexOf(target);
  const next = index >= 0 ? fields[index + 1] : undefined;
  if (next) {
    next.focus();
    if (next instanceof HTMLInputElement || next instanceof HTMLTextAreaElement) {
      next.select();
    }
    next.scrollIntoView({ block: "nearest", behavior: "smooth" });
    return;
  }
  onLastField();
}
