<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Snippet } from 'svelte';

	interface Props extends HTMLAttributes<HTMLDivElement> {
		children?: Snippet;
		align?: 'inline-start' | 'inline-end' | 'block-start' | 'block-end';
	}

	let { children, align = 'inline-start', ...rest }: Props = $props();

	function gotoInput(e: MouseEvent) {
		const target = e.target as HTMLElement;
		const currentTarget = e.currentTarget as HTMLElement;
		if (target.closest('button')) return; // prevent focusing the input when clicking on a button inside the addon
		const input = currentTarget.parentElement?.querySelector<HTMLElement>('input, select');
		input?.focus();
	}
</script>

<div class={[rest.class, 'input-group-addon']} data-alignment={align} onclick={gotoInput} {...rest}>
	{@render children?.()}
</div>

<style>
	.input-group-addon {
		padding: var(--_input-group-padding);
		background: var(--input-group-addon-background, transparent);
		user-select: none;
		-webkit-user-drag: none;
		text-wrap-mode: nowrap;
	}

	[data-alignment='inline-start'] {
		padding-inline-end: 0;
		order: -1;
	}

	[data-alignment='inline-end'] {
		padding-inline-start: 0;
		order: 1;
	}

	[data-alignment='block-start'] {
		align-self: flex-start;
	}

	[data-alignment='block-end'] {
		align-self: flex-end;
	}
</style>
