<script lang="ts">
	import { InputGroup } from '$lib/components/form/InputGroup';
	import Button from '$ui/Button/Button.svelte';
	import { Input } from '$ui/Form/Input';
	import UpDownIcon from '~icons/lucide/chevrons-up-down';
	import XIcon from '~icons/lucide/x';
	import Badge from '$ui/Badge/Badge.svelte';
	import { ComboboxState, type Item } from './combobox.svelte.js';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Set when a visible <label> elsewhere already renders the name. */
		labelledby?: string;
		placeholder?: string;
		/** Custom chip content for a selected value; defaults to its label. */
		chip?: Snippet<[Item]>;
		[key: string]: unknown;
	}

	let { labelledby, placeholder, chip, ...rest }: Props = $props();

	const combobox = ComboboxState.get();
	const listboxId = $derived(combobox.listbox?.id);
</script>

<div class="combobox-input" data-multiple={combobox.multiple}>
	<InputGroup.Root class="combobox-input-group">
		<div class="chips">
			{#if combobox.multiple}
				{#each combobox.values as value (value)}
					<Badge>
						{#if chip}{@render chip(value)}{:else}{combobox.labelFor(value)}{/if}
						<!--
							Outside the listbox, so this button is legal here — it is the chip
							that owns it, not an option. Backspace covers the keyboard path,
							which is why it stays out of the tab order.
						-->
						<button
							type="button"
							class="chip-remove"
							tabindex="-1"
							aria-label="Remove {combobox.labelFor(value)}"
							onclick={() => combobox.deselect(value)}
						>
							<XIcon />
						</button>
					</Badge>
				{/each}
			{/if}
			<Input
				type="text"
				size={1}
				role="combobox"
				aria-label={labelledby ? undefined : combobox.label}
				aria-labelledby={labelledby}
				{placeholder}
				autocomplete="off"
				autocorrect="off"
				spellcheck={false}
				aria-expanded={combobox.isOpen}
				aria-controls={listboxId}
				aria-autocomplete="list"
				aria-activedescendant={combobox.isOpen ? combobox.highlighted : undefined}
				bind:ref={combobox.input}
				bind:value={combobox.query}
				oninput={() => combobox.open()}
				onclick={() => combobox.open()}
				onkeydown={(e) => combobox.onkeydown(e)}
			/>
		</div>
		{#if !combobox.multiple}
			<InputGroup.Addon align="inline-end" --input-group-addon-background="white">
				<!-- `rest` carries popovertarget; adding our own toggle here would undo it -->
				<Button {...rest} type="button" tabindex={-1} aria-label="Toggle options">
					<UpDownIcon />
				</Button>
			</InputGroup.Addon>
		{/if}
	</InputGroup.Root>
</div>

<style>
	.combobox-input :global(.combobox-input-group) {
		anchor-name: --combobox-input;
	}

	.combobox-input {
		--_combobox-chip-gap: var(--combobox-chip-gap, 0.25rem);
		--_combobox-chips-padding: var(--combobox-chips-padding, 0.25rem);
		--_combobox-input-min-width: var(--combobox-input-min-width, 10ch);

		/* the group hands its padding to the input; we want it on .chips instead */
		--input-group-padding: var(--combobox-input-padding, 0.25rem 0.5rem);

		max-width: var(--combobox-max-width, 20rem);
		flex: 1;
	}

	/* the chip row fills the group and wraps; the input is the flexible tail */
	.chips {
		/* inherited by the badges */
		--badge-background: var(--combobox-chip-background, var(--clr-surface-200));
		--badge-color: var(--combobox-chip-color, var(--clr-surface-900));
		--badge-border-radius: var(--combobox-chip-border-radius, 4px);
		--badge-padding: var(--combobox-chip-padding, 0.15em 0.4em);
		--badge-font-size: var(--combobox-chip-font-size, var(--fs-300));

		--input-background: transparent;
		--input-background-hover: transparent;

		display: flex;
		flex: 1;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--_combobox-chip-gap);
		min-width: 0;
		padding: var(--_combobox-chips-padding);
	}

	.chips :global(input) {
		/* min-width:auto + the ~20ch intrinsic size is what stops a bare input from
		   shrinking at all; size={1} handles that everywhere, field-sizing is the
		   progressive enhancement (~83%: no Firefox, recent Safari only) that also
		   lets it grow past the flex basis as you type */
		field-sizing: content;
		flex: 1 1 var(--_combobox-input-min-width);
		min-width: var(--_combobox-input-min-width);
	}

	.chip-remove {
		display: grid;
		place-items: center;
		padding: 0;
		border: none;
		background: none;
		color: inherit;
		cursor: pointer;
		opacity: var(--combobox-chip-remove-opacity, 0.6);

		&:hover {
			opacity: var(--combobox-chip-remove-hover-opacity, 1);
		}
	}
</style>
