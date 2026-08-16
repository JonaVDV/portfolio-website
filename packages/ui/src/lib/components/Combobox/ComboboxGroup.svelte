<script lang="ts">
	import type { Snippet } from 'svelte';
	import { ComboboxState, setGroupContext } from './combobox.svelte.js';

	interface Props {
		children?: Snippet;
		/** Rendered as the group's accessible name; style it with --combobox-group-label-*. */
		label: string;
		class?: string;
	}

	let { children, label, class: className }: Props = $props();

	const combobox = ComboboxState.get();
	const id = $props.id();

	setGroupContext(id);

	$effect(() => combobox.registerGroup(id));
</script>

<!--
	`role="group"` inside a listbox, labelled by its own heading — no separate
	heading component needed, and no separator: use <Separator class="full" />
	between groups if you want a rule.
-->
<li role="presentation" class="combobox-group-wrapper" hidden={!combobox.isGroupVisible(id)}>
	<span id="{id}-label" class="combobox-group-label">{label}</span>
	<ul role="group" aria-labelledby="{id}-label" class={['combobox-group', className]}>
		{@render children?.()}
	</ul>
</li>

<style>
	.combobox-group-wrapper {
		display: grid;
		gap: var(--combobox-group-gap, 0.25rem);
		padding: var(--combobox-group-padding, 0.25rem 0);
		list-style: none;

		&[hidden] {
			display: none;
		}
	}

	.combobox-group-label {
		padding: var(--combobox-group-label-padding, 0 0.75rem);
		color: var(--combobox-group-label-color, var(--text-muted, currentColor));
		font-size: var(--combobox-group-label-font-size, var(--fs-300, 0.75rem));
		font-weight: var(--combobox-group-label-font-weight, var(--fw-medium, 500));
	}

	.combobox-group {
		display: grid;
		margin: 0;
		padding: 0;
		list-style: none;
	}
</style>
