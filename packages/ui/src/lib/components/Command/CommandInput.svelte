<script lang="ts">
	import Button from '$components/Button/Button.svelte';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { CommandState } from './command.svelte';
	import * as InputGroup from '$components/Form/InputGroup';
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
			<!-- inlined lucide/search — keeps the package free of icon build tooling -->
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="1em"
				height="1em"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round"
				aria-hidden="true"
			>
				<circle cx="11" cy="11" r="8" />
				<path d="m21 21-4.3-4.3" />
			</svg>
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
					<!-- inlined lucide/x -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="1em"
						height="1em"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="M18 6 6 18" />
						<path d="m6 6 12 12" />
					</svg>
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
