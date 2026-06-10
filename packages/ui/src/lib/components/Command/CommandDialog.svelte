<script lang="ts">
	import Dialog from '$components/Dialog/Dialog.svelte';
	import type { ComponentProps } from 'svelte';

	// extends the dialog component to be used for the command palette, which will be built on top of the Command component

	interface Props extends ComponentProps<typeof Dialog> {}

	let { trigger: triggerProp, ref = $bindable(null), children: childrenProp, ...rest }: Props = $props();
</script>

<Dialog bind:ref lightDismiss {...rest}>
	{#snippet trigger(props)}
		{@render triggerProp?.(props)}
	{/snippet}

    {#snippet children(props)}
        {@render childrenProp?.(props)}
    {/snippet}
</Dialog>
