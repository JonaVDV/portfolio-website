<script lang="ts">
	import SearchIcon from '~icons/lucide/search';
	import { InputGroup } from '$components/Form/InputGroup';
	import Input from '$components/Form/Input.svelte';
	import Button from '$components/Button';
	import XIcon from '~icons/lucide/x';
	import type { HTMLFormAttributes, HTMLInputAttributes } from 'svelte/elements';

	interface Props extends HTMLInputAttributes {
		ref?: HTMLElement | null;
		value?: string;
		action?: HTMLFormAttributes['action'];
		method?: HTMLFormAttributes['method'];
	}

	let {
		ref = $bindable(null),
		action,
		method,
		value = $bindable(''),
		...restProps
	}: Props = $props();
</script>

<div class="command-input">
	<form {action} {method}>
		<InputGroup.Root>
			<Input bind:value bind:ref {...restProps} />
			<InputGroup.Addon align="inline-start">
				<SearchIcon />
			</InputGroup.Addon>
			{#if value.trim() !== ''}
				<InputGroup.Addon align="inline-end">
					<Button type="reset" variant="stripped" onclick={() => (value = '')}>
						<XIcon />
						<span class="sr-only"> Clear input </span>
					</Button>
				</InputGroup.Addon>
			{/if}
		</InputGroup.Root>
	</form>
</div>
