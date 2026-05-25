import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';

const UNFOCUSABLE_ATTRIBUTES = new Set(['disabled', 'hidden', 'aria-hidden']);
const FOCUSABLE_SELECTORS = [
	'a[href]',
	'area[href]',
	'input:not([disabled])',
	'select:not([disabled])',
	'textarea:not([disabled])',
	'button:not([disabled])',
	'iframe',
	'object',
	'embed',
	'[tabindex]:not([tabindex="-1"])',
	'[contenteditable]'
].join(', ');

type BehaviorTokens = 'toolbar' | 'menu' | 'menubar' | 'listbox' | 'tablist' | 'radiogroup';
type AxisTokens = 'block' | 'inline';
type Wrap = 'wrap' | 'nowrap';

interface FocusGroupOptions {
	/**
	 * Defines the roving focus behavior to apply. This is dependent on the type of group you are implementing, such as a toolbar or menu. The behavior will determine how focus moves between elements when using arrow keys, and how the first and last elements are handled.
	 */
	behavior: BehaviorTokens;
	axis?: AxisTokens;
	/**
	 * Defines whether focus should wrap around when reaching the first or last element. If set to 'wrap', pressing the right arrow key on the last element will move focus to the first element, and pressing the left arrow key on the first element will move focus to the last element. If set to 'nowrap', focus will not move when reaching the first or last element. The default value is determined by the behavior, but can be overridden by setting this option explicitly.
	 */
	wrap?: Wrap;
	/**
	 * When enabled, the focus group will remember the last focused element and return focus to it when the group is re-focused.
	 * This behavior is enabled by default, and is recommended for most use cases. However, it can be disabled if you want the focus to always start on the first element when the group is focused.
	 */
	memory?: boolean;
}

const BLOCK_KEYS = new Set(['ArrowDown', 'ArrowUp']);
const INLINE_KEYS = new Set(['ArrowLeft', 'ArrowRight']);
const META_KEYS = new Set(['Home', 'End']);

/**
 * Per the spec, certain behavior tokens carry an inferred child role for <button> elements
 * (and generic elements) that lack an explicit role attribute. toolbar has no inferred child role.
 * Variant types (menuitemcheckbox, menuitemradio, radio) must be set explicitly by the author.
 *
 * @see https://open-ui.org/components/scoped-focusgroup.explainer/#supported-behaviors
 */
const inferredChildRoles = new Map<BehaviorTokens, string | null>([
	['toolbar', null],
	['tablist', 'tab'],
	['radiogroup', 'radio'],
	['listbox', 'option'],
	['menu', 'menuitem'],
	['menubar', 'menuitem']
]);

const defaultOptions = new Map<BehaviorTokens, Omit<FocusGroupOptions, 'behavior'>>([
	[
		'toolbar',
		{
			axis: 'inline'
		}
	],
	[
		'tablist',
		{
			axis: 'inline',
			wrap: 'wrap'
		}
	],
	[
		'menu',
		{
			axis: 'block',
			wrap: 'wrap'
		}
	],
	[
		'menubar',
		{
			axis: 'inline',
			wrap: 'wrap'
		}
	],
	[
		'listbox',
		{
			axis: 'block'
		}
	],
	[
		'radiogroup',
		{
			wrap: 'wrap'
		}
	]
]);

/**
 * Implement roving focus behavior for a group of elements, such as a toolbar or menu. This function takes inspiration from the `focusgroup` proposal
 * in the Open UI spec, but is adapted to fit Svelte's attachment system and reactivity model. It manages focus within a container element, allowing users to navigate between focusable child elements using arrow keys, while also supporting features like focus memory and optional wrapping.
 * @param options - Configuration options for the focus group behavior, including the type of behavior (e.g., 'toolbar', 'menu'), axis of navigation, wrapping behavior, and focus memory.
 * @returns An attachment function that can be used to apply the focus group behavior to a container element in Svelte.
 * @see https://open-ui.org/components/scoped-focusgroup.explainer/
 */
