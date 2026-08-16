<script lang="ts">
	import type { Snippet } from 'svelte';
	import CheckIcon from '~icons/lucide/check';
	import { ComboboxState, getGroupContext, type Item } from './combobox.svelte.js';

	interface Props {
		children?: Snippet;
		value: Item;
		/** Extra terms the fuzzy filter should match against, e.g. synonyms. */
		keywords?: string[];
		disabled?: boolean;
		class?: string;
	}

	let { children, value, keywords = [], disabled = false, class: className }: Props = $props();

	const combobox = ComboboxState.get();
	const groupId = getGroupContext();
	const id = $props.id();

	$effect(() =>
		combobox.registerItem(id, { value, keywords, disabled, groupId: groupId ?? undefined })
	);

	const selected = $derived(combobox.isSelected(value));
	const highlighted = $derived(combobox.highlighted === id);
</script>

<!--
	No interactive element inside: `role="option"` may not contain a button or a
	link. Keyboard users never reach this node — focus stays in the input and
	`aria-activedescendant` points here — so the click handler is mouse-only and
	needs no key handler of its own. Cancelling pointerdown is what keeps that
	true: without it a mouse click blurs the input and the next keypress is lost.
-->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<li
	{id}
	role="option"
	class={['combobox-item', className]}
	hidden={!combobox.isVisible(id)}
	aria-selected={selected}
	aria-disabled={disabled || undefined}
	data-highlighted={highlighted || undefined}
	onpointerdown={(event) => event.preventDefault()}
	onclick={() => combobox.selectItem(id)}
	onpointermove={() => !disabled && (combobox.highlighted = id)}
>
	{@render children?.()}

	{#if selected}
		<CheckIcon class="combobox-item-indicator" aria-hidden="true" />
	{/if}
</li>

<style>
	.combobox-item {
		--_combobox-item-padding: var(--combobox-item-padding, 0.5rem 0.75rem);
		--_combobox-item-border-radius: var(--combobox-item-border-radius, 0.375rem);
		--_combobox-item-gap: var(--combobox-item-gap, 0.5rem);

		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--_combobox-item-gap);
		padding: var(--_combobox-item-padding);
		border-radius: var(--_combobox-item-border-radius);
		list-style: none;
		cursor: pointer;
		scroll-margin-block: var(--combobox-item-scroll-margin, 0.25rem);

		/* our `display: flex` outranks the UA stylesheet's rule for [hidden] */
		&[hidden] {
			display: none;
		}

		&[data-highlighted] {
			background-color: var(--combobox-item-highlighted-background, var(--clr-surface-200));
		}

		&[aria-disabled] {
			opacity: var(--combobox-item-disabled-opacity, 0.5);
			cursor: not-allowed;
		}
	}
</style>
