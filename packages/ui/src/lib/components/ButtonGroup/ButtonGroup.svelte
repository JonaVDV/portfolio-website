<script lang="ts">
	let { children } = $props();
</script>

<div class="button-group | flex-group">
	{@render children?.()}
</div>

<style>
	.button-group {
		--flex-gap: var(--button-group-gap, 0rem);

		--button-border-radius: var(--button-group-border-radius, 0.5rem);
	}

	.button-group > :global(:is(button, a):is(:first-of-type)) {
		border-top-right-radius: 0;
		border-right-width: 0;
		border-bottom-right-radius: 0;
	}

	.button-group > :global(:is(button, a):is(:last-of-type)) {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	.button-group > :global(:is(button, a):is(:not(:first-of-type):not(:last-of-type))) {
		border-radius: 0;
		border-right-width: 0;
	}
</style>
