<script lang="ts">
	import DialogRoot from '$components/Dialog/Dialog.svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		open?: boolean;
		children?: Snippet;
	}

	let { open = $bindable(false), children: childrenProp }: Props = $props();
</script>

<DialogRoot
	bind:open
	lightDismiss
	class="command-palette-dialog"
	--dialog-max-width="38rem"
	--dialog-padding="0"
>
	{@render childrenProp?.()}
</DialogRoot>

<style>
	:global(dialog.command-palette-dialog:modal) {
		margin-block-start: 10vh;
		margin-inline: auto;
	}
</style>
