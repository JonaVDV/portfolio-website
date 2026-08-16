import { createContext, tick } from 'svelte';
import { SvelteMap, SvelteSet } from 'svelte/reactivity';
import { computeCommandScore } from '$lib/components/command/search.js';

const [getContext, setContext] = createContext<ComboboxState>();
export const [getGroupContext, setGroupContext] = createContext<string | undefined>();

export type Item = string | number;

/**
 * Returns a relevance score for an item; `0` filters it out. Mirrors Base UI's
 * `filter` prop. Defaults to the same fuzzy scorer the Command palette uses.
 */
export type ComboboxFilter = (value: string, query: string, keywords: string[]) => number;

export type ComboboxOptions = {
	multiple?: boolean;
	filter?: ComboboxFilter;
	/** Accessible name, shared by the input and the listbox it controls. */
	label?: string;
	/**
	 * The bound selection, read live. The combobox keeps no copy of it — whatever
	 * owns the prop (a `$bindable`, a superforms field) stays the single source of
	 * truth, so an externally set value shows up without a sync effect.
	 */
	value?: Item | Item[] | undefined;
	setValue?: (value: Item | Item[] | undefined) => void;
	/**
	 * Turns a value into its display label — what the chips show, what the
	 * single-select input echoes, and what the filter matches against. Without
	 * it a numeric id would leak into all three. Read live, so a lookup backed
	 * by async-loaded data corrects itself once the data lands.
	 */
	itemToString?: (value: Item) => string;
};

interface ItemData {
	id: string;
	value: Item;
	keywords: string[];
	disabled: boolean;
	groupId?: string;
	index: number;
}

export class ComboboxState {
	/** The popover element holding the listbox. */
	listbox = $state<HTMLElement | null>(null);
	/** The text input, so `aria-activedescendant` has an owner. */
	input = $state<HTMLInputElement | null>(null);
	/** Free text typed by the user; the filter query. */
	query = $state('');

	#options: ComboboxOptions;
	/** `aria-activedescendant` — virtual focus, real focus stays in the input. */
	#highlighted = $state('');

	#items = new SvelteMap<string, ItemData>();
	#groups = new SvelteMap<string, SvelteSet<string>>();
	#nextIndex = 0;

	constructor(options: ComboboxOptions = {}) {
		this.#options = options;
	}

	static create(options: ComboboxOptions = {}) {
		return setContext(new this(options));
	}

	static get() {
		return getContext();
	}

	get multiple() {
		return this.#options.multiple ?? false;
	}

	get label() {
		return this.#options.label;
	}

	/** Display label for a value; falls back to the value itself. */
	labelFor(value: Item) {
		return this.#options.itemToString?.(value) ?? String(value);
	}

	// ---------------------------------------------------------------- filtering

	/**
	 * Ids of the items matching the current query, in registration (visual) order.
	 * We filter but deliberately do not reorder — reordering options under a
	 * typing user is what makes fuzzy pickers feel unpredictable.
	 */
	#matches = $derived.by(() => {
		const filter = this.#options.filter ?? computeCommandScore;
		const query = this.query.trim();
		const ids = new SvelteSet<string>();

