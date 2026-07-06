import type { Attachment } from "svelte/attachments";
import { on } from "svelte/events";

interface ShortcutOptions {
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
  /** Platform-aware modifier: meta on macOS, ctrl elsewhere. Overrides ctrl/meta. */
  mod?: boolean;
  /** Listen on window instead of the node. */
  global?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  /** Ignore keypresses originating from form fields. */
  ignoreInputs?: boolean;
  enabled?: boolean;
}

const ignoredElements = new Set(["INPUT", "TEXTAREA", "SELECT"]);

const isMac = typeof navigator !== "undefined" && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

/**
 * Attachment that clicks the node when the given key (+ modifiers) is pressed.
 *
 * ```svelte
 * <button {@attach shortcut('k', { mod: true })}>Search</button>
 * ```
 */
export function shortcut(key: string, options: ShortcutOptions = {}): Attachment<HTMLElement> {
  const {
    ctrl = false,
    shift = false,
    alt = false,
    meta = false,
    mod = false,
    global: isGlobal = true,
    preventDefault = true,
    stopPropagation = false,
    ignoreInputs = true,
    enabled = true,
  } = options;

  return (node) => {
    if (!enabled) return;

    const normalized = key.toLowerCase();

    function handler(event: KeyboardEvent) {
      if (event.key.toLowerCase() !== normalized) return;
      if (event.shiftKey !== shift) return;
      if (event.altKey !== alt) return;

      if (mod) {
        // mod maps to meta on macOS, ctrl elsewhere
        if (!(isMac ? event.metaKey : event.ctrlKey)) return;
      } else {
        if (event.ctrlKey !== ctrl) return;
        if (event.metaKey !== meta) return;
      }

      if (ignoreInputs && ignoredElements.has((event.target as HTMLElement).tagName)) return;

      if (preventDefault) event.preventDefault();
      if (stopPropagation) event.stopPropagation();
      node.click();
    }

    return isGlobal ? on(window, "keydown", handler) : on(node, "keydown", handler);
  };
}
