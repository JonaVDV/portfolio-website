<script lang="ts" generics="T extends readonly unknown[]">
	import Popover from '$ui/Popover/popover.svelte';
	import type { ComponentProps, Snippet } from 'svelte';
	import {
		ComboboxState,
		setGroupContext,
		type ComboboxFilter,
		type Item
	} from './combobox.svelte.js';

	interface Props {
		items: T;
		/** Accessible name for the whole widget — names the input and the listbox. */
		label: string;
		trigger?: ComponentProps<typeof Popover>['trigger'];
		children?: Snippet<[T]>;
		position?: string;
		multiple?: boolean;
		name?: string;
		/** Shown instead of the list while `loading` is true. */
		loading?: boolean;
		pending?: Snippet;
		/** Shown when the query matches nothing. */
		empty?: Snippet;
		/** Custom relevance scorer; return 0 to filter an item out. */
		filter?: ComboboxFilter;
		/**
		 * Value → display label, for values that aren't their own label (numeric
		 * ids). Drives the chips, the single-select input text, and the filter.
		 */
		itemToString?: (value: Item) => string;
		/** Selections are whatever the `Combobox.Item`s carry as `value`, not `items` entries. */
		value?: Item | Item[] | undefined;
	}

	let {
		items,
		label,
		trigger: triggerProp,
		children,
		position,
		multiple,
		name,
		loading = false,
		pending,
		empty,
		filter,
		itemToString,
		value = $bindable()
	}: Props = $props();

	// seed the group context so items used outside a ComboboxGroup still resolve it
	setGroupContext(undefined);

	const combobox = ComboboxState.create({
		get multiple() {
			return multiple;
		},
		get filter() {
			return filter;
		},
		get label() {
			return label;
		},
		get value() {
			return value;
		},
		setValue: (next) => (value = next),
		get itemToString() {
			return itemToString;
		}
	});

	// Single select shows its value as the input text. Only re-runs when the value
	// changes from outside, so it never fights the user mid-type.
	$effect(() => {
		if (!multiple) combobox.query = value === undefined ? '' : combobox.labelFor(value as Item);
	});
</script>

<Popover
	bind:ref={combobox.listbox}
	ontoggle={(e) => combobox.onToggle(e)}
	{position}
	hasArrow={false}
	// --popover-width="anchor-size()"
	--custom-anchor="--combobox-input"
>
	{#snippet trigger({ props })}
		{@render triggerProp?.({ props })}
	{/snippet}

	{#if loading}
		<div class="combobox-status" role="status">
			{#if pending}{@render pending()}{:else}Loading…{/if}
		</div>
	{:else}
		<ul
			class="combobox-content layout"
			role="listbox"
			aria-label={label}
			aria-multiselectable={multiple || undefined}
		>
			{@render children?.(items)}
		</ul>

		{#if combobox.isEmpty}
			<div class="combobox-empty" role="status">
				{#if empty}{@render empty()}{:else}No items found{/if}
			</div>
		{/if}
	{/if}

	{#each combobox.values as selected (selected)}
		<input type="hidden" {name} value={selected} />
	{/each}
</Popover>

<style>
	.combobox-content {
		margin: 0;
		padding: 0;
		list-style: none;
		max-block-size: var(--combobox-max-height, 18rem);
		overflow-y: auto;
		overscroll-behavior: contain;
	}

	.combobox-empty,
	.combobox-status {
		padding: var(--combobox-empty-padding, 0.75rem);
		color: var(--combobox-empty-color, var(--text-muted, currentColor));
		text-align: center;
	}
</style>