		for (const [id, item] of this.#items) {
			if (!query || filter(this.labelFor(item.value).trim(), query, item.keywords) > 0) {
				ids.add(id);
			}
		}
		return ids;
	});

	/** Ids that are both visible and selectable, used for keyboard traversal. */
	#navigable = $derived(
		[...this.#items.values()]
			.filter((item) => this.#matches.has(item.id) && !item.disabled)
			.sort((a, b) => a.index - b.index)
			.map((item) => item.id)
	);

	isVisible(id: string) {
		return this.#matches.has(id);
	}

	/** A group hides itself when the query filtered away all of its items. */
	isGroupVisible(groupId: string) {
		const ids = this.#groups.get(groupId);
		if (!ids) return false;
		return [...ids].some((id) => this.#matches.has(id));
	}

	get isEmpty() {
		return this.#matches.size === 0;
	}

	// ------------------------------------------------------------- registration

	registerItem(id: string, item: Omit<ItemData, 'id' | 'index'>) {
		this.#items.set(id, { ...item, id, index: this.#nextIndex++ });

		if (item.groupId) {
			if (!this.#groups.has(item.groupId)) this.#groups.set(item.groupId, new SvelteSet());
			this.#groups.get(item.groupId)?.add(id);
		}

		return () => {
			this.#items.delete(id);
			if (item.groupId) this.#groups.get(item.groupId)?.delete(id);
			if (this.#highlighted === id) this.#highlighted = '';
		};
	}

	registerGroup(id: string) {
		if (!this.#groups.has(id)) this.#groups.set(id, new SvelteSet());
		return () => this.#groups.delete(id);
	}

	// ---------------------------------------------------------------- highlight

	/** Falls back to the first navigable item so Enter always has a target. */
	get highlighted() {
		if (this.#highlighted && this.#navigable.includes(this.#highlighted)) {
			return this.#highlighted;
		}
		return this.#navigable[0] ?? '';
	}

	set highlighted(id: string) {
		this.#highlighted = id;
	}

	async #move(direction: 1 | -1) {
		const ids = this.#navigable;
		if (!ids.length) return;

		const next = ids.indexOf(this.highlighted) + direction;
		this.#highlighted = ids.at(next % ids.length) ?? ids[0];

		await tick();
		document.getElementById(this.#highlighted)?.scrollIntoView({ block: 'nearest' });
	}

	// ---------------------------------------------------------------- selection

	selectItem(id: string) {
		const item = this.#items.get(id);
		if (!item || item.disabled) return;

		if (!this.multiple) {
			this.value = item.value;
			this.query = this.labelFor(item.value);
			this.close();
			return;
		}

		const selected = this.values;
		this.#options.setValue?.(
			this.isSelected(item.value)
				? selected.filter((existing) => String(existing) !== String(item.value))
				: [...selected, item.value]
		);
		// the chip now carries the selection, so the query starts over
		this.query = '';
	}

	deselect(item: Item | undefined) {
		this.#options.setValue?.(this.values.filter((value) => String(value) !== String(item)));
	}

	/** Compared as strings: a `<select>` round-trips numeric ids as text. */
	isSelected(item: Item | undefined) {
		if (this.multiple) return this.values.some((value) => String(value) === String(item));
		return this.value !== undefined && String(this.value) === String(item);
	}

	get value() {
		return this.#options.value as Item | undefined;
	}

	set value(value: Item | undefined) {
		this.#options.setValue?.(value);
	}

	/** Always an array, whatever shape the bound value arrives in. */
	get values(): Item[] {
		const value = this.#options.value;
		if (Array.isArray(value)) return value;
		return value === undefined || value === '' ? [] : [value];
	}

	#open = $state(false);

	get isOpen() {
		return this.#open;
	}
	onToggle(event: ToggleEvent) {
		this.#open = event.newState === 'open';
		if (!this.#open) this.#highlighted = '';
	}

	/**
	 * `toggle` is dispatched asynchronously, so calls we make ourselves set the
	 * flag up front — otherwise `aria-expanded` trails the popover by a task.
	 */
	open() {
		this.listbox?.showPopover();
		this.#open = true;
	}

	close() {
		this.listbox?.hidePopover();
		this.#open = false;
		this.#highlighted = '';
	}

	/**
	 * Runs on the input. Focus never leaves it, so every key the listbox needs has
	 * to be handled here and forwarded via `aria-activedescendant`.
	 */
	onkeydown(event: KeyboardEvent) {
		// NOTE we do not need escape handling because the popover closes on escape by default,
		switch (event.key) {
			case 'ArrowDown':
			case 'ArrowUp':
				event.preventDefault();
				if (!this.isOpen) return this.open();
				this.#move(event.key === 'ArrowDown' ? 1 : -1);
				break;
			case 'Home':
				if (!this.isOpen) return;
				event.preventDefault();
				this.#highlighted = this.#navigable[0] ?? '';
				break;
			case 'End':
				if (!this.isOpen) return;
				event.preventDefault();
				this.#highlighted = this.#navigable.at(-1) ?? '';
				break;
			case 'Enter':
				if (!this.isOpen || !this.highlighted) return;
				event.preventDefault();
				this.selectItem(this.highlighted);
				break;
			case 'Backspace':
				if (this.multiple && !this.query) this.deselect(this.values.at(-1));
				break;
		}
	}
}
