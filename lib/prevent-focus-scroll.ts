import type { MouseEvent } from "react";

/**
 * Use as button `onMouseDown` so clicks do not move focus in a way that scrolls
 * the page (common with sticky headers or long tool layouts).
 */
export function preventFocusScrollOnMouseDown(
  event: MouseEvent<HTMLButtonElement>,
) {
  event.preventDefault();
  event.currentTarget.focus({ preventScroll: true });
}