export function focusgroup<const T extends FocusGroupOptions>(options: T): Attachment<HTMLElement> {
	// memory defaults to true per spec
	const mergedOptions = { memory: true, ...defaultOptions.get(options.behavior), ...options };
	let lastFocused: HTMLElement | null = $state.raw(null);

	return (node) => {
		if (!node) return;

		// Scope queries to this node only, evaluated fresh each time to handle dynamic children
		function getFocusableElements(): HTMLElement[] {
			const elements = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS));
			if (!elements.length)
				console.warn(
					'focusgroup: No focusable elements found within the container. Please ensure that there are focusable elements (e.g., buttons, links) inside the focus group container.'
				);
			return elements.filter(
				(el) => ![...UNFOCUSABLE_ATTRIBUTES].some((attr) => el.hasAttribute(attr))
			);
		}

		// Roving tabindex: one item gets tabindex="0", all others get tabindex="-1"
		function updateTabIndex(activeEl: HTMLElement | null): void {
			getFocusableElements().forEach((el) => {
				el.setAttribute('tabindex', el === activeEl ? '0' : '-1');
			});
		}

		assignRoles();

		if (!node.hasAttribute('role')) {
			node.setAttribute('role', mergedOptions.behavior);
		}

		// Child role inference: per spec, <button> elements (and generic elements) without an
		// explicit role receive the inferred child role for this behavior. Elements with an
		// explicit role that doesn't match produce a dev warning (variant types like
		// menuitemcheckbox/menuitemradio must be set explicitly and are silently accepted).
		function assignRoles() {
			const inferredRole = inferredChildRoles.get(mergedOptions.behavior) ?? null;
			if (inferredRole === null) return;

			for (const el of getFocusableElements()) {
				const explicit = el.getAttribute('role');
				if (!explicit) {
					if (el.tagName === 'BUTTON' || el.tagName === 'DIV' || el.tagName === 'SPAN') {
						el.setAttribute('role', inferredRole);
					}
				} else if (explicit !== inferredRole && !explicit.startsWith(inferredRole)) {
					console.warn(
						`focusgroup: Expected child role "${inferredRole}" for behavior "${mergedOptions.behavior}" but found "${explicit}" on`,
						el
					);
				}
			}
		}

		// Initialize tabindex without stealing focus
		const initialActive =
			mergedOptions.memory && lastFocused && node.contains(lastFocused)
				? lastFocused
				: (getFocusableElements()[0] ?? null);
		updateTabIndex(initialActive);

		function onKeydown(event: KeyboardEvent): void {
			const target = event.target as HTMLElement;
			if (!node.contains(target)) return;

			// Preserve modifier+arrow platform shortcuts per spec
			if (event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;

			const filteredElements = getFocusableElements();
			const currentIndex = filteredElements.indexOf(target);
			if (currentIndex === -1) return;

			const isBlock = mergedOptions.axis === 'block';
			const isInline = mergedOptions.axis === 'inline';

			let nextIndex: number | null = null;

			if (isBlock && BLOCK_KEYS.has(event.key)) {
				nextIndex = event.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
			} else if (isInline && INLINE_KEYS.has(event.key)) {
				nextIndex = event.key === 'ArrowRight' ? currentIndex + 1 : currentIndex - 1;
			} else if (META_KEYS.has(event.key)) {
				nextIndex = event.key === 'Home' ? 0 : filteredElements.length - 1;
			}

			if (nextIndex !== null) {
				event.preventDefault();
				if (mergedOptions.wrap === 'wrap') {
					nextIndex = (nextIndex + filteredElements.length) % filteredElements.length;
				} else {
					nextIndex = Math.max(0, Math.min(nextIndex, filteredElements.length - 1));
				}
				const nextEl = filteredElements[nextIndex];
				nextEl.focus();
				updateTabIndex(nextEl);
				if (mergedOptions.memory) {
					lastFocused = nextEl;
				}
			}
		}

		// Track focus changes from mouse/pointer so tabindex stays in sync
		function onFocusin(event: FocusEvent): void {
			const target = event.target as HTMLElement;
			if (node.contains(target)) {
				updateTabIndex(target);
				if (mergedOptions.memory) {
					lastFocused = target;
				}
			}
		}

		on(node, 'keydown', onKeydown);
		on(node, 'focusin', onFocusin);
	};
}
