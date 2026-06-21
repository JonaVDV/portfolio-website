<script lang="ts">
	import SearchIcon from '~icons/lucide/search';
	import Button from '$components/Button/Button.svelte';
	import XIcon from '~icons/lucide/x';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { CommandState } from './command.svelte';
	import { InputGroup } from '$components/Form/InputGroup';
	import { Input } from '$components/Form/Input';
	interface Props extends Omit<HTMLInputAttributes, 'type'> {
		ref?: HTMLInputElement | null;
		value?: string;
		placeholder?: string;
	}

	let { ref = $bindable(null), value = $bindable(''), placeholder, ...restProps }: Props = $props();

	const commandState = CommandState.get();
</script>

<div class="command-input">
	<InputGroup.Root>
		<InputGroup.Addon align="inline-start">
			<SearchIcon aria-hidden="true" />
		</InputGroup.Addon>
		<Input
			bind:ref
			bind:value={commandState.search}
			type="search"
			autocomplete="off"
			autocorrect="off"
			spellcheck={false}
			role="combobox"
			aria-expanded="true"
			aria-autocomplete="list"
			aria-activedescendant={commandState.selectedId}
			{placeholder}
			{...restProps}
			class="command-search-input"
		/>
		{#if commandState.search.trim() !== ''}
			<InputGroup.Addon align="inline-end">
				<Button type="button" variant="stripped" onclick={() => (commandState.search = '')}>
					<XIcon />
					<span class="sr-only">Clear input</span>
				</Button>
			</InputGroup.Addon>
		{/if}
	</InputGroup.Root>
</div>

<style>
	.command-input {
		padding: 0.25rem 0.5rem;
	}
</style>
